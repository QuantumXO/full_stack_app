import React, { ReactElement, ReactNode, useEffect, useState, MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import { styled } from '@mui/system';
import { Divider, Menu, MenuItem } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import socket from '../../../../../services/socket';
import { toast } from 'react-toastify';
import { INotification } from '../../../../../models/common/notifications';
import Notification from './components/item';

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
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<INotification[] | null>(null);
  
  const showList: boolean = Boolean(anchorEl);
  let isExistNewNotification: boolean = true;
  let layout: ReactNode = null;
  
  useEffect(() => {
    // socket.on('notifications:list', getNotificationsHandler);
    // socket.on('notifications:read', readNotificationHandler);
  
    // socket.emit('notifications:list', { userId });
    // console.log('socket: ', socket);
    // socket.emit('notifications:read', 321);
    
    return (): void => {
      socket.off('notifications:list');
      socket.off('notifications:read');
    }
  }, []);
  
  function socketTest() {
    console.log('click');
    socket.emit('notifications:list');
  }
  
  function readNotificationHandler(notification: INotification): void {
    // setNotifications(notifications);
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
    socket.emit('notifications:read', { id: notificationId });
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
        <span onClick={socketTest}>Click</span>
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