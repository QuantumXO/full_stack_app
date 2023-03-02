import { Server, Socket } from 'socket.io';
import {
  ICreateNotification, IDbNotification, INotification, NotificationEventType
} from '@interfaces/common/notifications';
import { NotificationModel } from '@models/common/notifications';
import { ioServer } from '@src/server';
import customError from '@services/get-custom-error';

export function registerNotificationsHandlers(io: Server, socket: Socket): void {
  socket.on('notifications:list', getNotifications);
  socket.on('notifications:read', () => console.log('read'));
}

async function getNotifications(args: { userId: unknown }): Promise<INotification[]> {
  const { userId } = args;
  let result: INotification[] = []
  
  if (typeof userId === 'string') {
    const notifications: IDbNotification[] = await NotificationModel
      .find({ userId })
      .sort('createdAt')
      .select('_id eventType author content createdAt title type readAt expireAt')
      .exec();
  
    const responseNotifications: INotification[] = notifications.map((item: IDbNotification): INotification => {
      const { _id, eventType, type, createdAt, author, content, title, readAt, expireAt } = item;
      return {
        id: String(_id),
        eventType,
        type,
        createdAt,
        author,
        content,
        title,
        readAt,
        expireAt
      };
    });
    
    ioServer.emit('notifications:list', responseNotifications);
  }
  
  return result;
}

async function readNotification(args: { id: string }): Promise<void> {
  console.log('notifications:read args: ', args);
}

async function createNotification(
  eventType: NotificationEventType,
  params: Record<string, unknown>
): Promise<INotification> {
  const { userId } = params as { userId: string };
  
  let onlyCreateNew: boolean = true;
  let newNotification: ICreateNotification;
  let createdNotification: IDbNotification;
  
  try {
    switch (eventType) {
      case 'USER_LOGIN': {
        newNotification = {
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
      default: customError(null, 'createNotification() invalid event type', true);
    }
    
    if (onlyCreateNew) {
      createdNotification = await NotificationModel.create(newNotification);
    } else {
      createdNotification = await NotificationModel
        .findOneAndUpdate({ userId, eventType }, newNotification, {
          new: true,
          upsert: true, // Make this update into an upsert
        })
        .exec();
    }
    
    if (createdNotification) {
      const { _id, eventType, type, createdAt, author, content, title, readAt, expireAt } = createdNotification;
  
      const responseNotification: INotification = {
        id: String(_id),
        eventType,
        type,
        createdAt,
        author,
        content,
        title,
        readAt,
        expireAt,
      };
      
      ioServer.emit('notifications:create', responseNotification);
      
      return responseNotification;
    } else {
      customError(null, 'createNotification() error', true);
    }
  } catch (e) {
    customError(null, e, true);
  }
}

export default {
  createNotification,
};