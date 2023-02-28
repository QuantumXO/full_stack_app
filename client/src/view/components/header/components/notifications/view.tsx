import React, { ReactElement, memo, ReactNode, useEffect, useState, MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import { styled } from '@mui/system';
import { Divider, Menu, MenuItem } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import socket from '../../../../../services/socket';
import { get } from 'lodash';
import cx from 'classnames';
import { toast } from 'react-toastify';
import { INotification } from '../../../../../models/common/notifications';

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
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<INotification[] | null>(null);
  
  const showList: boolean = Boolean(anchorEl);
  
  useEffect(() => {
    socket.on('notifications:list', (args = {}) => {
      const newNotifications: INotification[] = get(args, 'data.notifications', []);
      setNotifications(newNotifications);
    });
    socket.on('notifications:create', createNotificationHandler);
    
    return (): void => {
      socket.off('notifications:list');
      socket.off('notifications:create');
    }
  }, []);
  
  function createNotificationHandler(newNotification: INotification): void {
    const { title, type } = newNotification;
    toast(title, { type });
  }
  
  const onShowList = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  
  const onCloseList = (): void => setAnchorEl(null);
  
  let isExistNewNotification: boolean = true;
  let layout: ReactNode = null;
  
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
            maxHeight: 24 * 4.5,
            width: '250px',
          },
        }}
      >
        {Array.isArray(notifications)
          ? notifications.map((item: INotification): ReactElement => {
            const { id, title, createdAt, readAt } = item;
            const isNew: boolean = !!readAt;
            return (
              <MenuItem
                key={id}
                sx={{
                  maxHeight: 36,
                  cursor: 'default',
                }}
                className={cx({ new: isNew })}
              >
                <p>{title}</p>
              </MenuItem>
            );
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
        <div
          style={{
            position: 'relative',
          }}
        >
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