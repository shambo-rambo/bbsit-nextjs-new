// components/EventList.tsx

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import EventItem from './EventItem';
import { EventWithRelations, EventListProps } from '@/types/app';

const EventList: React.FC<EventListProps> = ({ groupId, familyId, events: initialEvents, isAdmin }) => {
  const [events, setEvents] = useState<EventWithRelations[]>(initialEvents);
  const [familyMembers, setFamilyMembers] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch(`/api/events?groupId=${groupId}&familyId=${familyId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data: EventWithRelations[] = await response.json();
      console.log('Fetched events:', data);
      setEvents(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again later.');
    }
  }, [groupId, familyId]);

  const fetchFamilyMembers = useCallback(async () => {
    try {
      const response = await fetch(`/api/family/${familyId}/members`);
      if (response.ok) {
        const data = await response.json();
        setFamilyMembers(data.members);
      } else {
        console.error('Failed to fetch family members');
      }
    } catch (error) {
      console.error('Error fetching family members:', error);
    }
  }, [familyId]);

  useEffect(() => {
    fetchEvents();
    fetchFamilyMembers();
  }, [fetchEvents, fetchFamilyMembers]);

  const handleAction = async (eventId: string, method: 'POST' | 'DELETE', action: string, body: Record<string, unknown>) => {
    try {
      const endpoint = action === 'delete' ? `/api/event/${eventId}` : `/api/event/${eventId}/${action}`;
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
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
  };

  const handleAccept = async (eventId: string, memberId: string, memberName: string) => {
    try {
      const response = await fetch(`/api/event/${eventId}/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'accepted', memberId, memberName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to accept event');
      }

      await fetchEvents();
      setError(null);
    } catch (error) {
      console.error('Error accepting event:', error);
      setError('Failed to accept event. Please try again.');
    }
  };
  const handleReject = (eventId: string) => handleAction(eventId, 'POST', 'update-status', { status: 'rejected' });
  const handleEdit = (eventId: string) => {/* Implement edit logic */};
  const handleDelete = (eventId: string) => handleAction(eventId, 'DELETE', 'delete', {});
  const handleCancel = (eventId: string) => handleAction(eventId, 'POST', 'cancel', {});

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