import { Group } from '@prisma/client';

interface GroupListProps {
  groups: Group[];
  currentUserId: string;
  onGroupClick: (group: Group) => void;
  selectedGroupId: string | undefined;
}

export default function GroupList({ groups, currentUserId, onGroupClick, selectedGroupId }: GroupListProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 text-white">Your Groups</h3>
      {groups.length > 0 ? (
        <ul className="space-y-2">
          {groups.map((group) => (
            <li 
              key={group.id} 
              className={`bg-gray-700 rounded-md p-3 transition-colors duration-200 hover:bg-gray-600 cursor-pointer ${
                group.id === selectedGroupId ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => onGroupClick(group)}
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