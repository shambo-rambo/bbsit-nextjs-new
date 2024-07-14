// components/LoginButton.tsx

'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginButton() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={handleSignOut}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}