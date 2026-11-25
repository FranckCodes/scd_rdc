# Déploiement sur Vercel

Deux **projets Vercel séparés**, importés depuis le même dépôt GitHub (`FranckCodes/scd_rdc`).
Ne pas utiliser l'import « multi-service » ni de `vercel.json` : le site et SCD-RDC DATA ont chacun
leur domaine et ne s'appellent pas l'un l'autre.

| Projet Vercel | Root Directory | Domaine |
|---|---|---|
| `scd-rdc-site` | `apps/site` | scd-rdc.org (+ www.scd-rdc.org) |
| `scd-rdc-data` | `apps/data` | data.scd-rdc.org |

> Plan Vercel : le plan **Hobby** est réservé à un usage personnel et non commercial.
> Pour un site institutionnel, vérifier les conditions et prévoir le plan **Pro** si nécessaire.

---

## 1. Projet `scd-rdc-data` (simple, à faire en premier)

1. Vercel → **Add New… → Project** → importer `FranckCodes/scd_rdc`.
2. **Root Directory** : `apps/data` (Framework : Next.js, détecté).
3. Variable d'environnement : `NEXT_PUBLIC_SITE_URL` = `https://scd-rdc.org`
   (DATA y lit aussi les fiches projets validées). Facultatif : `SITE_API_URL` si l'API du site
   doit être lue à une autre adresse (par exemple l'adresse `…vercel.app` du site tant que
   `scd-rdc.org` n'est pas branché).
4. **Deploy**.

> Ne jamais définir `DATA_DEMO` sur Vercel : cette variable n'active la démonstration (projets
> fictifs) que sur un ordinateur, via `apps/data/.env.local`, et elle est de toute façon refusée sur Vercel.

## 2. Projet `scd-rdc-site`

### 2.1 Créer les services
Dans Vercel → onglet **Storage** (place de marché) :
- **Neon (Postgres)** → créer une base, la relier au projet. Vercel ajoute `DATABASE_URL`.
- **Blob** → créer un store, le relier au projet. Vercel ajoute `BLOB_READ_WRITE_TOKEN`.

### 2.2 Importer le projet
1. **Add New… → Project** → `FranckCodes/scd_rdc` → **Root Directory** : `apps/site`.
2. Variables d'environnement (Production **et** Preview) :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | ajoutée par Neon (vérifier `?sslmode=require`) |
| `BLOB_READ_WRITE_TOKEN` | ajoutée par Vercel Blob |
| `PAYLOAD_SECRET` | chaîne aléatoire longue, **différente** de celle du local (`openssl rand -hex 32`) |
| `NEXT_PUBLIC_SERVER_URL` | `https://scd-rdc.org` |
| `NEXT_PUBLIC_DATA_URL` | `https://data.scd-rdc.org` |

3. **Deploy**. Vercel lance automatiquement le script `vercel-build` :
   `payload migrate` (crée/actualise les tables) **puis** `next build`.

### 2.3 Charger les contenus de départ (une seule fois)
Depuis ton poste, en pointant temporairement vers la base Neon :

```bash
cd apps/site
DATABASE_URL="<url Neon>" pnpm seed
```

Depuis le 25/11/2026, ce chargement ne modifie plus le schéma de la base en ligne : seules les
migrations le font (au déploiement). Puis ouvrir `https://<projet>.vercel.app/admin` et **créer le premier compte administrateur**.

### 2.4 Brancher le domaine
Vercel → projet → **Settings → Domains** : ajouter `scd-rdc.org` et `www.scd-rdc.org`
(et `data.scd-rdc.org` sur le projet DATA), puis créer chez le registraire du domaine
les enregistrements DNS indiqués par Vercel. Le certificat HTTPS est automatique.

---

## 3. E-mails des formulaires (Resend)

Chaque demande envoyée par un formulaire déclenche deux e-mails : une **notification** à
`info@scd-rdc.org` (avec « Répondre à » = le demandeur) et un **accusé de réception** au demandeur
(« réponse sous 24 heures ouvrées »). L'expédition passe par **Resend**.

