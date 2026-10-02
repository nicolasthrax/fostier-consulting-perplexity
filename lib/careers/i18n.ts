/**
 * Candidate-facing wording for the recruitment portal, in English and French.
 * The admin board stays in English. If the versions differ, English prevails.
 */
import { site } from "@/lib/site";

export const careersLocales = ["en", "fr"] as const;
export type CareersLocale = (typeof careersLocales)[number];
/** Served at /careers; the other language gets a prefix (/careers/en). */
export const DEFAULT_CAREERS_LOCALE: CareersLocale = "fr";
export const isCareersLocale = (v: unknown): v is CareersLocale => careersLocales.includes(v as CareersLocale);
export type Localized = Record<CareersLocale, string>;

/** Date the candidate privacy notice was last revised (also shown on the page). */
export const NOTICE_UPDATED = "2026-10-02";

type Section = { heading: string; body?: string; items?: string[] };

const en = {
  htmlLang: "en",
  languageName: "English",
  switchTo: "Version française",
  careers: "Careers",
  skip: "Skip to content",
  footer: {
    notice: "Candidate privacy notice",
    legal: "Legal notice",
    brn: `BR No. ${site.brn}`,
  },
  index: {
    metaTitle: "Careers",
    title: "Work with Fostier Consulting",
    intro:
      "We advise French residents in Hong Kong on their finances, and companies working between France and China. No experience is needed, and students are welcome to apply. Choose an open position below.",
    none: "There are no open positions right now.",
    questions: "Questions? Write to",
  },
  job: {
    back: "All positions",
    termsHeading: "Pay and conduct",
  },
  equalOpportunity:
    "We welcome applications from everyone and assess candidates on merit. In line with Hong Kong's anti-discrimination ordinances, we do not discriminate on grounds of sex, pregnancy, breastfeeding, marital status, disability, family status or race.",
  form: {
    ariaLabel: (job: string) => `Apply for ${job}`,
    stepsLabel: "Application steps",
    stepOf: (i: number, n: number) => `Step ${i} of ${n}: `,
    completed: " (completed)",
    steps: ["Basic info", "CV", "Screening", "Review"],
    headings: ["About you", "Your CV", "A few questions", "Check your application"],
    required: " (required)",
    optional: " (optional)",
    pics: (href: string) => ({
      before:
        "We collect this information to assess your application. Fields not marked optional are required: without them we can't consider your application. Read our ",
      link: "candidate privacy notice",
      after: " to see who sees your data, how long we keep it and how to access or correct it.",
      href,
    }),
    fullName: "Full name",
    email: "Email",
    phone: "Phone number",
    linkedin: "LinkedIn profile URL",
    portfolio: "Portfolio or GitHub URL",
    dropHere: "Drag your CV here, or ",
    choose: "choose a file",
    cvHint: "PDF or Word (.docx), 4 MB maximum",
    cvSensitive:
      "Please leave out your HKID or passport number and any sensitive details (health, religion, political views). We don't need them at this stage.",
    remove: (name: string) => `Remove ${name}`,
    workAuthorization: "Work authorisation in Hong Kong",
    select: "Select…",
    commission: "Are you comfortable with commission-only pay, with no base salary?",
    edit: "Edit",
    review: {
      fullName: "Full name",
      email: "Email",
      phone: "Phone",
      linkedin: "LinkedIn",
      portfolio: "Portfolio / GitHub",
      cv: "CV",
      workAuthorization: "Work authorisation",
      commission: "Commission-only pay",
    },
    declaration: {
      before: "I confirm these details are accurate and I have read the ",
      link: "candidate privacy notice",
      after: ".",
    },
    back: "Back",
    continue: "Continue",
    submit: "Submit application",
    sending: "Sending…",
    successTitle: "Application sent",
    success: (name: string, job: string) =>
      `Thank you, ${name}. Your application for ${job} is with us. We read every application and will reply by email to `,
    successAfter: ", usually within two weeks.",
    reference: "Reference:",
    networkError: "We couldn't reach the server. Check your connection and try again.",
    genericError: "Something went wrong. Please try again.",
    emailFallback: "You can also apply by email: send your CV and answers to",
    emailSubject: (job: string) => `Application: ${job}`,
  },
  errors: {
    fullName: "Enter your full name.",
    fullNameLong: "Keep your name under 120 characters.",
    email: "Enter a valid email address, like name@example.com.",
    phone: "Enter a phone number with country code, like +852 6123 4567.",
    linkedinMissing: "Enter your LinkedIn profile URL.",
    linkedin: "Enter a linkedin.com profile URL, starting with https://.",
    portfolio: "Enter a full URL starting with https://, or leave it empty.",
    workAuthorization: "Select your work authorisation status.",
    commissionOnly: "Tell us whether commission-only pay works for you.",
    cvMissing: "Upload your CV to continue.",
    cvType: "Upload a PDF or Word (.docx) file.",
    cvEmpty: "That file is empty.",
    cvSize: "The file is larger than 4 MB.",
    cvInvalid: "That file doesn't look like a valid PDF or DOCX.",
    declaration: "Please confirm you have read the privacy notice before submitting.",
    jobClosed: "This job listing is closed or no longer exists.",
    unreadable: "The submission could not be read.",
    attention: "Some answers need attention.",
    saveFailed: "We couldn't save your application. Please try again later.",
  },
  notice: {
    metaTitle: "Candidate privacy notice",
    title: "Candidate privacy notice",
    updated: "Last updated: 2 October 2026",
    intro:
      "This notice explains how Fostier Consulting handles the personal data you give us when you apply for a position. It is our Personal Information Collection Statement under Hong Kong's Personal Data (Privacy) Ordinance (Cap. 486) (the \"PDPO\") and, for applicants in the European Union or the European Economic Area, our information notice under Article 13 of the General Data Protection Regulation (EU) 2016/679 (the \"GDPR\").",
    sections: [
      {
        heading: "Who is responsible",
        body: `${site.legalName}, established in ${site.district}, Hong Kong (Business Registration No. ${site.brn}), is the data user (data controller) for your application. Contact: ${site.email} or ${site.phoneDisplay}.`,
      },
      {
        heading: "What we collect",
        items: [
          "Identity and contact details: name, email address, phone number.",
          "Professional links, if you choose to give them: LinkedIn profile, portfolio or GitHub page.",
          "Your CV and whatever it contains.",
          "Your answers to the screening questions (work authorisation in Hong Kong, whether commission-only pay suits you) and the position you applied for.",
          "Technical data processed by our hosting provider to deliver the pages and keep them secure, such as IP addresses in server logs.",
        ],
      },
      {
        heading: "Sensitive data",
        body: "Please do not include your Hong Kong Identity Card or passport number, or sensitive details such as health, religion or political views, in your CV or answers. We do not need them to assess an application. If we make you an offer, we will ask then for what is needed to verify your right to work.",
      },
      {
        heading: "Why we use it",
        body: "Only to run our recruitment: assessing your application against the position, contacting you about it, arranging interviews and, if we make you an offer, preparing it and checking your right to work in Hong Kong. We do not use your data for marketing.",
      },
      {
        heading: "Required and optional information",
        body: "Every field in the form is required unless marked optional. If you do not provide the required information, we cannot consider your application.",
      },
      {
        heading: "Legal bases (GDPR)",
        body: "Where the GDPR applies, we process your data to take steps at your request before entering into a contract (Article 6(1)(b)) and for our legitimate interest in recruiting suitable people (Article 6(1)(f)).",
      },
      {
        heading: "Automatic screening",
        body: "The position is paid on commission only. If you answer that commission-only pay does not suit you, your application is automatically marked as not retained, because the position cannot offer a base salary. A member of our team still sees every application and can reverse this, and you can ask us to reconsider by writing to us. Other screening answers that may not fit the position are only flagged for a person to review.",
      },
      {
        heading: "Who sees your data",
        body: "Your data is never sold or shared for commercial purposes. It is seen only by the Fostier Consulting staff involved in recruitment, and processed by:",
        items: [
          "Vercel Inc. (United States): hosting of these pages and server logs.",
          "Where we use it, Google LLC (United States): cloud storage of applications in Google Workspace.",
          "Public authorities, only where the law requires it.",
        ],
      },
      {
        heading: "Transfers outside Hong Kong",
        body: "Your data may be stored in or accessed from Hong Kong, France and, through our providers, the United States. Where the GDPR applies, transfers outside the European Economic Area rely on appropriate safeguards such as standard contractual clauses, or on the derogation for steps taken at your request before entering into a contract.",
      },
      {
        heading: "How long we keep it",
        body: "If your application is unsuccessful, we delete it and your CV 12 months after you apply, which lets us contact you about another suitable opening in that time. You can ask us to delete it sooner at any time. If you join us, the relevant data becomes part of your personnel file and its own retention rules apply.",
      },
      {
        heading: "Your rights",
        body: "Under the PDPO you may ask for access to, and correction of, the personal data we hold about you. Where the GDPR applies, you also have rights of erasure, restriction, portability and objection. You can withdraw your application at any time and we will delete your data. You may complain to the Privacy Commissioner for Personal Data in Hong Kong (pcpd.org.hk) or, in the EU, to your supervisory authority, such as the CNIL in France.",
        items: [
          `To make a request, email ${site.email} (or ${site.backupContact.email}) and say what you are asking for.`,
          "We may ask you to confirm your identity before acting on it.",
          "We reply within 40 days under the PDPO and within one month where the GDPR applies.",
        ],
      },
      {
        heading: "Security and cookies",
        body: "Applications are stored with access restricted to the people who handle recruitment and are sent over encrypted connections. The application pages set no cookies and use no analytics.",
      },
      {
        heading: "Changes and language",
        body: "We may update this notice; the date at the top shows the latest revision. It is published in English and French; if the versions differ, the English version prevails.",
      },
    ] as Section[],
  },
};

