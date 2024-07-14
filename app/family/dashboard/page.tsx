import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from '@/lib/prisma';
import dynamic from 'next/dynamic';
import FamilyInfo from '@/components/FamilyInfo';
import InvitationList from '@/components/InvitationList';
import InviteForm from '@/components/InviteForm';
import Link from 'next/link';
import FriendlyError from '@/components/FriendlyError';
import { FamilyDashboardData } from '@/types/app';

const CreateFamilyForm = dynamic(() => import('@/components/CreateFamilyForm'), { ssr: false });

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
              familyId: true
            }
          } 
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

  if (!user.family) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex justify-center items-start">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-extrabold mb-6">Create Your Family</h1>
          <CreateFamilyForm user={user} />
          {pendingInvitations.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Pending Invitations</h2>
              <InvitationList invitations={pendingInvitations} userId={user.id} />
            </div>
          )}
        </div>
      </div>
    );
  }

  const family = user.family as FamilyDashboardData;

  return (
    <div className="min-h-screen bg-black text-white p-8 flex justify-center items-start">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-extrabold mb-6">{family.name} Dashboard</h1>
        
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Family Details</h2>
          <p className="text-gray-300"><span className="text-white">Home Address:</span> {family.homeAddress}</p>
          <p className="text-gray-300"><span className="text-white">Total Points:</span> {family.points}</p>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Family Members</h3>
          <ul className="list-disc list-inside text-gray-300">
            {family.members.map(member => (
              <li key={member.id}>{member.name} ({member.email}){member.id === user.id ? ' (You)' : ''}</li>
            ))}
          </ul>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Children</h3>
          {family.children.length > 0 ? (
            family.children.map(child => (
              <p key={child.id} className="text-gray-300">{child.name}</p>
            ))
          ) : (
            <p className="text-gray-300">No children added yet.</p>
          )}
        </div>
        
        <FamilyInfo family={family} currentUserId={user.id} />
        
        {user.isAdmin && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Invite Partner</h2>
            <InviteForm familyId={family.id} />
          </div>
        )}
        
        <Link href="/family/settings" className="inline-block px-6 py-2 bg-accent text-black font-semibold rounded-lg transition duration-300 ease-in-out hover:opacity-90">
          Family Settings
        </Link>
      </div>
    </div>
  );
}