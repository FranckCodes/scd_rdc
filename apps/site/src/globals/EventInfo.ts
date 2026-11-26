import { revalidatePath } from 'next/cache'
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

const dayOnly = { date: { pickerAppearance: 'dayOnly' as const, displayFormat: 'dd/MM/yyyy' } }

export const EventInfo: GlobalConfig = {
  slug: 'event-info',
  label: 'Informations de l’événement',
  admin: { group: 'Administration' },
  access: { read: () => true },
  hooks: {
    // Dates, mode cérémonie… apparaissent sur de nombreuses pages : tout le site est régénéré.
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
      type: 'row',
      fields: [
        { name: 'dates', label: 'Dates', type: 'text', localized: true, defaultValue: 'Mars 2027' },
        confirmed('datesConfirmed'),
      ],
    },
    {
      type: 'collapsible',
      label: 'Calendrier exact (compte à rebours et pastilles « En cours »)',
      admin: {
        description:
          'Le compte à rebours de l’accueil et les pastilles « En cours » du programme n’apparaissent que si ces dates sont saisies ET que les dates sont confirmées officiellement.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'startDate', label: 'Premier jour (Jour 1 du programme)', type: 'date', admin: dayOnly },
            { name: 'endDate', label: 'Dernier jour', type: 'date', admin: dayOnly },
          ],
        },
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
      name: 'ceremonyLive',
      label: 'Cérémonie des Trophées en cours',
      type: 'checkbox',
      defaultValue: false,
      access: { update: canValidate },
      admin: {
        description:
          'À activer pendant la cérémonie seulement : la page Trophées ouverte chez les visiteurs se met à jour d’elle-même et retourne la carte de chaque lauréat dévoilé.',
      },
    },
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
        { name: 'email', label: 'E-mail', type: 'email', defaultValue: 'info@scd-rdc.org' },
        { name: 'phone', label: 'Téléphone', type: 'text' },
        { name: 'address', label: 'Adresse', type: 'textarea', localized: true },
        { name: 'pressName', label: 'Contact presse : nom', type: 'text' },
        { name: 'pressEmail', label: 'Contact presse : e-mail', type: 'email' },
        { name: 'pressPhone', label: 'Contact presse : téléphone', type: 'text' },
        { name: 'delegationsEmail', label: 'Assistance aux délégations : e-mail', type: 'email' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Lieu, accès et hébergement',
      admin: { description: 'Affichés sur « Infos pratiques » et « Délégations internationales » dès qu’ils sont confirmés.' },
      fields: [
        { name: 'venueAddress', label: 'Adresse exacte du lieu', type: 'text', localized: true },
        { name: 'access', label: 'Modalités d’accès (une par ligne)', type: 'textarea', localized: true },
        {
          name: 'hotels',
          label: 'Hôtels partenaires',
          type: 'array',
          labels: { singular: 'Hôtel', plural: 'Hôtels' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', label: 'Nom', type: 'text', required: true },
                { name: 'url', label: 'Site ou lien de réservation', type: 'text' },
              ],
            },
            { name: 'note', label: 'Conditions (tarif négocié, navette…)', type: 'text', localized: true },
            confirmed('confirmed'),
          ],
        },
      ],
    },
    {
      name: 'social',
      label: 'Réseaux sociaux officiels',
      type: 'array',
      labels: { singular: 'Compte', plural: 'Comptes' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'network',
              label: 'Réseau',
              type: 'select',
              required: true,
              options: ['LinkedIn', 'Facebook', 'X', 'Instagram', 'YouTube', 'TikTok', 'WhatsApp'].map((n) => ({ label: n, value: n.toLowerCase() })),
            },
            { name: 'url', label: 'Adresse du compte', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
