import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function DELETE(req: Request, { params }: { params: { groupId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    if (!session.user.email) {
      return NextResponse.json({ error: 'Email not found in session' }, { status: 404 });
    }
    
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
      return NextResponse.json({ error: 'Not authorized to delete this group' }, { status: 403 });
    }

    // Delete related records
    await prisma.familyGroupPoints.deleteMany({
      where: { groupId: params.groupId },
    });

    await prisma.event.deleteMany({
      where: { groupId: params.groupId },
    });

    // Delete the group
    await prisma.group.delete({
      where: { id: params.groupId },
    });

    return NextResponse.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error);
    return NextResponse.json({ error: 'Error deleting group' }, { status: 500 });
  }
}