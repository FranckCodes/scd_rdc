import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_governance_body" AS ENUM('entite', 'patronage', 'organisation', 'secretariat', 'commissions');
  CREATE TYPE "public"."enum_governance_validation_status" AS ENUM('confirme', 'en-attente', 'a-venir');
  CREATE TABLE "governance" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"body" "enum_governance_body" NOT NULL,
  	"name" varchar NOT NULL,
  	"organization" varchar,
  	"photo_id" integer,
  	"email" varchar,
  	"order" numeric DEFAULT 100,
  	"validation_status" "enum_governance_validation_status" DEFAULT 'en-attente' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "governance_locales" (
  	"role" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "governance_id" integer;
  ALTER TABLE "governance" ADD CONSTRAINT "governance_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "governance_locales" ADD CONSTRAINT "governance_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."governance"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "governance_photo_idx" ON "governance" USING btree ("photo_id");
  CREATE INDEX "governance_updated_at_idx" ON "governance" USING btree ("updated_at");
  CREATE INDEX "governance_created_at_idx" ON "governance" USING btree ("created_at");
  CREATE UNIQUE INDEX "governance_locales_locale_parent_id_unique" ON "governance_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "governance_locales_parent_id_idx" ON "governance_locales" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_governance_fk" FOREIGN KEY ("governance_id") REFERENCES "public"."governance"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_governance_id_idx" ON "payload_locked_documents_rels" USING btree ("governance_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "governance" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "governance_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "governance" CASCADE;
  DROP TABLE "governance_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_governance_fk";
  
  DROP INDEX "payload_locked_documents_rels_governance_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "governance_id";
  DROP TYPE "public"."enum_governance_body";
  DROP TYPE "public"."enum_governance_validation_status";`)
}
