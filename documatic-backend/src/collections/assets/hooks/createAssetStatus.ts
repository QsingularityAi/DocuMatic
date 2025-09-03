import { ASSET_STATUSES, DOWNTIME_TYPES } from '@/constants';
import {
  AssetStatus,
  AssetStatusDowntimeType,
  AssetStatusType,
} from '@/types/shared';
import { formatDate, getCurrentDate } from '@/utilities/dates';
import {
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  CollectionBeforeDeleteHook,
  Payload,
} from 'payload';

/**
 * Type guards for validation
 */
const isValidStatus = (status: unknown): status is AssetStatusType => {
  if (typeof status !== 'string') return false;

  return ASSET_STATUSES.includes(status as AssetStatusType);
};

const isValidDowntimeType = (
  type: unknown,
): type is AssetStatusDowntimeType => {
  if (typeof type !== 'string') return false;
  return DOWNTIME_TYPES.includes(type as AssetStatusDowntimeType);
};

/**
 * Validates status data before creation
 * @throws {Error} If validation fails
 */
const validateStatusData = (statusData: Partial<AssetStatus>) => {
  // Required fields check
  if (!statusData.status) {
    throw new Error('Asset status data is required');
  }

  // Status validation
  if (!isValidStatus(statusData.status)) {
    throw new Error(`Invalid status value. Received: ${statusData.status}`);
  }

  // Offline status validation
  if (statusData.status === 'offline') {
    if (!statusData.downtimeType) {
      throw new Error('downtimeType is required when status is offline');
    }

    if (!isValidDowntimeType(statusData.downtimeType)) {
      throw new Error(
        `Invalid downtimeType value. Received: ${statusData.downtimeType}`,
      );
    }
  }

  // Date validation
  if (statusData.dateFrom && new Date(statusData.dateFrom) > new Date()) {
    throw new Error('Status dateFrom cannot be in the future');
  }

  if (statusData.dateTo && new Date(statusData.dateTo) < new Date()) {
    throw new Error('Status dateTo cannot be in the past');
  }
};

/**
 * Creates an asset status entry in the database
 * @param payload - Payload instance
 * @param statusData - Basic status data
 * @param req - Optional request object for transaction support
 * @returns Promise that resolves to the created status
 */
const createAssetStatusEntry = (
  payload: Payload,
  statusData: {
    assetId: AssetStatus['assetId'];
    status: AssetStatus['status'];
    notes?: AssetStatus['notes'];
    downtimeType?: AssetStatusDowntimeType;
    dateFrom?: AssetStatus['dateFrom'];
    dateTo?: AssetStatus['dateTo'];
  },
  req?: any,
): Promise<{ id: number }> => {
  return payload.create({
    collection: 'asset-statuses',
    data: {
      asset: statusData.assetId,
      status: statusData.status,
      notes: statusData.notes ?? undefined,
      downtimeType:
        statusData.status === 'offline' ? statusData.downtimeType : undefined,
      dateFrom: statusData.dateFrom
        ? formatDate(statusData.dateFrom)
        : getCurrentDate(),
      dateTo: statusData.dateTo
        ? formatDate(statusData.dateTo)
        : getCurrentDate(),
    },
    // Pass the request object to ensure transaction consistency
    req,
  });
};

/**
 * Updates the "currentStatus" relationship field of an asset
 * @param payload - Payload instance
 * @param assetId - ID of the asset to update
 * @param assetStatusId - ID of the new status
 * @param req - Optional request object for transaction support
 * @returns Promise that resolves to the updated asset
 */
const updateAssetCurrentStatus = (
  payload: Payload,
  assetId: number,
  assetStatusId: number,
  req?: any,
): Promise<any> => {
  return payload.update({
    collection: 'assets',
    id: assetId,
    data: {
      currentStatus: assetStatusId,
    },
    req,
  });
};

export const createAssetStatusHooks = {
  beforeChange: (async ({ originalDoc, data, operation, req }) => {
    // Return early if no status data is present
    if (!data.status) {
      return data;
    }

    if ('status' in data) {
      if (operation === 'create') {
        // let it pass
      }

      if (operation === 'update') {
        validateStatusData(data.status);
      }

      req.context.assetStatus = data.status;
      req.context.operation = operation;
    }

    return data;
  }) satisfies CollectionBeforeChangeHook,

  afterChange: (async ({ doc, req, operation }) => {
    const ctx = {
      assetStatus: req.context.assetStatus as AssetStatusType | AssetStatus,
      operation: req.context.operation as 'create' | 'update',
    };

    // Only proceed if we have asset status data
    if (ctx.assetStatus) {
      let assetStatusResult;

      try {
        assetStatusResult = await createAssetStatusEntry(
          req.payload,
          {
            ...(ctx.operation === 'create'
              ? { status: ctx.assetStatus as AssetStatusType }
              : (ctx.assetStatus as AssetStatus)),
            assetId: doc.id,
          },
          req,
        );

        // Unset the assetStatus in context to prevent infinite loops
        // when updateAssetCurrentStatus triggers another afterChange
        req.context.assetStatus = undefined;
      } catch (error) {
        console.error('Failed to create asset status entry:', error);
        // Re-throw to ensure transaction rollback
        throw error;
      }

      if (assetStatusResult && assetStatusResult.id) {
        try {
          // Update the asset and store the result
          const updatedAsset = await updateAssetCurrentStatus(
            req.payload,
            doc.id,
            assetStatusResult.id,
            req,
          );

          // Replace the doc with the updated asset
          if (updatedAsset) {
            // This ensures we return the complete updated document
            doc = updatedAsset;
          }
        } catch (error) {
          console.error('Failed to update asset current status:', error);
          // Re-throw to ensure transaction rollback
          throw error;
        }
      }
    }

    return doc;
  }) satisfies CollectionAfterChangeHook,

  beforeDelete: (async ({ req, id }) => {
    try {
      // Find all asset statuses associated with this asset
      const assetStatuses = await req.payload.find({
        collection: 'asset-statuses',
        where: {
          asset: {
            equals: id,
          },
        },
      });

      // Delete all associated asset statuses
      if (
        assetStatuses &&
        assetStatuses.docs &&
        assetStatuses.docs.length > 0
      ) {
        // Use the Payload Admin API to force delete records since the collection has delete: false access control
        await Promise.all(
          assetStatuses.docs.map(async (status) => {
            await req.payload.delete({
              collection: 'asset-statuses',
              id: status.id,
              overrideAccess: true, // Override access control since the collection has delete: false
            });
          }),
        );
      }
    } catch (error) {
      console.error('Failed to delete associated asset statuses:', error);
      throw error;
    }

    return;
  }) satisfies CollectionBeforeDeleteHook,
};
