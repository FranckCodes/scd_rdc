import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Méthodologie',
  description:
    'Comment SCD-RDC DATA collecte, vérifie, publie et met à jour les fiches projets de la coopération au développement en RDC.',
}

// Méthodologie publique (analyse professionnelle, étape 2) : elle décrit les règles réellement appliquées
// par le code (statut « Confirmé », montants publiables, sources et dates obligatoires).
const STEPS = [
  {
    title: '1. Collecte',
    text: [
      'Les fiches sont fournies par les institutions porteuses des projets (ministères, agences, partenaires techniques et financiers) ou saisies par l’équipe SCD-RDC à partir de leurs documents officiels.',
      'Chaque fiche suit les champs minimaux des termes de référence : intitulé, résumé, institution, secteur, province, objectifs, période, population cible, statut d’avancement, résultats, objectifs de développement durable concernés.',
      'Aucune donnée personnelle ou sensible n’est collectée.',
    ],
  },
  {
    title: '2. Vérification',
    text: [
      'Une fiche reste « en attente » tant que l’institution source ne l’a pas validée. Seul un compte validateur de l’équipe peut la passer au statut « Confirmé ».',
      'Chaque fiche indique obligatoirement sa source et sa date de mise à jour.',
      'Le montant et la source de financement ne sont affichés que si l’institution a autorisé leur publication par écrit. Les montants restent dans leur devise d’origine, sans conversion ni arrondi.',
    ],
  },
  {
    title: '3. Publication',
    text: [
      'Seules les fiches au statut « Confirmé » sont publiées ; la plateforme le vérifie une seconde fois à l’affichage.',
      'Une fiche validée apparaît sur SCD-RDC DATA en cinq minutes au plus.',
      'La carte compte les projets selon leur province de rattachement (26 provinces, découpage de 2015). Les objectifs de développement durable sont ceux que déclare l’institution porteuse.',
    ],
  },
  {
    title: '4. Mise à jour et corrections',
    text: [
      'Les institutions sont invitées à actualiser leurs fiches au moins à chaque édition de la SCD-RDC.',
      'Une fiche repassée « en attente » (erreur, information à revoir) disparaît de la plateforme dans le même délai de cinq minutes.',
      'Pour signaler une erreur ou proposer une fiche, écrivez à l’équipe SCD-RDC : la demande est examinée sous 24 heures ouvrées.',
    ],
  },
  {
    title: '5. Limites',
    text: [
      'SCD-RDC DATA est en version pilote : la couverture des provinces et des secteurs s’élargit au fur et à mesure des validations et ne prétend pas, à ce stade, à l’exhaustivité.',
      'Les totaux affichés ne portent que sur les fiches publiées et les montants déclarés publiables.',
    ],
  },
]

export default function MethodologyPage() {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')
  return (
    <article className="methodology">
      <header className="intro">
        <span className="eyebrow">SCD-RDC DATA · Version pilote</span>
        <h1>
          Méthodologie : <strong>collecte, vérification, mise à jour</strong>
        </h1>
        <p>
          Qui finance quoi, où, pour qui ? Pour répondre sans jamais inventer ni présenter comme vérifiée une donnée qui
          ne l’est pas, chaque fiche suit le même parcours.
        </p>
      </header>
      <div className="methodology__steps">
        {STEPS.map((step) => (
          <section key={step.title} className="panel">
            <h2>{step.title}</h2>
            <ul>
              {step.text.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="methodology__links">
        <Link href="/">← Retour au tableau de bord</Link>
        <a href={`${site}/fr/participer/contribution`}>Signaler une erreur ou proposer une fiche</a>
      </p>
    </article>
  )
}
