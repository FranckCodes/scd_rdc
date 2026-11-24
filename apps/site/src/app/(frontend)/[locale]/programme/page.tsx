import Link from 'next/link'
import type { Where } from 'payload'
import { ViewTransition } from 'react'

import { Arrow } from '@/components/Arrow'
import { PageHeader, StatusBadge } from '@/components/PageHeader'
import { ProgrammeFilters } from '@/components/ProgrammeFilters'
import { componentKeys, sectorKeys, sectorLabel } from '@/i18n/sectors'
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
    </>
  )
}
