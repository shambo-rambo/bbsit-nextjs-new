import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import ContentWrapper from '@/components/ContentWrapper'
import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Providers } from './providers'
import ServiceWorkerRegistration from './ServiceWorkerRegistration'

const inter = Inter({ subsets: ['latin'] })

const APP_NAME = "Babysitters Club";
const APP_DEFAULT_TITLE = "Babysitters Club";
const APP_TITLE_TEMPLATE = "%s - Babysitters Club";
const APP_DESCRIPTION = "Exchange babysitting services with other families";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: "#C9FB00",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-text`}>
        <Providers>
          <ServiceWorkerRegistration />
          <header>
            <Navbar />
          </header>
          <Suspense fallback={<LoadingSpinner />}>
            <ContentWrapper>
              {children}
            </ContentWrapper>
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}