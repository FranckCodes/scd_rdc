import type { GlobalConfig } from 'payload'

import { canValidate } from '../access/roles'

// Informations clés de l'événement, affichées sur l'accueil et les infos pratiques.
// Chaque information porte son statut : tant qu'elle n'est pas confirmée, le site affiche « à confirmer ».
const confirmed = (name: string) => ({
  name,
  label: 'Confirmé officiellement',
  type: 'checkbox' as const,
  defaultValue: false,
  access: { update: canValidate },
})

export const EventInfo: GlobalConfig = {
  slug: 'event-info',
  label: 'Informations de l’événement',
  admin: { group: 'Administration' },
  access: { read: () => true },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'dates', label: 'Dates', type: 'text', localized: true, defaultValue: 'Mars 2027' },
        confirmed('datesConfirmed'),
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'city', label: 'Ville', type: 'text', localized: true, defaultValue: 'Kinshasa' },
        { name: 'venue', label: 'Site / lieu', type: 'text', localized: true },
        confirmed('venueConfirmed'),
      ],
    },
    { name: 'format', label: 'Format', type: 'text', localized: true, defaultValue: '2 jours · 250–300 décideurs' },
    {
      name: 'keyFigures',
      label: 'Chiffres clés (sourcés et datés)',
      type: 'array',
      fields: [
        { name: 'value', label: 'Valeur', type: 'text', required: true },
        { name: 'label', label: 'Libellé', type: 'text', required: true, localized: true },
        { name: 'source', label: 'Source', type: 'text', required: true },
        { name: 'provisional', label: 'Prévisionnel', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      name: 'contact',
      label: 'Contacts officiels',
      type: 'group',
      fields: [
        { name: 'email', label: 'E-mail', type: 'email', defaultValue: 'info@scd.rdc.org' },
        { name: 'phone', label: 'Téléphone', type: 'text' },
        { name: 'address', label: 'Adresse', type: 'textarea', localized: true },
      ],
    },
  ],
}
