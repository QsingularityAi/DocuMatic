import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sensors" DROP CONSTRAINT "sensors_location_id_locations_id_fk";
  
  DROP INDEX IF EXISTS "sensors_location_idx";
  ALTER TABLE "sensors" ALTER COLUMN "v_id" SET DATA TYPE numeric;
  ALTER TABLE "work_orders" ALTER COLUMN "date_due" DROP NOT NULL;
  ALTER TABLE "sensors" ADD COLUMN "offset" numeric DEFAULT 0;
  ALTER TABLE "sensors" DROP COLUMN IF EXISTS "location_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sensors" ALTER COLUMN "v_id" SET DATA TYPE varchar;
  ALTER TABLE "work_orders" ALTER COLUMN "date_due" SET NOT NULL;
  ALTER TABLE "sensors" ADD COLUMN "location_id" integer;
  DO $$ BEGIN
   ALTER TABLE "sensors" ADD CONSTRAINT "sensors_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "sensors_location_idx" ON "sensors" USING btree ("location_id");
  ALTER TABLE "sensors" DROP COLUMN IF EXISTS "offset";`)
}
