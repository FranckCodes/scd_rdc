'use client'

import { useEffect, useRef, useState } from 'react'

// Compteur 0 → valeur, joué une fois quand le chiffre arrive à l'écran (≤ 800 ms, décélération douce).
// - La page envoyée par le serveur contient déjà la valeur finale (sans JavaScript, tout est juste).
// - Les lecteurs d'écran lisent uniquement la valeur finale (les chiffres animés leur sont masqués).
// - Pas d'animation si « Réduire les animations » est activé, ni si le chiffre est déjà visible au chargement.
export function CountUp({ value, duration = 800 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) return

    setShown(0)
    let frame = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration)
          setShown(Math.round((1 - Math.pow(1 - progress, 3)) * value))
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, duration])

  return (
    <span ref={ref} className="count-up">
      <span className="count-up__digits" aria-hidden="true" style={{ minWidth: `${String(value).length}ch` }}>
        {shown}
      </span>
      <span className="visually-hidden">{value}</span>
    </span>
  )
}
