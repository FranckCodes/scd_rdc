'use client'

import React, { useEffect, useRef, useState } from 'react'

import { SDGS, sdgIcon, type SdgId } from '@scd/ui/reference'

import { dashboardHref, type Filters } from '../lib/filters'
import { countLabel } from '../lib/format'
import { isPlainClick, useDashboardNav } from './DashboardNav'

// Grille des 17 Objectifs de développement durable, sur le modèle de la carte des provinces.
// - Chaque tuile (icône officielle de l'ONU) indique le nombre de fiches confirmées liées à l'objectif ;
//   un clic filtre les fiches sans rechargement, un second clic retire le filtre.
// - Un objectif sans fiche reste visible mais grisé et n'est pas cliquable : rien n'est suggéré
//   qui ne soit pas déclaré par une institution.
// - Apparition en cascade au premier affichage (30 ms d'écart), légère élévation au survol ;
//   rien ne bouge avec « Réduire les animations ». Sans JavaScript, ce sont de simples liens.
export function SdgGrid({
  counts,
  selected,
  filters,
}: {
  counts: Record<string, number>
  selected?: SdgId
  filters: Omit<Partial<Filters>, 'odd' | 'page'>
}) {
  const { go, isPending } = useDashboardNav()
  const ref = useRef<HTMLUListElement>(null)
  const [reveal, setReveal] = useState<'armed' | 'play' | undefined>(undefined)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) return
    setReveal('armed')
    let timer = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        setReveal('play')
        timer = window.setTimeout(() => setReveal(undefined), 400 + SDGS.length * 30 + 100)
      },
      { threshold: 0.25 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <div className="sdg" data-selected={selected ? 'true' : undefined} data-pending={isPending ? 'true' : undefined}>
      <ul ref={ref} className="sdg__grid" data-reveal={reveal}>
        {SDGS.map((sdg, index) => {
          const count = counts[sdg.id] ?? 0
          const isSelected = selected === sdg.id
          const name = `ODD ${sdg.id} — ${sdg.fr}`
          const label = `${name} : ${countLabel(count, 'projet', 'projets')}`
          const icon = (
            // Icône officielle (ONU), non modifiée ; le texte est repris dans l'étiquette accessible
            // eslint-disable-next-line @next/next/no-img-element
            <img src={sdgIcon(sdg.id, 'fr')} alt="" width={160} height={160} loading="lazy" decoding="async" />
          )
          const badge = (
            <span className="sdg__count" aria-hidden="true">
              {count}
            </span>
          )
          return (
            <li key={sdg.id} style={{ '--i': index } as React.CSSProperties}>
              {count > 0 || isSelected ? (
                <a
                  className="sdg__tile"
                  href={dashboardHref({ ...filters, odd: isSelected ? undefined : sdg.id }, 'odd-titre')}
                  aria-current={isSelected ? 'true' : undefined}
                  aria-label={isSelected ? `${label} (filtre actif, cliquer pour le retirer)` : label}
                  title={name}
                  onClick={(event) => {
                    if (!isPlainClick(event)) return
                    event.preventDefault()
                    go(dashboardHref({ ...filters, odd: isSelected ? undefined : sdg.id }))
                  }}
                >
                  {icon}
                  {badge}
                </a>
              ) : (
                <span className="sdg__tile sdg__tile--empty" role="img" aria-label={label} title={`${name} : aucun projet`}>
                  {icon}
                </span>
              )}
            </li>
          )
        })}
      </ul>
      <p className="sdg__legend">
        Le chiffre indique le nombre de fiches liées à chaque objectif, selon la déclaration de l’institution porteuse.
        Une fiche peut contribuer à plusieurs objectifs. Icônes : Nations Unies.
      </p>
    </div>
  )
}
