import {
  AssetStatusDowntimeType,
  AssetStatusType,
  SystemRole,
  TenantRole,
} from '@/types/shared';

/**
 * Asset Statuses
 */
export const ASSET_STATUSES: readonly AssetStatusType[] = [
  'online',
  'offline',
  'no-tracking',
] as const;

export const DOWNTIME_TYPES: readonly AssetStatusDowntimeType[] = [
  'planned',
  'unplanned',
] as const;

/**
 * Roles and permissioms
 */
export const ROLE_LEVELS = {
  // System roles
  'super-admin': 100,
  'service-agent': 90,
  tenant: 10,

  // Tenant roles
  'tenant-owner': 90,
  'tenant-admin': 70,
  'tenant-manager': 50,
  'tenant-user': 30,
  'tenant-external-user': 10,
} as const;

export const ROLES = {
  // System roles
  SUPER_ADMIN: 'super-admin' as SystemRole,
  TENANT: 'tenant' as SystemRole,

  // Tenant roles
  TENANT_OWNER: 'tenant-owner' as TenantRole,
  TENANT_ADMIN: 'tenant-admin' as TenantRole,
  TENANT_MANAGER: 'tenant-manager' as TenantRole,
  TENANT_USER: 'tenant-user' as TenantRole,
  TENANT_EXTERNAL_USER: 'tenant-external-user' as TenantRole,
} as const;

/**
 * General system
 */
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
