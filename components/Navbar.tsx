// components/Navbar.tsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { UserMenu } from './UserMenu';
import NotificationBell from './NotificationBell';
import { FaHome, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import { Group } from '@/types/app';
import Image from 'next/image';

export default function Navbar() {
    const { data: session } = useSession();
    const [isMobile, setIsMobile] = useState(false);
    const [userGroups, setUserGroups] = useState<Group[]>([]);
    const router = useRouter();

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  useEffect(() => {
    if (session) {
      fetchUserGroups()
    }
  }, [session])

  const fetchUserGroups = async () => {
    try {
        const response = await fetch('/api/user/groups');
        if (response.ok) {
            const groups: Group[] = await response.json();
            setUserGroups(groups);
        }
    } catch (error) {
        console.error('Error fetching user groups:', error);
    }
  }

  const handlePostClick = () => {
    if (userGroups.length === 1) {
      router.push(`/groups/${userGroups[0].id}`)
    } else {
      router.push('/groups/dashboard')
    }
  }

  const handleLoginClick = () => {
    router.push('/auth?mode=signin');
  };

  return (
    <>
      <nav className="bg-black border-b border-accent p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-accent text-xl font-bold">
          <Image src="/logo-h.png" alt="Logo" width={128} height={40} priority />
          </Link>
          {!isMobile && session && (
            <div className="flex items-center space-x-4">
              <Link href="/family/dashboard" className="text-white hover:text-accent transition-colors">
                Family
              </Link>
              <Link href="/groups/dashboard" className="text-white hover:text-accent transition-colors">
                Groups
              </Link>
              <Link href="/events/dashboard" className="text-white hover:text-accent transition-colors">
                Events
              </Link>
            </div>
          )}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <NotificationBell />
                <UserMenu />
              </>
            ) : (
              <button
                onClick={handleLoginClick}
                className="px-4 py-2 bg-black text-accent border border-accent rounded-md hover:bg-accent hover:text-black transition-colors duration-300"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
      {isMobile && session && (
          <div className="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-gray-800 border border-gray-700 bottom-0 left-1/2">
          <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
            <Link href="/" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-700 group">
              <FaHome className="w-6 h-6 mb-1 text-gray-400 group-hover:text-white" />
              <span className="text-xs text-gray-400 group-hover:text-white">Home</span>
            </Link>
            <Link href="/groups/dashboard" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-700 group">
              <FaUsers className="w-6 h-6 mb-1 text-gray-400 group-hover:text-white" />
              <span className="text-xs text-gray-400 group-hover:text-white">Groups</span>
            </Link>
            <button onClick={handlePostClick} className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-700 group">
              <IoMdAdd className="w-8 h-8 mb-1 text-accent group-hover:text-white" />
              <span className="text-xs text-accent group-hover:text-white">Post</span>
            </button>
            <Link href="/events/dashboard" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-700 group">
              <FaCalendarAlt className="w-6 h-6 mb-1 text-gray-400 group-hover:text-white" />
              <span className="text-xs text-gray-400 group-hover:text-white">Events</span>
            </Link>
            <Link href="/family/dashboard" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-700 group">
              <FaUsers className="w-6 h-6 mb-1 text-gray-400 group-hover:text-white" />
              <span className="text-xs text-gray-400 group-hover:text-white">Family</span>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}