import { collectionAccess } from '@/access/hierarchy';
import { createAssetStatusHooks } from '@/collections/assets/hooks/createAssetStatus';
import { createSystemEventHooks } from '@/hooks/createSystemEvent';
import { qrCodeHooks } from '@/hooks/qrcode';
import { tenantHooks } from '@/hooks/tenant';
import { uploadHooks } from '@/hooks/upload';
import { CollectionConfig } from 'payload';

export const Assets: CollectionConfig = {
  slug: 'assets',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
  },
  access: {
    create: collectionAccess({ requiredRole: 'tenant-manager' }),
    read: collectionAccess({ requiredRole: 'tenant-user' }),
    update: collectionAccess({ requiredRole: 'tenant-manager' }),
    delete: collectionAccess({ requiredRole: 'tenant-admin' }),
  },
  hooks: {
    beforeValidate: [tenantHooks.beforeValidate],
    beforeChange: [
      createAssetStatusHooks.beforeChange,
      uploadHooks.beforeChange,
    ],
    beforeDelete: [createAssetStatusHooks.beforeDelete],
    afterChange: [
      createAssetStatusHooks.afterChange,
      createSystemEventHooks.afterChange,
      qrCodeHooks.afterChange,
      uploadHooks.afterChange,
    ],
    afterDelete: [createSystemEventHooks.afterDelete],
  },
  fields: [
    {
      name: 'currentStatus',
      type: 'relationship',
      relationTo: 'asset-statuses',
      hasMany: false,
      maxDepth: 1,
      // graphQL: {
      //   complexity: 10,
      // },
      // Filter options for the current viewing document to avoid performance issues when expanding the relationship field in the admin UI
      filterOptions: ({ id }) => ({
        // TODO: Limit to 1?
        and: [
          {
            asset: {
              equals: id,
            },
          },
        ],
      }),
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
    },
    {
      name: 'uploads',
      type: 'upload',
      relationTo: 'uploads',
      hasMany: true,
    },
    {
      name: 'manufacturer',
      type: 'text',
      required: true,
    },
    {
      name: 'model',
      type: 'text',
      required: false,
    },
    {
      name: 'year',
      type: 'number',
      required: false,
    },
    {
      name: 'qr',
      type: 'text',
      required: false,
    },
    {
      name: 'teams',
      type: 'relationship',
      relationTo: 'teams',
      hasMany: true,
      maxDepth: 0,
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      hasMany: false,
      maxDepth: 1,
    },
    {
      name: 'inventories',
      type: 'relationship',
      relationTo: 'inventories',
      hasMany: true,
      maxDepth: 1,
    },
    {
      name: 'vendors',
      type: 'relationship',
      relationTo: 'vendors',
      hasMany: true,
      maxDepth: 1,
    },
    // Join / Virtual fields
    {
      name: 'workOrders',
      type: 'join',
      collection: 'work-orders',
      on: 'asset',
      maxDepth: 1,
    },
    {
      name: 'sensors',
      type: 'join',
      collection: 'sensors',
      on: 'asset',
      maxDepth: 1,
    },
  ],
};
