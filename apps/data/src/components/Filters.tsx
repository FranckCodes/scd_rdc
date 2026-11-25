'use client'

import React, { useState } from 'react'

import { PROJECT_STATUSES, PROVINCES, SDGS, SECTORS } from '@scd/ui/reference'

import { dashboardHref, type Filters as FilterValues } from '../lib/filters'
import { isPlainClick, useDashboardNav } from './DashboardNav'

type Values = Pick<FilterValues, 'secteur' | 'province' | 'odd' | 'statut'>
type Draft = { secteur: string; province: string; odd: string; statut: string }

const SDG_OPTIONS = SDGS.map((s) => ({ id: s.id, label: `ODD ${s.id} — ${s.fr}` }))

const toDraft = (values: Values): Draft => ({
  secteur: values.secteur ?? '',
  province: values.province ?? '',
  odd: values.odd ?? '',
  statut: values.statut ?? '',
})

// Filtres du tableau de bord.
// - Sans JavaScript : formulaire GET classique.
// - Avec JavaScript : mise à jour sans rechargement (voir DashboardNav) ; les listes suivent aussi
//   les choix faits sur la carte.
export function Filters({ values }: { values: Values }) {
  const { go, isPending } = useDashboardNav()
  const [draft, setDraft] = useState(() => toDraft(values))
  const key = `${values.secteur ?? ''}|${values.province ?? ''}|${values.odd ?? ''}|${values.statut ?? ''}`
  const [previousKey, setPreviousKey] = useState(key)
  if (key !== previousKey) {
    setPreviousKey(key)
    setDraft(toDraft(values))
  }
  const hasFilters = Boolean(values.secteur || values.province || values.odd || values.statut)

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    go(
      dashboardHref({
        secteur: (draft.secteur || undefined) as Values['secteur'],
        province: (draft.province || undefined) as Values['province'],
        odd: (draft.odd || undefined) as Values['odd'],
        statut: (draft.statut || undefined) as Values['statut'],
      }),
    )
  }

  const select = (name: keyof Draft, label: string, all: string, options: readonly { id: string; label: string }[]) => (
    <label>
      {label}
      <select name={name} value={draft[name]} onChange={(event) => setDraft({ ...draft, [name]: event.target.value })}>
        <option value="">{all}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )

  return (
    <form className="filters" action="/" method="get" onSubmit={onSubmit} aria-busy={isPending}>
      {select('secteur', 'Secteur', 'Tous les secteurs', SECTORS)}
      {select('province', 'Province', 'Toutes les provinces', PROVINCES)}
      {select('odd', 'Objectif (ODD)', 'Tous les ODD', SDG_OPTIONS)}
      {select('statut', 'Avancement', 'Tous les statuts', PROJECT_STATUSES)}
      <div className="filters__actions">
        <button className="btn btn--navy" type="submit" disabled={isPending}>
          {isPending && (
            <span className="spinner" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="12" cy="12" r="9.5" strokeDasharray="34 26" />
                <circle cx="12" cy="12" r="5" strokeDasharray="17 14" />
              </svg>
            </span>
          )}
          Filtrer
        </button>
        {hasFilters && (
          <a
            className="filters__reset"
            href="/"
            onClick={(event) => {
              if (!isPlainClick(event)) return
              event.preventDefault()
              go('/')
            }}
          >
            Réinitialiser
          </a>
        )}
      </div>
    </form>
  )
}
