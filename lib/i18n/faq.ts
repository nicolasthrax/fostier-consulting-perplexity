import type { Locale } from "./config";
import type { Dictionary } from "./get-dictionary";
import { site } from "@/lib/site";

/**
 * FAQ copy. Every answer restates something the site already says elsewhere
 * (intro, founder profile, service lists, disclaimers, terms): no new claims.
 * Service FAQs derive two of their three answers from the dictionary so they
 * stay in sync with the service pages.
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
      a: "Fondé en 2015, Fostier Consulting est basé à Central, Hong Kong. Lucie Fostier accompagne des particuliers à Hong Kong, à Macao et en Chine continentale ; l'interprétariat et les projets avec des fournisseurs chinois couvrent Hong Kong et la Chine continentale.",
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
      q: "Les informations de ce site constituent-elles un conseil personnalisé ?",
      a: "Non. Le contenu du site est fourni à titre d'information générale. Toute recommandation suppose une analyse préalable de votre situation individuelle.",
    },
    {
      q: "Quel est le nom exact de la société et son numéro d'enregistrement ?",
      a: `${site.legalName}, parfois présentée comme « ${site.alternateName} », a été fondée en ${site.foundingYear} à Hong Kong par Lucie Fostier. Numéro d'enregistrement commercial (Business Registration) à Hong Kong : ${site.brn}.`,
    },
    {
      q: "Fostier Consulting a-t-il un lien avec Foster Consulting ?",
      a: "Non. Le nom s'écrit Fostier, F-O-S-T-I-E-R, comme celui de sa fondatrice, Lucie Fostier. Fostier Consulting, à Hong Kong, n'a aucun lien avec les sociétés au nom proche, comme « Foster Consulting ».",
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
      a: "Founded in 2015, Fostier Consulting is based in Central, Hong Kong. Lucie Fostier advises private clients in Hong Kong, Macau and mainland China; interpreting and Chinese-supplier projects cover Hong Kong and mainland China.",
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
      q: "Is the information on this site personalised advice?",
      a: "No. Site content is general information only. Any recommendation requires a prior review of your individual situation.",
    },
    {
      q: "What is the company's exact name and registration number?",
      a: `${site.legalName}, also known as "${site.alternateName}", was founded in Hong Kong in ${site.foundingYear} by Lucie Fostier. Hong Kong Business Registration No. ${site.brn}.`,
    },
    {
      q: "Is Fostier Consulting related to Foster Consulting?",
      a: "No. The name is spelled Fostier, F-O-S-T-I-E-R, after its founder, Lucie Fostier. Fostier Consulting in Hong Kong has no connection with similarly named firms such as \"Foster Consulting\".",
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
      a: "Fostier Consulting 于 2015 年成立，立足香港中环。Lucie Fostier 为香港、澳门及中国内地的个人客户提供咨询；口译及中国供应商相关服务覆盖香港及中国内地。",
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
      q: "本网站的信息是否构成个性化建议？",
      a: "不构成。网站内容仅供一般参考，任何建议均须事先了解您的个人情况。",
    },
    {
      q: "公司的准确名称和商业登记号码是什么？",
      a: `${site.legalName}（亦称「${site.alternateName}」）由 Lucie Fostier 于 ${site.foundingYear} 年在香港创立。香港商业登记号码：${site.brn}。`,
    },
    {
      q: "Fostier Consulting 与 Foster Consulting 有关系吗？",
      a: "没有。公司名称拼写为 Fostier（F-O-S-T-I-E-R），与创始人 Lucie Fostier 的姓氏相同。位于香港的 Fostier Consulting 与「Foster Consulting」等名称相近的公司没有任何关联。",
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

/** Per service, in `services.items` order: who it is for, and the question its disclaimer answers. */
const serviceFaqCopy: Record<Locale, { audience: FaqItem; limitsQ: string }[]> = {
  fr: [
    {
      audience: {
        q: "À qui s'adresse le conseil en investissement ?",
        a: "Aux résidents français à Hong Kong qui souhaitent une approche structurée de leur patrimoine, de leurs objectifs et de leur horizon d'investissement, adaptée à leur situation.",
      },
      limitsQ: "Les rendements sont-ils garantis ?",
    },
    {
      audience: {
        q: "À qui s'adresse l'accompagnement fiscal ?",
        a: "Aux résidents français à Hong Kong, notamment les professionnels mobiles, qui doivent préparer et déposer leur déclaration de revenus à Hong Kong.",
      },
      limitsQ: "Qui reste responsable de ma déclaration fiscale ?",
    },
    {
      audience: {
        q: "À qui s'adresse l'accompagnement épargne et bancaire ?",
        a: "Aux résidents français qui souhaitent ouvrir des solutions d'épargne et structurer leur épargne à Hong Kong, avec de l'aide pour les démarches et les documents.",
      },
      limitsQ: "L'ouverture de compte est-elle garantie ?",
    },
    {
      audience: {
        q: "À qui s'adresse l'accompagnement en assurance ?",
        a: "Aux résidents français à Hong Kong qui veulent protéger leur famille, leurs projets et leur patrimoine, en assurance santé comme en assurance vie.",
      },
      limitsQ: "Comment la rémunération et le statut sont-ils communiqués ?",
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
    },
    {
      audience: {
        q: "Who is the tax service for?",
        a: "French residents of Hong Kong, including mobile professionals, who need to prepare and file a Hong Kong personal tax return.",
      },
      limitsQ: "Who remains responsible for my tax return?",
    },
    {
      audience: {
        q: "Who is the savings and banking service for?",
        a: "French residents who want to open savings solutions and structure their savings in Hong Kong, with help on the steps and documents involved.",
      },
      limitsQ: "Is account opening guaranteed?",
    },
    {
      audience: {
        q: "Who is the insurance service for?",
        a: "French residents of Hong Kong who want to protect their family, plans and assets, with health and life insurance.",
      },
      limitsQ: "How are remuneration and regulatory status disclosed?",
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
    },
    {
      audience: {
        q: "税务服务适合哪些客户？",
        a: "适合需要准备并提交香港个人报税表的在港法国居民，包括跨国流动的职业人士。",
      },
      limitsQ: "谁对我的报税表负责？",
    },
    {
      audience: {
        q: "储蓄与银行服务适合哪些客户？",
        a: "适合希望在香港开立储蓄账户、规划储蓄，并需要流程与文件协助的法国居民。",
      },
      limitsQ: "开户是否一定获批？",
    },
    {
      audience: {
        q: "保险服务适合哪些客户？",
        a: "适合希望通过健康保险与人寿保险守护家庭、计划与资产的在港法国居民。",
      },
      limitsQ: "报酬与监管身份如何披露？",
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
  ];
}
