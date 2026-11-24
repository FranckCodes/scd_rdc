// Classes de la carte choroplèthe : nombre de projets par province, de 1 à 5 teintes.
// Jusqu'à 5 projets, une teinte par valeur ; au-delà, 5 classes d'amplitude égale.
// Les teintes utilisées sont réparties sur toute la gamme pour rester bien distinctes.

export type Bucket = { level: number; min: number; max: number }

export function buildBuckets(maxCount: number): Bucket[] {
  if (maxCount <= 0) return []
  const ranges: [number, number][] =
    maxCount <= 5
      ? Array.from({ length: maxCount }, (_, i): [number, number] => [i + 1, i + 1])
      : [1, 2, 3, 4, 5].map((k): [number, number] => [
          Math.round((maxCount * (k - 1)) / 5) + 1,
          Math.round((maxCount * k) / 5),
        ])
  const n = ranges.length
  return ranges.map(([min, max], i) => ({ min, max, level: n === 1 ? 4 : Math.round(1 + (i * 4) / (n - 1)) }))
}

export function levelFor(count: number, buckets: Bucket[]) {
  if (count <= 0) return 0
  return buckets.find((b) => count >= b.min && count <= b.max)?.level ?? buckets.at(-1)?.level ?? 0
}

export const bucketLabel = (bucket: Bucket) =>
  bucket.min === bucket.max ? String(bucket.min) : `${bucket.min}–${bucket.max}`
