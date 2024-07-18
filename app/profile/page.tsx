// app/profile/page.tsx

'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '')
      setEmail(session.user.email || '')
      setImage(session.user.image || null)
    }
  }, [session])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    if (fileInputRef.current?.files?.[0]) {
      formData.append('image', fileInputRef.current.files[0])
    }

    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        body: formData,
      })
      if (response.ok) {
        const updatedUser = await response.json()
        await update() 
        setName(updatedUser.name)
        setEmail(updatedUser.email)
        setImage(updatedUser.image)
        alert('Profile updated successfully')
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsLoading(true)
      try {
        const response = await fetch('/api/user/delete', { method: 'DELETE' })
        if (response.ok) {
          router.push('/auth?action=logout')
        } else {
          const errorData = await response.json()
          throw new Error(`Failed to delete account: ${errorData.details || errorData.error}`)
        }
      } catch (error) {
        console.error('Error deleting account:', error)
        alert('Failed to delete account. Please try again or contact support.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (!session) {
    return <div className="text-center mt-8 text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-extrabold mb-6">User Profile</h1>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex justify-center mb-4">
            {image ? (
              <Image 
                src={image} 
                alt="Profile" 
                width={200} 
                height={200} 
                className="rounded-full"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-3xl">?</span>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-1 text-gray-300">Profile Image</label>
            <input
              type="file"
              id="image"
              ref={fileInputRef}
              accept="image/*"
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-300">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-black font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out hover:opacity-90"
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="w-full mt-4 bg-gray-800 text-gray-300 font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out hover:opacity-90"
        >
          {isLoading ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  )
}