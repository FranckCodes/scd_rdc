import React, { ViewTransition } from 'react'

// Transition entre les pages (animations, phase 3) — View Transitions de React 19.3, sans configuration.
// Le template est recréé à chaque navigation (contrairement au layout) : l'ancienne page « sort »
// (fondu de 150 ms) pendant que la nouvelle « entre » (fondu + léger glissement, 250 ms).
// L'en-tête, hors du template, reste en place. Chaque page sort et entre là où elle est affichée :
// aucun glissement vertical, même après avoir fait défiler.
// Navigateur sans View Transitions ou « Réduire les animations » : la page change instantanément.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  )
}
