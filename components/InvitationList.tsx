'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Invitation {
  id: string;
  inviterFamilyId: string;
  inviterFamily?: {
    name: string;
  };
}

interface InvitationListProps {
  invitations: Invitation[];
  userId: string;
}

export default function InvitationList({ invitations, userId }: InvitationListProps) {
  const [pendingInvitations, setPendingInvitations] = useState(invitations);
  const router = useRouter();

  const handleInvitation = async (invitationId: string, accept: boolean) => {
    const response = await fetch('/api/family/respond-invitation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invitationId, userId, accept }),
    });

    if (response.ok) {
      setPendingInvitations(pendingInvitations.filter(inv => inv.id !== invitationId));
      if (accept) {
        router.refresh(); // Refresh the page to show the new family dashboard
      }
    } else {
      console.error('Failed to respond to invitation');
    }
  };

  if (pendingInvitations.length === 0) {
    return <div className="text-gray-400">No pending invitations</div>;
  }

  return (
    <div className="bg-gray-950 text-white py-8 px-4 sm:px-10 sm:max-w-md mx-auto">
      <ul className="space-y-6">
        {pendingInvitations.map(invitation => (
          <li key={invitation.id} className="bg-gray-900 p-4 rounded-lg shadow-md border border-gray-700">
            <p className="text-lg font-medium mb-4">
              Invitation to join {invitation.inviterFamily?.name || 'a family'}
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => handleInvitation(invitation.id, true)}
                className="flex-1 bg-accent text-black font-bold py-2 px-4 rounded transition duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
              >
                Accept
              </button>
              <button 
                onClick={() => handleInvitation(invitation.id, false)}
                className="flex-1 bg-gray-950 text-gray-300 font-bold py-2 px-4 rounded transition duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
              >
                Decline
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}