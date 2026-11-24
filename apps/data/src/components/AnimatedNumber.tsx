'use client'

import { useEffect, useRef, useState } from 'react'

// Nombre animé (animations, phase 4).
// - Premier affichage à l'écran : compte de 0 à la valeur (800 ms), une seule fois.
// - Changement de filtre : glisse de l'ancienne à la nouvelle valeur (400 ms).
// La page envoyée par le serveur contient déjà le texte exact ; les lecteurs d'écran ne lisent que lui.
// Aucun mouvement si « Réduire les animations » est activé, ni si le nombre est déjà visible au chargement.

const FORMATS = {
  integer: new Intl.NumberFormat('fr-FR'),
  compact: new Intl.NumberFormat('fr-FR', { notation: 'compact', maximumFractionDigits: 1 }),
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function AnimatedNumber({
  value,
  text,
  format = 'integer',
  suffix = '',
}: {
  value: number
  /** Valeur finale déjà formatée par le serveur (affichée hors animation) */
  text: string
  format?: keyof typeof FORMATS
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState<string | null>(null) // null : texte du serveur
  const shown = useRef(value) // valeur actuellement à l'écran
  const target = useRef(value) // valeur à atteindre
  const waiting = useRef(false) // en attente du premier affichage à l'écran
  const frame = useRef(0)

  const render = (v: number) =>
    `${FORMATS[format].format(format === 'integer' ? Math.round(v) : v)}${suffix}`

  const run = (from: number, to: number, duration: number) => {
    cancelAnimationFrame(frame.current)
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      shown.current = from + (to - from) * (1 - Math.pow(1 - progress, 3))
      if (progress < 1) {
        setDisplay(render(shown.current))
        frame.current = requestAnimationFrame(tick)
      } else {
        shown.current = to
        setDisplay(null)
      }
    }
    frame.current = requestAnimationFrame(tick)
  }

  // Premier affichage : 0 → valeur quand le nombre arrive à l'écran
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window) || prefersReducedMotion()) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) return
    waiting.current = true
    shown.current = 0
    setDisplay(render(0))
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        waiting.current = false
        run(0, target.current, 800)
      },
      { threshold: 0.6 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Changement de valeur (filtres) : glissement depuis la valeur affichée
  useEffect(() => {
    if (target.current === value) return
    target.current = value
    if (waiting.current) return // l'animation d'entrée ira directement à la nouvelle valeur
    if (prefersReducedMotion()) {
      shown.current = value
      setDisplay(null)
      return
    }
    run(shown.current, value, 400)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <span ref={ref} className="number">
      <span className="number__digits" aria-hidden="true">
        {display ?? text}
      </span>
      <span className="visually-hidden">{text}</span>
    </span>
  )
}
