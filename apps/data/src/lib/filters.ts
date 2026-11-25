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

import type { Project } from './projects'

// Filtres du tableau de bord, portés par l'adresse (?secteur=…&province=…&odd=…&statut=…&page=…) :
// une vue filtrée se partage par simple lien et fonctionne sans JavaScript.

export const PAGE_SIZE = 12

export type Filters = { secteur?: SectorId; province?: ProvinceId; odd?: SdgId; statut?: ProjectStatusId; page: number }

export type SearchParams = Record<string, string | string[] | undefined>

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

function pick<T extends string>(value: string | string[] | undefined, allowed: readonly { id: T }[]) {
  const wanted = first(value)
  return allowed.find((item) => item.id === wanted)?.id
}

export function parseFilters(searchParams: SearchParams): Filters {
  const page = Number(first(searchParams.page))
  return {
    secteur: pick(searchParams.secteur, SECTORS),
    province: pick(searchParams.province, PROVINCES),
    odd: pick(searchParams.odd, SDGS),
    statut: pick(searchParams.statut, PROJECT_STATUSES),
    page: Number.isInteger(page) && page > 1 ? page : 1,
  }
}

/** Applique les filtres ; `ignore` sert à la carte (toutes les provinces) et à la grille ODD (tous les objectifs). */
export function applyFilters(projects: Project[], filters: Partial<Filters>, ignore?: 'province' | 'odd') {
  return projects.filter(
    (p) =>
      (!filters.secteur || p.sector === filters.secteur) &&
      (!filters.statut || p.status === filters.statut) &&
      (ignore === 'province' || !filters.province || p.province === filters.province) &&
      (ignore === 'odd' || !filters.odd || p.sdgs.includes(filters.odd)),
  )
}

/** Adresse du tableau de bord pour un jeu de filtres (la page 1 n'apparaît pas dans l'adresse). */
export function dashboardHref(filters: Partial<Filters>, hash?: string) {
  const params = new URLSearchParams()
  if (filters.secteur) params.set('secteur', filters.secteur)
  if (filters.province) params.set('province', filters.province)
  if (filters.odd) params.set('odd', filters.odd)
  if (filters.statut) params.set('statut', filters.statut)
  if (filters.page && filters.page > 1) params.set('page', String(filters.page))
  const query = params.toString()
  return `/${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`
}
