/**
 * Available notification channels
 */
export const NOTIFICATION_CHANNELS = {
  EMAIL: 'email',
  APP: 'app',
  PUSH: 'push',
} as const;

/**
 * All possible notification events in the system
 */
export const NOTIFICATION_EVENTS = {
  WORK_ORDER_COMPLETED: 'WORK_ORDER_COMPLETED',
  WORK_ORDER_ASSIGNED: 'WORK_ORDER_ASSIGNED',
  WORK_ORDER_OVERDUE: 'WORK_ORDER_OVERDUE',
} as const;
