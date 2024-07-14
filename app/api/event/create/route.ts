// app/api/event/create/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { name, description, startTime, endTime, points, groupId, familyId } = await req.json();

  try {
    const event = await prisma.event.create({
      data: {
        name,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        points,
        group: {
          connect: { id: groupId }
        },
        family: {
          connect: { id: familyId }
        },
        creatorFamily: {
          connect: { id: familyId }
        },
        status: 'pending',
      },
    });

    await prisma.familyGroupPoints.upsert({
      where: {
        familyId_groupId: {
          familyId,
          groupId,
        },
      },
      update: {
        points: {
          decrement: points,
        },
      },
      create: {
        familyId,
        groupId,
        points: 0, // Start with 0 points if the record doesn't exist
      },
    });

    // If a new record was created, we need to decrement the points
    const familyGroupPoints = await prisma.familyGroupPoints.findUnique({
      where: {
        familyId_groupId: {
          familyId,
          groupId,
        },
      },
    });

    if (familyGroupPoints && familyGroupPoints.points === 0) {
      await prisma.familyGroupPoints.update({
        where: {
          familyId_groupId: {
            familyId,
            groupId,
          },
        },
        data: {
          points: {
            decrement: points,
          },
        },
      });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Error creating event' }, { status: 500 });
  }
}