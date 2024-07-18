// app/groups/[groupId]/page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import GroupPageContent from '@/components/GroupPageContent';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface GroupPageProps {
  params: {
    groupId: string;
  };
}

export default async function GroupPage({ params }: GroupPageProps) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.email === null) {
    return <div className="text-center mt-8 text-white">Not authenticated</div>;
  }

  const group = await prisma.group.findUnique({
    where: { id: params.groupId },
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
    },
  });

  if (!group) {
    notFound();
    return; 
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { family: true },
  });

  const isAdmin = currentUser?.family?.id === group.adminId;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <GroupPageContent group={group} currentUser={currentUser} isAdmin={isAdmin} />
    </Suspense>
  );
}