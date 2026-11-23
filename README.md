# SCD-RDC — Site web et plateforme de données

Site officiel de la **Semaine de la Coopération au Développement – RDC** (édition inaugurale, Kinshasa, mars 2027 — à confirmer)
et de la plateforme **SCD-RDC DATA**.

- Cahier des charges : `resources/TDR_site_web_plateforme_SCD-RDC.docx`
- Charte graphique : `resources/EMPREINTE DE LA COOPERATION.pdf` — elle fait foi (couleurs, polices)
- Logos officiels : `resources/logos/` (PNG ; fichiers vectoriels encore attendus)
- Direction visuelle retenue : **C2 — Bleu institutionnel**
- Domaine : **scd-rdc.org** (site) et **data.scd-rdc.org** (SCD-RDC DATA) ; contact : info@scd-rdc.org (à confirmer)

### Pages
Accueil · À propos · Programme (filtres jour / composante / thématique) · Salon des projets · Partenariats ·
Presse · Actualités · Participer (5 formulaires, réponse annoncée sous 24 h ouvrées) · Infos pratiques ·
Mentions légales · Confidentialité · Accessibilité.

Les textes institutionnels et juridiques chargés par `pnpm seed` (`apps/site/src/seed/`) sont des
**propositions** : ils s'affichent avec un bandeau « en attente de validation » tant qu'un validateur
n'a pas décoché la case correspondante dans l'administration. Les éléments à compléter sont entre crochets.
Les e-mails des formulaires s'affichent dans la console tant qu'aucun service d'envoi n'est configuré.

## Architecture

```
scd/
├── apps/
│   ├── site/      Site institutionnel + back-office (Next.js 16 + Payload CMS 3) — port 3000
│   └── data/      SCD-RDC DATA, plateforme des projets (Next.js 16, squelette) — port 3001
├── packages/
│   └── ui/        Charte partagée : jetons CSS (couleurs, typographie) et polices
├── resources/     Documents sources (TDR, charte, logos)
└── docker-compose.yml   PostgreSQL de développement
```

### Site institutionnel (`apps/site`)
- **Langues** : français (par défaut), anglais, chinois, russe, arabe (de droite à gauche).
  Adresses : `/fr`, `/en`, `/zh`, `/ru`, `/ar`. `/` redirige selon la langue du navigateur.
- **Back-office** : `/admin` (interface en français). Rôles : administrateur, validateur, éditeur.
- **Contenus** : Pages, Actualités, Sessions du programme, Intervenants, Exposants, Partenaires,
  Documents, Médias, Formulaires (participation, partenaire, exposant, contribution, accréditation).
- **Statut de validation** (TDR §13) : intervenants, sessions, exposants et partenaires portent
  « Confirmé / En attente / À venir ». Seuls admin et validateur peuvent confirmer.
  Les partenaires n'apparaissent que s'ils sont confirmés **et** que leur logo est autorisé.
- **Informations de l'événement** (dates, lieu, chiffres clés, contacts) : réglage global, chaque
  information affichée « à confirmer » tant qu'elle n'est pas validée.

### Textes de l'interface
`apps/site/src/i18n/dictionaries.ts`. ⚠ Les versions EN, ZH, RU, AR sont **provisoires** :
les TDR exigent une traduction humaine avant mise en ligne.

## Démarrer en local

Prérequis : Node 24, pnpm 10, Docker.

```bash
pnpm install
pnpm db:up                      # lance PostgreSQL (port 5433)
cp apps/site/.env.example apps/site/.env   # puis renseigner PAYLOAD_SECRET
pnpm seed                       # charge les textes proposés, les 5 formulaires et les infos de l'événement
pnpm dev                        # site + back-office : http://localhost:3000
pnpm dev:data                   # SCD-RDC DATA : http://localhost:3001
```

Au premier lancement, `/admin` propose de créer le premier compte administrateur.

## Mise en ligne
Voir **[DEPLOIEMENT.md](DEPLOIEMENT.md)** : deux projets Vercel (`apps/site`, `apps/data`), base Neon,
stockage Vercel Blob, migrations appliquées automatiquement au déploiement.

## Notes techniques
- **Payload est figé en 3.91.0** : les versions suivantes exigent Node ≥ 24.22. Mettre Node à jour
  avant de monter de version.
- **Polices** chargées par lien Google Fonts (`packages/ui/fonts.ts`) : `next/font/google` échoue
  sous Turbopack avec Next 16.3. À auto-héberger pour la production.
- **Photos** de `apps/site/public/images` : photos d'illustration Unsplash (crédits affichés),
  à remplacer par les photos officielles autorisées.
