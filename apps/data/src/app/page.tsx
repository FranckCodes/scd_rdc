import Image from 'next/image'

// Champs minimaux d'une fiche projet (TDR §9). Aucune donnée n'est inventée :
// la plateforme n'affichera que des fiches sourcées, datées et validées.
const ficheFields = [
  'Intitulé et résumé public',
  'Institution porteuse, partenaires, tutelle',
  'Secteur, province / territoire',
  'Objectifs, période, population cible',
  'Montant et source (si validés et publiables)',
  'Statut : annoncé → clôturé',
  'Résultats et indicateurs',
  'Source, date de mise à jour, statut de validation',
]

export default function DataHome() {
  return (
    <main>
      <header className="bar">
        <Image src="/brand/logo-h-bleu.png" alt="SCD-RDC" width={159} height={48} />
        <a href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}>← Site de la SCD-RDC</a>
      </header>
      <section className="intro">
        <span className="eyebrow">SCD-RDC DATA · V1 en préparation</span>
        <h1>
          Qui finance quoi, où, <strong>pour qui ?</strong>
        </h1>
        <p>
          La cartographie du portefeuille et les fiches projets seront publiées au rythme de la collecte et de la
          validation des données par les institutions sources.
        </p>
      </section>
      <section className="fiche">
        <h2>Contenu d’une fiche projet</h2>
        <ul>
          {ficheFields.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
