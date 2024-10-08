// components/FamilySettings.tsx

'use client'
import { useState, useEffect } from 'react';
import FamilySettingsForm from '@/components/FamilySettingsForm';
import { Family, User } from '@/types/app'; // Import these types if they're not already imported

interface FamilySettingsProps {
  familyId: string;
  currentUser: User;
  hasGroups: boolean;
}

export default function FamilySettings({ familyId, currentUser, hasGroups }: FamilySettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [familyData, setFamilyData] = useState<Family | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !familyData) {
      setLoading(true);
      fetch(`/api/family/${familyId}`)
        .then(res => res.json())
        .then((data: Family) => {
          setFamilyData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching family data:', error);
          setLoading(false);
        });
    }
  }, [isOpen, familyId, familyData]);

  return (
    <div className="mt-6">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full px-6 py-2 bg-accent text-black font-semibold rounded-lg transition duration-300 ease-in-out hover:opacity-90"
      >
        {isOpen ? 'Close Family Settings' : 'Open Family Settings'}
      </button>
      {isOpen && (
        <div className="mt-4">
          {loading ? (
            <p>Loading family data...</p>
          ) : familyData ? (
            <FamilySettingsForm 
              family={familyData}
              currentUser={currentUser}
              hasGroups={hasGroups}
            />
          ) : (
            <p>Error loading family data. Please try again.</p>
          )}
        </div>
      )}
    </div>
  );
}