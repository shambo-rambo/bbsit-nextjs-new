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

    // Update past events and return points for pending events
    const updatedEvents = await prisma.event.updateMany({
      where: {
        endTime: { lt: now },
        status: { in: ['PENDING', 'ACCEPTED'] }
      },
      data: { status: 'PAST' }
    });

    // Return points for past events that were pending
    const pastPendingEvents = await prisma.event.findMany({
      where: {
        endTime: { lt: now },
        status: 'PAST',
        creatorFamilyId: familyId
      }
    });

    for (const event of pastPendingEvents) {
      await prisma.family.update({
        where: { id: event.creatorFamilyId },
        data: { points: { increment: event.points } }
      });

      // Update FamilyGroupPoints
      await prisma.familyGroupPoints.update({
        where: {
          familyId_groupId: {
            familyId: event.creatorFamilyId,
            groupId: event.groupId
          }
        },
        data: {
          points: { increment: event.points }
        }
      });
    }

    // Fetch events
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

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Error fetching events' }, { status: 500 });
  }
}