import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || typeof session.user.email !== 'string') {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      cacheStrategy: { swr: 60, ttl: 60 } // Adding cache strategy for caching data
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const [invitations, totalCount] = await prisma.$transaction([
      prisma.invitation.findMany({
        where: { 
          inviteeEmail: user.email,
          status: 'pending'
        },
        include: { inviterFamily: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.invitation.count({
        where: { 
          inviteeEmail: user.email,
          status: 'pending'
        },
      }),
    ]);

    return NextResponse.json({
      invitations,
      totalCount,
      hasMore: skip + limit < totalCount,
    });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json({ error: 'Error fetching invitations' }, { status: 500 });
  }
}
