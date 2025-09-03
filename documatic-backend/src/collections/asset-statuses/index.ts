import { collectionAccess } from '@/access/hierarchy';
import { createSystemEventHooks } from '@/hooks/createSystemEvent';
import { tenantHooks } from '@/hooks/tenant';
import { AssetStatusDowntimeType, AssetStatusType } from '@/types/shared';
import { CollectionConfig } from 'payload';

export const AssetStatuses: CollectionConfig = {
  slug: 'asset-statuses',
  admin: {
    useAsTitle: 'status',
    defaultColumns: ['status', 'asset', 'updatedAt'],
  },
  access: {
    create: collectionAccess({ requiredRole: 'tenant-user' }),
    read: collectionAccess({ requiredRole: 'tenant-user' }),
    update: () => false, // Statuses are immutable
    delete: () => false, // Statuses can't be deleted
  },
  hooks: {
    beforeValidate: [tenantHooks.beforeValidate],
    afterChange: [createSystemEventHooks.afterChange],
    afterDelete: [createSystemEventHooks.afterDelete],
  },
  fields: [
    {
      name: 'asset',
      type: 'relationship',
      relationTo: 'assets',
      required: true,
      hasMany: false,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: ['online', 'offline', 'no-tracking'] satisfies AssetStatusType[],
    },
    {
      name: 'downtimeType',
      type: 'select',
      options: ['planned', 'unplanned'] satisfies AssetStatusDowntimeType[],
      required: false,
    },
    {
      name: 'notes',
      type: 'textarea',
      required: false,
    },
    {
      name: 'dateFrom',
      type: 'date',
      required: false,
    },
    {
      name: 'dateTo',
      type: 'date',
      required: false,
    },
  ],
};
