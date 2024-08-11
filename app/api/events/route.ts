// app/api/events/route.ts

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
    const events = await prisma.event.findMany({
      where: {
        groupId: groupId,
        OR: [
          { familyId: familyId },
          { creatorFamilyId: familyId },
          { status: 'open' }
        ]
      },
      include: {
        family: {
          select: {
            id: true,
            name: true,
            image: true,
            members: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        creatorFamily: {
          select: {
            id: true,
            name: true,
            image: true,
            members: {
              select: {
                id: true,
                name: true,
              },
            },
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

    console.log('Fetched events:', JSON.stringify(events, null, 2));  // Log fetched events

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Error fetching events' }, { status: 500 });
  }
}