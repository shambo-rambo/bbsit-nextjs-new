// bbsit-deploy/app/family/settings/page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import FamilySettingsForm from '@/components/FamilySettingsForm';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Family Settings',
  description: 'Manage your family settings',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default async function FamilySettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: { 
      family: { 
        include: { 
          members: true, 
          children: true,
          adminOfGroups: true,
        } 
      } 
    }
  });

  let hasGroups = false;
  if (user && user.family) {
    hasGroups = user.family.adminOfGroups.length > 0;
  }

  if (!user || !user.family) {
    redirect('/family/dashboard');
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div>
        <FamilySettingsForm family={user.family} currentUser={user} hasGroups={hasGroups} />
      </div>
    </Suspense>
  );
}