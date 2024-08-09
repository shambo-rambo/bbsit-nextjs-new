'use client';

import { useState } from 'react';
import { useSession } from "next-auth/react";
import GroupList from '@/components/GroupList';
import GroupPageContent from '@/components/GroupPageContent';
import CreateGroupForm from '@/components/CreateGroupForm';
import JoinGroupForm from '@/components/JoinGroupForm';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { GroupBasic, GroupWithRelations, UserWithFamily } from '@/types/app';

interface GroupDashboardProps {
  currentUser: UserWithFamily;
  initialGroups: GroupBasic[];
}

export default function GroupDashboard({ currentUser, initialGroups }: GroupDashboardProps) {
  const { data: session, status } = useSession();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedGroupDetails, setSelectedGroupDetails] = useState<GroupWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (!session || !session.user) {
    return <div className="text-center mt-8 text-white">Not authenticated</div>;
  }

  const handleGroupClick = async (groupId: string) => {
    if (selectedGroupId === groupId) {
      setSelectedGroupId(null);
      setSelectedGroupDetails(null);
    } else {
      setIsLoading(true);
      setSelectedGroupId(groupId);
      try {
        const response = await fetch(`/api/group/${groupId}`);
        if (response.ok) {
          const groupDetails: GroupWithRelations = await response.json();
          setSelectedGroupDetails(groupDetails);
        } else {
          console.error('Failed to fetch group details');
        }
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    setShowCreateForm(false);
    setShowJoinForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-8 flex justify-center items-start">
      <div className="w-full bg-gray-950 border-2 border-accent rounded-lg shadow-lg p-6 max-w-screen-md">
        <h1 className="text-3xl font-bold mb-6">Groups</h1>
        
        <div className="mb-8">
          <GroupList 
            groups={currentUser.family?.groups || []} 
            currentUserId={currentUser.family?.id || ''} 
            onGroupClick={handleGroupClick}
            selectedGroupId={selectedGroupId}
          />
        </div>

        {isLoading && <LoadingSpinner />}

        {selectedGroupDetails && !isLoading && (
          <div>
            <GroupPageContent 
              group={selectedGroupDetails} 
              currentUser={currentUser} 
              isAdmin={selectedGroupDetails.adminId === currentUser.family?.id}
            />
          </div>
        )}

        <div className="mt-8">
          <button 
            onClick={() => setShowJoinForm(!showJoinForm)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            {showJoinForm ? 'Hide Join Group Form' : 'Join Group'}
          </button>
        </div>

        {showJoinForm && (
          <div className="mt-4 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Join Group</h2>
            <JoinGroupForm />
          </div>
        )}

        <div className="mt-8">
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            {showCreateForm ? 'Hide Create Group Form' : 'Create New Group'}
          </button>
        </div>

        {showCreateForm && (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Create New Group</h2>
            <CreateGroupForm onComplete={handleComplete} />
          </div>
        )}
      </div>
    </div>
  );
}
