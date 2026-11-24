import { revalidatePath } from 'next/cache'
import type { Access, CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig, FieldAccess } from 'payload'

import { canValidate, loggedIn } from '../access/roles'
import { validationStatus } from '../fields/validationStatus'

// Trophées (5e composante de la SCD-RDC). Règles :
// - le public ne voit que les catégories confirmées ;
// - le lauréat reste absent des pages ET de l'API tant que sa catégorie n'est pas « dévoilée » :
//   rien ne peut fuiter avant l'annonce, même en lisant le code de la page ;
// - seuls les comptes admin et validateur peuvent dévoiler un lauréat, pendant la cérémonie.

const publicReadsConfirmedOnly: Access = ({ req }) => (req.user ? true : { validationStatus: { equals: 'confirme' } })

const laureateVisible: FieldAccess = ({ req, doc }) => Boolean(req.user) || doc?.revealed === true

// La page Trophées est régénérée dès qu'une fiche change : un lauréat dévoilé apparaît en quelques secondes.
function refreshTrophiesPage() {
  try {
    revalidatePath('/[locale]/trophees', 'page')
  } catch {
    // Hors de Next.js (script de chargement des contenus) : rien à régénérer.
  }
}

const afterChange: CollectionAfterChangeHook = ({ doc }) => {
  refreshTrophiesPage()
  return doc
}

const afterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  refreshTrophiesPage()
  return doc
}

export const Trophies: CollectionConfig = {
  slug: 'trophies',
  labels: { singular: 'Trophée', plural: 'Trophées' },
  defaultSort: 'order',
  admin: {
    useAsTitle: 'category',
    defaultColumns: ['category', 'order', 'revealed', 'validationStatus'],
    group: 'Programme',
    description:
      'Une fiche par catégorie. Le lauréat reste confidentiel (invisible en ligne) jusqu’à ce que « Lauréat dévoilé » soit coché pendant la cérémonie.',
  },
  access: { read: publicReadsConfirmedOnly, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: { afterChange: [afterChange], afterDelete: [afterDelete] },
  fields: [
    { name: 'category', label: 'Catégorie', type: 'text', required: true, localized: true },
    { name: 'description', label: 'Ce que récompense ce trophée', type: 'textarea', localized: true },
    {
      name: 'laureate',
      label: 'Lauréat (confidentiel jusqu’à l’annonce)',
      type: 'group',
      access: { read: laureateVisible },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', label: 'Nom du lauréat', type: 'text' },
            { name: 'organisation', label: 'Institution / organisation', type: 'text' },
          ],
        },
        { name: 'summary', label: 'Présentation', type: 'textarea', localized: true },
        { name: 'photo', label: 'Photo (droits d’utilisation obtenus)', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'order', label: 'Ordre d’affichage', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    {
      name: 'revealed',
      label: 'Lauréat dévoilé',
      type: 'checkbox',
      defaultValue: false,
      access: { update: canValidate },
      admin: {
        position: 'sidebar',
        description: 'À cocher au moment de l’annonce, pendant la cérémonie : le lauréat apparaît alors en ligne.',
      },
    },
    validationStatus,
  ],
}
