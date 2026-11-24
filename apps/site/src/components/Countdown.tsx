'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { eventPhase, msUntilKinshasaMidnight, type EventPhase } from '@/lib/event-time'

export type PluralLabels = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string }

export type CountdownLabels = {
  number: string // « J-{n} » en français, « {n} » ailleurs
  label: PluralLabels // texte après le nombre
  spoken: PluralLabels // phrase complète pour les lecteurs d'écran
  live: string
  day: string // « Jour {n} »
}

// Compte à rebours de l'accueil (animations, phase 5).
// - Affiché seulement quand les dates sont confirmées dans l'administration (vérifié par la page).
// - Aucune seconde qui défile : le nombre change une fois par jour, à minuit heure de Kinshasa, avec un fondu.
// - Pendant l'événement : « En cours · Jour 1 », lien vers le programme. Après : plus rien.
export function Countdown({
  start,
  end,
  initial,
  locale,
  labels,
  programmeHref,
}: {
  start: string
  end?: string | null
  initial: EventPhase
  locale: string
  labels: CountdownLabels
  programmeHref: string
}) {
  const [phase, setPhase] = useState(initial)

  useEffect(() => {
    let timer = 0
    const update = () => {
      setPhase(eventPhase(new Date(), start, end))
      timer = window.setTimeout(update, msUntilKinshasaMidnight(new Date()) + 1000)
    }
    update()
    return () => window.clearTimeout(timer)
  }, [start, end])

  if (phase.kind === 'after') return null

  if (phase.kind === 'during') {
    return (
      <Link className="countdown countdown--live" href={programmeHref}>
        <span className="live__dot" aria-hidden="true" />
        {labels.live} · {labels.day.replace('{n}', String(phase.day))}
      </Link>
    )
  }

  const rule = new Intl.PluralRules(locale).select(phase.days)
  const pick = (forms: PluralLabels) => (forms[rule] ?? forms.other).replace('{n}', String(phase.days))
  return (
    <p className="countdown">
      {/* Nouvelle clé chaque jour : le nombre réapparaît en fondu quand il change */}
      <span key={phase.days} className="countdown__num" aria-hidden="true">
        {labels.number.replace('{n}', String(phase.days))}
      </span>
      <span className="countdown__label" aria-hidden="true">
        {pick(labels.label)}
      </span>
      <span className="visually-hidden">{pick(labels.spoken)}</span>
    </p>
  )
}
