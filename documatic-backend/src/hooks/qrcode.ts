import { CollectionAfterChangeHook } from 'payload';
import QRCode from 'qrcode';

export const qrCodeHooks = {
  /**
   * After Change hook for tracking create and update operations
   */
  afterChange: (async ({ req, doc, operation, collection }) => {
    if (operation === 'create') {
      const url = `${process.env.VITE_APP_BASE_URL}/scan/${collection.slug}/${doc.id}`;

      // Generate QR code for the document URL as an image
      const qr = await QRCode.toDataURL(url);

      // Enqueue a background task to update the document,
      // after Payload creates the document in DB
      setImmediate(async () => {
        try {
          await req.payload.update({
            collection: collection.slug,
            id: doc.id,
            data: {
              qr: qr,
            },
          });

          console.log(
            `QR code successfully added to document with ID: ${doc.id}`,
          );
        } catch (error) {
          console.error(`Failed to update document with ID: ${doc.id}`, error);
        }
      });

      return doc; // Return the original document immediately
    }

    return doc;
  }) satisfies CollectionAfterChangeHook,
};
