'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { localeLabels, locales, type Locale } from '@/i18n/config'

// Liens vers la même page dans les autres langues.
export function LanguageSwitcher({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname() ?? `/${current}`
  const rest = pathname.split('/').slice(2).join('/')

  return (
    <nav aria-label={label} className="lang-switcher">
      {locales.map((code) => (
        <Link
          key={code}
          href={`/${code}${rest ? `/${rest}` : ''}`}
          lang={code}
          hrefLang={code}
          aria-current={code === current ? 'true' : undefined}
        >
          {localeLabels[code]}
        </Link>
      ))}
    </nav>
  )
}
