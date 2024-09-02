import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const { invitationId, userId, accept } = await req.json();

  try {
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: { inviterFamily: true }, // Changed from family to inviterFamily
      cacheStrategy: { swr: 60, ttl: 60 } // Adding cache strategy for caching data
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { family: true },
      cacheStrategy: { swr: 60, ttl: 60 } // Adding cache strategy for caching data
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already belongs to a family
    if (user.familyId && accept) {
      // If user is accepting and already has a family, return an error
      return NextResponse.json({ error: 'User already belongs to a family' }, { status: 400 });
    }

    if (accept) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { familyId: invitation.inviterFamilyId }  // Changed from familyId to inviterFamilyId
        }),
        prisma.invitation.update({
          where: { id: invitationId },
          data: { status: 'accepted' }
        })
      ]);
    } else {
      await prisma.invitation.update({
        where: { id: invitationId },
        data: { status: 'declined' }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error responding to invitation:', error);
    return NextResponse.json({ error: 'Error responding to invitation' }, { status: 500 });
  }
}
