// app/api/family/update/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { put } from '@vercel/blob';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const formData = await req.formData();
    const familyId = formData.get('familyId') as string;
    const name = formData.get('name') as string;
    const homeAddress = formData.get('homeAddress') as string;
    const children = JSON.parse(formData.get('children') as string);
    const imageFile = formData.get('image') as File | null;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { family: true },
    });

    if (!user || !user.family || user.family.id !== familyId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    let imageUrl = user.family.image as string | undefined; // Keep the existing image URL by default

    if (imageFile) {
      try {
        const { url } = await put(imageFile.name, imageFile, { access: 'public' });
        imageUrl = url;
      } catch (error) {
        console.error('Error uploading image:', error);
        return new NextResponse('Error uploading image', { status: 500 });
      }
    }

    const updateData: any = {
      name,
      homeAddress,
      children: {
        upsert: children.map((child: { id?: string, name: string }) => ({
          where: { id: child.id || '' },
          update: { name: child.name },
          create: { name: child.name },
        })),
      },
    };

    // Only add the image field if it exists
    if (imageUrl !== undefined) {
      updateData.image = imageUrl;
    }

    const updatedFamily = await prisma.family.update({
      where: { id: familyId },
      data: updateData,
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