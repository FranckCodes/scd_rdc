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
4. **Deploy**.

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

Puis ouvrir `https://<projet>.vercel.app/admin` et **créer le premier compte administrateur**.

### 2.4 Brancher le domaine
Vercel → projet → **Settings → Domains** : ajouter `scd-rdc.org` et `www.scd-rdc.org`
(et `data.scd-rdc.org` sur le projet DATA), puis créer chez le registraire du domaine
les enregistrements DNS indiqués par Vercel. Le certificat HTTPS est automatique.

---

## Faire évoluer le modèle de contenus

Toute modification des collections (`apps/site/src/collections`, `payload.config.ts`) doit être
accompagnée d'une migration, sinon la production ne sera pas à jour :

```bash
cd apps/site
pnpm migrate:create nom-du-changement   # génère src/migrations/<date>_nom-du-changement.ts
```

Valider le fichier de migration avec le code. Il sera appliqué au prochain déploiement.

## Encore à faire avant l'ouverture au public
- **E-mails** des formulaires : configurer un service d'envoi (Resend, SMTP…) — aujourd'hui ils
  sont seulement écrits dans les journaux.
- **Polices** : les auto-héberger plutôt que de les charger depuis Google Fonts.
- **Mesure d'audience** respectueuse de la vie privée (ex. Vercel Web Analytics, sans cookie).
- **Sauvegardes** : vérifier la rétention des sauvegardes Neon selon l'offre choisie.
