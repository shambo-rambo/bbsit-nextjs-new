import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(
  req: NextRequest,
  { params }: { params: { familyId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "You must be signed in to fetch family members." }, { status: 401 });
  }

  try {
    const familyId = params.familyId;

    const familyMembers = await prisma.user.findMany({
      where: { familyId: familyId },
      select: { id: true, name: true },
    });

    return NextResponse.json({ members: familyMembers });
  } catch (error) {
    console.error('Error fetching family members:', error);
    return NextResponse.json({ error: "Failed to fetch family members." }, { status: 500 });
  }
}