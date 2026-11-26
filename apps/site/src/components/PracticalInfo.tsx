import React from 'react'

import type { EventInfo } from '@/payload-types'
import { toLines } from '@/lib/lines'

// Lieu, accès, hôtels partenaires confirmés et assistance aux délégations (analyse, étape 3).
// Affiché sous « Infos pratiques » et « Délégations internationales » ; rien n'apparaît tant
// que l'information n'est pas saisie (et confirmée, pour le lieu et les hôtels).
export function PracticalInfo({
  event,
  labels,
}: {
  event: EventInfo
  labels: { hotels: string; access: string; address: string; assistance: string }
}) {
  const address = event.venueConfirmed ? event.venueAddress : null
  const access = event.venueConfirmed ? toLines(event.access) : []
  const hotels = (event.hotels ?? []).filter((h) => h.confirmed)
  const assistance = event.contact?.delegationsEmail
  if (!address && access.length === 0 && hotels.length === 0 && !assistance) return null

  return (
    <div className="container prose-wrap practical">
      {address && (
        <section>
          <h2>{labels.address}</h2>
          <p>
            {event.venue ? `${event.venue} · ` : ''}
            {address}
          </p>
        </section>
      )}
      {access.length > 0 && (
        <section>
          <h2>{labels.access}</h2>
          <ul>
            {access.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>
      )}
      {hotels.length > 0 && (
        <section>
          <h2>{labels.hotels}</h2>
          <ul className="hotels">
            {hotels.map((h, i) => (
              <li key={h.id ?? i}>
                {h.url ? (
                  <a href={h.url} target="_blank" rel="noopener noreferrer">
                    {h.name}
                  </a>
                ) : (
                  <strong>{h.name}</strong>
                )}
                {h.note && <span className="muted"> · {h.note}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
      {assistance && (
        <section>
          <h2>{labels.assistance}</h2>
          <a href={`mailto:${assistance}`}>{assistance}</a>
        </section>
      )}
    </div>
  )
}
