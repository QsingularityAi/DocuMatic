import { collectionAccess } from '@/access/hierarchy';
import { isSuperAdmin } from '@/access/isSuperAdmin';
import { createSystemEventHooks } from '@/hooks/createSystemEvent';
import { tenantHooks } from '@/hooks/tenant';
import { CollectionConfig } from 'payload';

export const Teams: CollectionConfig = {
  slug: 'teams',
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
    },
    {
      name: 'users',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    // organizationRelationship,

    // Join collections exposed to the payload admin UI only for super admins
    // {
    //   name: 'users',
    //   type: 'join',
    //   collection: 'users',
    //   on: 'teams',
    //   maxDepth: 0,
    //   access: {
    //     read: isSuperAdmin.field,
    //   },
    // },
    {
      name: 'workOrders',
      type: 'join',
      collection: 'work-orders',
      on: 'assignment.teams',
      maxDepth: 0,
      access: {
        read: isSuperAdmin.field,
      },
    },
  ],
};
