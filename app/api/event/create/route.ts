import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { EventStatus } from '@prisma/client';

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
        status: EventStatus.PENDING,
      },
    });

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: { include: { members: true } } },
    });

    if (group) {
      const notifications = group.members.flatMap(family =>
        family.members.map(member => ({
          userId: member.id,
          type: 'new_event',
          content: `"${name}" has been created in "${group.name}"`,
          linkedId: groupId,
        }))
      );

      await prisma.notification.createMany({
        data: notifications,
      });
    }

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
        points: -points, // Start with negative points if the record doesn't exist
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Error creating event' }, { status: 500 });
  }
}
