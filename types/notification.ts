export type NotificationCategory = 'motion' | 'info' | 'alert' | 'update'| 'security';

export type Notification = {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
};