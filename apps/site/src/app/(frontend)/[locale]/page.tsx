import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@payload-config'
import { Arrow } from '@/components/Arrow'
import { Countdown } from '@/components/Countdown'
import { CountUp } from '@/components/CountUp'
import { FingerprintRings } from '@/components/FingerprintRings'
import { notOrganiserWhere, Organisers } from '@/components/Organisers'
import { SdgSection } from '@/components/SdgSection'
import { VideoPlayer } from '@/components/VideoPlayer'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getPageDictionary } from '@/i18n/pages'
import { componentKeys } from '@/i18n/sectors'
import { eventPhase } from '@/lib/event-time'

// Page d'accueil — direction C2 « Bleu institutionnel » (TDR §7).
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)

  const payload = await getPayload({ config })
  const [event, news, partners, offers] = await Promise.all([
    payload.findGlobal({ slug: 'event-info', locale }),
    payload.find({ collection: 'news', locale, limit: 3, sort: '-publishedAt', where: { _status: { equals: 'published' } } }),
    // Règle TDR §13 : seuls les partenaires confirmés ET dont le logo est autorisé sont affichés.
    payload.find({
      collection: 'partners',
      limit: 12,
      sort: 'order',
      where: { and: [{ validationStatus: { equals: 'confirme' } }, { logoAuthorized: { equals: true } }, notOrganiserWhere] },
    }),
    payload.findGlobal({ slug: 'offers', locale, depth: 1 }),
  ])
  // Film de présentation : seulement une fois validé
  const film = offers.videoPublished && offers.videoUrl ? offers : null
  const filmPoster = film?.videoPoster && typeof film.videoPoster === 'object' ? film.videoPoster.url : null
  const quickHrefs = ['partenaire', 'exposant', 'manifestation-interet', 'partenaire'].map((f) => `/${locale}/participer/${f}`)

  const pending = (confirmed?: boolean | null) =>
    confirmed ? null : <span className="muted"> · {t.ui.toConfirm}</span>
  const ruleColors = ['var(--scd-navy)', 'var(--scd-sky)', 'var(--scd-green)', 'var(--scd-yellow)', 'var(--scd-red)']
  const formatDate = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' })
  // Compte à rebours : seulement si les dates sont confirmées officiellement ET le premier jour saisi.
  const countdownStart = event.datesConfirmed && event.startDate ? event.startDate : null
  const phase = countdownStart ? eventPhase(new Date(), countdownStart, event.endDate) : null

  return (
    <>
      {/* ACCROCHE */}
      <section className="hero">
        <FingerprintRings id="hero-rings" className="hero__rings" />
        <div className="container hero__grid">
          <div className="hero__text">
            <span className="eyebrow eyebrow--light">
              {t.hero.eyebrow} · {event.city} · {event.dates}
            </span>
            <h1 className="display">
              {t.hero.titleLight}
              <strong>{t.hero.titleBold}</strong>
            </h1>
            <p className="hero__signature">{t.footer.tagline}</p>
            <p className="lead">
              <strong className="lead__strong">{t.hero.positioning}</strong> {t.hero.lead}
            </p>
            {countdownStart && phase && phase.kind !== 'after' && (
              <Countdown
                start={countdownStart}
                end={event.endDate}
                initial={phase}
                locale={locale}
                labels={t.countdown}
                programmeHref={`/${locale}/programme`}
              />
            )}
            <div className="actions">
              <Link className="btn btn--yellow" href={`/${locale}/participer`}>
                {t.cta.interest}
              </Link>
              <Link className="btn btn--outline-light" href={`/${locale}/partenariats`}>
                {t.cta.partner}
              </Link>
            </div>
          </div>
          <div className="hero__photo">
            <Image src="/images/masina.jpg" alt="Boulevard de Masina vers N'djili, Kinshasa" fill sizes="(max-width: 900px) 100vw, 50vw" priority />
          </div>
        </div>
      </section>

      {/* INFOS CLÉS */}
      <section className="infos">
        <div className="container infos__grid">
          <div>
            <span className="label">{t.info.dates}</span>
            <strong>
              {event.dates}
              {pending(event.datesConfirmed)}
            </strong>
          </div>
          <div>
            <span className="label">{t.info.place}</span>
            <strong>
              {event.city}
              {event.venue ? ` · ${event.venue}` : ''}
              {pending(event.venueConfirmed)}
            </strong>
          </div>
          <div>
            <span className="label">{t.info.format}</span>
            <strong>{event.format}</strong>
          </div>
          <span className="muted small">{t.hero.photoCredit}</span>
        </div>
      </section>

      {/* QUATRE ACCÈS DIRECTS (analyse, étape 2) */}
      <section className="section section--tight" aria-labelledby="quick-title">
        <div className="container stack">
          <h2 className="h2" id="quick-title">
            <strong>{t.quick.title}</strong>
          </h2>
          <ul className="quick">
            {t.quick.items.map((item, i) => (
              <li key={item.label}>
                <Link className="quick__link" href={quickHrefs[i]}>
                  <span className="quick__label">
                    {item.label} <Arrow />
                  </span>
                  <span className="quick__text">{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {film && (
        <section className="section" aria-labelledby="film-title">
          <div className="container stack">
            <h2 className="h2" id="film-title">
              <strong>{film.videoTitle || t.film.title}</strong>
            </h2>
            <div className="video">
              <VideoPlayer url={film.videoUrl!} poster={filmPoster} title={film.videoTitle || t.film.title} playLabel={t.film.play} />
            </div>
          </div>
        </section>
      )}

      {/* COMPOSANTES */}
      <section className="section section--alt">
        <div className="container stack">
          <div className="section__head">
            <h2 className="h2">
              {t.components.titleLight}
              <strong className="accent">{t.components.titleBold}</strong>
            </h2>
            <Link className="link-arrow" href={`/${locale}/programme`}>
              {t.cta.programme} <Arrow />
            </Link>
          </div>
          <div className="cards">
            {t.components.items.map((item, i) => (
              <Link
                key={item.title}
                href={componentKeys[i] === 'trophees' ? `/${locale}/trophees` : `/${locale}/programme`}
                className="card"
                style={{ borderTopColor: ruleColors[i] }}
              >
                <span className="card__num">0{i + 1}</span>
                <span className="card__title">{item.title}</span>
                <span className="card__text">{item.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SCD-RDC DATA */}
      <section className="section">
        <div className="container split">
          <div className="stack">
            <span className="eyebrow">{t.data.eyebrow}</span>
            <h2 className="h2">
              {t.data.titleLight}
              <strong>{t.data.titleBold}</strong>
            </h2>
            <p className="text-muted">{t.data.text}</p>
            <a className="btn btn--navy" href={process.env.NEXT_PUBLIC_DATA_URL || 'http://localhost:3001'}>
              {t.cta.data}
            </a>
          </div>
          <div className="data-visual">
            <div className="data-visual__box">
              <div>
                <span className="data-visual__num">
                  <CountUp value={50} />
                </span>
                <span>{t.data.sample}</span>
              </div>
              <p>{t.data.note}</p>
            </div>
            <Image src="/images/yambendu.jpg" alt="Village de pêcheurs de Yambendu, Mongala" width={600} height={400} />
            <Image src="/images/port.jpg" alt="Grues portuaires au bord du fleuve" width={600} height={400} />
          </div>
        </div>
      </section>

      {/* OBJECTIFS DE DÉVELOPPEMENT DURABLE */}
      <SdgSection locale={locale} labels={t.sdgs} />

      {/* ORGANISATEURS */}
      <Organisers title={t.organisers.title} empty={t.organisers.empty} />

      {/* PARTENAIRES */}
      <section className="section section--alt">
        <div className="container stack">
          <div className="section__head">
            <h2 className="h2">
              {t.partners.titleLight}
              <strong>{t.partners.titleBold}</strong>
            </h2>
            <Link className="btn btn--outline" href={`/${locale}/partenariats`}>
              {t.cta.partner}
            </Link>
          </div>
          <p className="text-muted">{t.partners.note}</p>
          {partners.docs.length > 0 ? (
            <ul className="partners">
              {partners.docs.map((p) => (
                <li key={p.id}>{p.name}</li>
              ))}
            </ul>
          ) : (
            // Aucun partenaire confirmé : on présente les catégories recherchées plutôt qu'un message d'attente
            <div className="sought">
              <h3 className="sought__title">{t.partners.sought}</h3>
              <ul className="tiers">
                {Object.entries(getPageDictionary(locale).partnerships.tiers).map(([k, label]) => (
                  <li key={k}>
                    <Link href={`/${locale}/partenariats`}>{label}</Link>
                  </li>
                ))}
              </ul>
              <p className="text-muted">{t.partners.soughtText}</p>
            </div>
          )}
        </div>
      </section>

      {/* ACTUALITÉS */}
      <section className="section">
        <div className="container stack">
          <div className="section__head">
            <h2 className="h2">
              <strong>{t.news.title}</strong>
            </h2>
            <Link className="link-arrow" href={`/${locale}/actualites`}>
              {t.news.all} <Arrow />
            </Link>
          </div>
          {news.docs.length > 0 ? (
            <ul className="news">
              {news.docs.map((n) => (
                <li key={n.id}>
                  <span className="label">{formatDate.format(new Date(n.publishedAt))}</span>
                  <Link href={`/${locale}/actualites/${n.slug}`}>{n.title}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="placeholder">{t.news.empty}</p>
          )}
        </div>
      </section>
    </>
  )
}
