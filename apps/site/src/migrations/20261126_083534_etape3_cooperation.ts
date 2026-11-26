import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_cooperations_validation_status" AS ENUM('confirme', 'en-attente', 'a-venir');
  CREATE TYPE "public"."enum_event_info_social_network" AS ENUM('linkedin', 'facebook', 'x', 'instagram', 'youtube', 'tiktok', 'whatsapp');
  ALTER TYPE "public"."enum_documents_kind" ADD VALUE 'dossier-presse' BEFORE 'formulaire';
  ALTER TYPE "public"."enum_documents_kind" ADD VALUE 'logos' BEFORE 'formulaire';
  ALTER TYPE "public"."enum_documents_kind" ADD VALUE 'charte' BEFORE 'formulaire';
  CREATE TABLE "cooperations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" varchar,
  	"photo_id" integer,
  	"url" varchar,
  	"order" numeric DEFAULT 100,
  	"validation_status" "enum_cooperations_validation_status" DEFAULT 'en-attente' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cooperations_locales" (
  	"name" varchar NOT NULL,
  	"summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "event_info_hotels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"url" varchar,
  	"confirmed" boolean DEFAULT false
  );
  
  CREATE TABLE "event_info_hotels_locales" (
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "event_info_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"network" "enum_event_info_social_network" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  ALTER TABLE "media" ADD COLUMN "in_gallery" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cooperations_id" integer;
  ALTER TABLE "event_info" ADD COLUMN "contact_press_name" varchar;
  ALTER TABLE "event_info" ADD COLUMN "contact_press_email" varchar;
  ALTER TABLE "event_info" ADD COLUMN "contact_press_phone" varchar;
  ALTER TABLE "event_info" ADD COLUMN "contact_delegations_email" varchar;
  ALTER TABLE "event_info_locales" ADD COLUMN "venue_address" varchar;
  ALTER TABLE "event_info_locales" ADD COLUMN "access" varchar;
  ALTER TABLE "cooperations" ADD CONSTRAINT "cooperations_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cooperations_locales" ADD CONSTRAINT "cooperations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cooperations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "event_info_hotels" ADD CONSTRAINT "event_info_hotels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."event_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "event_info_hotels_locales" ADD CONSTRAINT "event_info_hotels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."event_info_hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "event_info_social" ADD CONSTRAINT "event_info_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."event_info"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "cooperations_photo_idx" ON "cooperations" USING btree ("photo_id");
  CREATE INDEX "cooperations_updated_at_idx" ON "cooperations" USING btree ("updated_at");
  CREATE INDEX "cooperations_created_at_idx" ON "cooperations" USING btree ("created_at");
  CREATE UNIQUE INDEX "cooperations_locales_locale_parent_id_unique" ON "cooperations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cooperations_locales_parent_id_idx" ON "cooperations_locales" USING btree ("_parent_id");
  CREATE INDEX "event_info_hotels_order_idx" ON "event_info_hotels" USING btree ("_order");
  CREATE INDEX "event_info_hotels_parent_id_idx" ON "event_info_hotels" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "event_info_hotels_locales_locale_parent_id_unique" ON "event_info_hotels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "event_info_hotels_locales_parent_id_idx" ON "event_info_hotels_locales" USING btree ("_parent_id");
  CREATE INDEX "event_info_social_order_idx" ON "event_info_social" USING btree ("_order");
  CREATE INDEX "event_info_social_parent_id_idx" ON "event_info_social" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cooperations_fk" FOREIGN KEY ("cooperations_id") REFERENCES "public"."cooperations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_cooperations_id_idx" ON "payload_locked_documents_rels" USING btree ("cooperations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cooperations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cooperations_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "event_info_hotels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "event_info_hotels_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "event_info_social" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "cooperations" CASCADE;
  DROP TABLE "cooperations_locales" CASCADE;
  DROP TABLE "event_info_hotels" CASCADE;
  DROP TABLE "event_info_hotels_locales" CASCADE;
  DROP TABLE "event_info_social" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_cooperations_fk";
  
  ALTER TABLE "documents" ALTER COLUMN "kind" SET DATA TYPE text;
  DROP TYPE "public"."enum_documents_kind";
  CREATE TYPE "public"."enum_documents_kind" AS ENUM('dossier', 'dossier-partenariat', 'dossier-exposant', 'note', 'programme', 'rapport', 'communique', 'kit-presse', 'formulaire');
  ALTER TABLE "documents" ALTER COLUMN "kind" SET DATA TYPE "public"."enum_documents_kind" USING "kind"::"public"."enum_documents_kind";
  DROP INDEX "payload_locked_documents_rels_cooperations_id_idx";
  ALTER TABLE "media" DROP COLUMN "in_gallery";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "cooperations_id";
  ALTER TABLE "event_info" DROP COLUMN "contact_press_name";
  ALTER TABLE "event_info" DROP COLUMN "contact_press_email";
  ALTER TABLE "event_info" DROP COLUMN "contact_press_phone";
  ALTER TABLE "event_info" DROP COLUMN "contact_delegations_email";
  ALTER TABLE "event_info_locales" DROP COLUMN "venue_address";
  ALTER TABLE "event_info_locales" DROP COLUMN "access";
  DROP TYPE "public"."enum_cooperations_validation_status";
  DROP TYPE "public"."enum_event_info_social_network";`)
}
