import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('super-admin', 'tenant');
  CREATE TYPE "public"."enum_users_tenants_roles" AS ENUM('tenant-owner', 'tenant-admin', 'tenant-manager', 'tenant-user', 'tenant-external-user');
  CREATE TYPE "public"."enum_sensors_status" AS ENUM('provisioned', 'online', 'offline', 'unknown');
  CREATE TYPE "public"."enum_asset_statuses_status" AS ENUM('online', 'offline', 'no-tracking');
  CREATE TYPE "public"."enum_asset_statuses_downtime_type" AS ENUM('planned', 'unplanned');
  CREATE TYPE "public"."enum_service_channels_custom_fields_type" AS ENUM('text', 'textarea', 'number', 'date', 'file', 'email', 'url', 'checkbox');
  CREATE TYPE "public"."enum_service_requests_status" AS ENUM('pending', 'approved', 'declined', 'closed');
  CREATE TYPE "public"."enum_work_orders_recurrence_details_days_of_week_day" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
  CREATE TYPE "public"."enum_work_orders_type" AS ENUM('reactive', 'preventive', 'other');
  CREATE TYPE "public"."enum_work_orders_recurrence_type" AS ENUM('none', 'daily', 'weekly', 'monthlyByDate', 'monthlyByWeekday', 'yearly');
  CREATE TYPE "public"."enum_work_orders_recurrence_details_weekday_of_month_week" AS ENUM('1st', '2nd', '3rd', '4th', 'last');
  CREATE TYPE "public"."enum_work_orders_recurrence_details_weekday_of_month_day" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
  CREATE TYPE "public"."enum_work_orders_priority" AS ENUM('none', 'low', 'medium', 'high');
  CREATE TYPE "public"."enum_work_orders_status" AS ENUM('open', 'onHold', 'inProgress', 'done');
  CREATE TYPE "public"."enum_system_events_event" AS ENUM('create', 'update', 'delete');
  CREATE TYPE "public"."enum_system_events_resource_type" AS ENUM('assets', 'asset-statuses', 'contacts', 'inventories', 'locations', 'uploads', 'organizations', 'service-channels', 'service-requests', 'teams', 'users', 'vendors', 'work-orders', 'comments', 'sensors');
  CREATE TYPE "public"."enum_uploads_type" AS ENUM('file', 'media');
  CREATE TABLE IF NOT EXISTS "tenants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "organizations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "teams" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "teams_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "users_tenants_roles" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_users_tenants_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "users_tenants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"last_login" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "contacts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"position" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "vendors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "vendors_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"contacts_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "inventories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"stock" numeric NOT NULL,
  	"qr" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "inventories_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locations_id" integer,
  	"vendors_id" integer,
  	"uploads_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "locations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"qr" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "locations_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"uploads_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "assets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"current_status_id" integer,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"manufacturer" varchar NOT NULL,
  	"model" varchar,
  	"year" numeric,
  	"qr" varchar,
  	"location_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "assets_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"uploads_id" integer,
  	"teams_id" integer,
  	"inventories_id" integer,
  	"vendors_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "sensors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"v_id" varchar DEFAULT 0,
  	"serial" varchar NOT NULL,
  	"mac" varchar NOT NULL,
  	"status" "enum_sensors_status" NOT NULL,
  	"qr" varchar,
  	"asset_id" integer,
  	"location_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "asset_statuses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"asset_id" integer NOT NULL,
  	"status" "enum_asset_statuses_status" NOT NULL,
  	"downtime_type" "enum_asset_statuses_downtime_type",
  	"notes" varchar,
  	"date_from" timestamp(3) with time zone,
  	"date_to" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "service_channels_custom_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_service_channels_custom_fields_type"
  );
  
  CREATE TABLE IF NOT EXISTS "service_channels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"v_id" varchar,
  	"name" varchar NOT NULL,
  	"content" varchar,
  	"content_placeholder" varchar,
  	"contact_email" varchar,
  	"location_id" integer,
  	"asset_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "service_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"meta_info" jsonb,
  	"status" "enum_service_requests_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "service_requests_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"uploads_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "work_orders_procedure" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "work_orders_recurrence_details_days_of_week" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_work_orders_recurrence_details_days_of_week_day"
  );
  
  CREATE TABLE IF NOT EXISTS "work_orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"estimated_time_hours" numeric,
  	"estimated_time_minutes" numeric,
  	"created_by_id" integer,
  	"assignment_teams_id" integer,
  	"date_start" timestamp(3) with time zone NOT NULL,
  	"date_due" timestamp(3) with time zone NOT NULL,
  	"type" "enum_work_orders_type" DEFAULT 'preventive',
  	"recurrence_type" "enum_work_orders_recurrence_type" DEFAULT 'none',
  	"recurrence_interval" numeric,
  	"recurrence_details_date_of_month" numeric,
  	"recurrence_details_weekday_of_month_week" "enum_work_orders_recurrence_details_weekday_of_month_week",
  	"recurrence_details_weekday_of_month_day" "enum_work_orders_recurrence_details_weekday_of_month_day",
  	"recurrence_details_month_of_year" numeric,
  	"priority" "enum_work_orders_priority" DEFAULT 'none',
  	"service_request_id" integer,
  	"location_id" integer,
  	"asset_id" integer,
  	"status" "enum_work_orders_status" DEFAULT 'open',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "work_orders_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"uploads_id" integer,
  	"users_id" integer,
  	"inventories_id" integer,
  	"vendors_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "system_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"user_id" numeric NOT NULL,
  	"event" "enum_system_events_event" NOT NULL,
  	"resource_type" "enum_system_events_resource_type" NOT NULL,
  	"resource_id" numeric NOT NULL,
  	"changes" jsonb,
  	"timestamp" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "comments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"text" varchar NOT NULL,
  	"author_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "comments_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"assets_id" integer,
  	"work_orders_id" integer,
  	"inventories_id" integer,
  	"locations_id" integer,
  	"service_requests_id" integer,
  	"contacts_id" integer,
  	"vendors_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "uploads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"created_by_id" integer NOT NULL,
  	"type" "enum_uploads_type" DEFAULT 'file',
  	"_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail__key" varchar,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "uploads_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"assets_id" integer,
  	"work_orders_id" integer,
  	"inventories_id" integer,
  	"locations_id" integer,
  	"service_requests_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tenants_id" integer,
  	"organizations_id" integer,
  	"teams_id" integer,
  	"users_id" integer,
  	"contacts_id" integer,
  	"vendors_id" integer,
  	"inventories_id" integer,
  	"locations_id" integer,
  	"assets_id" integer,
  	"sensors_id" integer,
  	"asset_statuses_id" integer,
  	"service_channels_id" integer,
  	"service_requests_id" integer,
  	"work_orders_id" integer,
  	"system_events_id" integer,
  	"comments_id" integer,
  	"uploads_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DO $$ BEGIN
   ALTER TABLE "teams" ADD CONSTRAINT "teams_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "teams_rels" ADD CONSTRAINT "teams_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "teams_rels" ADD CONSTRAINT "teams_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "users_tenants_roles" ADD CONSTRAINT "users_tenants_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users_tenants"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "contacts" ADD CONSTRAINT "contacts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "vendors" ADD CONSTRAINT "vendors_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "vendors_rels" ADD CONSTRAINT "vendors_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "vendors_rels" ADD CONSTRAINT "vendors_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "inventories" ADD CONSTRAINT "inventories_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "inventories_rels" ADD CONSTRAINT "inventories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."inventories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "inventories_rels" ADD CONSTRAINT "inventories_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "inventories_rels" ADD CONSTRAINT "inventories_rels_vendors_fk" FOREIGN KEY ("vendors_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "inventories_rels" ADD CONSTRAINT "inventories_rels_uploads_fk" FOREIGN KEY ("uploads_id") REFERENCES "public"."uploads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "locations" ADD CONSTRAINT "locations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "locations_rels" ADD CONSTRAINT "locations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "locations_rels" ADD CONSTRAINT "locations_rels_uploads_fk" FOREIGN KEY ("uploads_id") REFERENCES "public"."uploads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "assets" ADD CONSTRAINT "assets_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "assets" ADD CONSTRAINT "assets_current_status_id_asset_statuses_id_fk" FOREIGN KEY ("current_status_id") REFERENCES "public"."asset_statuses"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "assets" ADD CONSTRAINT "assets_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "assets_rels" ADD CONSTRAINT "assets_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "assets_rels" ADD CONSTRAINT "assets_rels_uploads_fk" FOREIGN KEY ("uploads_id") REFERENCES "public"."uploads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "assets_rels" ADD CONSTRAINT "assets_rels_teams_fk" FOREIGN KEY ("teams_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "assets_rels" ADD CONSTRAINT "assets_rels_inventories_fk" FOREIGN KEY ("inventories_id") REFERENCES "public"."inventories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "assets_rels" ADD CONSTRAINT "assets_rels_vendors_fk" FOREIGN KEY ("vendors_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "sensors" ADD CONSTRAINT "sensors_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "sensors" ADD CONSTRAINT "sensors_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "sensors" ADD CONSTRAINT "sensors_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "asset_statuses" ADD CONSTRAINT "asset_statuses_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "asset_statuses" ADD CONSTRAINT "asset_statuses_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "service_channels_custom_fields" ADD CONSTRAINT "service_channels_custom_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_channels"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "service_channels" ADD CONSTRAINT "service_channels_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "service_channels" ADD CONSTRAINT "service_channels_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "service_channels" ADD CONSTRAINT "service_channels_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "service_requests_rels" ADD CONSTRAINT "service_requests_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."service_requests"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "service_requests_rels" ADD CONSTRAINT "service_requests_rels_uploads_fk" FOREIGN KEY ("uploads_id") REFERENCES "public"."uploads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "work_orders_procedure" ADD CONSTRAINT "work_orders_procedure_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."work_orders"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "work_orders_recurrence_details_days_of_week" ADD CONSTRAINT "work_orders_recurrence_details_days_of_week_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."work_orders"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_assignment_teams_id_teams_id_fk" FOREIGN KEY ("assignment_teams_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_service_request_id_service_requests_id_fk" FOREIGN KEY ("service_request_id") REFERENCES "public"."service_requests"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "work_orders_rels" ADD CONSTRAINT "work_orders_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."work_orders"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "work_orders_rels" ADD CONSTRAINT "work_orders_rels_uploads_fk" FOREIGN KEY ("uploads_id") REFERENCES "public"."uploads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "work_orders_rels" ADD CONSTRAINT "work_orders_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "work_orders_rels" ADD CONSTRAINT "work_orders_rels_inventories_fk" FOREIGN KEY ("inventories_id") REFERENCES "public"."inventories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "work_orders_rels" ADD CONSTRAINT "work_orders_rels_vendors_fk" FOREIGN KEY ("vendors_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "system_events" ADD CONSTRAINT "system_events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "comments" ADD CONSTRAINT "comments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "comments_rels" ADD CONSTRAINT "comments_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "comments_rels" ADD CONSTRAINT "comments_rels_assets_fk" FOREIGN KEY ("assets_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "comments_rels" ADD CONSTRAINT "comments_rels_work_orders_fk" FOREIGN KEY ("work_orders_id") REFERENCES "public"."work_orders"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "comments_rels" ADD CONSTRAINT "comments_rels_inventories_fk" FOREIGN KEY ("inventories_id") REFERENCES "public"."inventories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "comments_rels" ADD CONSTRAINT "comments_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "comments_rels" ADD CONSTRAINT "comments_rels_service_requests_fk" FOREIGN KEY ("service_requests_id") REFERENCES "public"."service_requests"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "comments_rels" ADD CONSTRAINT "comments_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "comments_rels" ADD CONSTRAINT "comments_rels_vendors_fk" FOREIGN KEY ("vendors_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "uploads" ADD CONSTRAINT "uploads_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "uploads" ADD CONSTRAINT "uploads_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "uploads_rels" ADD CONSTRAINT "uploads_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."uploads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "uploads_rels" ADD CONSTRAINT "uploads_rels_assets_fk" FOREIGN KEY ("assets_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "uploads_rels" ADD CONSTRAINT "uploads_rels_work_orders_fk" FOREIGN KEY ("work_orders_id") REFERENCES "public"."work_orders"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "uploads_rels" ADD CONSTRAINT "uploads_rels_inventories_fk" FOREIGN KEY ("inventories_id") REFERENCES "public"."inventories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "uploads_rels" ADD CONSTRAINT "uploads_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "uploads_rels" ADD CONSTRAINT "uploads_rels_service_requests_fk" FOREIGN KEY ("service_requests_id") REFERENCES "public"."service_requests"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_organizations_fk" FOREIGN KEY ("organizations_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_teams_fk" FOREIGN KEY ("teams_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vendors_fk" FOREIGN KEY ("vendors_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inventories_fk" FOREIGN KEY ("inventories_id") REFERENCES "public"."inventories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_assets_fk" FOREIGN KEY ("assets_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sensors_fk" FOREIGN KEY ("sensors_id") REFERENCES "public"."sensors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_asset_statuses_fk" FOREIGN KEY ("asset_statuses_id") REFERENCES "public"."asset_statuses"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_channels_fk" FOREIGN KEY ("service_channels_id") REFERENCES "public"."service_channels"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_requests_fk" FOREIGN KEY ("service_requests_id") REFERENCES "public"."service_requests"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_work_orders_fk" FOREIGN KEY ("work_orders_id") REFERENCES "public"."work_orders"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_system_events_fk" FOREIGN KEY ("system_events_id") REFERENCES "public"."system_events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_comments_fk" FOREIGN KEY ("comments_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_uploads_fk" FOREIGN KEY ("uploads_id") REFERENCES "public"."uploads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "tenants_updated_at_idx" ON "tenants" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "tenants_created_at_idx" ON "tenants" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "organizations_updated_at_idx" ON "organizations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "organizations_created_at_idx" ON "organizations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "teams_tenant_idx" ON "teams" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "teams_updated_at_idx" ON "teams" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "teams_created_at_idx" ON "teams" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "teams_rels_order_idx" ON "teams_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "teams_rels_parent_idx" ON "teams_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "teams_rels_path_idx" ON "teams_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "teams_rels_users_id_idx" ON "teams_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "users_tenants_roles_order_idx" ON "users_tenants_roles" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "users_tenants_roles_parent_idx" ON "users_tenants_roles" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "users_tenants_order_idx" ON "users_tenants" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "users_tenants_parent_id_idx" ON "users_tenants" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "users_tenants_tenant_idx" ON "users_tenants" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "contacts_tenant_idx" ON "contacts" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "contacts_updated_at_idx" ON "contacts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "contacts_created_at_idx" ON "contacts" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "vendors_tenant_idx" ON "vendors" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "vendors_updated_at_idx" ON "vendors" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "vendors_created_at_idx" ON "vendors" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "vendors_rels_order_idx" ON "vendors_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "vendors_rels_parent_idx" ON "vendors_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "vendors_rels_path_idx" ON "vendors_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "vendors_rels_contacts_id_idx" ON "vendors_rels" USING btree ("contacts_id");
  CREATE INDEX IF NOT EXISTS "inventories_tenant_idx" ON "inventories" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "inventories_updated_at_idx" ON "inventories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "inventories_created_at_idx" ON "inventories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "inventories_rels_order_idx" ON "inventories_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "inventories_rels_parent_idx" ON "inventories_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "inventories_rels_path_idx" ON "inventories_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "inventories_rels_locations_id_idx" ON "inventories_rels" USING btree ("locations_id");
  CREATE INDEX IF NOT EXISTS "inventories_rels_vendors_id_idx" ON "inventories_rels" USING btree ("vendors_id");
  CREATE INDEX IF NOT EXISTS "inventories_rels_uploads_id_idx" ON "inventories_rels" USING btree ("uploads_id");
  CREATE INDEX IF NOT EXISTS "locations_tenant_idx" ON "locations" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "locations_updated_at_idx" ON "locations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "locations_created_at_idx" ON "locations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "locations_rels_order_idx" ON "locations_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "locations_rels_parent_idx" ON "locations_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "locations_rels_path_idx" ON "locations_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "locations_rels_uploads_id_idx" ON "locations_rels" USING btree ("uploads_id");
  CREATE INDEX IF NOT EXISTS "assets_tenant_idx" ON "assets" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "assets_current_status_idx" ON "assets" USING btree ("current_status_id");
  CREATE INDEX IF NOT EXISTS "assets_location_idx" ON "assets" USING btree ("location_id");
  CREATE INDEX IF NOT EXISTS "assets_updated_at_idx" ON "assets" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "assets_created_at_idx" ON "assets" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "assets_rels_order_idx" ON "assets_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "assets_rels_parent_idx" ON "assets_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "assets_rels_path_idx" ON "assets_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "assets_rels_uploads_id_idx" ON "assets_rels" USING btree ("uploads_id");
  CREATE INDEX IF NOT EXISTS "assets_rels_teams_id_idx" ON "assets_rels" USING btree ("teams_id");
  CREATE INDEX IF NOT EXISTS "assets_rels_inventories_id_idx" ON "assets_rels" USING btree ("inventories_id");
  CREATE INDEX IF NOT EXISTS "assets_rels_vendors_id_idx" ON "assets_rels" USING btree ("vendors_id");
  CREATE INDEX IF NOT EXISTS "sensors_tenant_idx" ON "sensors" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "sensors_asset_idx" ON "sensors" USING btree ("asset_id");
  CREATE INDEX IF NOT EXISTS "sensors_location_idx" ON "sensors" USING btree ("location_id");
  CREATE INDEX IF NOT EXISTS "sensors_updated_at_idx" ON "sensors" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "sensors_created_at_idx" ON "sensors" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "asset_statuses_tenant_idx" ON "asset_statuses" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "asset_statuses_asset_idx" ON "asset_statuses" USING btree ("asset_id");
  CREATE INDEX IF NOT EXISTS "asset_statuses_updated_at_idx" ON "asset_statuses" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "asset_statuses_created_at_idx" ON "asset_statuses" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "service_channels_custom_fields_order_idx" ON "service_channels_custom_fields" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "service_channels_custom_fields_parent_id_idx" ON "service_channels_custom_fields" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "service_channels_tenant_idx" ON "service_channels" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "service_channels_location_idx" ON "service_channels" USING btree ("location_id");
  CREATE INDEX IF NOT EXISTS "service_channels_asset_idx" ON "service_channels" USING btree ("asset_id");
  CREATE INDEX IF NOT EXISTS "service_channels_updated_at_idx" ON "service_channels" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "service_channels_created_at_idx" ON "service_channels" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "service_requests_tenant_idx" ON "service_requests" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "service_requests_updated_at_idx" ON "service_requests" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "service_requests_created_at_idx" ON "service_requests" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "service_requests_rels_order_idx" ON "service_requests_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "service_requests_rels_parent_idx" ON "service_requests_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "service_requests_rels_path_idx" ON "service_requests_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "service_requests_rels_uploads_id_idx" ON "service_requests_rels" USING btree ("uploads_id");
  CREATE INDEX IF NOT EXISTS "work_orders_procedure_order_idx" ON "work_orders_procedure" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "work_orders_procedure_parent_id_idx" ON "work_orders_procedure" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "work_orders_recurrence_details_days_of_week_order_idx" ON "work_orders_recurrence_details_days_of_week" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "work_orders_recurrence_details_days_of_week_parent_id_idx" ON "work_orders_recurrence_details_days_of_week" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "work_orders_tenant_idx" ON "work_orders" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "work_orders_created_by_idx" ON "work_orders" USING btree ("created_by_id");
  CREATE INDEX IF NOT EXISTS "work_orders_assignment_assignment_teams_idx" ON "work_orders" USING btree ("assignment_teams_id");
  CREATE INDEX IF NOT EXISTS "work_orders_service_request_idx" ON "work_orders" USING btree ("service_request_id");
  CREATE INDEX IF NOT EXISTS "work_orders_location_idx" ON "work_orders" USING btree ("location_id");
  CREATE INDEX IF NOT EXISTS "work_orders_asset_idx" ON "work_orders" USING btree ("asset_id");
  CREATE INDEX IF NOT EXISTS "work_orders_updated_at_idx" ON "work_orders" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "work_orders_created_at_idx" ON "work_orders" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "work_orders_rels_order_idx" ON "work_orders_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "work_orders_rels_parent_idx" ON "work_orders_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "work_orders_rels_path_idx" ON "work_orders_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "work_orders_rels_uploads_id_idx" ON "work_orders_rels" USING btree ("uploads_id");
  CREATE INDEX IF NOT EXISTS "work_orders_rels_users_id_idx" ON "work_orders_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "work_orders_rels_inventories_id_idx" ON "work_orders_rels" USING btree ("inventories_id");
  CREATE INDEX IF NOT EXISTS "work_orders_rels_vendors_id_idx" ON "work_orders_rels" USING btree ("vendors_id");
  CREATE INDEX IF NOT EXISTS "system_events_tenant_idx" ON "system_events" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "comments_tenant_idx" ON "comments" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "comments_author_idx" ON "comments" USING btree ("author_id");
  CREATE INDEX IF NOT EXISTS "comments_updated_at_idx" ON "comments" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "comments_created_at_idx" ON "comments" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "comments_rels_order_idx" ON "comments_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "comments_rels_parent_idx" ON "comments_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "comments_rels_path_idx" ON "comments_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "comments_rels_assets_id_idx" ON "comments_rels" USING btree ("assets_id");
  CREATE INDEX IF NOT EXISTS "comments_rels_work_orders_id_idx" ON "comments_rels" USING btree ("work_orders_id");
  CREATE INDEX IF NOT EXISTS "comments_rels_inventories_id_idx" ON "comments_rels" USING btree ("inventories_id");
  CREATE INDEX IF NOT EXISTS "comments_rels_locations_id_idx" ON "comments_rels" USING btree ("locations_id");
  CREATE INDEX IF NOT EXISTS "comments_rels_service_requests_id_idx" ON "comments_rels" USING btree ("service_requests_id");
  CREATE INDEX IF NOT EXISTS "comments_rels_contacts_id_idx" ON "comments_rels" USING btree ("contacts_id");
  CREATE INDEX IF NOT EXISTS "comments_rels_vendors_id_idx" ON "comments_rels" USING btree ("vendors_id");
  CREATE INDEX IF NOT EXISTS "uploads_tenant_idx" ON "uploads" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "uploads_created_by_idx" ON "uploads" USING btree ("created_by_id");
  CREATE INDEX IF NOT EXISTS "uploads_updated_at_idx" ON "uploads" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "uploads_created_at_idx" ON "uploads" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "uploads_filename_idx" ON "uploads" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "uploads_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "uploads" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX IF NOT EXISTS "uploads_rels_order_idx" ON "uploads_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "uploads_rels_parent_idx" ON "uploads_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "uploads_rels_path_idx" ON "uploads_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "uploads_rels_assets_id_idx" ON "uploads_rels" USING btree ("assets_id");
  CREATE INDEX IF NOT EXISTS "uploads_rels_work_orders_id_idx" ON "uploads_rels" USING btree ("work_orders_id");
  CREATE INDEX IF NOT EXISTS "uploads_rels_inventories_id_idx" ON "uploads_rels" USING btree ("inventories_id");
  CREATE INDEX IF NOT EXISTS "uploads_rels_locations_id_idx" ON "uploads_rels" USING btree ("locations_id");
  CREATE INDEX IF NOT EXISTS "uploads_rels_service_requests_id_idx" ON "uploads_rels" USING btree ("service_requests_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_tenants_id_idx" ON "payload_locked_documents_rels" USING btree ("tenants_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_organizations_id_idx" ON "payload_locked_documents_rels" USING btree ("organizations_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_teams_id_idx" ON "payload_locked_documents_rels" USING btree ("teams_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_contacts_id_idx" ON "payload_locked_documents_rels" USING btree ("contacts_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_vendors_id_idx" ON "payload_locked_documents_rels" USING btree ("vendors_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_inventories_id_idx" ON "payload_locked_documents_rels" USING btree ("inventories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("locations_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_assets_id_idx" ON "payload_locked_documents_rels" USING btree ("assets_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_sensors_id_idx" ON "payload_locked_documents_rels" USING btree ("sensors_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_asset_statuses_id_idx" ON "payload_locked_documents_rels" USING btree ("asset_statuses_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_service_channels_id_idx" ON "payload_locked_documents_rels" USING btree ("service_channels_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_service_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("service_requests_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_work_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("work_orders_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_system_events_id_idx" ON "payload_locked_documents_rels" USING btree ("system_events_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_comments_id_idx" ON "payload_locked_documents_rels" USING btree ("comments_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_uploads_id_idx" ON "payload_locked_documents_rels" USING btree ("uploads_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "tenants" CASCADE;
  DROP TABLE "organizations" CASCADE;
  DROP TABLE "teams" CASCADE;
  DROP TABLE "teams_rels" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_tenants_roles" CASCADE;
  DROP TABLE "users_tenants" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "contacts" CASCADE;
  DROP TABLE "vendors" CASCADE;
  DROP TABLE "vendors_rels" CASCADE;
  DROP TABLE "inventories" CASCADE;
  DROP TABLE "inventories_rels" CASCADE;
  DROP TABLE "locations" CASCADE;
  DROP TABLE "locations_rels" CASCADE;
  DROP TABLE "assets" CASCADE;
  DROP TABLE "assets_rels" CASCADE;
  DROP TABLE "sensors" CASCADE;
  DROP TABLE "asset_statuses" CASCADE;
  DROP TABLE "service_channels_custom_fields" CASCADE;
  DROP TABLE "service_channels" CASCADE;
  DROP TABLE "service_requests" CASCADE;
  DROP TABLE "service_requests_rels" CASCADE;
  DROP TABLE "work_orders_procedure" CASCADE;
  DROP TABLE "work_orders_recurrence_details_days_of_week" CASCADE;
  DROP TABLE "work_orders" CASCADE;
  DROP TABLE "work_orders_rels" CASCADE;
  DROP TABLE "system_events" CASCADE;
  DROP TABLE "comments" CASCADE;
  DROP TABLE "comments_rels" CASCADE;
  DROP TABLE "uploads" CASCADE;
  DROP TABLE "uploads_rels" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_users_tenants_roles";
  DROP TYPE "public"."enum_sensors_status";
  DROP TYPE "public"."enum_asset_statuses_status";
  DROP TYPE "public"."enum_asset_statuses_downtime_type";
  DROP TYPE "public"."enum_service_channels_custom_fields_type";
  DROP TYPE "public"."enum_service_requests_status";
  DROP TYPE "public"."enum_work_orders_recurrence_details_days_of_week_day";
  DROP TYPE "public"."enum_work_orders_type";
  DROP TYPE "public"."enum_work_orders_recurrence_type";
  DROP TYPE "public"."enum_work_orders_recurrence_details_weekday_of_month_week";
  DROP TYPE "public"."enum_work_orders_recurrence_details_weekday_of_month_day";
  DROP TYPE "public"."enum_work_orders_priority";
  DROP TYPE "public"."enum_work_orders_status";
  DROP TYPE "public"."enum_system_events_event";
  DROP TYPE "public"."enum_system_events_resource_type";
  DROP TYPE "public"."enum_uploads_type";`)
}
