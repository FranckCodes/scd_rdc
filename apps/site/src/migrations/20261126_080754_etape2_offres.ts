import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_form_submissions_follow_up_status" AS ENUM('nouvelle', 'qualifiee', 'discussion', 'conclue', 'sans-suite');
  CREATE TYPE "public"."enum_offers_provisional_day" AS ENUM('j1', 'j2');
  CREATE TYPE "public"."enum_offers_provisional_period" AS ENUM('am', 'pm');
  ALTER TYPE "public"."enum_documents_kind" ADD VALUE 'dossier-partenariat' BEFORE 'note';
  ALTER TYPE "public"."enum_documents_kind" ADD VALUE 'dossier-exposant' BEFORE 'note';
  CREATE TABLE "offers_stands" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"dimensions" varchar,
  	"price" varchar,
  	"price_approved" boolean DEFAULT false
  );
  
  CREATE TABLE "offers_stands_locales" (
  	"name" varchar NOT NULL,
  	"included" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "offers_provisional" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_offers_provisional_day" NOT NULL,
  	"period" "enum_offers_provisional_period" NOT NULL
  );
  
  CREATE TABLE "offers_provisional_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "offers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"offers_validated" boolean DEFAULT false,
  	"stands_validated" boolean DEFAULT false,
  	"advantages_validated" boolean DEFAULT false,
  	"floor_plan_id" integer,
  	"floor_plan_validated" boolean DEFAULT false,
  	"provisional_published" boolean DEFAULT false,
  	"components_validated" boolean DEFAULT false,
  	"video_url" varchar,
  	"video_poster_id" integer,
  	"video_published" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "offers_locales" (
  	"institutionnel_audience" varchar,
  	"institutionnel_benefits" varchar,
  	"institutionnel_modalities" varchar,
  	"ptf_audience" varchar,
  	"ptf_benefits" varchar,
  	"ptf_modalities" varchar,
  	"sponsor_audience" varchar,
  	"sponsor_benefits" varchar,
  	"sponsor_modalities" varchar,
  	"media_audience" varchar,
  	"media_benefits" varchar,
  	"media_modalities" varchar,
  	"advantages" varchar,
  	"forum_objectives" varchar,
  	"forum_audiences" varchar,
  	"forum_results" varchar,
  	"forum_contribution" varchar,
  	"salon_objectives" varchar,
  	"salon_audiences" varchar,
  	"salon_results" varchar,
  	"salon_contribution" varchar,
  	"agora_objectives" varchar,
  	"agora_audiences" varchar,
  	"agora_results" varchar,
  	"agora_contribution" varchar,
  	"laboratoire_objectives" varchar,
  	"laboratoire_audiences" varchar,
  	"laboratoire_results" varchar,
  	"laboratoire_contribution" varchar,
  	"trophees_objectives" varchar,
  	"trophees_audiences" varchar,
  	"trophees_results" varchar,
  	"trophees_contribution" varchar,
  	"video_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "form_submissions" ADD COLUMN "follow_up_status" "enum_form_submissions_follow_up_status" DEFAULT 'nouvelle';
  ALTER TABLE "form_submissions" ADD COLUMN "assignee_id" integer;
  ALTER TABLE "form_submissions" ADD COLUMN "next_action" timestamp(3) with time zone;
  ALTER TABLE "form_submissions" ADD COLUMN "internal_notes" varchar;
  ALTER TABLE "offers_stands" ADD CONSTRAINT "offers_stands_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_stands_locales" ADD CONSTRAINT "offers_stands_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers_stands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_provisional" ADD CONSTRAINT "offers_provisional_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_provisional_locales" ADD CONSTRAINT "offers_provisional_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers_provisional"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers" ADD CONSTRAINT "offers_floor_plan_id_media_id_fk" FOREIGN KEY ("floor_plan_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "offers" ADD CONSTRAINT "offers_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "offers_locales" ADD CONSTRAINT "offers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "offers_stands_order_idx" ON "offers_stands" USING btree ("_order");
  CREATE INDEX "offers_stands_parent_id_idx" ON "offers_stands" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "offers_stands_locales_locale_parent_id_unique" ON "offers_stands_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "offers_stands_locales_parent_id_idx" ON "offers_stands_locales" USING btree ("_parent_id");
  CREATE INDEX "offers_provisional_order_idx" ON "offers_provisional" USING btree ("_order");
  CREATE INDEX "offers_provisional_parent_id_idx" ON "offers_provisional" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "offers_provisional_locales_locale_parent_id_unique" ON "offers_provisional_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "offers_provisional_locales_parent_id_idx" ON "offers_provisional_locales" USING btree ("_parent_id");
  CREATE INDEX "offers_floor_plan_idx" ON "offers" USING btree ("floor_plan_id");
  CREATE INDEX "offers_video_poster_idx" ON "offers" USING btree ("video_poster_id");
  CREATE UNIQUE INDEX "offers_locales_locale_parent_id_unique" ON "offers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "offers_locales_parent_id_idx" ON "offers_locales" USING btree ("_parent_id");
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "form_submissions_assignee_idx" ON "form_submissions" USING btree ("assignee_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "offers_stands" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "offers_stands_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "offers_provisional" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "offers_provisional_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "offers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "offers_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "offers_stands" CASCADE;
  DROP TABLE "offers_stands_locales" CASCADE;
  DROP TABLE "offers_provisional" CASCADE;
  DROP TABLE "offers_provisional_locales" CASCADE;
  DROP TABLE "offers" CASCADE;
  DROP TABLE "offers_locales" CASCADE;
  ALTER TABLE "form_submissions" DROP CONSTRAINT "form_submissions_assignee_id_users_id_fk";
  
  ALTER TABLE "documents" ALTER COLUMN "kind" SET DATA TYPE text;
  DROP TYPE "public"."enum_documents_kind";
  CREATE TYPE "public"."enum_documents_kind" AS ENUM('dossier', 'note', 'programme', 'rapport', 'communique', 'kit-presse', 'formulaire');
  ALTER TABLE "documents" ALTER COLUMN "kind" SET DATA TYPE "public"."enum_documents_kind" USING "kind"::"public"."enum_documents_kind";
  DROP INDEX "form_submissions_assignee_idx";
  ALTER TABLE "form_submissions" DROP COLUMN "follow_up_status";
  ALTER TABLE "form_submissions" DROP COLUMN "assignee_id";
  ALTER TABLE "form_submissions" DROP COLUMN "next_action";
  ALTER TABLE "form_submissions" DROP COLUMN "internal_notes";
  DROP TYPE "public"."enum_form_submissions_follow_up_status";
  DROP TYPE "public"."enum_offers_provisional_day";
  DROP TYPE "public"."enum_offers_provisional_period";`)
}
