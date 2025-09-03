import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_tenants_settings_working_days" AS ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');
  CREATE TYPE "public"."enum_tenants_settings_timezone" AS ENUM('UTC', 'Pacific/Honolulu', 'America/Los_Angeles', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Mexico_City', 'America/New_York', 'America/Bogota', 'America/Halifax', 'America/Santiago', 'America/Sao_Paulo', 'America/Argentina/Buenos_Aires', 'Europe/London', 'Europe/Paris', 'Europe/Amsterdam', 'Europe/Madrid', 'Europe/Helsinki', 'Europe/Athens', 'Africa/Cairo', 'Asia/Jerusalem', 'Europe/Moscow', 'Europe/Istanbul', 'Africa/Johannesburg', 'Asia/Tehran', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Kathmandu', 'Asia/Dhaka', 'Asia/Bangkok', 'Asia/Singapore', 'Asia/Hong_Kong', 'Asia/Shanghai', 'Asia/Taipei', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Adelaide', 'Australia/Sydney', 'Australia/Brisbane', 'Pacific/Auckland');
  CREATE TYPE "public"."enum_tenants_settings_language" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_tenants_settings_date_format" AS ENUM('dd/MM/yyyy', 'yyyy-MM-dd', 'MMMM d, yyyy', 'd ''of'' MMMM, yyyy', 'MMM d, yyyy', 'EEEE, MMMM d, yyyy', 'EEE, MMM d, yyyy', 'd MMMM yyyy', 'd MMM yyyy');
  CREATE TYPE "public"."enum_tenants_settings_time_format" AS ENUM('h:mm a', 'HH:mm');
  CREATE TABLE IF NOT EXISTS "tenants_settings_working_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_tenants_settings_working_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "tenants" ADD COLUMN "settings_timezone" "enum_tenants_settings_timezone" DEFAULT 'Europe/Paris' NOT NULL;
  ALTER TABLE "tenants" ADD COLUMN "settings_language" "enum_tenants_settings_language" DEFAULT 'en' NOT NULL;
  ALTER TABLE "tenants" ADD COLUMN "settings_date_format" "enum_tenants_settings_date_format" DEFAULT 'd MMM yyyy' NOT NULL;
  ALTER TABLE "tenants" ADD COLUMN "settings_time_format" "enum_tenants_settings_time_format" DEFAULT 'HH:mm' NOT NULL;
  DO $$ BEGIN
   ALTER TABLE "tenants_settings_working_days" ADD CONSTRAINT "tenants_settings_working_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "tenants_settings_working_days_order_idx" ON "tenants_settings_working_days" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "tenants_settings_working_days_parent_idx" ON "tenants_settings_working_days" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "tenants_settings_working_days" CASCADE;
  ALTER TABLE "tenants" DROP COLUMN IF EXISTS "settings_timezone";
  ALTER TABLE "tenants" DROP COLUMN IF EXISTS "settings_language";
  ALTER TABLE "tenants" DROP COLUMN IF EXISTS "settings_date_format";
  ALTER TABLE "tenants" DROP COLUMN IF EXISTS "settings_time_format";
  DROP TYPE "public"."enum_tenants_settings_working_days";
  DROP TYPE "public"."enum_tenants_settings_timezone";
  DROP TYPE "public"."enum_tenants_settings_language";
  DROP TYPE "public"."enum_tenants_settings_date_format";
  DROP TYPE "public"."enum_tenants_settings_time_format";`)
}
