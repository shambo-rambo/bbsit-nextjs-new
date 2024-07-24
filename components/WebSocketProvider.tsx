// components/WebSocketProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Pusher from 'pusher-js';

const PusherContext = createContext<Pusher | null>(null);

export function usePusher() {
  return useContext(PusherContext);
}

export default function PusherProvider({ children }: { children: React.ReactNode }) {
  const [pusher, setPusher] = useState<Pusher | null>(null);

  useEffect(() => {
    const pusherInstance = new Pusher('73197d60e50861961b64', {
      cluster: 'ap4',
    });

    setPusher(pusherInstance);

    return () => {
      pusherInstance.disconnect();
    };
  }, []);

  return (
    <PusherContext.Provider value={pusher}>
      {children}
    </PusherContext.Provider>
  );
}