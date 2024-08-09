// bbsit-deploy/components/FamilySettings.tsx

'use client'
import { useState } from 'react';
import FamilySettingsForm from '@/components/FamilySettingsForm';
import { UserWithRelations, Family } from '@/types/app';

interface FamilySettingsProps {
  family: Family;
  currentUser: UserWithRelations;
}

export default function FamilySettings({ family, currentUser }: FamilySettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasGroups = family.adminOfGroups?.length > 0 ?? false;

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
          <FamilySettingsForm 
            family={family} 
            currentUser={currentUser} 
            hasGroups={hasGroups}
          />
        </div>
      )}
    </div>
  );
}