import { collectionAccess } from '@/access/hierarchy';
import { isSuperAdmin } from '@/access/isSuperAdmin';
import { createSystemEventHooks } from '@/hooks/createSystemEvent';
import { tenantHooks } from '@/hooks/tenant';
import { CollectionConfig } from 'payload';

export const Vendors: CollectionConfig = {
  slug: 'vendors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
  },
  access: {
    create: collectionAccess({ requiredRole: 'tenant-manager' }),
    read: collectionAccess({ requiredRole: 'tenant-user' }),
    update: collectionAccess({ requiredRole: 'tenant-manager' }),
    delete: collectionAccess({ requiredRole: 'tenant-manager' }),
  },
  hooks: {
    beforeValidate: [tenantHooks.beforeValidate],
    afterChange: [createSystemEventHooks.afterChange],
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
      required: true,
    },
    {
      name: 'contacts',
      type: 'relationship',
      relationTo: 'contacts',
      hasMany: true,
      // maxDepth: 0,
    },
    // organizationRelationship,

    // Join collections exposed to the payload admin UI only for super admins
    {
      name: 'assets',
      type: 'join',
      collection: 'assets',
      on: 'vendors',
      maxDepth: 0,
      access: {
        read: isSuperAdmin.field,
      },
    },
    {
      name: 'inventories',
      type: 'join',
      collection: 'inventories',
      on: 'vendors',
      maxDepth: 0,
      access: {
        read: isSuperAdmin.field,
      },
    },
    {
      name: 'workOrders',
      type: 'join',
      collection: 'work-orders',
      on: 'vendors',
      maxDepth: 0,
      access: {
        read: isSuperAdmin.field,
      },
    },
  ],
};
