// components/EventList.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import EventItem from './EventItem';
import { EventWithRelations, EventListProps, FamilyMember } from '@/types/app';

const EventList: React.FC<EventListProps> = ({ groupId, familyId, events: initialEvents, isAdmin }) => {
  const [events, setEvents] = useState<EventWithRelations[]>(initialEvents);
  const [error, setError] = useState<string | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch(`/api/events?groupId=${groupId}&familyId=${familyId}`, { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const eventsData: EventWithRelations[] = await response.json();
      setEvents(eventsData);
      setError(null);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again later.');
    }
  }, [groupId, familyId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const response = await fetch(`/api/family/${familyId}/members`, { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Failed to fetch family members');
        }
        const data = await response.json();
        setFamilyMembers(data.members);
      } catch (error) {
        console.error('Error fetching family members:', error);
      }
    };
    fetchFamilyMembers();
  }, [familyId]);

  const handleAction = useCallback(async (eventId: string, method: 'POST' | 'DELETE', action: string, body: Record<string, unknown>) => {
    try {
      const endpoint = action === 'delete' ? `/api/event/${eventId}` : `/api/event/${eventId}/${action}`;
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} event`);
      }
      await fetchEvents();
      setError(null);
    } catch (error) {
      console.error(`Error ${action}ing event:`, error);
      setError(`Failed to ${action} event. Please try again.`);
    }
  }, [fetchEvents]);

  const handleAccept = useCallback((eventId: string, memberId: string, memberName: string) => 
    handleAction(eventId, 'POST', 'update-status', { status: 'accepted', memberId, memberName }),
  [handleAction]);

  const handleReject = useCallback((eventId: string) => 
    handleAction(eventId, 'POST', 'update-status', { status: 'rejected' }),
  [handleAction]);

  const handleEdit = useCallback((eventId: string) => {
    console.log('Edit event:', eventId);
  }, []);

  const handleDelete = useCallback((eventId: string) => 
    handleAction(eventId, 'DELETE', 'delete', {}),
  [handleAction]);

  const handleCancel = useCallback((eventId: string) => 
    handleAction(eventId, 'POST', 'cancel', {}),
  [handleAction]);

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
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

export default EventList;