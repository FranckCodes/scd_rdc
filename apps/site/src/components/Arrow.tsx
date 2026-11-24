// Flèche décorative des liens « … → » / « ← … ».
// Isolée dans un <span> pour pouvoir glisser au survol, retournée automatiquement en arabe (voir .arrow),
// et masquée aux lecteurs d'écran : le texte du lien suffit.
export function Arrow({ back = false }: { back?: boolean }) {
  return (
    <span className={back ? 'arrow arrow--back' : 'arrow'} aria-hidden="true">
      {back ? '←' : '→'}
    </span>
  )
}
