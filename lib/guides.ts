import type { Locale } from "./i18n/config";
import type { FaqItem } from "./i18n/faq";

/**
 * Practical guides (/[lang]/guides). A guide can exist in one language only;
 * hreflang, the sitemap and the language switcher only link the translations it has.
 *
 * To publish a guide:
 *   1. Write it below (FR first is fine), with real dates in ISO format.
 *   2. Preview with `npm run dev` — drafts render there, never in production builds.
 *   3. Set `status: "published"`. The guides index, the "Guides" nav link, the
 *      sitemap, llms.txt and the Article JSON-LD pick it up automatically.
 *   4. After deploying, run `npm run indexnow` and request indexing in Search Console.
 *
 * Write the first paragraph as a self-contained answer to the title's question, use
 * question-style headings, and keep facts dated and specific — this is what search
 * engines and AI assistants quote.
 */

export type GuideSection = { heading: string; paragraphs: string[]; list?: string[] };

export type GuideTranslation = {
  slug: string;
  title: string;
  /** <title> topic, ≤ 60 characters with " | Fostier Consulting" appended. */
  metaTitle: string;
  /** 120–155 characters (FR/EN), ~50–80 characters (ZH). */
  description: string;
  lead: string;
  sections: GuideSection[];
  faq?: FaqItem[];
};

export type Guide = {
  id: string;
  status: "draft" | "published";
  /** ISO dates. */
  published: string;
  updated: string;
  /** Index of the related service in `services.items`. */
  service?: number;
  /** Topic keywords, shared by all translations; output as the Article's `keywords`. */
  tags?: string[];
  translations: Partial<Record<Locale, GuideTranslation>>;
};

