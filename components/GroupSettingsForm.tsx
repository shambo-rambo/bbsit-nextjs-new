// bbsit-deploy/components/GroupSettingsForm.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Group, Family, User, FamilyGroupPoints, Event } from '@prisma/client';

interface GroupWithRelations extends Group {
  admin: Family;
  members: Family[];
  events: Event[];
  familyPoints: FamilyGroupPoints[];
}

interface UserWithRelations extends User {
  family: Family | null;
}

interface GroupSettingsFormProps {
  group: GroupWithRelations;
  currentUser: UserWithRelations;
}

const GroupSettingsForm: React.FC<GroupSettingsFormProps> = ({ group, currentUser }) => {
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description || '');
  const router = useRouter();

  const handleUpdateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`/api/group/${group.id}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });

    if (response.ok) {
      router.refresh();
    } else {
      const error = await response.json();
      alert(`Failed to update group: ${error.message}`);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    // Implement member removal logic here
    console.log('Removing member:', memberId);
    // You'll need to create an API endpoint for this and handle the response
  };

  const handleDeleteGroup = async () => {
    if (confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      const response = await fetch(`/api/group/${group.id}/delete`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/groups'); // Redirect to groups list after deletion
      } else {
        const error = await response.json();
        alert(`Failed to delete group: ${error.message}`);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Edit Group Details</h3>
        <form onSubmit={handleUpdateGroup} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Group Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Group
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Manage Members</h3>
        <ul className="space-y-2">
          {group.members.map((member) => {
            const memberPoints = group.familyPoints.find(fp => fp.familyId === member.id)?.points || 0;
            return (
              <li key={member.id} className="flex justify-between items-center bg-gray-950 p-2 rounded">
                <span>{member.name}</span>
                <span className="bg-blue-500 text-white px-2 py-1 rounded">{memberPoints} points</span>
                {member.id !== group.adminId && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    Remove
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Manage Events</h3>
        <ul className="space-y-2">
          {group.events.map((event) => (
            <li key={event.id} className="flex justify-between items-center bg-gray-950 p-2 rounded">
              <span>{event.name}</span>
              <span>{new Date(event.startTime).toLocaleDateString()}</span>
              <span>{event.status}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <button
          onClick={handleDeleteGroup}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Delete Group
        </button>
      </div>
    </div>
  );
};

export default GroupSettingsForm;