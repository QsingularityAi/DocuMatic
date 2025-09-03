import { SystemEventResourceType, SystemEventType } from '@/types/shared';
import { CollectionConfig } from 'payload';
import { tenantHooks } from '@/hooks/tenant';

export const SystemEvents: CollectionConfig = {
  slug: 'system-events',
  admin: {
    useAsTitle: 'event',
    defaultColumns: ['event', 'resourceType', 'userId', 'timestamp'],
    // hidden: true,
  },
  access: {
    create: () => false, // Only system can create
    read: () => true, // All authenticated users can read
    update: () => false, // Events are immutable
    delete: () => false, // Events cannot be deleted
  },
  hooks: {
    beforeValidate: [tenantHooks.beforeValidate],
  },
  fields: [
    {
      // Instead of making a relationship to the user, we'll just store the user ID in order to avoid a circular dependency, which will create another record in the table users_rels per each event.
      // TODO: Find a way to improve the above described issue. Perhaps move the whole event creation to redis or something like that.
      name: 'userId',
      type: 'number',
      required: true,
    },
    {
      name: 'event',
      type: 'select',
      required: true,
      options: ['create', 'update', 'delete'] satisfies SystemEventType[],
    },
    {
      name: 'resourceType',
      type: 'select',
      required: true,
      options: [
        'assets',
        'asset-statuses',
        'contacts',
        'inventories',
        'locations',
        'uploads',
        'organizations',
        'service-channels',
        'service-requests',
        'teams',
        'users',
        'vendors',
        'work-orders',
        'comments',
        'sensors',
      ] satisfies SystemEventResourceType[],
    },
    {
      name: 'resourceId',
      type: 'number',
      required: true,
    },
    {
      name: 'changes',
      type: 'json',
      required: false,
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
    },
  ],
  timestamps: false,
};
