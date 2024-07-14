// components/ContentWrapper.tsx
'use client'

import { useState, useEffect } from 'react';

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <div className={`min-h-screen ${isMobile ? 'pb-20' : ''}`}>
      {children}
    </div>
  );
}