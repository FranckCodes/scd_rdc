import type { CountdownLabels } from '../components/Countdown'
import type { Locale } from './config'

// Textes de l'interface du site public.
// ⚠ Les versions EN, ZH, RU et AR sont des traductions PROVISOIRES pour le développement.
// Les TDR (§12) exigent une traduction humaine : faire relire avant toute mise en ligne.
// Les contenus éditoriaux (actualités, pages, programme…) se traduisent dans l'administration.

export type Dictionary = {
  nav: { about: string; programme: string; salon: string; data: string; partnerships: string; press: string; practical: string }
  ui: { menu: string; language: string; toConfirm: string; skip: string; mainNav: string; siteMap: string }
  cta: { participate: string; interest: string; partner: string; programme: string; data: string }
  hero: { eyebrow: string; titleLight: string; titleBold: string; positioning: string; lead: string; photoCredit: string }
  info: { dates: string; place: string; format: string }
  countdown: CountdownLabels
  components: {
    titleLight: string
    titleBold: string
    items: { title: string; text: string }[]
  }
  data: {
    eyebrow: string
    titleLight: string
    titleBold: string
    text: string
    sample: string
    note: string
  }
  organisers: { title: string; empty: string }
  sdgs: { titleLight: string; titleBold: string; text: string; link: string }
  partners: { titleLight: string; titleBold: string; note: string; empty: string; sought: string; soughtText: string }
  news: { title: string; empty: string; all: string }
  footer: { tagline: string; legal: string; privacy: string; accessibility: string }
}

const fr: Dictionary = {
  nav: {
    about: 'À propos',
    programme: 'Programme',
    salon: 'Salon des projets',
    data: 'SCD-RDC DATA',
    partnerships: 'Partenariats',
    press: 'Presse',
    practical: 'Infos pratiques',
  },
  ui: { menu: 'Menu', language: 'Langue', toConfirm: 'à confirmer', skip: 'Aller au contenu', mainNav: 'Navigation principale', siteMap: 'Plan du site' },
  cta: {
    participate: 'Participer',
    interest: 'Manifester son intérêt',
    partner: 'Devenir partenaire',
    programme: 'Voir le programme',
    data: 'Découvrir la plateforme',
  },
  hero: {
    eyebrow: 'Édition inaugurale',
    titleLight: 'La coopération au développement, ',
    titleBold: 'visible, coordonnée et utile.',
    positioning: 'Une plateforme nationale de dialogue, de partenariat, de valorisation des projets et de redevabilité.',
    lead: 'Institutions, partenaires techniques et financiers, secteur privé et société civile réunis autour d’une exigence commune : rendre compte des résultats.',
    photoCredit: 'Masina, Kinshasa · Kaysha / Unsplash',
  },
  info: { dates: 'Dates', place: 'Lieu', format: 'Format' },
  countdown: {
    number: 'J-{n}',
    label: { one: 'avant l’ouverture', other: 'avant l’ouverture' },
    spoken: { one: 'Ouverture dans {n} jour', other: 'Ouverture dans {n} jours' },
    live: 'En cours',
    day: 'Jour {n}',
  },
  components: {
    titleLight: 'Cinq composantes, ',
    titleBold: 'un programme',
    items: [
      { title: 'Forum national', text: 'Dialogue de haut niveau sur les priorités nationales.' },
      { title: 'Salon des projets', text: 'Environ 20 pavillons de démonstration.' },
      { title: 'Agora citoyenne', text: 'La voix des bénéficiaires et de la société civile.' },
      { title: 'Laboratoire des solutions', text: 'Innovations et bonnes pratiques.' },
      { title: 'Trophées', text: 'Les résultats probants, distingués.' },
    ],
  },
  data: {
    eyebrow: 'SCD-RDC DATA · Version pilote',
    titleLight: 'Qui finance quoi, où, ',
    titleBold: 'pour qui ?',
    text: 'Le portefeuille de la coopération, province par province. Fiches sourcées, datées et validées.',
    sample: 'projets phares',
    note: 'Chaque fiche indique sa source, sa date de mise à jour et son statut de validation.',
  },
  sdgs: {
    titleLight: 'La coopération au service des ',
    titleBold: 'Objectifs de développement durable',
    text: 'Chaque projet présenté sur SCD-RDC DATA indique les objectifs auxquels il contribue, selon la déclaration de l’institution qui le porte. Choisissez un objectif pour voir les projets concernés.',
    link: 'Explorer les projets par objectif',
  },
  organisers: { title: 'Organisé par', empty: 'Organisateurs en cours de confirmation.' },
  partners: {
    titleLight: 'Ils s’engagent ',
    titleBold: 'à nos côtés',
    note: 'Les logos sont publiés uniquement après validation écrite de chaque institution.',
    empty: 'Partenaires en attente de confirmation.', sought: 'Catégories de partenaires recherchées', soughtText: 'Les premiers partenaires seront présentés ici dès réception de leur accord écrit. Le dossier de partenariat détaille les contreparties de chaque catégorie.',
  },
  news: { title: 'Actualités', empty: 'Les premières actualités seront publiées prochainement.', all: 'Tout voir' },
  footer: {
    tagline: '« Coopérer pour développer, rendre compte pour transformer. »',
    legal: 'Mentions légales',
    privacy: 'Confidentialité',
    accessibility: 'Accessibilité',
  },
}

