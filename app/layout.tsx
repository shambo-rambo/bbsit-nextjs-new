// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { SessionProvider } from '@/components/SessionProvider'
import dynamic from 'next/dynamic'
import ContentWrapper from '@/components/ContentWrapper'
import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/LoadingSpinner'

const inter = Inter({ subsets: ['latin'] })

const WebSocketProvider = dynamic(() => import('@/components/WebSocketProvider'), { ssr: false })

export const metadata: Metadata = {
  title: 'Babysitters Club',
  description: 'Exchange babysitting services with other families',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-text`}>
        <SessionProvider>
          <header>
            <Navbar />
          </header>
          <Suspense fallback={<LoadingSpinner />}>
            <ContentWrapper>
              {children}
            </ContentWrapper>
          </Suspense>
        </SessionProvider>
      </body>
    </html>
  )
}