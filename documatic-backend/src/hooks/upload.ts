import { CollectionAfterChangeHook, CollectionBeforeChangeHook } from 'payload';

type UploadCollection = 'inventories' | 'assets' | 'work-orders' | 'locations';

export const uploadHooks = {
  beforeChange: (async ({ req, data, originalDoc, collection, operation }) => {
    if (operation === 'update') {
      // if the document is being updated, check if the media or files were removed and remove them from the database
      const originalUploadIDs = originalDoc.uploads ?? [];
      const updatedUploadIDs = data.uploads ?? [];
      const removedUploadIDs = originalUploadIDs.filter(
        (id: number) => !updatedUploadIDs.includes(id),
      );

      if (removedUploadIDs.length > 0) {
        // console.log('Deleting removed file IDs:', removedUploadIDs);

        try {
          await req.payload.delete({
            collection: 'uploads',
            where: {
              id: {
                in: removedUploadIDs,
              },
            },
          });
        } catch (err) {
          console.error(
            'Failed to delete files with IDs:',
            removedUploadIDs,
            err,
          );
        }
      }

      // Check if any new uploads were added
      // and set the resource field to the current document ID
      const addedUploadIDs = updatedUploadIDs.filter(
        (id: number) => !originalUploadIDs.includes(id),
      );
      if (addedUploadIDs.length > 0) {
        for (const uploadID of addedUploadIDs) {
          req.payload.update({
            collection: 'uploads',
            id: uploadID,
            data: {
              resource: {
                relationTo: collection.slug as UploadCollection,
                value: data.id,
              },
            },
          });
        }
      }
    }
  }) satisfies CollectionBeforeChangeHook,
  afterChange: (async ({ req, doc, operation, collection }) => {
    if (operation === 'create') {
      // Set the resource field for each uploaded media and files to the current document ID

      if (doc.uploads) {
        for (const upload of doc.uploads) {
          req.payload.update({
            collection: 'uploads',
            id: upload.id,
            data: {
              resource: {
                relationTo: collection.slug as UploadCollection,
                value: doc.id,
              },
            },
          });
        }
      }
    }

    return doc;
  }) satisfies CollectionAfterChangeHook,
};
