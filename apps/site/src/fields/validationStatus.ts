import type { Field } from 'payload'

import { canValidate } from '../access/roles'

// Règle impérative des TDR (§13) : ne jamais présenter une institution, une personnalité,
// un financement ou un partenariat comme acquis sans validation écrite.
// Le site affiche ce statut tel quel ; seul « confirmé » apparaît comme acquis.
export const validationStatusOptions = [
  { label: 'Confirmé', value: 'confirme' },
  { label: 'En attente de confirmation', value: 'en-attente' },
  { label: 'À venir', value: 'a-venir' },
] as const

export type ValidationStatus = (typeof validationStatusOptions)[number]['value']

export const validationStatus: Field = {
  name: 'validationStatus',
  label: 'Statut de validation',
  type: 'select',
  required: true,
  defaultValue: 'en-attente',
  options: [...validationStatusOptions],
  access: { update: canValidate },
  admin: {
    position: 'sidebar',
    description: 'Ne passer à « Confirmé » qu’après validation écrite par le responsable désigné.',
  },
}
