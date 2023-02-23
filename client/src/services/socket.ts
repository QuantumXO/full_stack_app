import { io, Socket } from 'socket.io-client';

const { REACT_APP_BASE_URL } = process.env;

function createSocket(): Socket {
  const socket: Socket = io(
    REACT_APP_BASE_URL as string,
    {
      retries: 20,
      reconnection: true,
      reconnectionDelay: 1000,
      withCredentials: true,
      // transports: ['websocket'],
    }
  );

  socket.on('connect', console.warn);
  socket.on('connect_error', console.error);
  socket.on('error', console.error);
  
  return socket;
}

export default <Socket>createSocket();
