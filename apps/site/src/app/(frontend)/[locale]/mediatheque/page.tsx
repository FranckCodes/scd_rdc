import type { Metadata } from 'next'

import { PageHeader } from '@/components/PageHeader'
import { isLocale } from '@/i18n/config'
import { getPageDictionary } from '@/i18n/pages'
import { setup } from '@/lib/locale'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const s3 = getPageDictionary(locale).step3
  return { title: s3.gallery, description: s3.galleryIntro }
}

// Médiathèque officielle (analyse, étape 3) : uniquement les photos marquées « médiathèque »
// ET dont les droits de reproduction sont obtenus, avec légende et crédit ; ressources presse à télécharger.
export default async function MediathequePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, tp, payload } = await setup(params)
  const s3 = tp.step3
  const [photos, docs] = await Promise.all([
    payload.find({
      collection: 'media',
      locale,
      limit: 120,
      sort: '-createdAt',
      where: { and: [{ inGallery: { equals: true } }, { rightsCleared: { equals: true } }] },
    }),
    payload.find({
      collection: 'documents',
      locale,
      limit: 30,
      where: { kind: { in: ['logos', 'charte', 'dossier-presse', 'kit-presse'] } },
    }),
  ])

  return (
    <>
      <PageHeader title={s3.gallery} intro={s3.galleryIntro} />
      {docs.docs.length > 0 && (
        <section className="section section--tight">
          <div className="container stack">
            <h2 className="h2">
              <strong>{s3.resources}</strong>
            </h2>
            <ul className="downloads">
              {docs.docs.map((d) => (
                <li key={d.id}>
                  <a href={d.url ?? '#'} download>
                    {d.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <section className="section">
        <div className="container">
          {photos.docs.length === 0 ? (
            <p className="placeholder">{s3.galleryEmpty}</p>
          ) : (
            <ul className="gallery">
              {photos.docs.map((m) => (
                <li key={m.id}>
                  <figure>
                    <a href={m.url ?? '#'} download>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.sizes?.card?.url ?? m.url ?? ''}
                        alt={m.alt}
                        width={m.sizes?.card?.width ?? 640}
                        height={m.sizes?.card?.height ?? 427}
                        loading="lazy"
                        decoding="async"
                      />
                    </a>
                    <figcaption>
                      {m.caption && <span>{m.caption}</span>}
                      <span className="small muted">
                        {[m.place, s3.credit + ' : ' + m.credit].filter(Boolean).join(' · ')}
                      </span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
