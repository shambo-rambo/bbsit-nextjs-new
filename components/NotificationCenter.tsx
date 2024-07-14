// components/NotificationCenter.tsx

'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { io } from 'socket.io-client'

interface Notification {
  id: string
  type: string
  content: string
  isRead: boolean
  createdAt: string
}

const NotificationCenter: React.FC = () => {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (session) {
      fetchNotifications()

      const socket = io('/notifications', {
        path: '/socket.io',
      });
      
      socket.on('newNotification', (notification: Notification) => {
        console.log('Received new notification:', notification);
        setNotifications(prevNotifications => [notification, ...prevNotifications])
      })

      return () => {
        socket.disconnect()
      }
    }
  }, [session])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId: id }),
      })
      if (response.ok) {
        setNotifications(notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        ))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  return (
    <div className="notification-center">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className={notification.isRead ? 'read' : 'unread'}>
              <p>{notification.content}</p>
              {!notification.isRead && (
                <button onClick={() => markAsRead(notification.id)}>Mark as read</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default NotificationCenter;
