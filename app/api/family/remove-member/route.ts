// app/api/family/remove-member/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust this import based on your project structure

export async function POST(request: Request) {
  try {
    const { familyId, memberId } = await request.json();

    // Perform the removal operation
    await prisma.user.update({
      where: { id: memberId },
      data: { familyId: null }
    });

    return NextResponse.json({ message: 'Member removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to remove family member:', error);
    return NextResponse.json({ error: 'Failed to remove family member' }, { status: 500 });
  }
}