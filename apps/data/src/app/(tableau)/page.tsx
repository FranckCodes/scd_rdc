import { ViewTransition } from 'react'

import { PROJECT_STATUSES, PROVINCES, SDGS, SECTORS } from '@scd/ui/reference'

import { AnimatedNumber } from '../../components/AnimatedNumber'
import { BarChart, type BarRow } from '../../components/BarChart'
import { DashboardNav } from '../../components/DashboardNav'
import { Filters } from '../../components/Filters'
import { FingerprintRings } from '../../components/FingerprintRings'
import { Pagination } from '../../components/Pagination'
import { ProjectCard } from '../../components/ProjectCard'
import { ProvinceLocator, ProvinceMap, type ProvinceStat } from '../../components/ProvinceMap'
import { SdgGrid } from '../../components/SdgGrid'
import { applyFilters, PAGE_SIZE, parseFilters, type SearchParams } from '../../lib/filters'
import {
  countLabel,
  formatAmountShort,
  formatInteger,
  fundingTotals,
  provinceLabel,
  sdgLabel,
  sectorLabel,
  statusLabel,
} from '../../lib/format'
import { getProjects, type Project } from '../../lib/projects'

// Champs minimaux d'une fiche projet (TDR §9).
const FICHE_FIELDS = [
  'Intitulé et résumé public',
  'Institution porteuse, partenaires, tutelle',
  'Secteur, province / territoire, ODD concernés',
  'Objectifs, période, population cible',
  'Montant et source (si validés et publiables)',
  'Statut : annoncé → clôturé',
  'Résultats et indicateurs',
  'Source, date de mise à jour, statut de validation',
]

/** « 120 M USD publiés », « 40 M USD + 3 M EUR publiés » (devises jamais converties) */
function publishedFunding(projects: Project[]) {
  const { byCurrency } = fundingTotals(projects)
  const parts = (['USD', 'EUR', 'CDF'] as const)
    .filter((currency) => byCurrency[currency] > 0)
    .map((currency) => formatAmountShort(byCurrency[currency], currency))
  return parts.length ? `${parts.join(' + ')} publiés` : null
}

function Intro() {
  return (
    <section className="intro">
      <FingerprintRings id="intro-rings" className="intro__rings" />
      <span className="eyebrow">SCD-RDC DATA · Version pilote</span>
      <h1>
        Qui finance quoi, où, <strong>pour qui ?</strong>
      </h1>
      <p>
        Le portefeuille de la coopération au développement en RDC, province par province. Seules les fiches validées
        par les institutions sources sont publiées.
      </p>
    </section>
  )
}

function Method() {
  return (
    <section className="method" aria-labelledby="methode-titre">
      <h2 id="methode-titre">Comment lire ces données</h2>
      <ul>
        <li>
          Une fiche n’est publiée qu’après validation par l’institution qui l’a fournie. Elle indique toujours sa source
          et sa date de mise à jour.
        </li>
        <li>
          Les montants n’apparaissent que si l’institution les a déclarés publiables. Ils restent dans leur devise
          d’origine, sans conversion.
        </li>
        <li>La carte compte les projets selon leur province de rattachement (26 provinces, découpage de 2015).</li>
        <li>
          Les objectifs de développement durable (ODD) d’une fiche sont ceux que déclare l’institution porteuse ; une
          fiche peut en compter plusieurs.
        </li>
      </ul>
    </section>
  )
}

