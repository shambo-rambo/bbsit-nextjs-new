// bbsit-deploy/app/api/event/[eventId]/update-status/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Prisma, PrismaClient } from '@prisma/client';

type TransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export async function POST(req: Request, { params }: { params: { eventId: string } }) {
  console.log('Received request for eventId:', params.eventId);

  try {
    await prisma.$connect();
    console.log('Database connected successfully');

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.log('Authentication failed');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
      console.log('Received body:', body);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { status, memberId, memberName } = body;

    if (!status || !memberId || !memberName) {
      console.log('Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const MAX_RETRIES = 3;
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        console.log('Starting database transaction');
        const result = await prisma.$transaction(async (tx: TransactionClient) => {
          console.log('Fetching event');
          const event = await tx.event.findUnique({
            where: { id: params.eventId },
            include: { family: true, group: true, creatorFamily: true }
          });

          if (!event) {
            console.log('Event not found');
            throw new Error('Event not found');
          }
          
          console.log('Fetching user');
          const user = await tx.user.findUnique({
            where: { email: session.user.email as string },
            include: { family: true }
          });

          if (!user || !user.family) {
            console.log('User or family not found');
            throw new Error('User or family not found');
          }

          console.log('Updating event');
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

        console.log('Transaction completed successfully');
        return NextResponse.json(result);
      } catch (error) {
        console.error(`Attempt ${retries + 1} failed:`, error);
        retries++;
        if (retries === MAX_RETRIES) {
          throw error; // Rethrow the error if all retries failed
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
      }
    }
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Detailed error in update-status:', error);
    return NextResponse.json({ 
      error: 'Error updating event status', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : 'Stack trace hidden in production'
    }, { status: 500 });
  }
}