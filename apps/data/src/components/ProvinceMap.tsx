'use client'

import React, { useRef, useState } from 'react'

import type { ProvinceId } from '@scd/ui/reference'

import { dashboardHref, type Filters } from '../lib/filters'
import { countLabel, provinceLabel } from '../lib/format'
import { MAP_VIEWBOX, PROVINCE_PATHS } from '../lib/provinces-geo'
import { bucketLabel, buildBuckets, levelFor } from '../lib/scale'
import { isPlainClick, useDashboardNav } from './DashboardNav'

// Carte des 26 provinces (animations, phase 4).
// - Survol ou focus : la province se colore (150 ms) et une info-bulle apparaît en fondu.
// - Sélection : zoom doux sur la province (400 ms), les autres s'estompent ; la liste se filtre.
// - Clavier : la carte compte pour une seule tabulation ; les flèches parcourent les provinces
//   (ordre alphabétique), Entrée filtre. Chaque province est un vrai lien : tout marche sans JavaScript.
// - Les tracés sont importés ici (et non passés en props) : ils voyagent une seule fois,
//   dans un fichier JavaScript mis en cache, au lieu d'être recopiés dans chaque page.

const W = MAP_VIEWBOX.width
const H = MAP_VIEWBOX.height
const VIEWBOX = `0 0 ${W} ${H}`
const SHAPES = new Map(PROVINCE_PATHS.map((p) => [p.id, p]))

export type ProvinceStat = { count: number; funding: string | null }

/** Cadrage de la province choisie : elle occupe ~60 % de la carte, sans montrer de vide autour du pays. */
function zoomTo(box?: readonly [number, number, number, number]) {
  if (!box) return { scale: 1, x: 0, y: 0 }
  const [bx, by, bw, bh] = box
  const scale = Math.min(5, Math.max(1, Math.min((W * 0.62) / bw, (H * 0.62) / bh)))
  const x = Math.min(0, Math.max(W - scale * W, W / 2 - scale * (bx + bw / 2)))
  const y = Math.min(0, Math.max(H - scale * H, H / 2 - scale * (by + bh / 2)))
  return { scale, x, y }
}

/** Focus venu du clavier (et non d'un clic) : seul cas où l'info-bulle suit le focus. */
function isKeyboardFocus(element: Element) {
  try {
    return element.matches(':focus-visible')
  } catch {
    return true
  }
}

const KEY_STEPS: Record<string, number | 'first' | 'last' | undefined> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
  Home: 'first',
  End: 'last',
}

