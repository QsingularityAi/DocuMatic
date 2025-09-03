import { SystemEvent, SystemEventResourceType } from '@/types/shared';
import { getCurrentDate } from '@/utilities/dates';
import {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionSlug,
  Payload,
  PayloadRequest,
} from 'payload';
import { getUserTenantId } from './tenant';

/**
 * Creates a system event entry in the database
 * @param payload - Payload instance
 * @param eventData - Data for the system event
 */
const createSystemEventEntry = async (
  payload: Payload,
  eventData: SystemEvent,
) => {
  try {
    await payload.create({
      collection: 'system-events',
      data: eventData,
    });
  } catch (error) {
    console.error('Failed to create system event:', error);
  }
};

/**
 * Checks if the hook should be skipped based on conditions
 */
const shouldSkipHook = (
  req: PayloadRequest,
  collectionSlug: CollectionSlug,
): boolean => {
  // Skip if no user is logged in or if the collection is `tenants` or `system-events` so it does not create an infinite loop
  return (
    !req.user ||
    collectionSlug === 'tenants' ||
    collectionSlug === 'system-events' ||
    collectionSlug.startsWith('payload-')
  );
};

export const createSystemEventHooks = {
  /**
   * After Change hook for tracking create and update operations
   */
  afterChange: (async ({ req, doc, operation, collection }) => {
    if (shouldSkipHook(req, collection.slug)) return doc;

    await createSystemEventEntry(req.payload, {
      userId: req.user!.id,
      event: operation,
      resourceType: collection.slug as SystemEventResourceType,
      resourceId: doc.id,
      changes: undefined,
      timestamp: getCurrentDate(),
      tenant: doc.tenant || getUserTenantId(req.user!),
    });

    return doc;
  }) satisfies CollectionAfterChangeHook,

  /**
   * After Delete hook for tracking delete operations
   */
  afterDelete: (async ({ req, doc, collection }) => {
    if (shouldSkipHook(req, collection.slug)) return doc;

    await createSystemEventEntry(req.payload, {
      userId: req.user!.id,
      event: 'delete',
      resourceType: collection.slug as SystemEventResourceType,
      resourceId: doc.id,
      changes: undefined,
      timestamp: getCurrentDate(),
      tenant: doc.tenant || getUserTenantId(req.user!),
    });

    return doc;
  }) satisfies CollectionAfterDeleteHook,
};
