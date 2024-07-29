'use client';

import { useState } from 'react';
import { useSession } from "next-auth/react";
import GroupList from '@/components/GroupList';
import GroupPageContent from '@/components/GroupPageContent';
import CreateGroupForm from '@/components/CreateGroupForm';
import JoinGroupForm from '@/components/JoinGroupForm';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Group, User, Family } from '@prisma/client';

interface GroupWithRelations extends Group {
  admin: Family;
  members: Family[];
  events: any[]; // Replace 'any' with your actual Event type
  familyPoints: any[]; // Replace 'any' with your actual FamilyGroupPoints type
}

interface GroupDashboardProps {
  initialGroups: GroupWithRelations[];
  currentUser: User & { family: Family | null };
}

export default function GroupDashboard({ initialGroups, currentUser }: GroupDashboardProps) {
  const { data: session, status } = useSession();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groups, setGroups] = useState<GroupWithRelations[]>(initialGroups);
  const [selectedGroup, setSelectedGroup] = useState<GroupWithRelations | null>(null);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (!session || !session.user) {
    return <div className="text-center mt-8 text-white">Not authenticated</div>;
  }

  const handleGroupCreated = (newGroup: GroupWithRelations) => {
    setGroups(prevGroups => [...prevGroups, newGroup]);
  };

  const handleGroupClick = (group: GroupWithRelations) => {
    if (selectedGroup && selectedGroup.id === group.id) {
      // If the clicked group is already selected, deselect it
      setSelectedGroup(null);
    } else {
      // Otherwise, select the clicked group
      setSelectedGroup(group);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex justify-center items-start">
      <div className="max-w-3xl w-full bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Group Dashboard</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Groups</h2>
          <GroupList 
            groups={groups} 
            currentUserId={currentUser.family?.id || ''} 
            onGroupClick={handleGroupClick}
            selectedGroupId={selectedGroup?.id}
          />
        </div>

        {selectedGroup && (
          <div className="mb-8 bg-gray-700 p-4 rounded-lg">
            <GroupPageContent 
              group={selectedGroup} 
              currentUser={currentUser} 
              isAdmin={selectedGroup.adminId === currentUser.family?.id}
            />
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Join Group</h2>
          <JoinGroupForm onGroupJoined={handleGroupCreated} />
        </div>

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
            <CreateGroupForm onGroupCreated={handleGroupCreated} />
          </div>
        )}
      </div>
    </div>
  );
}