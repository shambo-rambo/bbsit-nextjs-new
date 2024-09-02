import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { EventStatus } from '@prisma/client';

export async function POST(req: Request, { params }: { params: { eventId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Use the Prisma Accelerate transaction client
    const result = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: params.eventId },
        include: { family: true, group: true }
      });

      if (!event) {
        throw new Error('Event not found');
      }

      if (!session.user.email || typeof session.user.email !== 'string') {
        throw new Error('User email is not available');
      }

      const user = await tx.user.findUnique({
        where: { email: session.user.email },
        include: { family: true }
      });

      if (!user || !user.family) {
        throw new Error('User or family not found');
      }

      if (event.creatorFamilyId !== user.family.id && event.familyId !== user.family.id) {
        throw new Error('Not authorized to cancel this event');
      }

      if (event.status === EventStatus.PAST) {
        throw new Error('Cannot cancel a past event');
      }

      // Deduct points from the family who accepted the event
      if (event.status === EventStatus.ACCEPTED && event.familyId !== event.creatorFamilyId) {
        await tx.familyGroupPoints.updateMany({
          where: {
            familyId: event.familyId,
            groupId: event.groupId,
          },
          data: {
            points: {
              decrement: event.points,
            },
          },
        });
      }

      console.log('Attempting to cancel event');
      const updatedEvent = await tx.event.update({
        where: { id: params.eventId },
        data: { 
          status: EventStatus.PENDING,
          familyId: event.creatorFamilyId,
          acceptedByName: null, // Clear the accepted by name when cancelling
        },
        include: { family: true }
      });

      return updatedEvent;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error canceling event:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error canceling event' }, { status: 500 });
  }
}
