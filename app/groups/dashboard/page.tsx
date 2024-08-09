// app/groups/dashboard/page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { Metadata, Viewport } from 'next';
import { UserWithFamily, GroupBasic } from '@/types/app';

export const metadata: Metadata = {
  title: 'My Groups',
  description: 'Manage your groups and join new ones',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const GroupDashboard = lazy(() => import('@/components/GroupDashboard'));

async function getUserWithGroups(email: string): Promise<{ user: UserWithFamily; groups: GroupBasic[] } | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { 
      family: {
        include: {
          groups: {
            select: {
              id: true,
              name: true,
              adminId: true,
              inviteCode: true,
            }
          },
        }
      }
    }
  });

  if (!user || !user.family) return null;

  return {
    user: user as UserWithFamily,
    groups: user.family.groups as GroupBasic[]
  };
}

export default async function GroupDashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return <div className="text-center mt-8 text-white">Not authenticated</div>;
  }

  const data = await getUserWithGroups(session.user.email);

  if (!data) {
    return <div className="text-center mt-8 text-white">User or family not found</div>;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <GroupDashboard currentUser={data.user} initialGroups={data.groups} />
    </Suspense>
  );
}
