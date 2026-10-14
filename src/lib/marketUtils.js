export const CAT_LABELS = { tema: 'Tema', paket: 'Paket', nfckart: 'NFC Kart', eklenti: 'Eklenti' };

export const formatPrice = (n) => `${(n || 0).toLocaleString('tr-TR')} ₺`;

export const parseFeatures = (s) => (s || '').split(',').map((f) => f.trim()).filter(Boolean);

export const itemHref = (item) => `/market/${item.slug || item.id}`;

export const previewHref = (item) => `/preview/${item.slug || item.id}`;

/** YouTube izleme/short linklerini iframe'in kabul ettiği /embed/ formatına çevirir. */
export const normalizePreviewUrl = (url) => {
  const str = (url || '').trim();
  const yt = str.match(/^https?:\/\/(?:www\.|m\.)?youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)([\w-]{6,})/i)
    || str.match(/^https?:\/\/youtu\.be\/([\w-]{6,})/i);
  return yt ? `https://www.youtube.com/embed/${yt[1]}` : str;
};