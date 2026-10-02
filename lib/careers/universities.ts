/**
 * Recognises the universities the admin board highlights (HKU, CUHK, HKUST) in
 * the free-text university answer, whichever way a candidate writes them:
 * abbreviations, full English names, French names and Chinese names.
 */

export const targetUniversities = [
  { code: "HKU", name: "The University of Hong Kong" },
  { code: "CUHK", name: "The Chinese University of Hong Kong" },
  { code: "HKUST", name: "The Hong Kong University of Science and Technology" },
] as const;
export type TargetUniversity = (typeof targetUniversities)[number]["code"];

/** Universities whose names end in "University of Hong Kong" but aren't HKU. */
const NOT_HKU = "chinese|city|education|educational|open|seng|baptist|metropolitan|polytechnic|lingnan|yan";

const patterns: Record<TargetUniversity, RegExp[]> = {
  HKU: [
    /\bhku\b/,
    new RegExp(`(?<!\\b(?:${NOT_HKU}) )university of hong kong\\b`),
    // "Hong Kong University", as many write HKU, but not "Hong Kong University of Science…".
    /\bhong kong university\b(?! of (?:science|education|technology)\b)/,
    /\buniversite de hong kong\b/,
    /香港大[學学]|港大/,
  ],
  CUHK: [
    /\bcuhk(?:sz)?\b/,
    /\bchinese university of hong kong\b/,
    // "Chinese University" alone means CUHK in Hong Kong; "Chinese University of <elsewhere>" doesn't.
    /\bchinese university\b(?! of (?!hong kong\b))/,
    /\buniversite chinoise de hong kong\b/,
    /香港中文大[學学]|中大/,
  ],
  HKUST: [
    /\bhkust\b/,
    /\bust\b/,
    /\bhong kong university of science\b/,
    /\bhong kong science and technology university\b/,
    /\buniversite des sciences et (?:des )?technologies de hong kong\b/,
    // Not 中科大, the University of Science and Technology of China.
    /香港科技大[學学]|(?<!中)科大/,
  ],
};

/** Lowercase, accents and punctuation removed, common abbreviations spelled out. Chinese characters are kept. */
function normalize(text: string) {
  return (
    text
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9㐀-鿿]+/g, " ")
      // Dotted acronyms: "H.K.U.S.T." became "h k u s t".
      .replace(/\b[a-z](?: [a-z]\b)+/g, (letters) => letters.replace(/ /g, ""))
      .replace(/\bhongkong\b/g, "hong kong")
      .replace(/\bhk\b/g, "hong kong")
      .replace(/\buniv\b|\buni\b/g, "university")
      .replace(/\bsci\b/g, "science")
      .replace(/\btech\b/g, "technology")
      // HKU SPACE is HKU's continuing-education school, not the university itself.
      .replace(/\bhku space\b|\bhkuspace\b|香港大[學学]专业进修学院|香港大學專業進修學院/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/** The highlighted universities named in a free-text answer, in board order (usually none or one). */
export function matchTargetUniversities(text: string | undefined): TargetUniversity[] {
  if (!text?.trim()) return [];
  const s = normalize(text);
  return targetUniversities.map((u) => u.code).filter((code) => patterns[code].some((re) => re.test(s)));
}
