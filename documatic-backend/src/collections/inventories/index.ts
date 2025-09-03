import { collectionAccess } from '@/access/hierarchy';
import { isSuperAdmin } from '@/access/isSuperAdmin';
import { createSystemEventHooks } from '@/hooks/createSystemEvent';
import { qrCodeHooks } from '@/hooks/qrcode';
import { tenantHooks } from '@/hooks/tenant';
import { CollectionConfig } from 'payload';
import { uploadHooks } from '@/hooks/upload';

export const Inventories: CollectionConfig = {
  slug: 'inventories',
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
      name: 'stock',
      type: 'number',
      required: true,
    },
    {
      name: 'qr',
      type: 'text',
      required: false,
    },
    {
      name: 'locations',
      type: 'relationship',
      relationTo: 'locations',
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
    {
      name: 'uploads',
      type: 'upload',
      relationTo: 'uploads',
      hasMany: true,
    },
    // organizationRelationship,

    // Join collections exposed to the payload admin UI only for super admins
    {
      name: 'assets',
      type: 'join',
      collection: 'assets',
      on: 'inventories',
      maxDepth: 0,
      access: {
        read: isSuperAdmin.field,
      },
    },
    {
      name: 'workOrders',
      type: 'join',
      collection: 'inventories',
      on: 'vendors',
      maxDepth: 0,
      access: {
        read: isSuperAdmin.field,
      },
    },
  ],
};
