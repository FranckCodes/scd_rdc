import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_sector" AS ENUM('infrastructures', 'energie', 'capital-humain', 'climat', 'agriculture', 'industrie', 'sante', 'territoires', 'culture');
  CREATE TYPE "public"."enum_projects_province" AS ENUM('bas-uele', 'equateur', 'haut-katanga', 'haut-lomami', 'haut-uele', 'ituri', 'kasai', 'kasai-central', 'kasai-oriental', 'kinshasa', 'kongo-central', 'kwango', 'kwilu', 'lomami', 'lualaba', 'mai-ndombe', 'maniema', 'mongala', 'nord-kivu', 'nord-ubangi', 'sankuru', 'sud-kivu', 'sud-ubangi', 'tanganyika', 'tshopo', 'tshuapa');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('annonce', 'en-preparation', 'finance', 'en-execution', 'acheve', 'cloture');
  CREATE TYPE "public"."enum_projects_currency" AS ENUM('USD', 'CDF', 'EUR');
  CREATE TYPE "public"."enum_projects_validation_status" AS ENUM('confirme', 'en-attente', 'a-venir');
  CREATE TABLE "projects_results" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"period" varchar,
  	"source" varchar NOT NULL
  );
  
  CREATE TABLE "projects_results_locales" (
  	"indicator" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"institution" varchar NOT NULL,
  	"partners" varchar,
  	"supervision" varchar,
  	"sector" "enum_projects_sector" NOT NULL,
  	"province" "enum_projects_province" NOT NULL,
  	"location" varchar,
  	"period_start" timestamp(3) with time zone,
  	"period_end" timestamp(3) with time zone,
  	"status" "enum_projects_status" DEFAULT 'annonce' NOT NULL,
  	"funding_publishable" boolean DEFAULT false,
  	"amount" numeric,
  	"currency" "enum_projects_currency" DEFAULT 'USD',
  	"funding_source" varchar,
  	"data_source" varchar NOT NULL,
  	"updated_on" timestamp(3) with time zone NOT NULL,
  	"validation_status" "enum_projects_validation_status" DEFAULT 'en-attente' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_locales" (
  	"title" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"objectives" varchar,
  	"target_population" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "projects_results" ADD CONSTRAINT "projects_results_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_results_locales" ADD CONSTRAINT "projects_results_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_results_order_idx" ON "projects_results" USING btree ("_order");
  CREATE INDEX "projects_results_parent_id_idx" ON "projects_results" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_results_locales_locale_parent_id_unique" ON "projects_results_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_results_locales_parent_id_idx" ON "projects_results_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_locales_parent_id_idx" ON "projects_locales" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_results" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_results_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects_results" CASCADE;
  DROP TABLE "projects_results_locales" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  DROP TYPE "public"."enum_projects_sector";
  DROP TYPE "public"."enum_projects_province";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum_projects_currency";
  DROP TYPE "public"."enum_projects_validation_status";`)
}
