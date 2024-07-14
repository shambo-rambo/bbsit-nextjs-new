'use client'
import { useState } from 'react';
import { FamilyDashboardData } from '@/types/app';

interface FamilyInfoProps {
  family: FamilyDashboardData;
  currentUserId: string;
}

export default function FamilyInfo({ family, currentUserId }: FamilyInfoProps) {
  const [newAdminId, setNewAdminId] = useState('');

  const handleAdminTransfer = async () => {
    try {
      const response = await fetch('/api/family/transfer-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyId: family.id, newAdminId }),
      });

      if (response.ok) {
        alert('Admin rights transferred successfully');
        // Optionally refresh the page or update state
      } else {
        const errorData = await response.json();
        alert(`Failed to transfer admin rights: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error transferring admin rights:', error);
      alert('An error occurred while transferring admin rights');
    }
  };

  return (
    <div className="family-info">
      <h2 className="text-xl font-bold mb-4">Family Information</h2>
      <p><strong>Name:</strong> {family.name}</p>
      <p><strong>Address:</strong> {family.homeAddress}</p>
      <p><strong>Points:</strong> {family.points}</p>
      
      <h3 className="text-lg font-semibold mt-4 mb-2">Members</h3>
      <ul>
        {family.members.map(member => (
          <li key={member.id}>
            {member.name || member.email}
            {member.id === family.currentAdminId && ' (Admin)'}
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">Children</h3>
      <ul>
        {family.children.map(child => (
          <li key={child.id}>{child.name}</li>
        ))}
      </ul>

      {family.currentAdminId === currentUserId && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Transfer Admin Rights</h3>
          <select 
            value={newAdminId} 
            onChange={(e) => setNewAdminId(e.target.value)}
            className="border rounded px-2 py-1 mr-2"
          >
            <option value="">Select new admin</option>
            {family.members
              .filter(member => member.id !== currentUserId)
              .map(member => (
                <option key={member.id} value={member.id}>
                  {member.name || member.email}
                </option>
              ))
            }
          </select>
          <button 
            onClick={handleAdminTransfer}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
          >
            Transfer Admin Rights
          </button>
        </div>
      )}
    </div>
  );
}