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
import '../styles.css'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: { default: 'SCD-RDC · Semaine de la Coopération au Développement', template: '%s · SCD-RDC' },
  description:
    'Rendez-vous national de la coopération au développement en République Démocratique du Congo. Coopérer pour développer, rendre compte pour transformer.',
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
        <Footer locale={locale} t={t} email={event.contact?.email || 'info@scd.rdc.org'} />
      </body>
    </html>
  )
}
