// bbsit-deploy/components/EventItemWrapper.tsx

"use client";

import React, { useState, useEffect } from 'react';
import EventItem from '@/components/EventItem';
import { EventWithRelations } from '@/types/app';

interface EventItemWrapperProps {
  event: EventWithRelations;
  currentFamilyId: string;
  isAdmin: boolean;
}

const EventItemWrapper: React.FC<EventItemWrapperProps> = ({ event, currentFamilyId, isAdmin }) => {
  const [familyMembers, setFamilyMembers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const response = await fetch(`/api/family/${currentFamilyId}/members`);
        if (response.ok) {
          const data = await response.json();
          setFamilyMembers(data.members);
        } else {
          console.error('Failed to fetch family members');
        }
      } catch (error) {
        console.error('Error fetching family members:', error);
      }
    };

    if (currentFamilyId) {
      fetchFamilyMembers();
    }
  }, [currentFamilyId]);

  const handleAccept = async (eventId: string, memberId: string) => {
    try {
      const response = await fetch(`/api/event/${eventId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId }),
      });

      if (response.ok) {
        // Handle successful acceptance
        console.log('Event accepted successfully');
        // You might want to refresh the event data or update the UI here
      } else {
        console.error('Failed to accept event');
      }
    } catch (error) {
      console.error('Error accepting event:', error);
    }
  };

  const handleReject = async (eventId: string) => {
    console.log('Reject event:', eventId);
    // TODO: Implement reject logic
  };

  const handleEdit = async (eventId: string) => {
    console.log('Edit event:', eventId);
    // TODO: Implement edit logic
  };

  const handleDelete = async (eventId: string) => {
    console.log('Delete event:', eventId);
    // TODO: Implement delete logic
  };

  const handleCancel = async (eventId: string) => {
    console.log('Cancel event:', eventId);
    // TODO: Implement cancel logic
  };

  return (
    <EventItem
      event={event}
      currentFamilyId={currentFamilyId}
      familyMembers={familyMembers}
      onAccept={handleAccept}
      onReject={handleReject}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCancel={handleCancel}
      isAdmin={isAdmin}
    />
  );
};

export default EventItemWrapper;