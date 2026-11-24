import Image from 'next/image'
import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'
import { NavLinks, type NavItem } from './NavLinks'

export function navLinks(locale: Locale, t: Dictionary): NavItem[] {
  return [
    { href: `/${locale}/a-propos`, label: t.nav.about },
    { href: `/${locale}/programme`, label: t.nav.programme },
    { href: `/${locale}/salon`, label: t.nav.salon },
    { href: process.env.NEXT_PUBLIC_DATA_URL || 'http://localhost:3001', label: t.nav.data, external: true },
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
          <Image className="logo-full" src="/brand/logo-h-blanc.png" alt="SCD-RDC" width={185} height={56} priority />
          <Image className="logo-short" src="/brand/logo-court-blanc.png" alt="SCD-RDC" width={98} height={40} priority />
        </Link>

        <NavLinks items={links} label={t.ui.mainNav} className="site-nav" />

        <LanguageSwitcher current={locale} label={t.ui.language} />

        <MobileMenu items={links} menuLabel={t.ui.menu} navLabel={t.ui.mainNav}>
          <LanguageSwitcher current={locale} label={t.ui.language} />
        </MobileMenu>
      </div>
    </header>
  )
}
