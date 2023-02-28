import { Server, Socket } from 'socket.io';
import { INotification, NotificationEventType } from '@interfaces/common/notifications';
import { NotificationModel } from '@models/common/notifications';
import { ioServer } from '@src/server';

export function registerNotificationsHandlers(io: Server, socket: Socket): void {
  // socket.emit('notifications:list', { data: { notifications: mockNotifications } });
  
  socket.on('notifications:create', (args) => {
    console.log('notifications:create args: ', args);
  });
  
  socket.on('notifications:read', (args) => {
    console.log('notifications:read args: ', args);
  });
  socket.on('notifications:delete', (args) => {
  });
  socket.on('notifications:update', (args) => {
  });
  socket.on('notifications:list', (args) => {
    console.log('notifications:list args: ', args);
  });
}

async function createNotification(
  eventType: NotificationEventType,
  params: Record<string, unknown>
): Promise<INotification> {
  const { userId } = params as { userId: string };
  
  let onlyCreateNew: boolean = true;
  let notification: INotification;
  
  try {
    switch (eventType) {
      case 'USER_LOGIN': {
        notification = {
          userId,
          eventType,
          type: 'success',
          title: 'Login Success!',
          content: 'You have been successfully logged into platform',
          author: 'system',
          createdAt: new Date(),
        };
        onlyCreateNew = false;
        break;
      }
      default: throw new Error('createNotification() invalid event type');
    }
    
    if (onlyCreateNew) {
      await NotificationModel.create(notification);
    } else {
      await NotificationModel.findOneAndUpdate({ userId, eventType }, notification, {
        new: true,
        upsert: true, // Make this update into an upsert
      }).exec();
    }
    
    ioServer.emit('notifications:create', notification);
    
    return notification;
  } catch (e) {
    throw new Error(e);
  }
}

export default {
  createNotification,
};