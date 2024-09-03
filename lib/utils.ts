import prisma from '@/lib/prisma';
import { EventStatus } from '@prisma/client';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateInviteCode(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function updatePastEvents() {
  const now = new Date();

  try {
    const updatedEvents = await prisma.event.updateMany({
      where: {
        endTime: { lt: now },
        status: { not: EventStatus.PAST }
      },
      data: { status: EventStatus.PAST }
    });

    console.log(`Updated ${updatedEvents.count} past events`);

    // Handle points for past pending events
    const pastPendingEvents = await prisma.event.findMany({
      where: {
        endTime: { lt: now },
        status: EventStatus.PENDING
      }
    });

    for (const event of pastPendingEvents) {
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

      // Update the event status to PAST
      await prisma.event.update({
        where: { id: event.id },
        data: { status: EventStatus.PAST }
      });
    }

    console.log(`Processed points for ${pastPendingEvents.length} past pending events`);

    return { updatedCount: updatedEvents.count, processedPendingCount: pastPendingEvents.length };
  } catch (error) {
    console.error('Error updating past events:', error);
    throw error;
  }
}