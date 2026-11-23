import Image from 'next/image'
import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

import { LanguageSwitcher } from './LanguageSwitcher'

export function navLinks(locale: Locale, t: Dictionary) {
  return [
    { href: `/${locale}/a-propos`, label: t.nav.about },
    { href: `/${locale}/programme`, label: t.nav.programme },
    { href: `/${locale}/salon`, label: t.nav.salon },
    { href: process.env.NEXT_PUBLIC_DATA_URL || 'http://localhost:3001', label: t.nav.data },
    { href: `/${locale}/partenariats`, label: t.nav.partnerships },
    { href: `/${locale}/presse`, label: t.nav.press },
  ]
}

export function Header({ locale, t }: { locale: Locale; t: Dictionary }) {
  const links = navLinks(locale, t)
  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <Link href={`/${locale}`} className="site-header__logo">
          <Image src="/brand/logo-h-blanc.png" alt="SCD-RDC" width={185} height={56} priority />
        </Link>

        <nav aria-label={t.nav.programme} className="site-nav">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        <LanguageSwitcher current={locale} label={t.ui.language} />

        {/* Menu mobile sans JavaScript */}
        <details className="mobile-menu">
          <summary aria-label={t.ui.menu}>
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </summary>
          <div className="mobile-menu__panel">
            {links.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
            <LanguageSwitcher current={locale} label={t.ui.language} />
          </div>
        </details>
      </div>
    </header>
  )
}
