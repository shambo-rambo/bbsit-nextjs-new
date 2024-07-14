// components/CreateFamilyForm.tsx

'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface User {
  id: string;
  email: string;
  name: string | null;
}

export default function CreateFamilyForm({ user }: { user: User }) {
  const [step, setStep] = useState(1);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [familyName, setFamilyName] = useState(user.name?.split(' ').pop() || user.email?.split('@')[0] || '');
  const [homeAddress, setHomeAddress] = useState('');
  const [childrenCount, setChildrenCount] = useState(0);
  const [childrenNames, setChildrenNames] = useState<string[]>([]);
  const [hasPartner, setHasPartner] = useState(true);
  const router = useRouter();
  const { data: session, update } = useSession();

  const handlePartnerCheck = async () => {
    if (!hasPartner) {
      setStep(2);
      return;
    }
    const response = await fetch(`/api/family/check-partner?email=${partnerEmail}`);
    const data = await response.json();

    if (data.hasFamily) {
      alert("This user already belongs to a family.");
    } else {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const familyData = {
      userId: user.id,
      partnerEmail: hasPartner ? partnerEmail : null,
      familyName,
      homeAddress,
      childrenNames,
    };

    try {
      const response = await fetch('/api/family/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(familyData),
      });

      if (response.ok) {
        const result = await response.json();
        // Update the session to reflect that the user is now an admin
        if (session && session.user) {
          await update({
            ...session,
            user: {
              ...session.user,
              isAdmin: true,
              familyId: result.id
            }
          });
        }
        router.push('/family/dashboard'); // Redirect to family dashboard or appropriate page
      } else {
        const errorData = await response.json();
        alert(`Failed to create family: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error creating family:', error);
      alert('An error occurred while creating the family. Please try again.');
    }
  };

  const inputClass = "w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent";
  const buttonClass = "w-full px-4 py-2 bg-accent text-black font-semibold rounded-lg hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";

  if (step === 1) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-accent">Partner Information</h2>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="hasPartner"
            checked={hasPartner}
            onChange={(e) => setHasPartner(e.target.checked)}
            className="rounded border-gray-300 text-accent focus:ring-accent"
          />
          <label htmlFor="hasPartner" className={labelClass}>
            I have a partner
          </label>
        </div>
        {hasPartner && (
          <div>
            <label htmlFor="partnerEmail" className={labelClass}>Partner&apos;s email</label>
            <input
              id="partnerEmail"
              type="email"
              value={partnerEmail}
              onChange={(e) => setPartnerEmail(e.target.value)}
              placeholder="partner@example.com"
              className={inputClass}
            />
          </div>
        )}
        <button onClick={handlePartnerCheck} className={buttonClass}>
          Next
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="familyName" className={labelClass}>Family Name</label>
        <input
          id="familyName"
          type="text"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          placeholder="e.g., The Smiths"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="homeAddress" className={labelClass}>Home Address</label>
        <input
          id="homeAddress"
          type="text"
          value={homeAddress}
          onChange={(e) => setHomeAddress(e.target.value)}
          placeholder="123 Main St, City, Country"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="childrenCount" className={labelClass}>Number of Children</label>
        <input
          id="childrenCount"
          type="number"
          value={childrenCount}
          onChange={(e) => {
            const count = parseInt(e.target.value);
            setChildrenCount(count);
            setChildrenNames(Array(count).fill(''));
          }}
          placeholder="0"
          min="0"
          required
          className={inputClass}
        />
      </div>
      {childrenNames.map((name, index) => (
        <div key={index}>
          <label htmlFor={`child${index}`} className={labelClass}>Child {index + 1} Name</label>
          <input
            id={`child${index}`}
            type="text"
            value={name}
            onChange={(e) => {
              const newNames = [...childrenNames];
              newNames[index] = e.target.value;
              setChildrenNames(newNames);
            }}
            placeholder={`Child ${index + 1} Name`}
            required
            className={inputClass}
          />
        </div>
      ))}
      <button type="submit" className={buttonClass}>Create Family</button>
    </form>
  );
}