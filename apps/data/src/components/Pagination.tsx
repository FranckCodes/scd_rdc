import Link from 'next/link'

import { dashboardHref, type Filters } from '../lib/filters'

// Pages de résultats : liens ordinaires (partageables), qui ramènent en haut de la liste.
export function Pagination({ filters, page, pageCount }: { filters: Filters; page: number; pageCount: number }) {
  if (pageCount <= 1) return null
  return (
    <nav className="pagination" aria-label="Pages de résultats">
      {page > 1 ? (
        <Link className="pagination__link" href={dashboardHref({ ...filters, page: page - 1 }, 'projets')} rel="prev">
          <span aria-hidden="true">←</span> Précédent
        </Link>
      ) : (
        <span />
      )}
      <span className="pagination__status">
        Page {page} sur {pageCount}
      </span>
      {page < pageCount ? (
        <Link className="pagination__link" href={dashboardHref({ ...filters, page: page + 1 }, 'projets')} rel="next">
          Suivant <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
