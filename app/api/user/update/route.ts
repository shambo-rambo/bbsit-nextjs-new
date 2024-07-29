// app/api/user/update/route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import prisma from '@/lib/prisma'
import { put } from '@vercel/blob'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const formData = await req.formData()
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const file = formData.get('image') as File | null

  console.log('File:', file)

  let imageUrl = null
  if (file) {
    try {
      const { url } = await put(file.name, file, { access: 'public' })
      imageUrl = url
    } catch (error) {
      console.error('Error uploading image:', error)
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
    }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('Existing user image:', user.image)

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        name, 
        email,
        image: imageUrl || user.image
      },
    })

    console.log('Updated user:', updatedUser)

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}