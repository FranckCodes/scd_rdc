import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_trophies_validation_status" AS ENUM('confirme', 'en-attente', 'a-venir');
  CREATE TABLE "trophies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"laureate_name" varchar,
  	"laureate_organisation" varchar,
  	"laureate_photo_id" integer,
  	"order" numeric DEFAULT 0,
  	"revealed" boolean DEFAULT false,
  	"validation_status" "enum_trophies_validation_status" DEFAULT 'en-attente' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "trophies_locales" (
  	"category" varchar NOT NULL,
  	"description" varchar,
  	"laureate_summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "trophies_id" integer;
  ALTER TABLE "event_info" ADD COLUMN "start_date" timestamp(3) with time zone;
  ALTER TABLE "event_info" ADD COLUMN "end_date" timestamp(3) with time zone;
  ALTER TABLE "event_info" ADD COLUMN "ceremony_live" boolean DEFAULT false;
  ALTER TABLE "trophies" ADD CONSTRAINT "trophies_laureate_photo_id_media_id_fk" FOREIGN KEY ("laureate_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "trophies_locales" ADD CONSTRAINT "trophies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trophies"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "trophies_laureate_laureate_photo_idx" ON "trophies" USING btree ("laureate_photo_id");
  CREATE INDEX "trophies_updated_at_idx" ON "trophies" USING btree ("updated_at");
  CREATE INDEX "trophies_created_at_idx" ON "trophies" USING btree ("created_at");
  CREATE UNIQUE INDEX "trophies_locales_locale_parent_id_unique" ON "trophies_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "trophies_locales_parent_id_idx" ON "trophies_locales" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_trophies_fk" FOREIGN KEY ("trophies_id") REFERENCES "public"."trophies"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_trophies_id_idx" ON "payload_locked_documents_rels" USING btree ("trophies_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "trophies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "trophies_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "trophies" CASCADE;
  DROP TABLE "trophies_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_trophies_fk";
  
  DROP INDEX "payload_locked_documents_rels_trophies_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "trophies_id";
  ALTER TABLE "event_info" DROP COLUMN "start_date";
  ALTER TABLE "event_info" DROP COLUMN "end_date";
  ALTER TABLE "event_info" DROP COLUMN "ceremony_live";
  DROP TYPE "public"."enum_trophies_validation_status";`)
}
