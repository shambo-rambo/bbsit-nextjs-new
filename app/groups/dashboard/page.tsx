import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import GroupDashboard from '@/components/GroupDashboard';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Group Dashboard',
  description: 'Manage your groups and join new ones',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

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
            include: {
              admin: true,
              members: true,
              events: {
                include: {
                  family: true,
                  creatorFamily: true,
                  group: true,
                }
              },
              familyPoints: true,
            }
          },
        }
      }
    }
  });

  if (!user || !user.family) {
    return <div className="text-center mt-8 text-white">User or family not found</div>;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <GroupDashboard 
        initialGroups={user.family.groups}
        currentUser={user}
      />
    </Suspense>
  );
}