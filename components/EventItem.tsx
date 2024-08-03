import React, { useEffect } from 'react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { EventWithRelations } from '@/types/app';
import { Users, Award } from 'lucide-react';

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

  const displayFamilyName = isCreator ? event.creatorFamily?.name : event.family?.name;
  const familyImageUrl = event.family?.image || `/api/placeholder/400/300`;

  useEffect(() => {
    console.log('EventItem rendered', event.id, familyImageUrl);
  });

  console.log('Event:', event);
  console.log('Family Image URL:', familyImageUrl);
  console.log('Family:', event.family);
  console.log('Creator Family:', event.creatorFamily);

  const formatEventDate = (date: string | Date) => {
    try {
      const parsedDate = typeof date === 'string' ? parseISO(date) : date;
      return format(parsedDate, "EEEE do MMMM");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date unavailable";
    }
  };

  const formatEventTime = (startDate: string | Date, endDate: string | Date) => {
    try {
      const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
      const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
      return `${format(start, "h:mma")}-${format(end, "h:mma")}`.toLowerCase();
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Time unavailable";
    }
  };

  const getStatusDisplay = () => {
    if (isAccepted) return 'Accepted';
    if (isCreator) return 'Pending';
    return 'Open';
  };

  const getStatusColor = () => {
    if (isAccepted) return '#10B981'; // green
    if (isCreator) return '#EF4444'; // red
    return '#c9fb00'; // lime for 'open'
  };

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg bg-gray-950 text-white w-full md:w-80 transition-all duration-300 hover:shadow-xl">
      <div className="h-48 relative">
        <Image 
          src={familyImageUrl}
          alt={`${displayFamilyName} Family`}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            console.error('Image load error:', e);
            const target = e.target as HTMLImageElement;
            target.src = `/api/placeholder/400/300`;
          }}
          unoptimized={familyImageUrl.startsWith('/api')}
          priority={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute top-2 left-2 p-2 bg-gray-950 bg-opacity-50 rounded">
          <h3 className="text-lg font-bold text-white">{event.name}</h3>
        </div>
        <div className="absolute bottom-2 left-2 inline-block p-2 bg-gray-950 bg-opacity-50 rounded">
          <span className="text-sm text-white block">{formatEventDate(event.startTime)}</span>
          <span className="text-sm text-white block">{formatEventTime(event.startTime, event.endTime)}</span>
        </div>
        <div className="absolute top-2 right-2 px-2 py-1 rounded text-lg font-semibold" style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: getStatusColor()
        }}>
          {getStatusDisplay()}
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-300 mb-4 h-12 overflow-hidden">{event.description || 'No description provided'}</p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-300">
            <Users className="w-4 h-4 mr-2" />
            <span>{displayFamilyName}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Award className="w-4 h-4 mr-2" />
            <span>Points: {event.points}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {isCreator && (
            <>
              <button onClick={() => onEdit(event.id)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                Edit
              </button>
              <button onClick={() => onDelete(event.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                Delete
              </button>
            </>
          )}
          {!isCreator && isAccepted && (
            <button onClick={() => onCancel(event.id)} className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors">
              Cancel
            </button>
          )}
          {!isCreator && isPending && !isRejected && (
            <>
              <button onClick={() => onAccept(event.id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                Accept
              </button>
              <button onClick={() => onReject(event.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                Reject
              </button>
            </>
          )}
          {!isCreator && isPending && isRejected && (
            <button onClick={() => onReject(event.id)} className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors">
              Unreject
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventItem;