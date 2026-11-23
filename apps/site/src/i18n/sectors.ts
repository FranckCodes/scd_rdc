import type { Locale } from './config'

// Noms des secteurs (TDR §7). Traductions provisoires hors FR — relecture humaine requise.
const sectors: Record<string, Record<Locale, string>> = {
  infrastructures: { fr: 'Infrastructures', en: 'Infrastructure', zh: '基础设施', ru: 'Инфраструктура', ar: 'البنية التحتية' },
  energie: { fr: 'Énergie', en: 'Energy', zh: '能源', ru: 'Энергетика', ar: 'الطاقة' },
  'capital-humain': { fr: 'Capital humain', en: 'Human capital', zh: '人力资本', ru: 'Человеческий капитал', ar: 'رأس المال البشري' },
  climat: { fr: 'Climat', en: 'Climate', zh: '气候', ru: 'Климат', ar: 'المناخ' },
  agriculture: { fr: 'Agriculture', en: 'Agriculture', zh: '农业', ru: 'Сельское хозяйство', ar: 'الزراعة' },
  industrie: { fr: 'Industrie', en: 'Industry', zh: '工业', ru: 'Промышленность', ar: 'الصناعة' },
  sante: { fr: 'Santé', en: 'Health', zh: '卫生', ru: 'Здравоохранение', ar: 'الصحة' },
  territoires: { fr: 'Territoires', en: 'Territories', zh: '地方发展', ru: 'Территории', ar: 'الأقاليم' },
  culture: { fr: 'Culture', en: 'Culture', zh: '文化', ru: 'Культура', ar: 'الثقافة' },
}

export const sectorKeys = Object.keys(sectors)
export const sectorLabel = (key: string, locale: Locale) => sectors[key]?.[locale] ?? key

export const componentKeys = ['forum', 'salon', 'agora', 'laboratoire', 'trophees'] as const
