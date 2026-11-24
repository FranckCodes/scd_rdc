'use client'

import { useEffect, useState } from 'react'

import { isSessionLive } from '@/lib/event-time'

// Pastille « En cours » d'une session du programme (animations, phase 5).
// Visible pendant la session (heure de Kinshasa) ; à son apparition, elle pulse 3 fois puis reste fixe.
// L'état est vérifié toutes les 30 secondes : la pastille apparaît et disparaît d'elle-même.
export function LiveBadge({
  eventStart,
  day,
  startTime,
  endTime,
  initial,
  label,
}: {
  eventStart: string
  day: number
  startTime?: string | null
  endTime?: string | null
  initial: boolean
  label: string
}) {
  const [live, setLive] = useState(initial)

  useEffect(() => {
    const check = () => setLive(isSessionLive(new Date(), eventStart, day, startTime, endTime))
    check()
    const timer = window.setInterval(check, 30_000)
    return () => window.clearInterval(timer)
  }, [eventStart, day, startTime, endTime])

  if (!live) return null
  return (
    <span className="live">
      <span className="live__dot" aria-hidden="true" />
      {label}
    </span>
  )
}
