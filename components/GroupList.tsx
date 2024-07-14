import Link from 'next/link';
import { Group } from '@prisma/client';

interface GroupListProps {
  groups: Group[];
  adminGroups: Group[];
}

export default function GroupList({ groups, adminGroups }: GroupListProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Groups You&apos;re In</h3>
      <ul className="space-y-2 mb-6">
        {groups.map((group) => (
          <li key={group.id}>
            <Link href={`/groups/${group.id}`} className="text-accent hover:underline">
              {group.name}
            </Link>
          </li>
        ))}
      </ul>
      <h3 className="text-xl font-semibold mb-4">Groups You Administer</h3>
      <ul className="space-y-2">
        {adminGroups.map((group) => (
          <li key={group.id}>
            <Link href={`/groups/${group.id}`} className="text-accent hover:underline">
              {group.name} (Admin)
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
