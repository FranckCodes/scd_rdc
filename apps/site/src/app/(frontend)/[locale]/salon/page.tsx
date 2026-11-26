import Link from 'next/link'

import { PageHeader } from '@/components/PageHeader'
import { toLines } from '@/lib/lines'
import { sectorKeys, sectorLabel } from '@/i18n/sectors'
import { setup } from '@/lib/locale'

const ruleColors = ['#0170bf', '#e8cf34', '#00b5ea', '#5cdd4b', '#5cdd4b', '#0170bf', '#00b5ea', '#e01010', '#e8cf34']

export default async function SalonPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, tp, payload } = await setup(params)
  // Seuls les exposants confirmés sont publiés (TDR §13).
  const [exhibitors, offers, pack] = await Promise.all([
    payload.find({
      collection: 'exhibitors',
      locale,
      limit: 200,
      sort: 'name',
      where: { validationStatus: { equals: 'confirme' } },
    }),
    payload.findGlobal({ slug: 'offers', locale, depth: 1 }),
    payload.find({ collection: 'documents', locale, limit: 1, where: { kind: { equals: 'dossier-exposant' } } }),
  ])
  const s2 = tp.step2
  // Formules d'exposition, avantages et plan : publiés seulement une fois validés dans l'administration
  const stands = offers.standsValidated ? (offers.stands ?? []) : []
  const advantages = offers.advantagesValidated ? toLines(offers.advantages) : []
  const plan = offers.floorPlanValidated && offers.floorPlan && typeof offers.floorPlan === 'object' ? offers.floorPlan : null

  return (
    <>
      <PageHeader title={tp.salon.title} intro={tp.salon.intro}>
        <div className="actions">
          <Link className="btn btn--yellow" href={`/${locale}/participer/exposant`}>
            {tp.salon.cta}
          </Link>
          {pack.docs[0]?.url && (
            <a className="btn btn--outline-light" href={pack.docs[0].url} download>
              {s2.dossierExhibitor}
            </a>
          )}
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
      <section className="section" aria-labelledby="stands-titre">
        <div className="container stack">
          <h2 className="h2" id="stands-titre">
            <strong>{s2.standsTitle}</strong>
          </h2>
          {stands.length === 0 ? (
            <div className="stack">
              <p className="text-muted">{s2.standsPending}</p>
              <div>
                <Link className="btn btn--navy" href={`/${locale}/participer/exposant`}>
                  {tp.salon.cta}
                </Link>
              </div>
            </div>
          ) : (
            <div className="table-scroll">
              <table className="stands">
                <thead>
                  <tr>
                    <th scope="col">{s2.category}</th>
                    <th scope="col">{s2.dimensions}</th>
                    <th scope="col">{s2.included}</th>
                    <th scope="col">{s2.price}</th>
                  </tr>
                </thead>
                <tbody>
                  {stands.map((st, i) => (
                    <tr key={st.id ?? i}>
                      <th scope="row">{st.name}</th>
                      <td>{st.dimensions || '—'}</td>
                      <td>
                        {toLines(st.included).length ? (
                          <ul>
                            {toLines(st.included).map((l) => (
                              <li key={l}>{l}</li>
                            ))}
                          </ul>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td>{st.priceApproved && st.price ? st.price : s2.priceOnRequest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {advantages.length > 0 && (
            <>
              <h3 className="h3-title">{s2.advantagesTitle}</h3>
              <ul className="checklist">
                {advantages.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </>
          )}
          {plan?.url && (
            <figure className="floorplan">
              <figcaption className="h3-title">{s2.planTitle}</figcaption>
              <a href={plan.url}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={plan.url} alt={plan.alt ?? s2.planTitle} width={plan.width ?? 1200} height={plan.height ?? 800} loading="lazy" />
              </a>
            </figure>
          )}
        </div>
      </section>
      <section className="section section--alt">
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
