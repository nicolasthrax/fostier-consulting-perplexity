import type { Locale } from "./config";
import type { Dictionary } from "./get-dictionary";
import { site } from "@/lib/site";

/**
 * FAQ copy. Home answers restate something the site already says elsewhere
 * (intro, founder profile, service lists, disclaimers, terms): no new claims.
 * Service FAQs derive two answers from the dictionary so they stay in sync with
 * the service pages; the core services add practical questions (`more`) that go
 * with the long-form copy in `service-details.ts`.
 */

export type FaqItem = { q: string; a: string };

export const faqHeading: Record<Locale, string> = {
  fr: "Questions fréquentes",
  en: "Frequently asked questions",
  zh: "常见问题",
};

export const homeFaq: Record<Locale, FaqItem[]> = {
  fr: [
    {
      q: "À qui s'adresse Fostier Consulting ?",
      a: "Fostier Consulting accompagne les résidents français en Asie, et avant tout à Hong Kong : cadres dirigeants, entrepreneurs, professionnels mobiles et familles françaises qui recherchent un accompagnement personnalisé et discret.",
    },
    {
      q: "Où est basé Fostier Consulting et quelles zones couvre-t-il ?",
      a: "Fondé en 2015, Fostier Consulting est basé à West Kowloon, Hong Kong. Lucie Fostier accompagne des particuliers à Hong Kong, à Macao et en Chine continentale ; l'interprétariat et les projets avec des fournisseurs chinois couvrent Hong Kong et la Chine continentale.",
    },
    {
      q: "Dans quelles langues se déroule l'accompagnement ?",
      a: "En français, anglais, mandarin et cantonais, pour le conseil comme pour l'interprétariat.",
    },
    {
      q: "Qui est la conseillère ?",
      a: "Lucie Fostier, fondatrice de Fostier Consulting. Elle a été Senior Wealth Management Manager chez AIA à Hong Kong et Macao, et a travaillé en gestion de patrimoine chez HSBC à Paris. Elle est diplômée en économie de l'Université Fudan (Shanghai) et formée à l'école de commerce ESG (Paris).",
    },
    {
      q: "Comment prendre contact ?",
      a: `Par WhatsApp ou par téléphone au ${site.phoneDisplay}, par e-mail à ${site.email}, ou sur WeChat. Un premier échange, en français, permet de comprendre votre situation.`,
    },
    {
      q: "Comment le statut d'intermédiaire en assurance est-il communiqué ?",
      a: "Lorsque des solutions d'assurance sont envisagées, la nature de la relation, la rémunération et le statut d'intermédiaire sont précisés en toute transparence avant toute souscription, comme l'indiquent les conditions d'utilisation du site.",
    },
    {
      q: "Fostier Consulting a-t-il été cité dans la presse ?",
      a: "Oui. En février 2026, l'UFE Hong Kong (Union des Français de l'Étranger) a consacré un article à la conférence de Lucie Fostier sur les traditions du Nouvel An chinois. Fostier Consulting est aussi partenaire officiel de l'UFE Hong Kong.",
    },
  ],
  en: [
    {
      q: "Who is Fostier Consulting for?",
      a: "Fostier Consulting supports French residents in Asia, primarily in Hong Kong: executives, entrepreneurs, mobile professionals and French families who value personal, discreet support.",
    },
    {
      q: "Where is Fostier Consulting based, and which areas does it cover?",
      a: "Founded in 2015, Fostier Consulting is based in West Kowloon, Hong Kong. Lucie Fostier advises private clients in Hong Kong, Macau and mainland China; interpreting and Chinese-supplier projects cover Hong Kong and mainland China.",
    },
    {
      q: "Which languages do you work in?",
      a: "French, English, Mandarin and Cantonese, for advice as well as interpreting.",
    },
    {
      q: "Who is the advisor?",
      a: "Lucie Fostier, founder of Fostier Consulting. She was a Senior Wealth Management Manager at AIA in Hong Kong and Macau, and worked in wealth management at HSBC in Paris. She holds an economics degree from Fudan University (Shanghai) and was educated at ESG business school (Paris).",
    },
    {
      q: "How do I get in touch?",
      a: `Message or call ${site.phoneDisplay} on WhatsApp or by phone, email ${site.email}, or add us on WeChat. A first conversation helps us understand your situation.`,
    },
    {
      q: "How is the insurance intermediary status disclosed?",
      a: "Where insurance solutions are considered, the nature of the relationship, remuneration and intermediary status are disclosed transparently before any subscription, as the site's terms of use state.",
    },
    {
      q: "Has Fostier Consulting been featured in the press?",
      a: "Yes. In February 2026, UFE Hong Kong (Union des Français de l'Étranger) published an article on Lucie Fostier's talk about Chinese New Year traditions. Fostier Consulting is also an official UFE Hong Kong partner.",
    },
  ],
  zh: [
    {
      q: "Fostier Consulting 为哪些客户提供服务？",
      a: "Fostier Consulting 服务于身处亚洲、尤其是香港的法国居民，包括企业高管、创业者、跨国流动职业人士，以及重视隐私与个性化服务的法国家庭。",
    },
    {
      q: "Fostier Consulting 设在哪里？服务覆盖哪些地区？",
      a: "Fostier Consulting 于 2015 年成立，立足香港西九龙。Lucie Fostier 为香港、澳门及中国内地的个人客户提供咨询；口译及中国供应商相关服务覆盖香港及中国内地。",
    },
    {
      q: "提供哪些语言的服务？",
      a: "咨询与口译服务均可使用法语、英语、普通话及粤语。",
    },
    {
      q: "顾问是谁？",
      a: "Lucie Fostier，Fostier Consulting 创始人。她曾在香港及澳门担任友邦保险（AIA）Senior Wealth Management Manager，并曾在巴黎汇丰银行从事财富管理工作。她毕业于复旦大学（上海）经济学专业，曾就读于法国 ESG 商学院（巴黎）。",
    },
    {
      q: "如何联系？",
      a: `可通过 WhatsApp 或电话（${site.phoneDisplay}）、电子邮件（${site.email}）或微信联系我们。先聊一聊，了解您的情况。`,
    },
    {
      q: "保险中介身份如何披露？",
      a: "如涉及保险方案，关系性质、报酬方式及中介身份将在投保前透明披露，详见本网站的使用条款。",
    },
    {
      q: "Fostier Consulting 是否获得过媒体报道？",
      a: "是的。2026 年 2 月，UFE Hong Kong（法国海外侨民协会香港分会）发表文章，介绍 Lucie Fostier 主讲的春节习俗讲座。Fostier Consulting 亦是 UFE 香港官方合作伙伴。",
    },
  ],
};

