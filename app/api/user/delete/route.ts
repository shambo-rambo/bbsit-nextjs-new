// app/api/user/delete/route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import prisma from '@/lib/prisma'

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    // Remove user from their family
    await prisma.user.update({
      where: { id: session.user.id },
      data: { familyId: null },
    })

    // Delete user's notifications
    await prisma.notification.deleteMany({
      where: { userId: session.user.id },
    })

    // Ensure session.user.email is not null or undefined before attempting to delete invitations
    if (typeof session.user.email === 'string') {
      await prisma.invitation.deleteMany({
        where: { inviteeEmail: session.user.email },
      });
    } else {
      // Handle the case where session.user.email is null or undefined
      // This could involve logging an error, throwing an exception, or any other error handling mechanism
      console.error('User email is null or undefined');
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: session.user.id },
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    // Return more detailed error information
    return NextResponse.json({ 
      error: 'Failed to delete user', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}