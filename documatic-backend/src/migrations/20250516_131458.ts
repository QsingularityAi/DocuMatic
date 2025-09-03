import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "work_orders" ADD COLUMN "parent_id" integer;
  DO $$ BEGIN
   ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_parent_id_work_orders_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."work_orders"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "work_orders_parent_idx" ON "work_orders" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "work_orders" DROP CONSTRAINT "work_orders_parent_id_work_orders_id_fk";
  
  DROP INDEX IF EXISTS "work_orders_parent_idx";
  ALTER TABLE "work_orders" DROP COLUMN IF EXISTS "parent_id";`)
}
