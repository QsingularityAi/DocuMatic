import { isSuperAdmin } from '@/access/isSuperAdmin';
import { ROLE_LEVELS, ROLES } from '@/constants';
import { User } from '@/types/payload';
import { SystemRole, TenantRole } from '@/types/shared';
import { Access } from 'payload';

// Helper to get role level
const getRoleLevel = (role: SystemRole | TenantRole): number => {
  return ROLE_LEVELS[role];
};

export const checkUserRole = (
  user: User,
  requiredRole: SystemRole | TenantRole,
): boolean => {
  if (!user) return false;

  // Super admin check
  if (user.roles.includes(ROLES.SUPER_ADMIN)) return true;

  // Get required role level
  const requiredLevel = getRoleLevel(requiredRole);

  // If checking for system role
  if (requiredRole === ROLES.TENANT) {
    return user.roles.includes(ROLES.TENANT);
  }

  // For tenant roles, check the first tenant's roles
  const userTenant = user.tenants?.[0];
  if (!userTenant?.roles?.length) return false;

  // Get the highest role level the user has
  const userHighestLevel = Math.max(
    ...userTenant.roles.map((role) => getRoleLevel(role)),
  );

  return userHighestLevel >= requiredLevel;
};

type CollectionAccessProps = {
  requiredRole: SystemRole | TenantRole;
  orSelf?: boolean;
  keyName?: string;
};

export const collectionAccess = ({
  requiredRole,
  orSelf,
  keyName = 'id',
}: CollectionAccessProps): Access => {
  return async ({ req, data, id }) => {
    const { user } = req;

    if (!user) return false;

    if (isSuperAdmin.check(user)) return true;

    const hasAccess = checkUserRole(user, requiredRole);

    if (!hasAccess) {
      //Exception when accessing the own user record
      if (orSelf) {
        return {
          [keyName]: { equals: user.id },
        };
      }

      return false;
    }

    // Tenant filtering
    // const tenantId = getUserTenantIDs(user as any);
    // console.log('tenantId', tenantId);
    // const tenantFilter = {
    //   tenant: {
    //     in: tenantId,
    //   },
    // };

    // If orSelf is true, combine tenant filter with self-access
    // if (orSelf) {
    //   return {
    //     or: [
    //       tenantFilter,
    //       {
    //         id: {
    //           equals: user.id,
    //         },
    //       },
    //     ],
    //   };
    // }

    return true;
  };
};
