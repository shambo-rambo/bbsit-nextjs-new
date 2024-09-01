// bbsit-deploy/app/groups/[groupId]/settings/page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import GroupSettingsForm from '@/components/GroupSettingsForm';
import MemberList from '@/components/MemberList';
import EventList from '@/components/EventList';
import DeleteGroupButton from '@/components/DeleteGroupButton';
import { EventWithRelations, GroupWithRelations, Family, FamilyGroupPointsWithRelations, UserWithRelations } from '@/types/app';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { Metadata, Viewport } from 'next';

interface GroupSettingsPageProps {
  params: {
    groupId: string;
  };
}

export const metadata: Metadata = {
  title: 'Group Settings',
  description: 'Manage group settings and members',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default async function GroupSettingsPage({ params }: GroupSettingsPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <div>Not authenticated</div>;
  }

  const email = session.user.email;

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
      familyPoints: {
        include: {
          family: true,
          group: true,
        }
      },
    },
  });

  if (!group) {
    notFound();
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: email },
    include: { 
      family: {
        include: {
          groups: {
            include: {
              events: true
            }
          },
          adminOfGroups: true
        }
      }
    },
  });

  if (!currentUser?.family || currentUser.family.id !== group.adminId) {
    return <div>You do not have permission to access this page.</div>;
  }

  // Use a type assertion to match the expected GroupWithRelations type
  const groupWithRelations = group as unknown as GroupWithRelations;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Group Settings: {group.name}</h1>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Edit Group Details</h2>
          <GroupSettingsForm 
            group={groupWithRelations} 
            currentUser={currentUser as UserWithRelations}
          />
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Manage Members</h2>
          <MemberList 
            members={group.members as Family[]} 
            familyPoints={group.familyPoints as FamilyGroupPointsWithRelations[]} 
            groupId={group.id}
            adminId={group.adminId}
          />
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Manage Events</h2>
          <EventList 
            groupId={group.id}
            familyId={currentUser.family.id}
            events={group.events as EventWithRelations[]}
            isAdmin={true}
          />
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Danger Zone</h2>
          <DeleteGroupButton groupId={group.id} />
        </section>
      </div>
    </Suspense>
  );
}