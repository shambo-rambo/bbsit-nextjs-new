import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { EventWithRelations, FamilyMember } from '@/types/app';
import { Users, Award, Calendar, ChevronDown, Clock } from 'lucide-react';
import ShareButton from '@/components/ShareButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EventItemProps {
  event: EventWithRelations;
  currentFamilyId: string;
  familyMembers: FamilyMember[] | undefined;
  onAccept: (eventId: string, memberId: string, memberName: string) => void;
  onReject: (eventId: string) => void;
  onEdit: (eventId: string) => void;
  onDelete: (eventId: string) => void;
  onCancel: (eventId: string) => void;
  isAdmin: boolean;
}

const EventItem: React.FC<EventItemProps> = ({ 
  event, 
  currentFamilyId, 
  familyMembers,
  onAccept, 
  onReject, 
  onEdit, 
  onDelete, 
  onCancel,
  isAdmin
}) => {
  const [isAcceptDropdownOpen, setIsAcceptDropdownOpen] = useState(false);

  const {
    isCreator,
    isOpenOrPending,
    isAccepted,
    isRejected,
    isPastEvent,
    creatorFamilyName,
    creatorName,
    acceptedByFamilyName,
    acceptedByName,
    familyImageUrl,
    statusDisplay,
    statusColor,
    formattedEventDate,
    formattedEventTime
  } = useMemo(() => {
    const isCreator = event.creatorFamilyId === currentFamilyId;
    const isOpenOrPending = event.status === 'PENDING';
    const isAccepted = event.status === 'ACCEPTED';
    const isRejected = event.rejectedFamilies?.includes(currentFamilyId);
    const isPastEvent = event.status === 'PAST';

    const creatorFamilyName = event.creatorFamily?.name || 'Unknown Family';
    const creatorName = event.creatorFamily?.name || 'Unknown User';
    const acceptedByFamilyName = event.family?.name || 'Unknown Family';
    const acceptedByName = event.acceptedByName || 'Unknown User';

    const familyImageUrl = event.creatorFamily?.image || event.family?.image || `/api/placeholder/400/300`;

    const statusDisplay = isPastEvent ? 'Past Event' :
      isAccepted ? `Accepted${event.acceptedByName ? ` by ${event.acceptedByName}` : ''}` :
      'Open';

    const statusColor = isPastEvent ? '#6B7280' : // gray for past events
      isAccepted ? '#10B981' : // green
      isCreator ? '#EF4444' : // red
      '#c9fb00'; // lime for 'open'

    const formattedEventDate = format(new Date(event.startTime), "EEEE do MMMM");
    const formattedEventTime = `${format(new Date(event.startTime), "h:mma")}-${format(new Date(event.endTime), "h:mma")}`.toLowerCase();

    return {
      isCreator,
      isOpenOrPending,
      isAccepted,
      isRejected,
      isPastEvent,
      creatorFamilyName,
      creatorName,
      acceptedByFamilyName,
      acceptedByName,
      familyImageUrl,
      statusDisplay,
      statusColor,
      formattedEventDate,
      formattedEventTime
    };
  }, [event, currentFamilyId]);

  useEffect(() => {
    console.log('Event:', event);
    console.log('Current Family ID:', currentFamilyId);
    console.log('Creator Family ID:', event.creatorFamilyId);
    console.log('Is Creator:', isCreator);
  }, [event, currentFamilyId, isCreator]);

  const handleAccept = (memberId: string, memberName: string) => {
    onAccept(event.id, memberId, memberName);
    setIsAcceptDropdownOpen(false);
  };

  const renderAcceptButton = () => {
    if (isPastEvent) {
      return (
        <button 
          className="bg-gray-400 text-white px-3 py-1 rounded text-sm cursor-not-allowed"
          disabled
        >
          Past Event
        </button>
      );
    }

    if (!familyMembers) {
      return (
        <button 
          className="bg-gray-400 text-white px-3 py-1 rounded text-sm cursor-not-allowed"
          disabled
        >
          Loading...
        </button>
      );
    }
    
    if (familyMembers.length === 0) {
      return (
        <button 
          className="bg-gray-400 text-white px-3 py-1 rounded text-sm cursor-not-allowed"
          disabled
        >
          No members
        </button>
      );
    }
    
    if (familyMembers.length === 1) {
      const memberName = familyMembers[0].name || 'Unknown';
      return (
        <button 
          onClick={() => handleAccept(familyMembers[0].id, memberName)} 
          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
        >
          Accept
        </button>
      );
    }
    
    return (
      <DropdownMenu open={isAcceptDropdownOpen} onOpenChange={setIsAcceptDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center">
            Accept <ChevronDown className="ml-1 h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {familyMembers.map((member) => (
            <DropdownMenuItem key={member.id} onSelect={() => handleAccept(member.id, member.name || 'Unknown')}>
              {member.name || 'Unknown'}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg bg-gray-950 text-white w-full md:w-80 transition-all duration-300 hover:shadow-xl">
      <div className="h-48 relative">
        <Image 
          src={familyImageUrl}
          alt={`${creatorFamilyName} Family`}
          fill
          style={{ objectFit: 'cover', objectPosition: 'top' }}
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
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded text-sm font-semibold" style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: statusColor
        }}>
          {statusDisplay}
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between mb-2">
          <div className="flex items-center text-gray-300 mr-2 mb-2">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="text-sm">{formattedEventDate}</span>
          </div>
          <div className="flex items-center text-gray-300 mb-2">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{formattedEventTime}</span>
          </div>
        </div>
        <p className="text-gray-300 mb-4 h-12 overflow-hidden">{event.description || 'No description provided'}</p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-300">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">Posted by {creatorName} ({creatorFamilyName})</span>
          </div>
          {isAccepted && (
            <div className="flex items-center text-gray-300">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">Accepted by {acceptedByName} ({acceptedByFamilyName})</span>
            </div>
          )}
          <div className="flex items-center text-gray-300">
            <Award className="w-4 h-4 mr-2" />
            <span className="text-sm">Points: {event.points}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {isCreator && !isPastEvent && (
              <>
                <button onClick={() => onEdit(event.id)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                  Edit
                </button>
                <button onClick={() => onDelete(event.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                  Delete
                </button>
              </>
            )}
            {!isCreator && isAccepted && !isPastEvent && (
              <button onClick={() => onCancel(event.id)} className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors">
                Cancel
              </button>
            )}
            {!isCreator && isOpenOrPending && !isRejected && !isPastEvent && (
              <>
                {renderAcceptButton()}
                <button onClick={() => onReject(event.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                  Reject
                </button>
              </>
            )}
            {!isCreator && isOpenOrPending && isRejected && !isPastEvent && (
              <button onClick={() => onReject(event.id)} className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors">
                Unreject
              </button>
            )}
          </div>
          <ShareButton eventId={event.id} />
        </div>
      </div>
    </div>
  );
};

export default EventItem;