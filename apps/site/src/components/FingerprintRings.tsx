import type React from 'react'

// Motif de l'empreinte : anneaux pointillés inspirés de la charte « Empreinte de la coopération ».
// Élément décoratif, distinct du logo officiel (qui, lui, n'est jamais animé — charte §06).
//
// Signature de mouvement : au chargement, chaque anneau se « dessine » une seule fois,
// du centre vers l'extérieur. Un masque SVG (cercle tracé de 0 à 100 %) révèle le tracé pointillé
// sans le déformer. Animation 100 % CSS (voir .rings__reveal) : immobile et complète
// quand « Réduire les animations » est activé.

const RINGS = [
  { r: 60, dash: '220 30' },
  { r: 100, dash: '380 40 120 30' },
  { r: 140, dash: '520 50 180 40' },
  { r: 180, dash: '700 60 240 50' },
]

export function FingerprintRings({ id, className }: { id: string; className?: string }) {
  return (
    <svg className={className ? `rings ${className}` : 'rings'} aria-hidden="true" focusable="false" viewBox="0 0 400 400" fill="none">
      <defs>
        {RINGS.map((ring, i) => (
          <mask key={ring.r} id={`${id}-${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="400">
            {/* Départ à midi (rotation -90°), tracé dans le sens des aiguilles d'une montre */}
            <circle
              className="rings__reveal"
              style={{ '--i': i } as React.CSSProperties}
              cx="200"
              cy="200"
              r={ring.r}
              stroke="#fff"
              strokeWidth="16"
              pathLength={1}
              transform="rotate(-90 200 200)"
            />
          </mask>
        ))}
      </defs>
      <g stroke="currentColor" strokeWidth="8" strokeLinecap="round">
        {RINGS.map((ring, i) => (
          <circle key={ring.r} cx="200" cy="200" r={ring.r} strokeDasharray={ring.dash} mask={`url(#${id}-${i})`} />
        ))}
      </g>
    </svg>
  )
}
