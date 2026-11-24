import { SECTORS, type ProjectStatusId, type ProvinceId, type SectorId } from '@scd/ui/reference'

import type { Currency, Project } from './projects'

// ⚠ DÉMONSTRATION LOCALE UNIQUEMENT (voir isDemo dans projects.ts).
// Projets 100 % FICTIFS : intitulés, institutions, montants et résultats sont inventés pour tester
// l'interface et ses animations. Ils ne décrivent aucun projet réel et ne sont jamais publiés en ligne.

const ACTIVITIES: Record<SectorId, string[]> = {
  infrastructures: ['Réhabilitation de routes de desserte agricole', 'Construction d’un pont', 'Aménagement de la voirie urbaine'],
  energie: ['Mini-réseau solaire', 'Électrification rurale', 'Petite centrale hydroélectrique'],
  'capital-humain': ['Formation professionnelle des jeunes', 'Construction d’écoles primaires', 'Alphabétisation des adultes'],
  climat: ['Reboisement communautaire', 'Gestion durable des forêts', 'Adaptation aux inondations'],
  agriculture: ['Appui aux coopératives agricoles', 'Filière manioc', 'Irrigation de petits périmètres'],
  industrie: ['Appui aux PME de transformation', 'Zone d’activités artisanales', 'Atelier de transformation du café'],
  sante: ['Renforcement des centres de santé', 'Vaccination de routine', 'Santé maternelle et infantile'],
  territoires: ['Appui à la décentralisation', 'Modernisation de l’état civil', 'Plan local d’aménagement'],
  culture: ['Valorisation du patrimoine', 'Industries culturelles et créatives', 'Centre culturel communautaire'],
}

// Répartition volontairement inégale (et 9 provinces sans projet) pour voir toutes les teintes de la carte.
const PLAN: [ProvinceId, number][] = [
  ['kinshasa', 6],
  ['nord-kivu', 4],
  ['sud-kivu', 4],
  ['haut-katanga', 4],
  ['kongo-central', 3],
  ['ituri', 3],
  ['kasai-central', 2],
  ['tshopo', 2],
  ['equateur', 2],
  ['lualaba', 2],
  ['kwilu', 2],
  ['kasai-oriental', 1],
  ['maniema', 1],
  ['tanganyika', 1],
  ['mai-ndombe', 1],
  ['sankuru', 1],
  ['haut-uele', 1],
]

const STATUS_POOL: ProjectStatusId[] = [
  'annonce',
  'en-preparation',
  'finance',
  'en-execution',
  'en-execution',
  'en-execution',
  'acheve',
  'cloture',
]

// Générateur pseudo-aléatoire à graine fixe : la démonstration est identique à chaque lancement.
function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function buildDemoProjects(): Project[] {
  const rand = seeded(2027)
  const pick = <T,>(list: readonly T[]) => list[Math.floor(rand() * list.length)]
  const provinces = PLAN.flatMap(([province, count]) => Array.from({ length: count }, () => province))

  return provinces.map((province, index) => {
    const n = String(index + 1).padStart(2, '0')
    const sector = pick(SECTORS).id
    const startYear = 2022 + Math.floor(rand() * 4)
    const startMonth = 1 + Math.floor(rand() * 12)
    const duration = 2 + Math.floor(rand() * 4)
    const hasFunding = rand() < 0.75
    const amount = Math.round((0.4 + rand() * rand() * 80) * 10) * 100_000
    const currency: Currency = index % 13 === 5 ? 'EUR' : 'USD'
    const updatedMonth = rand() < 0.5 ? 10 : 11
    const updatedDay = 1 + Math.floor(rand() * 20)

    return {
      slug: `demo-${n}`,
      title: `Projet fictif ${n} · ${pick(ACTIVITIES[sector])}`,
      summary:
        'Fiche fictive créée pour la démonstration locale de SCD-RDC DATA. Elle ne décrit aucun projet réel ; ' +
        'elle sert uniquement à vérifier l’affichage des fiches, des filtres, de la carte et des graphiques.',
      institution: `Institution fictive ${pick(['A', 'B', 'C', 'D', 'E', 'F'])}`,
      partners: rand() < 0.6 ? `Partenaire fictif ${1 + Math.floor(rand() * 5)}` : null,
      supervision: rand() < 0.5 ? 'Ministère fictif de tutelle' : null,
      sector,
      province,
      location: rand() < 0.5 ? 'Territoire fictif' : null,
      objectives: 'Objectifs fictifs : illustrer la présentation d’une fiche complète (TDR §9).',
      periodStart: `${startYear}-${String(startMonth).padStart(2, '0')}-01T12:00:00.000Z`,
      periodEnd: `${startYear + duration}-${String(startMonth).padStart(2, '0')}-01T12:00:00.000Z`,
      targetPopulation: rand() < 0.7 ? `${(1 + Math.floor(rand() * 40)) * 5} 000 personnes (fictif)` : null,
      status: pick(STATUS_POOL),
      funding: hasFunding ? { amount, currency, source: `Bailleur fictif ${pick(['A', 'B', 'C'])}` } : null,
      results:
        rand() < 0.6
          ? [
              { indicator: 'Indicateur fictif 1', value: String(10 + Math.floor(rand() * 90)), period: '2026', source: 'Démonstration' },
              { indicator: 'Indicateur fictif 2', value: `${Math.floor(rand() * 100)} %`, period: null, source: 'Démonstration' },
            ]
          : [],
      dataSource: 'Jeu de démonstration (fictif)',
      updatedOn: `2026-${updatedMonth}-${String(updatedDay).padStart(2, '0')}T12:00:00.000Z`,
    }
  })
}

export const DEMO_PROJECTS: Project[] = buildDemoProjects()
