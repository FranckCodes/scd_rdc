import type React from 'react'

import { ChartReveal } from './ChartReveal'

export type BarRow = { id: string; label: string; value: number; display: string }

// Graphique en barres horizontales, lisible sans JavaScript ni couleurs : chaque ligne donne
// son libellé et sa valeur en texte ; la barre n'est qu'un repère visuel (masqué aux lecteurs d'écran).
// La longueur est portée par --v (0 à 1) et dessinée avec transform: scaleX, seule propriété animée.
export function BarChart({ title, rows }: { title: string; rows: BarRow[] }) {
  const max = Math.max(0, ...rows.map((row) => row.value))
  return (
    <figure className="chart">
      <figcaption className="chart__title">{title}</figcaption>
      <ChartReveal rows={rows.length}>
        <ul className="chart__rows">
          {rows.map((row, i) => (
            <li
              key={row.id}
              className="chart__row"
              style={{ '--v': max ? (row.value / max).toFixed(4) : '0', '--i': i } as React.CSSProperties}
            >
              <span className="chart__label">{row.label}</span>
              <span className="chart__track" aria-hidden="true">
                <span className="chart__fill" />
              </span>
              <span className="chart__value">{row.display}</span>
            </li>
          ))}
        </ul>
      </ChartReveal>
    </figure>
  )
}
