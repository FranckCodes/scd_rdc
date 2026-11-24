import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="notice" aria-labelledby="introuvable-titre">
      <h1 id="introuvable-titre">Fiche introuvable</h1>
      <p>Cette fiche n’existe pas ou n’est plus publiée.</p>
      <p>
        <Link href="/">
          <span aria-hidden="true">←</span> Tous les projets
        </Link>
      </p>
    </section>
  )
}
