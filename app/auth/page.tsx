// bbsit-deploy/app/auth/page.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import Image from 'next/image'

export default function Auth() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const urlMode = searchParams.get('mode')
    if (urlMode === 'signin' || urlMode === 'signup') {
      setMode(urlMode)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    if (mode === 'signup') {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        })
  
        const data = await res.json()
  
        if (res.ok) {
          // Use callbackUrl to redirect after successful sign-in
          const signInResult = await signIn('credentials', { 
            email, 
            password,
            name, // Add name to the credentials
            redirect: false,
            callbackUrl: '/'
          })
          if (signInResult?.error) {
            setError('Sign up successful, but failed to sign in. Please try signing in manually.')
          } else if (signInResult?.url) {
            router.push(signInResult.url)
          }
        } else {
          setError(data.error || 'Sign up failed')
        }
      } catch (err) {
        setError('An unexpected error occurred')
        console.error(err)
      }
    } else {
      try {
        const result = await signIn('credentials', { 
          email, 
          password,
          name, // Add name to the credentials
          redirect: false,
          callbackUrl: '/'
        })
        if (result?.error) {
          if (result.error === 'CredentialsSignin') {
            setError('Invalid email or password')
          } else {
            setError('Sign in failed. Please try again.')
          }
        } else if (result?.url) {
          router.push(result.url)
        }
      } catch (err) {
        setError('An unexpected error occurred')
        console.error(err)
      }
    }
    setIsLoading(false)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="max-w-md w-full space-y-8 bg-gray-950 p-10 rounded-xl border-2 border-accent">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            {mode === 'signup' ? 'Create an Account' : 'Sign In'}
          </h2>
          {mode === 'signup' && (
            <p className="mt-2 text-center text-sm text-gray-300">
              Start your journey with us today
            </p>
          )}
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white bg-gray-950 rounded-t-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white bg-gray-950 ${mode === 'signin' ? 'rounded-t-md' : ''} focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white bg-gray-950 rounded-b-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {mode === 'signup' && (
              <div>
                <label htmlFor="image" className="sr-only">Profile Image</label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white bg-gray-950 focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            >
              {mode === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-950 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Image src="/google-color.svg" alt="Google Logo" width={20} height={20} className="mr-2" />
              <span>Continue with Google</span>
            </button>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => {
              const newMode = mode === 'signin' ? 'signup' : 'signin'
              setMode(newMode)
              router.push(`/auth?mode=${newMode}`)
            }}
            className="w-full text-center text-sm text-accent hover:text-accent-dark"
          >
            {mode === 'signin' ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}