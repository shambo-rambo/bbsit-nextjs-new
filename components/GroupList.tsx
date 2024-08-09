// bbsit-deploy/components/GroupList.tsx

import { Group, Family } from '@prisma/client';
import { GroupBasic } from '@/types/app';

interface GroupWithRelations extends Group {
  admin: Family;
  members: Family[];
  events: any[]; 
  familyPoints: any[];
}

interface GroupListProps {
  groups: GroupBasic[];
  currentUserId: string;
  onGroupClick: (groupId: string) => void;
  selectedGroupId: string | null;
}

export default function GroupList({ groups, currentUserId, onGroupClick, selectedGroupId }: GroupListProps) {
  return (
    <div className="bg-gray-950 p-6 rounded-lg shadow-lg">
      {groups.length > 0 ? (
        <ul className="space-y-2">
          {groups.map((group) => (
            <li 
              key={group.id} 
              className={`bg-gray-700 rounded-md p-3 transition-colors duration-200 hover:bg-gray-600 cursor-pointer ${
                group.id === selectedGroupId ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => onGroupClick(group.id)}
            >
              <div className="flex justify-between items-center text-accent">
                <span>{group.name}</span>
                <span className="text-sm text-gray-400">{group.adminId === currentUserId ? '(Admin)' : ''}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">You are not a member of any groups yet.</p>
      )}
    </div>
  );
}