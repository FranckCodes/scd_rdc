import React from 'react'

import { SDGS, sdgIcon, type SdgLocale } from '@scd/ui/reference'

// « La coopération au service des ODD » (accueil) : les 17 icônes officielles de l'ONU dans la langue
// de la page, chacune menant aux fiches de SCD-RDC DATA liées à cet objectif. Aucun chiffre ici :
// les comptes vivent sur DATA, à partir des seules fiches confirmées.
// Apparition au défilement et légère élévation au survol (voir styles.css) ; rien avec « Réduire les animations ».
export function SdgSection({
  locale,
  labels,
}: {
  locale: SdgLocale
  labels: { titleLight: string; titleBold: string; text: string; link: string }
}) {
  const dataUrl = (process.env.NEXT_PUBLIC_DATA_URL || 'http://localhost:3001').replace(/\/+$/, '')
  return (
    <section className="section section--alt" aria-labelledby="odd-title">
      <div className="container stack">
        <div className="section__head">
          <h2 className="h2" id="odd-title">
            {labels.titleLight}
            <strong>{labels.titleBold}</strong>
          </h2>
          <a className="btn btn--outline" href={`${dataUrl}/#odd-titre`}>
            {labels.link}
          </a>
        </div>
        <p className="text-muted">{labels.text}</p>
        <ul className="sdgs">
          {SDGS.map((sdg) => (
            <li key={sdg.id}>
              <a href={`${dataUrl}/?odd=${sdg.id}#odd-titre`} title={sdg[locale]}>
                {/* Icône officielle (ONU), non modifiée */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images${sdgIcon(sdg.id, locale)}`}
                  alt={`${locale === 'zh' ? '可持续发展目标' : locale === 'ar' ? 'الهدف' : locale === 'ru' ? 'ЦУР' : locale === 'en' ? 'SDG' : 'ODD'} ${sdg.id} — ${sdg[locale]}`}
                  width={160}
                  height={160}
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
