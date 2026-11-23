import { postgresAdapter } from '@payloadcms/db-postgres'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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
  }),
  sharp,
  plugins: [
    // Formulaires des TDR (§8.1) : participation, partenaire, exposant, contribution, accréditation presse.
    // Les formulaires sont créés dans l'administration ; les réponses sont exportables.
    formBuilderPlugin({
      fields: { payment: false },
      formOverrides: {
        labels: { singular: 'Formulaire', plural: 'Formulaires' },
        admin: { group: 'Formulaires' },
        access: { read: () => true, create: loggedIn, update: loggedIn, delete: loggedIn },
      },
      formSubmissionOverrides: {
        labels: { singular: 'Demande reçue', plural: 'Demandes reçues' },
        admin: { group: 'Formulaires' },
      },
    }),
  ],
})
