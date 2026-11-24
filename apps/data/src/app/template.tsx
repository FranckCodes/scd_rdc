import React, { ViewTransition } from 'react'

// Transition entre pages (tableau de bord ↔ fiche projet), comme sur le site institutionnel :
// l'ancienne page s'efface (150 ms), la nouvelle apparaît en fondu avec un léger glissement (250 ms).
// Les filtres ne remontent pas ce gabarit (seule l'adresse change) : ils ont leurs propres animations.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div className="page">{children}</div>
    </ViewTransition>
  )
}
