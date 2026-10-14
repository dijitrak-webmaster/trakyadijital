import { services } from '@/lib/siteData';
import { serviceCatalog } from '@/lib/serviceCatalog';

/**
 * DijiBot'un özel paket motoru: sohbette seçilen ana hizmete, sektöre ve
 * kullanıcının yazdığı anahtar kelimelere göre bir paket önerisi kurar.
 */
const RECOMMENDED = {
  'web-tasarimi': { addons: ['google-isletme', 'seo'], weeks: [4, 5] },
  'e-ticaret': { addons: ['e-fatura-entegrasyon', 'eposta-crm', 'yorum-yonetimi'], weeks: [7, 9] },
  'landing-page': { addons: ['reklam-yonetimi', 'google-isletme'], weeks: [2, 3] },
  'web-uygulama': { addons: ['web-bakim', 'e-fatura-entegrasyon'], weeks: [8, 10] },
  'seo': { addons: ['google-isletme', 'yorum-yonetimi'], weeks: [4, 6] },
  'web-bakim': { addons: ['seo'], weeks: [1, 2] },
  'mobil-uygulama': { addons: ['mobil-bakim', 'eposta-crm'], weeks: [9, 12] },
  'pwa': { addons: ['whatsapp-chatbot', 'eposta-crm'], weeks: [5, 7] },
  'mobil-bakim': { addons: [], weeks: [1, 2] },
  'kurumsal-kimlik': { addons: ['sosyal-medya', 'google-isletme'], weeks: [4, 5] },
  'google-isletme': { addons: ['yerel-seo', 'yorum-yonetimi'], weeks: [2, 3] },
  'yerel-seo': { addons: ['google-isletme', 'sosyal-medya'], weeks: [4, 6] },
  'yorum-yonetimi': { addons: ['google-isletme'], weeks: [2, 3] },
  'sosyal-medya': { addons: ['reklam-yonetimi', 'yorum-yonetimi'], weeks: [4, 6] },
  'reklam-yonetimi': { addons: ['landing-page', 'google-isletme'], weeks: [2, 3] },
  'e-fatura-entegrasyon': { addons: ['web-bakim'], weeks: [3, 4] },
  'whatsapp-chatbot': { addons: ['eposta-crm', 'google-isletme'], weeks: [2, 3] },
  'eposta-crm': { addons: ['whatsapp-chatbot', 'yorum-yonetimi'], weeks: [2, 4] },
};

const SECTOR_NOTE = {
  'Tarım': 'Doğrudan satış ve yerel arama odaklı kurgu.',
  'Sanayi': 'Teknik katalog ve ihracat odaklı kurgu.',
  'Yerel Ticaret': '"Yakınımda" aramalarında hızlı görünme kurgusu.',
  'Turizm & Konaklama': 'Doğrudan rezervasyon ve çok dilli kurgu.',
  'Gıda & Restoran': 'Online sipariş ve Google dönüşüm kurgusu.',
};

const bySlug = (slug) => serviceCatalog.find((s) => s.slug === slug);

const baseByTitle = (title) => {
  const site = services.find((s) => s.title === title);
  return (site && bySlug(site.slug)) || serviceCatalog.find((s) => s.title === title) || bySlug('web-tasarimi');
};

export function buildPackage({ service, sector, message }) {
  const base = baseByTitle(service);
  const rec = RECOMMENDED[base.slug] || { addons: [], weeks: [3, 4] };
  const addonObjs = rec.addons.map(bySlug).filter(Boolean);

  // sohbette geçen anahtar kelimelere göre ek hizmet önerisi
  const all = [base, ...addonObjs];
  const has = (slug) => all.some((s) => s.slug === slug);
  const m = (message || '').toLocaleLowerCase('tr-TR');
  const wants = [];
  if ((m.includes('satış') || m.includes('mağaza') || m.includes('sipariş')) && !has('e-ticaret')) wants.push('e-ticaret');
  if (m.includes('whatsapp') && !has('whatsapp-chatbot')) wants.push('whatsapp-chatbot');
  if ((m.includes('reklam') || m.includes('ilan')) && !has('reklam-yonetimi')) wants.push('reklam-yonetimi');
  if ((m.includes('fatura') || m.includes('muhasebe')) && !has('e-fatura-entegrasyon')) wants.push('e-fatura-entegrasyon');
  const extra = wants.map(bySlug).filter(Boolean);

  const items = [...all, ...extra];
  const fmt = (n) => `₺${n.toLocaleString('tr-TR')}`;
  const sum = (arr, i) => arr.reduce((a, s) => a + s.price[i], 0);
  const oneTime = items.filter((s) => !s.monthly);
  const monthly = items.filter((s) => s.monthly);

  return {
    name: sector && sector !== 'Diğer' ? `${sector} Yükseliş Paketi` : 'Dijital Yükseliş Paketi',
    base: base.title,
    addons: [...addonObjs, ...extra].map((s) => ({ title: s.title, monthly: !!s.monthly })),
    // kalem kalem fiyat dökümü: PDF ve kart bu detayı kullanır
    items: items.map((s) => ({
      title: s.title,
      monthly: !!s.monthly,
      price: s.price,
      features: (s.features || []).slice(0, 3),
    })),
    priceOne: oneTime.length ? `${fmt(sum(oneTime, 0))} – ${fmt(sum(oneTime, 1))}` : null,
    priceMonthly: monthly.length ? `${fmt(sum(monthly, 0))} – ${fmt(sum(monthly, 1))} / ay` : null,
    duration: `${rec.weeks[0]}–${rec.weeks[1]} hafta`,
    note: SECTOR_NOTE[sector] || 'Hedeflerinize göre şekillenen kurgu.',
    includes: [
      'Ücretsiz keşif görüşmesi',
      '1 ay ücretsiz destek',
      'Müşteri portalında süreç takibi',
      'Aylık performans raporu',
    ],
  };
}

export function summaryText(pkg) {
  return `${pkg.name}: ${pkg.base} + ${pkg.addons.map((a) => a.title).join(', ')}. ` +
    `Tek seferlik ${pkg.priceOne || '—'}${pkg.priceMonthly ? `, aylık ${pkg.priceMonthly}` : ''}. ` +
    `Teslim: ${pkg.duration}. ${pkg.note}`;
}