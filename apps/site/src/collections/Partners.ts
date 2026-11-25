import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '../access/roles'
import { validationStatus } from '../fields/validationStatus'

// TDR §11 et §13 : aucun logo partenaire sans autorisation ; hiérarchie validée.
export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: 'Partenaire', plural: 'Partenaires' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'tier', 'validationStatus'], group: 'Partenariats' },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    {
      name: 'tier',
      label: 'Catégorie',
      type: 'select',
      admin: { description: '« Organisateur » : affiché dans « Organisé par » (accueil et À propos), pas dans la liste des partenaires.' },
      options: [
        { label: 'Organisateur', value: 'organisateur' },
        { label: 'Institutionnel', value: 'institutionnel' },
        { label: 'Partenaire technique et financier', value: 'ptf' },
        { label: 'Sponsor', value: 'sponsor' },
        { label: 'Média', value: 'media' },
      ],
    },
    { name: 'logo', label: 'Logo officiel', type: 'upload', relationTo: 'media' },
    { name: 'url', label: 'Site web', type: 'text' },
    { name: 'order', label: 'Ordre d’affichage', type: 'number', defaultValue: 100 },
    {
      name: 'logoAuthorized',
      label: 'Autorisation écrite d’utiliser le logo reçue',
      type: 'checkbox',
      defaultValue: false,
    },
    validationStatus,
  ],
}