### 3.1 Compte et domaine
1. Créer un compte sur https://resend.com.
2. **Domains → Add Domain** → `scd-rdc.org` (région : Europe si proposée).
3. Resend affiche des enregistrements DNS à créer. Les ajouter chez **Hostinger**
   (hPanel → Domaines → scd-rdc.org → DNS → Gérer les enregistrements DNS), **à l'identique** :
   - un **TXT** `resend._domainkey` (DKIM) ;
   - un **MX** et un **TXT** sur le sous-domaine `send` (SPF d'envoi).

   Ils se placent sur des sous-domaines dédiés : ils **ne touchent pas** aux enregistrements MX
   et SPF de la messagerie Hostinger de `scd-rdc.org`.
4. Revenir dans Resend → **Verify DNS Records** → attendre le statut **Verified**.
5. **API Keys → Create API Key** (permission : *Sending access*, domaine : `scd-rdc.org`).
   Copier la clé (elle commence par `re_` et ne s'affiche qu'une fois).

### 3.2 Variables Vercel (projet du site)
| Variable | Valeur |
|---|---|
| `RESEND_API_KEY` | la clé `re_…` |
| `EMAIL_FROM_ADDRESS` | `noreply@scd-rdc.org` |
| `EMAIL_FROM_NAME` | `SCD-RDC` |

Puis **Redeploy**. Tester en envoyant un formulaire : la notification doit arriver dans la boîte
`info@scd-rdc.org` (vérifier que cette boîte existe bien chez Hostinger) et l'accusé de réception
chez l'expéditeur.

### 3.3 Destinataires
Les adresses de notification se modifient dans l'administration :
**Formulaires → [formulaire] → E-mails**. On peut y mettre l'adresse de la commission concernée
(partenariats, presse…) et ajouter des destinataires en copie.

> Les formulaires chargés avant l'ajout de Resend n'ont pas le « Répondre à » automatique : dans
> chaque formulaire, ouvrir le premier e-mail (notification) et mettre `{{email}}` dans **Reply To**.

## Recharger les contenus de départ
`pnpm seed` ne crée que ce qui manque et **n'écrase jamais** un contenu existant. Pour tout
réinitialiser (perte des modifications faites dans l'administration) : `SEED_FORCE=1 pnpm seed`.

---

## Faire évoluer le modèle de contenus

Toute modification des collections (`apps/site/src/collections`, `payload.config.ts`) doit être
accompagnée d'une migration, sinon la production ne sera pas à jour :

```bash
cd apps/site
pnpm migrate:create nom-du-changement   # génère src/migrations/<date>_nom-du-changement.ts
```

Valider le fichier de migration avec le code. Il sera appliqué au prochain déploiement.

## Publier une fiche projet sur SCD-RDC DATA
1. Administration du site → **Projets (SCD-RDC DATA)** → créer la fiche (source et date de mise à jour obligatoires).
2. Cocher « Montant et source validés et publiables » seulement si l'institution l'a autorisé par écrit.
3. Renseigner « Objectifs de développement durable (ODD) concernés » **uniquement** selon la déclaration
   de l'institution porteuse : la fiche apparaît alors dans la grille ODD de DATA (et via la section ODD de l'accueil).
4. Un compte **admin** ou **validateur** passe le statut de validation à **Confirmé**.
5. La fiche apparaît sur `data.scd-rdc.org` en 5 minutes au plus. Repasser une fiche à « En attente »
   la retire de DATA dans le même délai.

Démonstration locale avec des projets fictifs : créer `apps/data/.env.local` contenant `DATA_DEMO=1`,
puis `pnpm --filter data dev` (http://localhost:3001). Un bandeau jaune rappelle que tout est fictif.

## Organisateurs (« Organisé par »)
Les quatre cabinets organisateurs (CBS SARL, NKOSI ADVISORY, CABINET DEBRE INT’L, BANTU EXPERTISE) sont
créés par `pnpm seed` dans *Partenariats → Partenaires*, catégorie **Organisateur**. Ils s'affichent sur
l'accueil et la page À propos, jamais dans la liste des partenaires. Sans logo, leur nom s'affiche.
- **En local** : déposer les logos dans `resources/logos/organisateurs/` (un fichier par cabinet, nom
  contenant `cbs`, `nkosi`, `debre` ou `bantu`), puis relancer `pnpm seed`.
- **En ligne** : ouvrir la fiche dans l'administration et charger le logo dans « Logo officiel ».
  Si l'on passe plutôt par `pnpm seed` vers Neon, définir aussi `BLOB_READ_WRITE_TOKEN`, sinon les
  fichiers restent sur le poste.

## Gouvernance et organisation (`/fr/gouvernance`)
Administration → *Contenus → Gouvernance et organisation* : une fiche par personne, institution ou commission,
rattachée à son instance (entité porteuse, comité de patronage, comité d'organisation, secrétariat exécutif,
commissions spécialisées). Une fiche n'apparaît en ligne (page et API) qu'au statut **Confirmé** : ne confirmer
une personnalité qu'après sa désignation officielle **et** son accord écrit. Une instance sans fiche confirmée
affiche « Composition communiquée après confirmation officielle ».

## Temps forts de l'événement
- **Compte à rebours (accueil)** : administration → *Informations de l’événement* → saisir le premier et
  le dernier jour, puis un compte validateur coche « Confirmé officiellement » pour les dates. Sans ces
  deux conditions, rien ne s'affiche. Pendant l'événement, il devient « En cours · Jour 1 ».
- **Pastilles « En cours » (programme)** : automatiques pour les sessions qui ont un jour (Jour 1 / Jour 2)
  et des heures de début et de fin, à l'heure de Kinshasa (format `09:30`).
- **Trophées** (`/fr/trophees`) : une fiche par catégorie dans *Programme → Trophées*. Le lauréat reste
  invisible en ligne (pages et API) tant que « Lauréat dévoilé » n'est pas coché.
  Le jour de la cérémonie :
  1. cocher « Cérémonie des Trophées en cours » dans *Informations de l’événement* ;
  2. au moment de chaque annonce, cocher « Lauréat dévoilé » sur la catégorie : la carte se retourne
     d'elle-même chez les visiteurs (15 s au plus) ;
  3. décocher « Cérémonie des Trophées en cours » à la fin.

## Encore à faire avant l'ouverture au public
- **Polices** : les auto-héberger plutôt que de les charger depuis Google Fonts.
- **Mesure d'audience** respectueuse de la vie privée (ex. Vercel Web Analytics, sans cookie).
- **Sauvegardes** : vérifier la rétention des sauvegardes Neon selon l'offre choisie.
