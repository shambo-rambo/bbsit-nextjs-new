import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { generateInviteCode } from '@/lib/utils';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { name, description } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { family: true },
    });

    if (!user || !user.family) {
      return NextResponse.json({ error: 'User or family not found' }, { status: 404 });
    }

    // Safely access user.family since we've confirmed it's not null above
    const familyId = user.family.id;

    // Use a transaction to ensure all operations are performed consistently
    const updatedGroup = await prisma.$transaction(async (tx) => {
      // Create the group
      const group = await tx.group.create({
        data: {
          name,
          description,
          adminId: familyId,
          inviteCode: generateInviteCode(),
          members: {
            connect: { id: familyId }
          },
        },
      });

      // Create FamilyGroupPoints entry
      await tx.familyGroupPoints.create({
        data: {
          familyId: familyId,
          groupId: group.id,
          points: 10,  // Initial points for creating the group
        },
      });

      // Fetch the updated group with all related data
      return await tx.group.findUnique({
        where: { id: group.id },
        include: {
          admin: true,
          members: true,
          familyPoints: true,
        },
      });
    });

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ error: 'Error creating group' }, { status: 500 });
  }
}
