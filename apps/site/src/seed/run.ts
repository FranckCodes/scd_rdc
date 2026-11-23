// Charge les contenus proposés dans la base (idempotent : met à jour si l'élément existe déjà).
// Lancer : pnpm --filter site seed
import config from '@payload-config'
import { getPayload } from 'payload'

import { forms } from './forms'
import { pages } from './pages'

const payload = await getPayload({ config })

async function upsert(collection: 'pages' | 'forms', slug: string, data: Record<string, unknown>) {
  const existing = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, locale: 'fr' })
  const opts = { collection, data, locale: 'fr' as const, context: { seed: true } }
  if (existing.docs[0]) {
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