/**
 * Per service, in `services.items` order: who it is for, the question its disclaimer
 * answers, and optional practical questions. Keep `more` general and stable: no yearly
 * rates, allowances or caps.
 */
const serviceFaqCopy: Record<Locale, { audience: FaqItem; limitsQ: string; more?: FaqItem[] }[]> = {
  fr: [
    {
      audience: {
        q: "À qui s'adresse le conseil en investissement ?",
        a: "Aux résidents français à Hong Kong qui souhaitent une approche structurée de leur patrimoine, de leurs objectifs et de leur horizon d'investissement, adaptée à leur situation.",
      },
      limitsQ: "Les rendements sont-ils garantis ?",
      more: [
        {
          q: "Hong Kong taxe-t-il les plus-values et les dividendes ?",
          a: "En règle générale, Hong Kong ne prélève pas d'impôt sur les plus-values ni sur les dividendes perçus par les particuliers. Cela ne dit pas tout : selon votre résidence fiscale et la nature des placements, des règles étrangères, notamment françaises, peuvent s'appliquer. Ces points sont à faire vérifier par un conseiller fiscal habilité.",
        },
        {
          q: "Faut-il investir en euros ou en dollars de Hong Kong ?",
          a: "Tout dépend de la devise dans laquelle vous dépenserez cet argent. Le dollar de Hong Kong est arrimé au dollar américain : pour un projet qui se réalisera en France, comme un achat immobilier ou la retraite, les variations de l'euro face au dollar comptent autant que la performance du placement. La stratégie tient compte de cette exposition au change.",
        },
        {
          q: "Puis-je conserver mes placements en France ?",
          a: "Oui, dans la plupart des cas, et le bilan les intègre : assurance vie, comptes-titres, épargne retraite ou immobilier. L'objectif est une vision d'ensemble cohérente, pas de tout rapatrier à Hong Kong. Certains établissements français limitent toutefois les opérations de leurs clients non-résidents : nous regardons votre cas précis.",
        },
        {
          q: "Que deviennent mes placements si je quitte Hong Kong ?",
          a: "Un départ, vers la France ou ailleurs, modifie votre résidence fiscale et parfois l'accès à certains produits ou établissements. Mieux vaut l'anticiper : nous revoyons ensemble ce qui peut être conservé, ce qui doit être adapté, et les points à faire valider par un professionnel dans votre pays de destination.",
        },
        {
          q: "Fostier Consulting gère-t-il mon portefeuille à ma place ?",
          a: "Non. Vous restez décisionnaire : nous vous aidons à définir une stratégie, à comprendre les options et à suivre votre allocation, mais chaque décision d'investissement vous appartient. Les produits éventuellement souscrits le sont auprès d'établissements dûment autorisés.",
        },
      ],
    },
    {
      audience: {
        q: "À qui s'adresse l'accompagnement fiscal ?",
        a: "Aux résidents français à Hong Kong, notamment les professionnels mobiles, qui doivent préparer et déposer leur déclaration de revenus à Hong Kong.",
      },
      limitsQ: "Qui reste responsable de ma déclaration fiscale ?",
      more: [
        {
          q: "Quand reçoit-on sa déclaration d'impôts à Hong Kong ?",
          a: "L'Inland Revenue Department envoie la déclaration individuelle (BIR60) début mai, pour l'année fiscale close le 31 mars précédent. Elle doit en principe être déposée dans le mois qui suit sa date d'émission, avec un délai supplémentaire lorsqu'elle est déposée en ligne via eTAX.",
        },
        {
          q: "Je n'ai pas reçu de déclaration : dois-je faire quelque chose ?",
          a: "Oui. Si vous avez perçu des revenus imposables à Hong Kong sans avoir reçu de déclaration, vous devez en informer l'IRD par écrit dans les quatre mois qui suivent la fin de l'année fiscale, soit au plus tard le 31 juillet. Nous pouvons vous aider à préparer ce courrier.",
        },
        {
          q: "Quel taux d'imposition s'applique à mon salaire ?",
          a: "L'impôt sur les salaires (salaries tax) est calculé de deux façons : selon un barème progressif appliqué au revenu net après abattements personnels, ou selon un taux standard appliqué au revenu net avant abattements. L'IRD retient le montant le plus faible. Barèmes et abattements sont revus chaque année : nous appliquons ceux de l'année concernée.",
        },
        {
          q: "Comment fonctionne l'impôt provisionnel ?",
          a: "Hong Kong perçoit l'impôt en partie d'avance : l'avis d'imposition comprend, en plus de l'impôt dû pour l'année écoulée, un impôt provisionnel pour l'année en cours, estimé sur vos revenus de l'année écoulée et déduit ensuite de l'impôt définitif. Si vos revenus baissent nettement, par exemple en cas de départ ou de perte d'emploi, une demande de report (holdover) peut être déposée, sous conditions et dans des délais précis.",
        },
        {
          q: "Que faire avant de quitter Hong Kong ?",
          a: "Prévenez votre employeur suffisamment tôt : il doit déposer le formulaire IR56G au moins un mois avant votre départ et, en principe, retenir les sommes qui vous sont dues jusqu'à ce que l'IRD délivre une lettre de mainlevée (letter of release). Une déclaration est alors à remplir rapidement : nous vous aidons à la préparer pour ne pas retarder le versement de votre solde.",
        },
        {
          q: "Dois-je aussi déclarer mes revenus en France ?",
          a: "Cela dépend de votre situation : résidence fiscale, revenus de source française comme des loyers, conventions applicables. Fostier Consulting prépare votre déclaration hongkongaise ; pour vos obligations en France, nous vous recommandons un conseiller fiscal habilité, à qui nous pouvons vous aider à transmettre les éléments utiles.",
        },
      ],
    },
    {
      audience: {
        q: "À qui s'adresse l'accompagnement épargne et bancaire ?",
        a: "Aux résidents français qui souhaitent ouvrir des solutions d'épargne et structurer leur épargne à Hong Kong, avec de l'aide pour les démarches et les documents.",
      },
      limitsQ: "L'ouverture de compte est-elle garantie ?",
      more: [
        {
          q: "Peut-on ouvrir un compte à Hong Kong avant d'arriver ?",
          a: "C'est parfois possible, mais les conditions varient beaucoup d'un établissement à l'autre, et la plupart demandent au minimum un visa et une adresse à Hong Kong. L'ouverture est en général plus simple une fois sur place, avec votre carte d'identité hongkongaise.",
        },
        {
          q: "Mon épargne est-elle protégée en cas de faillite de la banque ?",
          a: "Les dépôts éligibles auprès des banques membres sont couverts par le Deposit Protection Scheme de Hong Kong, dans la limite d'un plafond par déposant et par banque. Tous les produits ne sont pas concernés : les placements comme les fonds, actions ou obligations, et certains dépôts comme les dépôts structurés, en sont exclus. Nous vous indiquons la nature de chaque solution envisagée.",
        },
        {
          q: "Dois-je déclarer mon compte hongkongais en France ?",
          a: "Si vous êtes toujours résident fiscal français, les comptes ouverts à l'étranger doivent en principe être déclarés chaque année avec votre déclaration de revenus (formulaire 3916). Si vous n'êtes plus résident fiscal en France, cette obligation ne s'applique en principe pas. En cas de doute sur votre résidence fiscale, un conseiller fiscal habilité pourra trancher.",
        },
        {
          q: "Faut-il garder son compte bancaire en France ?",
          a: "C'est souvent utile : prélèvements en euros, crédit immobilier, revenus locatifs, retour éventuel. Certaines banques françaises appliquent des conditions particulières aux clients non-résidents ; mieux vaut les prévenir de votre changement d'adresse et vérifier les conditions de votre compte.",
        },
        {
          q: "Existe-t-il une épargne retraite avec avantage fiscal à Hong Kong ?",
          a: "Oui. En plus des cotisations obligatoires au MPF, les cotisations volontaires déductibles (TVC), versées sur un compte MPF dédié, ouvrent droit à une déduction fiscale plafonnée, commune avec les primes de rentes différées éligibles (QDAP). Les sommes versées en TVC restent en principe bloquées jusqu'à l'âge de la retraite prévu par le régime.",
        },
      ],
    },
    {
      audience: {
        q: "À qui s'adresse l'accompagnement en assurance ?",
        a: "Aux résidents français à Hong Kong qui veulent protéger leur famille, leurs projets et leur patrimoine, en assurance santé comme en assurance vie.",
      },
      limitsQ: "Comment la rémunération et le statut sont-ils communiqués ?",
      more: [
        {
          q: "L'assurance santé de mon employeur suffit-elle ?",
          a: "Pas toujours. Les contrats de groupe varient beaucoup : plafonds de remboursement, prise en charge des consultations, de la maternité, des soins à l'étranger. Surtout, ils prennent généralement fin avec votre contrat de travail. Une couverture individuelle, en complément ou en relais, évite de se retrouver sans assurance entre deux postes.",
        },
        {
          q: "Qu'est-ce que le Voluntary Health Insurance Scheme (VHIS) ?",
          a: "Un dispositif mis en place par le gouvernement de Hong Kong : les contrats d'assurance hospitalisation certifiés VHIS respectent des standards minimaux, et leurs primes sont déductibles de l'impôt sur les salaires, dans la limite d'un plafond par personne assurée. Un contrat VHIS n'est pas toujours la meilleure réponse : tout dépend des garanties recherchées, par exemple une couverture internationale.",
        },
        {
          q: "Puis-je me faire soigner dans le système public à Hong Kong ?",
          a: "Les titulaires d'une carte d'identité hongkongaise ont en principe accès aux hôpitaux publics à des tarifs subventionnés. Les délais d'attente peuvent toutefois être longs pour les soins non urgents : c'est pourquoi de nombreux résidents complètent avec une assurance privée.",
        },
        {
          q: "Faut-il adhérer à la Caisse des Français de l'Étranger (CFE) ?",
          a: "L'adhésion à la CFE est facultative. Elle permet de conserver une couverture proche de celle de la Sécurité sociale, utile notamment pour des soins en France, et se combine souvent avec une assurance locale ou internationale. Son intérêt dépend de votre situation : nous l'examinons avec vous lors de la revue de vos couvertures.",
        },
        {
          q: "Mon assurance vie hongkongaise reste-t-elle valable si je rentre en France ?",
          a: "En général, un contrat en cours continue de produire ses effets après un départ, mais chaque assureur a ses propres conditions, par exemple pour le paiement des primes ou le changement d'adresse, et le traitement fiscal en France peut différer. C'est un point à examiner avant de souscrire, puis à nouveau avant de partir.",
        },
      ],
    },
    {
      audience: {
        q: "Dans quelles langues et où intervient l'interprète ?",
        a: "En français, mandarin et cantonais, lors de rendez-vous bancaires, administratifs, juridiques ou professionnels à Hong Kong et en Chine continentale.",
      },
      limitsQ: "S'agit-il d'une traduction certifiée ?",
    },
    {
      audience: {
        q: "À qui s'adresse la recherche de fournisseurs chinois ?",
        a: "Aux entreprises qui veulent identifier, vérifier et contacter des fournisseurs chinois fiables, avec un interlocuteur français qui suit la relation sur place.",
      },
      limitsQ: "Fostier Consulting garantit-il les fournisseurs ?",
    },
    {
      audience: {
        q: "À qui s'adresse ce service ?",
        a: "Aux entrepreneurs français qui cherchent des partenaires chinois et importent des marchandises chinoises vers la France, de la mise en relation jusqu'à la livraison.",
      },
      limitsQ: "Qui gère les douanes et la conformité des produits ?",
    },
  ],
  en: [
    {
      audience: {
        q: "Who is the investment service for?",
        a: "French residents of Hong Kong who want a structured approach to their assets, objectives and investment horizon, adapted to their situation.",
      },
      limitsQ: "Are returns guaranteed?",
      more: [
        {
          q: "Does Hong Kong tax capital gains and dividends?",
          a: "As a general rule, Hong Kong does not tax capital gains or dividends received by individuals. That is not the whole story: depending on your tax residence and the type of investment, foreign rules, French rules in particular, may apply. These points should be checked with a qualified tax adviser.",
        },
        {
          q: "Should I invest in euros or Hong Kong dollars?",
          a: "It depends on the currency you will spend the money in. The Hong Kong dollar is pegged to the US dollar: for a plan that will happen in France, such as buying property or retiring, movements in the euro against the dollar matter as much as investment performance. The strategy takes this currency exposure into account.",
        },
        {
          q: "Can I keep my investments in France?",
          a: "Yes, in most cases, and the review includes them: life insurance, investment accounts, retirement savings or property. The aim is one coherent overall picture, not moving everything to Hong Kong. Some French institutions do restrict what non-resident clients can do, so we look at your specific case.",
        },
        {
          q: "What happens to my investments if I leave Hong Kong?",
          a: "Moving, to France or elsewhere, changes your tax residence and sometimes your access to certain products or institutions. It is best planned ahead: together we review what can be kept, what needs adjusting, and which points to have confirmed by a professional in your destination country.",
        },
        {
          q: "Does Fostier Consulting manage my portfolio for me?",
          a: "No. You stay in charge: we help you define a strategy, understand the options and follow your allocation, but every investment decision is yours. Any products subscribed are held with duly authorised institutions.",
        },
      ],
    },
    {
      audience: {
        q: "Who is the tax service for?",
        a: "French residents of Hong Kong, including mobile professionals, who need to prepare and file a Hong Kong personal tax return.",
      },
      limitsQ: "Who remains responsible for my tax return?",
      more: [
        {
          q: "When do I receive my Hong Kong tax return?",
          a: "The Inland Revenue Department issues the individual tax return (BIR60) in early May, for the year of assessment that ended on the previous 31 March. It must normally be filed within one month of its date of issue, with extra time when you file online through eTAX.",
        },
        {
          q: "I have not received a tax return. Do I need to do anything?",
          a: "Yes. If you had taxable income in Hong Kong but did not receive a return, you must inform the IRD in writing within four months after the end of the year of assessment, that is by 31 July. We can help you prepare that letter.",
        },
        {
          q: "What tax rate applies to my salary?",
          a: "Salaries tax is calculated two ways: progressive rates applied to net income after personal allowances, or the standard rate applied to net income before allowances. The IRD charges whichever is lower. Rates and allowances are reviewed every year, and we apply those for the year concerned.",
        },
        {
          q: "How does provisional tax work?",
          a: "Hong Kong collects part of the tax in advance: besides the tax due for the year just ended, the notice of assessment includes provisional tax for the current year, estimated on the past year's income and later set against the final tax. If your income drops sharply, for example because you are leaving or lose your job, you can apply to hold over provisional tax, subject to conditions and strict deadlines.",
        },
        {
          q: "What should I do before leaving Hong Kong?",
          a: "Tell your employer early: they must file form IR56G at least one month before you leave and, as a rule, withhold money due to you until the IRD issues a letter of release. You will then need to complete a tax return promptly, and we help you prepare it so the payment of your final salary is not held up.",
        },
        {
          q: "Do I also need to declare my income in France?",
          a: "It depends on your situation: tax residence, French-source income such as rent, and applicable treaties. Fostier Consulting prepares your Hong Kong return; for your French obligations we recommend a qualified tax adviser, and we can help you pass on the relevant information.",
        },
      ],
    },
    {
      audience: {
        q: "Who is the savings and banking service for?",
        a: "French residents who want to open savings solutions and structure their savings in Hong Kong, with help on the steps and documents involved.",
      },
      limitsQ: "Is account opening guaranteed?",
      more: [
        {
          q: "Can I open a Hong Kong account before I arrive?",
          a: "Sometimes, but conditions vary widely between institutions, and most require at least a visa and a Hong Kong address. Opening is usually simpler once you are here and have your Hong Kong identity card.",
        },
        {
          q: "Are my savings protected if the bank fails?",
          a: "Eligible deposits with member banks are covered by Hong Kong's Deposit Protection Scheme, up to a limit per depositor per bank. Not every product qualifies: investments such as funds, shares or bonds, and some deposits such as structured deposits, are excluded. We tell you the nature of each solution considered.",
        },
        {
          q: "Do I have to declare my Hong Kong account in France?",
          a: "If you are still a French tax resident, accounts held abroad must as a rule be declared every year with your income tax return (form 3916). If you are no longer tax resident in France, this obligation generally does not apply. If your tax residence is unclear, a qualified tax adviser can settle the question.",
        },
        {
          q: "Should I keep my French bank account?",
          a: "It is often useful: euro direct debits, a mortgage, rental income, a possible return. Some French banks apply specific terms to non-resident clients, so let them know your new address and check the terms of your account.",
        },
        {
          q: "Is there tax-advantaged retirement saving in Hong Kong?",
          a: "Yes. On top of mandatory MPF contributions, tax-deductible voluntary contributions (TVC), paid into a dedicated MPF account, qualify for a capped tax deduction shared with qualifying deferred annuity premiums (QDAP). TVC money is generally locked in until the retirement age set by the scheme.",
        },
      ],
    },
    {
      audience: {
        q: "Who is the insurance service for?",
        a: "French residents of Hong Kong who want to protect their family, plans and assets, with health and life insurance.",
      },
      limitsQ: "How are remuneration and regulatory status disclosed?",
      more: [
        {
          q: "Is my employer's health insurance enough?",
          a: "Not always. Group plans vary a great deal: reimbursement limits, cover for outpatient visits, maternity, treatment abroad. Above all, they usually end with your employment contract. Individual cover, as a top-up or a bridge, avoids being uninsured between jobs.",
        },
        {
          q: "What is the Voluntary Health Insurance Scheme (VHIS)?",
          a: "A scheme set up by the Hong Kong government: VHIS-certified hospital insurance plans meet minimum standards, and their premiums are deductible from salaries tax up to a limit per insured person. A VHIS plan is not always the best answer: it depends on the cover you need, international cover for instance.",
        },
        {
          q: "Can I use the public healthcare system in Hong Kong?",
          a: "Hong Kong identity card holders generally have access to public hospitals at subsidised rates. Waiting times can be long for non-urgent care, however, which is why many residents add private insurance.",
        },
        {
          q: "Should I join the Caisse des Français de l'Étranger (CFE)?",
          a: "CFE membership is voluntary. It keeps cover close to French social security, which is useful for treatment in France in particular, and is often combined with local or international insurance. Whether it is worthwhile depends on your situation, and we look at it with you when reviewing your cover.",
        },
        {
          q: "Does my Hong Kong life insurance stay valid if I move back to France?",
          a: "Generally, a policy in force keeps running after a move, but each insurer has its own terms, for instance for premium payments or a change of address, and French tax treatment may differ. It is worth checking before you subscribe, and again before you leave.",
        },
      ],
    },
    {
      audience: {
        q: "Which languages and where does the interpreter work?",
        a: "French, Mandarin and Cantonese, at banking, administrative, legal or business meetings in Hong Kong and mainland China.",
      },
      limitsQ: "Is this certified translation?",
    },
    {
      audience: {
        q: "Who is Chinese supplier sourcing for?",
        a: "Businesses that want to identify, vet and contact reliable Chinese suppliers, with a French contact following up the relationship on the ground.",
      },
      limitsQ: "Does Fostier Consulting guarantee suppliers?",
    },
    {
      audience: {
        q: "Who is this service for?",
        a: "French entrepreneurs looking for Chinese partners and importing Chinese goods into France, from first introduction through to delivery.",
      },
      limitsQ: "Who handles customs and product compliance?",
    },
  ],
  zh: [
    {
      audience: {
        q: "投资咨询服务适合哪些客户？",
        a: "适合希望以结构化方法规划资产、目标与投资期限的在港法国居民，方案会根据您的具体情况调整。",
      },
      limitsQ: "收益是否有保证？",
      more: [
        {
          q: "香港是否对资本增值和股息征税？",
          a: "一般而言，香港不对个人的资本增值或所收取的股息征税。但这并非全部：视乎您的税务居民身份及投资类别，外国（尤其是法国）的规则可能适用。这些问题应向合资格的税务顾问核实。",
        },
        {
          q: "应该以欧元还是港元投资？",
          a: "取决于这笔钱将来以哪种货币使用。港元与美元挂钩：如计划在法国实现，例如置业或退休，欧元兑美元的汇率变动与投资表现同样重要。策略会考虑这项货币敞口。",
        },
        {
          q: "可以保留在法国的投资吗？",
          a: "大多数情况下可以，而且资产盘点会将其纳入：人寿保险、证券账户、退休储蓄或物业。目标是建立一致的整体视野，而不是把一切都搬到香港。不过，部分法国机构会限制非居民客户的操作，我们会按您的具体情况研究。",
        },
        {
          q: "如果离开香港，我的投资会怎样？",
          a: "迁往法国或其他地方会改变您的税务居民身份，有时也会影响您使用某些产品或机构。宜及早规划：我们会与您一起检视哪些可以保留、哪些需要调整，以及哪些问题需由目的地国家的专业人士确认。",
        },
        {
          q: "Fostier Consulting 会代我管理投资组合吗？",
          a: "不会。决定权始终在您：我们协助您制定策略、了解各种选择并跟进资产配置，但每项投资决定都由您作出。如有认购产品，均通过获正式授权的机构进行。",
        },
      ],
    },
    {
      audience: {
        q: "税务服务适合哪些客户？",
        a: "适合需要准备并提交香港个人报税表的在港法国居民，包括跨国流动的职业人士。",
      },
      limitsQ: "谁对我的报税表负责？",
      more: [
        {
          q: "香港的报税表何时发出？",
          a: "税务局一般于五月初发出个别人士报税表（BIR60），申报截至上一个 3 月 31 日的课税年度。报税表一般须在发出日期起一个月内提交；通过「电子税务」（eTAX）提交可获额外时间。",
        },
        {
          q: "我没有收到报税表，需要做什么吗？",
          a: "需要。如您在香港有应课税收入但没有收到报税表，须在课税年度结束后四个月内（即 7 月 31 日或之前）以书面通知税务局。我们可以协助您准备这封信。",
        },
        {
          q: "我的薪俸适用什么税率？",
          a: "薪俸税有两种计算方法：以累进税率计算扣除个人免税额后的应课税入息实额，或以标准税率计算未扣除免税额的入息净额。税务局会按较低者征税。税率及免税额每年检讨，我们会采用相关年度的数字。",
        },
        {
          q: "暂缴税如何运作？",
          a: "香港会预先征收部分税款：评税通知书除上一年度的应缴税款外，还包括本年度的暂缴税，按上一年度收入估算，其后用以抵扣最终税款。如收入大幅减少，例如离港或失业，可在符合条件并于指定期限内申请缓缴暂缴税。",
        },
        {
          q: "离开香港前要做什么？",
          a: "请尽早通知雇主：雇主须在您离港前至少一个月提交 IR56G 表格，并一般须暂扣应付予您的款项，直至税务局发出解除通知（letter of release）。届时您需尽快填交报税表，我们会协助您准备，以免延误最后薪酬的发放。",
        },
        {
          q: "我是否也要在法国申报收入？",
          a: "视乎您的情况：税务居民身份、来自法国的收入（例如租金）及适用的税务协定。Fostier Consulting 负责准备您的香港报税表；至于在法国的申报义务，建议您咨询合资格的税务顾问，我们可以协助您向其提供相关资料。",
        },
      ],
    },
    {
      audience: {
        q: "储蓄与银行服务适合哪些客户？",
        a: "适合希望在香港开立储蓄账户、规划储蓄，并需要流程与文件协助的法国居民。",
      },
      limitsQ: "开户是否一定获批？",
      more: [
        {
          q: "可以在抵港前开立香港账户吗？",
          a: "有时可以，但各机构的条件差异很大，大多数至少要求签证及香港住址。一般而言，抵港并取得香港身份证后开户会较为简单。",
        },
        {
          q: "如果银行倒闭，我的储蓄有保障吗？",
          a: "在成员银行的合资格存款受香港存款保障计划保障，每名存款人在每间银行设有保障上限。并非所有产品都受保障：基金、股票、债券等投资，以及结构性存款等部分存款均不在保障范围内。我们会说明每项方案的性质。",
        },
        {
          q: "我需要在法国申报香港账户吗？",
          a: "如果您仍是法国税务居民，一般须每年随个人所得税申报表申报在海外开立的账户（3916 表格）。如您已不再是法国税务居民，一般不适用这项义务。如对税务居民身份有疑问，可由合资格的税务顾问判断。",
        },
        {
          q: "应该保留法国的银行账户吗？",
          a: "通常有用：欧元自动扣账、房屋贷款、租金收入，以及日后可能回流。部分法国银行对非居民客户设有特别条款，宜通知银行您的新地址，并核实账户条款。",
        },
        {
          q: "香港有享税务优惠的退休储蓄吗？",
          a: "有。除强积金强制性供款外，存入专设强积金账户的可扣税自愿性供款（TVC）可享有扣税，与合资格延期年金保费（QDAP）共用扣除上限。TVC 款项一般须保留至计划规定的退休年龄方可提取。",
        },
      ],
    },
    {
      audience: {
        q: "保险服务适合哪些客户？",
        a: "适合希望通过健康保险与人寿保险守护家庭、计划与资产的在港法国居民。",
      },
      limitsQ: "报酬与监管身份如何披露？",
      more: [
        {
          q: "雇主提供的医疗保险足够吗？",
          a: "不一定。团体保险差异很大：赔偿上限、门诊、产科及海外医疗的保障各有不同。更重要的是，团体保险通常随雇佣合约结束而终止。个人保障无论作为补充或衔接，都可避免在两份工作之间失去保障。",
        },
        {
          q: "什么是自愿医保计划（VHIS）？",
          a: "由香港政府推出的计划：经认可的自愿医保住院保险产品须符合最低标准，其保费可在薪俸税中扣除，每名受保人设有扣除上限。自愿医保产品不一定是最佳选择，须视乎您所需的保障，例如国际保障。",
        },
        {
          q: "我可以使用香港的公营医疗服务吗？",
          a: "持有香港身份证的人士一般可按资助收费使用公立医院服务。不过，非紧急治疗的轮候时间可能较长，因此许多居民会另外购买私人保险。",
        },
        {
          q: "是否应参加法国海外侨民社保（CFE）？",
          a: "CFE 属自愿参加。它可让您保留接近法国社会保障的保障，尤其适用于在法国就医，并常与本地或国际保险配合使用。是否值得参加取决于您的情况，我们会在检视您的保障时一并研究。",
        },
        {
          q: "回流法国后，香港的人寿保险是否仍然有效？",
          a: "一般而言，生效中的保单在您迁离后仍会继续有效，但各保险公司的条款不同，例如保费缴付或更改地址的安排，而在法国的税务处理也可能有别。这一点宜在投保前及离港前分别检视。",
        },
      ],
    },
    {
      audience: {
        q: "口译服务提供哪些语言？在哪里提供？",
        a: "提供法语、普通话及粤语口译，陪同香港及中国内地的银行、行政、法律或商务会面。",
      },
      limitsQ: "这是认证翻译吗？",
    },
    {
      audience: {
        q: "中国供应商寻源服务适合哪些客户？",
        a: "适合希望寻找、核实并联系可靠中国供应商，并由一位法国对接人在当地跟进合作关系的企业。",
      },
      limitsQ: "Fostier Consulting 是否为供应商提供担保？",
    },
    {
      audience: {
        q: "这项服务适合哪些客户？",
        a: "适合正在寻找中国合作伙伴、并将中国商品进口至法国的法国创业者，从牵线对接到交付全程跟进。",
      },
      limitsQ: "海关与产品合规由谁负责？",
    },
  ],
};

const includesQuestion: Record<Locale, (title: string) => string> = {
  fr: (t) => `Que comprend le service « ${t} » ?`,
  en: (t) => `What does "${t}" include?`,
  zh: (t) => `「${t}」包括哪些内容？`,
};

const listJoin: Record<Locale, (items: string[]) => string> = {
  fr: (items) => `${items.join(" ; ")}.`,
  en: (items) => `${items.join("; ")}.`,
  zh: (items) => `${items.join("；")}。`,
};

export function serviceFaq(locale: Locale, dict: Dictionary, index: number): FaqItem[] {
  const service = dict.services.items[index];
  const copy = serviceFaqCopy[locale][index];
  return [
    copy.audience,
    { q: includesQuestion[locale](service.title), a: listJoin[locale](service.includes) },
    { q: copy.limitsQ, a: service.disclaimer },
    ...(copy.more ?? []),
  ];
}
