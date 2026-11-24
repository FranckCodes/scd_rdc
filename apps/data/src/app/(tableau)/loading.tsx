// Chargement du tableau de bord : blocs gris immobiles à la place du contenu (aucun effet de brillance),
// qui n'apparaissent qu'après 200 ms pour ne pas clignoter quand la page arrive vite.
export default function Loading() {
  return (
    <div className="loading" aria-busy="true">
      <p className="visually-hidden" role="status">
        Chargement des projets…
      </p>
      <div className="skeleton skeleton--intro" />
      <div className="skeleton skeleton--filters" />
      <div className="skeleton-row">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton skeleton--total" />
        ))}
      </div>
      <div className="skeleton-grid">
        <div className="skeleton skeleton--map" />
        <div className="skeleton-stack">
          <div className="skeleton skeleton--chart" />
          <div className="skeleton skeleton--chart" />
        </div>
      </div>
    </div>
  )
}
