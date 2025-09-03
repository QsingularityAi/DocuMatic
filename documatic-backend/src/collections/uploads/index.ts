import { collectionAccess } from '@/access/hierarchy';
import { createSystemEventHooks } from '@/hooks/createSystemEvent';
import { tenantHooks } from '@/hooks/tenant';
import { CollectionConfig } from 'payload';

export const Uploads: CollectionConfig = {
  slug: 'uploads',
  upload: {
    mimeTypes: [
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/rtf ',
      'image/*',
    ],
    // staticDir: 'uploads',
    disableLocalStorage: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        fit: 'inside',
        withoutEnlargement: false,
      },
    ],
    adminThumbnail: 'thumbnail',
  },
  admin: {
    useAsTitle: 'filename',
  },
  access: {
    create: collectionAccess({ requiredRole: 'tenant-user' }),
    read: collectionAccess({ requiredRole: 'tenant-user' }),
    update: collectionAccess({ requiredRole: 'tenant-admin' }),
    delete: collectionAccess({
      requiredRole: 'tenant-admin',
      orSelf: true,
      keyName: 'createdBy',
    }),
  },
  hooks: {
    beforeValidate: [tenantHooks.beforeValidate],
    afterChange: [createSystemEventHooks.afterChange],
    afterDelete: [createSystemEventHooks.afterDelete],
  },
  fields: [
    {
      name: 'createdBy',
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
      ],
      required: false,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        {
          label: 'File',
          value: 'file',
        },
        {
          label: 'Media',
          value: 'media',
        },
      ],
      defaultValue: 'file',
    },
  ],
};
