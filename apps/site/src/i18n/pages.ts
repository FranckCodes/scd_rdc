import type { Locale } from './config'

// Textes d'interface des pages intérieures.
// ⚠ EN, ZH, RU, AR : traductions PROVISOIRES — relecture humaine obligatoire avant mise en ligne (TDR §12).

export type FormKey = 'manifestation-interet' | 'partenaire' | 'exposant' | 'contribution' | 'accreditation-presse'

export type PageDictionary = {
  proposal: string
  frenchOnly: string
  status: { confirme: string; 'en-attente': string; 'a-venir': string }
  participate: { title: string; intro: string; delay: string; forms: Record<FormKey, { title: string; desc: string }> }
  form: { submit: string; sending: string; error: string; required: string; back: string }
  programme: {
    title: string
    intro: string
    all: string
    day: string
    days: { j1: string; j2: string }
    component: string
    sector: string
    filter: string
    empty: string
    room: string
    updated: string
  }
  salon: { title: string; intro: string; sectors: string; exhibitors: string; empty: string; cta: string }
  partnerships: {
    title: string
    intro: string
    whyTitle: string
    why: string[]
    tiersTitle: string
    tiers: { institutionnel: string; ptf: string; sponsor: string; media: string }
    current: string
    empty: string
    cta: string
  }
  press: {
    title: string
    intro: string
    releases: string
    noReleases: string
    kit: string
    noKit: string
    accreditation: string
    accreditationText: string
    contact: string
  }
  news: { title: string; empty: string; back: string }
  live: string
  trophies: { title: string; intro: string; empty: string; pending: string; laureate: string; live: string; revealed: string }
}

