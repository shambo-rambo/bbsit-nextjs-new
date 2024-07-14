// app/api/user/groups/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || typeof session.user.email !== 'string') {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        family: {
          include: {
            groups: true
          }
        }
      }
    });

    if (!user || !user.family) {
      return NextResponse.json({ error: 'User or family not found' }, { status: 404 });
    }

    const groups = user.family.groups;
    return NextResponse.json(groups);
  } catch (error) {
    console.error('Error fetching user groups:', error);
    return NextResponse.json({ error: 'Error fetching user groups' }, { status: 500 });
  }
}