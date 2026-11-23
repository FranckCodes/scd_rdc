import type { CollectionConfig } from 'payload'

import { anyone, canValidate, loggedIn } from '../access/roles'

// Pages éditoriales simples : À propos, Infos pratiques, Mentions légales, etc.
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', '_status'], group: 'Contenus' },
  versions: { drafts: true },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      label: 'Adresse (slug)',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Ex. : a-propos, infos-pratiques, mentions-legales' },
    },
    {
      name: 'proposal',
      label: 'Texte proposé — en attente de validation institutionnelle',
      type: 'checkbox',
      defaultValue: true,
      access: { update: canValidate },
      admin: {
        position: 'sidebar',
        description: 'Tant que cette case est cochée, le site affiche un bandeau « proposition en attente de validation ».',
      },
    },
    { name: 'intro', label: 'Introduction', type: 'textarea', localized: true },
    { name: 'content', label: 'Contenu', type: 'richText', localized: true },
    {
      name: 'meta',
      label: 'Référencement',
      type: 'group',
      fields: [
        { name: 'title', label: 'Titre SEO', type: 'text', localized: true },
        { name: 'description', label: 'Description SEO', type: 'textarea', localized: true },
      ],
    },
  ],
}
