// bbsit-deploy/app/api/event/[eventId]/update-status/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Prisma, PrismaClient } from '@prisma/client';

type TransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export async function POST(req: Request, { params }: { params: { eventId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { status, memberId, memberName } = body;

  if (!status) {
    return NextResponse.json({ error: 'Missing status' }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx: TransactionClient) => {
      const event = await tx.event.findUnique({
        where: { id: params.eventId },
        include: { family: true, group: true, creatorFamily: true }
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

      let updateData: Prisma.EventUpdateInput = {};
      
      if (status === 'accepted') {
        updateData = {
          status,
          family: { connect: { id: user.family.id } },
          acceptedByName: memberName
        };
      } else if (status === 'rejected') {
        updateData = {
          rejectedFamilies: {
            push: user.family.id
          }
        };
      }

      const updatedEvent = await tx.event.update({
        where: { id: params.eventId },
        data: updateData,
        include: {
          family: {
            include: {
              members: true
            }
          },
          creatorFamily: {
            include: {
              members: true
            }
          },
          group: true
        }
      });

      if (status === 'accepted') {
        await tx.familyGroupPoints.upsert({
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