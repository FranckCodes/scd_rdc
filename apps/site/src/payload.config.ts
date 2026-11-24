import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { ar } from '@payloadcms/translations/languages/ar'
import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { loggedIn } from './access/roles'
import { Documents } from './collections/Documents'
import { Exhibitors } from './collections/Exhibitors'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { Pages } from './collections/Pages'
import { Partners } from './collections/Partners'
import { Sessions } from './collections/Sessions'
import { Speakers } from './collections/Speakers'
import { Users } from './collections/Users'
import { EventInfo } from './globals/EventInfo'
import { defaultLocale, localeLabels, locales, rtlLocales } from './i18n/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',

  // Envoi des e-mails (notifications et accusés de réception des formulaires, mots de passe oubliés)
  // via Resend. Sans RESEND_API_KEY (développement local), les e-mails sont seulement écrits dans la console.
  ...(process.env.RESEND_API_KEY
    ? {
        email: resendAdapter({
          apiKey: process.env.RESEND_API_KEY,
          defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@scd-rdc.org',
          defaultFromName: process.env.EMAIL_FROM_NAME || 'SCD-RDC',
        }),
      }
    : {}),

  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · SCD-RDC' },
    importMap: { baseDir: path.resolve(dirname) },
  },

  // Langue de l'interface d'administration
  i18n: {
    fallbackLanguage: 'fr',
    supportedLanguages: { fr, en, ar },
  },

  // Langues des contenus du site (FR, EN, ZH, RU, AR). Le français sert de repli.
  localization: {
    locales: locales.map((code) => ({
      code,
      label: localeLabels[code],
      rtl: rtlLocales.includes(code),
    })),
    defaultLocale,
    fallback: true,
  },

  collections: [Pages, News, Sessions, Speakers, Exhibitors, Partners, Documents, Media, Users],
  globals: [EventInfo],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // En production, le schéma évolue uniquement par migrations (src/migrations), jamais par « push ».
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [
    // Fichiers envoyés (photos, PDF) : Vercel Blob en production (le disque de Vercel est éphémère).
    // Sans jeton BLOB_READ_WRITE_TOKEN (développement local), les fichiers restent sur le disque.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true, documents: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
    // Formulaires des TDR (§8.1) : participation, partenaire, exposant, contribution, accréditation presse.
    // Les formulaires sont créés dans l'administration ; les réponses sont exportables.
    formBuilderPlugin({
      fields: { payment: false },
      formOverrides: {
        labels: { singular: 'Formulaire', plural: 'Formulaires' },
        admin: { group: 'Formulaires', useAsTitle: 'title' },
        access: { read: () => true, create: loggedIn, update: loggedIn, delete: loggedIn },
        fields: ({ defaultFields }) => [
          {
            name: 'slug',
            label: 'Adresse (slug)',
            type: 'text',
            required: true,
            unique: true,
            admin: { position: 'sidebar', description: 'Ex. : manifestation-interet → /fr/participer/manifestation-interet' },
          },
          { name: 'intro', label: 'Texte d’introduction', type: 'textarea', localized: true },
          ...defaultFields,
        ],
      },
      formSubmissionOverrides: {
        labels: { singular: 'Demande reçue', plural: 'Demandes reçues' },
        admin: { group: 'Formulaires' },
      },
    }),
  ],
})
