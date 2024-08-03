// bbsit-deploy/components/GroupPageContent.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreateEventForm from './CreateEventForm';
import EventList from './EventList';
import GroupSettingsContent from './GroupSettingsForm';
import { GroupWithRelations, UserWithRelations } from '@/types/app';

interface GroupPageContentProps {
  group: GroupWithRelations;
  currentUser: UserWithRelations | null;
  isAdmin: boolean;
}

const GroupPageContent: React.FC<GroupPageContentProps> = ({ group, currentUser, isAdmin }) => {
  const [isCreateEventFormVisible, setIsCreateEventFormVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [localGroup, setLocalGroup] = useState<GroupWithRelations | null>(null);
  const router = useRouter();

  useEffect(() => {
    setLocalGroup(group);
  }, [group]);

  if (!localGroup) {
    return <div className="text-center p-4">Loading group data...</div>;
  }

  const copyInviteCode = () => {
    if (localGroup.inviteCode) {
      navigator.clipboard.writeText(localGroup.inviteCode);
      alert('Invite code copied to clipboard!');
    } else {
      alert('Invite code not available');
    }
  };

  const handleCreateEventClick = () => {
    setIsCreateEventFormVisible(true);
  };

  const handleEventCreated = () => {
    setIsCreateEventFormVisible(false);
    router.refresh();
  };

  const toggleSettings = () => {
    setIsSettingsVisible(!isSettingsVisible);
  };

  return (
    <div className="w-full bg-gray-950 text-text">
      <div className="px-4 py-6 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-4">{localGroup.name}</h1>
        
        <p className="mb-6 text-gray-300 text-sm sm:text-base">{localGroup.description}</p>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-text mb-2">Invite Code</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
            <span className="w-full sm:w-auto mb-2 sm:mb-0 sm:mr-2 p-2 bg-gray-800 text-text rounded">{localGroup.inviteCode}</span>
            <button 
              onClick={copyInviteCode}
              className="w-full sm:w-auto bg-accent hover:bg-opacity-90 text-black font-bold py-2 px-4 rounded transition duration-300"
            >
              Copy
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-text">Members</h2>
          <ul className="space-y-2">
            {localGroup.members?.map((member) => {
              const memberPoints = localGroup.familyPoints?.find(fp => fp.familyId === member.id)?.points || 0;
              return (
                <li key={member.id} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span className="text-text">
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
        </div>
        
        {!isCreateEventFormVisible && (
          <button
            onClick={handleCreateEventClick}
            className="w-full bg-accent hover:bg-opacity-90 text-black font-bold py-2 px-4 rounded transition duration-300 mb-6"
          >
            Create Event
          </button>
        )}
        
        {isCreateEventFormVisible && currentUser?.family && (
          <div className="mb-6">
            <CreateEventForm
              groupId={localGroup.id}
              familyId={currentUser.family.id}
              onEventCreated={handleEventCreated}
            />
          </div>
        )}
        
        {currentUser?.family && (
          <EventList
            groupId={localGroup.id}
            familyId={currentUser.family.id}
            events={localGroup.events || []}
            isAdmin={isAdmin}
          />
        )}
        
        {isAdmin && (
          <div className="mt-6">
            <button
              onClick={toggleSettings}
              className="w-full bg-gray-800 hover:bg-gray-700 text-text font-bold py-2 px-4 rounded transition duration-300"
            >
              {isSettingsVisible ? 'Hide Group Settings' : 'Group Settings'}
            </button>
          </div>
        )}
        
        {isSettingsVisible && isAdmin && currentUser && (
          <div className="mt-6">
            <GroupSettingsContent group={localGroup} currentUser={currentUser} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPageContent;