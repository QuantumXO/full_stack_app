import { createContext, ReactElement, ReactNode, Context, useEffect, useState, useMemo, useContext } from 'react';
import { io, Socket, ManagerOptions, SocketOptions } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '@src/store';
import { IS_DEV } from '@src/constants';

export type EventCbType = (...args: any[]) => void;

export interface IEventsSubscriptionEvent {
  [ev: string]: EventCbType;
}

export type SocketContextType = {
  socket: Socket;
  socketId: string;
  isConnected: boolean;
  socketEmit: (event: string, data: EmitDataType, isVolatile?: boolean) => void;
  onSubscribeEvents: (events: IEventsSubscriptionEvent[]) => void;
  onUnsubscribeEvents: (events: (IEventsSubscriptionEvent | string)[]) => void;
};
export type InitialSocketContextType = Pick<SocketContextType, 'socket' | 'socketId' | 'isConnected'>;

interface ISocketContextProviderProps {
  children: ReactNode;
}
type EmitDataType = string | null | number | Record<string, unknown> | undefined;
enum SocketCommonEvents {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ERROR = 'error',
  CONNECT_ERROR = 'connect_error',
  RECONNECT = 'reconnect',
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

const socket: Socket = io(
  REACT_APP_SOCKET_URL as string,
  socketOptions,
);

const initialContext: InitialSocketContextType = {
  isConnected: false,
  socket: socket,
  socketId: socket.id,
};

IS_DEV && socket.onAny((event, ...args) => console.info(`${event}: `, args));

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
  
  const [isConnected, setIsConnected] = useState<boolean>(() => socket.connected);
  
  useEffect(() => {
    return onSocketDisconnect;
    // eslint-disable-next-line
  }, []);
  
  useEffect((): void => {
    if (isAuthorized) {
      onSocketConnect();
  
      onSubscribeEvents([
        { [SocketCommonEvents.CONNECT]: onSetIsConnected},
        { [SocketCommonEvents.DISCONNECT]: onSetIsConnected},
        { [SocketCommonEvents.CONNECT_ERROR]: onSocketConnect},
        { [SocketCommonEvents.ERROR]: console.error},
        { [SocketCommonEvents.RECONNECT]: console.log},
      ]);
    } else {
      socket.removeAllListeners();
      // socket.offAny();
      onSocketDisconnect();
    }
    // eslint-disable-next-line
  }, [isAuthorized]);
  
  const onSubscribeEvents = (events: IEventsSubscriptionEvent[]): void => {
    events.forEach((event: IEventsSubscriptionEvent): void => {
      const [eventName, eventCb] = Object.entries(event)[0];
      socket.on(eventName, eventCb);
    });
  };
  
  const onUnsubscribeEvents = (events: (IEventsSubscriptionEvent | string)[]): void => {
    events.forEach((event: IEventsSubscriptionEvent | string): void => {
      if (typeof event === 'string') {
        socket.off(event);
      } else {
        const [eventName, eventCb] = Object.entries(event)[0];
        socket.off(eventName, eventCb);
      }
    });
  };
  
  const onSetIsConnected = (): void => setIsConnected(socket.connected);
  
  const onSocketDisconnect = (): void => socket.close() && onSetIsConnected();
  
  const onSocketConnect = (): void => socket.open() && onSetIsConnected();
  
  // TODO: currently works only volatile method, need check
  const socketEmit = (event: string, data: EmitDataType, isVolatile: boolean = true): void => {
    if (socket.connected) {
      if (!isVolatile) {
        socket.emit(event, data);
      } else {
        socket.volatile.emit(event, data);
      }
    } else {
      console.log('Can\'t emit, disconnected socket');
    }
  }
  
  const contextValue: SocketContextType = useMemo(
    (): SocketContextType => ({
      socket,
      socketId: socket.id,
      isConnected,
      socketEmit,
      onSubscribeEvents,
      onUnsubscribeEvents
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