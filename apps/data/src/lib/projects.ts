import { cache } from 'react'

import {
  PROJECT_STATUSES,
  PROVINCES,
  SDGS,
  SECTORS,
  type ProjectStatusId,
  type SdgId,
  type ProvinceId,
  type SectorId,
} from '@scd/ui/reference'

import { DEMO_PROJECTS } from './demo'

// Fiches projets publiées par SCD-RDC DATA.
// Source unique : l'API du site institutionnel (rubrique « Projets » de l'administration), qui ne livre
// au public que les fiches au statut « Confirmé ». DATA vérifie à nouveau ce statut et n'affiche un montant
// que s'il a été déclaré publiable : aucune donnée n'est inventée ni présentée comme validée sans l'être.

export type Currency = 'USD' | 'CDF' | 'EUR'

export type ProjectResult = { indicator: string; value: string; period: string | null; source: string }

export type Project = {
  slug: string
  title: string
  summary: string
  institution: string
  partners: string | null
  supervision: string | null
  sector: SectorId
  province: ProvinceId
  location: string | null
  objectives: string | null
  periodStart: string | null
  periodEnd: string | null
  targetPopulation: string | null
  status: ProjectStatusId
  /** Objectifs de développement durable déclarés par l'institution porteuse (peut être vide). */
  sdgs: SdgId[]
  /** Présent seulement si le montant a été validé et déclaré publiable par l'institution source. */
  funding: { amount: number; currency: Currency; source: string | null } | null
  results: ProjectResult[]
  dataSource: string
  updatedOn: string
}

export type ProjectsData = { mode: 'api' | 'demo'; projects: Project[] } | { mode: 'unavailable'; projects: Project[] }

/**
 * Démonstration locale avec des projets FICTIFS, pour voir l'interface et ses animations.
 * Double verrou : DATA_DEMO n'existe que dans .env.local (jamais versionné ni déployé),
 * et la démonstration est refusée sur Vercel quoi qu'il arrive.
 */
export const isDemo = process.env.DATA_DEMO === '1' && !process.env.VERCEL && !process.env.VERCEL_ENV

const API_BASE = (process.env.SITE_API_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/+$/,
  '',
)

const sectorIds = new Set<string>(SECTORS.map((s) => s.id))
const provinceIds = new Set<string>(PROVINCES.map((p) => p.id))
const statusIds = new Set<string>(PROJECT_STATUSES.map((s) => s.id))
const sdgIds = new Set<string>(SDGS.map((s) => s.id))
const currencies = new Set<string>(['USD', 'CDF', 'EUR'])

type Doc = Record<string, unknown>

const text = (value: unknown) => (typeof value === 'string' && value.trim() ? value.trim() : null)

/** Contrôle chaque fiche reçue : une fiche incomplète ou non confirmée n'est jamais affichée. */
function normalize(doc: Doc): Project | null {
  if (doc.validationStatus !== 'confirme') return null
  const slug = text(doc.slug)
  const title = text(doc.title)
  const summary = text(doc.summary)
  const institution = text(doc.institution)
  const dataSource = text(doc.dataSource)
  const updatedOn = text(doc.updatedOn)
  const sector = text(doc.sector)
  const province = text(doc.province)
  const status = text(doc.status)
  if (!slug || !title || !summary || !institution || !dataSource || !updatedOn) return null
  if (!sector || !sectorIds.has(sector) || !province || !provinceIds.has(province)) return null
  if (!status || !statusIds.has(status)) return null

  const amount = typeof doc.amount === 'number' ? doc.amount : Number(doc.amount)
  const currency = text(doc.currency) ?? 'USD'
  const funding =
    doc.fundingPublishable === true && Number.isFinite(amount) && amount > 0 && currencies.has(currency)
      ? { amount, currency: currency as Currency, source: text(doc.fundingSource) }
      : null

  const results = Array.isArray(doc.results)
    ? doc.results.flatMap((row) => {
        if (!row || typeof row !== 'object') return []
        const r = row as Doc
        const indicator = text(r.indicator)
        const value = text(r.value)
        const source = text(r.source)
        return indicator && value && source ? [{ indicator, value, source, period: text(r.period) }] : []
      })
    : []

  return {
    slug,
    title,
    summary,
    institution,
    partners: text(doc.partners),
    supervision: text(doc.supervision),
    sector: sector as SectorId,
    province: province as ProvinceId,
    location: text(doc.location),
    objectives: text(doc.objectives),
    periodStart: text(doc.periodStart),
    periodEnd: text(doc.periodEnd),
    targetPopulation: text(doc.targetPopulation),
    status: status as ProjectStatusId,
    sdgs: Array.isArray(doc.sdgs)
      ? SDGS.filter((s) => (doc.sdgs as unknown[]).some((v) => String(v) === s.id && sdgIds.has(s.id))).map((s) => s.id)
      : [],
    funding,
    results,
    dataSource,
    updatedOn,
  }
}

async function fetchValidatedProjects(): Promise<Project[]> {
  const query = new URLSearchParams({
    'where[validationStatus][equals]': 'confirme',
    depth: '0',
    locale: 'fr',
    pagination: 'false',
  })
  const response = await fetch(`${API_BASE}/api/projects?${query}`, {
    headers: { Accept: 'application/json' },
    // Une fiche validée dans l'administration apparaît sur DATA en 5 minutes au plus.
    next: { revalidate: 300, tags: ['projects'] },
  })
  if (!response.ok) throw new Error(`API des projets : réponse ${response.status}`)
  const body = (await response.json()) as { docs?: unknown }
  if (!Array.isArray(body.docs)) throw new Error('API des projets : réponse inattendue')
  return body.docs.flatMap((doc) => {
    const project = doc && typeof doc === 'object' ? normalize(doc as Doc) : null
    return project ? [project] : []
  })
}

const byMostRecent = (a: Project, b: Project) =>
  b.updatedOn.localeCompare(a.updatedOn) || a.title.localeCompare(b.title, 'fr')

/** Toutes les fiches publiables, de la plus récemment mise à jour à la plus ancienne (mémorisé par requête). */
export const getProjects = cache(async (): Promise<ProjectsData> => {
  if (isDemo) return { mode: 'demo', projects: [...DEMO_PROJECTS].sort(byMostRecent) }
  try {
    return { mode: 'api', projects: (await fetchValidatedProjects()).sort(byMostRecent) }
  } catch (error) {
    console.error('[SCD-RDC DATA] Fiches projets indisponibles :', error)
    return { mode: 'unavailable', projects: [] }
  }
})
