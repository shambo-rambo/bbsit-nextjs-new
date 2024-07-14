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

  const { memberId } = await req.json();

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
      include: { members: true },
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    if (group.adminId !== user.family.id) {
      return NextResponse.json({ error: 'Not authorized to remove members from this group' }, { status: 403 });
    }

    if (group.adminId === memberId) {
      return NextResponse.json({ error: 'Cannot remove the group admin' }, { status: 400 });
    }

    const updatedGroup = await prisma.group.update({
      where: { id: params.groupId },
      data: {
        members: {
          disconnect: { id: memberId },
        },
      },
      include: { members: true },
    });

    // Remove FamilyGroupPoints entry
    await prisma.familyGroupPoints.delete({
      where: {
        familyId_groupId: {
          familyId: memberId,
          groupId: params.groupId,
        },
      },
    });

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error('Error removing member from group:', error);
    return NextResponse.json({ error: 'Error removing member from group' }, { status: 500 });
  }
}