export default async function DataHome({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const filters = parseFilters(await searchParams)
  const { mode, projects } = await getProjects()

  // Version pilote : tant qu'aucune fiche n'est validée (ou si l'API du site ne répond pas), rien
  // d'inventé ni d'alarmant : on explique ce qui sera publié et comment.
  if (mode === 'unavailable' || projects.length === 0) {
    return (
      <>
        <Intro />
        <section className="panel collecting" aria-labelledby="collecte-titre">
          <div className="collecting__text">
            <span className="eyebrow eyebrow--navy">Version pilote · données en cours de validation</span>
            <h2 id="collecte-titre">Les premières fiches arrivent</h2>
            <p>
              {mode === 'unavailable' ? '' : 'Aucune fiche n’a encore été validée. '}Les fiches sont publiées au fur et à
              mesure de leur validation par les institutions porteuses ; chaque province se colorera alors sur la carte.
            </p>
            {mode === 'unavailable' && (
              <p className="collecting__retry">Si vous cherchez une fiche déjà publiée, merci de réessayer dans quelques minutes.</p>
            )}
            <h3>Contenu d’une fiche projet</h3>
            <ul className="fields">
              {FICHE_FIELDS.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </div>
          <ProvinceLocator label="Carte des 26 provinces de la République démocratique du Congo" />
        </section>
        <Method />
      </>
    )
  }

  const demo = mode === 'demo'
  const filtered = applyFilters(projects, filters)
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(filters.page, pageCount)
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const summary = countLabel(filtered.length, 'projet', 'projets')

  // La carte montre toutes les provinces pour les autres filtres (secteur, avancement)
  const onMap = applyFilters(projects, filters, 'province')
  const stats: Record<string, ProvinceStat> = {}
  for (const province of PROVINCES) {
    const inProvince = onMap.filter((p) => p.province === province.id)
    if (inProvince.length) stats[province.id] = { count: inProvince.length, funding: publishedFunding(inProvince) }
  }

  // La grille ODD montre tous les objectifs pour les autres filtres (secteur, province, avancement)
  const forSdgs = applyFilters(projects, filters, 'odd')
  const sdgCounts: Record<string, number> = {}
  for (const sdg of SDGS) sdgCounts[sdg.id] = forSdgs.filter((p) => p.sdgs.includes(sdg.id)).length

  const funding = fundingTotals(filtered)
  const otherCurrencies = (['EUR', 'CDF'] as const)
    .filter((currency) => funding.byCurrency[currency] > 0)
    .map((currency) => formatAmountShort(funding.byCurrency[currency], currency))
  const provincesCovered = new Set(filtered.map((p) => p.province)).size
  const sectorsCovered = new Set(filtered.map((p) => p.sector)).size
  const activeFilters = [
    filters.secteur && sectorLabel(filters.secteur),
    filters.province && provinceLabel(filters.province),
    filters.odd && `ODD ${filters.odd}`,
    filters.statut && statusLabel(filters.statut),
  ]
    .filter(Boolean)
    .join(' · ')

  const countRows = (list: readonly { id: string; label: string }[], key: 'sector' | 'status'): BarRow[] =>
    list.map((item) => {
      const value = filtered.filter((p) => p[key] === item.id).length
      return { id: item.id, label: item.label, value, display: formatInteger(value) }
    })
  const fundingRows: BarRow[] = SECTORS.map((sector) => {
    const value = fundingTotals(filtered.filter((p) => p.sector === sector.id)).byCurrency.USD
    return { id: sector.id, label: sector.label, value, display: value ? formatAmountShort(value, 'USD') : '—' }
  })
  const hasUsdFunding = fundingTotals(projects).byCurrency.USD > 0

  return (
    <>
      <Intro />
      <DashboardNav summary={summary}>
        <section className="panel" aria-label="Filtres">
          <Filters values={{ secteur: filters.secteur, province: filters.province, odd: filters.odd, statut: filters.statut }} />
        </section>

        <dl className="totals">
          <div className="total">
            <dt>Projets</dt>
            <dd>
              <AnimatedNumber value={filtered.length} text={formatInteger(filtered.length)} />
              <span className="total__note">{activeFilters || 'Toutes les fiches publiées'}</span>
            </dd>
          </div>
          <div className="total">
            <dt>Provinces couvertes</dt>
            <dd>
              <AnimatedNumber value={provincesCovered} text={formatInteger(provincesCovered)} />{' '}
              <span className="total__of">sur 26</span>
            </dd>
          </div>
          <div className="total">
            <dt>Secteurs</dt>
            <dd>
              <AnimatedNumber value={sectorsCovered} text={formatInteger(sectorsCovered)} />{' '}
              <span className="total__of">sur 9</span>
            </dd>
          </div>
          <div className="total total--amount">
            <dt>Financements publiés</dt>
            <dd>
              <AnimatedNumber
                value={funding.byCurrency.USD}
                text={formatAmountShort(funding.byCurrency.USD, 'USD')}
                format="compact"
                suffix=" USD"
              />
              <span className="total__note">
                {countLabel(funding.withAmount, 'fiche', 'fiches')} avec montant publié
                {otherCurrencies.length ? `, plus ${otherCurrencies.join(' et ')} non convertis` : ''}
              </span>
            </dd>
          </div>
        </dl>

        <div className="overview">
          <section className="panel" aria-labelledby="carte-titre">
            <h2 id="carte-titre" className="panel__title">
              Projets par province
            </h2>
            <ProvinceMap
              stats={stats}
              selected={filters.province}
              filters={{ secteur: filters.secteur, statut: filters.statut, odd: filters.odd }}
            />
          </section>
          <div className="overview__charts">
            <div className="panel">
              <BarChart title="Projets par secteur" rows={countRows(SECTORS, 'sector')} />
            </div>
            <div className="panel">
              <BarChart title="Avancement des projets" rows={countRows(PROJECT_STATUSES, 'status')} />
            </div>
          </div>
        </div>

        <section className="panel" aria-labelledby="odd-titre">
          <div className="panel__head">
            <h2 id="odd-titre" className="panel__title">
              Projets par objectif de développement durable
            </h2>
            {filters.odd && <p className="panel__note">{sdgLabel(filters.odd)}</p>}
          </div>
          <SdgGrid
            counts={sdgCounts}
            selected={filters.odd}
            filters={{ secteur: filters.secteur, province: filters.province, statut: filters.statut }}
          />
        </section>

        {hasUsdFunding && (
          <div className="panel">
            <BarChart title="Financements publiés par secteur (USD)" rows={fundingRows} />
          </div>
        )}

        <section id="projets" className="projects" aria-labelledby="projets-titre">
          <div className="projects__head">
            <h2 id="projets-titre">Fiches projets</h2>
            <p>
              {summary}
              {pageCount > 1 ? ` · page ${page} sur ${pageCount}` : ''} · les plus récentes d’abord
            </p>
          </div>
          {items.length ? (
            <ul className="cards">
              {/* Chaque fiche a sa propre View Transition : celles qui restent glissent à leur nouvelle place,
                  les nouvelles apparaissent en fondu, les autres s'effacent. */}
              {items.map((project) => (
                <ViewTransition key={project.slug} enter="card-enter" exit="card-exit" update="card-move" default="none">
                  <li className="cards__item">
                    <ProjectCard project={project} demo={demo} />
                  </li>
                </ViewTransition>
              ))}
            </ul>
          ) : (
            <p className="empty">Aucun projet ne correspond à ces filtres.</p>
          )}
          <Pagination filters={filters} page={page} pageCount={pageCount} />
        </section>
      </DashboardNav>
      <Method />
    </>
  )
}
