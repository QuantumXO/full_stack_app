import { Schema, model } from 'mongoose';
import { IDbNotification } from '@interfaces/common/notifications';

export const notificationSchema = new Schema<IDbNotification>({
  userId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  readAt: Date,
  expireAt: Date,
});

export const NotificationModel = model<IDbNotification>('notifications', notificationSchema);