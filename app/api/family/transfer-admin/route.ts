import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { familyId, newAdminId } = await req.json();

  try {
    const family = await prisma.family.findUnique({
      where: { id: familyId },
      include: { members: true },
      cacheStrategy: { swr: 60, ttl: 60 } // Adding cache strategy for caching data
    });

    if (!family) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    if (family.currentAdminId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    if (!family.members.some(member => member.id === newAdminId)) {
      return NextResponse.json({ error: 'New admin must be a family member' }, { status: 400 });
    }

    await prisma.family.update({
      where: { id: familyId },
      data: { currentAdminId: newAdminId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error transferring admin rights:', error);
    return NextResponse.json({ error: 'Error transferring admin rights' }, { status: 500 });
  }
}
