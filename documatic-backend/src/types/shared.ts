import { Asset, Tenant, User } from '@/types/payload';
import { CollectionSlug } from 'payload';

/**
 * Roles
 *
 * System roles are the ones handled by Payload.
 * Tenant roles are the ones created and handled by us, for the app purposes.
 */
export type SystemRole = User['roles'][number];
export type TenantRole = NonNullable<
  NonNullable<User['tenants']>[number]
>['roles'][number];

/**
 * System Events
 *
 * System events are used to track changes to collections.
 * They are created by the `createSystemEventHooks` function.
 */
export type SystemEventType = 'create' | 'update' | 'delete';

export type SystemEventResourceType = Exclude<
  CollectionSlug,
  | 'tenants'
  | 'system-events'
  | 'payload-locked-documents'
  | 'payload-preferences'
  | 'payload-migrations'
>;

export type SystemEvent = {
  userId: User['id'];
  event: SystemEventType;
  resourceType: SystemEventResourceType;
  resourceId: number;
  changes?: Record<string, any>;
  timestamp: string; // Date in ISO 8601 format
  // We have to pass the orgganization because the object is created within a hook, not organically through the UI or API
  tenant: Tenant | Tenant['id'];
};

/**
 * Asset Statuses
 *
 * Asset statuses are used to track the status of an asset.
 * They are created by the `createAssetStatusHooks` function.
 */
export type AssetStatusType = 'online' | 'offline' | 'no-tracking';
export type AssetStatusDowntimeType = 'planned' | 'unplanned';

type BaseAssetStatus = {
  assetId: Asset['id'];
  notes?: string;
  dateFrom: string; // Date in ISO 8601 format
  dateTo: string; // Date in ISO 8601 format
  // We have to pass the tenant because the object is created within a hook, not organically through the UI or API
  // tenant: Tenant | Tenant['id'];
};

// Type for offline status - requires downtimeType
type OfflineAssetStatus = BaseAssetStatus & {
  status: 'offline';
  downtimeType: AssetStatusDowntimeType;
};

// Type for online and no-tracking statuses - downtimeType not allowed
type NonOfflineAssetStatus = BaseAssetStatus & {
  status: 'online' | 'no-tracking';
  downtimeType?: never;
};

export type AssetStatus = OfflineAssetStatus | NonOfflineAssetStatus;

/**
 * Base work order notification data shared between notifications and emails
 */
export type BaseWorkOrderData = {
  workOrderId: number;
  workOrderName: string;
};

export type WorkOrderCompletedSharedData = BaseWorkOrderData & {
  completedBy: {
    id: number;
    name: string;
  };
};

export type WorkOrderAssignedSharedData = BaseWorkOrderData & {
  assignedBy: {
    id: number;
    name: string;
  };
};

export type WorkOrderOverdueSharedData = BaseWorkOrderData & {
  workOrderDueDate: string;
};

/**
 * Map of notification events to their template paths
 * This is the single source of truth for notification/email template paths
 */
export const NOTIFICATION_TEMPLATE_PATHS = {
  WORK_ORDER_COMPLETED: 'work-orders/completed',
  WORK_ORDER_ASSIGNED: 'work-orders/assigned',
  WORK_ORDER_OVERDUE: 'work-orders/overdue',
} as const;

export type NotificationTemplatePath =
  (typeof NOTIFICATION_TEMPLATE_PATHS)[keyof typeof NOTIFICATION_TEMPLATE_PATHS];
