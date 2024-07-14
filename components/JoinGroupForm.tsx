'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinGroupForm() {
  const [inviteCode, setInviteCode] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/group/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteCode }),
    });

    if (response.ok) {
      router.refresh();
      setInviteCode('');
    } else {
      const error = await response.json();
      alert(`Failed to join group: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-300">
          Invite Code
        </label>
        <input
          type="text"
          id="inviteCode"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          required
          className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-black bg-accent hover:bg-accent-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
      >
        Join Group
      </button>
    </form>
  );
}
