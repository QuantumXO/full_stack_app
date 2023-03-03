import React, { ReactElement, ReactNode, useEffect, useState, MouseEvent, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@src/store';
import { styled } from '@mui/system';
import { Divider, Menu, MenuItem } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { toast } from 'react-toastify';
import { INotification, NotificationsEvents } from '@models/common/notifications';
import Notification from './components/item';
import { SocketContext, SocketContextType } from '@view/common/context/socket-context';
import { Socket } from 'socket.io-client';

const StyledButton = styled('div')({
  marginLeft: 12,
  marginRight: 12,
  position: 'relative',
  cursor: 'pointer',
});
const NewNotificationsIcon = styled('span')({
  right: '0',
  top: '0',
  width: 12,
  height: 12,
  borderRadius: '50%',
  position: 'absolute',
  backgroundColor: 'red',
  zIndex: '99',
});

export function Notifications(): ReactElement | null {
  const isAuthorized: boolean = useSelector((state: RootState) => state.common.isAuthorized);
  const userId: string | undefined = useSelector((state: RootState) => state.common.userId);
  const { socket, isConnected }: SocketContextType = useContext(SocketContext);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<INotification[] | null>(null);
  
  const showList: boolean = Boolean(anchorEl);
  let isExistNewNotification: boolean = true;
  let layout: ReactNode = null;
  
  useEffect((): void => {
    if (isConnected) {
      socketEmit(socket, NotificationsEvents.GET_NOTIFICATIONS_LIST, { userId });
  
      socket.on(NotificationsEvents.GET_NOTIFICATIONS_LIST, getNotificationsHandler);
      socket.on(NotificationsEvents.READ_NOTIFICATION, readNotificationHandler);
      socket.on(NotificationsEvents.CREATE_NOTIFICATION, createNotificationHandler);
    }
    
    // eslint-disable-next-line
  }, [isConnected]);
  
  // eslint-disable-next-line
  useEffect(() => offSockets, []);
  
  const socketEmit = (socket: Socket, event: string, data: any): Socket => {
    console.log('socketEmit: ', event);
    return socket.emit(event, data);
  }
  
  function offSockets(): void {
    socket.off(NotificationsEvents.GET_NOTIFICATIONS_LIST);
    socket.off(NotificationsEvents.CREATE_NOTIFICATION);
    socket.off(NotificationsEvents.READ_NOTIFICATION);
  }
  
  function readNotificationHandler(notification: INotification): void {
    console.log('readNotificationHandler() notification: ', notification);
  }
  
  function getNotificationsHandler(notifications: INotification[]): void {
    setNotifications(notifications);
  }
  
  function createNotificationHandler(newNotification: INotification): void {
    const { title, type } = newNotification;
    toast(title, { type });
  }
  
  const onShowList = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  
  const onCloseList = (): void => setAnchorEl(null);
  
  function onReadNotification(notificationId: string): void {
    console.log('onReadNotification() notificationId: ', notificationId);
    socket.emit(NotificationsEvents.READ_NOTIFICATION, { id: notificationId });
  }
  
  function renderList(): ReactNode {
    return (
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={showList}
        onClose={onCloseList}
        PaperProps={{
          style: {
            width: 350,
            maxHeight: 24 * 4.5,
          },
        }}
      >
        {Array.isArray(notifications)
          ? notifications.map((item: INotification): ReactElement => {
            const { id } = item;
            return <Notification key={id} {...item} onRead={onReadNotification} />;
          })
          : (
            <MenuItem style={{ textAlign: 'center', justifyContent: 'center' }}>
              {'Notifications not found'}
            </MenuItem>
          )
        }
      </Menu>
    );
  }
  
  if (isAuthorized) {
    layout = (
      <>
        <div style={{ position: 'relative' }}>
          <StyledButton
            aria-label="more"
            id="long-button"
            aria-haspopup="true"
            aria-controls={showList ? 'long-menu' : undefined}
            aria-expanded={showList ? 'true' : undefined}
            onClick={onShowList}
          >
            <NotificationsIcon/>
            {isExistNewNotification && <NewNotificationsIcon/>}
          </StyledButton>
          {renderList()}
        </div>
        <Divider
          variant="middle"
          orientation="vertical"
        />
      </>
    );
  }
  
  return layout;
}