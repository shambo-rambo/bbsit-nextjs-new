// app/api/group/join/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { inviteCode } = await req.json() as { inviteCode: string };

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { family: true },
    });

    if (!user || !user.family) {
      return NextResponse.json({ error: 'User or family not found' }, { status: 404 });
    }

    const group = await prisma.group.findUnique({
      where: { inviteCode },
      include: { members: true },
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    if (user.family) {
      const familyId = user.family.id;
      if (group.members.some(member => member.id === familyId)) {
        return NextResponse.json({ error: 'Family is already a member of this group' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.group.update({
        where: { id: group.id },
        data: {
          members: {
            connect: { id: user.family.id }
          }
        }
      }),
      prisma.familyGroupPoints.create({
        data: {
          familyId: user.family.id,
          groupId: group.id,
          points: 10  // Initial points for joining the group
        }
      })
    ]);

    const updatedGroup = await prisma.group.findUnique({
      where: { id: group.id },
      include: {
        members: true,
        familyPoints: true,
      }
    });

    if (!updatedGroup) {
      throw new Error('Failed to retrieve updated group');
    }

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error('Error joining group:', error);
    return NextResponse.json({ error: 'Error joining group' }, { status: 500 });
  }
}