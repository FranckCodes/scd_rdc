import type { Metadata } from 'next'
import Link from 'next/link'

import { Arrow } from '@/components/Arrow'
import { PageHeader } from '@/components/PageHeader'
import { isLocale } from '@/i18n/config'
import { getPageDictionary } from '@/i18n/pages'
import { setup } from '@/lib/locale'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const s3 = getPageDictionary(locale).step3
  return { title: s3.coopTitle, description: s3.coopIntro }
}

// Espace « Partenaires et coopération internationale » (analyse, étape 3) : un accès par public,
// les pages « Pourquoi la RDC ? » et « Délégations internationales », et les coopérations à l'honneur
// (publiées seulement une fois confirmées, avec l'accord des pays concernés).
const FORMS = ['manifestation-interet', 'partenaire', 'manifestation-interet', 'exposant', 'contribution']

export default async function CooperationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, tp, payload } = await setup(params)
  const s3 = tp.step3
  const countries = await payload.find({
    collection: 'cooperations',
    locale,
    depth: 1,
    limit: 50,
    sort: 'order',
    overrideAccess: false,
  })

  return (
    <>
      <PageHeader title={s3.coopTitle} intro={s3.coopIntro}>
        <div className="actions">
          <Link className="btn btn--yellow" href={`/${locale}/pourquoi-la-rdc`}>
            {s3.whyRdc}
          </Link>
          <Link className="btn btn--outline-light" href={`/${locale}/delegations`}>
            {s3.delegations}
          </Link>
        </div>
      </PageHeader>
      <section className="section">
        <div className="container">
          <ul className="audiences">
            {s3.audiences.map((a, i) => (
              <li key={a.title} className="audience">
                <h2 className="audience__title">{a.title}</h2>
                <p className="text-muted">{a.text}</p>
                <Link className="link-arrow" href={`/${locale}/participer/${FORMS[i]}`}>
                  {a.action} <Arrow />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      {countries.docs.length > 0 && (
        <section className="section section--alt" aria-labelledby="pays-titre">
          <div className="container stack">
            <h2 className="h2" id="pays-titre">
              <strong>{s3.countries}</strong>
            </h2>
            <ul className="cards">
              {countries.docs.map((c) => {
                const photo = c.photo && typeof c.photo === 'object' && c.photo.url ? c.photo : null
                return (
                  <li key={c.id} className="card">
                    {photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="card__img" src={photo.url!} alt={photo.alt ?? ''} loading="lazy" />
                    )}
                    <span className="card__title">{c.name}</span>
                    {c.summary && <span className="card__text">{c.summary}</span>}
                    {c.source && (
                      <span className="small muted">
                        {s3.source} : {c.source}
                      </span>
                    )}
                    {c.url && (
                      <a className="small" href={c.url} rel="noopener noreferrer" target="_blank">
                        {c.url.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
