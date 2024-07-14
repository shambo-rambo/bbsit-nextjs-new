'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DeleteFamilyButton from './DeleteFamilyButton';

interface User {
  id: string;
  name: string | null;
  email: string;
  isAdmin: boolean;
}

interface Child {
  id: string;
  name: string;
}

interface Family {
  id: string;
  name: string;
  homeAddress: string;
  members: User[];
  children: Child[];
  adminOfGroups: any[];
}

interface FamilySettingsFormProps {
  family: Family;
  currentUser: User;
}

export default function FamilySettingsForm({ family, currentUser }: FamilySettingsFormProps) {
  const [familyName, setFamilyName] = useState(family.name);
  const [homeAddress, setHomeAddress] = useState(family.homeAddress);
  const [children, setChildren] = useState(family.children);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/family/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        familyId: family.id, 
        name: familyName, 
        homeAddress, 
        children: children.map(child => ({ id: child.id, name: child.name }))
      }),
    });

    if (response.ok) {
      router.refresh();
    } else {
      console.error('Failed to update family');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    const response = await fetch(`/api/family/remove-member`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ familyId: family.id, memberId }),
    });

    if (response.ok) {
      router.refresh();
    } else {
      console.error('Failed to remove member');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-white max-w-3xl mx-auto">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Family Information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="familyName" className="block text-sm font-medium mb-1">Family Name</label>
            <input
              id="familyName"
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              required
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <div>
            <label htmlFor="homeAddress" className="block text-sm font-medium mb-1">Home Address</label>
            <input
              id="homeAddress"
              type="text"
              value={homeAddress}
              onChange={(e) => setHomeAddress(e.target.value)}
              required
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Children</h2>
        <div className="space-y-3">
          {children.map((child, index) => (
            <div key={child.id}>
              <input
                type="text"
                value={child.name}
                onChange={(e) => {
                  const newChildren = [...children];
                  newChildren[index].name = e.target.value;
                  setChildren(newChildren);
                }}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder={`Child ${index + 1} name`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Family Members</h2>
        <div className="space-y-3">
          {family.members.map((member) => (
            <div key={member.id} className="flex justify-between items-center">
              <span>{member.name} ({member.email})</span>
              {member.id !== currentUser.id && (
                <button 
                  type="button" 
                  onClick={() => handleRemoveMember(member.id)}
                  className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button type="submit" className="px-6 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 transition-colors">
          Update Family
        </button>
        <DeleteFamilyButton 
          familyId={family.id} 
          isAdmin={currentUser.isAdmin} 
          hasGroups={family.adminOfGroups.length > 0} 
        />
      </div>
    </form>
  );
}