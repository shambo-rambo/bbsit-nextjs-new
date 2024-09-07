// app/api/family/[familyId]/members/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(
  req: NextRequest,
  { params }: { params: { familyId: string } }
) {
  console.log('API route accessed. Request URL:', req.url);
  console.log('API route accessed. Params:', params);
  
  const session = await getServerSession(authOptions);
  console.log('Session user:', session?.user);

  if (!session || !session.user) {
    console.log('No session or user found');
    return NextResponse.json({ error: "You must be signed in to fetch family data." }, { status: 401 });
  }

  try {
    // Use the family ID from the session instead of the URL parameter
    const familyId = session.user.familyId;
    console.log('Fetching family data for familyId:', familyId);

    if (!familyId) {
      console.log('User does not belong to a family');
      return NextResponse.json({ error: "You do not have a family associated with your account." }, { status: 404 });
    }

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
      console.log('Family not found for familyId:', familyId);
      return NextResponse.json({ error: "Family not found." }, { status: 404 });
    }

    console.log('Successfully fetched family data');
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