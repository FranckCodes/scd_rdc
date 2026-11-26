import { revalidatePath } from 'next/cache'
import type { Access, CollectionAfterChangeHook, CollectionConfig } from 'payload'

import { loggedIn } from '../access/roles'
import { validationStatus } from '../fields/validationStatus'

// « Pays et coopérations à l'honneur » (analyse, étape 3). Une coopération n'est présentée
// qu'avec l'accord du pays ou de l'institution concernés : le public ne lit que les fiches « Confirmé ».
const publicReadsConfirmedOnly: Access = ({ req }) => (req.user ? true : { validationStatus: { equals: 'confirme' } })

const refresh: CollectionAfterChangeHook = ({ doc }) => {
  try {
    revalidatePath('/[locale]/cooperation', 'page')
  } catch {
    // Hors de Next.js : rien à régénérer.
  }
  return doc
}

export const Cooperations: CollectionConfig = {
  slug: 'cooperations',
  labels: { singular: 'Coopération à l’honneur', plural: 'Pays et coopérations à l’honneur' },
  defaultSort: 'order',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'validationStatus'],
    group: 'Partenariats',
    description: 'Publié uniquement au statut « Confirmé », avec l’accord écrit du pays ou de l’institution présentés.',
  },
  access: { read: publicReadsConfirmedOnly, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: { afterChange: [refresh] },
  fields: [
    { name: 'name', label: 'Pays ou institution', type: 'text', required: true, localized: true },
    { name: 'summary', label: 'La coopération en quelques lignes', type: 'textarea', localized: true },
    { name: 'source', label: 'Source des informations', type: 'text' },
    { name: 'photo', label: 'Photo (droits obtenus)', type: 'upload', relationTo: 'media' },
    { name: 'url', label: 'Lien officiel', type: 'text' },
    { name: 'order', label: 'Ordre d’affichage', type: 'number', defaultValue: 100 },
    validationStatus,
  ],
}
