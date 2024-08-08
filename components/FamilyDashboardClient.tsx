// bbsit-deploy/components/FamilyDashboardClient.tsx

'use client'

import { UserWithFamily, FamilyDashboardData, InvitationWithRelations } from '@/types/app';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const FamilyInfo = dynamic(() => import('@/components/FamilyInfo'), { 
  loading: () => <LoadingSpinner />,
  ssr: true 
});
const InvitationList = dynamic(() => import('@/components/InvitationList'), { 
  loading: () => <LoadingSpinner />,
  ssr: true 
});
const InviteForm = dynamic(() => import('@/components/InviteForm'), { 
  loading: () => <LoadingSpinner />,
  ssr: false 
});
const CreateFamilyForm = dynamic(() => import('@/components/CreateFamilyForm'), { ssr: false });
const FamilySettings = dynamic(() => import('@/components/FamilySettings'), { ssr: false });

interface FamilyDashboardClientProps {
    user: UserWithFamily;
    pendingInvitations: InvitationWithRelations[];
  }

  export default function FamilyDashboardClient({ user, pendingInvitations }: FamilyDashboardClientProps) {
    return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="min-h-screen bg-gray-950 text-white p-8 flex justify-center items-start">
        <div className="max-w-md w-full bg-gray-950 rounded-lg shadow-lg p-6 border-2 border-accent">
          {!user.family ? (
            <>
              <h1 className="text-3xl font-extrabold mb-6">Create Your Family</h1>
              <CreateFamilyForm user={user} />
              {pendingInvitations.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4">Pending Invitations</h2>
                  <InvitationList invitations={pendingInvitations} userId={user.id} />
                </div>
              )}
            </>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold mb-6">{user.family.name}</h1>
              
              <FamilyInfo family={user.family as FamilyDashboardData} currentUserId={user.id} />
              
              {user.isAdmin && (
                <div className="mt-6">
                  <h2 className="text-2xl font-semibold mb-4">Invite Partner</h2>
                  <InviteForm familyId={user.family.id} />
                </div>
              )}
              
              <FamilySettings 
                family={user.family}
                currentUser={user} 
              />
            </>
          )}
        </div>
      </div>
    </Suspense>
  );
}