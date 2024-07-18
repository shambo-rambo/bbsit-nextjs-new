// app/family/create/page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import CreateFamilyForm from '@/components/CreateFamilyForm';
import { redirect } from 'next/navigation';
import FriendlyError from '@/components/FriendlyError';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default async function CreateFamilyPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user) {
    return (
      <FriendlyError 
        message="Oops! We couldn't find your user profile." 
        suggestion="There might be an issue with your account. Please try signing out and in again."
      />
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-8 text-center text-accent">Create Your Family</h1>
          <div className="bg-gray-900 p-8 rounded-lg shadow-lg">
            <CreateFamilyForm user={user} />
          </div>
        </div>
      </div>
    </Suspense>
  );
}