import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_sdgs" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17');
  CREATE TABLE "projects_sdgs" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_projects_sdgs",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "projects_sdgs" ADD CONSTRAINT "projects_sdgs_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_sdgs_order_idx" ON "projects_sdgs" USING btree ("order");
  CREATE INDEX "projects_sdgs_parent_idx" ON "projects_sdgs" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects_sdgs" CASCADE;
  DROP TYPE "public"."enum_projects_sdgs";`)
}
