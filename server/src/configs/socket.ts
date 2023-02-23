import { Server } from 'socket.io';
import { httpServer } from '../server';

export default function createIoServer(): Server {
  const ioServer: Server = new Server(
    httpServer,
    {
      cors: {
        credentials: true,
        origin: process.env.ALLOWED_ORIGIN,
      },
      cookie: true,
      transports: ['websocket', 'polling'],
    }
  );
  
  return ioServer;
}
