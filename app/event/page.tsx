'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CreateEventForm from '@/components/CreateEventForm';
import { Group } from '@/types/app';
import Link from 'next/link';

export default function EventPage() {
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchUserGroups();
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return <div className="text-white text-center mt-8">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/auth');
    return null;
  }

  const handleEventCreated = () => {
    console.log('Event created successfully');
    router.push('/groups/dashboard');
  };

  if (!session?.user?.familyId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Create New Event</h1>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-white mb-4">
            It looks like you haven&apos;t set up your family yet. You need to be part of a family to create an event.
          </p>
          <Link href="/family/create" className="inline-block px-6 py-2 bg-accent text-black rounded-full hover:bg-opacity-90 transition-colors">
            Create Family Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Create New Event</h1>
      {userGroups.length > 0 ? (
        <CreateEventForm
          groups={userGroups}
          familyId={session.user.familyId}
          onEventCreated={handleEventCreated}
        />
      ) : (
        <p className="text-white bg-gray-800 p-6 rounded-lg shadow-lg">
          You need to be part of at least one group to create an event. Please join or create a group first.
        </p>
      )}
    </div>
  );
}