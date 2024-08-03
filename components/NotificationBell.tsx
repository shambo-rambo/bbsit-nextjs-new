'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  type: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  linkedId?: string;
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      fetchNotifications();
    }
  }, [session]);

  const fetchNotifications = async () => {
    const response = await fetch('/api/notifications');
    if (response.ok) {
      const data = await response.json();
      setNotifications(data);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationLink = (notification: Notification) => {
    switch (notification.type) {
      case 'family_invitation':
        return '/family/dashboard';
      case 'group_invitation':
      case 'new_event':
        return `/groups/${notification.linkedId}`;
      default:
        return '#';
    }
  };

  const markAsRead = async (id: string) => {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId: id }),
    });
    if (response.ok) {
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    await markAsRead(notification.id);
    const link = getNotificationLink(notification);
    console.log('Navigating to:', link, 'Notification:', notification);
    router.push(link);
    setIsOpen(false);
  };

  const clearAllNotifications = async () => {
    const response = await fetch('/api/notifications/clear-all', {
      method: 'POST',
    });
    if (response.ok) {
      setNotifications([]);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center p-3 text-sm font-medium text-center text-accent border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-black bg-accent border-2 border-black rounded-full -top-2 -end-2">
            {unreadCount}
          </div>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-950 border border-accent rounded-md shadow-lg overflow-hidden z-20">
          <div className="py-2">
            {notifications.length === 0 ? (
              <div className="px-4 py-2 text-sm text-accent">No notifications</div>
            ) : (
              <>
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-2 cursor-pointer ${notification.isRead ? 'opacity-50' : ''}`}
                  >
                    <p className="text-sm text-white">{notification.content}</p>
                    <p className="text-xs text-accent">{new Date(notification.createdAt).toLocaleString()}</p>
                  </div>
                ))}
                <button 
                  onClick={clearAllNotifications}
                  className="w-full px-4 py-2 mt-2 text-sm text-accent bg-gray-950 hover:bg-gray-700 transition-colors"
                >
                  Clear All Notifications
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;