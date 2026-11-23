import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '../access/roles'
import { validationStatus } from '../fields/validationStatus'

// Répertoire des intervenants (TDR §8.1) : fiches et biographies validées.
export const Speakers: CollectionConfig = {
  slug: 'speakers',
  labels: { singular: 'Intervenant', plural: 'Intervenants' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'organization', 'validationStatus'], group: 'Programme' },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'name', label: 'Nom complet', type: 'text', required: true },
    { name: 'role', label: 'Fonction', type: 'text', localized: true },
    { name: 'organization', label: 'Institution / organisation', type: 'text' },
    { name: 'photo', label: 'Photo', type: 'upload', relationTo: 'media' },
    { name: 'bio', label: 'Biographie validée', type: 'textarea', localized: true },
    validationStatus,
  ],
}
