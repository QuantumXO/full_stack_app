import { createContext, ReactElement, ReactNode, Context, useEffect, useState, useMemo } from 'react';
import { io, Socket, ManagerOptions, SocketOptions } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '@src/store';

export type SocketContextDataType = {
  socket: Socket;
  socketId: string;
  isConnected: boolean;
};
export type SocketContextType = SocketContextDataType;

interface ISocketContextProviderProps {
  children: ReactNode;
}

const { REACT_APP_SOCKET_URL } = process.env;

const socketOptions: Partial<ManagerOptions & SocketOptions> = {
  retries: 20,
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  withCredentials: true,
  transports: ['websocket', 'polling'],
};

const initialSocket: Socket = io(
  REACT_APP_SOCKET_URL as string,
  socketOptions,
);

const initialContext: SocketContextDataType = {
  isConnected: false,
  socket: initialSocket,
  socketId: initialSocket.id,
};

export const SocketContext: Context<SocketContextType> = createContext<SocketContextType>(initialContext);

function SocketProvider({ children }: ISocketContextProviderProps): ReactElement {
  const isAuthorized: boolean = useSelector((state: RootState) => state.common.isAuthorized);
  
  
  const [socket] = useState<Socket>(initialSocket);
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  
  useEffect(() => {
    return (): void => {
      socket.off('connection:sid');
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
    }
    // eslint-disable-next-line
  }, []);
  
  useEffect((): void => {
    if (isAuthorized) {
      socket.connect();
  
      socket.onAny((event, ...args) => console.log(`${event}: `, args));
  
      socket.on('connect', (): void => setIsConnected(true));
      socket.on('disconnect', (): void => setIsConnected(false));
      socket.on('connect_error', console.error);
      socket.on('error', console.error);
    } else {
      socket.disconnect();
    }
    // eslint-disable-next-line
  }, [isAuthorized]);
  
  const contextValue: SocketContextDataType = useMemo(
    (): SocketContextDataType => ({
      socket,
      socketId: socket.id,
      isConnected,
    }),
    [
      socket,
      isConnected,
    ]
  );
  
  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;