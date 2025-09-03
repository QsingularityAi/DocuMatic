import { collectionAccess } from '@/access/hierarchy';
import { environment } from '@/config';
import { createSystemEventHooks } from '@/hooks/createSystemEvent';
import { tenantHooks } from '@/hooks/tenant';
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields';
import { CollectionConfig } from 'payload';
import { usersHooks } from './hooks/users';

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  tenantsCollectionSlug: 'tenants',
  arrayFieldAccess: {},
  tenantFieldAccess: {},
  rowFields: [
    {
      name: 'roles',
      type: 'select',
      defaultValue: ['tenant-user'],
      hasMany: true,
      options: [
        'tenant-owner',
        'tenant-admin',
        'tenant-manager',
        'tenant-user',
        'tenant-external-user',
      ],
      required: true,
    },
  ],
});

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 9000,
    // depth: 1,
    useAPIKey: true,
    cookies: {
      sameSite: environment.deployment.isDev ? 'Lax' : 'None',
      secure: !environment.deployment.isDev,
      domain: environment.deployment.isStaging
        ? '.documatic.xyz'
        : environment.deployment.isProd
          ? '.documatic.com'
          : undefined,
    },
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: collectionAccess({ requiredRole: 'tenant-admin' }),
    read: collectionAccess({
      requiredRole: 'tenant-user',
    }),
    update: collectionAccess({
      requiredRole: 'tenant-admin',
      orSelf: true,
    }),
    delete: collectionAccess({ requiredRole: 'tenant-admin' }),
  },
  hooks: {
    beforeValidate: [tenantHooks.beforeValidate],
    beforeChange: [usersHooks.beforeChange],
    afterChange: [createSystemEventHooks.afterChange],
    afterDelete: [createSystemEventHooks.afterDelete],
    afterLogin: [
      async ({ req, user }) => {
        try {
          await req.payload.update({
            collection: 'users',
            id: user.id,
            data: { ...user, lastLogin: new Date().toISOString() },
          });
        } catch (error) {
          console.error('Failed to update lastLogin:', error);
        }
        return user;
      },
    ],
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['tenant'],
      // TODO: Add validation to ensure that no one but super-admin can set the role to super-admin,
      // and that no user can set themselves a higher role than they currently have
      // Perhaps also add a validation that super-admin role can only be set via zelmin admin UI, but not from the Rest API
      options: [
        {
          label: 'Super Admin',
          value: 'super-admin',
        },
        {
          label: 'Service Agent',
          value: 'service-agent',
        },
        {
          label: 'Tenant',
          value: 'tenant',
        },
      ],
    },
    {
      ...defaultTenantArrayField,
      admin: {
        ...(defaultTenantArrayField?.admin || {}),
        position: 'sidebar',
      },
    },
    {
      name: 'lastLogin',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
};
