// app/api/events/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get('groupId');
  const familyId = searchParams.get('familyId');

  if (!groupId || !familyId) {
    return NextResponse.json({ error: 'Missing groupId or familyId' }, { status: 400 });
  }

  try {
    const now = new Date();

    // Update past events
    await prisma.event.updateMany({
      where: {
        endTime: { lt: now },
        status: { in: ['PENDING', 'ACCEPTED'] }
      },
      data: { status: 'PAST' }
    });

    // Return points for past events
    const pastEvents = await prisma.event.findMany({
      where: {
        endTime: { lt: now },
        status: 'PAST',
        familyId: familyId
      }
    });

    for (const event of pastEvents) {
      await prisma.family.update({
        where: { id: event.familyId },
        data: { points: { increment: event.points } }
      });
    }

    const events = await prisma.event.findMany({
      where: {
        groupId: groupId,
        OR: [
          { familyId: familyId },
          { creatorFamilyId: familyId },
          { status: 'PENDING' }
        ]
      },
      select: {
        id: true,
        name: true,
        description: true,
        startTime: true,
        endTime: true,
        points: true,
        status: true,
        acceptedByName: true,
        creatorFamilyId: true,
        familyId: true,
        family: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        creatorFamily: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // Add additional information to each event
    const enhancedEvents = events.map(event => ({
      ...event,
      isCreator: event.creatorFamilyId === familyId,
      canAccept: event.status === 'PENDING' && event.creatorFamilyId !== familyId,
    }));

    return NextResponse.json(enhancedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Error fetching events' }, { status: 500 });
  }
}