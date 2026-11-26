import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import config from '@payload-config'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { dirFor, isLocale, locales } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

import { FONT_ARABIC_URL, FONT_BASE_URL, FONT_CHINESE_URL } from '@scd/ui/fonts'
import '@scd/ui/tokens.css'
import '@scd/ui/motion.css'
import '../styles.css'

// Les pages pré-générées sont reconstruites au plus toutes les 60 s :
// un contenu publié dans l'administration apparaît sans redéploiement.
export const revalidate = 60

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const BASE = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/+$/, '')

// Métadonnées communes : adresse de base, versions linguistiques, aperçu de partage (réseaux sociaux).
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const description =
    'Rendez-vous national de la coopération au développement en République Démocratique du Congo. Coopérer pour développer, rendre compte pour transformer.'
  return {
    metadataBase: new URL(BASE),
    title: { default: 'SCD-RDC · Semaine de la Coopération au Développement', template: '%s · SCD-RDC' },
    description,
    openGraph: {
      type: 'website',
      siteName: 'SCD-RDC',
      locale,
      description,
      images: [{ url: '/images/og-scd-rdc.png', width: 1200, height: 630, alt: 'SCD-RDC' }],
    },
    twitter: { card: 'summary_large_image', images: ['/images/og-scd-rdc.png'] },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const payload = await getPayload({ config })
  const event = await payload.findGlobal({ slug: 'event-info', locale })

  return (
    <html lang={locale} dir={dirFor(locale)}>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONT_BASE_URL} />
        {locale === 'ar' && <link rel="stylesheet" href={FONT_ARABIC_URL} />}
        {locale === 'zh' && <link rel="stylesheet" href={FONT_CHINESE_URL} />}
      </head>
      <body>
        <a className="skip-link" href="#contenu">
          {t.ui.skip}
        </a>
        <Header locale={locale} t={t} />
        <main id="contenu">{children}</main>
        <Footer locale={locale} t={t} email={event.contact?.email || 'info@scd-rdc.org'} social={event.social ?? []} />
        {/* Mesure d'audience sans cookie (Vercel Web Analytics) : activée seulement si NEXT_PUBLIC_VERCEL_ANALYTICS=1
            ET l'option activée dans le projet Vercel. */}
        {process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === '1' && <Analytics />}
      </body>
    </html>
  )
}
