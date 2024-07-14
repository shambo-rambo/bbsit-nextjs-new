// app/api/event/[eventId]/update-status/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: Request, { params }: { params: { eventId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { status, action } = await req.json();

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const event = await prisma.event.findUnique({
        where: { id: params.eventId },
        include: { family: true, group: true, creatorFamily: true }
      });

      if (!event) {
        throw new Error('Event not found');
      }
      
      if (!session.user.email || typeof session.user.email !== 'string') {
        throw new Error('User email is not available');
      }
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { family: true }
      });

      if (!user || !user.family) {
        throw new Error('User or family not found');
      }

      let updateData: any = {};
      
      if (action === 'reject') {
        updateData = {
          rejectedFamilies: {
            push: user.family.id
          }
        };
      } else if (action === 'unreject') {
        updateData = {
          rejectedFamilies: {
            set: event.rejectedFamilies.filter(id => id !== user.family?.id ?? 'fallbackId')
                    }
        };
      } else if (status === 'accepted') {
        updateData = {
          status,
          familyId: user.family.id
        };
      }

      const updatedEvent = await prisma.event.update({
        where: { id: params.eventId },
        data: updateData,
        include: { family: true, creatorFamily: true }
      });

      if (status === 'accepted') {
        await prisma.familyGroupPoints.upsert({
          where: {
            familyId_groupId: {
              familyId: user.family.id,
              groupId: event.groupId,
            },
          },
          update: {
            points: {
              increment: event.points,
            },
          },
          create: {
            familyId: user.family.id,
            groupId: event.groupId,
            points: event.points,
          },
        });
      }

      return updatedEvent;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating event status:', error);
    return NextResponse.json({ error: 'Error updating event status' }, { status: 500 });
  }
}