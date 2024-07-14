// app/api/family/create/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "You must be signed in to create a family." }, { status: 401 });
  }

  const { userId, partnerEmail, familyName, homeAddress, childrenNames } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { family: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.family) {
      return NextResponse.json({ error: "User already belongs to a family." }, { status: 400 });
    }

    const family = await prisma.family.create({
      data: {
        name: familyName,
        homeAddress,
        currentAdminId: userId,
        members: {
          connect: { id: userId }
        },
        children: {
          create: childrenNames.map((name: string) => ({ name }))
        }
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { 
        familyId: family.id,
        isAdmin: true
      }
    });

    if (partnerEmail) {
      // Handle partner invitation logic here
      // For example:
      // await sendInvitation(partnerEmail, family.id);
    }

    return NextResponse.json({ ...family, adminId: userId });
  } catch (error) {
    console.error('Error creating family:', error);
    return NextResponse.json({ error: "Failed to create family." }, { status: 500 });
  }
}