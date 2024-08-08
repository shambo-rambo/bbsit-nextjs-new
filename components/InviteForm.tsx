'use client'
import { useState } from 'react';

export default function InviteForm({ familyId }: { familyId: string }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    const res = await fetch('/api/family/send-invitation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteeEmail: email }),
    });

    if (res.ok) {
      setEmail('');
      setMessage('Invitation sent successfully!');
    } else {
      setIsError(true);
      setMessage('Failed to send invitation. Please try again.');
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Invite Partner</h3>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-center">
        <input
          className="border rounded px-2 py-1 mb-2 sm:mb-0 sm:mr-2 bg-white text-black w-full sm:w-auto"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Partner Email"
          required
        />
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded w-full sm:w-auto"
          type="submit"
        >
          Send Invitation
        </button>
      </form>
      {message && <p className={`mt-2 ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
    </div>
  );
}