const fr: PageDictionary = {
  proposal: 'Texte proposé — en attente de validation institutionnelle.',
  frenchOnly: 'Ce contenu n’est pas encore traduit : il s’affiche en français.',
  status: { confirme: 'Confirmé', 'en-attente': 'En attente de confirmation', 'a-venir': 'À venir' },
  participate: {
    title: 'Participer',
    intro: 'Choisissez la démarche qui vous correspond. Chaque demande est examinée par l’équipe organisatrice.',
    delay: 'Réponse sous 24 heures ouvrées',
    forms: {
      'manifestation-interet': { title: 'Manifester son intérêt', desc: 'Participer à la SCD-RDC en tant qu’institution, organisation ou délégation.' },
      partenaire: { title: 'Devenir partenaire', desc: 'Associer votre institution ou votre entreprise à l’édition inaugurale.' },
      exposant: { title: 'Exposer un projet', desc: 'Présenter un projet ou un programme au Salon des projets.' },
      contribution: { title: 'Proposer une contribution', desc: 'Proposer un intervenant, un panel, une solution ou une initiative culturelle.' },
      'accreditation-presse': { title: 'Accréditation presse', desc: 'Couvrir la SCD-RDC en tant que journaliste.' },
    },
  },
  form: {
    submit: 'Envoyer',
    sending: 'Envoi en cours…',
    error: 'L’envoi a échoué. Vérifiez les champs obligatoires ou réessayez plus tard.',
    required: 'obligatoire',
    back: 'Toutes les démarches',
  },
  programme: {
    title: 'Programme',
    intro: 'Deux jours, cinq composantes. Le programme détaillé est publié au fur et à mesure de la confirmation des sessions et des intervenants.',
    all: 'Toutes',
    day: 'Jour',
    days: { j1: 'Jour 1', j2: 'Jour 2' },
    component: 'Composante',
    sector: 'Thématique',
    filter: 'Filtrer',
    empty: 'Le programme détaillé sera publié dès la validation des premières sessions.',
    room: 'Salle',
    updated: 'Programme mis à jour.',
  },
  salon: {
    title: 'Salon des projets',
    intro: 'Une vingtaine de pavillons de démonstration où projets et programmes présentent leurs réalisations et leurs résultats, secteur par secteur.',
    sectors: 'Pavillons par secteur',
    exhibitors: 'Exposants confirmés',
    empty: 'La liste des exposants sera publiée au fur et à mesure des confirmations.',
    cta: 'Exposer un projet',
  },
  partnerships: {
    title: 'Partenariats',
    intro: 'La SCD-RDC se construit avec les institutions, les partenaires techniques et financiers, le secteur privé et les médias qui partagent son exigence de transparence et de résultats.',
    whyTitle: 'Pourquoi devenir partenaire',
    why: [
      'Rencontrer en deux jours l’ensemble des acteurs de la coopération en RDC.',
      'Rendre visibles vos interventions et leurs résultats auprès des décideurs.',
      'Contribuer à une coopération mieux coordonnée et alignée sur les priorités nationales.',
      'Associer votre image à une démarche de transparence et de redevabilité.',
    ],
    tiersTitle: 'Catégories de partenariat',
    tiers: {
      institutionnel: 'Partenaire institutionnel',
      ptf: 'Partenaire technique et financier',
      sponsor: 'Sponsor',
      media: 'Partenaire média',
    },
    current: 'Nos partenaires',
    empty: 'Les partenaires seront présentés après validation écrite de chaque institution.',
    cta: 'Devenir partenaire',
  },
  press: {
    title: 'Presse',
    intro: 'Communiqués, kit média et accréditations pour les journalistes qui couvrent la SCD-RDC.',
    releases: 'Communiqués',
    noReleases: 'Les premiers communiqués seront publiés prochainement.',
    kit: 'Kit média',
    noKit: 'Le kit média sera disponible au téléchargement prochainement.',
    accreditation: 'Accréditation',
    accreditationText: 'Les journalistes souhaitant couvrir l’événement doivent demander une accréditation.',
    contact: 'Contact presse',
  },
  news: { title: 'Actualités', empty: 'Les premières actualités seront publiées prochainement.', back: 'Toutes les actualités' },
  live: 'En cours',
  trophies: {
    title: 'Trophées',
    intro: 'Les Trophées distinguent des résultats probants de la coopération au développement en RDC. Les lauréats sont dévoilés lors de la cérémonie de remise.',
    empty: 'Les catégories des Trophées seront annoncées prochainement.',
    pending: 'Lauréat dévoilé lors de la cérémonie',
    laureate: 'Lauréat',
    live: 'Cérémonie en cours : les lauréats apparaissent ici au fil des annonces.',
    revealed: 'Lauréat dévoilé',
  },
}

