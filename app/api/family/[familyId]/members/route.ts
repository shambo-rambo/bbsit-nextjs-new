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
    return NextResponse.json({ error: "You must be signed in to fetch family data." }, { status: 401 });
  }

  try {
    const familyId = params.familyId;
    console.log('Fetching family data for familyId:', familyId);  // Add this log

    // Fetching family data using Prisma
    const familyData = await prisma.family.findUnique({
      where: { id: familyId },
      include: {
        members: {
          select: { id: true, name: true, email: true, image: true }
        },
        children: true,
        groups: {
          include: {
            admin: true,
            events: {
              include: {
                creatorFamily: true
              }
            }
          }
        },
        adminOfGroups: true,
        participatingEvents: {
          include: {
            group: true,
            creatorFamily: true,
          }
        },
        createdEvents: {
          include: {
            group: true,
            family: true,
          }
        },
        invitations: true,
        groupPoints: true,
      },
    });

    if (!familyData) {
      console.log('Family not found for familyId:', familyId);  // Add this log
      return NextResponse.json({ error: "Family not found." }, { status: 404 });
    }

    console.log('Successfully fetched family data');  // Add this log
    return NextResponse.json(familyData);
  } catch (error) {
    console.error('Error fetching family data:', error);
  
    let errorMessage = 'Failed to fetch family data.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
  
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}