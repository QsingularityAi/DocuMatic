import dotenv from 'dotenv';
import type { Payload, PayloadRequest } from 'payload';
import { getPayload } from 'payload';
import { fileURLToPath } from 'url';
import config from '../src/payload.config';

// Load environment variables
dotenv.config();

/**
 * Seed function to populate the database with initial data
 */
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload;
  req: PayloadRequest;
}): Promise<void> => {
  try {
    payload.logger.info('Seeding fresh install database…');

    // Create tenants
    payload.logger.info(`— Seeding demo tenants…`);
    const [acmeCorp, theFoodCompany] = await Promise.all([
      payload.create({
        collection: 'tenants',
        data: {
          name: 'Acme Corp Inc.',
        },
      }),

      payload.create({
        collection: 'tenants',
        data: {
          name: 'The Food Company',
        },
      }),
    ]);

    // Create users
    payload.logger.info(`— Seeding demo users…`);
    await Promise.all([
      // Acme Corp Inc.
      payload.create({
        collection: 'users',
        data: {
          firstName: 'Super',
              lastName: 'DocuMatic',
    email: 'documatic.com@gmail.com',
          password: 'bm$w_a;:_R/g6Z3+*',
          roles: ['super-admin'],
        },
      }),

      payload.create({
        collection: 'users',
        data: {
          firstName: 'Max',
          lastName: 'Mustermann',
          email: 'documatic.com+acme.maxmustermann@gmail.com',
          password: '12345678!,',
          roles: ['tenant'],
          tenants: [
            {
              tenant: acmeCorp,
              roles: ['tenant-owner'],
            },
          ],
        },
      }),

      payload.create({
        collection: 'users',
        data: {
          firstName: 'Maria',
          lastName: 'Fernandez',
          email: 'documatic.com+acme.mariafernandez@gmail.com',
          password: '12345678!,',
          roles: ['tenant'],
          tenants: [
            {
              tenant: acmeCorp,
              roles: ['tenant-manager'],
            },
          ],
        },
      }),

      payload.create({
        collection: 'users',
        data: {
          firstName: 'Terry',
          lastName: 'Clarkson',
          email: 'documatic.com+acme.terryclarkson@gmail.com',
          password: '12345678!,',
          roles: ['tenant'],
          tenants: [
            {
              tenant: acmeCorp,
              roles: ['tenant-user'],
            },
          ],
        },
      }),

      payload.create({
        collection: 'users',
        data: {
          firstName: 'Viktor',
          lastName: 'Hofman',
          email: 'documatic.com+acme.viktorhofman@gmail.com',
          password: '12345678!,',
          roles: ['tenant'],
          tenants: [
            {
              tenant: acmeCorp,
              roles: ['tenant-external-user'],
            },
          ],
        },
      }),

      // The Food Company
      payload.create({
        collection: 'users',
        data: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'documatic.com+thefoodcompany.johndoe@gmail.com',
          password: '12345678!,',
          roles: ['tenant'],
          tenants: [
            {
              tenant: theFoodCompany,
              roles: ['tenant-owner'],
            },
          ],
        },
      }),

      payload.create({
        collection: 'users',
        data: {
          firstName: 'Martin',
          lastName: 'Schmidt',
          email: 'documatic.com+thefoodcompany.martinschmidt@gmail.com',
          password: '12345678!,',
          roles: ['tenant'],
          tenants: [
            {
              tenant: theFoodCompany,
              roles: ['tenant-manager'],
            },
          ],
        },
      }),

      payload.create({
        collection: 'users',
        data: {
          firstName: 'Teo',
          lastName: 'Soto',
          email: 'documatic.com+thefoodcompany.teosoto@gmail.com',
          password: '12345678!,',
          roles: ['tenant'],
          tenants: [
            {
              tenant: theFoodCompany,
              roles: ['tenant-user'],
            },
          ],
        },
      }),

      payload.create({
        collection: 'users',
        data: {
          firstName: 'Vera',
          lastName: 'Fischer',
          email: 'documatic.com+thefoodcompany.verafischer@gmail.com',
          password: '12345678!,',
          roles: ['tenant'],
          tenants: [
            {
              tenant: theFoodCompany,
              roles: ['tenant-external-user'],
            },
          ],
        },
      }),
    ]);

    payload.logger.info('✅ Seed completed successfully');
  } catch (error) {
    payload.logger.error('Error seeding database:');
    payload.logger.error(error);
    throw error;
  }
};

/**
 * Script entry point to run the seed function
 * Run with: pnpm db:seed
 */
const runSeed = async (): Promise<void> => {
  try {
    console.log('Initializing Payload...');

    // Initialize Payload
    const payload = await getPayload({
      config,
    });

    console.log('Running seed function...');

    // Run the seed function
    await seed({ payload, req: {} as any });

    console.log('✅ Seeding completed successfully!');

    // Exit process
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Check if this file is being run directly (not imported)
// Using ES module approach for determining direct execution
const modulePath = fileURLToPath(import.meta.url);
if (process.argv[1] === modulePath) {
  runSeed();
}
