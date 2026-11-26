import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { FONT_BASE_URL } from '@scd/ui/fonts'
import '@scd/ui/tokens.css'
import '@scd/ui/motion.css'
import './styles.css'

import { getProjects } from '../lib/projects'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')

export async function generateMetadata(): Promise<Metadata> {
  const { mode } = await getProjects()
  return {
    title: { default: 'SCD-RDC DATA', template: '%s · SCD-RDC DATA' },
    description:
      'Qui finance quoi, où, pour qui ? Le portefeuille de la coopération au développement en RDC, province par province.',
    // Les données d'illustration (projets fictifs) ne doivent jamais être indexées
    robots: mode === 'demo' ? { index: false, follow: false } : undefined,
  }
}

// V1 en français ; les autres langues (EN, ZH, RU, AR) suivront comme sur le site institutionnel.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { mode } = await getProjects()
  return (
    <html lang="fr" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONT_BASE_URL} />
      </head>
      <body>
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        {mode === 'demo' && (
          <p className="demo-banner" role="note">
            <strong>Données d’illustration :</strong> les projets, institutions et montants affichés sont{' '}
            <strong>fictifs</strong>. Ils montrent le fonctionnement de la plateforme et seront remplacés par les
            fiches validées par les institutions porteuses.
          </p>
        )}
        <header className="topbar">
          <div className="topbar__inner">
            <Link href="/" className="topbar__brand" aria-label="SCD-RDC DATA, accueil">
              <Image src="/brand/logo-h-bleu.png" alt="" width={159} height={48} priority />
              <span className="topbar__product" aria-hidden="true">
                DATA
              </span>
            </Link>
            <a className="topbar__back" href={`${SITE_URL}/fr`}>
              <span aria-hidden="true">←</span> Site de la SCD-RDC
            </a>
          </div>
        </header>
        <main id="contenu">{children}</main>
        <footer className="footer">
          <div className="footer__inner">
            <p>
              <strong>SCD-RDC DATA</strong> · Semaine de la Coopération au Développement en RDC. Les fiches sont
              publiées après validation par les institutions sources.
            </p>
            <p>Fond de carte : geoBoundaries, © contributeurs OpenStreetMap (ODbL 1.0).</p>
            <ul className="footer__links">
              <li>
                <Link href="/methodologie">Méthodologie</Link>
              </li>
              <li>
                <a href={`${SITE_URL}/fr/mentions-legales`}>Mentions légales</a>
              </li>
              <li>
                <a href={`${SITE_URL}/fr/confidentialite`}>Confidentialité</a>
              </li>
              <li>
                <a href={`${SITE_URL}/fr/accessibilite`}>Accessibilité</a>
              </li>
            </ul>
          </div>
        </footer>
      </body>
    </html>
  )
}
