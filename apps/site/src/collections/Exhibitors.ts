import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '../access/roles'
import { sectorOptions } from '../fields/options'
import { validationStatus } from '../fields/validationStatus'

// Exposants du Salon des projets (TDR §6).
export const Exhibitors: CollectionConfig = {
  slug: 'exhibitors',
  labels: { singular: 'Exposant', plural: 'Exposants' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'sector', 'province', 'validationStatus'], group: 'Programme' },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'name', label: 'Organisation', type: 'text', required: true },
    { name: 'project', label: 'Projet présenté', type: 'text', localized: true },
    { name: 'sector', label: 'Secteur', type: 'select', options: sectorOptions },
    { name: 'province', label: 'Province', type: 'text' },
    { name: 'summary', label: 'Résumé', type: 'textarea', localized: true },
    { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media' },
    validationStatus,
  ],
}
