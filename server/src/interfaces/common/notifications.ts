export type NotificationType = 'info' | 'success' | 'error' | 'warning' | 'default';
export enum NotificationsEvents {
  'USER_LOGIN' = 'USER_LOGIN',
  'USER_CREATED' = 'USER_CREATED',
}
export type NotificationsEventType = keyof typeof NotificationsEvents;
export interface ICreateNotification {
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  author: string;
  eventType: string;
  createdAt: Date;
  expireAt?: Date;
}
export interface INotification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  author: string;
  eventType: string;
  createdAt: Date;
  readAt?: Date;
  expireAt?: Date;
}
export interface IDbNotification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  author: string;
  eventType: string;
  createdAt: Date;
  readAt?: Date;
  expireAt?: Date;
}

export enum NotificationsEventsHandlers {
  'READ_NOTIFICATION' = 'notifications:read',
  'GET_NOTIFICATIONS_LIST' = 'notifications:list',
  'CREATE_NOTIFICATION' = 'notifications:create',
}