export type NotificationType = 'info' | 'success' | 'error' | 'warning' | 'default';
export type NotificationEventType = 'USER_LOGIN';
export interface INotification {
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