const en: PageDictionary = {
  proposal: 'Proposed text — awaiting institutional approval.',
  frenchOnly: 'This content has not been translated yet and is shown in French.',
  status: { confirme: 'Confirmed', 'en-attente': 'Awaiting confirmation', 'a-venir': 'Upcoming' },
  participate: {
    title: 'Take part',
    intro: 'Choose the request that suits you. Every request is reviewed by the organising team.',
    delay: 'Reply within 24 working hours',
    forms: {
      'manifestation-interet': { title: 'Express interest', desc: 'Take part in SCD-RDC as an institution, organisation or delegation.' },
      partenaire: { title: 'Become a partner', desc: 'Associate your institution or company with the inaugural edition.' },
      exposant: { title: 'Exhibit a project', desc: 'Present a project or programme at the Projects Fair.' },
      contribution: { title: 'Propose a contribution', desc: 'Propose a speaker, a panel, a solution or a cultural initiative.' },
      'accreditation-presse': { title: 'Press accreditation', desc: 'Cover SCD-RDC as a journalist.' },
    },
  },
  form: {
    submit: 'Send',
    sending: 'Sending…',
    error: 'Sending failed. Check the required fields or try again later.',
    required: 'required',
    back: 'All requests',
  },
  programme: {
    title: 'Programme',
    intro: 'Two days, five components. The detailed programme is published as sessions and speakers are confirmed.',
    all: 'All',
    day: 'Day',
    days: { j1: 'Day 1', j2: 'Day 2' },
    component: 'Component',
    sector: 'Theme',
    filter: 'Filter',
    empty: 'The detailed programme will be published once the first sessions are approved.',
    room: 'Room',
    updated: 'Programme updated.',
  },
  salon: {
    title: 'Projects Fair',
    intro: 'Around twenty demonstration pavilions where projects and programmes present their achievements and results, sector by sector.',
    sectors: 'Pavilions by sector',
    exhibitors: 'Confirmed exhibitors',
    empty: 'The list of exhibitors will be published as confirmations come in.',
    cta: 'Exhibit a project',
  },
  partnerships: {
    title: 'Partnerships',
    intro: 'SCD-RDC is built with the institutions, technical and financial partners, private sector and media who share its commitment to transparency and results.',
    whyTitle: 'Why become a partner',
    why: [
      'Meet all development cooperation stakeholders in the DRC in two days.',
      'Showcase your interventions and their results to decision-makers.',
      'Contribute to better coordinated cooperation aligned with national priorities.',
      'Associate your image with transparency and accountability.',
    ],
    tiersTitle: 'Partnership categories',
    tiers: { institutionnel: 'Institutional partner', ptf: 'Technical and financial partner', sponsor: 'Sponsor', media: 'Media partner' },
    current: 'Our partners',
    empty: 'Partners will be presented after written approval from each institution.',
    cta: 'Become a partner',
  },
  press: {
    title: 'Press',
    intro: 'Press releases, media kit and accreditation for journalists covering SCD-RDC.',
    releases: 'Press releases',
    noReleases: 'The first press releases will be published soon.',
    kit: 'Media kit',
    noKit: 'The media kit will be available for download soon.',
    accreditation: 'Accreditation',
    accreditationText: 'Journalists wishing to cover the event must request accreditation.',
    contact: 'Press contact',
  },
  news: { title: 'News', empty: 'The first news items will be published soon.', back: 'All news' },
  live: 'Live now',
  trophies: {
    title: 'Awards',
    intro: 'The Awards recognise proven results of development cooperation in the DRC. Winners are revealed at the award ceremony.',
    empty: 'The award categories will be announced soon.',
    pending: 'Winner revealed at the ceremony',
    laureate: 'Winner',
    live: 'Ceremony in progress: winners appear here as they are announced.',
    revealed: 'Winner revealed',
  },
}

