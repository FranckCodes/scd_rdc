import Image from 'next/image'
import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

import { navLinks } from './Header'

export function Footer({ locale, t, email }: { locale: Locale; t: Dictionary; email: string }) {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Image src="/brand/logo-h-blanc.png" alt="SCD-RDC" width={159} height={48} />
          <p>{t.footer.tagline}</p>
        </div>
        <nav aria-label={t.nav.about} className="site-footer__nav">
          {navLinks(locale, t).map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <Link href={`/${locale}/participer`}>{t.cta.participate}</Link>
          <Link href={`/${locale}/infos-pratiques`}>{t.nav.practical}</Link>
        </nav>
        <div className="site-footer__contact">
          <a href={`mailto:${email}`}>{email}</a>
          <span>www.scd-rdc.org</span>
        </div>
      </div>
      <div className="container site-footer__legal">
        <span>© {new Date().getFullYear()} SCD-RDC</span>
        <div>
          <Link href={`/${locale}/mentions-legales`}>{t.footer.legal}</Link>
          <Link href={`/${locale}/confidentialite`}>{t.footer.privacy}</Link>
          <Link href={`/${locale}/accessibilite`}>{t.footer.accessibility}</Link>
        </div>
      </div>
    </footer>
  )
}
