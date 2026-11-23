import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '../access/roles'

// Actualités, communiqués, appels et annonces presse (TDR §6 « Médias et actualités »).
export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'Actualité', plural: 'Actualités' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'publishedAt', '_status'], group: 'Contenus' },
  versions: { drafts: true },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true, localized: true },
    { name: 'slug', label: 'Adresse (slug)', type: 'text', required: true, unique: true, index: true },
    {
      name: 'category',
      label: 'Catégorie',
      type: 'select',
      required: true,
      options: [
        { label: 'Communiqué', value: 'communique' },
        { label: 'Article', value: 'article' },
        { label: 'Appel', value: 'appel' },
        { label: 'Presse', value: 'presse' },
      ],
    },
    { name: 'publishedAt', label: 'Date de publication', type: 'date', required: true },
    { name: 'excerpt', label: 'Chapô', type: 'textarea', localized: true },
    { name: 'image', label: 'Visuel', type: 'upload', relationTo: 'media' },
    { name: 'content', label: 'Contenu', type: 'richText', localized: true },
  ],
}
