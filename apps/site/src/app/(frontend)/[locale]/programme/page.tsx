import Link from 'next/link'
import type { Where } from 'payload'
import { ViewTransition } from 'react'

import { Arrow } from '@/components/Arrow'
import { LiveBadge } from '@/components/LiveBadge'
import { PageHeader, StatusBadge } from '@/components/PageHeader'
import { ProgrammeFilters } from '@/components/ProgrammeFilters'
import { componentKeys, sectorKeys, sectorLabel } from '@/i18n/sectors'
import { isSessionLive } from '@/lib/event-time'
import { toLines } from '@/lib/lines'
import { setup } from '@/lib/locale'

type Search = Promise<{ jour?: string; composante?: string; theme?: string }>

// Programme filtrable par jour, composante et thématique (TDR §8.1).
// Filtres en GET (fonctionne sans JavaScript), enrichis côté client : pas de rechargement, liste remplacée en fondu.
export default async function ProgrammePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Search
}) {
  const { locale, t, tp, payload } = await setup(params)
  const { jour, composante, theme } = await searchParams

  const and: Where[] = []
  if (jour) and.push({ day: { equals: jour } })
  if (composante) and.push({ component: { equals: composante } })
  if (theme) and.push({ sectors: { contains: theme } })
  const [event, offers] = await Promise.all([
    payload.findGlobal({ slug: 'event-info', locale }),
    payload.findGlobal({ slug: 'offers', locale }),
  ])
  const s2 = tp.step2
  // Trame et fiches des composantes : publiées seulement une fois validées dans l'administration
  const trame = offers.provisionalPublished ? (offers.provisional ?? []) : []
  const sheets = offers.componentsValidated
    ? componentKeys
        .map((key) => {
          const sheet = offers[key]
          const rows = (['objectives', 'audiences', 'results', 'contribution'] as const)
            .map((field) => ({ field, items: toLines(sheet?.[field]) }))
            .filter((row) => row.items.length > 0)
          return { key, rows }
        })
        .filter((sheet) => sheet.rows.length > 0)
    : []
  // Pastilles « En cours » : seulement si les dates sont confirmées et le premier jour saisi (Jour 1).
  const eventStart = event.datesConfirmed && event.startDate ? event.startDate : null
  const now = new Date()
  const sessions = await payload.find({
    collection: 'sessions',
    locale,
    depth: 1,
    limit: 200,
    sort: 'startTime',
    where: and.length ? { and } : undefined,
  })

  const componentName = (key: string) =>
    t.components.items[componentKeys.indexOf(key as never)]?.title ?? key

  return (
    <>
      <PageHeader title={tp.programme.title} intro={tp.programme.intro} />
      {trame.length > 0 && (
        <section className="section section--alt" aria-labelledby="previsionnel-titre">
          <div className="container stack">
            <div className="section__head">
              <h2 className="h2" id="previsionnel-titre">
                <strong>{s2.provisionalTitle}</strong>
              </h2>
            </div>
            <p className="text-muted">{s2.provisionalNote}</p>
            <div className="trame">
              {(['j1', 'j2'] as const).map((day) => (
                <div key={day} className="trame__day">
                  <h3>{tp.programme.days[day]}</h3>
                  <ul>
                    {trame
                      .filter((slot) => slot.day === day)
                      .map((slot, i) => (
                        <li key={slot.id ?? i}>
                          <span className="label">{slot.period === 'am' ? s2.am : s2.pm}</span>
                          <span>{slot.title}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="section">
        <div className="container stack">
          <ProgrammeFilters
            labels={{
              day: tp.programme.day,
              component: tp.programme.component,
              sector: tp.programme.sector,
              all: tp.programme.all,
              filter: tp.programme.filter,
              updated: tp.programme.updated,
            }}
            days={[
              { value: 'j1', label: tp.programme.days.j1 },
              { value: 'j2', label: tp.programme.days.j2 },
            ]}
            components={componentKeys.map((k) => ({ value: k, label: componentName(k) }))}
            sectors={sectorKeys.map((k) => ({ value: k, label: sectorLabel(k, locale) }))}
            values={{ jour, composante, theme }}
          />

          {/* Nouvelle clé à chaque filtrage : l'ancienne liste et la nouvelle partagent le nom
              « programme-results » → remplacement en fondu (classe programme-swap, voir styles.css) */}
          <ViewTransition
            key={`${jour ?? ''}|${composante ?? ''}|${theme ?? ''}`}
            name="programme-results"
            share="programme-swap"
            default="none"
          >
            <div className="programme-results">
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
                        {s.room && (
                          <span className="small muted">
                            {tp.programme.room} {s.room}
                          </span>
                        )}
                        {eventStart && s.day && (
                          <LiveBadge
                            eventStart={eventStart}
                            day={s.day === 'j2' ? 2 : 1}
                            startTime={s.startTime}
                            endTime={s.endTime}
                            initial={isSessionLive(now, eventStart, s.day === 'j2' ? 2 : 1, s.startTime, s.endTime)}
                            label={tp.live}
                          />
                        )}
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
                      <StatusBadge
                        status={s.validationStatus}
                        label={tp.status[s.validationStatus]}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </ViewTransition>
          <Link className="link-arrow" href={`/${locale}/participer/contribution`}>
            {tp.participate.forms.contribution.title} <Arrow />
          </Link>
        </div>
      </section>
      {sheets.length > 0 && (
        <section className="section section--alt" aria-labelledby="composantes-titre">
          <div className="container stack">
            <h2 className="h2" id="composantes-titre">
              <strong>{s2.componentsTitle}</strong>
            </h2>
            <div className="sheets">
              {sheets.map((sheet) => (
                <details key={sheet.key} className="sheet" id={`composante-${sheet.key}`}>
                  <summary>{componentName(sheet.key)}</summary>
                  <dl>
                    {sheet.rows.map((row) => (
                      <div key={row.field}>
                        <dt>{s2[row.field]}</dt>
                        <dd>
                          <ul>
                            {row.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
