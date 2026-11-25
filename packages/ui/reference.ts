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

/**
 * Les 17 Objectifs de développement durable (ONU) : numéro, couleur officielle, intitulé court officiel
 * dans les 5 langues du site. Icônes officielles : /images/odd/<langue>/<NN>.webp (site) et /odd/… (DATA),
 * source un.org/sustainabledevelopment, usage informatif, sans modification.
 */
export const SDGS = [
  { id: '1', color: '#E5243B', fr: 'Pas de pauvreté', en: 'No poverty', zh: '无贫穷', ru: 'Ликвидация нищеты', ar: 'القضاء على الفقر' },
  { id: '2', color: '#DDA63A', fr: 'Faim « zéro »', en: 'Zero hunger', zh: '零饥饿', ru: 'Ликвидация голода', ar: 'القضاء التام على الجوع' },
  { id: '3', color: '#4C9F38', fr: 'Bonne santé et bien-être', en: 'Good health and well-being', zh: '良好健康与福祉', ru: 'Хорошее здоровье и благополучие', ar: 'الصحة الجيدة والرفاه' },
  { id: '4', color: '#C5192D', fr: 'Éducation de qualité', en: 'Quality education', zh: '优质教育', ru: 'Качественное образование', ar: 'التعليم الجيد' },
  { id: '5', color: '#FF3A21', fr: 'Égalité entre les sexes', en: 'Gender equality', zh: '性别平等', ru: 'Гендерное равенство', ar: 'المساواة بين الجنسين' },
  { id: '6', color: '#26BDE2', fr: 'Eau propre et assainissement', en: 'Clean water and sanitation', zh: '清洁饮水和卫生设施', ru: 'Чистая вода и санитария', ar: 'المياه النظيفة والنظافة الصحية' },
  { id: '7', color: '#FCC30B', fr: 'Énergie propre et d’un coût abordable', en: 'Affordable and clean energy', zh: '经济适用的清洁能源', ru: 'Недорогостоящая и чистая энергия', ar: 'طاقة نظيفة وبأسعار معقولة' },
  { id: '8', color: '#A21942', fr: 'Travail décent et croissance économique', en: 'Decent work and economic growth', zh: '体面工作和经济增长', ru: 'Достойная работа и экономический рост', ar: 'العمل اللائق ونمو الاقتصاد' },
  { id: '9', color: '#FD6925', fr: 'Industrie, innovation et infrastructure', en: 'Industry, innovation and infrastructure', zh: '产业、创新和基础设施', ru: 'Индустриализация, инновации и инфраструктура', ar: 'الصناعة والابتكار والهياكل الأساسية' },
  { id: '10', color: '#DD1367', fr: 'Inégalités réduites', en: 'Reduced inequalities', zh: '减少不平等', ru: 'Уменьшение неравенства', ar: 'الحد من أوجه عدم المساواة' },
  { id: '11', color: '#FD9D24', fr: 'Villes et communautés durables', en: 'Sustainable cities and communities', zh: '可持续城市和社区', ru: 'Устойчивые города и населённые пункты', ar: 'مدن ومجتمعات محلية مستدامة' },
  { id: '12', color: '#BF8B2E', fr: 'Consommation et production responsables', en: 'Responsible consumption and production', zh: '负责任消费和生产', ru: 'Ответственное потребление и производство', ar: 'الاستهلاك والإنتاج المسؤولان' },
  { id: '13', color: '#3F7E44', fr: 'Mesures relatives à la lutte contre les changements climatiques', en: 'Climate action', zh: '气候行动', ru: 'Борьба с изменением климата', ar: 'العمل المناخي' },
  { id: '14', color: '#0A97D9', fr: 'Vie aquatique', en: 'Life below water', zh: '水下生物', ru: 'Сохранение морских экосистем', ar: 'الحياة تحت الماء' },
  { id: '15', color: '#56C02B', fr: 'Vie terrestre', en: 'Life on land', zh: '陆地生物', ru: 'Сохранение экосистем суши', ar: 'الحياة في البر' },
  { id: '16', color: '#00689D', fr: 'Paix, justice et institutions efficaces', en: 'Peace, justice and strong institutions', zh: '和平、正义与强大机构', ru: 'Мир, правосудие и эффективные институты', ar: 'السلام والعدل والمؤسسات القوية' },
  { id: '17', color: '#19486A', fr: 'Partenariats pour la réalisation des objectifs', en: 'Partnerships for the goals', zh: '促进目标实现的伙伴关系', ru: 'Партнёрство в интересах устойчивого развития', ar: 'عقد الشراكات لتحقيق الأهداف' },
] as const

export type SdgId = (typeof SDGS)[number]['id']
export type SdgLocale = 'fr' | 'en' | 'zh' | 'ru' | 'ar'

/** Chemin de l'icône officielle (le site ajoute le préfixe /images). */
export const sdgIcon = (id: SdgId, locale: SdgLocale = 'fr') => `/odd/${locale}/${id.padStart(2, '0')}.webp`
