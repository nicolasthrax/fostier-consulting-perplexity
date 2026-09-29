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
  translations: Partial<Record<Locale, GuideTranslation>>;
};

export const guides: Guide[] = [
  {
    id: "hong-kong-tax-return",
    status: "published",
    published: "2026-09-29",
    updated: "2026-09-29",
    service: 1,
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
    },
  },
  {
    id: "leaving-hong-kong",
    status: "published",
    published: "2026-09-29",
    updated: "2026-09-29",
    service: 1,
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
