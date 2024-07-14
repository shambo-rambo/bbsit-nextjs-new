// components/GroupPageContent.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CreateEventForm from './CreateEventForm';
import EventList from './EventList';
import { GroupWithRelations, UserWithRelations } from '@/types/app';


interface GroupPageContentProps {
  group: GroupWithRelations; // Use the correct type with all nested relations
  currentUser: UserWithRelations | null; // Assuming currentUser could be null
  isAdmin: boolean;
}

const GroupPageContent: React.FC<GroupPageContentProps> = ({ group, currentUser, isAdmin }) => {
  const [isCreateEventFormVisible, setIsCreateEventFormVisible] = useState(false);
  const [localGroup, setLocalGroup] = useState(group);
  const router = useRouter();

  useEffect(() => {
    setLocalGroup(group);
  }, [group]);

  const copyInviteCode = () => {
    navigator.clipboard.writeText(localGroup.inviteCode);
    alert('Invite code copied to clipboard!');
  };

  const handleCreateEventClick = () => {
    setIsCreateEventFormVisible(true);
  };

  const handleEventCreated = () => {
    setIsCreateEventFormVisible(false);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex justify-center items-start">
      <div className="max-w-3xl w-full bg-gray-900 rounded-lg shadow-lg p-6">
        {isCreateEventFormVisible && currentUser?.family && (
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2 text-white">Create New Event</h2>
            <CreateEventForm
              groupId={localGroup.id}
              familyId={currentUser.family.id}
              onEventCreated={handleEventCreated}
            />
          </div>
        )}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-extrabold text-white">{localGroup.name}</h1>
          <div className="space-x-2">
            {!isCreateEventFormVisible && (
              <button
                onClick={handleCreateEventClick}
                className="bg-accent hover:bg-opacity-90 text-black font-bold py-2 px-4 rounded transition duration-300"
              >
                Create Event
              </button>
            )}
            {isAdmin && (
              <Link 
                href={`/groups/${localGroup.id}/settings`} 
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Group Settings
              </Link>
            )}
          </div>
        </div>
        <p className="mb-6 text-gray-300">{localGroup.description}</p>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 text-white">Invite Code</h2>
          <div className="flex items-center">
            <span className="mr-2 p-2 bg-gray-800 text-white rounded">{localGroup.inviteCode}</span>
            <button 
              onClick={copyInviteCode}
              className="bg-accent hover:bg-opacity-90 text-black font-bold py-2 px-4 rounded transition duration-300"
            >
              Copy
            </button>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-white">Members</h2>
        <ul className="space-y-2 mb-6">
          {localGroup.members.map((member) => {
            const memberPoints = localGroup.familyPoints.find(fp => fp.familyId === member.id)?.points || 0;
            return (
              <li key={member.id} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                <span className="text-white">
                  {member.name} 
                  {member.id === localGroup.adminId && <span className="ml-2 text-sm text-gray-400">(Admin)</span>}
                </span>
                <span className="bg-accent text-black py-1 px-2 rounded font-bold">
                  {memberPoints} points
                </span>
              </li>
            );
          })}
        </ul>
        {currentUser?.family && (
          <EventList
            groupId={localGroup.id}
            familyId={currentUser.family.id}
            events={localGroup.events}
            isAdmin={isAdmin}
          />
        )}
      </div>
    </div>
  );
};

export default GroupPageContent;