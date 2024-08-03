// components/InviteForm.tsx

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
    <form onSubmit={handleSubmit}>
      <input
        className='bg-white text-black p-2 mb-2'
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Partner Email"
        required
      />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" 
      type="submit">Send Invitation</button>
      {message && <p style={{ color: isError ? 'red' : 'green' }}>{message}</p>}
    </form>
  );
}