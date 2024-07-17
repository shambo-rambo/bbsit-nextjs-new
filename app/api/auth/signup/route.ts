// bbsit-deploy/app/api/auth/signup/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const body = await req.json();
  const { password, name } = body;
  const email = body.email.trim().toLowerCase();

  if (!email || !password || !name) {
    return new NextResponse('Missing email, password, or name', { status: 400 });
  }

  try {
    console.log("Checking for existing user with email:", email);
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log("Existing user found:", existingUser);
      return new NextResponse('User already exists', { status: 400 });
    }

    console.log("No existing user found, creating new user.");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully.");

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name, // Add the name field here
      },
    });

    console.log("User created successfully:", user);

    // Check for pending invitations
    const pendingInvitation = await prisma.invitation.findFirst({
      where: {
        inviteeEmail: email,
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

    return new NextResponse(JSON.stringify({ 
      message: 'User created successfully', 
      user: { id: user.id, email: user.email, name: user.name } 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return new NextResponse('Error creating user', { status: 500 });
  }
}