import { createContext, ReactElement, ReactNode, Context, useEffect, useState, useMemo, useContext } from 'react';
import { io, Socket, ManagerOptions, SocketOptions } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '@src/store';

export type SocketContextType = {
  socket: Socket;
  socketId: string;
  isConnected: boolean;
  socketEmit: (event: string, data: EmitDataType, isVolatile?: boolean) => void;
};
export type InitialSocketContextType = Pick<SocketContextType, 'socket' | 'socketId' | 'isConnected'>;

interface ISocketContextProviderProps {
  children: ReactNode;
}
type EmitDataType = string | null | number | Record<string, unknown> | undefined;

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

const initialContext: InitialSocketContextType = {
  isConnected: false,
  socket: initialSocket,
  socketId: initialSocket.id,
};

const SocketContext: Context<InitialSocketContextType> = createContext<InitialSocketContextType>(initialContext);

export const useSocketContext = (): SocketContextType => {
  const commonContext: InitialSocketContextType = useContext(SocketContext);
  
  if (!commonContext) {
    throw new Error(
      'useSocketContext() can only be used inside of <SocketProvider />, ' + 'please declare it at a higher level.'
    );
  }
  
  return useMemo(() => commonContext as SocketContextType, [commonContext]);
};

export function SocketProvider({ children }: ISocketContextProviderProps): ReactElement {
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
  
      // socket.onAny((event, ...args) => console.log(`${event}: `, args));
  
      socket.on('connect', (): void => setIsConnected(true));
      socket.on('disconnect', (): void => {
        socket.disconnect();
        setIsConnected(false);
      });
      socket.on('connect_error', console.error);
      socket.on('error', console.error);
    } else {
      socket.disconnect();
    }
    // eslint-disable-next-line
  }, [isAuthorized]);
  
  // TODO: currently works only volatile method, need check
  const socketEmit = (event: string, data: EmitDataType, isVolatile: boolean = true): void => {
    console.log('socketEmit: ', event);
    
    if (!isVolatile) {
      socket.emit(event, data);
    } else {
      socket.volatile.emit(event, data);
    }
  }
  
  const contextValue: SocketContextType = useMemo(
    (): SocketContextType => ({
      socket,
      socketId: socket.id,
      isConnected,
      socketEmit
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