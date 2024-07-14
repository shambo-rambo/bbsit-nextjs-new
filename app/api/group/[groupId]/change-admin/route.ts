import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: Request, { params }: { params: { groupId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { newAdminId } = await req.json();

  try {
    if (!session.user.email) {
      return NextResponse.json({ error: 'Email not provided' }, { status: 400 });
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
      return NextResponse.json({ error: 'Not authorized to change admin for this group' }, { status: 403 });
    }

    const updatedGroup = await prisma.group.update({
      where: { id: params.groupId },
      data: { adminId: newAdminId },
    });

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error('Error changing group admin:', error);
    return NextResponse.json({ error: 'Error changing group admin' }, { status: 500 });
  }
}