import { emailService } from '@/services/emails';
import { NOTIFICATION_EVENTS } from '@/services/notifications/constants';
import type { NotificationDataMap } from '@/types/notifications';
import type { User } from '@/types/payload';
import { NOTIFICATION_TEMPLATE_PATHS } from '@/types/shared';
import { Payload } from 'payload';

type NotificationEvent = keyof typeof NOTIFICATION_EVENTS;

type EventConfig<T extends NotificationEvent> = {
  template: (typeof NOTIFICATION_TEMPLATE_PATHS)[keyof typeof NOTIFICATION_TEMPLATE_PATHS];
  getSubject: (data: NotificationDataMap[T]) => string;
  getPeak: (data: NotificationDataMap[T]) => string;
};

/**
 * Map of notification events to their email template paths and data transformation
 */
const EVENT_TO_EMAIL_TEMPLATE: {
  [K in NotificationEvent]?: EventConfig<K>;
} = {
  [NOTIFICATION_EVENTS.WORK_ORDER_COMPLETED]: {
    template: NOTIFICATION_TEMPLATE_PATHS.WORK_ORDER_COMPLETED,
    getSubject: (data: NotificationDataMap['WORK_ORDER_COMPLETED']) =>
      `Work Order Completed: #${data.workOrderId} ${data.workOrderName}`,
    getPeak: (data: NotificationDataMap['WORK_ORDER_COMPLETED']) =>
      `by ${data.completedBy.name}`,
  },
  [NOTIFICATION_EVENTS.WORK_ORDER_ASSIGNED]: {
    template: NOTIFICATION_TEMPLATE_PATHS.WORK_ORDER_ASSIGNED,
    getSubject: (data: NotificationDataMap['WORK_ORDER_ASSIGNED']) =>
      `Work Order Assigned: #${data.workOrderId} ${data.workOrderName}`,
    getPeak: (data: NotificationDataMap['WORK_ORDER_ASSIGNED']) =>
      `by ${data.assignedBy.name}`,
  },
  [NOTIFICATION_EVENTS.WORK_ORDER_OVERDUE]: {
    template: NOTIFICATION_TEMPLATE_PATHS.WORK_ORDER_OVERDUE,
    getSubject: (data: NotificationDataMap['WORK_ORDER_OVERDUE']) =>
      `Work Order Overdue: #${data.workOrderId} ${data.workOrderName}`,
    getPeak: (data: NotificationDataMap['WORK_ORDER_OVERDUE']) =>
      `Due on ${data.workOrderDueDate}`,
  },
} as const;

/**
 * Handles sending notifications via email channel
 */
export const emailChannel = {
  /**
   * Send a notification via email
   */
  send: async <T extends NotificationEvent>(
    event: T,
    data: NotificationDataMap[T],
    payload: Payload,
  ): Promise<void> => {
    try {
      // Get recipient user data
      const recipient = (await payload.findByID({
        collection: 'users',
        id: data.recipientId,
      })) as User;

      if (!recipient) {
        throw new Error(`Recipient user not found: ${data.recipientId}`);
      }

      if (!recipient.email) {
        throw new Error(`Recipient has no email address: ${data.recipientId}`);
      }

      const eventConfig = EVENT_TO_EMAIL_TEMPLATE[event];
      if (!eventConfig) {
        throw new Error(`Unsupported notification event: ${event}`);
      }

      // Send notification email using the email service
      await emailService.sendTemplate(
        eventConfig.template,
        {
          to: recipient.email,
          subject: eventConfig.getSubject(data),
          peak: eventConfig.getPeak(data),
          ...data,
        },
        payload,
      );
    } catch (error) {
      console.error('Failed to send email notification:', error);
      throw error;
    }
  },
};
