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
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Invitee Email"
        required
      />
      <button type="submit">Send Invitation</button>
      {message && <p style={{ color: isError ? 'red' : 'green' }}>{message}</p>}
    </form>
  );
}