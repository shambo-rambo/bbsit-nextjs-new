import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { FamilyDashboardData } from '@/types/app';
import type { Metadata, Viewport } from 'next';
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
  ssr: true 
});
const FriendlyError = dynamic(() => import('@/components/FriendlyError'), { ssr: true });
const CreateFamilyForm = dynamic(() => import('@/components/CreateFamilyForm'), { ssr: false });
const FamilySettings = dynamic(() => import('@/components/FamilySettings'), { ssr: false });

export const metadata: Metadata = {
  title: 'Family Dashboard',
  description: 'Manage your family and invitations',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default async function FamilyDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return <FriendlyError message="Not authenticated" suggestion="Please sign in to view your family dashboard." />;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: { 
      family: { 
        include: { 
          members: true, 
          children: {
            select: {
              id: true,
              name: true,
              familyId: true,
              createdAt: true,
              updatedAt: true
            }
          },
          groups: true,
          adminOfGroups: true,
          participatingEvents: true,
          createdEvents: true,
        } 
      } 
    }
  });

  if (!user) {
    return <FriendlyError message="User not found" suggestion="There might be an issue with your account. Please try signing out and in again." />;
  }

  const pendingInvitations = await prisma.invitation.findMany({
    where: { inviteeEmail: user.email, status: 'pending' },
    include: { inviterFamily: true, group: true }
  });

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
              
              <FamilyInfo 
                family={{
                  id: user.family.id,
                  image: user.family.image,
                  name: user.family.name,
                  homeAddress: user.family.homeAddress,
                  members: user.family.members,
                  children: user.family.children,
                  points: user.family.points,
                  createdAt: user.family.createdAt,
                  updatedAt: user.family.updatedAt,
                  currentAdminId: user.family.currentAdminId,
                  adminId: user.family.adminId,
                }} 
                currentUserId={user.id} 
              />
              
              {user.isAdmin && (
                <div className="mt-6">
                  <h2 className="text-2xl font-semibold mb-4">Invite Partner</h2>
                  <InviteForm familyId={user.family.id} />
                </div>
              )}
              
              <FamilySettings family={user.family} currentUser={user} />
            </>
          )}
        </div>
      </div>
    </Suspense>
  );
}