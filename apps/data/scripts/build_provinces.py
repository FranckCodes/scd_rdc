"""Convertit le tracé des 26 provinces (GeoJSON geoBoundaries / OpenStreetMap) en tracés SVG légers.

Source : geoBoundaries, jeu « gbOpen COD ADM1 » (2017, 26 provinces), fichier
geoBoundaries-COD-ADM1_simplified.geojson — https://github.com/wmgeolab/geoBoundaries
Données © contributeurs OpenStreetMap, licence ODbL 1.0 (mention obligatoire sous la carte).

Usage (le fichier téléchargé est une donnée externe : le garder dans son propre dossier) :
    python -I build_provinces.py <chemin/geoBoundaries-COD-ADM1_simplified.geojson> <sortie.ts>

Traitement : projection équirectangulaire corrigée de la latitude moyenne (écart négligeable à cette
échelle), simplification Douglas-Peucker, suppression des îlots minuscules, coordonnées arrondies.
Pour chaque province, le script calcule aussi son cadre (zoom de la carte) et un point intérieur
éloigné des bords (ancrage de l'info-bulle).
"""

import json
import math
import sys

# Code ISO 3166-2 → identifiant enregistré en base (voir packages/ui/reference.ts)
ISO_TO_ID = {
    'CD-BU': 'bas-uele', 'CD-EQ': 'equateur', 'CD-HK': 'haut-katanga', 'CD-HL': 'haut-lomami',
    'CD-HU': 'haut-uele', 'CD-IT': 'ituri', 'CD-KS': 'kasai', 'CD-KC': 'kasai-central',
    'CD-KE': 'kasai-oriental', 'CD-KN': 'kinshasa', 'CD-BC': 'kongo-central', 'CD-KG': 'kwango',
    'CD-KL': 'kwilu', 'CD-LO': 'lomami', 'CD-LU': 'lualaba', 'CD-MN': 'mai-ndombe',
    'CD-MA': 'maniema', 'CD-MO': 'mongala', 'CD-NK': 'nord-kivu', 'CD-NU': 'nord-ubangi',
    'CD-SA': 'sankuru', 'CD-SK': 'sud-kivu', 'CD-SU': 'sud-ubangi', 'CD-TA': 'tanganyika',
    'CD-TO': 'tshopo', 'CD-TU': 'tshuapa',
}

WIDTH = 1000.0          # largeur du viewBox SVG
TOLERANCE_DEG = 0.012   # tolérance de simplification (~1,3 km)
MIN_RING_AREA = 0.25    # en unités SVG² : îlots plus petits ignorés


def polygons(geometry):
    if geometry['type'] == 'Polygon':
        return [geometry['coordinates']]
    if geometry['type'] == 'MultiPolygon':
        return geometry['coordinates']
    raise ValueError(geometry['type'])


def perpendicular_distance(p, a, b):
    if a == b:
        return math.dist(p, a)
    (x, y), (x1, y1), (x2, y2) = p, a, b
    return abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) / math.dist(a, b)


def douglas_peucker(points, tolerance):
    if len(points) < 3:
        return points
    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        start, end = stack.pop()
        best, index = 0.0, None
        for i in range(start + 1, end):
            d = perpendicular_distance(points[i], points[start], points[end])
            if d > best:
                best, index = d, i
        if index is not None and best > tolerance:
            keep[index] = True
            stack.append((start, index))
            stack.append((index, end))
    return [p for p, k in zip(points, keep) if k]


def ring_area(points):
    return abs(sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(points, points[1:] + points[:1]))) / 2


def inside(point, ring):
    x, y = point
    result = False
    for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1]):
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            result = not result
    return result


def edge_distance(point, ring):
    def segment(p, a, b):
        (px, py), (ax, ay), (bx, by) = p, a, b
        dx, dy = bx - ax, by - ay
        if dx == 0 and dy == 0:
            return math.dist(p, a)
        t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
        return math.dist(p, (ax + t * dx, ay + t * dy))
    return min(segment(point, a, b) for a, b in zip(ring, ring[1:] + ring[:1]))