const en: Dictionary = {
  nav: {
    about: 'About',
    programme: 'Programme',
    salon: 'Projects Fair',
    data: 'SCD-RDC DATA',
    partnerships: 'Partnerships',
    press: 'Press',
    practical: 'Practical information',
  },
  ui: { menu: 'Menu', language: 'Language', toConfirm: 'to be confirmed', skip: 'Skip to content', mainNav: 'Main navigation', siteMap: 'Site map' },
  cta: {
    participate: 'Take part',
    interest: 'Express interest',
    partner: 'Become a partner',
    programme: 'See the programme',
    data: 'Explore the platform',
  },
  hero: {
    eyebrow: 'Inaugural edition',
    titleLight: 'Development cooperation, ',
    titleBold: 'visible, coordinated and useful.',
    positioning: 'A national platform for dialogue, partnership, project showcasing and accountability.',
    lead: 'Institutions, technical and financial partners, the private sector and civil society brought together by a shared commitment: accounting for results.',
    photoCredit: 'Masina, Kinshasa · Kaysha / Unsplash',
  },
  info: { dates: 'Dates', place: 'Venue', format: 'Format' },
  countdown: {
    number: '{n}',
    label: { one: 'day to go', other: 'days to go' },
    spoken: { one: 'Opening in {n} day', other: 'Opening in {n} days' },
    live: 'Live now',
    day: 'Day {n}',
  },
  components: {
    titleLight: 'Five components, ',
    titleBold: 'one programme',
    items: [
      { title: 'National Forum', text: 'High-level dialogue on national priorities.' },
      { title: 'Projects Fair', text: 'Around 20 demonstration pavilions.' },
      { title: 'Citizens’ Agora', text: 'The voice of beneficiaries and civil society.' },
      { title: 'Solutions Lab', text: 'Innovations and good practices.' },
      { title: 'Awards', text: 'Proven results, recognised.' },
    ],
  },
  data: {
    eyebrow: 'SCD-RDC DATA · Pilot version',
    titleLight: 'Who funds what, where, ',
    titleBold: 'for whom?',
    text: 'The cooperation portfolio, province by province. Sourced, dated and validated project sheets.',
    sample: 'flagship projects',
    note: 'Each sheet states its source, last update and validation status.',
  },
  sdgs: {
    titleLight: 'Cooperation serving the ',
    titleBold: 'Sustainable Development Goals',
    text: 'Each project on SCD-RDC DATA shows the goals it contributes to, as declared by the institution that leads it. Choose a goal to see the related projects.',
    link: 'Explore projects by goal',
  },
  organisers: { title: 'Organised by', empty: 'Organisers being confirmed.' },
  partners: {
    titleLight: 'Partners ',
    titleBold: 'at our side',
    note: 'Logos are published only after written approval from each institution.',
    empty: 'Partners awaiting confirmation.', sought: 'Partner categories we are looking for', soughtText: 'The first partners will be presented here as soon as their written approval is received. The partnership pack details the benefits of each category.',
  },
  news: { title: 'News', empty: 'The first news items will be published soon.', all: 'See all' },
  footer: {
    tagline: '“Cooperate to develop, account to transform.”',
    legal: 'Legal notice',
    privacy: 'Privacy',
    accessibility: 'Accessibility',
  },
}

