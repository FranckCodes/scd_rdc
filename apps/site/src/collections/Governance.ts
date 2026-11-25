import { revalidatePath } from 'next/cache'
import type { Access, CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from 'payload'

import { loggedIn } from '../access/roles'
import { validationStatus } from '../fields/validationStatus'

// Gouvernance et organisation (analyse professionnelle, nov. 2026 : « qui organise, sous quelle gouvernance »).
// Règle : aucun nom n'est publié sans validation. Le public ne lit que les fiches « Confirmé » ;
// une personnalité (ex. l'Ambassadeur chargé des relations diplomatiques) n'est confirmée qu'après
// sa désignation officielle ET son accord.

export const GOVERNANCE_BODIES = [
  { value: 'entite', label: 'Entité porteuse' },
  { value: 'patronage', label: 'Comité de patronage' },
  { value: 'organisation', label: 'Comité d’organisation' },
  { value: 'secretariat', label: 'Secrétariat exécutif' },
  { value: 'commissions', label: 'Commissions spécialisées' },
] as const

export type GovernanceBody = (typeof GOVERNANCE_BODIES)[number]['value']

const publicReadsConfirmedOnly: Access = ({ req }) => (req.user ? true : { validationStatus: { equals: 'confirme' } })

function refreshGovernancePage() {
  try {
    revalidatePath('/[locale]/gouvernance', 'page')
  } catch {
    // Hors de Next.js (script de chargement des contenus) : rien à régénérer.
  }
}

const afterChange: CollectionAfterChangeHook = ({ doc }) => {
  refreshGovernancePage()
  return doc
}
const afterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  refreshGovernancePage()
  return doc
}

export const Governance: CollectionConfig = {
  slug: 'governance',
  labels: { singular: 'Membre / instance', plural: 'Gouvernance et organisation' },
  defaultSort: 'order',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'body', 'role', 'validationStatus'],
    group: 'Contenus',
    description:
      'Publié sur la page « Gouvernance et organisation » uniquement au statut « Confirmé ». Ne confirmer une personne qu’après sa désignation officielle et son accord écrit.',
  },
  access: { read: publicReadsConfirmedOnly, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: { afterChange: [afterChange], afterDelete: [afterDelete] },
  fields: [
    {
      name: 'body',
      label: 'Instance',
      type: 'select',
      required: true,
      options: GOVERNANCE_BODIES.map((b) => ({ label: b.label, value: b.value })),
    },
    { name: 'name', label: 'Nom (personne, institution ou commission)', type: 'text', required: true },
    { name: 'role', label: 'Fonction / qualité', type: 'text', localized: true },
    { name: 'organization', label: 'Institution d’appartenance', type: 'text' },
    { name: 'description', label: 'Mission ou responsabilités', type: 'textarea', localized: true },
    { name: 'photo', label: 'Photo (autorisée)', type: 'upload', relationTo: 'media' },
    { name: 'email', label: 'Contact institutionnel (facultatif)', type: 'email' },
    { name: 'order', label: 'Ordre d’affichage', type: 'number', defaultValue: 100 },
    validationStatus,
  ],
}
