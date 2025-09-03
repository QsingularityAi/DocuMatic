import { notificationService } from '@/services/notifications';
import { NOTIFICATION_EVENTS } from '@/services/notifications/constants';
import { CollectionAfterChangeHook } from 'payload';

export const notificationHooks = {
  /**
   * After Change hook for tracking create and update operations
   */
  afterChange: (async ({ req, doc, operation }) => {
    if (operation === 'update') {
      if (doc.status === 'done') {
        // Send notification of work order completion to the creator as long is not the same user that completed the work order
        if (req.user!.id !== doc.createdBy.id) {
          await notificationService.notify(
            NOTIFICATION_EVENTS.WORK_ORDER_COMPLETED,
            {
              recipientId: doc.createdBy.id,
              workOrderId: doc.id,
              workOrderName: doc.name,
              completedBy: {
                id: req.user!.id,
                name:
                  `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() ||
                  'Unknown User',
              },
            },
            req.payload,
          );
        }
      }
    }
  }) satisfies CollectionAfterChangeHook,
};
