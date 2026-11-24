import React from 'react'

export type Laureate = {
  name: string
  organisation?: string | null
  summary?: string | null
  photo?: { url: string; alt: string; width?: number | null; height?: number | null } | null
}

// Carte d'un trophée (animations, phase 5) : recto = catégorie, verso = lauréat.
// Le verso n'existe dans la page qu'une fois le lauréat dévoilé. La carte se retourne alors
// (rotation 3D de 700 ms, pure CSS) chez les visiteurs qui suivent la cérémonie en direct ;
// celles et ceux qui arrivent ensuite voient directement le lauréat.
export function TrophyCard({
  index,
  category,
  description,
  laureate,
  labels,
}: {
  index: number
  category: string
  description?: string | null
  laureate: Laureate | null
  labels: { pending: string; laureate: string }
}) {
  const revealed = Boolean(laureate)
  return (
    <li className="trophy" data-revealed={revealed ? 'true' : undefined}>
      <div className="trophy__inner">
        <div className="trophy__face trophy__face--front" aria-hidden={revealed ? 'true' : undefined}>
          <span className="trophy__num">{String(index + 1).padStart(2, '0')}</span>
          <h2 className="trophy__category">{category}</h2>
          {description && <p className="trophy__text">{description}</p>}
          <p className="trophy__pending">{labels.pending}</p>
        </div>
        {laureate && (
          <div className="trophy__face trophy__face--back">
            <h2 className="trophy__label">
              {labels.laureate} · {category}
            </h2>
            {laureate.photo && (
              // Photo de la médiathèque (adresse absolue) : balise simple, dimensions fixées pour éviter tout saut
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="trophy__photo"
                src={laureate.photo.url}
                alt={laureate.photo.alt}
                width={laureate.photo.width ?? 160}
                height={laureate.photo.height ?? 160}
                loading="lazy"
                decoding="async"
              />
            )}
            <p className="trophy__name">{laureate.name}</p>
            {laureate.organisation && <p className="trophy__org">{laureate.organisation}</p>}
            {laureate.summary && <p className="trophy__text">{laureate.summary}</p>}
          </div>
        )}
      </div>
    </li>
  )
}
