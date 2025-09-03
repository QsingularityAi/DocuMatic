import { collectionAccess } from '@/access/hierarchy';
import { createSystemEventHooks } from '@/hooks/createSystemEvent';
import { CollectionConfig } from 'payload';

export const Organizations: CollectionConfig = {
  slug: 'organizations',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: collectionAccess({
      requiredRole: 'tenant-admin',
    }),
    read: collectionAccess({
      requiredRole: 'tenant-user',
    }),
    update: collectionAccess({
      requiredRole: 'tenant-manager',
    }),
    delete: collectionAccess({
      requiredRole: 'tenant-admin',
    }),
  },
  hooks: {
    afterChange: [createSystemEventHooks.afterChange],
    afterDelete: [createSystemEventHooks.afterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
};
