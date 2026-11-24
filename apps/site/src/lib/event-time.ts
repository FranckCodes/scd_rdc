// Heure de l'événement : Kinshasa (UTC+1 toute l'année, sans heure d'été).
// Ces calculs servent au serveur (premier affichage) et au navigateur (mises à jour) : mêmes résultats partout,
// quel que soit le fuseau horaire du visiteur.

const KINSHASA_OFFSET_MS = 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

const kinshasaTime = (date: Date | string) => (typeof date === 'string' ? Date.parse(date) : date.getTime()) + KINSHASA_OFFSET_MS

/** Jour calendaire à Kinshasa, compté en jours depuis le 1er janvier 1970. */
export function kinshasaDayNumber(date: Date | string) {
  return Math.floor(kinshasaTime(date) / DAY_MS)
}

/** Minutes écoulées depuis minuit, heure de Kinshasa. */
export function kinshasaMinutes(date: Date) {
  return Math.floor((((kinshasaTime(date) % DAY_MS) + DAY_MS) % DAY_MS) / 60_000)
}

/** Millisecondes jusqu'au prochain minuit à Kinshasa (le compte à rebours change une fois par jour). */
export function msUntilKinshasaMidnight(date: Date) {
  return DAY_MS - (((kinshasaTime(date) % DAY_MS) + DAY_MS) % DAY_MS)
}

export type EventPhase = { kind: 'before'; days: number } | { kind: 'during'; day: number } | { kind: 'after' }

/** Avant (nombre de jours restants), pendant (numéro du jour) ou après l'événement. */
export function eventPhase(now: Date, start: string, end?: string | null): EventPhase {
  const today = kinshasaDayNumber(now)
  const first = kinshasaDayNumber(start)
  const last = end ? Math.max(first, kinshasaDayNumber(end)) : first
  if (today < first) return { kind: 'before', days: first - today }
  if (today <= last) return { kind: 'during', day: today - first + 1 }
  return { kind: 'after' }
}

/** « 09:30 », « 9h30 », « 14h » → minutes depuis minuit ; null si l'heure est illisible. */
export function parseClock(value?: string | null) {
  const match = value?.trim().match(/^(\d{1,2})\s*[:hH.]\s*(\d{2})?$/)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2] ?? 0)
  return hours < 24 && minutes < 60 ? hours * 60 + minutes : null
}

/** Session en cours : bon jour (Jour 1 = premier jour de l'événement) et heure comprise entre début et fin. */
export function isSessionLive(
  now: Date,
  eventStart: string,
  dayIndex: number,
  startTime?: string | null,
  endTime?: string | null,
) {
  const from = parseClock(startTime)
  const to = parseClock(endTime)
  if (from === null || to === null || to <= from) return false
  if (kinshasaDayNumber(now) !== kinshasaDayNumber(eventStart) + dayIndex - 1) return false
  const minutes = kinshasaMinutes(now)
  return minutes >= from && minutes < to
}
