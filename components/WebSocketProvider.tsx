// components/WebSocketProvider.tsx

'use client'

import { useEffect } from 'react'
import io from 'socket.io-client'

const WebSocketProvider = () => {
  useEffect(() => {
    const socket = io('/notifications', {
      path: '/socket.io',
    });

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    socket.on('newNotification', (notification) => {
      console.log('Received new notification:', notification);
    });

    return () => {
      socket.disconnect();
    }
  }, []);

  return null;
}

export default WebSocketProvider