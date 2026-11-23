'use client'

import React, { useState } from 'react'

// Affiche un formulaire défini dans l'administration (plugin form-builder) et l'envoie à l'API Payload.
type Option = { label: string; value: string }
export type FormField = {
  id?: string | null
  blockType: string
  name?: string
  label?: string | null
  required?: boolean | null
  width?: number | null
  options?: Option[] | null
}

type Labels = { submit: string; sending: string; error: string; required: string }

export function FormRenderer({
  formId,
  fields,
  submitLabel,
  labels,
  confirmation,
}: {
  formId: number | string
  fields: FormField[]
  submitLabel?: string | null
  labels: Labels
  confirmation: React.ReactNode
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('sending')
    const data = new FormData(e.currentTarget)
    const submissionData = fields
      .filter((f) => f.name)
      .map((f) => ({
        field: f.name!,
        value: f.blockType === 'checkbox' ? (data.get(f.name!) ? 'oui' : 'non') : String(data.get(f.name!) ?? ''),
      }))
    try {
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: formId, submissionData }),
      })
      setState(res.ok ? 'done' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div className="form-confirmation" role="status">
        {confirmation}
      </div>
    )
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate={false}>
      {fields.map((f, i) => {
        const id = `f-${f.name ?? i}`
        const req = Boolean(f.required)
        const label = (
          <label htmlFor={id}>
            {f.label}
            {req && <span className="form__req"> ({labels.required})</span>}
          </label>
        )
        const cls = `form__field ${f.width === 100 || f.blockType === 'textarea' || f.blockType === 'checkbox' ? 'form__field--full' : ''}`
        switch (f.blockType) {
          case 'textarea':
            return (
              <div key={id} className={cls}>
                {label}
                <textarea id={id} name={f.name} required={req} rows={5} />
              </div>
            )
          case 'select':
            return (
              <div key={id} className={cls}>
                {label}
                <select id={id} name={f.name} required={req} defaultValue="">
                  <option value="" disabled>
                    —
                  </option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            )
          case 'checkbox':
            return (
              <div key={id} className={`${cls} form__check`}>
                <input id={id} type="checkbox" name={f.name} required={req} />
                {label}
              </div>
            )
          case 'email':
          case 'text':
          case 'country':
          case 'number':
            return (
              <div key={id} className={cls}>
                {label}
                <input
                  id={id}
                  name={f.name}
                  required={req}
                  type={f.blockType === 'email' ? 'email' : f.blockType === 'number' ? 'number' : 'text'}
                  autoComplete={f.blockType === 'email' ? 'email' : undefined}
                />
              </div>
            )
          default:
            return null
        }
      })}
      {state === 'error' && (
        <p className="form__error" role="alert">
          {labels.error}
        </p>
      )}
      <button className="btn btn--navy" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? labels.sending : submitLabel || labels.submit}
      </button>
    </form>
  )
}
