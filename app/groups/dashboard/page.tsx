// app/groups/dashboard/page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import GroupList from '@/components/GroupList';
import CreateGroupForm from '@/components/CreateGroupForm';
import JoinGroupForm from '@/components/JoinGroupForm';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default async function GroupDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return <div className="text-center mt-8 text-white">Not authenticated</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: { 
      family: {
        include: {
          groups: true,
          adminOfGroups: true
        }
      }
    }
  });

  if (!user || !user.family) {
    return <div className="text-center mt-8 text-white">User or family not found</div>;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="min-h-screen bg-black text-white p-8 flex justify-center items-start">
        <div className="max-w-3xl w-full bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-extrabold mb-6">Group</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Groups</h2>
              <GroupList groups={user.family.groups} adminGroups={user.family.adminOfGroups} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Create New Group</h2>
              <CreateGroupForm />
              <h2 className="text-2xl font-semibold mt-8 mb-4">Join Group</h2>
              <JoinGroupForm />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}