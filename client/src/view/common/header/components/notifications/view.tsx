import React, { MouseEvent, ReactElement, ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@src/store';
import { styled } from '@mui/system';
import { Divider, Menu, MenuItem } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { toast } from 'react-toastify';
import { INotification, NotificationsEvents } from '@models/common/notifications';
import Notification from './components/item';
import { useSocketContext } from '@view/common/contexts/socket';

interface IGetNotificationsHandlerArgs {
  notifications: INotification[];
  newNotificationsCount: number;
}

interface IReadNotificationHandlerArgs {
  notification: INotification;
  newNotificationsCount: number;
}

const StyledButton = styled('div')({
  marginLeft: 12,
  marginRight: 12,
  position: 'relative',
  cursor: 'pointer',
});
const NewNotificationsIcon = styled('span')({
  right: '0',
  top: '0',
  width: 14,
  height: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  position: 'absolute',
  backgroundColor: 'red',
  zIndex: '99',
  '&::before': {
    display: 'inline-block',
    content: 'attr(data-count)',
    fontSize: 9,
    color: '#ffffff',
  }
});

export function Notifications(): ReactElement | null {
  const isAuthorized: boolean = useSelector((state: RootState) => state.common.isAuthorized);
  const userId: string | undefined = useSelector((state: RootState) => state.common.userId);
  const { isConnected, socketEmit, onSubscribeEvents, onUnsubscribeEvents } = useSocketContext();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [newNotificationsCount, setNewNotificationsCount] = useState<number>(0);
  
  const showList: boolean = Boolean(anchorEl);
  let layout: ReactNode = null;
  
  useEffect((): void => {
    if (isConnected) {
      onSubscribeEvents([
        { [NotificationsEvents.GET_NOTIFICATIONS_LIST]: getNotificationsHandler },
        { [NotificationsEvents.CREATE_NOTIFICATION]: createNotificationHandler },
        { [NotificationsEvents.READ_NOTIFICATION]: readNotificationHandler },
      ]);
  
      socketEmit(NotificationsEvents.GET_NOTIFICATIONS_LIST, { userId });
    }
    // eslint-disable-next-line
  }, [isConnected]);
  
  // eslint-disable-next-line
  useEffect(() => offSockets, []);
  
  function offSockets(): void {
    onUnsubscribeEvents([
      NotificationsEvents.GET_NOTIFICATIONS_LIST,
      NotificationsEvents.CREATE_NOTIFICATION,
      NotificationsEvents.READ_NOTIFICATION,
    ]);
  }
  
  function getNotificationsHandler(args: IGetNotificationsHandlerArgs): void {
    const { notifications: newNotifications, newNotificationsCount } = args;
    setNotifications(newNotifications);
    setNewNotificationsCount(newNotificationsCount);
  }
  
  const readNotificationHandler = (args: IReadNotificationHandlerArgs): void => {
    const { notification, newNotificationsCount } = args;
    setNotifications((prevNotifications: INotification[]): INotification[] => {
      return [...prevNotifications].map((item: INotification): INotification => {
        return item.id === notification.id ? notification : item;
      });
    });
    setNewNotificationsCount(newNotificationsCount);
  }
  
  function createNotificationHandler(newNotification: INotification): void {
    const { title, type } = newNotification;
    toast(title, { type });
  }
  
  const onShowList = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  
  const onCloseList = (): void => setAnchorEl(null);
  
  function onReadNotification(notificationId: string): void {
    socketEmit(NotificationsEvents.READ_NOTIFICATION, { id: notificationId });
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
            maxHeight: 316,
          },
        }}
      >
        {notifications.length
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
            {!!newNotificationsCount && <NewNotificationsIcon data-count={newNotificationsCount}/>}
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