// components/EventList.tsx

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import EventItem from './EventItem';
import CreateEventForm from './CreateEventForm';
import { EventWithRelations, EventListProps } from '@/types/app';

const EventList: React.FC<EventListProps> = ({ groupId, familyId, events: initialEvents, isAdmin }) => {
  const [events, setEvents] = useState<EventWithRelations[]>(initialEvents);
  const [editingEvent, setEditingEvent] = useState<EventWithRelations | null>(null);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch(`/api/events?groupId=${groupId}&familyId=${familyId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data: EventWithRelations[] = await response.json();
      console.log('Fetched events:', data); // Log fetched events
      setEvents(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again later.');
    }
  }, [groupId, familyId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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

  const handleAccept = (eventId: string) => handleAction(eventId, 'POST', 'update-status', { status: 'accepted' });
  const handleReject = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    const action = event?.status === 'rejected' ? 'unreject' : 'reject';
    handleAction(eventId, 'POST', 'update-status', { action });
  };
  const handleDelete = (eventId: string) => handleAction(eventId, 'DELETE', 'delete', {});
  const handleCancel = (eventId: string) => handleAction(eventId, 'POST', 'cancel', {});

  const handleEdit = (eventId: string) => {
    const eventToEdit = events.find(event => event.id === eventId);
    if (eventToEdit) {
      setEditingEvent(eventToEdit);
      setIsCreatingEvent(false);
    }
  };

  const handleEventUpdated = () => {
    setEditingEvent(null);
    setIsCreatingEvent(false);
    fetchEvents();
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      {(editingEvent || isCreatingEvent) ? (
        <CreateEventForm
          groupId={groupId}
          familyId={familyId}
          onEventCreated={handleEventUpdated}
          editingEvent={editingEvent}
        />
      ) : (
        events.map((event) => (
          <EventItem
            key={event.id}
            event={event}
            currentFamilyId={familyId}
            onAccept={handleAccept}
            onReject={handleReject}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCancel={handleCancel}
            isAdmin={isAdmin}
          />
        ))
      )}
    </div>
  );
};

export default EventList;