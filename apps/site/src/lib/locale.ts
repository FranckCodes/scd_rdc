import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@payload-config'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getPageDictionary } from '@/i18n/pages'

// Résout la langue de l'URL et charge les textes et le client Payload.
export async function setup(params: Promise<{ locale: string }>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const payload = await getPayload({ config })
  return { locale: locale as Locale, t: getDictionary(locale), tp: getPageDictionary(locale), payload }
}
