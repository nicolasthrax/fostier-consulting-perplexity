import type { Locale } from "./config";

/**
 * Long-form copy for the core service pages, keyed by service index (the order of
 * `services.items` and `serviceSlugs`) and locale. Services without an entry render
 * the short page (title, includes list, FAQ) as before.
 *
 * Facts about Hong Kong tax, banking and insurance are kept general and stable on
 * purpose: no yearly rates, allowances or caps. The matching questions and answers
 * live with the other service FAQs in `faq.ts`.
 */

export type DetailSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
  /** Short paragraph after the list. */
  note?: string;
};

export type ServiceDetail = {
  /** Who it is for. */
  audience: DetailSection;
  /** Question-style heading and lead-in for the existing `includes` list. */
  included: { heading: string; intro: string };
  process: { heading: string; steps: { title: string; text: string }[] };
  timeline: DetailSection;
  documents: DetailSection;
};

const details: Partial<Record<number, Record<Locale, ServiceDetail>>> = {
  // ——— 0 · Investment ———
  0: {
    fr: {
      audience: {
        heading: "À qui s'adresse le conseil en investissement ?",
        paragraphs: [
          "Aux résidents français de Hong Kong qui ont constitué, ou commencent à constituer, un patrimoine financier et veulent lui donner une direction claire. Vivre à Hong Kong change la donne : vos revenus sont souvent en dollars de Hong Kong, certains projets restent en euros, et vos placements se retrouvent dispersés entre la France, Hong Kong et d'autres places financières.",
          "Nous accompagnons notamment :",
        ],
        list: [
          "Les cadres et dirigeants dont l'épargne s'accumule plus vite qu'ils n'ont le temps de s'en occuper",
          "Les entrepreneurs qui veulent distinguer patrimoine professionnel et patrimoine privé",
          "Les familles qui préparent des études, un achat immobilier ou un retour en France",
          "Les professionnels mobiles qui ne savent pas encore combien de temps ils resteront en Asie",
        ],
      },
      included: {
        heading: "Que comprend le conseil en investissement ?",
        intro:
          "L'accompagnement part de votre situation réelle — revenus, patrimoine existant, projets, rapport au risque — et non d'un produit à placer. Il couvre toute la réflexion, de la revue de l'existant au suivi dans la durée :",
      },
      process: {
        heading: "Comment se déroule l'accompagnement ?",
        steps: [
          {
            title: "Premier échange",
            text: "Un échange en français pour comprendre votre situation, vos projets et vos contraintes, et vérifier que notre accompagnement répond bien à votre besoin.",
          },
          {
            title: "Bilan patrimonial",
            text: "Nous faisons l'inventaire de vos avoirs — comptes, placements, assurance vie, épargne retraite, immobilier — en France, à Hong Kong et ailleurs, ainsi que de vos revenus, de vos charges et de vos engagements.",
          },
          {
            title: "Objectifs, horizon et profil de risque",
            text: "Nous formalisons ce que votre patrimoine doit financer, et à quelle échéance : réserve de précaution, études des enfants, achat immobilier, retraite, transmission. Un questionnaire permet d'évaluer votre tolérance au risque et votre capacité à traverser une baisse temporaire des marchés.",
          },
          {
            title: "Stratégie et allocation",
            text: "Nous vous présentons une stratégie argumentée : répartition entre liquidités, obligations, actions et autres classes d'actifs, exposition aux devises, besoins de liquidité, points fiscaux à faire vérifier. Vous décidez de sa mise en œuvre.",
          },
          {
            title: "Mise en œuvre",
            text: "Lorsque des produits d'investissement sont envisagés, ils sont souscrits auprès d'établissements et d'intermédiaires dûment autorisés, dans le cadre réglementaire applicable. Nous vous aidons à comprendre les documents et les frais avant toute souscription.",
          },
          {
            title: "Suivi",
            text: "Des points réguliers permettent de revoir l'allocation lorsque votre situation évolue : nouveau poste, naissance, achat immobilier, départ de Hong Kong ou retour en France.",
          },
        ],
      },
      timeline: {
        heading: "Combien de temps faut-il prévoir ?",
        paragraphs: [
          "Comptez en général quelques semaines entre le premier échange et la présentation de la stratégie. Le délai dépend surtout du temps nécessaire pour réunir vos relevés et documents, en France comme à Hong Kong.",
          "La mise en œuvre peut ensuite être progressive, par exemple si vous préférez investir en plusieurs fois plutôt qu'en une seule. Le suivi, lui, s'inscrit dans la durée : une stratégie d'investissement se juge sur plusieurs années, pas sur quelques mois.",
        ],
      },
      documents: {
        heading: "Quels documents préparer ?",
        paragraphs: ["Pour un premier bilan, rassemblez ce que vous avez sous la main ; nous complétons ensemble au fil de l'accompagnement :"],
        list: [
          "Les relevés récents de vos comptes bancaires et comptes-titres, en France comme à Hong Kong",
          "Vos contrats d'assurance vie, plans d'épargne et d'épargne retraite, y compris vos relevés MPF",
          "Vos justificatifs de revenus : contrat de travail, bulletins de salaire, bonus",
          "La liste de vos biens immobiliers et des crédits en cours",
          "Vos objectifs et échéances : études, achat, retraite, date envisagée de retour en France",
        ],
        note: "À la souscription, chaque établissement applique ses propres vérifications d'identité (KYC) : une pièce d'identité et un justificatif de domicile récent vous seront demandés.",
      },
    },
    en: {
      audience: {
        heading: "Who is the investment service for?",
        paragraphs: [
          "French residents of Hong Kong who have built, or are starting to build, financial assets and want to give them a clear direction. Living in Hong Kong changes the picture: your income is often in Hong Kong dollars, some plans are still in euros, and your investments end up spread across France, Hong Kong and other financial centres.",
          "We work in particular with:",
        ],
        list: [
          "Executives whose savings build up faster than they have time to look after them",
          "Entrepreneurs who want to keep business and private wealth apart",
          "Families preparing for school fees, a property purchase or a move back to France",
          "Mobile professionals who do not yet know how long they will stay in Asia",
        ],
      },
      included: {
        heading: "What does the investment service include?",
        intro:
          "We start from your actual situation — income, existing assets, plans, attitude to risk — not from a product to sell. The service covers the whole process, from reviewing what you hold to ongoing follow-up:",
      },
      process: {
        heading: "How does the process work?",
        steps: [
          {
            title: "First conversation",
            text: "A conversation in French or English to understand your situation, plans and constraints, and to check that our service fits what you need.",
          },
          {
            title: "Wealth review",
            text: "We list what you own — accounts, investments, life insurance, retirement savings, property — in France, Hong Kong and elsewhere, together with your income, outgoings and commitments.",
          },
          {
            title: "Objectives, horizon and risk profile",
            text: "We set out what your assets need to pay for, and when: an emergency reserve, children's education, a property purchase, retirement, passing wealth on. A questionnaire assesses your tolerance for risk and your capacity to ride out a temporary market fall.",
          },
          {
            title: "Strategy and allocation",
            text: "We present a reasoned strategy: the split between cash, bonds, equities and other asset classes, currency exposure, liquidity needs, and tax points to have checked. You decide whether and how to implement it.",
          },
          {
            title: "Implementation",
            text: "Where investment products are considered, they are subscribed through duly authorised institutions and intermediaries, within the applicable regulatory framework. We help you understand the documents and fees before you sign anything.",
          },
          {
            title: "Follow-up",
            text: "Regular reviews let us revisit the allocation as your life changes: a new job, a birth, a property purchase, leaving Hong Kong or moving back to France.",
          },
        ],
      },
      timeline: {
        heading: "How long does it take?",
        paragraphs: [
          "Allow a few weeks, as a rule, between the first conversation and the strategy presentation. Most of that time goes into gathering statements and documents from France and Hong Kong.",
          "Implementation can then be gradual, for instance if you prefer to invest in several stages rather than all at once. Follow-up is long-term by nature: an investment strategy is judged over years, not months.",
        ],
      },
      documents: {
        heading: "Which documents should I prepare?",
        paragraphs: ["For a first review, bring what you have to hand; we fill in the gaps together as we go:"],
        list: [
          "Recent statements for your bank and investment accounts, in France and Hong Kong",
          "Life-insurance, savings-plan and retirement-plan contracts, including your MPF statements",
          "Proof of income: employment contract, payslips, bonus letters",
          "A list of any property you own and outstanding loans",
          "Your objectives and deadlines: education, purchase, retirement, a possible return date",
        ],
        note: "When you subscribe, each institution runs its own identity checks (KYC): you will be asked for ID and a recent proof of address.",
      },
    },
    zh: {
      audience: {
        heading: "投资咨询服务适合哪些客户？",
        paragraphs: [
          "适合已经积累或正开始积累金融资产、并希望为其确立清晰方向的在港法国居民。在香港生活会改变许多考量：您的收入多以港元计，部分计划仍以欧元为单位，投资则往往分散在法国、香港及其他金融中心。",
          "我们尤其服务以下客户：",
        ],
        list: [
          "储蓄增长速度快于自己打理时间的企业高管",
          "希望将企业资产与个人资产分开管理的创业者",
          "正在为子女教育、购置物业或回流法国做准备的家庭",
          "尚不确定会在亚洲停留多久的跨国流动职业人士",
        ],
      },
      included: {
        heading: "投资咨询服务包括哪些内容？",
        intro: "我们从您的真实情况出发——收入、现有资产、计划与风险取向——而不是从某个待销售的产品出发。服务涵盖从检视现有资产到长期跟进的完整过程：",
      },
      process: {
        heading: "服务流程如何进行？",
        steps: [
          { title: "初步沟通", text: "通过一次沟通了解您的情况、计划与限制，并确认我们的服务是否符合您的需要。" },
          { title: "资产盘点", text: "梳理您在法国、香港及其他地方的资产——账户、投资、人寿保险、退休储蓄、物业——以及收入、支出与各项承担。" },
          { title: "目标、期限与风险取向", text: "明确您的资产需要支持哪些目标及其时间：应急储备、子女教育、购置物业、退休、财富传承。通过问卷评估您对风险的承受意愿，以及面对市场短期下跌时的承受能力。" },
          { title: "策略与资产配置", text: "向您提出有理有据的策略：现金、债券、股票及其他资产类别之间的配置、货币敞口、流动性需要，以及需要核实的税务要点。是否及如何执行，由您决定。" },
          { title: "执行", text: "如涉及投资产品，将通过获正式授权的机构及中介人、在适用的监管框架内认购。认购前，我们协助您理解相关文件与费用。" },
          { title: "持续跟进", text: "定期检视资产配置，并在您的情况变化时作出调整：新工作、添丁、置业、离开香港或回流法国。" },
        ],
      },
      timeline: {
        heading: "需要多长时间？",
        paragraphs: [
          "从初步沟通到提出策略，一般需要数周时间，主要取决于整理法国及香港两地结单和文件所需的时间。",
          "执行可以循序渐进，例如您希望分阶段而非一次性投入。跟进则是长期的：投资策略应以年而非以月来衡量。",
        ],
      },
      documents: {
        heading: "需要准备哪些文件？",
        paragraphs: ["首次盘点时，准备手头现有的资料即可，其余可在过程中逐步补齐："],
        list: [
          "法国及香港银行账户与证券账户的近期结单",
          "人寿保险、储蓄计划及退休计划合约，包括强积金（MPF）结单",
          "收入证明：雇佣合约、工资单、花红资料",
          "名下物业及未偿还贷款清单",
          "您的目标与时间表：教育、置业、退休、预计回流法国的时间",
        ],
        note: "认购时，各机构会进行各自的身份核实（KYC），届时需要提供身份证明文件及近期住址证明。",
      },
    },
  },

  // ——— 1 · Hong Kong tax ———
  1: {
    fr: {
      audience: {
        heading: "À qui s'adresse l'accompagnement fiscal ?",
        paragraphs: [
          "Aux Français qui vivent et travaillent à Hong Kong et doivent remplir leur déclaration de revenus auprès de l'Inland Revenue Department (IRD), l'administration fiscale hongkongaise. Le système local a la réputation d'être simple, mais la première déclaration déroute souvent : formulaire en anglais ou en chinois, principe de territorialité, déductions à justifier, impôt provisionnel à anticiper.",
          "L'accompagnement est particulièrement utile si :",
        ],
        list: [
          "Vous remplissez votre première déclaration à Hong Kong",
          "Vous êtes arrivé ou vous partez en cours d'année fiscale",
          "Vous travaillez en partie hors de Hong Kong ou voyagez souvent pour votre poste",
          "Votre rémunération comprend un bonus, des actions, un logement de fonction ou d'autres avantages",
          "Vous percevez aussi des revenus locatifs à Hong Kong",
        ],
      },
      included: {
        heading: "Que comprend l'accompagnement fiscal ?",
        intro:
          "Nous préparons avec vous la déclaration de revenus individuelle (formulaire BIR60) et vous aidons à la déposer dans les délais, puis à comprendre l'avis d'imposition qui suit. Concrètement :",
      },
      process: {
        heading: "Comment se déroule la déclaration, étape par étape ?",
        steps: [
          {
            title: "Réception de la déclaration",
            text: "L'IRD envoie la déclaration individuelle (BIR60) début mai, par courrier ou dans votre espace eTAX. Vous nous la transmettez dès réception et nous notons la date limite qui y figure.",
          },
          {
            title: "Collecte des documents",
            text: "Nous vous adressons une liste de pièces adaptée à votre situation et les rassemblons avec vous : relevé de rémunération de l'employeur (IR56B), justificatifs de déductions, informations sur votre logement et votre famille.",
          },
          {
            title: "Préparation",
            text: "Nous remplissons la déclaration section par section et contrôlons sa cohérence avec les montants déclarés par votre employeur. Les déductions et abattements auxquels vous pouvez prétendre sont identifiés et documentés.",
          },
          {
            title: "Relecture et validation",
            text: "Nous passons la déclaration en revue ensemble. Vous vérifiez chaque information, puis vous la signez : vous restez le déclarant et le responsable de son exactitude.",
          },
          {
            title: "Dépôt",
            text: "La déclaration est déposée en ligne via eTAX ou sur papier, avant la date limite. Vous conservez une copie complète du dossier, précieuse pour les années suivantes.",
          },
          {
            title: "Avis d'imposition et échéances",
            text: "À réception de l'avis d'imposition, nous le rapprochons de la déclaration, vous expliquons le montant réclamé — impôt provisionnel compris — et vous rappelons les dates de paiement. Si l'avis vous paraît erroné, une objection doit être formée dans le mois qui suit sa date d'émission.",
          },
        ],
      },
      timeline: {
        heading: "Quel est le calendrier fiscal à Hong Kong ?",
        paragraphs: [
          "L'année fiscale hongkongaise (year of assessment) court du 1er avril au 31 mars. La déclaration portant sur l'année écoulée est envoyée début mai et doit en principe être renvoyée dans le mois qui suit sa date d'émission. Un délai supplémentaire est accordé lorsqu'elle est déposée en ligne, et les contribuables qui passent par un représentant fiscal (tax representative) peuvent bénéficier de délais plus longs.",
          "L'avis d'imposition arrive ensuite, généralement dans les mois qui suivent. Il réclame l'impôt définitif de l'année écoulée et un impôt provisionnel (provisional tax) pour l'année en cours, estimé sur vos revenus de l'année écoulée et imputé ensuite sur l'impôt définitif correspondant. Le paiement se fait en principe en deux échéances : la première en début d'année civile, la seconde environ trois mois plus tard.",
          "Côté préparation, comptez en général une à deux semaines une fois les documents réunis. Commencer dès la réception de la déclaration évite de travailler sous la pression de la date limite.",
        ],
      },
      documents: {
        heading: "Quels documents préparer pour la déclaration ?",
        paragraphs: ["La liste exacte dépend de votre situation. Les pièces les plus courantes :"],
        list: [
          "La déclaration BIR60 reçue de l'IRD, ou l'accès à votre compte eTAX",
          "Le relevé de rémunération remis par votre employeur (copie de l'IR56B) et, en cas de changement d'employeur ou de départ, l'IR56F ou l'IR56G",
          "Votre numéro de carte d'identité hongkongaise (HKID) et votre adresse",
          "Les informations sur votre logement s'il est fourni ou pris en charge par votre employeur",
          "Les relevés de cotisations MPF obligatoires et, le cas échéant, de cotisations volontaires déductibles",
          "Les justificatifs de déductions : frais de formation, primes d'assurance santé certifiée VHIS, dons à des organismes agréés, intérêts d'emprunt pour votre résidence",
          "Les informations familiales utiles aux abattements : conjoint, enfants, parents à charge",
          "Le cas échéant, le décompte de vos jours travaillés hors de Hong Kong et vos revenus locatifs à Hong Kong",
        ],
      },
    },
    en: {
      audience: {
        heading: "Who is the tax service for?",
        paragraphs: [
          "French nationals who live and work in Hong Kong and must file a tax return with the Inland Revenue Department (IRD). The local system has a reputation for simplicity, but the first return often catches people out: a form in English or Chinese, the territorial-source principle, deductions to support, and provisional tax to plan for.",
          "The service is especially useful if:",
        ],
        list: [
          "You are filing your first Hong Kong tax return",
          "You arrived or are leaving part-way through the tax year",
          "You work partly outside Hong Kong or travel often for your job",
          "Your package includes a bonus, shares, housing or other benefits",
          "You also receive rental income in Hong Kong",
        ],
      },
      included: {
        heading: "What does the tax service include?",
        intro:
          "We prepare your individual tax return (form BIR60) with you, help you file it on time, then help you understand the assessment that follows. In practice:",
      },
      process: {
        heading: "How does filing work, step by step?",
        steps: [
          {
            title: "Receiving the return",
            text: "The IRD issues the individual tax return (BIR60) in early May, by post or to your eTAX account. You send it to us when it arrives and we note the deadline printed on it.",
          },
          {
            title: "Gathering documents",
            text: "We send you a checklist tailored to your situation and collect the paperwork with you: your employer's remuneration statement (IR56B), evidence for deductions, and details of your housing and family.",
          },
          {
            title: "Preparation",
            text: "We complete the return section by section and check it against the figures your employer has reported. We identify and document the deductions and allowances you can claim.",
          },
          {
            title: "Review and sign-off",
            text: "We go through the return together. You check every entry and sign it: you remain the taxpayer and responsible for its accuracy.",
          },
          {
            title: "Filing",
            text: "The return is filed online through eTAX or on paper before the deadline. You keep a complete copy of the file, which makes the following years easier.",
          },
          {
            title: "Assessment and payment dates",
            text: "When the notice of assessment arrives, we compare it with the return, explain the amount demanded — provisional tax included — and remind you of the payment dates. If the assessment looks wrong, an objection must be lodged within one month of the date it was issued.",
          },
        ],
      },
      timeline: {
        heading: "What is the Hong Kong tax calendar?",
        paragraphs: [
          "The Hong Kong year of assessment runs from 1 April to 31 March. The return for the year just ended is issued in early May and must normally be filed within one month of its date of issue. Extra time is allowed when you file online, and taxpayers who use a tax representative may have longer deadlines.",
          "The notice of assessment usually follows within a few months. It demands the final tax for the year just ended plus provisional tax for the current year, estimated on the past year's income and later set against that year's final tax. Payment is normally due in two instalments: the first early in the calendar year, the second about three months later.",
          "On our side, allow one to two weeks of preparation once the documents are together. Starting as soon as the return arrives avoids working against the deadline.",
        ],
      },
      documents: {
        heading: "Which documents do I need for my tax return?",
        paragraphs: ["The exact list depends on your situation. The most common items are:"],
        list: [
          "The BIR60 return issued by the IRD, or access to your eTAX account",
          "Your employer's remuneration statement (a copy of the IR56B) and, if you changed employer or are leaving, the IR56F or IR56G",
          "Your Hong Kong identity card (HKID) number and address",
          "Details of your housing if your employer provides or pays for it",
          "Statements of your mandatory MPF contributions and any tax-deductible voluntary contributions",
          "Evidence for deductions: self-education expenses, premiums for certified VHIS health plans, approved charitable donations, home-loan interest on your residence",
          "Family details relevant to allowances: spouse, children, dependent parents",
          "Where relevant, a count of days worked outside Hong Kong and any Hong Kong rental income",
        ],
      },
    },
    zh: {
      audience: {
        heading: "税务服务适合哪些客户？",
        paragraphs: [
          "适合在香港生活和工作、须向香港税务局（IRD）提交报税表的法国人士。香港税制素以简单见称，但第一次报税往往令人困惑：表格以英文或中文填写、地域来源原则、须提供证明的扣除项目，以及需要预先规划的暂缴税。",
          "以下情况尤其适合使用本服务：",
        ],
        list: [
          "首次在香港提交报税表",
          "在课税年度中途抵港或离港",
          "部分工作在香港以外进行，或经常因公出差",
          "薪酬包含花红、股份、雇主提供的居所或其他福利",
          "同时在香港有租金收入",
        ],
      },
      included: {
        heading: "税务服务包括哪些内容？",
        intro: "我们与您一起准备个别人士报税表（BIR60），协助您按时提交，并帮助您理解随后收到的评税通知书。具体包括：",
      },
      process: {
        heading: "报税流程如何逐步进行？",
        steps: [
          { title: "收到报税表", text: "税务局一般于每年五月初以邮寄方式或通过「电子税务」（eTAX）账户发出个别人士报税表（BIR60）。收到后请即转交我们，我们会记下表上列明的提交期限。" },
          { title: "整理文件", text: "我们按您的情况提供文件清单，并与您一起收集资料：雇主发出的薪酬资料（IR56B）、扣除项目证明，以及住所和家庭资料。" },
          { title: "填写报税表", text: "我们逐部分填写报税表，并与雇主申报的数字核对。同时找出并整理您可申索的扣除及免税额。" },
          { title: "复核与确认", text: "我们与您一起检视报税表。您核对每项资料后亲自签署：您仍是纳税人，并对内容的准确性负责。" },
          { title: "提交", text: "在期限前通过「电子税务」或以纸本提交报税表。您保留完整副本，方便日后年度参考。" },
          { title: "评税通知书与缴税日期", text: "收到评税通知书后，我们将其与报税表核对，解释所需缴付的金额（包括暂缴税），并提醒您缴税日期。如认为评税有误，须在通知书发出日期起一个月内提出反对。" },
        ],
      },
      timeline: {
        heading: "香港的报税日程是怎样的？",
        paragraphs: [
          "香港的课税年度由 4 月 1 日至翌年 3 月 31 日。上一课税年度的报税表于五月初发出，一般须在发出日期起一个月内交回。以电子方式提交可获额外时间，委托税务代表（tax representative）的纳税人亦可能获较长期限。",
          "评税通知书通常在其后数月内发出，内容包括上一年度的最终税款，以及按上一年度收入估算的本年度暂缴税（其后会用以抵扣本年度的最终税款）。税款一般分两期缴付：第一期在公历年初，第二期约三个月后。",
          "文件齐备后，准备工作一般需要一至两星期。收到报税表后尽早开始，可避免临近期限才赶工。",
        ],
      },
      documents: {
        heading: "报税需要准备哪些文件？",
        paragraphs: ["具体清单视乎您的情况，最常见的文件包括："],
        list: [
          "税务局发出的 BIR60 报税表，或您的「电子税务」账户",
          "雇主提供的薪酬资料（IR56B 副本）；如曾转换雇主或即将离港，另需 IR56F 或 IR56G",
          "香港身份证号码及住址",
          "如雇主提供或支付居所，相关住屋资料",
          "强积金强制性供款结单，以及可扣税自愿性供款（如有）",
          "扣除项目证明：个人进修开支、自愿医保计划（VHIS）认可产品保费、认可慈善捐款、自住物业的居所贷款利息",
          "与免税额相关的家庭资料：配偶、子女、受养父母",
          "如适用，在香港以外工作的日数记录及在港租金收入",
        ],
      },
    },
  },

  // ——— 2 · Savings and banking ———
  2: {
    fr: {
      audience: {
        heading: "À qui s'adresse l'accompagnement épargne et bancaire ?",
        paragraphs: [
          "Aux Français installés à Hong Kong, ou sur le point de l'être, qui veulent organiser leur épargne sur place sans y consacrer des semaines. Ouvrir un compte, choisir un établissement, comprendre ce qu'une banque attend de vous : les démarches sont souvent plus longues qu'on ne l'imagine, surtout à l'arrivée ou lorsque les justificatifs sont français.",
          "Nous accompagnons en particulier :",
        ],
        list: [
          "Les nouveaux arrivants qui ouvrent leurs premiers comptes à Hong Kong",
          "Les résidents qui veulent séparer compte courant, épargne de précaution et épargne de projet",
          "Les familles qui mettent de côté pour les études des enfants",
          "Les indépendants et entrepreneurs dont les revenus sont irréguliers",
        ],
      },
      included: {
        heading: "Que comprend l'accompagnement épargne et bancaire ?",
        intro:
          "L'accompagnement couvre à la fois la réflexion — combien épargner, pour quoi faire, dans quelle devise — et les démarches concrètes auprès des établissements :",
      },
      process: {
        heading: "Comment se déroule l'ouverture d'une solution d'épargne ?",
        steps: [
          {
            title: "Point sur vos besoins",
            text: "Nous faisons le point sur vos revenus, vos dépenses, vos comptes existants en France et à Hong Kong, et sur ce que votre épargne doit financer : réserve de précaution, projet à quelques années, épargne de long terme.",
          },
          {
            title: "Stratégie d'épargne",
            text: "Nous définissons avec vous les montants, la part d'épargne disponible et d'épargne bloquée, et la ou les devises adaptées. Le dollar de Hong Kong étant arrimé au dollar américain, un projet en euros demande une attention particulière au change.",
          },
          {
            title: "Choix des solutions",
            text: "Nous vous présentons les options envisageables selon votre profil — compte d'épargne, dépôt à terme, compte multidevise, solutions proposées par des banques ou des assureurs — avec leurs conditions, leurs frais et leurs contraintes.",
          },
          {
            title: "Constitution du dossier",
            text: "Nous vous indiquons les pièces exigées par l'établissement choisi, vérifions qu'elles sont complètes et à jour, et vous aidons à remplir les formulaires, y compris l'auto-certification de résidence fiscale.",
          },
          {
            title: "Dépôt et suivi de la demande",
            text: "Nous coordonnons les échanges avec l'établissement, le cas échéant, et suivons la demande jusqu'à la décision. Certaines banques demandent un rendez-vous en agence ou un entretien vidéo.",
          },
          {
            title: "Mise en place",
            text: "Une fois le compte ouvert, nous vérifions avec vous la mise en place des virements réguliers et l'articulation entre vos différents comptes.",
          },
        ],
      },
      timeline: {
        heading: "Combien de temps prend une ouverture de compte ?",
        paragraphs: [
          "Le délai dépend de l'établissement, de votre profil et de la complétude du dossier : de quelques jours à plusieurs semaines. Les vérifications d'identité et d'origine des fonds (KYC/AML) se sont renforcées ces dernières années, et un dossier incomplet reste la première cause de retard.",
          "Comptez en général une à deux semaines pour définir la stratégie et préparer le dossier, puis le délai propre à l'établissement. À l'arrivée, mieux vaut commencer dès que vous disposez de votre visa et de votre carte d'identité hongkongaise.",
        ],
      },
      documents: {
        heading: "Quels documents faut-il pour ouvrir un compte à Hong Kong ?",
        paragraphs: ["Chaque établissement fixe sa propre liste, mais la plupart demandent :"],
        list: [
          "Votre passeport et, si vous l'avez, votre carte d'identité hongkongaise (HKID)",
          "Votre visa ou autorisation de séjour à Hong Kong",
          "Un justificatif de domicile récent à votre nom : facture, relevé bancaire ou bail",
          "Un justificatif d'emploi ou de revenus : contrat de travail, bulletins de salaire, lettre de l'employeur",
          "Des informations sur l'origine des fonds et du patrimoine que vous comptez déposer",
          "Vos numéros d'identification fiscale, pour l'auto-certification de résidence fiscale",
        ],
        note: "Hong Kong participe à l'échange automatique d'informations financières (norme CRS de l'OCDE) : les banques recueillent votre résidence fiscale, et les informations sur vos comptes peuvent être transmises, via l'IRD, à l'administration fiscale de votre pays de résidence, y compris la France.",
      },
    },
    en: {
      audience: {
        heading: "Who is the savings and banking service for?",
        paragraphs: [
          "French nationals who live in Hong Kong, or are about to move here, and want to organise their savings locally without spending weeks on it. Opening an account, choosing an institution, understanding what a bank expects from you: the steps usually take longer than people imagine, especially on arrival or when your paperwork is French.",
          "We work in particular with:",
        ],
        list: [
          "New arrivals opening their first accounts in Hong Kong",
          "Residents who want to separate day-to-day banking, an emergency fund and savings for specific plans",
          "Families putting money aside for their children's education",
          "Freelancers and entrepreneurs with irregular income",
        ],
      },
      included: {
        heading: "What does the savings and banking service include?",
        intro:
          "The service covers both the thinking — how much to save, what for, in which currency — and the practical steps with institutions:",
      },
      process: {
        heading: "How does opening a savings solution work?",
        steps: [
          {
            title: "Understanding your needs",
            text: "We look at your income, spending, existing accounts in France and Hong Kong, and what your savings need to fund: an emergency reserve, a plan a few years out, long-term savings.",
          },
          {
            title: "Savings strategy",
            text: "Together we set amounts, the balance between accessible and locked-in savings, and the right currency or currencies. Because the Hong Kong dollar is pegged to the US dollar, a plan in euros needs particular attention to exchange rates.",
          },
          {
            title: "Choosing solutions",
            text: "We present the options that suit your profile — savings account, time deposit, multi-currency account, solutions offered by banks or insurers — with their terms, fees and constraints.",
          },
          {
            title: "Preparing the application",
            text: "We tell you which documents the chosen institution requires, check they are complete and current, and help you fill in the forms, including the tax-residency self-certification.",
          },
          {
            title: "Submission and follow-up",
            text: "We coordinate with the institution where applicable and follow the application through to a decision. Some banks ask for a branch appointment or a video interview.",
          },
          {
            title: "Setting up",
            text: "Once the account is open, we check with you that regular transfers are in place and that your accounts work well together.",
          },
        ],
      },
      timeline: {
        heading: "How long does opening an account take?",
        paragraphs: [
          "It depends on the institution, your profile and how complete the application is: anywhere from a few days to several weeks. Identity and source-of-funds checks (KYC/AML) have become more thorough in recent years, and an incomplete file is still the most common cause of delay.",
          "Allow one to two weeks, as a rule, to set the strategy and prepare the application, then the institution's own processing time. On arrival, it is best to start as soon as you have your visa and Hong Kong identity card.",
        ],
      },
      documents: {
        heading: "Which documents do I need to open an account in Hong Kong?",
        paragraphs: ["Each institution sets its own list, but most ask for:"],
        list: [
          "Your passport and, if you have one, your Hong Kong identity card (HKID)",
          "Your Hong Kong visa or permission to stay",
          "Recent proof of address in your name: a utility bill, bank statement or tenancy agreement",
          "Proof of employment or income: employment contract, payslips, employer's letter",
          "Information on the source of the funds and wealth you plan to deposit",
          "Your tax identification numbers, for the tax-residency self-certification",
        ],
        note: "Hong Kong takes part in the automatic exchange of financial account information (the OECD Common Reporting Standard): banks record your tax residency, and details of your accounts may be passed, through the IRD, to the tax authority of your country of residence, France included.",
      },
    },
    zh: {
      audience: {
        heading: "储蓄与银行服务适合哪些客户？",
        paragraphs: [
          "适合已在香港定居或即将来港、希望在当地妥善安排储蓄而不必耗费数周时间的法国人士。开户、挑选机构、了解银行对您的要求——这些手续往往比想象中费时，初到香港或所持证明文件来自法国时尤其如此。",
          "我们尤其服务以下客户：",
        ],
        list: [
          "初到香港、首次开立本地账户的新居民",
          "希望将日常账户、应急储备与专项储蓄分开的居民",
          "为子女教育储蓄的家庭",
          "收入不稳定的自由职业者及创业者",
        ],
      },
      included: {
        heading: "储蓄与银行服务包括哪些内容？",
        intro: "服务既涵盖规划——储蓄多少、为何储蓄、以何种货币储蓄——也涵盖与各机构之间的实际手续：",
      },
      process: {
        heading: "开立储蓄方案的流程如何进行？",
        steps: [
          { title: "了解需要", text: "梳理您的收入、支出、在法国及香港的现有账户，以及储蓄需要支持的目标：应急储备、数年内的计划、长期储蓄。" },
          { title: "储蓄策略", text: "与您一起确定金额、可随时动用与锁定期储蓄的比例，以及合适的货币。港元与美元挂钩，因此以欧元计划的目标需要特别留意汇率。" },
          { title: "选择方案", text: "按您的情况介绍可行选项——储蓄账户、定期存款、多货币账户、银行或保险公司提供的方案——并说明其条款、费用与限制。" },
          { title: "准备申请", text: "告知所选机构要求的文件，核对是否齐全及最新，并协助您填写表格，包括税务居民身份自我证明。" },
          { title: "提交与跟进", text: "如适用，我们与机构协调沟通，并跟进申请直至有结果。部分银行会要求到分行面谈或进行视频面谈。" },
          { title: "完成设置", text: "账户开立后，与您一起确认定期转账已经设定，并理顺各账户之间的安排。" },
        ],
      },
      timeline: {
        heading: "开户需要多长时间？",
        paragraphs: [
          "所需时间视乎机构、您的个人情况及申请是否齐全，由数天至数星期不等。近年身份及资金来源核查（KYC/AML）日趋严格，而资料不全仍是延误的最常见原因。",
          "一般预留一至两星期制定策略及准备申请，其后视乎机构的处理时间。初到香港时，最好在取得签证及香港身份证后尽早开始。",
        ],
      },
      documents: {
        heading: "在香港开户需要哪些文件？",
        paragraphs: ["各机构的要求不尽相同，但大多数会要求："],
        list: [
          "护照，以及香港身份证（如已领取）",
          "香港签证或逗留许可",
          "以您名义发出的近期住址证明：账单、银行结单或租约",
          "工作或收入证明：雇佣合约、工资单、雇主信函",
          "拟存入资金及财富来源的资料",
          "税务编号，用于税务居民身份自我证明",
        ],
        note: "香港参与金融账户资料自动交换（经合组织「共同汇报标准」CRS）：银行会记录您的税务居民身份，账户资料可经税务局交换予您税务居住地（包括法国）的税务机关。",
      },
    },
  },

  // ——— 3 · Insurance ———
  3: {
    fr: {
      audience: {
        heading: "À qui s'adresse l'accompagnement en assurance ?",
        paragraphs: [
          "Aux Français de Hong Kong qui veulent savoir précisément comment ils sont protégés, et ce qu'il se passerait en cas de maladie, d'accident ou de décès. L'expatriation brouille les repères : vous ne relevez plus, en général, de la Sécurité sociale française, l'assurance de groupe de votre employeur s'arrête avec votre contrat de travail, et les soins privés à Hong Kong peuvent coûter très cher.",
          "Nous accompagnons notamment :",
        ],
        list: [
          "Les salariés qui veulent compléter ou relayer l'assurance santé de leur employeur",
          "Les indépendants et entrepreneurs sans couverture de groupe",
          "Les familles qui veulent protéger leurs proches en cas de décès ou d'invalidité",
          "Les résidents qui préparent un changement de poste, un départ ou un retour en France",
        ],
      },
      included: {
        heading: "Que comprend l'accompagnement en assurance ?",
        intro:
          "Nous analysons vos couvertures actuelles, repérons ce qui manque ou fait doublon, puis comparons des contrats adaptés à votre situation, en assurance santé comme en assurance vie :",
      },
      process: {
        heading: "Comment se déroule l'accompagnement ?",
        steps: [
          {
            title: "Analyse des besoins",
            text: "Nous recensons les personnes à protéger, vos revenus, vos engagements — crédit, études, proches à charge — et vos priorités : soins à Hong Kong seulement, couverture internationale, prise en charge en France.",
          },
          {
            title: "Revue de vos couvertures",
            text: "Nous relisons avec vous vos contrats actuels : assurance de groupe de l'employeur, contrats souscrits en France, éventuelle adhésion à la Caisse des Français de l'Étranger. Plafonds, franchises, exclusions et zones de couverture sont passés en revue.",
          },
          {
            title: "Comparaison et recommandation",
            text: "Nous comparons plusieurs contrats sur des critères concrets : garanties, plafonds, franchises, délais de carence, exclusions, zone géographique, évolution des primes. Vous recevez une recommandation argumentée, limites comprises.",
          },
          {
            title: "Transparence avant souscription",
            text: "Avant toute souscription, la nature de la relation, la rémunération, les relations avec les assureurs et le statut réglementaire applicable vous sont précisés.",
          },
          {
            title: "Souscription",
            text: "Nous vous aidons à remplir la proposition d'assurance et le questionnaire médical. Une déclaration complète et exacte de votre état de santé est essentielle : une omission peut conduire l'assureur à refuser une prise en charge.",
          },
          {
            title: "Suivi dans le temps",
            text: "Les besoins évoluent : naissance, achat immobilier, changement d'employeur, départ de Hong Kong. Nous revoyons vos polices à ces moments-là et vous aidons dans vos échanges avec l'assureur.",
          },
        ],
      },
      timeline: {
        heading: "Combien de temps faut-il pour être assuré ?",
        paragraphs: [
          "L'analyse et la comparaison demandent en général une à deux semaines. Vient ensuite la souscription, dont la durée dépend surtout de l'assureur : l'étude du dossier médical (underwriting) peut être rapide pour un profil simple, ou prendre plusieurs semaines si des examens ou des informations complémentaires sont demandés.",
          "Attention aux délais de carence : certaines garanties, comme la maternité, ne s'appliquent qu'après une période d'attente. Si vous quittez votre employeur ou prévoyez une grossesse, mieux vaut anticiper pour ne pas rester sans couverture.",
          "Pour les contrats d'assurance vie de long terme, la réglementation hongkongaise prévoit un délai de réflexion (cooling-off period) après la remise du contrat, pendant lequel vous pouvez y renoncer.",
        ],
      },
      documents: {
        heading: "Quels documents préparer ?",
        paragraphs: ["Pour l'analyse, puis pour la souscription, prévoyez :"],
        list: [
          "Les conditions générales et tableaux de garanties de vos contrats actuels, y compris l'assurance de groupe de votre employeur",
          "Votre passeport et votre carte d'identité hongkongaise (HKID)",
          "Un justificatif de domicile",
          "Vos antécédents médicaux et ceux des personnes à assurer : traitements en cours, hospitalisations, comptes rendus utiles",
          "Vos revenus, crédits en cours et personnes à charge, pour dimensionner le capital d'une assurance vie",
          "Les coordonnées des bénéficiaires que vous souhaitez désigner",
        ],
      },
    },
    en: {
      audience: {
        heading: "Who is the insurance service for?",
        paragraphs: [
          "French residents of Hong Kong who want to know exactly how they are protected, and what would happen in case of illness, accident or death. Moving abroad blurs the picture: you are usually no longer covered by French social security, your employer's group policy ends with your job, and private healthcare in Hong Kong can be very expensive.",
          "We work in particular with:",
        ],
        list: [
          "Employees who want to top up or replace their employer's health cover",
          "Freelancers and entrepreneurs without group cover",
          "Families who want to protect their loved ones against death or disability",
          "Residents preparing for a job change, a move elsewhere or a return to France",
        ],
      },
      included: {
        heading: "What does the insurance service include?",
        intro:
          "We review your current cover, spot gaps and overlaps, then compare policies suited to your situation, for health and life insurance alike:",
      },
      process: {
        heading: "How does the process work?",
        steps: [
          {
            title: "Needs analysis",
            text: "We list who needs protecting, your income, your commitments — loans, school fees, dependants — and your priorities: treatment in Hong Kong only, international cover, care in France.",
          },
          {
            title: "Review of existing cover",
            text: "We read through your current policies with you: your employer's group plan, contracts taken out in France, any membership of the Caisse des Français de l'Étranger. Limits, deductibles, exclusions and geographic scope are all checked.",
          },
          {
            title: "Comparison and recommendation",
            text: "We compare several policies on concrete criteria: benefits, limits, deductibles, waiting periods, exclusions, area of cover, premium changes over time. You receive a reasoned recommendation, limitations included.",
          },
          {
            title: "Disclosure before subscription",
            text: "Before you subscribe, the nature of the relationship, remuneration, insurer relationships and applicable regulatory status are disclosed to you.",
          },
          {
            title: "Application",
            text: "We help you complete the proposal form and health questionnaire. Full and accurate disclosure of your medical history is essential: an omission can lead the insurer to decline a claim.",
          },
          {
            title: "Ongoing review",
            text: "Needs change: a birth, a property purchase, a new employer, leaving Hong Kong. We review your policies at those moments and help you in your dealings with the insurer.",
          },
        ],
      },
      timeline: {
        heading: "How long does it take to get covered?",
        paragraphs: [
          "Analysis and comparison usually take one to two weeks. Then comes the application, whose length depends mainly on the insurer: medical underwriting can be quick for a straightforward profile, or take several weeks if tests or further information are requested.",
          "Watch out for waiting periods: some benefits, such as maternity, only apply after a set period. If you are leaving your employer or planning a pregnancy, plan ahead so you are not left without cover.",
          "For long-term life insurance policies, Hong Kong rules provide a cooling-off period after the policy is delivered, during which you can cancel it.",
        ],
      },
      documents: {
        heading: "Which documents should I prepare?",
        paragraphs: ["For the review, then the application, have ready:"],
        list: [
          "Policy wordings and benefit schedules for your current cover, including your employer's group plan",
          "Your passport and Hong Kong identity card (HKID)",
          "Proof of address",
          "Medical history for everyone to be insured: ongoing treatment, hospital stays, relevant reports",
          "Your income, outstanding loans and dependants, to size life cover",
          "Contact details for the beneficiaries you want to name",
        ],
      },
    },
    zh: {
      audience: {
        heading: "保险服务适合哪些客户？",
        paragraphs: [
          "适合希望清楚了解自己保障范围、以及一旦患病、遭遇意外或身故时会有何安排的在港法国居民。移居海外后，许多情况都不再一目了然：您一般已不再受法国社会保障覆盖，雇主的团体保险随雇佣关系结束而终止，而香港私营医疗的费用可以相当高昂。",
          "我们尤其服务以下客户：",
        ],
        list: [
          "希望补充或接替雇主医疗保障的雇员",
          "没有团体保障的自由职业者及创业者",
          "希望在身故或伤残时保障家人的家庭",
          "正准备转换工作、离港或回流法国的居民",
        ],
      },
      included: {
        heading: "保险服务包括哪些内容？",
        intro: "我们分析您现有的保障，找出不足或重叠之处，再比较适合您情况的健康保险及人寿保险合约：",
      },
      process: {
        heading: "服务流程如何进行？",
        steps: [
          { title: "需要分析", text: "梳理需要保障的人、您的收入、各项承担（贷款、学费、受养人）及优先考虑：仅限香港就医、国际保障，或在法国就医的保障。" },
          { title: "检视现有保障", text: "与您一起细读现有保单：雇主团体保险、在法国投保的合约，以及是否参加法国海外侨民社保（CFE）。逐一检视保额上限、自付额、不保事项及保障地区。" },
          { title: "比较与建议", text: "以具体准则比较多份保单：保障项目、上限、自付额、等候期、不保事项、保障地区及保费日后的变化。您会收到有理有据的建议，并清楚说明其局限。" },
          { title: "投保前透明披露", text: "投保前，会向您披露双方关系的性质、报酬方式、与保险公司的关系及适用的监管身份。" },
          { title: "投保", text: "协助您填写投保书及健康问卷。完整准确地申报健康状况至关重要：任何遗漏都可能导致保险公司拒绝赔偿。" },
          { title: "持续检视", text: "需要会随时间改变：添丁、置业、转换雇主、离开香港。我们会在这些时刻检视您的保单，并协助您与保险公司沟通。" },
        ],
      },
      timeline: {
        heading: "需要多长时间才能获得保障？",
        paragraphs: [
          "分析与比较一般需要一至两星期。其后是投保阶段，所需时间主要取决于保险公司：情况简单者核保（underwriting）可以很快；如需体检或补充资料，则可能需要数星期。",
          "请留意等候期：部分保障（例如产科）须经过一段等候期后才生效。如您即将离职或计划怀孕，宜及早安排，以免出现保障空档。",
          "就长期人寿保险而言，香港的规定设有冷静期（cooling-off period），在保单交付后的一段时间内，您可以取消保单。",
        ],
      },
      documents: {
        heading: "需要准备哪些文件？",
        paragraphs: ["分析及投保时，请准备："],
        list: [
          "现有保单（包括雇主团体保险）的条款及保障表",
          "护照及香港身份证",
          "住址证明",
          "所有受保人的病历：正在接受的治疗、住院记录及相关报告",
          "收入、未偿还贷款及受养人资料，用以厘定人寿保险的保额",
          "拟指定受益人的联络资料",
        ],
      },
    },
  },
};

export function getServiceDetail(locale: Locale, index: number): ServiceDetail | undefined {
  return details[index]?.[locale];
}
