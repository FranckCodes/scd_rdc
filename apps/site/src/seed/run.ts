// Charge les contenus proposés dans la base.
// Par défaut, ne crée que ce qui manque : les pages et formulaires déjà présents (et peut-être
// modifiés dans l'administration) ne sont PAS écrasés. Pour tout réécrire : SEED_FORCE=1 pnpm seed
// Lancer : pnpm --filter site seed
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

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

// Organisateurs (« Organisé par ») — confirmés par l'équipe SCD-RDC le 25/11/2026.
// Logos : déposer les fichiers dans resources/logos/organisateurs/ (PNG/SVG/JPG, un par cabinet,
// nom contenant le mot-clé ci-dessous). Un logo manquant est ajouté au prochain `pnpm seed`.
const organisers = [
  { name: 'CBS SARL', key: 'cbs' },
  { name: 'NKOSI ADVISORY', key: 'nkosi' },
  { name: 'CABINET DEBRE INT’L', key: 'debre' },
  { name: 'BANTU EXPERTISE', key: 'bantu' },
]
const logoDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../resources/logos/organisateurs')
const logoFiles = fs.existsSync(logoDir) ? fs.readdirSync(logoDir).filter((f) => /\.(png|svg|jpe?g|webp)$/i.test(f)) : []

for (const [index, org] of organisers.entries()) {
  const file = logoFiles.find((f) => f.toLowerCase().includes(org.key))
  const existing = (
    await payload.find({ collection: 'partners', where: { name: { equals: org.name } }, limit: 1, depth: 0 })
  ).docs[0]
  if (existing && existing.logo && !FORCE) {
    payload.logger.info(`= partners/${org.name} (déjà présent, conservé)`)
    continue
  }
  let logo: number | undefined
  if (file) {
    const media = await payload.create({
      collection: 'media',
      locale: 'fr',
      data: { alt: `Logo ${org.name}`, credit: org.name, rightsCleared: true },
      filePath: path.join(logoDir, file),
    })
    logo = media.id
  }
  const data = {
    name: org.name,
    tier: 'organisateur' as const,
    order: index + 1,
    validationStatus: 'confirme' as const,
    logoAuthorized: true,
    ...(logo ? { logo } : {}),
  }
  if (existing) {
    await payload.update({ collection: 'partners', id: existing.id, data })
    payload.logger.info(`↻ partners/${org.name}${logo ? ' (logo ajouté)' : ' (logo à déposer)'}`)
  } else {
    await payload.create({ collection: 'partners', data })
    payload.logger.info(`+ partners/${org.name}${logo ? '' : ' (logo à déposer)'}`)
  }
}

// Formulaire exposant enrichi (analyse, étape 2) : ajouté aux formulaires déjà créés sans toucher au reste.
{
  const expo = (await payload.find({ collection: 'forms', where: { slug: { equals: 'exposant' } }, limit: 1, depth: 0 })).docs[0]
  const target = forms.find((f) => f.slug === 'exposant')
  const hasNew = expo?.fields?.some((f) => 'name' in f && f.name === 'surface')
  if (expo && target && !hasNew) {
    await payload.update({ collection: 'forms', id: expo.id, locale: 'fr', data: { fields: target.fields } as never })
    payload.logger.info('↻ forms/exposant (questions de qualification ajoutées)')
  }
}

// Offres, Salon et programme prévisionnel : contenu de départ NON publié (cases de validation décochées).
// Seuls les publics visés sont affichés tant que rien n'est validé.
{
  const offers = await payload.findGlobal({ slug: 'offers', locale: 'fr' })
  if (FORCE || !offers.institutionnel?.audience) {
    await payload.updateGlobal({
      slug: 'offers',
      locale: 'fr',
      data: {
        institutionnel: {
          audience:
            'Ministères, Parlement, provinces, établissements publics et représentations diplomatiques qui souhaitent s’associer officiellement à la SCD-RDC.',
        },
        ptf: {
          audience:
            'Bailleurs bilatéraux et multilatéraux, institutions financières internationales et agences des Nations Unies qui financent ou accompagnent des projets en RDC.',
        },
        sponsor: {
          audience:
            'Entreprises, banques et opérateurs économiques qui souhaitent associer leur image à une coopération plus visible et orientée vers les résultats.',
        },
        media: { audience: 'Médias nationaux et internationaux qui souhaitent couvrir la SCD-RDC et relayer ses temps forts.' },
        // Trame proposée par l'analyse professionnelle (nov. 2026) — à valider avant publication.
        provisional: [
          { day: 'j1', period: 'am', title: 'Cérémonie officielle d’ouverture et Forum national' },
          { day: 'j1', period: 'pm', title: 'Panels de haut niveau et ouverture du Salon des projets' },
          { day: 'j2', period: 'am', title: 'Rencontres sectorielles, Agora citoyenne et Laboratoire des solutions' },
          { day: 'j2', period: 'pm', title: 'Rencontres partenariales, remise des Trophées et clôture' },
        ],
      },
    })
    payload.logger.info('+ Offres et programme prévisionnel (contenu de départ, non publié)')
  }
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