export const guides: Guide[] = [
  {
    id: "hong-kong-tax-return",
    status: "published",
    published: "2026-09-29",
    updated: "2026-09-30",
    service: 1,
    tags: ["Hong Kong salaries tax", "BIR60", "eTAX", "provisional tax", "France–Hong Kong tax treaty", "French expats"],
    translations: {
      fr: {
        slug: "declaration-impots-hong-kong-francais",
        title: "Déclarer ses revenus à Hong Kong quand on est Français",
        metaTitle: "Impôts à Hong Kong pour les Français : le guide",
        description:
          "Qui doit déclarer à Hong Kong, quand arrive la BIR60, quels délais et documents prévoir, l'impôt provisionnel et ce qu'il faut vérifier côté France.",
        lead: "Tout Français qui travaille à Hong Kong est soumis au salaries tax sur les revenus de son emploi local et doit remplir la déclaration individuelle (formulaire BIR60) que l'Inland Revenue Department (IRD) envoie chaque année début mai, pour l'année fiscale du 1er avril au 31 mars. Le délai est d'un mois, prolongé d'un mois en cas de dépôt en ligne sur eTAX. Ce guide détaille le calendrier, les documents à réunir, l'impôt provisionnel, les points à vérifier côté France et les erreurs les plus fréquentes.",
        sections: [
          {
            heading: "Qui doit remplir une déclaration à Hong Kong ?",
            paragraphs: [
              "Hong Kong applique un principe de territorialité : le salaries tax frappe les revenus tirés d'un emploi, d'une fonction ou d'une pension ayant leur source à Hong Kong, quelle que soit votre nationalité. Un Français en contrat local, un salarié détaché qui travaille sur place ou un dirigeant rémunéré par une société hongkongaise sont donc concernés dès leur première année.",
              "En règle générale, les particuliers ne sont pas imposés à Hong Kong sur les plus-values, les dividendes ou les intérêts bancaires perçus à titre privé. En revanche, les loyers d'un bien situé à Hong Kong relèvent du property tax, et les revenus d'une activité indépendante exercée à Hong Kong (entreprise individuelle, ou sole proprietorship) du profits tax. Tous ces revenus se déclarent sur le même formulaire BIR60.",
              "Si vous recevez une BIR60, vous devez la remplir et la renvoyer, même si vous pensez ne rien devoir. Si vous êtes imposable mais n'avez reçu aucune déclaration — cas fréquent la première année —, la loi vous oblige à le signaler par écrit à l'IRD dans les quatre mois qui suivent la fin de l'année fiscale, soit au plus tard le 31 juillet pour le salaries tax (formulaire IR6167). Ne pas avoir reçu de déclaration ne dispense pas de l'impôt.",
              "Arriver ou partir en cours d'année ne change pas le principe : seuls les revenus de la période passée à Hong Kong sont déclarés. Un départ définitif obéit en revanche à une procédure spécifique de régularisation fiscale, décrite dans notre guide sur les démarches pour quitter Hong Kong.",
            ],
          },
          {
            heading: "Quand arrive la déclaration et quelle est la date limite ?",
            paragraphs: [
              "L'IRD envoie les déclarations individuelles en une seule vague, le premier jour ouvré de mai. Pour l'année fiscale 2025/26 (du 1er avril 2025 au 31 mars 2026), les BIR60 ont été émises le 4 mai 2026. La date limite est d'un mois après l'émission, soit le 4 juin 2026, et de trois mois pour les entrepreneurs individuels, soit le 4 août 2026.",
              "Une prolongation d'un mois est accordée automatiquement pour les déclarations déposées en ligne : le 4 juillet 2026 dans le cas général, le 4 septembre 2026 pour les entrepreneurs individuels. Si vous ne pouvez pas respecter le délai pour une autre raison (absence prolongée, maladie), demandez une prolongation par écrit avant l'échéance, en la motivant : elle n'est pas de droit.",
              "Une fois la déclaration traitée, l'IRD vous adresse un avis d'imposition qui réunit l'impôt définitif de l'année écoulée et l'impôt provisionnel de l'année en cours. Le paiement se fait en général en deux échéances, la première en début d'année civile et la seconde au printemps ; les dates exactes figurent sur l'avis. Si vous contestez l'imposition, l'objection doit être formée par écrit dans le mois qui suit la date de l'avis.",
            ],
          },
          {
            heading: "Quels documents préparer ?",
            paragraphs: [
              "La plupart des chiffres à reporter viennent de votre employeur, qui déclare chaque année vos rémunérations à l'IRD sur le formulaire IR56B et doit vous en remettre une copie, généralement en avril. Réunissez ces pièces avant d'ouvrir la déclaration, c'est ce qui prend le plus de temps :",
            ],
            list: [
              "La copie de l'IR56B de chaque employeur de l'année, et le cas échéant les formulaires d'arrivée (IR56E), de fin de contrat (IR56F) ou de départ de Hong Kong (IR56G).",
              "Le détail des éléments variables : bonus, commissions, indemnités, actions gratuites ou stock-options, et avantages en nature — en particulier un logement fourni ou pris en charge par l'employeur, qui suit des règles de calcul propres.",
              "Le relevé de vos cotisations obligatoires au MPF, déductibles dans la limite d'un plafond annuel.",
              "Les justificatifs des autres déductions : primes d'assurance santé agréées dans le cadre du Voluntary Health Insurance Scheme (VHIS), cotisations volontaires déductibles au MPF (TVC) ou rentes différées agréées (QDAP), loyer de votre résidence, intérêts d'emprunt immobilier, dons à des organismes agréés, frais de formation.",
              "Les informations nécessaires aux abattements familiaux : situation de votre conjoint, actes de naissance des enfants, parents ou grands-parents à charge.",
              "Si vous travaillez en partie hors de Hong Kong : un décompte de vos jours de présence et de déplacement, et les preuves de l'impôt éventuellement payé à l'étranger.",
              "Votre dernier avis d'imposition, pour vérifier l'impôt provisionnel déjà réglé.",
            ],
          },
          {
            heading: "Comment déposer sa déclaration sur eTAX ?",
            paragraphs: [
              "Le dépôt en ligne se fait sur eTAX, le service électronique de l'IRD, qui comprend depuis juillet 2025 un portail dédié aux particuliers (Individual Tax Portal) et une application mobile. Vous vous connectez avec iAM Smart, l'identité numérique du gouvernement de Hong Kong, ou avec votre compte eTAX. Le formulaire en ligne reprend les rubriques de la BIR60 papier et vous obtenez un accusé de réception dès l'envoi.",
              "Deux avantages justifient à eux seuls le dépôt en ligne : le mois de délai supplémentaire, et l'absence de risque postal. Le papier reste possible, mais l'IRD refuse les envois insuffisamment affranchis et ce sont eux qui font manquer le plus de délais.",
              "Chaque conjoint remplit sa propre déclaration. Un couple marié peut opter pour une imposition commune (joint assessment) lorsqu'elle est plus favorable, et une personne qui a d'autres revenus imposables à Hong Kong, comme des loyers, peut demander l'imposition personnelle (personal assessment). Ces options se cochent directement dans la déclaration ; elles méritent une simulation avant d'être retenues.",
              "L'IRD calcule l'impôt de deux façons et retient la moins élevée : un barème progressif appliqué au revenu net après abattements, ou un taux standard appliqué au revenu net sans abattements personnels. Il n'y a rien à choisir, mais une déclaration complète vous garantit de bénéficier de toutes les déductions.",
            ],
          },
          {
            heading: "Qu'est-ce que l'impôt provisionnel et peut-on le réduire ?",
            paragraphs: [
              "Hong Kong ne prélève pas l'impôt à la source sur les salaires. À la place, l'IRD fait payer un impôt provisionnel pour l'année en cours, calculé en principe sur les revenus de l'année précédente, puis l'impute sur l'impôt définitif l'année suivante. La première année d'imposition, l'avis réunit donc l'impôt définitif de l'année écoulée et l'impôt provisionnel de l'année en cours : une somme importante qu'il vaut mieux anticiper.",
              "Si vos revenus baissent sensiblement — revenus estimés inférieurs à 90 % de ceux de l'année précédente — ou si vous cessez votre emploi, vous pouvez demander à reporter (hold over) tout ou partie de l'impôt provisionnel. La demande doit être déposée au plus tard 28 jours avant la date de paiement, ou dans les 14 jours suivant l'émission de l'avis si cette date est plus tardive.",
            ],
          },
          {
            heading: "Faut-il aussi déclarer en France ?",
            paragraphs: [
              "Tout dépend de votre résidence fiscale au sens du droit français (article 4 B du Code général des impôts) : vous êtes résident de France si votre foyer ou votre lieu de séjour principal s'y trouve, si vous y exercez votre activité professionnelle principale, ou si le centre de vos intérêts économiques y est situé. Un seul de ces critères suffit.",
              "Si vous êtes devenu non-résident, vous ne déclarez en France que vos revenus de source française — typiquement les loyers d'un bien situé en France —, en ligne sur impots.gouv.fr, où votre dossier dépend du service des impôts des particuliers non-résidents. L'année de votre départ, une seule déclaration couvre les revenus perçus comme résident jusqu'à la date du départ, puis les seuls revenus de source française. Pensez à indiquer votre nouvelle adresse à l'administration fiscale.",
              "La France et Hong Kong ont signé le 21 octobre 2010 une convention fiscale destinée à éviter les doubles impositions, entrée en vigueur le 1er décembre 2011. Elle départage les situations où chacun des deux territoires vous considérerait comme résident et précise quel État peut imposer chaque catégorie de revenus. Pour en bénéficier, l'IRD peut délivrer un certificat de résidence fiscale à Hong Kong (Certificate of Resident Status).",
              "Si votre famille est restée en France, si vous êtes détaché par un employeur français ou si vous percevez des revenus importants des deux côtés, votre situation mérite l'analyse d'un avocat fiscaliste ou d'un expert-comptable habilité en France. Fostier Consulting peut vous aider à rassembler les pièces et à coordonner les échanges, mais ne se substitue pas à ce conseil.",
            ],
          },
          {
            heading: "Quelles sont les erreurs les plus fréquentes ?",
            paragraphs: ["Les mêmes oublis reviennent chaque année, surtout chez les nouveaux arrivants :"],
            list: [
              "Attendre une déclaration qui n'arrive pas, au lieu de signaler son assujettissement à l'IRD avant le 31 juillet.",
              "Oublier une partie de la rémunération : bonus versé après la fin de l'année fiscale mais rattaché à celle-ci, actions attribuées, logement pris en charge par l'employeur.",
              "Ne pas réclamer les déductions auxquelles on a droit (VHIS, loyer, cotisations MPF volontaires déductibles, enfants à charge).",
              "Sous-estimer le premier avis d'imposition, qui cumule impôt définitif et impôt provisionnel.",
              "Déménager sans prévenir l'IRD : un changement d'adresse doit être signalé dans le mois, sous peine de manquer un avis et ses délais.",
              "Déposer en retard : l'IRD peut alors fixer une imposition estimée et appliquer des pénalités.",
              "Quitter Hong Kong sans régulariser sa situation fiscale, ce qui bloque le versement du dernier salaire par l'employeur.",
            ],
          },
          {
            heading: "Comment Fostier Consulting vous accompagne",
            paragraphs: [
              "Nous préparons avec vous votre déclaration de revenus à Hong Kong : organisation des documents, vérification des rubriques et des déductions, assistance au dépôt sur eTAX, suivi du calendrier fiscal et des échanges avec l'IRD, en français. Vous restez responsable de l'exactitude de votre déclaration et de sa signature ; nous vous aidons à la remettre complète et dans les délais.",
            ],
          },
        ],
        faq: [
          {
            q: "Quand vais-je recevoir ma déclaration d'impôts à Hong Kong ?",
            a: "L'IRD envoie les déclarations individuelles (BIR60) le premier jour ouvré de mai ; pour l'année 2025/26, c'était le 4 mai 2026. Si vous êtes imposable et n'avez rien reçu, vous devez le signaler par écrit à l'IRD au plus tard le 31 juillet.",
          },
          {
            q: "Le mois de délai supplémentaire pour eTAX est-il automatique ?",
            a: "Oui. Pour l'année 2025/26, l'IRD accordait automatiquement un mois de plus aux déclarations déposées en ligne : le 4 juillet 2026 au lieu du 4 juin, et le 4 septembre au lieu du 4 août pour les entrepreneurs individuels.",
          },
          {
            q: "Dois-je déclarer mes intérêts bancaires et mes dividendes à Hong Kong ?",
            a: "En règle générale, non : les intérêts bancaires, les dividendes et les plus-values perçus à titre privé ne sont pas imposés à Hong Kong. Ils peuvent en revanche l'être en France si vous y êtes résident fiscal.",
          },
          {
            q: "Mon conjoint et moi faisons-nous une déclaration commune ?",
            a: "Chaque conjoint reçoit et remplit sa propre déclaration. Vous pouvez opter pour une imposition commune (joint assessment) si elle réduit l'impôt du couple ; l'option se fait dans les déclarations.",
          },
          {
            q: "Existe-t-il une convention fiscale entre la France et Hong Kong ?",
            a: "Oui. Une convention visant à éviter les doubles impositions a été signée le 21 octobre 2010 et est entrée en vigueur le 1er décembre 2011. Elle détermine notamment l'État de résidence en cas de conflit et le droit d'imposer chaque type de revenu.",
          },
        ],
      },
      en: {
        slug: "hong-kong-tax-return-french-expats",
        title: "Hong Kong Tax Filing for French Expats: A Territorial-Source Guide",
        metaTitle: "Hong Kong tax filing for French expats",
        description:
          "Who must file in Hong Kong, when the BIR60 arrives, deadlines and documents, provisional tax, and what to check on the French side.",
        lead: "Every French national working in Hong Kong pays salaries tax on income from their local employment and must complete the individual tax return (form BIR60) that the Inland Revenue Department (IRD) issues each year in early May, for the tax year running from 1 April to 31 March. You have one month to file, extended by one month if you file online through eTAX. This guide covers the calendar, the documents to gather, provisional tax, what to check on the French side and the most common mistakes.",
        sections: [
          {
            heading: "Who has to file a tax return in Hong Kong?",
            paragraphs: [
              "Hong Kong taxes on a territorial basis: salaries tax applies to income from an employment, office or pension that has its source in Hong Kong, whatever your nationality. A French national on a local contract, a seconded employee working in Hong Kong or a director paid by a Hong Kong company is therefore taxable from the first year.",
              "As a general rule, individuals are not taxed in Hong Kong on capital gains, dividends or bank interest received privately. Rent from a property in Hong Kong, however, falls under property tax, and income from a business carried on in Hong Kong as a sole proprietor falls under profits tax. All of these are reported on the same BIR60 form.",
              "If you receive a BIR60, you must complete and return it, even if you believe you owe nothing. If you are chargeable but have not received a return — common in your first year — the law requires you to notify the IRD in writing within four months of the end of the tax year, which means by 31 July for salaries tax (form IR6167). Not receiving a return does not exempt you from tax.",
              "Arriving or leaving part-way through the year does not change the principle: you only report income for the period spent in Hong Kong. Leaving for good, however, follows a specific tax clearance procedure, covered in our guide to leaving Hong Kong.",
            ],
          },
          {
            heading: "When does the tax return arrive and what is the deadline?",
            paragraphs: [
              "The IRD issues individual returns in a single bulk issue on the first working day of May. For the 2025/26 tax year (1 April 2025 to 31 March 2026), BIR60s were issued on 4 May 2026. The deadline is one month after issue, 4 June 2026, and three months for sole proprietors, 4 August 2026.",
              "A one-month extension is granted automatically to returns filed online: 4 July 2026 in general, and 4 September 2026 for sole proprietors. If you cannot meet the deadline for another reason (a long absence, illness), apply in writing for an extension before it falls due, giving your reasons: it is not granted as of right.",
              "Once the return has been processed, the IRD sends a notice of assessment combining final tax for the year just ended and provisional tax for the current year. Payment is usually due in two instalments, the first early in the calendar year and the second in spring; the exact dates are on the notice. If you disagree with the assessment, you must lodge a written objection within one month of the date of the notice.",
            ],
          },
          {
            heading: "Which documents should you prepare?",
            paragraphs: [
              "Most of the figures you will enter come from your employer, who reports your pay to the IRD each year on form IR56B and must give you a copy, usually in April. Gather these documents before you open the return — it is the step that takes longest:",
            ],
            list: [
              "A copy of the IR56B from each employer during the year and, where relevant, the forms for commencement (IR56E), cessation (IR56F) or departure from Hong Kong (IR56G).",
              "Details of variable pay: bonuses, commissions, allowances, share awards or stock options, and benefits in kind — in particular housing provided or paid for by your employer, which follows its own calculation rules.",
              "A statement of your mandatory MPF contributions, deductible up to an annual cap.",
              "Evidence for other deductions: premiums for certified health plans under the Voluntary Health Insurance Scheme (VHIS), tax-deductible voluntary MPF contributions (TVC) or qualifying deferred annuity premiums (QDAP), rent for your home, home loan interest, donations to approved charities, and self-education expenses.",
              "The information needed for family allowances: your spouse's situation, your children's birth certificates, and dependent parents or grandparents.",
              "If you work partly outside Hong Kong: a record of your days in and out of Hong Kong, and evidence of any tax paid abroad.",
              "Your last notice of assessment, to check the provisional tax you have already paid.",
            ],
          },
          {
            heading: "How do you file your return on eTAX?",
            paragraphs: [
              "Online filing is done on eTAX, the IRD's electronic service, which since July 2025 includes a dedicated Individual Tax Portal and a mobile app. You log in with iAM Smart, the Hong Kong government's digital identity, or with your eTAX account. The online form follows the sections of the paper BIR60 and you receive an acknowledgement as soon as you submit.",
              "Two advantages alone justify filing online: the extra month, and no postal risk. Paper is still accepted, but the IRD rejects items with insufficient postage, and those cause more missed deadlines than anything else.",
              "Each spouse completes their own return. A married couple can elect for joint assessment when it is more favourable, and someone with other taxable income in Hong Kong, such as rent, can elect for personal assessment. Both elections are made directly in the return; they are worth modelling before you choose them.",
              "The IRD computes the tax in two ways and charges the lower amount: progressive rates applied to net income after allowances, or a standard rate applied to net income without personal allowances. There is nothing to choose, but a complete return makes sure you get every deduction.",
            ],
          },
          {
            heading: "What is provisional tax and can you reduce it?",
            paragraphs: [
              "Hong Kong does not withhold tax from salaries. Instead, the IRD charges provisional tax for the current year, normally based on the previous year's income, and credits it against final tax the following year. In your first taxable year, the notice therefore combines final tax for the year just ended and provisional tax for the current year: a large sum that is best planned for.",
              "If your income falls significantly — estimated income below 90% of the previous year's — or if you stop working, you can apply to hold over all or part of your provisional tax. The application must be made no later than 28 days before the payment date, or within 14 days of the date of the notice if that is later.",
            ],
          },
          {
            heading: "Do you also have to file in France?",
            paragraphs: [
              "That depends on your tax residence under French law (article 4 B of the Code général des impôts): you are resident in France if your home or principal place of stay is there, if you carry on your main professional activity there, or if the centre of your economic interests is there. Any one of these criteria is enough.",
              "If you have become non-resident, you only declare French-source income in France — typically rent from a property in France — online at impots.gouv.fr, where your file is handled by the tax office for non-resident individuals. In the year you leave, a single return covers income received as a resident up to the date of departure, then French-source income only. Remember to give the tax authorities your new address.",
              "France and Hong Kong signed a double taxation agreement on 21 October 2010, which came into force on 1 December 2011. It resolves situations where both territories would treat you as resident and sets out which one may tax each category of income. To rely on it, the IRD can issue a Hong Kong Certificate of Resident Status.",
              "If your family has stayed in France, if you are seconded by a French employer or if you have significant income on both sides, your situation calls for advice from a tax lawyer or a chartered accountant qualified in France. Fostier Consulting can help you gather the documents and coordinate the exchanges, but does not replace that advice.",
            ],
          },
          {
            heading: "What are the most common mistakes?",
            paragraphs: ["The same oversights come up every year, especially among newcomers:"],
            list: [
              "Waiting for a return that never arrives, instead of notifying the IRD of your chargeability before 31 July.",
              "Leaving out part of your pay: a bonus paid after the end of the tax year but relating to it, share awards, employer-provided housing.",
              "Not claiming the deductions you are entitled to (VHIS, rent, tax-deductible voluntary MPF contributions, dependent children).",
              "Underestimating the first notice of assessment, which combines final and provisional tax.",
              "Moving home without telling the IRD: a change of address must be reported within one month, or you risk missing a notice and its deadlines.",
              "Filing late: the IRD can then issue an estimated assessment and impose penalties.",
              "Leaving Hong Kong without settling your tax position, which holds up your final salary payment from your employer.",
            ],
          },
          {
            heading: "How Fostier Consulting can help",
            paragraphs: [
              "We prepare your Hong Kong tax return with you: organising the documents, checking each section and deduction, helping you file on eTAX, and keeping track of the tax calendar and correspondence with the IRD, in French or English. You remain responsible for the accuracy of your return and for signing it; we help you submit it complete and on time.",
            ],
          },
        ],
        faq: [
          {
            q: "When will I receive my Hong Kong tax return?",
            a: "The IRD issues individual returns (BIR60) on the first working day of May; for 2025/26, that was 4 May 2026. If you are chargeable and have received nothing, you must notify the IRD in writing by 31 July.",
          },
          {
            q: "Is the extra month for eTAX filing automatic?",
            a: "Yes. For 2025/26, the IRD automatically gave returns filed online an extra month: 4 July 2026 instead of 4 June, and 4 September instead of 4 August for sole proprietors.",
          },
          {
            q: "Do I have to declare bank interest and dividends in Hong Kong?",
            a: "As a general rule, no: bank interest, dividends and capital gains received privately are not taxed in Hong Kong. They may be taxable in France if you are tax resident there.",
          },
          {
            q: "Do my spouse and I file a joint return?",
            a: "Each spouse receives and completes their own return. You can elect for joint assessment if it lowers the couple's tax; the election is made in the returns.",
          },
          {
            q: "Is there a tax treaty between France and Hong Kong?",
            a: "Yes. A double taxation agreement was signed on 21 October 2010 and came into force on 1 December 2011. Among other things, it decides residence where both sides claim you and which territory may tax each type of income.",
          },
        ],
      },
    },
  },
  {
    id: "leaving-hong-kong",
    status: "published",
    published: "2026-09-29",
    updated: "2026-09-29",
    service: 1,
    tags: ["leaving Hong Kong", "IR56G", "tax clearance", "MPF withdrawal", "returning to France"],
    translations: {
      fr: {
        slug: "quitter-hong-kong-checklist-demarches",
        title: "Quitter Hong Kong : la checklist des démarches avant de rentrer en France",
        metaTitle: "Quitter Hong Kong : la checklist des démarches",
        description:
          "Quitter Hong Kong sans rien oublier : IR56G et quitus fiscal, retrait du MPF, banque, assurances, logement, puis retour en France. Le calendrier pas à pas.",
        lead: "Pour quitter Hong Kong sereinement, trois démarches priment : prévenir votre employeur assez tôt pour qu'il dépose le formulaire IR56G au moins un mois avant votre départ et régler vos impôts auprès de l'IRD, décider si vous retirez votre MPF au titre du départ définitif — une possibilité offerte une seule fois dans une vie —, et garder un compte bancaire et une couverture santé jusqu'à ce que tout soit soldé. Cette checklist organise l'ensemble des démarches en quatre temps : trois mois avant, un mois avant, la dernière semaine et après votre arrivée en France.",
        sections: [
          {
            heading: "Que faire trois mois avant le départ ?",
            paragraphs: [
              "Trois mois, c'est le délai qui permet de tout faire sans urgence : la plupart des démarches hongkongaises dépendent d'une date de départ connue et de documents qui mettent plusieurs semaines à arriver.",
            ],
            list: [
              "Fixez votre date de départ et prévenez votre employeur au plus tôt : il doit déclarer votre départ à l'IRD au moins un mois avant, et vos derniers versements en dépendent.",
              "Relisez votre bail : préavis, clause de résiliation anticipée, état des lieux et conditions de restitution du dépôt de garantie.",
              "Faites le point sur vos assurances : une assurance santé collective prend généralement fin avec le contrat de travail, et une police individuelle peut avoir une zone de couverture qui n'inclut pas la France. Prévoyez la couverture de la période de transition.",
              "Recensez vos comptes MPF (un par employeur, parfois davantage) et demandez-vous si vous comptez revenir travailler à Hong Kong : le retrait pour départ définitif est irréversible.",
              "Choisissez les comptes bancaires à garder et renseignez-vous sur les conditions de votre banque pour les clients non-résidents.",
              "Demandez des devis de déménagement et, si vous avez des enfants, les certificats de scolarité et dossiers scolaires utiles à leur inscription en France.",
            ],
          },
          {
            heading: "Que faire un mois avant le départ ?",
            paragraphs: [
              "C'est l'étape fiscale. La loi de Hong Kong impose à toute personne imposable qui quitte le territoire pour plus d'un mois de prévenir l'IRD au moins un mois avant la date prévue, et à son employeur de déposer dans le même délai le formulaire IR56G. À compter de ce dépôt, l'employeur doit retenir toutes les sommes qu'il vous doit — salaire, bonus, remboursements — pendant un mois, ou jusqu'à ce que l'IRD lui adresse une lettre de mainlevée (letter of release), si elle arrive avant. Les salariés amenés à se déplacer fréquemment hors de Hong Kong pour leur travail ne sont pas concernés.",
              "L'IRD vous fait remplir une déclaration pour l'année du départ et émet en principe l'avis d'imposition avant votre départ. La lettre de mainlevée est délivrée une fois l'impôt payé : en espèces, par EPS ou par cashier order, elle l'est immédiatement ; par chèque, elle est envoyée par la poste une dizaine de jours plus tard. Même si vous ne devez rien, l'IRD délivre cette lettre à l'issue de la procédure.",
            ],
            list: [
              "Récupérez la copie de l'IR56G remise par votre employeur, votre lettre de fin de contrat et le décompte de votre dernière rémunération.",
              "Prenez contact avec l'IRD pour la régularisation (tax clearance), avec les justificatifs de vos déductions, une adresse postale à Hong Kong, un numéro de téléphone et votre future adresse à l'étranger.",
              "Préparez le retrait du MPF : formulaire de demande auprès de votre trustee ou sur la plateforme eMPF, déclaration sur l'honneur (statutory declaration) de départ définitif sans intention de revenir vivre ou travailler à Hong Kong, et justificatifs de votre droit de résider ailleurs. À Hong Kong, la déclaration se signe devant un Commissioner for Oaths du Home Affairs Department, un notaire (notary public) ou un Justice of the Peace.",
              "Donnez congé à votre propriétaire selon les termes du bail et fixez la date de l'état des lieux.",
              "Programmez la résiliation de l'électricité, du gaz, de l'eau, d'Internet et de votre abonnement mobile, avec relevé final des compteurs.",
              "Décidez pour chaque contrat d'assurance : maintien, adaptation ou résiliation, en vérifiant les conditions et sans laisser de période sans couverture.",
            ],
          },
          {
            heading: "Que faire la dernière semaine ?",
            paragraphs: [
              "La dernière semaine sert à récupérer les documents dont vous aurez besoin depuis la France et à garder un accès à tout ce qui restera ouvert à Hong Kong.",
            ],
            list: [
              "Récupérez la lettre de mainlevée de l'IRD : elle déclenche le versement des sommes retenues par votre employeur et peut aussi servir de justificatif pour le retrait du MPF.",
              "Faites l'état des lieux (photos à l'appui) et communiquez au propriétaire le compte sur lequel rembourser le dépôt.",
              "Mettez à jour votre adresse auprès de votre banque et votre auto-certification de résidence fiscale (formulaire CRS) si vous gardez un compte.",
              "Conservez un moyen de recevoir les codes de sécurité de votre banque, souvent envoyés par SMS à un numéro local, et gardez l'accès à votre application iAM Smart.",
              "Gardez votre carte d'identité de Hong Kong (HKID) : elle vous sera demandée pour le MPF, la banque ou l'IRD, et si vous revenez un jour. Si vous êtes résident permanent, renseignez-vous auprès de l'Immigration Department sur les conditions de maintien de votre statut.",
              "Envisagez le service de réexpédition du courrier de Hongkong Post, et rassemblez dans un seul dossier l'IR56G, la lettre de mainlevée, les pièces du MPF, vos dernières fiches de paie et le bail.",
            ],
          },
          {
            heading: "Que faire après l'arrivée en France ?",
            paragraphs: [
              "Vous redevenez en principe résident fiscal français à compter de la date de votre retour, dès lors que votre foyer ou votre lieu de séjour principal est de nouveau en France. Au printemps suivant, votre déclaration de revenus distingue deux périodes : jusqu'au retour, seuls vos revenus de source française sont déclarés ; après, l'ensemble de vos revenus mondiaux.",
            ],
            list: [
              "Signalez votre nouvelle adresse sur impots.gouv.fr.",
              "Déclarez chaque année, avec votre déclaration de revenus, les comptes bancaires détenus, utilisés ou clos à l'étranger au cours de l'année (formulaire 3916), y compris ceux de Hong Kong.",
              "Faites vérifier le traitement fiscal en France de votre retrait MPF et des contrats d'assurance ou d'épargne souscrits à Hong Kong avant de prendre une décision sur ces contrats.",
              "Inscrivez-vous auprès de l'Assurance Maladie (CPAM) : c'est votre employeur qui s'en charge si vous reprenez un emploi salarié, sinon vous faites la demande au titre de votre résidence. Renseignez-vous sur les délais d'ouverture de vos droits et gardez une couverture relais d'ici là, par exemple auprès de la Caisse des Français de l'Étranger (CFE) ou d'un assureur privé.",
              "Demandez votre radiation du registre des Français établis hors de France, en ligne ou auprès du consulat général de France à Hong Kong, et inscrivez-vous sur les listes électorales de votre commune.",
              "Suivez depuis la France les derniers mouvements à Hong Kong : versement du MPF, restitution du dépôt de garantie, remboursement éventuel d'impôt, courrier de l'IRD à votre adresse à l'étranger.",
            ],
          },
          {
            heading: "Quelles erreurs éviter en quittant Hong Kong ?",
            paragraphs: ["La plupart des difficultés viennent d'un calendrier trop serré ou d'une porte fermée trop tôt :"],
            list: [
              "Prévenir son employeur trop tard : l'IR56G est déposé hors délai et le dernier salaire reste bloqué plus longtemps.",
              "Fermer tous ses comptes à Hong Kong avant d'avoir reçu le dépôt de garantie, le MPF, le dernier salaire ou un remboursement d'impôt.",
              "Résilier son numéro de mobile local alors qu'il sert à recevoir les codes de sécurité de la banque.",
              "Retirer son MPF au titre du départ définitif en envisageant de revenir : ce retrait n'est possible qu'une fois dans une vie, et une fausse déclaration est une infraction pénale.",
              "Laisser un trou de couverture santé entre la fin de l'assurance hongkongaise et l'ouverture des droits en France.",
              "Oublier de déclarer en France les comptes restés ouverts à Hong Kong.",
            ],
          },
          {
            heading: "Comment Fostier Consulting vous accompagne",
            paragraphs: [
              "Nous vous aidons à préparer votre déclaration de départ et la régularisation auprès de l'IRD, à organiser les documents du MPF, à faire le point sur vos comptes bancaires et vos contrats d'assurance, et à tenir le calendrier jusqu'à votre installation en France, en français. Pour les questions de fiscalité française, nous vous orientons vers un professionnel habilité.",
            ],
          },
        ],
        faq: [
          {
            q: "Mon employeur peut-il retenir mon dernier salaire quand je quitte Hong Kong ?",
            a: "Oui, c'est même une obligation légale. Après avoir déposé l'IR56G, votre employeur doit retenir les sommes qu'il vous doit pendant un mois, ou jusqu'à ce que l'IRD lui adresse la lettre de mainlevée délivrée une fois vos impôts réglés.",
          },
          {
            q: "Faut-il une régularisation fiscale pour un départ temporaire ?",
            a: "L'obligation de prévenir l'IRD vise les personnes imposables qui quittent Hong Kong pour plus d'un mois. Les salariés qui voyagent fréquemment pour leur travail en sont dispensés et continuent à déclarer chaque année.",
          },
          {
            q: "Puis-je retirer mon MPF avant de quitter Hong Kong ?",
            a: "La déclaration sur l'honneur peut porter sur un départ déjà effectué ou à venir. Le trustee décide au vu de l'ensemble des pièces : un passeport seul ne suffit pas à prouver votre droit de résider ailleurs, d'où l'intérêt de préparer le dossier tôt.",
          },
          {
            q: "Dois-je fermer mes comptes bancaires à Hong Kong ?",
            a: "Rien ne vous y oblige, mais chaque banque fixe ses conditions pour les clients non-résidents. Si vous gardez un compte en redevenant résident fiscal français, vous devez le déclarer chaque année sur le formulaire 3916.",
          },
          {
            q: "À partir de quand suis-je de nouveau résident fiscal en France ?",
            a: "En principe à la date de votre retour, lorsque votre foyer ou votre lieu de séjour principal est de nouveau en France. L'année du retour, votre déclaration distingue la période de non-résidence et celle de résidence.",
          },
        ],
      },
    },
  },
  {
    id: "moving-savings-france-hong-kong",
    // Draft: new regulatory content, to be checked by Lucie before publishing.
    status: "draft",
    published: "2026-09-30",
    updated: "2026-09-30",
    service: 2,
    tags: ["moving money to Hong Kong", "international bank transfer", "Hong Kong bank account", "form 3916", "CRS", "French expats"],
    translations: {
      en: {
        slug: "moving-savings-france-to-hong-kong",
        title: "Transferring Savings and Capital from France to Hong Kong: Banking and Compliance",
        metaTitle: "Moving savings from France to Hong Kong",
        description:
          "How to move savings from France to Hong Kong: opening a local account, transfer options, source-of-funds checks, and what to declare in France.",
        lead: "Moving your own savings from France to Hong Kong is not taxed in either place and Hong Kong has no exchange controls, so the transfer itself is simple. The work lies around it: opening a Hong Kong account first, documenting where the money comes from so both banks release it without delay, choosing how to convert euros into Hong Kong or US dollars, and keeping your French reporting obligations in order. This guide takes those steps in the order you will meet them.",
        sections: [
          {
            heading: "Should you move your savings at all?",
            paragraphs: [
              "Not necessarily all of them. Money you will spend in Hong Kong — deposits, rent, day-to-day costs — belongs in a Hong Kong account. Savings earmarked for projects in France, such as buying property or a return in a few years, may be better left in euros to avoid converting twice.",
              "Before moving anything, check with your French bank which accounts and products you can keep as a non-resident. Some regulated savings products are reserved for French tax residents, and some banks restrict or close accounts held by clients living abroad. Life insurance contracts (assurance-vie) and securities accounts are generally kept, but the tax treatment changes with your residence, so each one deserves a review rather than an automatic transfer.",
            ],
          },
          {
            heading: "How do you open a bank account in Hong Kong?",
            paragraphs: [
              "Open the Hong Kong account before you plan the transfer: you cannot send money until you have a local account number. Banks set their own requirements, but you should expect to provide:",
            ],
            list: [
              "Your passport and, once issued, your Hong Kong identity card (HKID).",
              "Proof of residential address — a tenancy agreement or a recent utility bill; some banks accept a letter from your employer while you are in temporary housing.",
              "Proof of employment or income: an employment contract, an employer letter or recent payslips.",
              "Your tax identification numbers for every country where you are tax resident, for the Common Reporting Standard (CRS) self-certification.",
            ],
          },
          {
            heading: "Which documents prove the source of funds?",
            paragraphs: [
              "Anti-money-laundering rules require both the sending and the receiving bank to understand where large amounts come from. A transfer that arrives without explanation can be held while the bank asks questions. Preparing the evidence in advance is the most effective way to avoid delays:",
            ],
            list: [
              "Statements from the French account the funds are leaving, covering the recent months.",
              "Evidence of how the savings were built up: payslips, a sale deed for a property, a notarial deed for an inheritance or gift, the closing statement of an investment.",
              "A short written explanation of the purpose of the transfer, such as settling in Hong Kong or a rental deposit.",
            ],
          },
          {
            heading: "How should you transfer and convert the money?",
            paragraphs: [
              "The usual route is an international bank transfer (SWIFT) from your French bank to your Hong Kong account. Compare the total cost, not just the fee: the exchange-rate margin on converting euros often costs more than the transfer charge itself. Online transfer services and multi-currency accounts can be cheaper for converting currency; check that the provider is authorised and that the amount fits within its limits.",
              "The Hong Kong dollar is pegged to the US dollar within a band of 7.75 to 7.85 under the Linked Exchange Rate System, so converting euros to Hong Kong dollars is, in practice, an exposure to the euro–dollar rate. For large amounts, splitting the conversion over several dates spreads that risk.",
              "Cash is a different matter: carrying €10,000 or more in cash or equivalent instruments when leaving the European Union must be declared to customs, and Hong Kong has its own declaration for large cash amounts on arrival. A bank transfer avoids both.",
            ],
          },
          {
            heading: "What do you need to declare in France?",
            paragraphs: [
              "As long as you are a French tax resident — including in the year you leave, for the period before departure — you must declare every bank account opened, held, used or closed abroad on form 3916 with your annual income tax return. Failing to do so carries a fixed fine per undeclared account. Once you are no longer a French tax resident, that obligation stops, but it applies again from the year you return.",
              "Hong Kong and France exchange financial account information automatically under the CRS: your Hong Kong bank reports your accounts to the IRD, which passes the information to the French tax authorities where you are a French tax resident, and the reverse applies to French accounts. Keep your self-certifications up to date whenever your residence changes.",
              "If you hold large shareholdings when you leave France, the French exit tax on unrealised gains may apply. That situation calls for advice from a tax lawyer or chartered accountant qualified in France before you leave.",
            ],
          },
          {
            heading: "What are the most common mistakes?",
            paragraphs: ["Most transfer problems come from timing and paperwork, not from the transfer itself:"],
            list: [
              "Planning the transfer before the Hong Kong account is fully open.",
              "Sending a large amount without source-of-funds evidence, then waiting weeks while the bank reviews it.",
              "Closing all French accounts too soon, then struggling to pay remaining French taxes, loans or charges.",
              "Converting everything at once without comparing the exchange-rate margin.",
              "Forgetting form 3916 for the Hong Kong account in the year of departure or the year of return.",
            ],
          },
          {
            heading: "How Fostier Consulting can help",
            paragraphs: [
              "We help you organise your savings between France and Hong Kong: choosing which accounts to keep, preparing the documents for opening an account and for source-of-funds checks, comparing transfer options and keeping your reporting calendar, in French or English. For questions of French tax law, we refer you to a qualified professional.",
            ],
          },
        ],
        faq: [
          {
            q: "Is transferring my savings to Hong Kong taxable?",
            a: "No. Moving your own money between your accounts is not income, so it is not taxed in France or in Hong Kong. Income those savings produce may be taxable in France, depending on your tax residence.",
          },
          {
            q: "Does Hong Kong limit how much money I can bring in?",
            a: "No. Hong Kong has no exchange controls. Banks will, however, ask about the source of large transfers under anti-money-laundering rules.",
          },
          {
            q: "Do I need to declare my Hong Kong bank account in France?",
            a: "Yes, on form 3916, for every year in which you are a French tax resident and hold, use or close the account — including the year you leave and the year you return.",
          },
          {
            q: "Can I keep my French bank accounts after moving to Hong Kong?",
            a: "Generally yes, but each bank sets its own conditions for non-resident clients, and some regulated savings products are reserved for French tax residents. Check with your bank before you leave.",
          },
        ],
      },
    },
  },
  {
    id: "hong-kong-insurance-checklist",
    // Draft: new regulatory content, to be checked by Lucie before publishing.
    status: "draft",
    published: "2026-09-30",
    updated: "2026-09-30",
    service: 3,
    tags: ["expat health insurance Hong Kong", "VHIS", "life insurance", "employees' compensation", "insurance checklist", "French expats"],
    translations: {
      en: {
        slug: "hong-kong-expat-insurance-checklist",
        title: "Hong Kong Expat Insurance Checklist: Health, Life and Residency Coverage",
        metaTitle: "Hong Kong expat insurance checklist",
        description:
          "The insurance checklist for French expats arriving in Hong Kong: health cover, gaps in employer plans, life cover, compulsory policies and French contracts.",
        lead: "When you move to Hong Kong, you leave the French Sécurité sociale system and your insurance becomes a set of separate choices. Holders of a Hong Kong identity card can use public hospitals at subsidised rates, but most French families also rely on private health cover, usually starting with an employer's group plan. This checklist covers what to review in your first weeks: health cover and its gaps, life and disability cover, the policies that are compulsory, and what to do with your French contracts.",
        sections: [
          {
            heading: "How does healthcare work for newcomers in Hong Kong?",
            paragraphs: [
              "Hong Kong's public hospitals and clinics, run by the Hospital Authority, charge heavily subsidised fees to eligible persons, which includes holders of a Hong Kong identity card. Waiting times for non-urgent care can be long, however, and many expatriates use the private sector, where costs are high and paid by the patient or their insurer.",
              "Until you receive your HKID, you are charged non-eligible-person rates in the public system. Make sure your private cover starts on your arrival date, not on your first day of work.",
            ],
          },
          {
            heading: "What should you check in your employer's health plan?",
            paragraphs: ["A group medical plan is a good start, but it is rarely complete. Check these points against your family's needs:"],
            list: [
              "Who is covered: yourself only, or your spouse and children, and at what extra cost.",
              "Inpatient and outpatient limits, room class, and whether specialists and diagnostics are covered.",
              "Maternity cover and any waiting period before it applies.",
              "Pre-existing conditions, which group plans may exclude or cap.",
              "Geographic scope: whether treatment in France or elsewhere in Asia is covered, including during holidays.",
              "What happens when you leave the job: group cover usually ends with the contract, and moving to an individual plan later may mean new exclusions.",
            ],
          },
          {
            heading: "Should you add individual health insurance?",
            paragraphs: [
              "An individual plan fills the gaps in a group plan and stays with you if you change employer. Certified individual indemnity plans under the Voluntary Health Insurance Scheme (VHIS) meet minimum standards set by the Hong Kong government, and their premiums are deductible from salaries tax, up to HK$8,000 per insured person per year.",
              "French nationals can also keep a link with the French system through the Caisse des Français de l'Étranger (CFE), either alone or combined with a private top-up plan. Compare the options on cost, age limits, waiting periods and cover in France before choosing.",
            ],
          },
          {
            heading: "Do you need life and disability cover?",
            paragraphs: [
              "If your family depends on your income, check the life and disability cover provided by your employer, often expressed as a multiple of salary, and whether it is enough for your family's needs and commitments, such as a mortgage in France.",
              "Individual life policies in Hong Kong are regulated by the Insurance Authority and are often denominated in Hong Kong or US dollars. For most long-term life policies, you have a cooling-off period of 21 calendar days after delivery of the policy or the cooling-off notice, whichever is earlier, during which you can cancel. Check with a qualified adviser how such a contract would be treated in France if you return.",
            ],
          },
          {
            heading: "Which insurance policies are compulsory in Hong Kong?",
            paragraphs: ["A few situations make insurance a legal requirement:"],
            list: [
              "Employing a domestic helper: the employer must hold employees' compensation insurance for the helper under the Employees' Compensation Ordinance. Most families also add medical cover for the helper.",
              "Owning or using a car: third-party motor insurance is compulsory.",
              "Running a business with employees: employees' compensation insurance is compulsory for all staff.",
            ],
          },
          {
            heading: "Which other policies are worth considering?",
            paragraphs: ["Depending on your situation:"],
            list: [
              "Home contents and personal liability insurance, which landlords sometimes require and which covers damage to neighbours' flats, for example from a water leak.",
              "Travel insurance, checking that it covers trips to France: some policies exclude your country of nationality.",
              "Critical illness cover, as a complement to medical insurance, if a serious illness would stop you from working.",
            ],
          },
          {
            heading: "What should you do with your French insurance contracts?",
            paragraphs: [
              "Review every French contract when you leave, rather than cancelling or keeping them all by default. A complementary health plan (mutuelle) tied to French social security generally stops being useful once you leave the system; home insurance ends with the lease; death and disability cover (prévoyance) and borrower insurance on a French mortgage often need to be kept, but some contracts restrict cover for residents abroad. Tell each insurer about your change of residence and check the terms in writing.",
            ],
          },
          {
            heading: "How Fostier Consulting can help",
            paragraphs: [
              "We review your employer's cover with you, identify the gaps, and compare health, life and critical illness solutions suited to your family, in French or English. We also help you sort out your French contracts before and after the move.",
            ],
          },
        ],
        faq: [
          {
            q: "Can I use Hong Kong public hospitals as a French expat?",
            a: "Yes. Holders of a Hong Kong identity card are eligible persons and pay subsidised fees. Until you have your HKID, you pay non-eligible-person rates.",
          },
          {
            q: "Is health insurance compulsory in Hong Kong?",
            a: "Not for individuals, but it is strongly advisable because private care is expensive. Employees' compensation insurance is compulsory for employers, including families who employ a domestic helper.",
          },
          {
            q: "Are health insurance premiums tax-deductible in Hong Kong?",
            a: "Premiums for certified VHIS plans are deductible from salaries tax, up to HK$8,000 per insured person per year, for yourself and eligible dependants.",
          },
          {
            q: "Can I keep French social security while living in Hong Kong?",
            a: "Not automatically, unless you are a seconded employee. You can join the Caisse des Français de l'Étranger (CFE), which provides optional cover along the lines of French social security.",
          },
        ],
      },
    },
  },
];

