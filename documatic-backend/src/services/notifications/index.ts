import { emailChannel } from '@/services/notifications/channels/email';
import {
  NOTIFICATION_CHANNELS,
  NOTIFICATION_EVENTS,
} from '@/services/notifications/constants';
import type {
  NotificationDataMap,
  NotificationPreferences,
} from '@/types/notifications';
import { Payload } from 'payload';

type NotificationEvent = keyof typeof NOTIFICATION_EVENTS;

/**
 * Get user's notification preferences
 * For MVP, we'll return default preferences (email only)
 */
const getUserPreferences = async (
  userId: number,
): Promise<NotificationPreferences> => {
  // TODO: In the future, fetch this from user's preferences in database
  return {
    [NOTIFICATION_CHANNELS.EMAIL]: true,
    [NOTIFICATION_CHANNELS.APP]: false,
    [NOTIFICATION_CHANNELS.PUSH]: false,
  };
};

/**
 * Main notification service
 * Handles sending notifications through configured channels based on user preferences
 */
export const notificationService = {
  /**
   * Send a notification through configured channels
   */
  notify: async <T extends NotificationEvent>(
    event: T,
    data: NotificationDataMap[T],
    payload: Payload,
  ): Promise<void> => {
    try {
      // Get user preferences
      const preferences = await getUserPreferences(data.recipientId);

      // Send through enabled channels
      const sendPromises: Promise<void>[] = [];

      // Email channel
      if (preferences[NOTIFICATION_CHANNELS.EMAIL]) {
        sendPromises.push(emailChannel.send(event, data, payload));
      }

      // Further, not for now :D
      // if (preferences[NOTIFICATION_CHANNELS.APP]) {
      //   sendPromises.push(appChannel.send(event, data));
      // }

      // Wait for all notifications to be sent
      await Promise.all(sendPromises);
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  },
};
