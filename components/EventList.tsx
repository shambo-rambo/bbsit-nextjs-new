// bbsit-deploy/components/EventList.tsx

import React, { useCallback } from 'react';
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
  
  const { data: familyMembers, error: familyError } = useSWR<FamilyMember[]>(
    `/api/family/${familyId}/members`,
    fetcher
  );

  const handleAction = useCallback(async (eventId: string, method: 'POST' | 'DELETE', action: string, body: Record<string, unknown>) => {
    const endpoint = action === 'delete' ? `/api/event/${eventId}` : `/api/event/${eventId}/${action}`;
    
    // Optimistic update
    const optimisticData = events?.map(event => 
      event.id === eventId 
        ? { ...event, status: (body.status as string) || event.status } 
        : event
    );
    
    const updatedEvents = action === 'delete'
      ? optimisticData?.filter(event => event.id !== eventId)
      : optimisticData;
  
    try {
      await mutateEvents(updatedEvents, false);
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error(`Failed to ${action} event`);
      }
  
      // Revalidate after successful action
      mutateEvents();
    } catch (error) {
      console.error(`Error ${action}ing event:`, error);
      // Revert optimistic update on error
      mutateEvents();
    }
  }, [events, mutateEvents]);

  const handleAccept = useCallback((eventId: string, memberId: string, memberName: string) => 
    handleAction(eventId, 'POST', 'update-status', { status: 'accepted', memberId, memberName }), [handleAction]);

  const handleReject = useCallback((eventId: string) => 
    handleAction(eventId, 'POST', 'update-status', { status: 'rejected' }), [handleAction]);

  const handleEdit = useCallback((eventId: string) => {
    console.log('Edit event:', eventId);
  }, []);

  const handleDelete = useCallback((eventId: string) => 
    handleAction(eventId, 'DELETE', 'delete', {}), [handleAction]);

  const handleCancel = useCallback((eventId: string) => 
    handleAction(eventId, 'POST', 'cancel', {}), [handleAction]);

  if (eventsError || familyError) return <div>Failed to load</div>;
  if (!events || !familyMembers) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      {events.map((event) => (
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