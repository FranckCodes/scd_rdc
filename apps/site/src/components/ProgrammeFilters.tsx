'use client'

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState, useTransition } from 'react'

type Option = { value: string; label: string }

// Filtres du programme (jour, composante, thématique).
// - Sans JavaScript : formulaire GET classique (rechargement de la page).
// - Avec JavaScript : navigation sans rechargement ni retour en haut de page ; la liste se remplace
//   en fondu (View Transition « programme-swap » dans la page) et un message discret annonce
//   la mise à jour aux lecteurs d'écran.
export function ProgrammeFilters({
  labels,
  days,
  components,
  sectors,
  values,
}: {
  labels: { day: string; component: string; sector: string; all: string; filter: string; updated: string }
  days: Option[]
  components: Option[]
  sectors: Option[]
  values: { jour?: string; composante?: string; theme?: string }
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState('')
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !isPending) setStatus(labels.updated)
    wasPending.current = isPending
  }, [isPending, labels.updated])

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams()
    for (const [key, value] of new FormData(event.currentTarget)) {
      if (typeof value === 'string' && value) params.set(key, value)
    }
    const query = params.toString()
    setStatus('')
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    })
  }

  const select = (name: 'jour' | 'composante' | 'theme', label: string, options: Option[]) => (
    <label>
      {label}
      <select name={name} defaultValue={values[name] ?? ''}>
        <option value="">{labels.all}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )

  return (
    <form className="filters" method="get" onSubmit={onSubmit} aria-busy={isPending}>
      {select('jour', labels.day, days)}
      {select('composante', labels.component, components)}
      {select('theme', labels.sector, sectors)}
      <button className="btn btn--navy" type="submit" disabled={isPending}>
        {isPending && (
          <span className="spinner" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="9.5" strokeDasharray="34 26" />
              <circle cx="12" cy="12" r="5" strokeDasharray="17 14" />
            </svg>
          </span>
        )}
        {labels.filter}
      </button>
      <p className="visually-hidden" aria-live="polite">
        {status}
      </p>
    </form>
  )
}
