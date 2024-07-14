'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteFamilyButtonProps {
  familyId: string;
  isAdmin: boolean;
  hasGroups: boolean;
}

export default function DeleteFamilyButton({ familyId, isAdmin, hasGroups }: DeleteFamilyButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (hasGroups) {
      alert('You must transfer admin rights of all groups before deleting the family.');
      return;
    }

    try {
      const response = await fetch('/api/family/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyId }),
      });

      if (response.ok) {
        router.push('/family/dashboard');
      } else {
        const error = await response.json();
        alert(`Failed to delete family: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting family:', error);
      alert('An error occurred while deleting the family.');
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (isConfirming) {
    return (
      <div className="mt-4 bg-red-600 p-4 rounded-lg">
        <p className="mb-2 text-white">Are you sure you want to delete this family? This action cannot be undone.</p>
        <div className="flex space-x-2">
          <button
            onClick={handleDelete}
            className="bg-white text-red-600 font-bold py-2 px-4 rounded hover:bg-gray-200 transition-colors"
          >
            Yes, Delete Family
          </button>
          <button
            onClick={() => setIsConfirming(false)}
            className="bg-gray-800 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors"
    >
      Delete Family
    </button>
  );
}