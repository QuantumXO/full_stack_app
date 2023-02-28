import db from '../../configs/db';

const { Schema, model } = db;

export interface INotification {
  userId: string;
  tokenId: string;
  expireAt: Date;
}

export const notificationSchema = new Schema<INotification>({

});

export const NotificationModel = model<INotification>('notifications', notificationSchema);