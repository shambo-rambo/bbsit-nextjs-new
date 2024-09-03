import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { updatePastEvents } from '@/lib/utils';

export async function GET(req: Request, { params }: { params: { eventId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Update past events before fetching the event
    await updatePastEvents();

    const event = await prisma.event.findUnique({
      where: { id: params.eventId },
      include: {
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
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Error fetching event' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { eventId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Update past events before processing the update
    await updatePastEvents();

    const eventId = params.eventId;
    const body = await req.json();

    // Fetch the current event
    const currentEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: { family: true, group: true }
    });

    if (!currentEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if the user is authorized to update the event
    if (!session.user.email) {
      return NextResponse.json({ error: 'User email is not available' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { family: true }
    });
    if (!user || !user.family || user.family.id !== currentEvent.creatorFamilyId) {
      return NextResponse.json({ error: 'Not authorized to update this event' }, { status: 403 });
    }

    // Fields that can be updated
    const updatableFields = ['name', 'description', 'startTime', 'endTime', 'points', 'status'];
    const updateData: any = {};

    updatableFields.forEach(field => {
      if (field in body) {
        updateData[field] = body[field];
      }
    });

    // Special handling for status changes
    if ('status' in updateData) {
      // Add any specific logic for status changes here
      // For example, you might want to restrict certain status transitions
    }

    // Perform the update
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Error updating event' }, { status: 500 });
  }
}