/** Drafts are visible in `next dev` only, so Lucie can preview without publishing. */
const isVisible = (g: Guide) => g.status === "published" || process.env.NODE_ENV === "development";

export const visibleGuides = () => guides.filter(isVisible);

export const guidesIn = (locale: Locale) => visibleGuides().filter((g) => g.translations[locale]);

export const findGuide = (locale: Locale, slug: string) =>
  visibleGuides().find((g) => g.translations[locale]?.slug === slug);

/** Path per available locale, e.g. { fr: "/guides/declaration-…" }. */
export const guidePaths = (g: Guide): Partial<Record<Locale, string>> =>
  Object.fromEntries(Object.entries(g.translations).map(([l, t]) => [l, `/guides/${t!.slug}`]));

export const hasGuides = () => visibleGuides().length > 0;

export const guidesCopy: Record<
  Locale,
  { nav: string; title: string; metaTitle: string; intro: string; description: string; by: string; back: string; related: string; otherLanguages: string; languageName: Record<Locale, string> }
> = {
  fr: {
    nav: "Guides",
    title: "Guides pratiques",
    metaTitle: "Guides pratiques : vivre et investir à Hong Kong",
    intro: "Des réponses claires aux questions que se posent les résidents français à Hong Kong : impôts, banque, épargne, assurance et projets avec la Chine.",
    description: "Guides pratiques de Fostier Consulting pour les résidents français à Hong Kong : impôts, banque, épargne, assurance et projets entre la France et la Chine.",
    by: "Par",
    back: "Tous les guides",
    related: "Service associé",
    otherLanguages: "Dans d'autres langues",
    languageName: { fr: "En français", en: "En anglais", zh: "En chinois" },
  },
  en: {
    nav: "Guides",
    title: "Practical guides",
    metaTitle: "Practical guides: living and investing in Hong Kong",
    intro: "Clear answers to the questions French residents of Hong Kong ask: tax, banking, savings, insurance and projects with China.",
    description: "Practical guides from Fostier Consulting for French residents of Hong Kong: tax, banking, savings, insurance and projects between France and China.",
    by: "By",
    back: "All guides",
    related: "Related service",
    otherLanguages: "In other languages",
    languageName: { fr: "In French", en: "In English", zh: "In Chinese" },
  },
  zh: {
    nav: "指南",
    title: "实用指南",
    metaTitle: "实用指南：在香港生活与投资",
    intro: "为在港法国居民清晰解答常见问题：税务、银行、储蓄、保险及对华项目。",
    description: "Fostier Consulting 为在港法国居民撰写的实用指南：税务、银行、储蓄、保险及中法项目。",
    by: "作者",
    back: "全部指南",
    related: "相关服务",
    otherLanguages: "其他语言版本",
    languageName: { fr: "法语", en: "英语", zh: "中文" },
  },
};
