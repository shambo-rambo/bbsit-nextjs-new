// components/FamilyInfo.tsx

import { useState, useCallback } from 'react';

interface User {
  id: string;
  name: string | null;
}

interface Group {
  id: string;
  name: string;
}

interface Event {
  id: string;
  name: string;
  startTime: Date;
  groupName: string;
}

interface FamilyBase {
  id: string;
  name: string;
  homeAddress: string;
  image: string | null;
  children: Array<{ id: string; name: string }>;
}

interface FamilyFull extends FamilyBase {
  members: User[];
  groups: Group[];
  upcomingEvents: Event[];
}

type FamilyInfoProps = {
  family: FamilyBase | FamilyFull;
  members?: User[];
  groups?: Group[];
  upcomingEvents?: Event[];
};

export default function FamilyInfo({ family, members, groups, upcomingEvents }: FamilyInfoProps) {
  const [showAllEvents, setShowAllEvents] = useState(false);

  const familyMembers = Array.isArray('members' in family ? family.members : members) ? ('members' in family ? family.members : members) : [];
  const familyGroups = Array.isArray('groups' in family ? family.groups : groups) ? ('groups' in family ? family.groups : groups) : [];
  const familyEvents = Array.isArray('upcomingEvents' in family ? family.upcomingEvents : upcomingEvents) ? ('upcomingEvents' in family ? family.upcomingEvents : upcomingEvents) : [];

  const toggleShowAllEvents = useCallback(() => {
    setShowAllEvents(prev => !prev);
  }, []);

  if (!family) {
    return <div>No family information available.</div>;
  }

  return (
    <div className="family-info space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Family Information</h2>
        <p><strong>Name:</strong> {family.name}</p>
        <p><strong>Address:</strong> {family.homeAddress}</p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Members</h3>
        {familyMembers && familyMembers.length > 0 ? (
          <ul className="list-disc pl-5">
            {familyMembers.map(member => (
              <li key={member.id}>{member.name}</li>
            ))}
          </ul>
        ) : (
          <p>No members found.</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Groups</h3>
        {familyGroups && familyGroups.length > 0 ? (
          <ul className="list-disc pl-5">
            {familyGroups.map(group => (
              <li key={group.id}>{group.name}</li>
            ))}
          </ul>
        ) : (
          <p>No groups found.</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
        {familyEvents && familyEvents.length > 0 ? (
          <>
            <ul className="list-disc pl-5">
              {familyEvents.slice(0, showAllEvents ? undefined : 3).map(event => (
                <li key={event.id}>
                  {event.name} - {new Date(event.startTime).toLocaleString()} ({event.groupName})
                </li>
              ))}
            </ul>
            {familyEvents.length > 3 && (
              <button 
                onClick={toggleShowAllEvents}
                className="mt-2 text-accent hover:underline"
              >
                {showAllEvents ? 'Show Less' : 'Show All'}
              </button>
            )}
          </>
        ) : (
          <p>No upcoming events found.</p>
        )}
      </div>
    </div>
  );
}