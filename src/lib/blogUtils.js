// Blog yardımcıları — okuma süresi ve etiket ayrıştırma
export const readMinutes = (text = '') =>
  Math.max(1, Math.round(String(text || '').replace(/##/g, '').split(/\s+/).filter(Boolean).length / 200));

export const parseTags = (tags = '') =>
  String(tags || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);