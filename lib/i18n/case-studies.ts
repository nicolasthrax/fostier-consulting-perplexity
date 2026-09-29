/**
 * "Typical situations" on the About page: composite, illustrative scenarios built from
 * the kinds of requests the services cover. They are NOT real clients — keep them free
 * of names, figures, results, quotes and testimonials, and keep the disclaimer visible.
 */

import type { Locale } from "@/lib/i18n/config";

export type CaseStudy = {
  title: string;
  situation: string;
  /** What the support covers, in order. */
  steps: string[];
  /** Indexes into `services.items` (and `serviceSlugs`). */
  services: number[];
};

export type CaseStudiesCopy = {
  heading: string;
  intro: string;
  disclaimer: string;
  stepsLabel: string;
  servicesLabel: string;
  items: CaseStudy[];
};

export const caseStudies: Record<Locale, CaseStudiesCopy> = {
  fr: {
    heading: "Situations types",
    intro: "Trois exemples de ce que recouvre concrètement notre accompagnement, de l'arrivée à Hong Kong jusqu'au retour en France.",
    disclaimer:
      "Exemples illustratifs, composés à partir de demandes courantes : il ne s'agit pas de clients réels, et ils ne préjugent d'aucun résultat.",
    stepsLabel: "Ce que nous faisons ensemble",
    servicesLabel: "Services concernés",
    items: [
      {
        title: "Une famille qui s'installe à Hong Kong depuis Paris",
        situation:
          "Un couple et leurs deux enfants arrivent de Paris pour un poste en contrat local. Il faut ouvrir un compte bancaire alors que le bail n'est pas encore signé, et choisir une assurance santé pour toute la famille, en complément ou non de la couverture de l'employeur.",
        steps: [
          "Établir la liste des documents demandés par les banques et l'ordre des démarches",
          "Préparer le dossier d'ouverture de compte et suivre la demande",
          "Analyser la couverture santé de l'employeur au regard des besoins de la famille",
          "Comparer des contrats d'assurance santé et les expliquer en français",
        ],
        services: [2, 3],
      },
      {
        title: "Un salarié qui remplit sa première déclaration à Hong Kong",
        situation:
          "Arrivé en cours d'année fiscale, un cadre reçoit en mai sa première déclaration de revenus. Il a perçu un bonus, son employeur prend en charge son logement, et il loue toujours son appartement en France.",
        steps: [
          "Rassembler la déclaration de l'employeur (IR56B) et le détail de la rémunération",
          "Vérifier les rubriques et les déductions auxquelles il a droit",
          "Déposer la déclaration sur eTAX et anticiper l'impôt provisionnel",
          "L'orienter vers un professionnel habilité pour ses revenus locatifs en France",
        ],
        services: [1],
      },
      {
        title: "Un départ de Hong Kong à organiser",
        situation:
          "Après plusieurs années à Hong Kong, une salariée rentre en France. Elle doit régulariser sa situation fiscale avant le départ, décider de ce qu'elle fait de ses comptes MPF et éviter toute interruption de sa couverture santé.",
        steps: [
          "Bâtir le calendrier des démarches à partir de la date de départ",
          "Préparer la déclaration de départ et les échanges avec l'administration fiscale",
          "Constituer le dossier de retrait du MPF",
          "Passer en revue les contrats d'assurance et les comptes à conserver",
        ],
        services: [1, 2, 3],
      },
    ],
  },
  en: {
    heading: "Typical situations",
    intro: "Three examples of what our support covers in practice, from arriving in Hong Kong to moving back to France.",
    disclaimer:
      "Illustrative composite examples drawn from common requests. They are not real clients and do not imply any particular outcome.",
    stepsLabel: "What we work on together",
    servicesLabel: "Related services",
    items: [
      {
        title: "A family moving to Hong Kong from Paris",
        situation:
          "A couple and their two children arrive from Paris for a job on a local contract. They need to open a bank account before the lease is even signed, and choose health insurance for the whole family, alongside or instead of the employer's cover.",
        steps: [
          "List the documents banks ask for and the order of the steps",
          "Prepare the account application and follow it through",
          "Review the employer's health cover against the family's needs",
          "Compare health insurance policies and explain them in French",
        ],
        services: [2, 3],
      },
      {
        title: "An employee filing a first Hong Kong tax return",
        situation:
          "Having arrived part-way through the tax year, a manager receives a first tax return in May. There is a bonus, housing paid for by the employer, and a flat in France that is still rented out.",
        steps: [
          "Gather the employer's return (IR56B) and the breakdown of pay",
          "Check each section and the deductions available",
          "File on eTAX and plan ahead for provisional tax",
          "Refer the French rental income to a qualified professional in France",
        ],
        services: [1],
      },
      {
        title: "A departure from Hong Kong to organise",
        situation:
          "After several years in Hong Kong, an employee is moving back to France. Her tax affairs must be settled before she leaves, she has to decide what to do with her MPF accounts, and her health cover must not lapse.",
        steps: [
          "Build the timeline of steps back from the departure date",
          "Prepare the departure tax return and correspondence with the tax office",
          "Put together the MPF withdrawal file",
          "Review the insurance policies and the accounts to keep",
        ],
        services: [1, 2, 3],
      },
    ],
  },
  zh: {
    heading: "典型情况",
    intro: "以下三个示例说明我们的服务在实际中涵盖哪些内容，从抵港安顿到返回法国。",
    disclaimer: "以下为根据常见咨询综合而成的示意案例，并非真实客户，亦不代表任何特定结果。",
    stepsLabel: "我们与您一起处理的事项",
    servicesLabel: "相关服务",
    items: [
      {
        title: "从巴黎移居香港的家庭",
        situation:
          "一对夫妇带着两个孩子从巴黎来港，以本地合约任职。他们需要在租约尚未签订时开设银行账户，并为全家选择医疗保险，作为雇主保障的补充或替代。",
        steps: [
          "整理银行所需文件清单及办理顺序",
          "准备开户申请资料并跟进申请进度",
          "对照家庭需要，分析雇主提供的医疗保障",
          "比较医疗保险计划，并以法语讲解",
        ],
        services: [2, 3],
      },
      {
        title: "首次在港填写报税表的雇员",
        situation:
          "一位在课税年度中途抵港的经理于五月收到首份报税表。他获发花红，住所由雇主承担，而在法国的公寓仍在出租。",
        steps: [
          "收集雇主填报的薪酬报表（IR56B）及薪酬明细",
          "核对各栏目及可申索的扣除项目",
          "通过「税务易」（eTAX）提交报税表，并预先规划暂缴税",
          "就其法国租金收入，转介法国合资格专业人士",
        ],
        services: [1],
      },
      {
        title: "需要规划的离港安排",
        situation:
          "在港工作多年后，一位雇员准备返回法国。她需要在离港前清缴税款，决定如何处理强积金账户，并确保医疗保障不会中断。",
        steps: [
          "以离港日期为基准，倒排各项手续的时间表",
          "准备离港报税表及与税务局的往来沟通",
          "整理强积金提取申请文件",
          "检视需保留的保险保单及银行账户",
        ],
        services: [1, 2, 3],
      },
    ],
  },
};
