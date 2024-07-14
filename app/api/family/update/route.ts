// app/api/family/update/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await req.json();
  const { familyId, name, homeAddress, children } = body;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { family: true },
    });

    if (!user || !user.family || user.family.id !== familyId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updatedFamily = await prisma.family.update({
      where: { id: familyId },
      data: {
        name,
        homeAddress,
        children: {
          upsert: children.map((child: { id?: string, name: string }) => ({
            where: { id: child.id || '' },
            update: { name: child.name },
            create: { name: child.name },
          })),
        },
      },
      include: {
        members: true,
        children: true,
      },
    });

    return NextResponse.json(updatedFamily);
  } catch (error) {
    console.error("Error updating family:", error);
    return new NextResponse('Error updating family', { status: 500 });
  }
}