'use client'

import { usePathname } from 'next/navigation'
import React, { useEffect, useRef } from 'react'

import { NavLinks, type NavItem } from './NavLinks'

// Menu mobile : un <details> natif (fonctionne même sans JavaScript), enrichi pour
//  - se refermer après un changement de page ou un clic sur un lien,
//  - se refermer avec Échap en rendant le focus au bouton.
// L'animation (☰ → ✕, panneau qui descend) est entièrement en CSS.
export function MobileMenu({
  items,
  menuLabel,
  navLabel,
  children,
}: {
  items: NavItem[]
  menuLabel: string
  navLabel: string
  children?: React.ReactNode
}) {
  const ref = useRef<HTMLDetailsElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (ref.current) ref.current.open = false
  }, [pathname])

  const close = (focusSummary: boolean) => {
    if (!ref.current?.open) return
    ref.current.open = false
    if (focusSummary) ref.current.querySelector('summary')?.focus()
  }

  return (
    <details
      ref={ref}
      className="mobile-menu"
      onKeyDown={(e) => {
        if (e.key === 'Escape') close(true)
      }}
    >
      <summary aria-label={menuLabel}>
        <svg className="menu-icon" aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path className="menu-icon__top" d="M4 7h16" />
          <path className="menu-icon__mid" d="M4 12h16" />
          <path className="menu-icon__bot" d="M4 17h16" />
        </svg>
      </summary>
      <div
        className="mobile-menu__panel"
        onClick={(e) => {
          if ((e.target as Element).closest('a')) close(false)
        }}
      >
        <NavLinks items={items} label={navLabel} className="mobile-menu__nav" />
        {children}
      </div>
    </details>
  )
}
