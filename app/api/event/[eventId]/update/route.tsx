// app/api/event/[eventId]/update/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function PUT(req: Request, { params }: { params: { eventId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || typeof session.user.email !== 'string') {
    return NextResponse.json({ error: 'Not authenticated or email is missing' }, { status: 401 });
  }

  const { name, description, startTime, endTime, points, groupId, familyId } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { family: true },
    });

    if (!user || !user.family) {
      return NextResponse.json({ error: 'User or family not found' }, { status: 404 });
    }

    const event = await prisma.event.findUnique({
      where: { id: params.eventId },
      include: { group: true },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.creatorFamilyId !== user.family.id) {
      return NextResponse.json({ error: 'Not authorized to update this event' }, { status: 403 });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: params.eventId },
      data: {
        name,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        points,
        groupId,
        familyId,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Error updating event' }, { status: 500 });
  }
}