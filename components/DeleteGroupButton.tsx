'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteGroupButtonProps {
  groupId: string;
}

export default function DeleteGroupButton({ groupId }: DeleteGroupButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/group/${groupId}/delete`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/groups/dashboard');
      } else {
        const error = await response.json();
        alert(`Failed to delete group: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      alert('An error occurred while deleting the group.');
    }
  };

  if (isConfirming) {
    return (
      <div>
        <p className="mb-2 text-red-600">Are you sure you want to delete this group? This action cannot be undone.</p>
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Yes Delete Group
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Delete Group
    </button>
  );
}