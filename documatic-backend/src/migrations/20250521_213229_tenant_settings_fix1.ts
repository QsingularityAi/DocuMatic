import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tenants" ALTER COLUMN "settings_timezone" DROP NOT NULL;
  ALTER TABLE "tenants" ALTER COLUMN "settings_language" DROP NOT NULL;
  ALTER TABLE "tenants" ALTER COLUMN "settings_date_format" DROP NOT NULL;
  ALTER TABLE "tenants" ALTER COLUMN "settings_time_format" DROP NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tenants" ALTER COLUMN "settings_timezone" SET NOT NULL;
  ALTER TABLE "tenants" ALTER COLUMN "settings_language" SET NOT NULL;
  ALTER TABLE "tenants" ALTER COLUMN "settings_date_format" SET NOT NULL;
  ALTER TABLE "tenants" ALTER COLUMN "settings_time_format" SET NOT NULL;`)
}
