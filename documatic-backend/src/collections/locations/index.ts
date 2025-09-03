import { collectionAccess } from '@/access/hierarchy';
import { isSuperAdmin } from '@/access/isSuperAdmin';
import { createSystemEventHooks } from '@/hooks/createSystemEvent';
import { qrCodeHooks } from '@/hooks/qrcode';
import { tenantHooks } from '@/hooks/tenant';
import { CollectionConfig } from 'payload';
import { uploadHooks } from '@/hooks/upload';

export const Locations: CollectionConfig = {
  slug: 'locations',
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
    beforeChange: [uploadHooks.beforeChange],
    afterChange: [
      createSystemEventHooks.afterChange,
      qrCodeHooks.afterChange,
      uploadHooks.afterChange,
    ],
    afterDelete: [createSystemEventHooks.afterDelete],
  },
  fields: [
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
      name: 'qr',
      type: 'text',
      required: false,
    },
    {
      name: 'uploads',
      type: 'upload',
      relationTo: 'uploads',
      hasMany: true,
    },
    // organizationRelationship,

    // Join collections exposed to the payload admin UI only for super admins
    {
      name: 'inventories',
      type: 'join',
      collection: 'inventories',
      on: 'locations',
      maxDepth: 0,
      access: {
        read: isSuperAdmin.field,
      },
    },
    {
      name: 'workOrders',
      type: 'join',
      collection: 'work-orders',
      on: 'location',
      maxDepth: 0,
      access: {
        read: isSuperAdmin.field,
      },
    },
  ],
};
