export type NotificationType = 'info' | 'success' | 'error' | 'warning' | 'default';

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