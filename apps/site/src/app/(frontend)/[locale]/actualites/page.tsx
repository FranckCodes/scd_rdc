import Link from 'next/link'

import { PageHeader } from '@/components/PageHeader'
import { setup } from '@/lib/locale'

export default async function ActualitesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, tp, payload } = await setup(params)
  const news = await payload.find({
    collection: 'news',
    locale,
    limit: 50,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
  })
  const formatDate = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
      <PageHeader title={tp.news.title} />
      <section className="section">
        <div className="container">
          {news.docs.length === 0 ? (
            <p className="placeholder">{tp.news.empty}</p>
          ) : (
            <ul className="news">
              {news.docs.map((n) => (
                <li key={n.id}>
                  <span className="label">{formatDate.format(new Date(n.publishedAt))}</span>
                  <Link href={`/${locale}/actualites/${n.slug}`}>{n.title}</Link>
                  {n.excerpt && <p className="muted small">{n.excerpt}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
