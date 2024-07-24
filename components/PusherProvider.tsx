// bbsit-deploy/components/PusherProvider.tsx

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Pusher from 'pusher-js';

const PusherContext = createContext<Pusher | null>(null);

export function usePusher() {
  return useContext(PusherContext);
}

export function PusherProvider({ children }: { children: React.ReactNode }) {
  const [pusher, setPusher] = useState<Pusher | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const appKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
      const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

      if (!appKey || !cluster) {
        console.error('Pusher configuration is missing');
        return;
      }

      try {
        const pusherInstance = new Pusher(appKey, { cluster });
        setPusher(pusherInstance);

        return () => {
          pusherInstance.disconnect();
        };
      } catch (error) {
        console.error('Error initializing Pusher:', error);
      }
    }
  }, []);

  return (
    <PusherContext.Provider value={pusher}>
      {children}
    </PusherContext.Provider>
  );
}