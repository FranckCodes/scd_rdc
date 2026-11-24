import { NextResponse, type NextRequest } from 'next/server'

import { defaultLocale, isLocale, locales } from './i18n/config'

// Redirige « / » et toute page sans langue vers /<langue>/…,
// en choisissant la langue du navigateur si elle est prise en charge.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const first = pathname.split('/')[1] ?? ''
  if (isLocale(first)) return NextResponse.next()

  const accepted = (request.headers.get('accept-language') ?? '')
    .split(',')
    .map((part) => part.trim().slice(0, 2).toLowerCase())
  const locale = accepted.find((code) => (locales as readonly string[]).includes(code)) ?? defaultLocale

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // Ne pas toucher à l'administration, à l'API, aux fichiers Next ni aux fichiers statiques.
  matcher: ['/((?!admin|api|_next|brand|images|media|favicon.ico|icon.png|apple-icon.png|robots.txt|sitemap.xml).*)'],
}