export function ProvinceMap({
  stats,
  selected,
  filters,
}: {
  stats: Record<string, ProvinceStat>
  selected?: string
  filters: Pick<Filters, 'secteur' | 'statut'>
}) {
  const { go, isPending } = useDashboardNav()
  // Liens <a> du SVG (React les type comme des liens HTML ; les deux ont focus())
  const links = useRef(new Map<string, HTMLAnchorElement>())
  const [hovered, setHovered] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)
  const [tipId, setTipId] = useState<string | null>(null) // dernière info-bulle, conservée pour son fondu de sortie
  const [tabStop, setTabStop] = useState(selected ?? PROVINCE_PATHS[0].id)
  const [previousSelected, setPreviousSelected] = useState(selected)
  if (selected !== previousSelected) {
    setPreviousSelected(selected)
    if (selected) setTabStop(selected)
  }

  const buckets = buildBuckets(Math.max(0, ...PROVINCE_PATHS.map((p) => stats[p.id]?.count ?? 0)))
  const selectedShape = selected ? SHAPES.get(selected) : undefined
  const zoom = zoomTo(selectedShape?.box)
  const active = hovered ?? focused
  const activeShape = active && active !== selected ? SHAPES.get(active) : undefined
  const resetHref = dashboardHref(filters)

  function show(id: string) {
    setTipId(id)
  }

  function navigate(event: React.MouseEvent, href: string) {
    if (!isPlainClick(event)) return
    event.preventDefault()
    setHovered(null)
    go(href)
  }

  function onKeyDown(event: React.KeyboardEvent<SVGSVGElement>) {
    const step = KEY_STEPS[event.key]
    if (step === undefined) return
    event.preventDefault()
    const count = PROVINCE_PATHS.length
    const index = PROVINCE_PATHS.findIndex((p) => p.id === tabStop)
    const next = step === 'first' ? 0 : step === 'last' ? count - 1 : (index + step + count) % count
    const id = PROVINCE_PATHS[next].id
    setTabStop(id)
    links.current.get(id)?.focus()
  }

  // Info-bulle ancrée au point intérieur de la province, en tenant compte du zoom.
  const tipShape = tipId ? SHAPES.get(tipId) : undefined
  const tipStat = tipId ? stats[tipId] : undefined
  const tipLeft = tipShape ? ((zoom.scale * tipShape.label[0] + zoom.x) / W) * 100 : 50
  const tipTop = tipShape ? ((zoom.scale * tipShape.label[1] + zoom.y) / H) * 100 : 50
  const selectedStat = selected ? stats[selected] : undefined

  return (
    <figure className="map" data-selected={selected ? 'true' : undefined} data-pending={isPending ? 'true' : undefined}>
      <div className="map__frame">
        <svg
          className="map__svg"
          viewBox={VIEWBOX}
          role="group"
          aria-labelledby="carte-titre"
          aria-describedby="carte-aide"
          onKeyDown={onKeyDown}
        >
          <g
            className="map__zoom"
            style={{ transform: `translate(${zoom.x.toFixed(1)}px, ${zoom.y.toFixed(1)}px) scale(${zoom.scale.toFixed(3)})` }}
          >
            {PROVINCE_PATHS.map((p) => {
              const count = stats[p.id]?.count ?? 0
              const isSelected = p.id === selected
              const href = dashboardHref({ ...filters, province: isSelected ? undefined : (p.id as ProvinceId) })
              return (
                <a
                  key={p.id}
                  ref={(el) => {
                    if (el) links.current.set(p.id, el)
                    else links.current.delete(p.id)
                  }}
                  href={href}
                  className="map__province"
                  data-level={levelFor(count, buckets)}
                  tabIndex={p.id === tabStop ? 0 : -1}
                  aria-current={isSelected ? 'true' : undefined}
                  aria-label={`${provinceLabel(p.id)} : ${countLabel(count, 'projet', 'projets')}`}
                  onClick={(event) => navigate(event, href)}
                  onPointerEnter={() => {
                    setHovered(p.id)
                    show(p.id)
                  }}
                  onPointerLeave={() => setHovered((current) => (current === p.id ? null : current))}
                  onFocus={(event) => {
                    setTabStop(p.id)
                    if (!isKeyboardFocus(event.currentTarget)) return
                    setFocused(p.id)
                    show(p.id)
                  }}
                  onBlur={() => setFocused((current) => (current === p.id ? null : current))}
                >
                  <path d={p.d} />
                </a>
              )
            })}
            {/* Contours tracés au-dessus des voisines (le SVG n'a pas de z-index) */}
            {selectedShape && <path className="map__outline map__outline--selected" d={selectedShape.d} />}
            {activeShape && <path className="map__outline" d={activeShape.d} />}
          </g>
        </svg>

        {selected && (
          <a className="map__reset" href={resetHref} onClick={(event) => navigate(event, resetHref)}>
            <span aria-hidden="true">←</span> Toute la RDC
          </a>
        )}

        <div
          className="map__tip"
          aria-hidden="true"
          data-visible={active && active === tipId ? 'true' : undefined}
          data-below={tipTop < 16 ? 'true' : undefined}
          style={{ left: `${Math.min(88, Math.max(12, tipLeft)).toFixed(2)}%`, top: `${tipTop.toFixed(2)}%` }}
        >
          {tipId && (
            <>
              <strong>{provinceLabel(tipId)}</strong>
              <span>{countLabel(tipStat?.count ?? 0, 'projet', 'projets')}</span>
              {tipStat?.funding && <span>{tipStat.funding}</span>}
            </>
          )}
        </div>
      </div>

      <figcaption className="map__caption">
        {selected && (
          <p className="map__selection" key={selected}>
            <strong>{provinceLabel(selected)}</strong> · {countLabel(selectedStat?.count ?? 0, 'projet', 'projets')}
            {selectedStat?.funding ? ` · ${selectedStat.funding}` : ''}
          </p>
        )}
        <div className="legend">
          <span className="legend__title">Nombre de projets</span>
          <ul className="legend__scale">
            <li>
              <span className="legend__swatch" data-level="0" />
              Aucun
            </li>
            {buckets.map((bucket) => (
              <li key={bucket.level}>
                <span className="legend__swatch" data-level={bucket.level} />
                {bucketLabel(bucket)}
              </li>
            ))}
          </ul>
        </div>
        <p className="map__credit">
          Fond de carte : <a href="https://www.geoboundaries.org/">geoBoundaries</a>, ©{' '}
          <a href="https://www.openstreetmap.org/copyright">contributeurs OpenStreetMap</a> (ODbL 1.0).
        </p>
        <p id="carte-aide" className="visually-hidden">
          Utilisez les flèches pour parcourir les provinces, puis Entrée pour afficher leurs projets.
        </p>
      </figcaption>
    </figure>
  )
}

/** Petite carte de situation (fiche projet, attente des données) : non interactive. */
export function ProvinceLocator({ province, label }: { province?: string; label: string }) {
  const shape = province ? SHAPES.get(province) : undefined
  return (
    <svg className="locator" viewBox={VIEWBOX} role="img" aria-label={label}>
      {PROVINCE_PATHS.map((p) => (
        <path key={p.id} d={p.d} data-active={p.id === province ? 'true' : undefined} />
      ))}
      {shape && <path className="locator__outline" d={shape.d} />}
    </svg>
  )
}
