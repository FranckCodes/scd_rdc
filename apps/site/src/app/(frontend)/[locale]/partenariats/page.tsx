import Link from 'next/link'

import { Arrow } from '@/components/Arrow'
import { toLines } from '@/lib/lines'

import { notOrganiserWhere } from '@/components/Organisers'
import { PageHeader } from '@/components/PageHeader'
import { setup } from '@/lib/locale'

export default async function PartenariatsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, tp, payload } = await setup(params)
  const p = tp.partnerships
  const s2 = tp.step2
  const [partners, dossier, partnerPack, offers] = await Promise.all([
    // Partenaires confirmés ET dont le logo est autorisé (TDR §11 et §13).
    payload.find({
      collection: 'partners',
      limit: 100,
      sort: 'order',
      where: { and: [{ validationStatus: { equals: 'confirme' } }, { logoAuthorized: { equals: true } }, notOrganiserWhere] },
    }),
    payload.find({ collection: 'documents', locale, limit: 1, where: { kind: { equals: 'dossier' } } }),
    payload.find({ collection: 'documents', locale, limit: 1, where: { kind: { equals: 'dossier-partenariat' } } }),
    payload.findGlobal({ slug: 'offers', locale }),
  ])
  const offerKeys = ['institutionnel', 'ptf', 'sponsor', 'media'] as const

  return (
    <>
      <PageHeader title={p.title} intro={p.intro}>
        <div className="actions">
          <Link className="btn btn--yellow" href={`/${locale}/participer/partenaire`}>
            {p.cta}
          </Link>
          {dossier.docs[0]?.url && (
            <a className="btn btn--outline-light" href={dossier.docs[0].url} download>
              {dossier.docs[0].title}
            </a>
          )}
        </div>
      </PageHeader>
      <section className="section">
        <div className="container stack">
          <h2 className="h2">
            <strong>{p.whyTitle}</strong>
          </h2>
          <ul className="checklist">
            {p.why.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          <Link className="link-arrow" href={`/${locale}/pourquoi-participer`}>
            {s2.why} <Arrow />
          </Link>
        </div>
      </section>
      <section className="section section--alt" aria-labelledby="offres-titre">
        <div className="container stack">
          <div className="section__head">
            <h2 className="h2" id="offres-titre">
              <strong>{s2.offersTitle}</strong>
            </h2>
            {partnerPack.docs[0]?.url && (
              <a className="btn btn--navy" href={partnerPack.docs[0].url} download>
                {s2.dossierPartner}
              </a>
            )}
          </div>
          <ul className="offers">
            {offerKeys.map((key) => {
              const offer = offers[key]
              const benefits = offers.offersValidated ? toLines(offer?.benefits) : []
              const modalities = offers.offersValidated ? toLines(offer?.modalities) : []
              return (
                <li key={key} className="offer">
                  <h3 className="offer__title">{p.tiers[key]}</h3>
                  {offer?.audience && (
                    <p>
                      <strong>{s2.audience} : </strong>
                      {offer.audience}
                    </p>
                  )}
                  {benefits.length > 0 && (
                    <>
                      <h4>{s2.benefits}</h4>
                      <ul className="checklist">
                        {benefits.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {modalities.length > 0 && (
                    <>
                      <h4>{s2.modalities}</h4>
                      <ul className="checklist">
                        {modalities.map((m) => (
                          <li key={m}>{m}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {benefits.length === 0 && <p className="text-muted small">{s2.onRequest}</p>}
                  <Link className="btn btn--outline offer__cta" href={`/${locale}/participer/partenaire`}>
                    {p.cta}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
      <section className="section">
        <div className="container stack">
          <h2 className="h2">
            <strong>{p.current}</strong>
          </h2>
          {partners.docs.length === 0 ? (
            <div className="stack">
              <p className="text-muted">{p.empty}</p>
              <div>
                <Link className="btn btn--navy" href={`/${locale}/participer/partenaire`}>
                  {p.cta}
                </Link>
              </div>
            </div>
          ) : (
            <ul className="partners">
              {partners.docs.map((pt) => (
                <li key={pt.id}>{pt.name}</li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
