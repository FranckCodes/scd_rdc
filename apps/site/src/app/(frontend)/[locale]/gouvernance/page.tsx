import type { Metadata } from 'next'

import { GOVERNANCE_BODIES } from '@/collections/Governance'
import { PageHeader } from '@/components/PageHeader'
import { isLocale } from '@/i18n/config'
import { getPageDictionary } from '@/i18n/pages'
import { setup } from '@/lib/locale'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const g = getPageDictionary(locale).governance
  return { title: g.title, description: g.intro }
}

// Gouvernance et organisation : une section par instance. Seules les fiches confirmées sont lues
// (overrideAccess: false applique la règle publique de collections/Governance.ts) ; une instance
// encore vide l'indique sobrement, sans aucun nom provisoire.
export default async function GovernancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, tp, payload } = await setup(params)
  const g = tp.governance
  const [event, members] = await Promise.all([
    payload.findGlobal({ slug: 'event-info', locale }),
    payload.find({ collection: 'governance', locale, depth: 1, limit: 200, sort: 'order', overrideAccess: false }),
  ])
  const email = event.contact?.email

  return (
    <>
      <PageHeader title={g.title} intro={g.intro} />
      <section className="section">
        <div className="container governance">
          {GOVERNANCE_BODIES.map((body) => {
            const list = members.docs.filter((m) => m.body === body.value)
            const labels = g.bodies[body.value]
            return (
              <section key={body.value} className="governance__body" aria-labelledby={`gov-${body.value}`}>
                <h2 className="h2" id={`gov-${body.value}`}>
                  <strong>{labels.title}</strong>
                </h2>
                <p className="text-muted">{labels.text}</p>
                {list.length === 0 ? (
                  <p className="governance__empty">{g.empty}</p>
                ) : (
                  <ul className="governance__list">
                    {list.map((m) => {
                      const photo = m.photo && typeof m.photo === 'object' && m.photo.url ? m.photo : null
                      return (
                        <li key={m.id} className="governance__member">
                          {photo && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={photo.url!} alt="" width={72} height={72} loading="lazy" decoding="async" />
                          )}
                          <div>
                            <p className="governance__name">{m.name}</p>
                            {m.role && <p className="governance__role">{m.role}</p>}
                            {m.organization && <p className="governance__org">{m.organization}</p>}
                            {m.description && <p className="governance__desc">{m.description}</p>}
                            {m.email && <a href={`mailto:${m.email}`}>{m.email}</a>}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>
            )
          })}
          {email && (
            <section className="box" aria-labelledby="gov-contact">
              <h3 id="gov-contact">{g.contact}</h3>
              <a href={`mailto:${email}`}>{email}</a>
            </section>
          )}
        </div>
      </section>
    </>
  )
}