def label_point(ring):
    """Point intérieur le plus éloigné des bords (recherche sur grille, puis affinage)."""
    xs, ys = [p[0] for p in ring], [p[1] for p in ring]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    best, best_d = ((x0 + x1) / 2, (y0 + y1) / 2), -1.0
    step = max(x1 - x0, y1 - y0) / 24
    cx, cy, span = (x0 + x1) / 2, (y0 + y1) / 2, max(x1 - x0, y1 - y0) / 2
    for _ in range(3):
        n = int(2 * span / step) + 1
        for i in range(n + 1):
            for j in range(n + 1):
                p = (cx - span + i * step, cy - span + j * step)
                if inside(p, ring):
                    d = edge_distance(p, ring)
                    if d > best_d:
                        best, best_d = p, d
        cx, cy, span, step = best[0], best[1], step * 2, step / 6
    return best


def main(source, target):
    data = json.load(open(source, encoding='utf8'))
    features = data['features']
    lons = [pt[0] for f in features for poly in polygons(f['geometry']) for ring in poly for pt in ring]
    lats = [pt[1] for f in features for poly in polygons(f['geometry']) for ring in poly for pt in ring]
    lon_min, lon_max, lat_min, lat_max = min(lons), max(lons), min(lats), max(lats)
    k = math.cos(math.radians((lat_min + lat_max) / 2))
    scale = WIDTH / ((lon_max - lon_min) * k)
    height = (lat_max - lat_min) * scale

    def project(pt):
        return ((pt[0] - lon_min) * k * scale, (lat_max - pt[1]) * scale)

    out, total_points = [], 0
    for f in features:
        iso = f['properties']['shapeISO']
        pid = ISO_TO_ID[iso]
        parts, kept, outer_rings = [], [], []
        for poly in polygons(f['geometry']):
            for index, ring in enumerate(poly):
                simplified = douglas_peucker([tuple(p) for p in ring[:-1]], TOLERANCE_DEG)
                projected = [project(p) for p in simplified]
                if len(projected) < 3 or ring_area(projected) < MIN_RING_AREA:
                    continue
                total_points += len(projected)
                kept.extend(projected)
                if index == 0:
                    outer_rings.append(projected)
                parts.append('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in projected) + 'Z')
        xs, ys = [p[0] for p in kept], [p[1] for p in kept]
        box = (min(xs), min(ys), max(xs) - min(xs), max(ys) - min(ys))
        label = label_point(max(outer_rings, key=ring_area))
        out.append({'id': pid, 'iso': iso, 'd': ''.join(parts), 'box': box, 'label': label})

    out.sort(key=lambda p: p['id'])
    lines = [
        '// Fichier généré par apps/data/scripts/build_provinces.py — ne pas modifier à la main.',
        '// Tracé des 26 provinces : geoBoundaries (gbOpen COD ADM1, 2017),',
        '// données © contributeurs OpenStreetMap, licence ODbL 1.0.',
        f'export const MAP_VIEWBOX = {{ width: {WIDTH:.0f}, height: {height:.0f} }}',
        '',
        '/** box : cadre [x, y, largeur, hauteur] ; label : point intérieur [x, y] (unités du viewBox). */',
        'export const PROVINCE_PATHS: {',
        '  id: string',
        '  iso: string',
        '  box: [number, number, number, number]',
        '  label: [number, number]',
        '  d: string',
        '}[] = [',
    ]
    for p in out:
        box = ', '.join(f'{v:.1f}' for v in p['box'])
        label = ', '.join(f'{v:.1f}' for v in p['label'])
        lines.append(f"  {{ id: '{p['id']}', iso: '{p['iso']}', box: [{box}], label: [{label}], d: '{p['d']}' }},")
    lines.append(']')
    lines.append('')
    open(target, 'w', encoding='utf8', newline='\n').write('\n'.join(lines))
    print(f'{len(out)} provinces, {total_points} points, viewBox 0 0 {WIDTH:.0f} {height:.0f}')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
