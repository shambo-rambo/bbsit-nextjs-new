// app/api/group/[groupId]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req: Request, { params }: { params: { groupId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { groupId } = params;

  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        admin: true,
        members: true,
        events: {
          include: {
            family: true,
            creatorFamily: true,
            group: true,
          }
        },
        familyPoints: true,
      }
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error('Error fetching group details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
