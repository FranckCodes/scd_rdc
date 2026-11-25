import Link from 'next/link'

import { notOrganiserWhere } from '@/components/Organisers'
import { PageHeader } from '@/components/PageHeader'
import { setup } from '@/lib/locale'

export default async function PartenariatsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, tp, payload } = await setup(params)
  const p = tp.partnerships
  const [partners, dossier] = await Promise.all([
    // Partenaires confirmés ET dont le logo est autorisé (TDR §11 et §13).
    payload.find({
      collection: 'partners',
      limit: 100,
      sort: 'order',
      where: { and: [{ validationStatus: { equals: 'confirme' } }, { logoAuthorized: { equals: true } }, notOrganiserWhere] },
    }),
    payload.find({ collection: 'documents', locale, limit: 1, where: { kind: { equals: 'dossier' } } }),
  ])

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
        <div className="container split split--top">
          <div className="stack">
            <h2 className="h2">
              <strong>{p.whyTitle}</strong>
            </h2>
            <ul className="checklist">
              {p.why.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
          <div className="stack">
            <h2 className="h2">
              <strong>{p.tiersTitle}</strong>
            </h2>
            <ul className="tiers">
              {Object.entries(p.tiers).map(([k, label]) => (
                <li key={k}>{label}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="section section--alt">
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
