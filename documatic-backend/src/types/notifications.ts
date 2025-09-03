import {
  WorkOrderAssignedSharedData,
  WorkOrderCompletedSharedData,
  WorkOrderOverdueSharedData,
} from './shared';

/**
 * Base type for all notification data
 */
export type BaseNotificationData = {
  recipientId: number;
};

/**
 * Work order related notification data
 */
export type WorkOrderCompletedData = BaseNotificationData &
  WorkOrderCompletedSharedData;

export type WorkOrderAssignedData = BaseNotificationData &
  WorkOrderAssignedSharedData;

export type WorkOrderOverdueData = BaseNotificationData &
  WorkOrderOverdueSharedData;

/**
 * Map of notification events to their corresponding data types
 */
export type NotificationDataMap = {
  WORK_ORDER_COMPLETED: WorkOrderCompletedData;
  WORK_ORDER_ASSIGNED: WorkOrderAssignedData;
  WORK_ORDER_OVERDUE: WorkOrderOverdueData;
};

/**
 * Supported notification channels
 */
export type NotificationChannel = 'email' | 'app' | 'push';

/**
 * User notification preferences
 */
export type NotificationPreferences = {
  [key: string]: boolean;
};
