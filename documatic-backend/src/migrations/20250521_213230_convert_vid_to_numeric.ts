import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- First create a temporary column
    ALTER TABLE "sensors" ADD COLUMN "v_id_new" NUMERIC;
    
    -- Update the new column with converted values
    UPDATE "sensors" SET "v_id_new" = NULLIF("v_id", '')::NUMERIC;
    
    -- Drop the old column
    ALTER TABLE "sensors" DROP COLUMN "v_id";
    
    -- Rename the new column to the original name
    ALTER TABLE "sensors" RENAME COLUMN "v_id_new" TO "v_id";
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Revert back to text
    ALTER TABLE "sensors" ADD COLUMN "v_id_new" TEXT;
    
    -- Convert numeric back to text
    UPDATE "sensors" SET "v_id_new" = "v_id"::TEXT;
    
    -- Drop the numeric column
    ALTER TABLE "sensors" DROP COLUMN "v_id";
    
    -- Rename text column back
    ALTER TABLE "sensors" RENAME COLUMN "v_id_new" TO "v_id";
  `);
}
