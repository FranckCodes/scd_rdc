// Langues du site (décision du 19/11/2026) : français, anglais, chinois, russe, arabe.
// L'arabe s'affiche de droite à gauche.
export const locales = ['fr', 'en', 'zh', 'ru', 'ar'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'fr'

export const rtlLocales: readonly Locale[] = ['ar']

export const localeLabels: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  zh: '中文',
  ru: 'Русский',
  ar: 'العربية',
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export function dirFor(locale: Locale): 'ltr' | 'rtl' {
  return rtlLocales.includes(locale) ? 'rtl' : 'ltr'
}
