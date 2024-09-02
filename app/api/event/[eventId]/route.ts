import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { EventStatus } from '@prisma/client';

export async function DELETE(req: Request, { params }: { params: { eventId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Fetch the event
      const event = await tx.event.findUnique({
        where: { id: params.eventId },
        include: { family: true, group: true }
      });

      if (!event) {
        throw new Error('Event not found');
      }

      // Check if the user is authorized to delete the event
      if (!session.user.email) {
        throw new Error('User email is not available');
      }
      const user = await tx.user.findUnique({
        where: { email: session.user.email },
        include: { family: true }
      });
      if (!user || !user.family || user.family.id !== event.creatorFamilyId) {
        throw new Error('Not authorized to delete this event');
      }

      // If the event was accepted by a family other than the creator
      if (event.status === EventStatus.ACCEPTED && event.familyId !== event.creatorFamilyId) {
        console.log('Deducting points from accepting family');
        // Deduct points from the accepting family
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

      // Do not return points to the creator family if the event is PAST
      if (event.status !== EventStatus.PAST) {
        console.log('Returning points to creator family');
        await tx.familyGroupPoints.update({
          where: {
            familyId_groupId: {
              familyId: event.creatorFamilyId, 
              groupId: event.groupId,
            },
          },
          data: {
            points: {
              increment: event.points, 
            },
          },
        });
      }

      // Delete the event
      await tx.event.delete({
        where: { id: params.eventId },
      });

      return { message: 'Event deleted successfully and points adjusted' };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting event:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error deleting event' }, { status: 500 });
  }
}
