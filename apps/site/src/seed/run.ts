// Charge les contenus proposés dans la base.
// Par défaut, ne crée que ce qui manque : les pages et formulaires déjà présents (et peut-être
// modifiés dans l'administration) ne sont PAS écrasés. Pour tout réécrire : SEED_FORCE=1 pnpm seed
// Lancer : pnpm --filter site seed
import config from '@payload-config'
import { getPayload } from 'payload'

import { forms } from './forms'
import { pages } from './pages'

const payload = await getPayload({ config })
const FORCE = process.env.SEED_FORCE === '1'

async function upsert(collection: 'pages' | 'forms', slug: string, data: Record<string, unknown>) {
  const existing = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, locale: 'fr' })
  const opts = { collection, data, locale: 'fr' as const, context: { seed: true } }
  if (existing.docs[0]) {
    if (!FORCE) {
      payload.logger.info(`= ${collection}/${slug} (déjà présent, conservé)`)
      return
    }
    await payload.update({ ...opts, id: existing.docs[0].id } as never)
    payload.logger.info(`↻ ${collection}/${slug}`)
  } else {
    await payload.create(opts as never)
    payload.logger.info(`+ ${collection}/${slug}`)
  }
}

for (const page of pages) {
  await upsert('pages', page.slug, { ...page, proposal: true, _status: 'published' })
}
for (const form of forms) {
  await upsert('forms', form.slug, form)
}

const currentEvent = await payload.findGlobal({ slug: 'event-info', locale: 'fr' })
if (!FORCE && (currentEvent.keyFigures?.length ?? 0) > 0) {
  payload.logger.info('= Informations de l’événement (déjà renseignées, conservées)')
  process.exit(0)
}

await payload.updateGlobal({
  slug: 'event-info',
  locale: 'fr',
  data: {
    dates: 'Mars 2027',
    datesConfirmed: false,
    city: 'Kinshasa',
    venueConfirmed: false,
    format: '2 jours · 250–300 décideurs',
    keyFigures: [
      { value: '2', label: 'jours de rencontres', source: 'Dossier institutionnel SCD-RDC, sept. 2026', provisional: true },
      { value: '250–300', label: 'décideurs sélectionnés', source: 'Dossier institutionnel SCD-RDC, sept. 2026', provisional: true },
      { value: '≈ 20', label: 'pavillons de démonstration', source: 'Dossier institutionnel SCD-RDC, sept. 2026', provisional: true },
      { value: '50', label: 'projets phares (SCD-RDC DATA)', source: 'Dossier institutionnel SCD-RDC, sept. 2026', provisional: true },
    ],
    contact: { email: 'info@scd-rdc.org' },
  },
})
payload.logger.info('✓ Informations de l’événement')
process.exit(0)
