// app/api/group/create/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { generateInviteCode } from '@/lib/utils';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { name, description } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { family: true },
    });

    if (!user || !user.family) {
      return NextResponse.json({ error: 'User or family not found' }, { status: 404 });
    }

    const group = await prisma.group.create({
      data: {
        name,
        description,
        adminId: user.family.id,
        inviteCode: generateInviteCode(),
        members: {
          connect: { id: user.family.id }
        },
      },
    });

    // Create FamilyGroupPoints entry
    await prisma.familyGroupPoints.create({
      data: {
        familyId: user.family.id,
        groupId: group.id,
        points: 10,  // Initial points for creating the group
      },
    });

    const updatedGroup = await prisma.group.findUnique({
      where: { id: group.id },
      include: {
        admin: true,
        members: true,
        familyPoints: true,
      },
    });

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ error: 'Error creating group' }, { status: 500 });
  }
}