import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

export const initSocket = (httpServer: HTTPServer) => {
  const io = new SocketIOServer(httpServer, {
    path: '/socket.io',
    addTrailingSlash: false,
  });

  const notificationNamespace = io.of('/notifications');

  notificationNamespace.on('connection', (socket) => {
    console.log('A client connected to notifications namespace');

    socket.on('disconnect', () => {
      console.log('A client disconnected from notifications namespace');
    });

  });

  return io;
}