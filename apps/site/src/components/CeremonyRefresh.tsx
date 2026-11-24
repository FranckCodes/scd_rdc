'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState, useTransition } from 'react'

// Pendant la cérémonie des Trophées (case « Cérémonie en cours » de l'administration) :
// la page se met à jour d'elle-même toutes les 15 secondes, tant qu'elle est affichée à l'écran.
// Quand un lauréat est dévoilé, sa carte se retourne (transition CSS, voir .trophy) et un message
// l'annonce aux lecteurs d'écran. Hors cérémonie : aucune requête, aucun minuteur.
export function CeremonyRefresh({
  active,
  revealed,
  children,
}: {
  active: boolean
  revealed: { id: string; text: string }[]
  children: React.ReactNode
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [message, setMessage] = useState('')
  const known = useRef<Set<string> | null>(null)

  useEffect(() => {
    if (!active) return
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') startTransition(() => router.refresh())
    }, 15_000)
    return () => window.clearInterval(timer)
  }, [active, router])

  useEffect(() => {
    const previous = known.current
    known.current = new Set(revealed.map((item) => item.id))
    if (!previous) return
    const fresh = revealed.filter((item) => !previous.has(item.id))
    if (fresh.length) setMessage(fresh.map((item) => item.text).join(' · '))
  }, [revealed])

  return (
    <>
      {children}
      <p className="visually-hidden" role="status">
        {message}
      </p>
    </>
  )
}
