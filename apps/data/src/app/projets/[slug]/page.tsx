import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type React from 'react'

import { SDGS, sdgIcon } from '@scd/ui/reference'

import { ProvinceLocator } from '../../../components/ProvinceMap'
import {
  formatAmountFull,
  formatDate,
  formatPeriod,
  provinceLabel,
  sectorLabel,
  statusLabel,
} from '../../../lib/format'
import { getProjects } from '../../../lib/projects'

// Fiche projet (TDR §9) : tous les champs publiables, la source, la date de mise à jour
// et le statut de validation. Régénérée au plus toutes les 5 minutes.
export const revalidate = 300

type Params = { params: Promise<{ slug: string }> }

async function findProject(slug: string) {
  const { mode, projects } = await getProjects()
  return { demo: mode === 'demo', project: projects.find((p) => p.slug === slug) }
}

export async function generateStaticParams() {
  const { projects } = await getProjects()
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { project } = await findProject((await params).slug)
  // Appelé ici aussi : pour les robots d'indexation, les métadonnées sont résolues avant l'envoi de la page,
  // ce qui permet de répondre un vrai 404 (les navigateurs reçoivent la page « introuvable » en noindex).
  if (!project) notFound()
  return { title: project.title, description: project.summary }
}

export default async function ProjectPage({ params }: Params) {
  const { demo, project } = await findProject((await params).slug)
  if (!project) notFound()

  const period = formatPeriod(project)
  const province = provinceLabel(project.province)
  const facts: [string, React.ReactNode][] = [
    [
      'Avancement',
      <span key="status" className="chip" data-status={project.status}>
        {statusLabel(project.status)}
      </span>,
    ],
    ['Période', period ?? 'Non précisée'],
    ['Localisation', project.location ? `${province} · ${project.location}` : province],
    ['Population cible', project.targetPopulation ?? 'Non précisée'],
    [
      'Montant',
      project.funding ? (
        <span key="amount" className="facts__amount">
          {formatAmountFull(project.funding.amount, project.funding.currency)}
        </span>
      ) : (
        'Non publié'
      ),
    ],
  ]
  if (project.funding) facts.push(['Source de financement', project.funding.source ?? 'Non précisée'])
  if (project.partners) facts.push(['Partenaires', project.partners])
  if (project.supervision) facts.push(['Tutelle', project.supervision])

  return (
    <article className="fiche">
      <p className="back">
        <Link href="/">
          <span aria-hidden="true">←</span> Tous les projets
        </Link>
      </p>

      <header className="fiche__head">
        <span className="eyebrow">
          {sectorLabel(project.sector)} · {province}
        </span>
        <h1>{project.title}</h1>
        <p className="fiche__institution">{project.institution}</p>
        <p className="fiche__badges">
          {demo ? <span className="tag tag--demo">Fiche fictive</span> : <span className="tag tag--ok">Fiche validée</span>}
          <span>Mise à jour le {formatDate(project.updatedOn)}</span>
        </p>
      </header>

      <div className="fiche__grid">
        <div className="fiche__main">
          <section className="panel" aria-labelledby="resume-titre">
            <h2 id="resume-titre">Résumé</h2>
            <p className="prose">{project.summary}</p>
          </section>
          {project.sdgs.length > 0 && (
            <section className="panel" aria-labelledby="odd-fiche-titre">
              <h2 id="odd-fiche-titre">Objectifs de développement durable</h2>
              <ul className="fiche__sdgs">
                {SDGS.filter((s) => project.sdgs.includes(s.id)).map((s) => (
                  <li key={s.id}>
                    <a href={`/?odd=${s.id}#odd-titre`} title="Voir toutes les fiches liées à cet objectif">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={sdgIcon(s.id, 'fr')} alt="" width={88} height={88} loading="lazy" decoding="async" />
                      <span>
                        <strong>ODD {s.id}</strong> {s.fr}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {project.objectives && (
            <section className="panel" aria-labelledby="objectifs-titre">
              <h2 id="objectifs-titre">Objectifs</h2>
              <p className="prose">{project.objectives}</p>
            </section>
          )}
          <section className="panel" aria-labelledby="resultats-titre">
            <h2 id="resultats-titre">Résultats et indicateurs</h2>
            {project.results.length ? (
              <div className="table-scroll">
                <table className="results">
                  <thead>
                    <tr>
                      <th scope="col">Indicateur</th>
                      <th scope="col">Valeur</th>
                      <th scope="col">Période</th>
                      <th scope="col">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.results.map((result, i) => (
                      <tr key={`${result.indicator}-${i}`}>
                        <th scope="row">{result.indicator}</th>
                        <td>{result.value}</td>
                        <td>{result.period ?? '—'}</td>
                        <td>{result.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="muted">Aucun résultat publié pour le moment.</p>
            )}
          </section>
        </div>

        <aside className="fiche__aside" aria-label="Informations clés">
          <div className="panel">
            <dl className="facts">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="panel locator-panel">
            <ProvinceLocator province={project.province} label={`Carte de situation : ${province}`} />
            <p className="muted small">{province}</p>
          </div>
          <p className="fiche__source">
            Source de la fiche : {project.dataSource}. Statut : {demo ? 'fiche fictive (démonstration)' : 'confirmé'}.
          </p>
        </aside>
      </div>
    </article>
  )
}
