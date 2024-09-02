import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { family: true },
      cacheStrategy: { swr: 60, ttl: 60 } // Adding cache strategy for caching data
    });

    return NextResponse.json({ hasFamily: !!user?.family });
  } catch (error) {
    return NextResponse.json({ error: 'Error checking partner' }, { status: 500 });
  }
}
