import Link from 'next/link'
import type { Where } from 'payload'

import { PageHeader, StatusBadge } from '@/components/PageHeader'
import { componentKeys, sectorKeys, sectorLabel } from '@/i18n/sectors'
import { setup } from '@/lib/locale'

type Search = Promise<{ jour?: string; composante?: string; theme?: string }>

// Programme filtrable par jour, composante et thématique (TDR §8.1). Filtres en GET : fonctionne sans JavaScript.
export default async function ProgrammePage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Search }) {
  const { locale, t, tp, payload } = await setup(params)
  const { jour, composante, theme } = await searchParams

  const and: Where[] = []
  if (jour) and.push({ day: { equals: jour } })
  if (composante) and.push({ component: { equals: composante } })
  if (theme) and.push({ sectors: { contains: theme } })
  const sessions = await payload.find({
    collection: 'sessions',
    locale,
    depth: 1,
    limit: 200,
    sort: 'startTime',
    where: and.length ? { and } : undefined,
  })

  const componentName = (key: string) => t.components.items[componentKeys.indexOf(key as never)]?.title ?? key

  return (
    <>
      <PageHeader title={tp.programme.title} intro={tp.programme.intro} />
      <section className="section">
        <div className="container stack">
          <form className="filters" method="get">
            <label>
              {tp.programme.day}
              <select name="jour" defaultValue={jour ?? ''}>
                <option value="">{tp.programme.all}</option>
                <option value="j1">{tp.programme.days.j1}</option>
                <option value="j2">{tp.programme.days.j2}</option>
              </select>
            </label>
            <label>
              {tp.programme.component}
              <select name="composante" defaultValue={composante ?? ''}>
                <option value="">{tp.programme.all}</option>
                {componentKeys.map((k) => (
                  <option key={k} value={k}>
                    {componentName(k)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {tp.programme.sector}
              <select name="theme" defaultValue={theme ?? ''}>
                <option value="">{tp.programme.all}</option>
                {sectorKeys.map((k) => (
                  <option key={k} value={k}>
                    {sectorLabel(k, locale)}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn btn--navy" type="submit">
              {tp.programme.filter}
            </button>
          </form>

          {sessions.docs.length === 0 ? (
            <p className="placeholder">{tp.programme.empty}</p>
          ) : (
            <ul className="sessions">
              {sessions.docs.map((s) => (
                <li key={s.id} className="session">
                  <div className="session__time">
                    {s.day && <span className="label">{tp.programme.days[s.day]}</span>}
                    <strong>
                      {s.startTime}
                      {s.endTime ? ` – ${s.endTime}` : ''}
                    </strong>
                    {s.room && <span className="small muted">{tp.programme.room} {s.room}</span>}
                  </div>
                  <div className="session__body">
                    <span className="card__num">{componentName(s.component)}</span>
                    <h2 className="session__title">{s.title}</h2>
                    {s.description && <p className="muted">{s.description}</p>}
                    {Array.isArray(s.speakers) && s.speakers.length > 0 && (
                      <p className="small">
                        {s.speakers
                          .map((sp) => (typeof sp === 'object' ? sp : null))
                          .filter((sp) => sp && sp.validationStatus === 'confirme')
                          .map((sp) => sp!.name)
                          .join(' · ')}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={s.validationStatus} label={tp.status[s.validationStatus]} />
                </li>
              ))}
            </ul>
          )}
          <Link className="link-arrow" href={`/${locale}/participer/contribution`}>
            {tp.participate.forms.contribution.title} →
          </Link>
        </div>
      </section>
    </>
  )
}
