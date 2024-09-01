// bbsit-deploy/app/events/dashboard/page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import FriendlyError from '@/components/FriendlyError';
import Link from 'next/link';
import { UserWithFamilyForDashboard } from '@/types/app';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EventsDashboardContent } from '@/components/EventsDashboardContent';

export default async function EventsDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return (
      <FriendlyError 
        message="Oops! It looks like you're not signed in." 
        suggestion="Please sign in to view the Events Dashboard."
      />
    );
  }

  let user: UserWithFamilyForDashboard | null;
  try {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        family: {
          include: {
            groups: {
              select: {
                id: true,
                name: true,
              }
            },
            adminOfGroups: {
              select: {
                id: true,
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return (
      <FriendlyError 
        message="We couldn't find your user profile." 
        suggestion="There might be an issue with your account. Please try signing out and in again."
      />
    );
  }

  if (!user || !user.family) {
    return (
      <div className="container mx-auto px-4 py-8">
        <FriendlyError 
          message="It looks like you haven&apos;t set up your family yet." 
          suggestion="Create your family profile to start managing events."
        />
        <Link href="/family/create" className="mt-4 inline-block px-6 py-2 bg-accent text-black rounded-full hover:bg-opacity-90 transition-colors">
          Create Family Profile
        </Link>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <EventsDashboardContent 
        familyId={user.family.id}
        groups={user.family.groups}
        adminGroupIds={user.family.adminOfGroups.map(group => group.id)}
      />
    </Suspense>
  );
}