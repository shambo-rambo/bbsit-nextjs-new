// app/api/user/delete/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/lib/prisma';

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { family: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Start a transaction to ensure all operations are completed or none
    await prisma.$transaction(async (prisma) => {
      // If user is the last member of a family, delete the family
      if (user.family) {
        const familyMembers = await prisma.user.count({
          where: { familyId: user.family.id },
        });

        if (familyMembers === 1) {
          // Delete all family-related data
          await prisma.child.deleteMany({ where: { familyId: user.family.id } });
          await prisma.invitation.deleteMany({ where: { inviterFamilyId: user.family.id } });
          await prisma.family.delete({ where: { id: user.family.id } });
        } else {
          // Remove user from family
          await prisma.user.update({
            where: { id: user.id },
            data: { familyId: null, isAdmin: false },
          });
        }
      }

      // Delete user's notifications
      await prisma.notification.deleteMany({
        where: { userId: user.id },
      });

      // Delete user's invitations
      await prisma.invitation.deleteMany({
        where: { inviteeEmail: user.email },
      });

      // Finally, delete the user
      await prisma.user.delete({
        where: { id: user.id },
      });
    });

    return NextResponse.json({ message: 'User and related data deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}