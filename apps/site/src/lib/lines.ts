/** Champ « un élément par ligne » de l'administration → liste (lignes vides et puces retirées). */
export const toLines = (value?: string | null) =>
  (value ?? '')
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-•*]\s*/, '').trim())
    .filter(Boolean)
