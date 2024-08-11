// @/components/EventsDashboardContent.tsx

'use client';

import { useState, useEffect } from 'react';
import EventList from '@/components/EventList';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import Link from 'next/link';

type Props = {
  familyId: string;
  groups: { id: string; name: string }[];
  adminGroupIds: string[];
};

export function EventsDashboardContent({ familyId, groups, adminGroupIds }: Props) {
  const [groupsWithEvents, setGroupsWithEvents] = useState<Array<{ id: string; name: string; events: any[] }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupEvents = async () => {
      const groupPromises = groups.map(async (group) => {
        const res = await fetch(`/api/events?groupId=${group.id}&familyId=${familyId}`);
        if (!res.ok) {
          console.error(`Failed to fetch events for group ${group.id}`);
          return { ...group, events: [] };
        }
        const events = await res.json();
        return { ...group, events };
      });

      const groupsWithEvents = await Promise.all(groupPromises);
      setGroupsWithEvents(groupsWithEvents);
      setLoading(false);
    };

    fetchGroupEvents();
  }, [familyId, groups]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-accent">Events</h1>
      {groupsWithEvents.map((group) => {
        const isAdmin = adminGroupIds.includes(group.id);
        return (
          <div key={group.id} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Group: {group.name}</h2>
            <EventList 
              groupId={group.id} 
              familyId={familyId}
              events={group.events}
              isAdmin={isAdmin}
            />
          </div>
        );
      })}
      {groupsWithEvents.length === 0 && (
        <div className="text-center">
          <p className="text-lg mb-4">You&apos;re not part of any groups yet.</p>
          <Link href="/groups/join" className="px-6 py-2 bg-accent text-black rounded-full hover:bg-opacity-90 transition-colors">
            Join a Group
          </Link>
        </div>
      )}
    </div>
  );
}