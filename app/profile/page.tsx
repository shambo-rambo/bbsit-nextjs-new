// app/profile/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '')
      setEmail(session.user.email || '')
    }
  }, [session])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      if (response.ok) {
        const updatedUser = await response.json()
        await update() // This will trigger a session update
        setName(updatedUser.name)
        setEmail(updatedUser.email)
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
