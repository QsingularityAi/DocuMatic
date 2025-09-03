import { collectionAccess } from '@/access/hierarchy';
import { isSuperAdmin } from '@/access/isSuperAdmin';
import { createSystemEventHooks } from '@/hooks/createSystemEvent';
import { CollectionConfig } from 'payload';

export const ServiceRequests: CollectionConfig = {
  slug: 'service-requests',
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
    // Information provided by custom fields in the service channel
    // TODO: This field will contain name and description which are essential values for creating the service request and they should be mapped to "name" and "description" fields of this collection for its creation via hook beforeCreate
    {
      name: 'metaInfo',
      type: 'json',
    },
    {
      name: 'uploads',
      type: 'upload',
      relationTo: 'uploads',
      hasMany: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'approved', 'declined', 'closed'],
      defaultValue: 'pending',
    },
    // organizationRelationship,

    // Join collections exposed to the payload admin UI only for super admins
    {
      name: 'workOrder',
      type: 'join',
      collection: 'work-orders',
      on: 'serviceRequest',
      maxDepth: 0,
      access: {
        read: isSuperAdmin.field,
      },
    },
  ],
};
