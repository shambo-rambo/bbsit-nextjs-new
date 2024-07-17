import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function DELETE(req: Request, { params }: { params: { eventId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Fetch the event
      const event = await prisma.event.findUnique({
        where: { id: params.eventId },
        include: { family: true, group: true }
      });

      if (!event) {
        throw new Error('Event not found');
      }

      // Log event details for debugging
      console.log('Event status:', event.status);
      console.log('Event familyId:', event.familyId);
      console.log('Event creatorFamilyId:', event.creatorFamilyId);
      console.log('Event points:', event.points);

      // If the event was accepted by a family other than the creator
      if (event.status === 'accepted' && event.familyId !== event.creatorFamilyId) {
        console.log('Deducting points from accepting family');
        // Deduct points from the accepting family
        await prisma.familyGroupPoints.updateMany({
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

      // Return points to the creator family
      console.log('Returning points to creator family');
      await prisma.familyGroupPoints.update({
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

      // Delete the event
      await prisma.event.delete({
        where: { id: params.eventId },
      });

      return { message: 'Event deleted successfully and points adjusted' };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Error deleting event' }, { status: 500 });
  }
}