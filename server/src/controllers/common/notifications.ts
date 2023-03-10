import { Socket, } from 'socket.io';
import {
  ICreateNotification,
  IDbNotification,
  INotification,
  NotificationsEventType,
  NotificationsEventsHandlers,
  NotificationsEvents
} from '@interfaces/common/notifications';
import { NotificationModel } from '@models/common/notifications';
import customError from '@services/custom-error';
import { ioServer } from '@src/server';

export function registerNotificationsHandlers(socket: Socket): void {
  socket.on(NotificationsEventsHandlers.READ_NOTIFICATION, readNotification);
  socket.on(NotificationsEventsHandlers.GET_NOTIFICATIONS_LIST, getNotifications);
}

async function getNotifications(args: { userId: unknown }): Promise<INotification[]> {
  const { userId } = args;
  let result: INotification[] = []
  
  if (typeof userId === 'string') {
    const notifications: IDbNotification[] = await NotificationModel
      .find({ userId })
      .sort('-createdAt')
      .select('_id eventType author content createdAt title type readAt expireAt')
      .exec();
    
    let newNotificationsCount: number = 0;
  
    const responseNotifications: INotification[] = notifications.map((item: IDbNotification): INotification => {
      const { _id, eventType, type, createdAt, author, content, title, readAt, expireAt } = item;
      
      !readAt && newNotificationsCount++;
      
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
  
    ioServer.emit(
      NotificationsEventsHandlers.GET_NOTIFICATIONS_LIST,
      {
        notifications: responseNotifications,
        newNotificationsCount,
      }
    );
  }
  
  return result;
}

async function readNotification(args: { id: string }): Promise<void> {
  const { id } = args;
  
  try {
    const readAt = new Date();
    
    const selectedNotification: IDbNotification = await NotificationModel.findByIdAndUpdate(
      id,
      { readAt },
      {
        new: true,
        upsert: true, // Make this update into an upsert
      }
    ).exec();
    
    const { _id, expireAt, author, content, title, type, createdAt, eventType, userId } = selectedNotification;
    
    const responseNotification: INotification = {
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
  
    const unreadNotifications: IDbNotification[] = await NotificationModel
      .find({ readAt: { $exists: false }, userId })
      .exec()
  
    ioServer.emit(
      NotificationsEventsHandlers.READ_NOTIFICATION,
      {
        notification: responseNotification,
        newNotificationsCount: unreadNotifications.length,
      }
    );
  } catch (e) {
    customError(e?.name, e?.message, true);
  }
}

async function createNotification(
  eventType: NotificationsEventType,
  params: Record<string, unknown>
): Promise<INotification> {
  const { userId } = params as { userId: string };
  
  let newNotification: ICreateNotification;
  let createdNotification: IDbNotification;
  
  try {
    switch (eventType) {
      case NotificationsEvents.USER_LOGIN: {
        newNotification = {
          userId,
          eventType,
          type: 'success',
          author: 'system',
          title: 'Login Success!',
          content: 'You have been successfully logged into platform',
        };
        break;
      }
      case NotificationsEvents.USER_CREATED: {
        newNotification = {
          userId,
          eventType,
          type: 'success',
          author: 'system',
          title: 'Registration success!',
          content: 'Congratulation, your account has been successfully created.',
        };
        break;
      }
      default: customError(null, 'createNotification() invalid event type', true);
    }
  
    createdNotification = await NotificationModel.create(newNotification);
    
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
      
      ioServer.emit(NotificationsEventsHandlers.CREATE_NOTIFICATION, responseNotification);
      
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