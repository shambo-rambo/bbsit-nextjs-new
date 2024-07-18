import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export function UserMenu() {
  const { data: session } = useSession();

  if (!session || !session.user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button>
          {session.user.image ? (
            <img src={session.user.image} alt="User avatar" className="rounded-md w-auto h-11" />
          ) : (
            <div className="rounded-full bg-gray-900 text-white w-8 h-8 flex items-center justify-center">
              {session.user.name[0]}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={5} align="end" className="bg-gray-800 border border-gray-700 rounded-lg w-56">
        <DropdownMenuItem asChild>
          <Link href="/profile" passHref>
            <button className="w-full text-white hover:bg-gray-700 rounded-md px-4 py-2">Profile</button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/family/dashboard" passHref>
            <button className="w-full text-white hover:bg-gray-700 rounded-md px-4 py-2">Family Dashboard</button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/groups/dashboard" passHref>
            <button className="w-full text-white hover:bg-gray-700 rounded-md px-4 py-2">Groups Dashboard</button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/events/dashboard" passHref>
            <button className="w-full text-white hover:bg-gray-700 rounded-md px-4 py-2">Events Dashboard</button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer text-white hover:bg-gray-700 rounded-md px-4 py-2">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}