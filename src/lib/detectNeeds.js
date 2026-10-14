// Serbest metinden hizmet + sektör + teklif niyeti çıkarır — DijiBot adımları atlayabilsin
const SERVICE_KEYS = [
  ['E-Ticaret', ['e-ticaret', 'eticaret', 'online mağaza', 'online satış', 'e-commerce', 'online store']],
  ['SEO', ['seo', 'google sıralama', 'google\'da üst']],
  ['Dijital Pazarlama', ['reklam', 'pazarlama', 'sosyal medya', 'marketing', 'ads']],
  ['Kurumsal Kimlik', ['logo', 'kurumsal kimlik', 'branding']],
  ['Otomasyon & Yazılım', ['yazılım', 'otomasyon', 'software', 'automation']],
  ['Web Tasarım', ['web', 'internet sitesi', 'site']],
];

const SECTOR_KEYS = [
  ['Turizm & Konaklama', ['otel', 'hotel', 'pansiyon', 'konaklama', 'turizm', 'tatil', 'bungalov', 'tourism']],
  ['Gıda & Restoran', ['restoran', 'restaurant', 'kafe', 'cafe', 'lokanta', 'fırın', 'pastane', 'gıda', 'bakery']],
  ['Tarım', ['tarım', 'çiftlik', 'kooperatif', 'ayçiçek', 'zeytin', 'farm', 'agri']],
  ['Sanayi', ['sanayi', 'fabrika', 'imalat', 'üretim', 'factory', 'manufactur']],
  ['Yerel Ticaret', ['mağaza', 'dükkan', 'esnaf', 'shop', 'retail']],
];

const QUOTE_KEYS = ['paket', 'teklif', 'fiyat', 'ücret', 'bütçe', 'istiyorum', 'package', 'quote', 'price', 'cost'];

const find = (list, t) => (list.find(([, keys]) => keys.some((k) => t.includes(k))) || [])[0] || null;

export default function detectNeeds(text) {
  const t = `${text.toLocaleLowerCase('tr-TR')} ${text.toLowerCase()}`;
  return {
    service: find(SERVICE_KEYS, t),
    sector: find(SECTOR_KEYS, t),
    wantsQuote: QUOTE_KEYS.some((k) => t.includes(k)),
  };
}