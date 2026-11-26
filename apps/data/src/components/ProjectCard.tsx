import Link from 'next/link'

import { SDGS, sdgIcon } from '@scd/ui/reference'

import { formatAmountShort, formatDate, provinceLabel, sectorLabel, statusLabel } from '../lib/format'
import type { Project } from '../lib/projects'

// Carte d'une fiche projet dans la liste. Toute la carte est cliquable (lien étiré sur le titre).
export function ProjectCard({ project, demo }: { project: Project; demo: boolean }) {
  return (
    <article className="card">
      <p className="card__meta">
        {sectorLabel(project.sector)} · {provinceLabel(project.province)}
      </p>
      <h3 className="card__title">
        <Link href={`/projets/${project.slug}`} className="card__link">
          {project.title}
        </Link>
      </h3>
      <p className="card__institution">{project.institution}</p>
      {project.sdgs.length > 0 && (
        <ul className="card__sdgs" aria-label="Objectifs de développement durable">
          {SDGS.filter((s) => project.sdgs.includes(s.id)).map((s) => (
            <li key={s.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sdgIcon(s.id, 'fr')} alt={`ODD ${s.id} — ${s.fr}`} title={`ODD ${s.id} — ${s.fr}`} width={32} height={32} loading="lazy" decoding="async" />
            </li>
          ))}
        </ul>
      )}
      <div className="card__facts">
        <span className="chip" data-status={project.status}>
          {statusLabel(project.status)}
        </span>
        {project.funding ? (
          <span className="card__amount">{formatAmountShort(project.funding.amount, project.funding.currency)}</span>
        ) : (
          <span className="card__amount card__amount--none">Montant non publié</span>
        )}
      </div>
      <p className="card__source">
        {demo ? <span className="tag tag--demo">Illustration · fictif</span> : <span className="tag tag--ok">Fiche validée</span>}
        <span>Mise à jour le {formatDate(project.updatedOn)}</span>
      </p>
    </article>
  )
}
