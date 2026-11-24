'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type NavItem = { href: string; label: string; external?: boolean }

// Liens de navigation : la rubrique en cours est signalée (aria-current="page"),
// visuellement et pour les lecteurs d'écran — on sait toujours où l'on est.
export function NavLinks({ items, label, className }: { items: NavItem[]; label: string; className?: string }) {
  const pathname = usePathname() ?? ''
  return (
    <nav aria-label={label} className={className}>
      {items.map((item) => {
        const current = !item.external && (pathname === item.href || pathname.startsWith(`${item.href}/`))
        return (
          <Link key={item.href} href={item.href} aria-current={current ? 'page' : undefined}>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
