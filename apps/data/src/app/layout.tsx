import type { Metadata } from 'next'
import React from 'react'

import { FONT_BASE_URL } from '@scd/ui/fonts'
import '@scd/ui/tokens.css'
import '@scd/ui/motion.css'
import './styles.css'

export const metadata: Metadata = {
  title: 'SCD-RDC DATA',
  description: 'Le portefeuille de la coopération au développement en RDC, province par province.',
}

// Squelette : les langues (FR, EN, ZH, RU, AR) seront ajoutées comme sur le site institutionnel.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONT_BASE_URL} />
      </head>
      <body>{children}</body>
    </html>
  )
}
