// bbsit-deploy/components/EventItemWrapper.tsx

"use client";

import React, { useState, useEffect } from 'react';
import EventItem from '@/components/EventItem';
import { EventWithRelations, FamilyMember, FamilyWithFullDetails } from '@/types/app';

interface EventItemWrapperProps {
  event: EventWithRelations;
  currentFamilyId: string;
  familyData: FamilyWithFullDetails | null;
  isAdmin: boolean;
}

const EventItemWrapper: React.FC<EventItemWrapperProps> = ({ event, currentFamilyId, familyData, isAdmin }) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[] | undefined>(undefined);

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
        throw new Error(errorData.error || 'Failed to accept event');
      }
  
      const updatedEvent = await response.json();
      console.log(`Event accepted successfully by ${memberName}`, updatedEvent);
      // Update your local state or trigger a re-fetch of events here
    } catch (error) {
      console.error('Error accepting event:', error);
      // Show an error message to the user
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