// bbsit-deploy/components/EventList.tsx

'use client';

import React, { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import EventItem from './EventItem';
import { EventWithRelations, EventListProps, FamilyMember } from '@/types/app';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json());

const EventList: React.FC<EventListProps> = ({ groupId, familyId, isAdmin }) => {
  const { data: events, error: eventsError, mutate: mutateEvents } = useSWR<EventWithRelations[]>(
    `/api/events?groupId=${groupId}&familyId=${familyId}`,
    fetcher
  );
  
  const { data: familyMembersData, error: familyError } = useSWR<{ members: FamilyMember[] }>(
    `/api/family/${familyId}/members`,
    fetcher
  );

  const handleAction = useCallback(async (eventId: string, method: 'POST' | 'DELETE', action: string, body: Record<string, unknown>) => {
    // ... (rest of the handleAction function remains the same)
  }, [events, mutateEvents]);

  const handleAccept = useCallback((eventId: string, memberId: string, memberName: string) => {
    // ... (rest of the handleAccept function remains the same)
  }, [handleAction]);

  const handleReject = useCallback((eventId: string) => 
    handleAction(eventId, 'POST', 'update-status', { status: 'rejected' }), [handleAction]);

  const handleEdit = useCallback((eventId: string) => {
    console.log('Edit event:', eventId);
  }, []);

  const handleDelete = useCallback((eventId: string) => 
    handleAction(eventId, 'DELETE', 'delete', {}), [handleAction]);

  const handleCancel = useCallback((eventId: string) => 
    handleAction(eventId, 'POST', 'cancel', {}), [handleAction]);

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    const now = new Date();
    return events.filter(event => new Date(event.endTime) > now);
  }, [events]);

  if (eventsError || familyError) return <div>Failed to load</div>;
  if (!events || !familyMembersData) return <LoadingSpinner />;

  const familyMembers = familyMembersData.members;

  if (!Array.isArray(familyMembers)) {
    console.error('Family members data is not an array:', familyMembersData);
    return <div>Error: Invalid family members data</div>;
  }

  return (
    <div className="space-y-4">
      {filteredEvents.map((event) => (
        <EventItem
          key={event.id}
          event={event}
          currentFamilyId={familyId}
          familyMembers={familyMembers}
          onAccept={handleAccept}
          onReject={handleReject}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCancel={handleCancel}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};

export default React.memo(EventList);