import Link from 'next/link'

import { PageHeader } from '@/components/PageHeader'
import { sectorKeys, sectorLabel } from '@/i18n/sectors'
import { setup } from '@/lib/locale'

const ruleColors = ['#0170bf', '#e8cf34', '#00b5ea', '#5cdd4b', '#5cdd4b', '#0170bf', '#00b5ea', '#e01010', '#e8cf34']

export default async function SalonPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, tp, payload } = await setup(params)
  // Seuls les exposants confirmés sont publiés (TDR §13).
  const exhibitors = await payload.find({
    collection: 'exhibitors',
    locale,
    limit: 200,
    sort: 'name',
    where: { validationStatus: { equals: 'confirme' } },
  })

  return (
    <>
      <PageHeader title={tp.salon.title} intro={tp.salon.intro}>
        <div className="actions">
          <Link className="btn btn--yellow" href={`/${locale}/participer/exposant`}>
            {tp.salon.cta}
          </Link>
        </div>
      </PageHeader>
      <section className="section section--alt">
        <div className="container stack">
          <h2 className="h2">
            <strong>{tp.salon.sectors}</strong>
          </h2>
          <div className="chips">
            {sectorKeys.map((k, i) => (
              <span key={k} className="chip" style={{ borderInlineStartColor: ruleColors[i] }}>
                {sectorLabel(k, locale)}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container stack">
          <h2 className="h2">
            <strong>{tp.salon.exhibitors}</strong>
          </h2>
          {exhibitors.docs.length === 0 ? (
            <p className="placeholder">{tp.salon.empty}</p>
          ) : (
            <ul className="cards">
              {exhibitors.docs.map((e) => (
                <li key={e.id} className="card">
                  {e.sector && <span className="card__num">{sectorLabel(e.sector, locale)}</span>}
                  <span className="card__title">{e.name}</span>
                  {e.project && <span className="card__text">{e.project}</span>}
                  {e.province && <span className="small muted">{e.province}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
