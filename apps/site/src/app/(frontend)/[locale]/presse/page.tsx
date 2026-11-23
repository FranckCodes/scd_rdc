import Link from 'next/link'

import { PageHeader } from '@/components/PageHeader'
import { setup } from '@/lib/locale'

export default async function PressePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, tp, payload } = await setup(params)
  const pr = tp.press
  const [releases, kit, event] = await Promise.all([
    payload.find({
      collection: 'news',
      locale,
      limit: 20,
      sort: '-publishedAt',
      where: { and: [{ _status: { equals: 'published' } }, { category: { in: ['communique', 'presse'] } }] },
    }),
    payload.find({ collection: 'documents', locale, limit: 20, where: { kind: { in: ['kit-presse', 'communique'] } } }),
    payload.findGlobal({ slug: 'event-info', locale }),
  ])
  const formatDate = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
      <PageHeader title={pr.title} intro={pr.intro}>
        <div className="actions">
          <Link className="btn btn--yellow" href={`/${locale}/participer/accreditation-presse`}>
            {tp.participate.forms['accreditation-presse'].title}
          </Link>
        </div>
      </PageHeader>
      <section className="section">
        <div className="container split split--top">
          <div className="stack">
            <h2 className="h2">
              <strong>{pr.releases}</strong>
            </h2>
            {releases.docs.length === 0 ? (
              <p className="placeholder">{pr.noReleases}</p>
            ) : (
              <ul className="news news--list">
                {releases.docs.map((n) => (
                  <li key={n.id}>
                    <span className="label">{formatDate.format(new Date(n.publishedAt))}</span>
                    <Link href={`/${locale}/actualites/${n.slug}`}>{n.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="stack">
            <h2 className="h2">
              <strong>{pr.kit}</strong>
            </h2>
            {kit.docs.length === 0 ? (
              <p className="placeholder">{pr.noKit}</p>
            ) : (
              <ul className="downloads">
                {kit.docs.map((d) => (
                  <li key={d.id}>
                    <a href={d.url ?? '#'} download>
                      {d.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <div className="box">
              <h3>{pr.accreditation}</h3>
              <p>{pr.accreditationText}</p>
              <h3>{pr.contact}</h3>
              <a href={`mailto:${event.contact?.email || 'info@scd-rdc.org'}`}>{event.contact?.email || 'info@scd-rdc.org'}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
