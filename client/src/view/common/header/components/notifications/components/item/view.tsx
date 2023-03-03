import React, { ReactElement } from 'react';
import cx from 'classnames';
import { MenuItem, Typography } from '@mui/material';
import { INotification } from '@models/common/notifications';

export interface IProps extends INotification {
  onRead: (id: string) => void;
}

export function Notification(props: IProps): ReactElement {
  const { id, title, author = '', content, readAt, onRead } = props;
  const isNew: boolean = !readAt;
  
  const onHandleRead = (): void | false => isNew && onRead(id);
  
  return (
    <MenuItem
      sx={{
        width: '100%',
        maxHeight: 64,
        backgroundColor: isNew ? '#fffce9' : 'inherit',
        cursor: isNew ? 'pointer' : 'default',
      }}
      className={cx({ new: isNew })}
      onClick={onHandleRead}
    >
      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ }}>
          <Typography
            style={{
              width: 24,
              height: 24,
              minWidth: 24,
              display: 'inline-flex',
              color: '#fff',
              fontSize: '12px',
              borderRadius: '50%',
              alignItems: 'center',
              justifyContent: 'center',
              textTransform: 'uppercase',
              backgroundColor: '#4c5fd5',
          }}
          >
            {author[0]}
          </Typography>
        </div>
        <div
          style={{
            width: '100%',
            maxWidth: 'calc(100% - 10px - 24px)',
            display: 'flex',
            flexDirection: 'column',
            marginLeft: 10,
        }}
        >
          <Typography
            style={{
              width: '100%',
              display: 'inline-block',
              overflow: 'hidden',
              fontWeight: 700,
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </Typography>
          <Typography
            style={{
              width: '100%',
              display: 'inline-block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {content}
          </Typography>
        </div>
      </div>
    </MenuItem>
  );
}