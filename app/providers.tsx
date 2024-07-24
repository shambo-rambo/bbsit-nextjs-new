// bbsit-deploy/app/providers.tsx

'use client';

import { SessionProvider } from "next-auth/react";
import { PusherProvider } from '@/components/PusherProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PusherProvider>
        {children}
      </PusherProvider>
    </SessionProvider>
  );
}