type Copy = typeof en;

const fr: Copy = {
  htmlLang: "fr",
  languageName: "Français",
  switchTo: "English version",
  careers: "Carrières",
  skip: "Aller au contenu",
  footer: {
    notice: "Confidentialité des candidats",
    legal: "Mentions légales",
    brn: `N° BR ${site.brn}`,
  },
  index: {
    metaTitle: "Carrières",
    title: "Rejoindre Fostier Consulting",
    intro:
      "Nous accompagnons les résidents français à Hong Kong dans leurs finances, ainsi que les entreprises qui travaillent entre la France et la Chine. Aucune expérience n'est requise, et les étudiants sont les bienvenus. Choisissez un poste ci-dessous.",
    none: "Aucun poste n'est ouvert pour le moment.",
    questions: "Des questions ? Écrivez à",
  },
  job: {
    back: "Tous les postes",
    termsHeading: "Rémunération et règles",
  },
  equalOpportunity:
    "Nous accueillons toutes les candidatures et évaluons chaque personne sur ses mérites. Conformément aux ordonnances anti-discrimination de Hong Kong, nous ne faisons aucune discrimination fondée sur le sexe, la grossesse, l'allaitement, la situation matrimoniale, le handicap, la situation familiale ou l'origine.",
  form: {
    ariaLabel: (job: string) => `Postuler : ${job}`,
    stepsLabel: "Étapes de la candidature",
    stepOf: (i: number, n: number) => `Étape ${i} sur ${n} : `,
    completed: " (terminée)",
    steps: ["Profil", "CV", "Questions", "Vérification"],
    headings: ["Votre profil", "Votre CV", "Quelques questions", "Vérifiez votre candidature"],
    required: " (obligatoire)",
    optional: " (facultatif)",
    pics: (href: string) => ({
      before:
        "Nous recueillons ces informations pour étudier votre candidature. Les champs non marqués « facultatif » sont obligatoires : sans eux, nous ne pouvons pas examiner votre candidature. Consultez notre ",
      link: "notice de confidentialité des candidats",
      after: " pour savoir qui voit vos données, combien de temps nous les conservons et comment y accéder ou les rectifier.",
      href,
    }),
    fullName: "Nom complet",
    email: "E-mail",
    phone: "Numéro de téléphone",
    linkedin: "URL de votre profil LinkedIn",
    portfolio: "URL de votre portfolio ou GitHub",
    dropHere: "Glissez votre CV ici, ou ",
    choose: "choisissez un fichier",
    cvHint: "PDF ou Word (.docx), 4 Mo maximum",
    cvSensitive:
      "Merci de ne pas indiquer votre numéro de carte d'identité de Hong Kong (HKID) ou de passeport, ni d'informations sensibles (santé, religion, opinions politiques). Nous n'en avons pas besoin à ce stade.",
    remove: (name: string) => `Retirer ${name}`,
    workAuthorization: "Autorisation de travail à Hong Kong",
    select: "Choisir…",
    commission: "Une rémunération uniquement à la commission, sans salaire fixe, vous convient-elle ?",
    edit: "Modifier",
    review: {
      fullName: "Nom complet",
      email: "E-mail",
      phone: "Téléphone",
      linkedin: "LinkedIn",
      portfolio: "Portfolio / GitHub",
      cv: "CV",
      workAuthorization: "Autorisation de travail",
      commission: "Rémunération à la commission",
    },
    declaration: {
      before: "Je confirme l'exactitude de ces informations et j'ai lu la ",
      link: "notice de confidentialité des candidats",
      after: ".",
    },
    back: "Retour",
    continue: "Continuer",
    submit: "Envoyer ma candidature",
    sending: "Envoi…",
    successTitle: "Candidature envoyée",
    success: (name: string, job: string) =>
      `Merci, ${name}. Nous avons bien reçu votre candidature au poste de ${job}. Nous lisons chaque candidature et vous répondrons par e-mail à `,
    successAfter: ", en général sous deux semaines.",
    reference: "Référence :",
    networkError: "Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.",
    genericError: "Une erreur s'est produite. Veuillez réessayer.",
    emailFallback: "Vous pouvez aussi postuler par e-mail : envoyez votre CV et vos réponses à",
    emailSubject: (job: string) => `Candidature : ${job}`,
  },
  errors: {
    fullName: "Indiquez votre nom complet.",
    fullNameLong: "Votre nom doit faire moins de 120 caractères.",
    email: "Indiquez une adresse e-mail valide, par exemple nom@exemple.com.",
    phone: "Indiquez un numéro avec l'indicatif du pays, par exemple +852 6123 4567.",
    linkedinMissing: "Indiquez l'URL de votre profil LinkedIn.",
    linkedin: "Indiquez une URL de profil linkedin.com commençant par https://.",
    portfolio: "Indiquez une URL complète commençant par https://, ou laissez ce champ vide.",
    workAuthorization: "Choisissez votre situation d'autorisation de travail.",
    commissionOnly: "Indiquez si une rémunération à la commission vous convient.",
    cvMissing: "Ajoutez votre CV pour continuer.",
    cvType: "Ajoutez un fichier PDF ou Word (.docx).",
    cvEmpty: "Ce fichier est vide.",
    cvSize: "Le fichier dépasse 4 Mo.",
    cvInvalid: "Ce fichier ne semble pas être un PDF ou un DOCX valide.",
    declaration: "Veuillez confirmer avoir lu la notice de confidentialité avant d'envoyer.",
    jobClosed: "Cette offre est fermée ou n'existe plus.",
    unreadable: "La candidature n'a pas pu être lue.",
    attention: "Certaines réponses sont à corriger.",
    saveFailed: "Nous n'avons pas pu enregistrer votre candidature. Veuillez réessayer plus tard.",
  },
  notice: {
    metaTitle: "Confidentialité des candidats",
    title: "Notice de confidentialité des candidats",
    updated: "Dernière mise à jour : 2 octobre 2026",
    intro:
      "Cette notice explique comment Fostier Consulting traite les données personnelles que vous nous transmettez lorsque vous postulez. Elle constitue notre déclaration de collecte (Personal Information Collection Statement) au titre de la Personal Data (Privacy) Ordinance de Hong Kong (Cap. 486) (la « PDPO ») et, pour les candidats situés dans l'Union européenne ou l'Espace économique européen, notre information au titre de l'article 13 du Règlement général sur la protection des données (UE) 2016/679 (le « RGPD »).",
    sections: [
      {
        heading: "Responsable du traitement",
        body: `${site.legalName}, établie à ${site.district}, Hong Kong (Business Registration n° ${site.brn}), est responsable du traitement des données de votre candidature. Contact : ${site.email} ou ${site.phoneDisplay}.`,
      },
      {
        heading: "Données collectées",
        items: [
          "Identité et coordonnées : nom, adresse e-mail, numéro de téléphone.",
          "Liens professionnels, si vous choisissez de les indiquer : profil LinkedIn, portfolio ou page GitHub.",
          "Votre CV et son contenu.",
          "Vos réponses aux questions de présélection (autorisation de travail à Hong Kong, rémunération à la commission) et le poste visé.",
          "Données techniques traitées par notre hébergeur pour afficher les pages et les sécuriser, comme les adresses IP dans les journaux du serveur.",
        ],
      },
      {
        heading: "Données sensibles",
        body: "Merci de ne pas indiquer votre numéro de carte d'identité de Hong Kong ou de passeport, ni d'informations sensibles comme votre santé, votre religion ou vos opinions politiques, dans votre CV ou vos réponses. Nous n'en avons pas besoin pour étudier une candidature. Si nous vous faisons une offre, nous vous demanderons alors ce qui est nécessaire pour vérifier votre droit de travailler.",
      },
      {
        heading: "Finalités",
        body: "Uniquement notre recrutement : étudier votre candidature au regard du poste, vous contacter à son sujet, organiser des entretiens et, si nous vous faisons une offre, la préparer et vérifier votre droit de travailler à Hong Kong. Vos données ne sont jamais utilisées à des fins de prospection.",
      },
      {
        heading: "Informations obligatoires et facultatives",
        body: "Tous les champs du formulaire sont obligatoires, sauf mention « facultatif ». Sans les informations obligatoires, nous ne pouvons pas examiner votre candidature.",
      },
      {
        heading: "Bases légales (RGPD)",
        body: "Lorsque le RGPD s'applique, nous traitons vos données pour prendre des mesures précontractuelles à votre demande (article 6(1)(b)) et pour notre intérêt légitime à recruter des personnes adaptées au poste (article 6(1)(f)).",
      },
      {
        heading: "Présélection automatique",
        body: "Le poste est rémunéré uniquement à la commission. Si vous indiquez qu'une rémunération à la commission ne vous convient pas, votre candidature est automatiquement marquée comme non retenue, puisque le poste ne peut pas offrir de salaire fixe. Un membre de notre équipe voit toutefois chaque candidature et peut revenir sur ce classement, et vous pouvez nous demander de la réexaminer en nous écrivant. Les autres réponses qui pourraient ne pas correspondre au poste sont seulement signalées pour examen par une personne.",
      },
      {
        heading: "Destinataires",
        body: "Vos données ne sont jamais vendues ni partagées à des fins commerciales. Elles ne sont consultées que par les personnes de Fostier Consulting chargées du recrutement, et traitées par :",
        items: [
          "Vercel Inc. (États-Unis) : hébergement de ces pages et journaux du serveur.",
          "Le cas échéant, Google LLC (États-Unis) : stockage des candidatures dans Google Workspace.",
          "Les autorités publiques, uniquement lorsque la loi l'exige.",
        ],
      },
      {
        heading: "Transferts hors de Hong Kong",
        body: "Vos données peuvent être stockées à Hong Kong, en France et, par l'intermédiaire de nos prestataires, aux États-Unis, ou consultées depuis ces pays. Lorsque le RGPD s'applique, les transferts hors de l'Espace économique européen reposent sur des garanties appropriées, comme les clauses contractuelles types, ou sur la dérogation prévue pour les mesures précontractuelles prises à votre demande.",
      },
      {
        heading: "Durée de conservation",
        body: "Si votre candidature n'est pas retenue, nous la supprimons, ainsi que votre CV, 12 mois après votre candidature, ce qui nous permet de vous recontacter si un autre poste adapté s'ouvre entre-temps. Vous pouvez demander une suppression plus rapide à tout moment. Si vous nous rejoignez, les données utiles sont versées à votre dossier du personnel, qui a ses propres règles de conservation.",
      },
      {
        heading: "Vos droits",
        body: "Au titre de la PDPO, vous pouvez demander l'accès aux données personnelles que nous détenons sur vous et leur rectification. Lorsque le RGPD s'applique, vous disposez aussi des droits d'effacement, de limitation, de portabilité et d'opposition. Vous pouvez retirer votre candidature à tout moment et nous supprimerons vos données. Vous pouvez introduire une réclamation auprès du Privacy Commissioner for Personal Data de Hong Kong (pcpd.org.hk) ou, dans l'UE, auprès de votre autorité de contrôle, comme la CNIL en France.",
        items: [
          `Pour toute demande, écrivez à ${site.email} (ou ${site.backupContact.email}) en précisant votre demande.`,
          "Nous pouvons vous demander de confirmer votre identité avant d'y donner suite.",
          "Nous répondons sous 40 jours au titre de la PDPO et sous un mois lorsque le RGPD s'applique.",
        ],
      },
      {
        heading: "Sécurité et cookies",
        body: "Les candidatures sont stockées avec un accès réservé aux personnes chargées du recrutement et transmises par des connexions chiffrées. Les pages de candidature ne déposent aucun cookie et n'utilisent aucun outil de mesure d'audience.",
      },
      {
        heading: "Modifications et langue",
        body: "Cette notice peut évoluer ; la date en haut de page indique la dernière révision. Elle est publiée en anglais et en français ; en cas de divergence, la version anglaise prévaut.",
      },
    ],
  },
};

export const careersCopy: Record<CareersLocale, Copy> = { en, fr };
export type CareersCopy = Copy;
