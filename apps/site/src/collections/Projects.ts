import type { Access, CollectionConfig, FieldAccess } from 'payload'

import { PROJECT_STATUSES, PROVINCES } from '@scd/ui/reference'

import { loggedIn } from '../access/roles'
import { sectorOptions } from '../fields/options'
import { validationStatus } from '../fields/validationStatus'

// Fiches projets de SCD-RDC DATA — champs minimaux du TDR §9.
// Règles impératives :
//  - aucune donnée n'est publiée sans validation : le public (et donc SCD-RDC DATA) ne lit que les fiches
//    au statut « Confirmé » ; les comptes connectés voient tout ;
//  - le montant et la source de financement ne sont lisibles publiquement que s'ils sont déclarés publiables ;
//  - aucune donnée personnelle ou sensible ne doit être saisie ici.

const publicReadsValidatedOnly: Access = ({ req }) => (req.user ? true : { validationStatus: { equals: 'confirme' } })

const fundingVisible: FieldAccess = ({ req, doc }) => Boolean(req.user) || doc?.fundingPublishable === true

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Projet', plural: 'Projets (SCD-RDC DATA)' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'sector', 'province', 'status', 'validationStatus', 'updatedOn'],
    group: 'SCD-RDC DATA',
    description:
      'Fiches publiées sur data.scd-rdc.org uniquement au statut « Confirmé ». Ne jamais inventer ni arrondir une donnée : chaque fiche cite sa source et sa date de mise à jour.',
  },
  access: { read: publicReadsValidatedOnly, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    // Identification
    { name: 'title', label: 'Intitulé', type: 'text', required: true, localized: true },
    { name: 'slug', label: 'Adresse (slug)', type: 'text', required: true, unique: true, index: true },
    { name: 'summary', label: 'Résumé accessible au public', type: 'textarea', required: true, localized: true },
    {
      type: 'row',
      fields: [
        { name: 'institution', label: 'Institution porteuse', type: 'text', required: true },
        { name: 'partners', label: 'Partenaires (si publiable)', type: 'text' },
        { name: 'supervision', label: 'Tutelle (si publiable)', type: 'text' },
      ],
    },
    // Localisation et thématique
    {
      type: 'row',
      fields: [
        { name: 'sector', label: 'Secteur', type: 'select', required: true, options: sectorOptions },
        {
          name: 'province',
          label: 'Province',
          type: 'select',
          required: true,
          options: PROVINCES.map((p) => ({ label: p.label, value: p.id })),
        },
        { name: 'location', label: 'Localisation publiable', type: 'text', admin: { description: 'Territoire, ville… sans précision sensible.' } },
      ],
    },
    // Contenu
    { name: 'objectives', label: 'Objectifs', type: 'textarea', localized: true },
    {
      type: 'row',
      fields: [
        { name: 'periodStart', label: 'Début', type: 'date', admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MM/yyyy' } } },
        { name: 'periodEnd', label: 'Fin', type: 'date', admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MM/yyyy' } } },
        { name: 'targetPopulation', label: 'Population cible', type: 'text', localized: true },
      ],
    },
    {
      name: 'status',
      label: 'Statut du projet',
      type: 'select',
      required: true,
      defaultValue: 'annonce',
      options: PROJECT_STATUSES.map((s) => ({ label: s.label, value: s.id })),
    },
    // Financement (publié seulement si validé et publiable)
    {
      type: 'collapsible',
      label: 'Financement',
      fields: [
        {
          name: 'fundingPublishable',
          label: 'Montant et source validés et publiables',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          type: 'row',
          fields: [
            { name: 'amount', label: 'Montant', type: 'number', min: 0, access: { read: fundingVisible } },
            {
              name: 'currency',
              label: 'Devise',
              type: 'select',
              defaultValue: 'USD',
              options: ['USD', 'CDF', 'EUR'].map((c) => ({ label: c, value: c })),
              access: { read: fundingVisible },
            },
            { name: 'fundingSource', label: 'Source de financement', type: 'text', access: { read: fundingVisible } },
          ],
        },
      ],
    },
    // Résultats
    {
      name: 'results',
      label: 'Résultats et indicateurs',
      type: 'array',
      fields: [
        { name: 'indicator', label: 'Indicateur', type: 'text', required: true, localized: true },
        { name: 'value', label: 'Valeur', type: 'text', required: true },
        { name: 'period', label: 'Période', type: 'text' },
        { name: 'source', label: 'Source', type: 'text', required: true },
      ],
    },
    // Traçabilité (TDR §9 : date de mise à jour, source et statut de validation)
    {
      type: 'row',
      fields: [
        { name: 'dataSource', label: 'Source de la fiche', type: 'text', required: true, admin: { description: 'Institution qui a fourni et validé les informations.' } },
        { name: 'updatedOn', label: 'Date de mise à jour', type: 'date', required: true },
      ],
    },
    validationStatus,
  ],
}
