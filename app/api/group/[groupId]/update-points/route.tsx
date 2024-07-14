// app/api/group/[groupId]/update-points/route.tsx

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: Request, { params }: { params: { groupId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  const { memberId, points } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { family: true },
    });

    if (!user || !user.family) {
      return NextResponse.json({ error: 'User or family not found' }, { status: 404 });
    }

    const group = await prisma.group.findUnique({
      where: { id: params.groupId },
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    if (group.adminId !== user.family.id) {
      return NextResponse.json({ error: 'Not authorized to update points in this group' }, { status: 403 });
    }

    const updatedFamilyGroupPoints = await prisma.familyGroupPoints.upsert({
      where: {
        familyId_groupId: {
          familyId: memberId,
          groupId: params.groupId,
        },
      },
      update: { points: points },
      create: {
        familyId: memberId,
        groupId: params.groupId,
        points: points,
      },
    });

    return NextResponse.json(updatedFamilyGroupPoints);
  } catch (error) {
    console.error('Error updating family group points:', error);
    return NextResponse.json({ error: 'Error updating family group points' }, { status: 500 });
  }
}