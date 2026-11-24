import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Arrow } from '@/components/Arrow'
import { PageHeader } from '@/components/PageHeader'
import { setup } from '@/lib/locale'

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params
  const { locale, tp, payload } = await setup(params)
  const res = await payload.find({
    collection: 'news',
    locale,
    limit: 1,
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
  })
  const article = res.docs[0]
  if (!article) notFound()
  const date = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(article.publishedAt))

  return (
    <>
      <PageHeader title={article.title} intro={article.excerpt} eyebrow={date} />
      <div className="container prose-wrap">
        <Link className="link-arrow" href={`/${locale}/actualites`}>
          <Arrow back /> {tp.news.back}
        </Link>
        {article.content && (
          <div className="prose">
            <RichText data={article.content} />
          </div>
        )}
      </div>
    </>
  )
}
