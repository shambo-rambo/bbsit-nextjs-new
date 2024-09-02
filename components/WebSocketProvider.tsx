'use client';

import React, { createContext, useContext } from 'react';

const WebSocketContext = createContext(null);

export function useWebSocket() {
  return useContext(WebSocketContext);
}

export default function WebSocketProvider({ children }: { children: React.ReactNode }) {
  return (
    <WebSocketContext.Provider value={null}>
      {children}
    </WebSocketContext.Provider>
  );
}