const zh: Dictionary = {
  nav: { about: '关于', programme: '议程', salon: '项目展', data: 'SCD-RDC DATA', partnerships: '合作伙伴', press: '媒体', practical: '实用信息' },
  ui: { menu: '菜单', language: '语言', toConfirm: '待确认', skip: '跳至内容', mainNav: '主导航', siteMap: '网站地图' },
  cta: { participate: '参加', interest: '表达参与意向', partner: '成为合作伙伴', programme: '查看议程', data: '探索平台' },
  hero: {
    eyebrow: '首届',
    titleLight: '发展合作，',
    titleBold: '可见、协调、有效。',
    positioning: '一个集对话、合作、项目展示与问责于一体的国家级平台。',
    lead: '政府机构、技术与资金伙伴、私营部门和民间社会齐聚一堂，共同致力于对成果负责。',
    photoCredit: 'Masina, Kinshasa · Kaysha / Unsplash',
  },
  info: { dates: '日期', place: '地点', format: '形式' },
  countdown: { number: '{n}', label: { other: '天后开幕' }, spoken: { other: '{n}天后开幕' }, live: '正在进行', day: '第{n}天' },
  components: {
    titleLight: '五个板块，',
    titleBold: '一个议程',
    items: [
      { title: '国家论坛', text: '围绕国家优先事项的高级别对话。' },
      { title: '项目展', text: '约20个展示馆。' },
      { title: '公民广场', text: '受益者与民间社会的声音。' },
      { title: '解决方案实验室', text: '创新与良好实践。' },
      { title: '奖项', text: '表彰成效显著的举措。' },
    ],
  },
  data: {
    eyebrow: 'SCD-RDC DATA · 试点版',
    titleLight: '谁资助什么、在哪里、',
    titleBold: '为了谁？',
    text: '按省份呈现的合作项目组合。项目信息均注明来源、日期并经过核实。',
    sample: '重点项目',
    note: '每份项目信息均注明来源、更新日期及核实状态。',
  },
  sdgs: {
    titleLight: '合作助力',
    titleBold: '可持续发展目标',
    text: 'SCD-RDC DATA 上的每个项目都标明其所贡献的目标（以项目牵头机构的申报为准）。选择一个目标即可查看相关项目。',
    link: '按目标浏览项目',
  },
  organisers: { title: '主办单位', empty: '主办单位待确认。' },
  partners: { titleLight: '与我们', titleBold: '同行的伙伴', note: '各机构书面同意后方可发布其标志。', empty: '合作伙伴待确认。', sought: '我们寻求的合作伙伴类别', soughtText: '首批合作伙伴在收到其书面同意后将在此展示。合作手册详细介绍了各类别的权益。' },
  news: { title: '新闻', empty: '首批新闻即将发布。', all: '查看全部' },
  footer: { tagline: '“合作促发展，问责促变革。”', legal: '法律声明', privacy: '隐私', accessibility: '无障碍' },
}

