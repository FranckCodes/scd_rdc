import React from 'react'

import { FingerprintRings } from './FingerprintRings'

// Bandeau bleu marine en tête des pages intérieures (direction C2).
export function PageHeader({ title, intro, eyebrow, children }: { title: string; intro?: string | null; eyebrow?: string; children?: React.ReactNode }) {
  return (
    <section className="page-header">
      <FingerprintRings id="band-rings" className="page-header__rings" />
      <div className="container page-header__inner">
        {eyebrow && <span className="eyebrow eyebrow--light">{eyebrow}</span>}
        <h1 className="page-header__title">{title}</h1>
        {intro && <p className="lead">{intro}</p>}
        {children}
      </div>
    </section>
  )
}

export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="notice" role="note">
      {children}
    </div>
  )
}

export function StatusBadge({ status, label }: { status: string; label: string }) {
  return <span className={`status status--${status}`}>{label}</span>
}
