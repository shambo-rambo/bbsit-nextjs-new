'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Family, FamilyGroupPoints } from '@/types/app';

interface MemberListProps {
  members: Family[];
  familyPoints: FamilyGroupPoints[];
  groupId: string;
  adminId: string;
}

export default function MemberList({ members, familyPoints, groupId, adminId }: MemberListProps) {
  const router = useRouter();

  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/group/${groupId}/remove-member`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(`Failed to remove member: ${error.message}`);
      }
    } catch (error) {
      console.error('Error removing member:', error);
      alert('An error occurred while removing the member');
    }
  };

  const handleUpdatePoints = async (memberId: string, points: number) => {
    try {
      const response = await fetch(`/api/group/${groupId}/update-points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, points }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(`Failed to update points: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating points:', error);
      alert('An error occurred while updating points');
    }
  };

  const handleAdminChange = async (memberId: string) => {
    try {
      const response = await fetch(`/api/group/${groupId}/change-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newAdminId: memberId }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(`Failed to change admin: ${error.message}`);
      }
    } catch (error) {
      console.error('Error changing admin:', error);
      alert('An error occurred while changing the admin');
    }
  };

  return (
    <ul className="space-y-4">
      {members.map((member) => {
        const memberPoints = familyPoints.find(fp => fp.familyId === member.id)?.points || 0;
        const isAdmin = member.id === adminId;
        return (
          <li key={member.id} className="flex justify-between items-center">
            <span>{member.name}</span>
            <div>
              <input
                type="number"
                value={memberPoints}
                onChange={(e) => handleUpdatePoints(member.id, parseInt(e.target.value, 10))}
                className="w-20 mr-2 px-2 py-1 border rounded"
              />
              <button
                onClick={() => handleAdminChange(member.id)}
                className={`${isAdmin ? 'bg-yellow-500 hover:bg-yellow-700' : 'bg-green-500 hover:bg-green-700'} text-white font-bold py-1 px-2 rounded mr-2`}
              >
                {isAdmin ? 'Remove Admin' : 'Make Admin'}
              </button>
              {!isAdmin && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Remove
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}