const zh: PageDictionary = {
  proposal: '拟议文本——待机构审定。',
  frenchOnly: '此内容尚未翻译，以法语显示。',
  status: { confirme: '已确认', 'en-attente': '待确认', 'a-venir': '即将公布' },
  participate: {
    title: '参加',
    intro: '请选择适合您的申请。组委会将审核每一份申请。',
    delay: '24个工作小时内回复',
    forms: {
      'manifestation-interet': { title: '表达参与意向', desc: '以机构、组织或代表团身份参加SCD-RDC。' },
      partenaire: { title: '成为合作伙伴', desc: '让您的机构或企业参与首届活动。' },
      exposant: { title: '展示项目', desc: '在项目展上展示项目或计划。' },
      contribution: { title: '提交建议', desc: '推荐发言人、专题讨论、解决方案或文化活动。' },
      'accreditation-presse': { title: '媒体注册', desc: '以记者身份报道SCD-RDC。' },
    },
  },
  form: { submit: '提交', sending: '正在提交…', error: '提交失败，请检查必填项或稍后再试。', required: '必填', back: '全部申请' },
  programme: {
    title: '议程',
    intro: '两天，五个板块。详细议程将随会议和发言人确认陆续公布。',
    all: '全部',
    day: '日期',
    days: { j1: '第一天', j2: '第二天' },
    component: '板块',
    sector: '主题',
    filter: '筛选',
    empty: '首批会议审定后将公布详细议程。',
    room: '会议室',
    updated: '议程已更新。',
  },
  salon: {
    title: '项目展',
    intro: '约二十个展示馆，按行业展示项目与计划的成果。',
    sectors: '行业展馆',
    exhibitors: '已确认参展方',
    empty: '参展方名单将随确认情况陆续公布。',
    cta: '展示项目',
  },
  partnerships: {
    title: '合作伙伴',
    intro: 'SCD-RDC与认同透明和成果理念的机构、技术与资金伙伴、私营部门及媒体共同打造。',
    whyTitle: '为何成为合作伙伴',
    why: ['两天内结识刚果（金）所有发展合作参与方。', '向决策者展示您的项目及其成果。', '推动更加协调、符合国家优先事项的合作。', '将您的形象与透明和问责相联系。'],
    tiersTitle: '合作类别',
    tiers: { institutionnel: '机构合作伙伴', ptf: '技术与资金合作伙伴', sponsor: '赞助商', media: '媒体合作伙伴' },
    current: '我们的合作伙伴',
    empty: '各机构书面同意后将公布合作伙伴。',
    cta: '成为合作伙伴',
  },
  press: {
    title: '媒体',
    intro: '为报道SCD-RDC的记者提供新闻稿、媒体资料包和注册服务。',
    releases: '新闻稿',
    noReleases: '首批新闻稿即将发布。',
    kit: '媒体资料包',
    noKit: '媒体资料包即将提供下载。',
    accreditation: '媒体注册',
    accreditationText: '希望报道活动的记者须申请注册。',
    contact: '媒体联系',
  },
  news: { title: '新闻', empty: '首批新闻即将发布。', back: '全部新闻' },
  live: '正在进行',
  trophies: {
    title: '奖项',
    intro: '奖项表彰刚果民主共和国发展合作中成效显著的成果。获奖者将在颁奖典礼上揭晓。',
    empty: '奖项类别即将公布。',
    pending: '获奖者将在颁奖典礼上揭晓',
    laureate: '获奖者',
    live: '颁奖典礼正在进行：获奖者将在此陆续公布。',
    revealed: '获奖者揭晓',
  },
}

