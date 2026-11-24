'use client'

import { useRouter } from 'next/navigation'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useTransition } from 'react'

// Navigation du tableau de bord (filtres, carte) sans rechargement ni retour en haut de page.
// - Pendant le chargement, les résultats s'estompent légèrement (seulement si l'attente dépasse 200 ms).
// - Une fois la mise à jour affichée, un message discret l'annonce aux lecteurs d'écran.
// - Sans JavaScript, filtres et carte restent de simples liens et formulaires GET.

type Nav = { isPending: boolean; go: (href: string) => void }

const NavContext = createContext<Nav | null>(null)

export function DashboardNav({ summary, children }: { summary: string; children: React.ReactNode }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState('')
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !isPending) setStatus(`Résultats mis à jour : ${summary}.`)
    wasPending.current = isPending
  }, [isPending, summary])

  const go = useCallback(
    (href: string) => {
      setStatus('')
      startTransition(() => router.push(href, { scroll: false }))
    },
    [router],
  )

  const value = useMemo(() => ({ isPending, go }), [isPending, go])

  return (
    <NavContext.Provider value={value}>
      <div className="dashboard" data-pending={isPending ? 'true' : undefined}>
        {children}
      </div>
      <p className="visually-hidden" role="status">
        {status}
      </p>
    </NavContext.Provider>
  )
}

export function useDashboardNav(): Nav {
  return useContext(NavContext) ?? { isPending: false, go: (href) => window.location.assign(href) }
}

/** Lien « sans rechargement » : clic simple intercepté, clic molette ou Ctrl+clic laissés au navigateur. */
export function isPlainClick(event: React.MouseEvent) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}
