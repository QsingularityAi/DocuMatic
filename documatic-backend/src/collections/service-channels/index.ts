import { collectionAccess } from '@/access/hierarchy';
import { createSystemEventHooks } from '@/hooks/createSystemEvent';
import { CollectionConfig } from 'payload';

export const ServiceChannels: CollectionConfig = {
  slug: 'service-channels',
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
      name: 'vId',
      type: 'text',
      defaultValue: () => Math.random().toString(36).substring(2, 12), // unique id, will later be used in the public url
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'textarea',
    },
    {
      name: 'contentPlaceholder',
      type: 'textarea',
    },
    {
      name: 'contactEmail',
      type: 'text',
    },
    /*
     * Base fields are: description of the issue, media, files, requester info, and those are defined in the service request collection file
     */
    {
      name: 'customFields',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          // TODO: Support 'select' type field and configurable options
          // TODO: Add by default a first field which is the "welcome text", for instance. It should be done via hook after creating the service channel.
          options: [
            'text',
            'textarea',
            'number',
            'date',
            'file',
            'email',
            'url',
            'checkbox',
          ],
        },
      ],
      // TODO: Map these values to be a default after c reating the service channel
      defaultValue: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      hasMany: false,
      maxDepth: 0,
    },
    {
      name: 'asset',
      type: 'relationship',
      relationTo: 'assets',
      hasMany: false,
      maxDepth: 0,
    },
    // organizationRelationship,
  ],
};
