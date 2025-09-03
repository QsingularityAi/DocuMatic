import { User } from '@/types/payload';
import { getUserTenantIDs } from '@payloadcms/plugin-multi-tenant/utilities';
import { CollectionBeforeValidateHook } from 'payload';

/**
 * @deprecated
 * Prefer getUserTenantIDs(req.user)[0] instead.
 *
 * Gets the tenant ID from a user object
 * Although users support multi tenancy, we are getting only the first item
 * because that's what we support at the moment
 */
export const getUserTenantId = (user: User): string | number | null => {
  if (!user?.tenants?.[0]?.tenant) return null;

  return typeof user.tenants[0].tenant === 'object'
    ? user.tenants[0].tenant.id
    : user.tenants[0].tenant;
};

export const tenantHooks = {
  beforeValidate: (async ({ req, data }) => {
    // Get tenant ID safely
    const tenantIdsResult = getUserTenantIDs(req.user);
    const tenantId = tenantIdsResult?.[0] || null;

    // If no user is logged in, return data unchanged
    if (!req.user) return data;

    return {
      ...data,
      tenant: tenantId,
    };
  }) satisfies CollectionBeforeValidateHook,
};
