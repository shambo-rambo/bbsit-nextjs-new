/// <reference path="./app.d.ts" />

import { Server as NetServer, Socket } from 'net'
import { NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

// You can add any additional Next.js specific type augmentations here if needed

declare module 'next' {
  // Add any Next.js specific type augmentations here if needed
}

declare module 'next/app' {
  // Add any Next.js App specific type augmentations here if needed
}

// Add any other Next.js related type declarations or augmentations as needed