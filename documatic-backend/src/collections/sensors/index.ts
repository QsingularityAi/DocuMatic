import { collectionAccess } from '@/access/hierarchy';
import { isSuperAdmin } from '@/access/isSuperAdmin';
import { environment } from '@/config';
import { qrCodeHooks } from '@/hooks/qrcode';
import { tenantHooks } from '@/hooks/tenant';
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities';
import { CollectionConfig } from 'payload';

export const Sensors: CollectionConfig = {
  slug: 'sensors',
  admin: {
    useAsTitle: 'serial',
    defaultColumns: ['vId', 'serial', 'mac', 'status', 'updatedAt'],
  },
  access: {
    create: collectionAccess({ requiredRole: 'super-admin' }),
    read: collectionAccess({ requiredRole: 'tenant-user' }),
    update: collectionAccess({ requiredRole: 'tenant-manager' }),
    delete: collectionAccess({ requiredRole: 'tenant-admin' }),
  },
  hooks: {
    beforeValidate: [tenantHooks.beforeValidate],
    beforeChange: [
      async ({ operation, data, req }) => {
        // SKip this operation if we are in local development
        // we should map the vId of the sensor in the TSDB manually when creating it.
        // From remote dev (staging) the vId will be set automatically.
        if (environment.deployment.isDev) {
          return data;
        }

        if (operation === 'create' && isSuperAdmin.check(req.user)) {
          try {
            const response = await fetch(
              `https://${process.env.EDGE_DOMAIN}/capture/register`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${process.env.EDGE_API_KEY}`,
                },
                body: JSON.stringify({
                  tenantId: getTenantFromCookie(req.headers, 'number'),
                }),
              },
            );

            if (!response.ok) {
              throw new Error('Failed to register sensor in Capture service.');
            }

            const result = await response.json();

            data.vId = result.sensorId;

            return data;
          } catch (error) {
            console.error('Error registering sensor:', error);
            throw error;
          }
        }

        return data;
      },
    ],
    afterChange: [qrCodeHooks.afterChange],
    // after create: register the ID of the created sensor in the TSDB, obtanin that ID and update the field vId here — perhaps here also set the asset id in the TSDB?
    // after update, the same values updated
    // after delete: shall we delete something at the tsdb or invalidate something?
  },
  fields: [
    {
      name: 'vId', // ID used in the external source where the sensor is registered to track the data (time series database)
      type: 'number',
      required: false,
      defaultValue: 0,
    },
    {
      name: 'serial', // Hardware ID, different from the mac address of any network controller
      type: 'text',
      required: true,
    },
    {
      name: 'mac',
      type: 'text',
      required: true,
    },
    {
      name: 'offset', // Calibration offset reading value for the sensor
      type: 'number',
      required: false,
      defaultValue: 0,
    },
    {
      name: 'status',
      type: 'select',
      options: ['provisioned', 'online', 'offline', 'unknown'],
      required: true,
    },
    {
      name: 'qr',
      type: 'text',
      required: false,
    },
    {
      name: 'asset',
      type: 'relationship',
      relationTo: 'assets',
      hasMany: false,
    },
  ],
};
