import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@payload-config'
import { Organisers } from '@/components/Organisers'
import { Notice, PageHeader } from '@/components/PageHeader'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { setup } from '@/lib/locale'

type Params = Promise<{ locale: string; slug: string }>

// Pages éditoriales gérées dans l'administration : à propos, infos pratiques, mentions légales…
async function findPage(locale: string, slug: string, fallback: boolean) {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'pages',
    locale: locale as never,
    fallbackLocale: fallback ? 'fr' : false,
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
  })
  return res.docs[0]
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const page = await findPage(locale, slug, true)
  return page ? { title: page.meta?.title || page.title, description: page.meta?.description || page.intro || undefined } : {}
}

export default async function EditorialPage({ params }: { params: Params }) {
  const { slug } = await params
  const { locale, tp } = await setup(params)
  const page = await findPage(locale, slug, true)
  if (!page) notFound()
  const translated = locale === 'fr' || Boolean((await findPage(locale, slug, false))?.title)

  return (
    <>
      <PageHeader title={page.title} intro={page.intro} />
      <div className="container prose-wrap">
        {page.proposal && <Notice>{tp.proposal}</Notice>}
        {!translated && <Notice>{tp.frenchOnly}</Notice>}
        {page.content && (
          <div className="prose" lang={translated ? locale : 'fr'} dir={translated ? undefined : 'ltr'}>
            <RichText data={page.content} />
          </div>
        )}
      </div>
      {slug === 'a-propos' && (
        <Organisers title={getDictionary(locale).organisers.title} empty={getDictionary(locale).organisers.empty} alt />
      )}
    </>
  )
}
