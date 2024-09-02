import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "You must be signed in to create a family." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const userId = formData.get('userId') as string;
    const partnerEmail = formData.get('partnerEmail') as string;
    const familyName = formData.get('familyName') as string;
    const homeAddress = formData.get('homeAddress') as string;
    const childrenNames = JSON.parse(formData.get('childrenNames') as string);
    const imageFile = formData.get('image') as File | null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { family: true },
      cacheStrategy: { swr: 60, ttl: 60 } // Adding cache strategy for caching data
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.family) {
      return NextResponse.json({ error: "User already belongs to a family." }, { status: 400 });
    }

    let imageUrl: string | undefined;

    if (imageFile) {
      try {
        const { url } = await put(imageFile.name, imageFile, { access: 'public' });
        imageUrl = url;
      } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json({ error: "Failed to upload image." }, { status: 500 });
      }
    }

    const createData: any = {
      name: familyName,
      homeAddress,
      currentAdminId: userId,
      members: {
        connect: { id: userId }
      },
      children: {
        create: childrenNames.map((name: string) => ({ name }))
      }
    };

    // Only add the image field if it exists
    if (imageUrl !== undefined) {
      createData.image = imageUrl;
    }

    const family = await prisma.family.create({
      data: createData,
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
