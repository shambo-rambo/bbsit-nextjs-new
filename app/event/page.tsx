// app/event/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CreateEventForm from '@/components/CreateEventForm';
import { Group } from '@/types/app';

export default function EventPage() {
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const response = await fetch('/api/user/groups');
        if (response.ok) {
          const groups = await response.json();
          setUserGroups(groups);
        } else {
          console.error('Failed to fetch user groups');
        }
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    if (status === 'authenticated') {
      fetchUserGroups();
    }
  }, [status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/auth');
    return null;
  }

  const handleEventCreated = () => {
    // You can add any additional logic here if needed
    console.log('Event created successfully');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Create New Event</h1>
      {session?.user?.familyId && userGroups.length > 0 ? (
        <CreateEventForm
          groups={userGroups}
          familyId={session.user.familyId}
          onEventCreated={handleEventCreated}
        />
      ) : (
        <p className="text-white">Loading groups or no groups available.</p>
      )}
    </div>
  );
}