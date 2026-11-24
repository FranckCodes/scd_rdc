'use client'

import React, { useEffect, useRef, useState } from 'react'

// Barres qui « montent » au premier affichage (animations, phase 4).
// La page serveur montre les barres à leur taille finale : rien ne dépend du JavaScript.
// Si le graphique n'est pas encore à l'écran, ses barres sont repliées, puis s'allongent en cascade
// (40 ms d'écart) quand il apparaît. Ensuite, un changement de filtre les fait glisser vers leur
// nouvelle taille (transition CSS de 300 ms). Rien ne bouge avec « Réduire les animations ».
export function ChartReveal({ rows, children }: { rows: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'idle' | 'armed' | 'play'>('idle')

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) return

    setState('armed')
    let timer = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        setState('play')
        timer = window.setTimeout(() => setState('idle'), 400 + rows * 40 + 100)
      },
      { threshold: 0.35 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [rows])

  return (
    <div ref={ref} className="chart__body" data-reveal={state === 'idle' ? undefined : state}>
      {children}
    </div>
  )
}
