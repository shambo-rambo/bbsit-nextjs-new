// components/GroupPageContent.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CreateEventForm from './CreateEventForm';
import EventList from './EventList';
import { GroupWithRelations, UserWithRelations } from '@/types/app';

interface GroupPageContentProps {
  group: GroupWithRelations;
  currentUser: UserWithRelations | null;
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
    <div className="min-h-screen bg-background text-text p-mobile sm:p-desktop flex justify-center items-start">
      <div className="w-full max-w-3xl bg-gray-900 rounded-mobile sm:rounded-desktop shadow-lg p-mobile sm:p-desktop">
        {isCreateEventFormVisible && currentUser?.family && (
          <div className="mb-mobile sm:mb-desktop">
            <h2 className="text-xl-mobile sm:text-2xl font-semibold mb-2 text-text">Create New Event</h2>
            <CreateEventForm
              groupId={localGroup.id}
              familyId={currentUser.family.id}
              onEventCreated={handleEventCreated}
            />
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-mobile sm:mb-desktop">
          <h1 className="text-2xl-mobile sm:text-3xl font-extrabold text-text mb-2 sm:mb-0">{localGroup.name}</h1>
          <div className="space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            {!isCreateEventFormVisible && (
              <button
                onClick={handleCreateEventClick}
                className="w-full sm:w-auto bg-accent hover:bg-opacity-90 text-black font-bold py-2 px-4 rounded-mobile sm:rounded transition duration-300 mb-2 sm:mb-0"
              >
                Create Event
              </button>
            )}
            {isAdmin && (
              <Link 
                href={`/groups/${localGroup.id}/settings`} 
                className="w-full sm:w-auto block text-center bg-gray-800 hover:bg-gray-700 text-text font-bold py-2 px-4 rounded-mobile sm:rounded transition duration-300"
              >
                Group Settings
              </Link>
            )}
          </div>
        </div>
        <p className="mb-mobile sm:mb-desktop text-gray-300 text-base-mobile sm:text-base">{localGroup.description}</p>
        <div className="mb-mobile sm:mb-desktop">
          <h2 className="text-xl-mobile sm:text-2xl font-semibold mb-2 text-text">Invite Code</h2>
          <div className="flex flex-col sm:flex-row items-center">
            <span className="w-full sm:w-auto mb-2 sm:mb-0 sm:mr-2 p-2 bg-gray-800 text-text rounded-mobile sm:rounded">{localGroup.inviteCode}</span>
            <button 
              onClick={copyInviteCode}
              className="w-full sm:w-auto bg-accent hover:bg-opacity-90 text-black font-bold py-2 px-4 rounded-mobile sm:rounded transition duration-300"
            >
              Copy
            </button>
          </div>
        </div>
        <h2 className="text-xl-mobile sm:text-2xl font-semibold mb-4 text-text">Members</h2>
        <ul className="space-y-2 mb-mobile sm:mb-desktop">
          {localGroup.members.map((member) => {
            const memberPoints = localGroup.familyPoints.find(fp => fp.familyId === member.id)?.points || 0;
            return (
              <li key={member.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-800 p-2 rounded-mobile sm:rounded">
                <span className="text-text mb-1 sm:mb-0">
                  {member.name} 
                  {member.id === localGroup.adminId && <span className="ml-2 text-sm-mobile sm:text-sm text-gray-400">(Admin)</span>}
                </span>
                <span className="bg-accent text-black py-1 px-2 rounded-mobile sm:rounded font-bold">
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