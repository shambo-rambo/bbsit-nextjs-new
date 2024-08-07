// bbsit-deploy/app/api/auth/signup/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { put } from '@vercel/blob';

export async function POST(req: Request) {
  let email: string, password: string, name: string, imageFile: File | null = null;
  const contentType = req.headers.get('content-type');

  try {
    if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData();
      email = formData.get('email') as string;
      password = formData.get('password') as string;
      name = formData.get('name') as string;
      imageFile = formData.get('image') as File | null;
    } else if (contentType?.includes('application/json')) {
      const jsonData = await req.json();
      email = jsonData.email;
      password = jsonData.password;
      name = jsonData.name;
    } else if (contentType?.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      email = formData.get('email') as string;
      password = formData.get('password') as string;
      name = formData.get('name') as string;
    } else {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 });
    }

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing email, password, or name' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    console.log("Checking for existing user with email:", trimmedEmail);
    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail }
    });

    if (existingUser) {
      console.log("Existing user found:", existingUser);
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    console.log("No existing user found, creating new user.");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully.");

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

    const userData: any = {
      email: trimmedEmail,
      password: hashedPassword,
      name,
    };

    if (imageUrl) {
      userData.image = imageUrl;
    }

    const user = await prisma.user.create({
      data: userData,
    });

    console.log("User created successfully:", user);

    // Check for pending invitations
    const pendingInvitation = await prisma.invitation.findFirst({
      where: {
        inviteeEmail: trimmedEmail,
        status: 'pending',
      },
      include: {
        inviterFamily: true,
      },
    });

    if (pendingInvitation) {
      console.log("Pending invitation found, creating notification.");
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'FAMILY_INVITATION',
          content: `You've been invited to join ${pendingInvitation.inviterFamily.name}`,
          isRead: false,
        },
      });
      
      // Update the invitation with the new user's ID
      await prisma.invitation.update({
        where: { id: pendingInvitation.id },
        data: { inviteeEmail: user.email },
      });
    }

    return NextResponse.json({ 
      message: 'User created successfully', 
      user: { id: user.id, email: user.email, name: user.name, image: user.image } 
    }, { status: 200 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}