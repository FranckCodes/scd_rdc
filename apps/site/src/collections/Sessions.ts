import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '../access/roles'
import { componentOptions, sectorOptions } from '../fields/options'
import { validationStatus } from '../fields/validationStatus'

// Programme dynamique filtrable par jour, salle, composante et thématique (TDR §8.1).
export const Sessions: CollectionConfig = {
  slug: 'sessions',
  labels: { singular: 'Session', plural: 'Sessions du programme' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'component', 'day', 'startTime', 'validationStatus'],
    group: 'Programme',
  },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'title', label: 'Intitulé', type: 'text', required: true, localized: true },
    { name: 'component', label: 'Composante', type: 'select', required: true, options: componentOptions },
    { name: 'sectors', label: 'Thématiques', type: 'select', hasMany: true, options: sectorOptions },
    {
      type: 'row',
      fields: [
        {
          name: 'day',
          label: 'Jour',
          type: 'select',
          options: [
            { label: 'Jour 1', value: 'j1' },
            { label: 'Jour 2', value: 'j2' },
          ],
        },
        { name: 'startTime', label: 'Début', type: 'text', admin: { placeholder: '09:30' } },
        { name: 'endTime', label: 'Fin', type: 'text', admin: { placeholder: '11:00' } },
        { name: 'room', label: 'Salle', type: 'text' },
      ],
    },
    { name: 'description', label: 'Description', type: 'textarea', localized: true },
    { name: 'speakers', label: 'Intervenants', type: 'relationship', relationTo: 'speakers', hasMany: true },
    validationStatus,
  ],
}
