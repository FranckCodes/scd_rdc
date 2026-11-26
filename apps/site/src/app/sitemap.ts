import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'

import config from '@payload-config'
import { locales } from '@/i18n/config'

// Plan du site (référencement, analyse étape 3) : pages fixes et contenus publiés, dans les 5 langues,
// avec les liens entre versions linguistiques.
export const revalidate = 3600

const BASE = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/+$/, '')
const STATIC = ['', 'programme', 'salon', 'partenariats', 'presse', 'trophees', 'gouvernance', 'cooperation', 'mediatheque', 'participer', 'actualites']

const entry = (path: string, lastModified?: string): MetadataRoute.Sitemap[number] => ({
  url: `${BASE}/fr${path}`,
  lastModified,
  alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${BASE}/${l}${path}`])) },
})

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const [pages, news] = await Promise.all([
    payload.find({ collection: 'pages', limit: 200, depth: 0, where: { _status: { equals: 'published' } } }),
    payload.find({ collection: 'news', limit: 500, depth: 0, where: { _status: { equals: 'published' } } }),
  ])
  return [
    ...STATIC.map((p) => entry(p ? `/${p}` : '')),
    ...pages.docs.map((p) => entry(`/${p.slug}`, p.updatedAt)),
    ...news.docs.map((n) => entry(`/actualites/${n.slug}`, n.updatedAt)),
  ]
}
