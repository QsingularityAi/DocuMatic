import { collectionAccess } from '@/access/hierarchy';
import { notificationHooks } from '@/collections/work-orders/hooks/notifications';
import { workOrderHooks } from '@/collections/work-orders/hooks/onStatusChange';
import { createSystemEventHooks } from '@/hooks/createSystemEvent';
import { tenantHooks } from '@/hooks/tenant';
import { uploadHooks } from '@/hooks/upload';
import { CollectionConfig } from 'payload';

export const WorkOrders: CollectionConfig = {
  slug: 'work-orders',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
  },
  access: {
    create: collectionAccess({ requiredRole: 'tenant-user' }),
    read: collectionAccess({ requiredRole: 'tenant-user' }),
    update: collectionAccess({ requiredRole: 'tenant-manager' }),
    delete: collectionAccess({ requiredRole: 'tenant-admin' }),
  },
  hooks: {
    beforeValidate: [tenantHooks.beforeValidate],
    beforeChange: [uploadHooks.beforeChange],
    afterChange: [
      notificationHooks.afterChange,
      createSystemEventHooks.afterChange,
      workOrderHooks.afterChange,
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
      name: 'uploads',
      type: 'upload',
      relationTo: 'uploads',
      hasMany: true,
    },
    {
      name: 'estimatedTime',
      type: 'group',
      fields: [
        {
          name: 'hours',
          type: 'number',
        },
        {
          name: 'minutes',
          type: 'number',
        },
      ],
    },
    {
      name: 'procedure',
      type: 'array',
      fields: [
        {
          name: 'step',
          type: 'text',
        },
      ],
      defaultValue: [
        {
          step: 'Step 1: Do this or that',
        },
      ],
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      required: false,
      defaultValue: ({ user }) => user?.id,
    },
    {
      name: 'assignment',
      type: 'group',
      fields: [
        {
          name: 'users',
          type: 'relationship',
          relationTo: 'users',
          hasMany: true,
        },
        {
          name: 'teams',
          type: 'relationship',
          relationTo: 'teams',
          hasMany: false,
        },
      ],
    },
    {
      name: 'date',
      type: 'group',
      fields: [
        {
          name: 'start',
          type: 'date',
          required: true,
        },
        {
          name: 'due',
          type: 'date',
          required: false,
        },
      ],
    },
    {
      name: 'type',
      type: 'select',
      options: ['reactive', 'preventive', 'other'],
      defaultValue: 'preventive',
    },
    {
      name: 'recurrence',
      type: 'group',
      fields: [
        {
          // Specifies the type of recurrence (e.g., none, daily, weekly, etc.)
          name: 'type',
          type: 'select',
          options: [
            'none',
            'daily',
            'weekly',
            'monthlyByDate',
            'monthlyByWeekday',
            'yearly',
          ],
          defaultValue: 'none',
        },
        {
          // Defines the interval for recurrence (e.g., every 1 day, every 2 weeks)
          name: 'interval',
          type: 'number',
          required: false,
          admin: {
            condition: (data) => data.recurrence?.type !== 'none',
          },
        },
        {
          // Contains additional details specific to the selected recurrence type
          name: 'details',
          type: 'group',
          admin: {
            condition: (data) => data.recurrence?.type !== 'none',
          },
          fields: [
            {
              // Specifies the days of the week for weekly recurrence (e.g., Monday, Friday)
              name: 'daysOfWeek',
              type: 'array',
              required: false,
              admin: {
                condition: (data) => data.recurrence?.type === 'weekly',
              },
              fields: [
                {
                  name: 'day',
                  type: 'select',
                  options: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ],
                },
              ],
            },
            {
              // Specifies the date of the month for monthly recurrence by date (e.g., 15th)
              name: 'dateOfMonth',
              type: 'number',
              required: false,
              admin: {
                condition: (data) => data.recurrence?.type === 'monthlyByDate',
              },
            },
            {
              // Specifies the week and day for monthly recurrence by weekday (e.g., 2nd Sunday)
              name: 'weekdayOfMonth',
              type: 'group',
              admin: {
                condition: (data) =>
                  data.recurrence?.type === 'monthlyByWeekday',
              },
              fields: [
                {
                  // Specifies the week of the month (e.g., 1st, 2nd, last)
                  name: 'week',
                  type: 'select',
                  options: ['1st', '2nd', '3rd', '4th', 'last'],
                },
                {
                  // Specifies the day of the week (e.g., Monday, Sunday)
                  name: 'day',
                  type: 'select',
                  options: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ],
                },
              ],
            },
            {
              // Specifies the month of the year for yearly recurrence (e.g., 1 for January)
              name: 'monthOfYear',
              type: 'number',
              required: false,
              admin: {
                condition: (data) => data.recurrence?.type === 'yearly',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'priority',
      type: 'select',
      options: ['none', 'low', 'medium', 'high'],
      defaultValue: 'none',
    },
    {
      name: 'serviceRequest',
      type: 'relationship',
      relationTo: 'service-requests',
      hasMany: false,
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      hasMany: false,
    },
    {
      name: 'asset',
      type: 'relationship',
      relationTo: 'assets',
      hasMany: false,
    },
    {
      name: 'inventories',
      type: 'relationship',
      relationTo: 'inventories',
      hasMany: true,
    },
    {
      name: 'vendors',
      type: 'relationship',
      relationTo: 'vendors',
      hasMany: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['open', 'onHold', 'inProgress', 'done'],
      defaultValue: 'open',
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'work-orders',
      hasMany: false,
      required: false,
    },
    // organizationRelationship,
  ],
};
