import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Arrow } from '@/components/Arrow'
import { FormRenderer, type FormField } from '@/components/FormRenderer'
import { PageHeader } from '@/components/PageHeader'
import { setup } from '@/lib/locale'

export default async function FormPage({ params }: { params: Promise<{ locale: string; form: string }> }) {
  const { form: slug } = await params
  const { locale, t, tp, payload } = await setup(params)
  const res = await payload.find({ collection: 'forms', locale, where: { slug: { equals: slug } }, limit: 1 })
  const form = res.docs[0]
  if (!form) notFound()

  return (
    <>
      <PageHeader title={form.title} intro={form.intro}>
        <span className="pill pill--yellow">{tp.participate.delay}</span>
      </PageHeader>
      <section className="section">
        <div className="container form-wrap">
          <Link className="link-arrow" href={`/${locale}/participer`}>
            <Arrow back /> {tp.form.back}
          </Link>
          <FormRenderer
            formId={form.id}
            fields={(form.fields ?? []) as FormField[]}
            submitLabel={form.submitButtonLabel}
            labels={tp.form}
            confirmation={form.confirmationMessage ? <RichText data={form.confirmationMessage} /> : null}
          />
          <p className="small muted">
            <Link href={`/${locale}/confidentialite`}>{t.footer.privacy}</Link>
          </p>
        </div>
      </section>
    </>
  )
}
