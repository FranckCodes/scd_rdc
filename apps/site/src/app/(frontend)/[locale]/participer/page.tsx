import Link from 'next/link'

import { Arrow } from '@/components/Arrow'
import { PageHeader } from '@/components/PageHeader'
import type { FormKey } from '@/i18n/pages'
import { setup } from '@/lib/locale'

const order: FormKey[] = ['manifestation-interet', 'partenaire', 'exposant', 'contribution', 'accreditation-presse']

export default async function ParticiperPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, tp } = await setup(params)
  return (
    <>
      <PageHeader title={tp.participate.title} intro={tp.participate.intro} />
      <section className="section">
        <div className="container cards cards--wide">
          {order.map((key, i) => (
            <Link key={key} href={`/${locale}/participer/${key}`} className="card" style={{ borderTopColor: ['var(--scd-navy)', 'var(--scd-sky)', 'var(--scd-green)', 'var(--scd-yellow)', 'var(--scd-red)'][i] }}>
              <span className="card__title">{tp.participate.forms[key].title}</span>
              <span className="card__text">{tp.participate.forms[key].desc}</span>
              <span className="card__meta">{tp.participate.delay} <Arrow /></span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
