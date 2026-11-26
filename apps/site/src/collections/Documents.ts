import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '../access/roles'

// Ressources téléchargeables : dossier institutionnel, notes, rapports, kit presse (TDR §6, §8.1).
export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Document', plural: 'Documents' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'kind', 'language'], group: 'Contenus' },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true, localized: true },
    {
      name: 'kind',
      label: 'Type',
      type: 'select',
      options: [
        { label: 'Dossier institutionnel', value: 'dossier' },
        { label: 'Dossier de partenariat et de sponsoring', value: 'dossier-partenariat' },
        { label: 'Dossier exposant', value: 'dossier-exposant' },
        { label: 'Note conceptuelle', value: 'note' },
        { label: 'Programme', value: 'programme' },
        { label: 'Rapport', value: 'rapport' },
        { label: 'Communiqué', value: 'communique' },
        { label: 'Kit presse', value: 'kit-presse' },
        { label: 'Dossier de presse', value: 'dossier-presse' },
        { label: 'Logos haute définition', value: 'logos' },
        { label: 'Charte graphique', value: 'charte' },
        { label: 'Formulaire', value: 'formulaire' },
      ],
    },
    {
      name: 'language',
      label: 'Langue du document',
      type: 'select',
      options: ['fr', 'en', 'zh', 'ru', 'ar'].map((l) => ({ label: l.toUpperCase(), value: l })),
    },
    { name: 'version', label: 'Version / date', type: 'text' },
  ],
  upload: {
    mimeTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.*', 'application/zip', 'application/x-zip-compressed'],
  },
}
