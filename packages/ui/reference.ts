// Listes de référence partagées par le site (administration) et SCD-RDC DATA.
// Les valeurs (« id ») sont enregistrées en base : ne pas les modifier une fois des fiches saisies.

/** Les 26 provinces de la RDC (découpage de 2015), avec leur code ISO 3166-2. */
export const PROVINCES = [
  { id: 'bas-uele', iso: 'CD-BU', label: 'Bas-Uele' },
  { id: 'equateur', iso: 'CD-EQ', label: 'Équateur' },
  { id: 'haut-katanga', iso: 'CD-HK', label: 'Haut-Katanga' },
  { id: 'haut-lomami', iso: 'CD-HL', label: 'Haut-Lomami' },
  { id: 'haut-uele', iso: 'CD-HU', label: 'Haut-Uele' },
  { id: 'ituri', iso: 'CD-IT', label: 'Ituri' },
  { id: 'kasai', iso: 'CD-KS', label: 'Kasaï' },
  { id: 'kasai-central', iso: 'CD-KC', label: 'Kasaï-Central' },
  { id: 'kasai-oriental', iso: 'CD-KE', label: 'Kasaï-Oriental' },
  { id: 'kinshasa', iso: 'CD-KN', label: 'Kinshasa' },
  { id: 'kongo-central', iso: 'CD-BC', label: 'Kongo-Central' },
  { id: 'kwango', iso: 'CD-KG', label: 'Kwango' },
  { id: 'kwilu', iso: 'CD-KL', label: 'Kwilu' },
  { id: 'lomami', iso: 'CD-LO', label: 'Lomami' },
  { id: 'lualaba', iso: 'CD-LU', label: 'Lualaba' },
  { id: 'mai-ndombe', iso: 'CD-MN', label: 'Mai-Ndombe' },
  { id: 'maniema', iso: 'CD-MA', label: 'Maniema' },
  { id: 'mongala', iso: 'CD-MO', label: 'Mongala' },
  { id: 'nord-kivu', iso: 'CD-NK', label: 'Nord-Kivu' },
  { id: 'nord-ubangi', iso: 'CD-NU', label: 'Nord-Ubangi' },
  { id: 'sankuru', iso: 'CD-SA', label: 'Sankuru' },
  { id: 'sud-kivu', iso: 'CD-SK', label: 'Sud-Kivu' },
  { id: 'sud-ubangi', iso: 'CD-SU', label: 'Sud-Ubangi' },
  { id: 'tanganyika', iso: 'CD-TA', label: 'Tanganyika' },
  { id: 'tshopo', iso: 'CD-TO', label: 'Tshopo' },
  { id: 'tshuapa', iso: 'CD-TU', label: 'Tshuapa' },
] as const

export type ProvinceId = (typeof PROVINCES)[number]['id']

/** Secteurs (TDR §7) — mêmes valeurs que dans l'administration du site. */
export const SECTORS = [
  { id: 'infrastructures', label: 'Infrastructures' },
  { id: 'energie', label: 'Énergie' },
  { id: 'capital-humain', label: 'Capital humain' },
  { id: 'climat', label: 'Climat' },
  { id: 'agriculture', label: 'Agriculture' },
  { id: 'industrie', label: 'Industrie' },
  { id: 'sante', label: 'Santé' },
  { id: 'territoires', label: 'Territoires' },
  { id: 'culture', label: 'Culture' },
] as const

export type SectorId = (typeof SECTORS)[number]['id']

/** Statut d'avancement d'un projet (TDR §9). */
export const PROJECT_STATUSES = [
  { id: 'annonce', label: 'Annoncé' },
  { id: 'en-preparation', label: 'En préparation' },
  { id: 'finance', label: 'Financé' },
  { id: 'en-execution', label: 'En exécution' },
  { id: 'acheve', label: 'Achevé' },
  { id: 'cloture', label: 'Clôturé' },
] as const

export type ProjectStatusId = (typeof PROJECT_STATUSES)[number]['id']
