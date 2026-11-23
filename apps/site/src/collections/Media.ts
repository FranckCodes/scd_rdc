import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '../access/roles'

// TDR §11 : photos réelles de la RDC, avec légende, lieu, date, source et droits.
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Média', plural: 'Médias' },
  admin: { group: 'Contenus' },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'alt', label: 'Texte alternatif', type: 'text', required: true, localized: true },
    { name: 'caption', label: 'Légende', type: 'text', localized: true },
    {
      type: 'row',
      fields: [
        { name: 'place', label: 'Lieu', type: 'text' },
        { name: 'date', label: 'Date de prise de vue', type: 'date' },
      ],
    },
    { name: 'credit', label: 'Crédit / auteur', type: 'text', required: true },
    {
      name: 'rightsCleared',
      label: 'Droits de reproduction obtenus',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 640 },
      { name: 'hero', width: 1600 },
    ],
  },
}
