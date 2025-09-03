import { collectionAccess } from '@/access/hierarchy';
import { createSystemEventHooks } from '@/hooks/createSystemEvent';
import { tenantHooks } from '@/hooks/tenant';
import { CollectionConfig } from 'payload';

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'text',
    defaultColumns: ['text', 'author', 'createdAt'],
  },
  access: {
    create: collectionAccess({ requiredRole: 'tenant-external-user' }),
    read: collectionAccess({ requiredRole: 'tenant-user' }),
    update: collectionAccess({ requiredRole: 'super-admin', orSelf: true }),
    delete: collectionAccess({
      requiredRole: 'tenant-manager',
      orSelf: true,
    }),
  },
  hooks: {
    beforeValidate: [tenantHooks.beforeValidate],
    afterChange: [createSystemEventHooks.afterChange],
    afterDelete: [createSystemEventHooks.afterDelete],
  },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'resource',
      type: 'relationship',
      relationTo: [
        'assets',
        'work-orders',
        'inventories',
        'locations',
        'service-requests',
        'contacts',
        'vendors',
      ],
      required: true,
    },
  ],
};
