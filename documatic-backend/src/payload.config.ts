// storage-adapter-import-placeholder
import { isSuperAdmin } from '@/access/isSuperAdmin';
import { AssetStatuses } from '@/collections/asset-statuses';
import { Assets } from '@/collections/assets';
import { Comments } from '@/collections/comments';
import { Contacts } from '@/collections/contacts';
import { Inventories } from '@/collections/inventories';
import { Locations } from '@/collections/locations';
import { Organizations } from '@/collections/organizations';
import { Sensors } from '@/collections/sensors';
import { ServiceChannels } from '@/collections/service-channels';
import { ServiceRequests } from '@/collections/service-requests';
import { SystemEvents } from '@/collections/system-events';
import { Teams } from '@/collections/teams';
import { Tenants } from '@/collections/tenants';
import { Uploads } from '@/collections/uploads';
import { Users } from '@/collections/users';
import { Vendors } from '@/collections/vendors';
import { WorkOrders } from '@/collections/work-orders';
import { environment } from '@/config';
import { filterAssetQuery } from '@/graphql/queries';
import { Config } from '@/types/payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { resendAdapter } from '@payloadcms/email-resend';
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { uploadthingStorage } from '@payloadcms/storage-uploadthing';
import path from 'path';
import { buildConfig } from 'payload';
import { seed } from 'scripts/seed';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  // debug: process.env.NODE_ENV === 'production' ? false : true,
  debug: environment.runtime.isDev,
  serverURL: environment.deployment.isDev
    ? `${process.env.APP_PROTOCOL}://${process.env.APP_DOMAIN}:${process.env.APP_PORT}`
    : `${process.env.APP_PROTOCOL}://${process.env.APP_DOMAIN}`,
  routes: {
    admin: '/zelmin',
    api: '/v0',
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Zelmin',
    },
  },
  collections: [
    Tenants,
    Organizations,
    Teams,
    Users,
    Contacts,
    Vendors,
    Inventories,
    Locations,
    Assets,
    Sensors,
    AssetStatuses,
    ServiceChannels,
    ServiceRequests,
    WorkOrders,
    SystemEvents,
    Comments,
    Uploads,
  ],
  cors: {
    origins: process.env.APP_CORS_ORIGINS?.split(',') ?? [],
    headers: ['X-Client-Origin'], // Used to identify the origin of the request, e.g: app or copilot, etc.
  },
  csrf: process.env.APP_CORS_ORIGINS?.split(',') ?? [],
  editor: lexicalEditor(),
  secret: process.env.APP_SECRET || '',
  typescript: {
    // TODO: Move this to the types folder
    outputFile: path.resolve(dirname, 'types/payload.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
      ...(environment.runtime.isProd && {
        ssl: {
          rejectUnauthorized: false,
          ca: Buffer.from(process.env.DATABASE_SSL_CA!, 'base64').toString(
            'utf-8',
          ),
        },
      }),
    },
    // push: false,
  }),
  email: resendAdapter({
    defaultFromAddress: environment.deployment.isProd
      ? 'notifications@documatic.com'
: 'notifications@app.documatic.xyz',
defaultFromName: 'DocuMatic',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  upload: {
    limits: {
      fileSize: 20000000, // 20 mb
    },
  },
  plugins: [
    // storage-adapter-placeholder
    multiTenantPlugin<Config>({
      enabled: true,
      debug: false, // makes the tenant field visible in the admin UI
      tenantsSlug: 'tenants',
      tenantField: {
        name: 'tenant',
        access: {
          read: () => true,
          create: ({ req }) => {
            if (isSuperAdmin.check(req.user)) {
              return true;
            }

            return false;
          },
          update: ({ req }) => {
            if (isSuperAdmin.check(req.user)) {
              return true;
            }

            return false;
          },
        },
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin.check(user),
      cleanupAfterTenantDelete: true,
      tenantsArrayField: {
        includeDefaultField: false,
      },
      collections: {
        uploads: {},
        teams: {},
        contacts: {},
        vendors: {},
        inventories: {},
        locations: {},
        assets: {},
        sensors: {},
        comments: {},
        'asset-statuses': {},
        'service-channels': {},
        'service-requests': {},
        'work-orders': {},
        'system-events': {},
      },
    }),
    uploadthingStorage({
      collections: {
        uploads: true,
      },
      options: {
        token: process.env.UPLOADTHING_TOKEN,
        acl: 'public-read',
      },
    }),
  ],
  sharp,
  graphQL: {
    queries: filterAssetQuery,
  },
  async onInit(payload) {
    try {
      const { docs: users } = await payload.find({
        collection: 'users',
        limit: 1,
      });

      // If no users, run seed
      if (users.length === 0) {
        try {
          await seed({ payload, req: {} as any });
        } catch (error) {
          payload.logger.error('seed error 1', error);
        }
      }
    } catch (error) {
      payload.logger.error('users table not found', error);
    }
  },
});
