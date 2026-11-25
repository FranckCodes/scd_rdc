import { getPayload, type Where } from 'payload'
import React from 'react'

import config from '@payload-config'

// Catégorie « Organisateur » de la rubrique Partenaires : réservée au bandeau « Organisé par ».
export const organiserWhere: Where = { tier: { equals: 'organisateur' } }
// Listes de partenaires : tout sauf les organisateurs (y compris les fiches sans catégorie).
export const notOrganiserWhere: Where = {
  or: [{ tier: { not_equals: 'organisateur' } }, { tier: { exists: false } }],
}

// « Organisé par » (accueil et À propos) : organisateurs confirmés, dans l'ordre d'affichage.
// Le logo n'apparaît que s'il est chargé ET autorisé (TDR §13) ; sinon le nom s'affiche.
export async function Organisers({ title, empty, alt = false }: { title: string; empty: string; alt?: boolean }) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'partners',
    depth: 1,
    limit: 20,
    sort: 'order',
    where: { and: [organiserWhere, { validationStatus: { equals: 'confirme' } }] },
  })

  return (
    <section className={alt ? 'section section--alt' : 'section'} aria-labelledby="organisers-title">
      <div className="container stack">
        <h2 className="h2" id="organisers-title">
          <strong>{title}</strong>
        </h2>
        {docs.length === 0 ? (
          <p className="placeholder">{empty}</p>
        ) : (
          <ul className="organisers">
            {docs.map((o) => {
              const logo = o.logoAuthorized && o.logo && typeof o.logo === 'object' && o.logo.url ? o.logo : null
              const content = logo ? (
                // Logo de la médiathèque (adresse locale ou Vercel Blob) : balise simple
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo.url!} alt={o.name} width={logo.width ?? 240} height={logo.height ?? 96} loading="lazy" decoding="async" />
              ) : (
                <span className="organisers__name">{o.name}</span>
              )
              return (
                <li key={o.id}>
                  {o.url ? (
                    <a href={o.url} target="_blank" rel="noopener noreferrer">
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