const ru: Dictionary = {
  nav: {
    about: 'О неделе',
    programme: 'Программа',
    salon: 'Выставка проектов',
    data: 'SCD-RDC DATA',
    partnerships: 'Партнёрство',
    press: 'Пресса',
    practical: 'Практическая информация',
  },
  ui: { menu: 'Меню', language: 'Язык', toConfirm: 'уточняется', skip: 'Перейти к содержанию', mainNav: 'Основная навигация', siteMap: 'Карта сайта' },
  cta: {
    participate: 'Участвовать',
    interest: 'Заявить об интересе',
    partner: 'Стать партнёром',
    programme: 'Смотреть программу',
    data: 'Открыть платформу',
  },
  hero: {
    eyebrow: 'Первая неделя',
    titleLight: 'Сотрудничество в целях развития — ',
    titleBold: 'прозрачное, согласованное и полезное.',
    positioning: 'Национальная платформа для диалога, партнёрства, представления проектов и подотчётности.',
    lead: 'Государственные институты, технические и финансовые партнёры, частный сектор и гражданское общество объединены общей задачей: отчитываться о результатах.',
    photoCredit: 'Masina, Kinshasa · Kaysha / Unsplash',
  },
  info: { dates: 'Даты', place: 'Место', format: 'Формат' },
  countdown: {
    number: '{n}',
    label: { one: 'день до открытия', few: 'дня до открытия', many: 'дней до открытия', other: 'дня до открытия' },
    spoken: { one: 'До открытия {n} день', few: 'До открытия {n} дня', many: 'До открытия {n} дней', other: 'До открытия {n} дня' },
    live: 'Идёт сейчас',
    day: 'День {n}',
  },
  components: {
    titleLight: 'Пять направлений — ',
    titleBold: 'одна программа',
    items: [
      { title: 'Национальный форум', text: 'Диалог высокого уровня о национальных приоритетах.' },
      { title: 'Выставка проектов', text: 'Около 20 демонстрационных павильонов.' },
      { title: 'Гражданская агора', text: 'Голос получателей помощи и гражданского общества.' },
      { title: 'Лаборатория решений', text: 'Инновации и лучшие практики.' },
      { title: 'Премии', text: 'Признание доказанных результатов.' },
    ],
  },
  data: {
    eyebrow: 'SCD-RDC DATA · пилотная версия',
    titleLight: 'Кто что финансирует, где, ',
    titleBold: 'для кого?',
    text: 'Портфель сотрудничества по провинциям. Карточки проектов с источником, датой и статусом проверки.',
    sample: 'ключевых проектов',
    note: 'В каждой карточке указаны источник, дата обновления и статус проверки.',
  },
  sdgs: {
    titleLight: 'Сотрудничество во имя ',
    titleBold: 'Целей устойчивого развития',
    text: 'Для каждого проекта на SCD-RDC DATA указаны цели, которым он способствует, по заявлению ведущей организации. Выберите цель, чтобы увидеть связанные проекты.',
    link: 'Проекты по целям',
  },
  organisers: { title: 'Организаторы', empty: 'Организаторы уточняются.' },
  partners: {
    titleLight: 'Наши ',
    titleBold: 'партнёры',
    note: 'Логотипы публикуются только после письменного согласия каждой организации.',
    empty: 'Партнёры ожидают подтверждения.', sought: 'Категории партнёров, которых мы ищем', soughtText: 'Первые партнёры будут представлены здесь после получения их письменного согласия. В партнёрском пакете описаны преимущества каждой категории.',
  },
  news: { title: 'Новости', empty: 'Первые новости скоро появятся.', all: 'Все новости' },
  footer: {
    tagline: '«Сотрудничать ради развития, отчитываться ради перемен».',
    legal: 'Правовая информация',
    privacy: 'Конфиденциальность',
    accessibility: 'Доступность',
  },
}

