import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_partners_tier" ADD VALUE 'organisateur' BEFORE 'institutionnel';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "partners" ALTER COLUMN "tier" SET DATA TYPE text;
  DROP TYPE "public"."enum_partners_tier";
  CREATE TYPE "public"."enum_partners_tier" AS ENUM('institutionnel', 'ptf', 'sponsor', 'media');
  ALTER TABLE "partners" ALTER COLUMN "tier" SET DATA TYPE "public"."enum_partners_tier" USING "tier"::"public"."enum_partners_tier";`)
}
