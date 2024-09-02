import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || typeof session.user.email !== 'string') {
    return NextResponse.json({ error: 'Not authenticated or email is missing' }, { status: 401 });
  }

  const { inviteeEmail } = await req.json();

  try {
    const inviter = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { family: true },
      cacheStrategy: { swr: 60, ttl: 60 } // Adding cache strategy for caching data
    });

    if (!inviter) {
      return NextResponse.json({ error: 'Inviter not found' }, { status: 404 });
    }

    if (!inviter.family) {
      return NextResponse.json({ error: 'Inviter does not have a family' }, { status: 404 });
    }

    // Always create an invitation
    const invitation = await prisma.invitation.create({
      data: {
        inviterFamilyId: inviter.family.id,
        inviteeEmail: inviteeEmail,
        status: 'pending',
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    });

    // Check if the invitee is an existing user
    const invitee = await prisma.user.findUnique({ 
      where: { email: inviteeEmail },
      cacheStrategy: { swr: 60, ttl: 60 } // Adding cache strategy for caching data
    });

    if (invitee) {
      // Create a notification for existing users
      await prisma.notification.create({
        data: {
          userId: invitee.id,
          type: 'FAMILY_INVITATION',
          content: `You have been invited to join ${inviter.family.name}`,
          isRead: false,
        }
      });
    }

    return NextResponse.json(invitation);
  } catch (error) {
    console.error('Error sending invitation:', error);
    return NextResponse.json({ error: 'Error sending invitation' }, { status: 500 });
  }
}