const ar: Dictionary = {
  nav: {
    about: 'حول الأسبوع',
    programme: 'البرنامج',
    salon: 'معرض المشاريع',
    data: 'SCD-RDC DATA',
    partnerships: 'الشراكات',
    press: 'الصحافة',
    practical: 'معلومات عملية',
  },
  ui: { menu: 'القائمة', language: 'اللغة', toConfirm: 'قيد التأكيد', skip: 'الانتقال إلى المحتوى', mainNav: 'التنقل الرئيسي', siteMap: 'خريطة الموقع' },
  cta: {
    participate: 'المشاركة',
    interest: 'إبداء الاهتمام',
    partner: 'كن شريكًا',
    programme: 'عرض البرنامج',
    data: 'اكتشف المنصة',
  },
  hero: {
    eyebrow: 'الدورة الأولى',
    titleLight: 'التعاون الإنمائي، ',
    titleBold: 'واضح ومنسّق ومفيد.',
    positioning: 'منصة وطنية للحوار والشراكة وإبراز المشاريع والمساءلة.',
    lead: 'مؤسسات وشركاء تقنيون وماليون وقطاع خاص ومجتمع مدني يجمعهم التزام مشترك: المساءلة عن النتائج.',
    photoCredit: 'Masina, Kinshasa · Kaysha / Unsplash',
  },
  info: { dates: 'التواريخ', place: 'المكان', format: 'الصيغة' },
  countdown: {
    number: '{n}',
    label: { zero: 'يوم على الافتتاح', one: 'يوم على الافتتاح', two: 'يومان على الافتتاح', few: 'أيام على الافتتاح', many: 'يومًا على الافتتاح', other: 'يوم على الافتتاح' },
    spoken: { zero: 'الافتتاح بعد {n} يوم', one: 'الافتتاح بعد يوم واحد', two: 'الافتتاح بعد يومين', few: 'الافتتاح بعد {n} أيام', many: 'الافتتاح بعد {n} يومًا', other: 'الافتتاح بعد {n} يوم' },
    live: 'جارٍ الآن',
    day: 'اليوم {n}',
  },
  components: {
    titleLight: 'خمسة محاور، ',
    titleBold: 'برنامج واحد',
    items: [
      { title: 'المنتدى الوطني', text: 'حوار رفيع المستوى حول الأولويات الوطنية.' },
      { title: 'معرض المشاريع', text: 'نحو 20 جناحًا للعرض.' },
      { title: 'الساحة المدنية', text: 'صوت المستفيدين والمجتمع المدني.' },
      { title: 'مختبر الحلول', text: 'ابتكارات وممارسات جيدة.' },
      { title: 'الجوائز', text: 'تكريم النتائج المثبتة.' },
    ],
  },
  data: {
    eyebrow: 'SCD-RDC DATA · النسخة التجريبية',
    titleLight: 'من يموّل ماذا، وأين، ',
    titleBold: 'ولمن؟',
    text: 'محفظة التعاون مقاطعةً بمقاطعة. بطاقات مشاريع موثّقة المصدر ومؤرّخة ومعتمدة.',
    sample: 'مشروعًا رائدًا',
    note: 'تذكر كل بطاقة مصدرها وتاريخ تحديثها وحالة اعتمادها.',
  },
  sdgs: {
    titleLight: 'التعاون في خدمة ',
    titleBold: 'أهداف التنمية المستدامة',
    text: 'يبيّن كل مشروع على منصة SCD-RDC DATA الأهداف التي يسهم فيها، وفق ما تعلنه المؤسسة المسؤولة عنه. اختر هدفًا لعرض المشاريع المرتبطة به.',
    link: 'استكشاف المشاريع حسب الهدف',
  },
  organisers: { title: 'الجهات المنظِّمة', empty: 'الجهات المنظِّمة قيد التأكيد.' },
  partners: {
    titleLight: 'شركاؤنا ',
    titleBold: 'إلى جانبنا',
    note: 'لا تُنشر الشعارات إلا بعد موافقة خطية من كل مؤسسة.',
    empty: 'الشركاء بانتظار التأكيد.', sought: 'فئات الشركاء الذين نبحث عنهم', soughtText: 'سيُعرض الشركاء الأوائل هنا فور تلقّي موافقتهم الخطية. ويعرض ملف الشراكة مزايا كل فئة.',
  },
  news: { title: 'الأخبار', empty: 'ستُنشر الأخبار الأولى قريبًا.', all: 'عرض الكل' },
  footer: {
    tagline: '«نتعاون من أجل التنمية، ونُساءَل من أجل التغيير.»',
    legal: 'الإشعار القانوني',
    privacy: 'الخصوصية',
    accessibility: 'إمكانية الوصول',
  },
}

const dictionaries: Record<Locale, Dictionary> = { fr, en, zh, ru, ar }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
