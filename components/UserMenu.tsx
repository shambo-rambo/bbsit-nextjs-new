'use client'

import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export function UserMenu() {
  const { data: session, status } = useSession();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  if (status === "loading") {
    return null; // Or a loading spinner
  }

  if (status === "unauthenticated" || !session || !session.user) {
    return null;
  }

  const { user } = session;

  const displayName = user.name || user.email || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center text-white hover:bg-gray-950 rounded-full p-2">
          {user.image ? (
            <Image 
              src={user.image} 
              alt={displayName} 
              width={32} 
              height={32} 
              className="rounded-full"
            />
          ) : (
            <div className="rounded-full bg-gray-900 text-white w-8 h-8 flex items-center justify-center">
              {initials}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={5} align="end" className="bg-gray-950 border border-gray-700 rounded-lg w-56">
        <DropdownMenuItem className="flex-col items-start py-2">
          <div className="text-xs text-gray-400">{user.email}</div>
          <div className="text-sm font-medium text-white">{displayName}</div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="w-full text-white hover:bg-gray-700 hover:text-black rounded-md px-4 py-2">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/family/dashboard" className="w-full text-white hover:bg-gray-700 hover:text-black rounded-md px-4 py-2">
            Family
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/groups/dashboard" className="w-full text-white hover:bg-gray-700 hover:text-black rounded-md px-4 py-2">
            Groups
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/events/dashboard" className="w-full text-white hover:bg-gray-700 hover:text-black rounded-md px-4 py-2">
            Events
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        {deferredPrompt && (
          <DropdownMenuItem onSelect={handleInstall} className="w-full text-white hover:bg-gray-700 hover:text-black rounded-md px-4 py-2">
            Install App
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={(event) => {
          event.preventDefault();
          signOut();
        }} className="w-full text-white hover:bg-gray-700 hover:text-black rounded-md px-4 py-2">
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}