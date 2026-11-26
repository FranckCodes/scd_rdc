import { revalidatePath } from 'next/cache'
import type { Field, GlobalConfig } from 'payload'

import { canValidate } from '../access/roles'

// Offres et Salon (étape 2 de l'analyse : convertir partenaires et exposants).
// Tout ce qui engage l'organisation (contreparties, tarifs, trame du programme, fiches des composantes,
// film) n'apparaît en ligne qu'une fois la case « Validé pour publication » cochée par un compte
// admin ou validateur. Tant que ce n'est pas le cas, le site affiche une mention sobre
// (« contreparties détaillées dans le dossier », « tarif sur demande »…), jamais un contenu inventé.

const validated = (name: string, label = 'Validé pour publication') =>
  ({
    name,
    label,
    type: 'checkbox',
    defaultValue: false,
    access: { update: canValidate },
    admin: { description: 'Réservé aux comptes admin et validateur.' },
  }) as Field

const lines = (name: string, label: string, description?: string) =>
  ({
    name,
    label,
    type: 'textarea',
    localized: true,
    admin: { description: description ?? 'Un élément par ligne.' },
  }) as Field

const offer = (name: string, label: string): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    { name: 'audience', label: 'À qui s’adresse cette offre', type: 'textarea', localized: true },
    lines('benefits', 'Contreparties'),
    lines('modalities', 'Modalités de participation'),
  ],
})

const componentSheet = (name: string, label: string): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    lines('objectives', 'Objectifs'),
    lines('audiences', 'Publics ciblés'),
    lines('results', 'Résultats attendus'),
    lines('contribution', 'Comment contribuer'),
  ],
})

export const Offers: GlobalConfig = {
  slug: 'offers',
  label: 'Offres, Salon et programme prévisionnel',
  admin: { group: 'Partenariats' },
  access: { read: () => true },
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidatePath('/', 'layout')
        } catch {
          // Hors de Next.js (script de chargement des contenus) : rien à régénérer.
        }
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Offres de partenariat',
          fields: [
            offer('institutionnel', 'Partenariat institutionnel'),
            offer('ptf', 'Partenariat technique et financier'),
            offer('sponsor', 'Sponsoring commercial'),
            offer('media', 'Partenariat média'),
            validated('offersValidated', 'Contreparties et modalités validées pour publication'),
          ],
        },
        {
          label: 'Salon des projets',
          fields: [
            {
              name: 'stands',
              label: 'Catégories de stands',
              type: 'array',
              labels: { singular: 'Catégorie de stand', plural: 'Catégories de stands' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', label: 'Catégorie', type: 'text', required: true, localized: true },
                    { name: 'dimensions', label: 'Dimensions (ex. 3 m × 3 m)', type: 'text' },
                    { name: 'price', label: 'Tarif (ex. 1 500 USD)', type: 'text' },
                  ],
                },
                lines('included', 'Prestations incluses'),
                validated('priceApproved', 'Tarif approuvé (sinon « Tarif sur demande »)'),
              ],
            },
            validated('standsValidated', 'Catégories et prestations validées pour publication'),
            lines('advantages', 'Avantages pour les exposants'),
            validated('advantagesValidated', 'Avantages validés pour publication'),
            { name: 'floorPlan', label: 'Plan d’implantation (image)', type: 'upload', relationTo: 'media' },
            validated('floorPlanValidated', 'Plan validé pour publication'),
          ],
        },
        {
          label: 'Programme prévisionnel',
          fields: [
            {
              name: 'provisional',
              label: 'Trame prévisionnelle (par demi-journée)',
              type: 'array',
              labels: { singular: 'Demi-journée', plural: 'Demi-journées' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'day',
                      label: 'Jour',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Jour 1', value: 'j1' },
                        { label: 'Jour 2', value: 'j2' },
                      ],
                    },
                    {
                      name: 'period',
                      label: 'Moment',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Matin', value: 'am' },
                        { label: 'Après-midi', value: 'pm' },
                      ],
                    },
                  ],
                },
                { name: 'title', label: 'Contenu', type: 'text', required: true, localized: true },
              ],
            },
            validated('provisionalPublished', 'Trame validée : publier comme « programme prévisionnel »'),
            {
              type: 'collapsible',
              label: 'Fiches des cinq composantes',
              fields: [
                componentSheet('forum', 'Forum national'),
                componentSheet('salon', 'Salon des projets'),
                componentSheet('agora', 'Agora citoyenne'),
                componentSheet('laboratoire', 'Laboratoire des solutions'),
                componentSheet('trophees', 'Trophées'),
                validated('componentsValidated', 'Fiches des composantes validées pour publication'),
              ],
            },
          ],
        },
        {
          label: 'Film de présentation',
          fields: [
            {
              name: 'videoUrl',
              label: 'Adresse du film',
              type: 'text',
              admin: {
                description:
                  'Lien YouTube (le film est chargé seulement au clic, sans cookie publicitaire) ou adresse directe d’un fichier .mp4. Idéalement 60 à 90 secondes, sous-titré.',
              },
            },
            { name: 'videoPoster', label: 'Image d’attente', type: 'upload', relationTo: 'media' },
            { name: 'videoTitle', label: 'Titre du film', type: 'text', localized: true },
            validated('videoPublished', 'Film validé pour publication'),
          ],
        },
      ],
    },
  ],
}
