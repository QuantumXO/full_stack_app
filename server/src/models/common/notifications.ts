import db from '@configs/db';
import { INotification } from '@interfaces/common/notifications';

const { Schema, model } = db;

export const notificationSchema = new Schema<INotification>({
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

export const NotificationModel = model<INotification>('notifications', notificationSchema);