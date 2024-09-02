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
    // Use params.familyId instead of familyId
    const familyData = await prisma.family.findUnique({
      where: { id: params.familyId },
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
      cacheStrategy: { swr: 60, ttl: 60 } // Adding cache strategy for caching data
    });

    if (!familyData) {
      return NextResponse.json({ error: "Family not found." }, { status: 404 });
    }

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