const ru: PageDictionary = {
  proposal: 'Предлагаемый текст — ожидает утверждения.',
  frenchOnly: 'Этот материал ещё не переведён и показан на французском языке.',
  status: { confirme: 'Подтверждено', 'en-attente': 'Ожидает подтверждения', 'a-venir': 'Скоро' },
  participate: {
    title: 'Участвовать',
    intro: 'Выберите подходящую заявку. Каждая заявка рассматривается оргкомитетом.',
    delay: 'Ответ в течение 24 рабочих часов',
    forms: {
      'manifestation-interet': { title: 'Заявить об интересе', desc: 'Участвовать в SCD-RDC как учреждение, организация или делегация.' },
      partenaire: { title: 'Стать партнёром', desc: 'Присоединить ваше учреждение или компанию к первой неделе.' },
      exposant: { title: 'Представить проект', desc: 'Представить проект или программу на Выставке проектов.' },
      contribution: { title: 'Предложить участие', desc: 'Предложить спикера, панель, решение или культурную инициативу.' },
      'accreditation-presse': { title: 'Аккредитация прессы', desc: 'Освещать SCD-RDC как журналист.' },
    },
  },
  form: {
    submit: 'Отправить',
    sending: 'Отправка…',
    error: 'Не удалось отправить. Проверьте обязательные поля или повторите попытку позже.',
    required: 'обязательно',
    back: 'Все заявки',
  },
  programme: {
    title: 'Программа',
    intro: 'Два дня, пять направлений. Подробная программа публикуется по мере подтверждения сессий и спикеров.',
    all: 'Все',
    day: 'День',
    days: { j1: 'День 1', j2: 'День 2' },
    component: 'Направление',
    sector: 'Тема',
    filter: 'Фильтр',
    empty: 'Подробная программа будет опубликована после утверждения первых сессий.',
    room: 'Зал',
    updated: 'Программа обновлена.',
  },
  salon: {
    title: 'Выставка проектов',
    intro: 'Около двадцати демонстрационных павильонов, где проекты и программы представляют свои результаты по отраслям.',
    sectors: 'Павильоны по отраслям',
    exhibitors: 'Подтверждённые участники',
    empty: 'Список участников будет публиковаться по мере подтверждения.',
    cta: 'Представить проект',
  },
  partnerships: {
    title: 'Партнёрство',
    intro: 'SCD-RDC создаётся вместе с учреждениями, техническими и финансовыми партнёрами, частным сектором и СМИ, разделяющими её принципы прозрачности и результативности.',
    whyTitle: 'Почему стать партнёром',
    why: [
      'За два дня встретиться со всеми участниками сотрудничества в ДРК.',
      'Показать ваши проекты и их результаты лицам, принимающим решения.',
      'Содействовать более согласованному сотрудничеству в соответствии с национальными приоритетами.',
      'Связать ваш имидж с прозрачностью и подотчётностью.',
    ],
    tiersTitle: 'Категории партнёрства',
    tiers: { institutionnel: 'Институциональный партнёр', ptf: 'Технический и финансовый партнёр', sponsor: 'Спонсор', media: 'Медиапартнёр' },
    current: 'Наши партнёры',
    empty: 'Партнёры будут представлены после письменного согласия каждой организации.',
    cta: 'Стать партнёром',
  },
  press: {
    title: 'Пресса',
    intro: 'Пресс-релизы, медиакит и аккредитация для журналистов, освещающих SCD-RDC.',
    releases: 'Пресс-релизы',
    noReleases: 'Первые пресс-релизы скоро появятся.',
    kit: 'Медиакит',
    noKit: 'Медиакит скоро будет доступен для скачивания.',
    accreditation: 'Аккредитация',
    accreditationText: 'Журналисты, желающие освещать мероприятие, должны запросить аккредитацию.',
    contact: 'Контакт для прессы',
  },
  news: { title: 'Новости', empty: 'Первые новости скоро появятся.', back: 'Все новости' },
  live: 'Идёт сейчас',
  trophies: {
    title: 'Премии',
    intro: 'Премии отмечают доказанные результаты сотрудничества в целях развития в ДРК. Лауреаты объявляются на церемонии награждения.',
    empty: 'Номинации будут объявлены в ближайшее время.',
    pending: 'Лауреат будет объявлен на церемонии',
    laureate: 'Лауреат',
    live: 'Идёт церемония: лауреаты появляются здесь по мере объявления.',
    revealed: 'Объявлен лауреат',
  },
}

