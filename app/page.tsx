'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import Link from 'next/link';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/events/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-bold mb-6 text-white">
          Welcome to Babysitter&apos;s Club
        </h1>
        
        <p className="text-xl mb-8">
          Revolutionizing childcare through community and technology.
        </p>

        <div className="space-y-4 mb-12">
          <p className="text-lg">
            Connect with friends and families in your area, exchange babysitting services, 
            and build a network of support for your parenting journey.
          </p>
          <p className="text-lg">
            Save money and ensure your children are always in good hands.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {!session && (
            <>
              <Link href="/auth?mode=login" className="px-8 py-3 bg-accent text-black font-semibold rounded-full hover:bg-opacity-90 transition-colors">
                Login
              </Link>
              <Link href="/auth?mode=signup" className="px-8 py-3 border-2 border-accent text-accent font-semibold rounded-full hover:bg-accent hover:text-black transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      <footer className="mt-16 text-center text-sm text-gray-500">
        © 2024 Babysitter&apos;s Club. All rights reserved.
      </footer>
    </main>
  );
}