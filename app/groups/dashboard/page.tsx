import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import GroupDashboard from '@/components/GroupDashboard';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { Metadata, Viewport } from 'next';
import { GroupBasic, UserWithRelations } from '@/types/app';
import { User, Family } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Group Dashboard',
  description: 'Manage your groups and join new ones',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

// Define a more specific type for the user data we're fetching
type UserWithFamilyAndGroups = User & {
  family: (Family & {
    groups: GroupBasic[]
  }) | null
};

export default async function GroupDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return <div className="text-center mt-8 text-white">Not authenticated</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: { 
      family: {
        include: {
          groups: {
            select: {
              id: true,
              name: true,
              adminId: true,
            }
          },
        }
      }
    }
  }) as UserWithFamilyAndGroups;

  if (!user || !user.family) {
    return <div className="text-center mt-8 text-white">User or family not found</div>;
  }

  const initialGroups: GroupBasic[] = user.family.groups;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <GroupDashboard 
        initialGroups={initialGroups}
        currentUser={user as UserWithRelations}
      />
    </Suspense>
  );
}