const ar: PageDictionary = {
  proposal: 'نص مقترح — بانتظار الاعتماد المؤسسي.',
  frenchOnly: 'هذا المحتوى غير مترجم بعد ويُعرض بالفرنسية.',
  status: { confirme: 'مؤكَّد', 'en-attente': 'بانتظار التأكيد', 'a-venir': 'قريبًا' },
  participate: {
    title: 'المشاركة',
    intro: 'اختر الطلب المناسب لك. يدرس الفريق المنظم كل طلب.',
    delay: 'الرد خلال 24 ساعة عمل',
    forms: {
      'manifestation-interet': { title: 'إبداء الاهتمام', desc: 'المشاركة في SCD-RDC بصفة مؤسسة أو منظمة أو وفد.' },
      partenaire: { title: 'كن شريكًا', desc: 'اربط مؤسستك أو شركتك بالدورة الأولى.' },
      exposant: { title: 'عرض مشروع', desc: 'قدّم مشروعًا أو برنامجًا في معرض المشاريع.' },
      contribution: { title: 'اقتراح مساهمة', desc: 'اقترح متحدثًا أو جلسة نقاش أو حلًا أو مبادرة ثقافية.' },
      'accreditation-presse': { title: 'اعتماد صحفي', desc: 'غطِّ SCD-RDC بصفتك صحفيًا.' },
    },
  },
  form: { submit: 'إرسال', sending: 'جارٍ الإرسال…', error: 'تعذّر الإرسال. تحقّق من الحقول الإلزامية أو أعد المحاولة لاحقًا.', required: 'إلزامي', back: 'جميع الطلبات' },
  programme: {
    title: 'البرنامج',
    intro: 'يومان وخمسة محاور. يُنشر البرنامج المفصّل تباعًا مع تأكيد الجلسات والمتحدثين.',
    all: 'الكل',
    day: 'اليوم',
    days: { j1: 'اليوم الأول', j2: 'اليوم الثاني' },
    component: 'المحور',
    sector: 'الموضوع',
    filter: 'تصفية',
    empty: 'سيُنشر البرنامج المفصّل بعد اعتماد الجلسات الأولى.',
    room: 'القاعة',
    updated: 'تم تحديث البرنامج.',
  },
  salon: {
    title: 'معرض المشاريع',
    intro: 'نحو عشرين جناحًا للعرض تقدّم فيها المشاريع والبرامج إنجازاتها ونتائجها حسب القطاع.',
    sectors: 'الأجنحة حسب القطاع',
    exhibitors: 'العارضون المؤكَّدون',
    empty: 'ستُنشر قائمة العارضين تباعًا مع التأكيدات.',
    cta: 'عرض مشروع',
  },
  partnerships: {
    title: 'الشراكات',
    intro: 'تُبنى SCD-RDC مع المؤسسات والشركاء التقنيين والماليين والقطاع الخاص ووسائل الإعلام الذين يشاركونها التزامها بالشفافية والنتائج.',
    whyTitle: 'لماذا تصبح شريكًا',
    why: [
      'لقاء جميع الفاعلين في التعاون الإنمائي في جمهورية الكونغو الديمقراطية خلال يومين.',
      'إبراز تدخلاتك ونتائجها أمام صانعي القرار.',
      'الإسهام في تعاون أفضل تنسيقًا ومتوافق مع الأولويات الوطنية.',
      'ربط صورتك بالشفافية والمساءلة.',
    ],
    tiersTitle: 'فئات الشراكة',
    tiers: { institutionnel: 'شريك مؤسسي', ptf: 'شريك تقني ومالي', sponsor: 'راعٍ', media: 'شريك إعلامي' },
    current: 'شركاؤنا',
    empty: 'سيُعرض الشركاء بعد الموافقة الخطية لكل مؤسسة.',
    cta: 'كن شريكًا',
  },
  press: {
    title: 'الصحافة',
    intro: 'بيانات صحفية وحقيبة إعلامية واعتمادات للصحفيين الذين يغطّون SCD-RDC.',
    releases: 'البيانات الصحفية',
    noReleases: 'ستُنشر البيانات الصحفية الأولى قريبًا.',
    kit: 'الحقيبة الإعلامية',
    noKit: 'ستتوفر الحقيبة الإعلامية للتنزيل قريبًا.',
    accreditation: 'الاعتماد',
    accreditationText: 'على الصحفيين الراغبين في تغطية الحدث طلب الاعتماد.',
    contact: 'جهة الاتصال الصحفية',
  },
  news: { title: 'الأخبار', empty: 'ستُنشر الأخبار الأولى قريبًا.', back: 'جميع الأخبار' },
  live: 'جارٍ الآن',
  trophies: {
    title: 'الجوائز',
    intro: 'تكرّم الجوائز النتائج المثبتة للتعاون من أجل التنمية في جمهورية الكونغو الديمقراطية. ويُكشف عن الفائزين خلال حفل توزيع الجوائز.',
    empty: 'ستُعلن فئات الجوائز قريبًا.',
    pending: 'يُكشف عن الفائز خلال الحفل',
    laureate: 'الفائز',
    live: 'الحفل جارٍ: يظهر الفائزون هنا تباعًا عند الإعلان عنهم.',
    revealed: 'تم الكشف عن الفائز',
  },
}

const dictionaries: Record<Locale, PageDictionary> = { fr, en, zh, ru, ar }

export function getPageDictionary(locale: Locale): PageDictionary {
  return dictionaries[locale]
}
