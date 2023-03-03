import { Server, Socket } from 'socket.io';
import { httpServer } from '../server';
import { registerNotificationsHandlers } from '@controllers/common/notifications';
import { ALLOWED_ORIGINS } from '@src/constants';

export function createIoServer(): Server {
  return new Server(
    httpServer,
    {
      cookie: true,
      allowEIO3: true,
      pingTimeout: 20000,
      pingInterval: 25000,
      transports: ['websocket', 'polling'],
      cors: {
        credentials: true,
        origin: ALLOWED_ORIGINS,
      },
    }
  );
}

export function onConnection(socket: Socket): void {
  try {
    console.log(`⚡: ${socket.id} user just connected!`);
  
    registerNotificationsHandlers(socket);
    
    socket.on('disconnect', () => console.log('🔥: A user disconnected'));
  } catch (e) {
    console.log('onConnection() e: ', e);
    socket.emit('error', e);
  }
}
