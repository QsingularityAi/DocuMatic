import { getUserTenantIDs } from '@payloadcms/plugin-multi-tenant/utilities';
import { CollectionBeforeChangeHook } from 'payload';

export const usersHooks = {
  beforeChange: (async ({ originalDoc, data, operation, req }) => {
    if (operation === 'create') {
      // Request comes from the front-end with a tenant role
      // and the data includes a roles field, which is a field only available in the front-end
      // TODO: See the way to include a "key" in the create user form to identify that the request comes from the user creation inside the tenant app (already logged in)
      // TODO: Improve the way we check if the request comes from the front-end and not from the admin panel — might create a utility function to check that based on http headers or something like that
      if (req.user?.roles.includes('tenant') && 'roles' in data) {
        return {
          ...data,
          tenants: [
            {
              tenant: getUserTenantIDs(req.user)[0],
              roles: data.roles,
            },
          ],
          roles: ['tenant'], // enforce the tenant role
        };
      }
    }

    if (operation === 'update') {
      const userOriginalRoles = originalDoc.tenants?.[0]?.roles || [];
      const userNewRoles = data.tenants?.[0]?.roles || [];
      const userId = req.user?.id;
      const userRoles = req.user?.tenants?.[0]?.roles ?? [];

      const userRolesChanged = !arraysEqual(userOriginalRoles, userNewRoles);

      // If the user is trying to change their own roles
      if (data.id === userId && userRolesChanged) {
        throw new Error('You cannot change your own roles');
      }

      // If the user is an external user, they can't change any roles
      if (
        userRoles.length === 1 &&
        userRoles[0] === 'tenant-external-user' &&
        userRolesChanged
      ) {
        throw new Error('Not enough permissions to change roles');
      }

      if (req.user?.roles.includes('tenant') && 'roles' in data) {
        return {
          ...data,
          tenants: [
            {
              tenant: getUserTenantIDs(req.user)[0],
              roles: data.roles,
            },
          ],
          roles: ['tenant'], // enforce the tenant role
        };
      }
    }

    return data;
  }) as CollectionBeforeChangeHook,
};

//Using a Set for unordered arrays comparison
const arraysEqual = (a: any[], b: any[]) => {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  const setB = new Set(b);
  for (let item of setA) {
    if (!setB.has(item)) return false;
  }
  return true;
};
