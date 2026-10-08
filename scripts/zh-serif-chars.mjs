// CJK ideographs plus CJK and full-width punctuation: the glyphs the Chinese serif subset covers.
// Latin, digits and accents stay in Newsreader, ahead of it in the serif stack.
export const cjkChars = (text) => [...new Set(text.match(/[　-〿㐀-鿿＀-￯]/g) ?? [])].sort();
