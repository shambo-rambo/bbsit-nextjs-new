// components/EventItem.tsx

'use client';

import React from 'react';
import { formatDate } from '@/lib/dateUtils';
import { EventWithRelations } from '@/types/app';

interface EventItemProps {
  event: EventWithRelations;
  currentFamilyId: string;
  onAccept: (eventId: string) => void;
  onReject: (eventId: string) => void;
  onEdit: (eventId: string) => void;
  onDelete: (eventId: string) => void;
  onCancel: (eventId: string) => void;
  isAdmin: boolean;
}

const EventItem: React.FC<EventItemProps> = ({ 
  event, 
  currentFamilyId, 
  onAccept, 
  onReject, 
  onEdit, 
  onDelete, 
  onCancel,
  isAdmin
}) => {
  const isCreator = event.creatorFamilyId === currentFamilyId;
  const isPending = event.status === 'pending';
  const isAccepted = event.status === 'accepted';
  const isRejected = event.rejectedFamilies?.includes(currentFamilyId);

  const displayFamilyName = isCreator ? event.creatorFamily?.name : event.family.name;

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-xl font-semibold text-white mb-2">{event.name}</h3>
      <p className="text-gray-300 mb-2">{event.description || 'No description provided'}</p>
      <p className="text-gray-300 mb-2">
        Start: {formatDate(new Date(event.startTime))}
      </p>
      <p className="text-gray-300 mb-2">
        End: {formatDate(new Date(event.endTime))}
      </p>
      <p className="text-gray-300 mb-2">Points: {event.points}</p>
      <p className="text-gray-300 mb-4">
        Status: {isAccepted ? `Accepted by ${displayFamilyName}` : event.status}
      </p>
      {isCreator && (
        <div className="flex space-x-2">
          <button onClick={() => onEdit(event.id)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Edit
          </button>
          <button onClick={() => onDelete(event.id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Delete
          </button>
        </div>
      )}
      {!isCreator && isAccepted && (
        <button onClick={() => onCancel(event.id)} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
          Cancel
        </button>
      )}
      {!isCreator && isPending && !isRejected && (
        <div className="flex space-x-2">
          <button onClick={() => onAccept(event.id)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Accept
          </button>
          <button onClick={() => onReject(event.id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Reject
          </button>
        </div>
      )}
      {!isCreator && isPending && isRejected && (
        <button onClick={() => onReject(event.id)} className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
          Unreject
        </button>
      )}
    </div>
  );
};

export default EventItem;