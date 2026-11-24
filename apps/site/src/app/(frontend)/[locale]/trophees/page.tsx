import type { Metadata } from 'next'

import { CeremonyRefresh } from '@/components/CeremonyRefresh'
import { PageHeader } from '@/components/PageHeader'
import { TrophyCard, type Laureate } from '@/components/TrophyCard'
import { isLocale } from '@/i18n/config'
import { getPageDictionary } from '@/i18n/pages'
import { setup } from '@/lib/locale'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return isLocale(locale) ? { title: getPageDictionary(locale).trophies.title } : {}
}

// Trophées (animations, phase 5) : une carte par catégorie confirmée ; le lauréat n'est envoyé au navigateur
// qu'une fois dévoilé dans l'administration. Pendant la cérémonie, la page se met à jour seule
// et chaque carte se retourne au moment de l'annonce.
export default async function TrophiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, tp, payload } = await setup(params)
  const [event, trophies] = await Promise.all([
    payload.findGlobal({ slug: 'event-info', locale }),
    // overrideAccess: false — règles du public : catégories confirmées seulement, lauréat absent tant qu'il
    // n'est pas dévoilé (contrôle fait par Payload, voir collections/Trophies.ts).
    payload.find({ collection: 'trophies', locale, depth: 1, limit: 50, sort: 'order', overrideAccess: false }),
  ])

  const items = trophies.docs.map((doc) => {
    const photo = doc.laureate?.photo
    const laureate: Laureate | null =
      doc.revealed && doc.laureate?.name
        ? {
            name: doc.laureate.name,
            organisation: doc.laureate.organisation,
            summary: doc.laureate.summary,
            photo:
              photo && typeof photo === 'object' && photo.url
                ? { url: photo.url, alt: photo.alt ?? doc.laureate.name, width: photo.width, height: photo.height }
                : null,
          }
        : null
    return { id: String(doc.id), category: doc.category, description: doc.description, laureate }
  })
  const live = Boolean(event.ceremonyLive)
  const waiting = items.some((item) => !item.laureate)

  return (
    <>
      <PageHeader title={tp.trophies.title} intro={tp.trophies.intro}>
        {live && (
          <p className="ceremony-live">
            <span className="live__dot" aria-hidden="true" />
            {tp.trophies.live}
          </p>
        )}
      </PageHeader>
      <section className="section">
        <div className="container stack">
          {items.length === 0 ? (
            <p className="placeholder">{tp.trophies.empty}</p>
          ) : (
            <CeremonyRefresh
              active={live && waiting}
              revealed={items.flatMap((item) =>
                item.laureate
                  ? [{ id: item.id, text: `${tp.trophies.revealed} — ${item.category} — ${item.laureate.name}` }]
                  : [],
              )}
            >
              <ul className="trophies">
                {items.map((item, index) => (
                  <TrophyCard
                    key={item.id}
                    index={index}
                    category={item.category}
                    description={item.description}
                    laureate={item.laureate}
                    labels={{ pending: tp.trophies.pending, laureate: tp.trophies.laureate }}
                  />
                ))}
              </ul>
            </CeremonyRefresh>
          )}
        </div>
      </section>
    </>
  )
}
