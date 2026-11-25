import { PROJECT_STATUSES, PROVINCES, SDGS, SECTORS } from '@scd/ui/reference'

import type { Currency, Project } from './projects'

// Formats français (espaces insécables, mois en toutes lettres) et libellés des listes de référence.

const findLabel = (list: readonly { id: string; label: string }[], id: string) =>
  list.find((item) => item.id === id)?.label ?? id

export const sectorLabel = (id: string) => findLabel(SECTORS, id)
export const provinceLabel = (id: string) => findLabel(PROVINCES, id)
export const statusLabel = (id: string) => findLabel(PROJECT_STATUSES, id)
/** « ODD 7 — Énergie propre et d’un coût abordable » */
export const sdgLabel = (id: string) => `ODD ${id} — ${SDGS.find((s) => s.id === id)?.fr ?? ''}`

const integer = new Intl.NumberFormat('fr-FR')
const compact = new Intl.NumberFormat('fr-FR', { notation: 'compact', maximumFractionDigits: 1 })

export const formatInteger = (value: number) => integer.format(value)

/** Montant abrégé : « 12,5 M USD », « 1,2 Md USD ». */
export const formatAmountShort = (amount: number, currency: Currency) => `${compact.format(amount)} ${currency}`

/** Montant exact : « 12 500 000 USD ». */
export const formatAmountFull = (amount: number, currency: Currency) => `${integer.format(Math.round(amount))} ${currency}`

/** « 0 projet », « 1 projet », « 2 projets » (règle française : pluriel à partir de 2). */
export const countLabel = (value: number, one: string, many: string) =>
  `${formatInteger(value)} ${value >= 2 ? many : one}`

// Dates saisies à Kinshasa : affichées dans ce fuseau pour ne jamais décaler un mois ou un jour.
const monthYear = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'Africa/Kinshasa' })
const fullDate = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Africa/Kinshasa',
})

export const formatMonth = (iso: string) => monthYear.format(new Date(iso))
export const formatDate = (iso: string) => fullDate.format(new Date(iso))

export function formatPeriod(project: Pick<Project, 'periodStart' | 'periodEnd'>) {
  const { periodStart, periodEnd } = project
  if (periodStart && periodEnd) return `${formatMonth(periodStart)} – ${formatMonth(periodEnd)}`
  if (periodStart) return `depuis ${formatMonth(periodStart)}`
  if (periodEnd) return `jusqu’en ${formatMonth(periodEnd)}`
  return null
}

/** Totaux des montants publiés, par devise (jamais convertis d'une devise à l'autre). */
export function fundingTotals(projects: Project[]) {
  const byCurrency: Record<Currency, number> = { USD: 0, CDF: 0, EUR: 0 }
  let withAmount = 0
  for (const p of projects) {
    if (!p.funding) continue
    byCurrency[p.funding.currency] += p.funding.amount
    withAmount += 1
  }
  return { byCurrency, withAmount }
}
