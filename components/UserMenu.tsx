// components/UserMenu.tsx

import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

function getUserInitials(name: string | null | undefined): string {
  if (!name) return '??';
  const [firstName, lastName] = name.split(' ');
  return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2);
}

export function UserMenu() {
  const { data: session } = useSession();

  if (!session || !session.user) {
    return null;
  }

  const { user } = session;

  const displayName = user.name || user.email || 'User';
  const initials = getUserInitials(displayName);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center text-white hover:bg-gray-800 rounded-full p-2">
          <div className="rounded-full bg-gray-900 text-white w-8 h-8 flex items-center justify-center">
            {initials}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={5} align="end" className="bg-gray-800 border border-gray-700 rounded-lg w-56">
        <DropdownMenuItem className="flex-col items-start py-2">
          <div className="text-xs text-gray-400">{user.email}</div>
          <div className="text-sm font-medium text-white">{displayName}</div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="w-full text-white hover:bg-gray-700 rounded-md px-4 py-2">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/family/dashboard" className="w-full text-white hover:bg-gray-700 rounded-md px-4 py-2">
            Family Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/groups/dashboard" className="w-full text-white hover:bg-gray-700 rounded-md px-4 py-2">
            Groups Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/events/dashboard" className="w-full text-white hover:bg-gray-700 rounded-md px-4 py-2">
            Events Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem onSelect={(event) => {
          event.preventDefault();
          signOut();
        }} className="w-full text-white hover:bg-gray-700 rounded-md px-4 py-2">
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}