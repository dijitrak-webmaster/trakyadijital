import { base44 } from '@/api/base44Client';

// Marketteki yayında ürünler, bundle'lar ve kampanyalar DijiBot'un bilgisine bağlanır.
// 5 dakikalık önbellek — sohbet her açılışta veritabanını yormaz.
let cache = null;
let cacheTime = 0;
const TTL = 5 * 60 * 1000;

const norm = (s) => (s || '')
  .toLocaleLowerCase('tr-TR')
  .replace(/[.,!?;:()"'’]/g, ' ')
  .replace(/[ıİ]/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
  .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/â/g, 'a');

const CAT_LABEL = { tema: 'Tema', paket: 'Paket', nfckart: 'NFC Kart', eklenti: 'Eklenti' };
const BILLING = { one_time: 'tek seferlik', monthly: 'aylık' };

export async function loadMarketKB() {
  if (cache && Date.now() - cacheTime < TTL) return cache;
  try {
    const [items, bundles, campaigns] = await Promise.all([
      base44.entities.MarketItem.filter({ status: 'published' }, { limit: 50 }),
      base44.entities.Bundle.filter({ status: 'published' }, { limit: 20 }),
      base44.entities.Campaign.filter({ status: 'published' }, { limit: 10 }),
    ]);
    cache = { items: items.items || [], bundles: bundles.items || [], campaigns: campaigns.items || [] };
    cacheTime = Date.now();
    return cache;
  } catch {
    return { items: [], bundles: [], campaigns: [] };
  }
}

// AI'ya verilecek kompakt market özeti (fiyat/bilgi uydurmayı engellemek için)
export function marketBrief(kb) {
  if (!kb?.items?.length) return '';
  return kb.items.slice(0, 8)
    .map((i) => `${i.title} (${CAT_LABEL[i.category] || i.category}) — ${BILLING[i.billing] || 'tek seferlik'} ${Number(i.price || 0).toLocaleString('tr-TR')} TL`)
    .join('\n');
}

// Market niyeti: tema / NFC kart / hazır paket / kampanya / indirim aramaları
const INTENT_KEYS = ['market', 'tema', 'temalar', 'nfc', 'hazır ürün', 'hazir urun', 'vitrin', 'kampanya', 'indirim kodu', 'kupon', 'eklenti', 'marketi gez', 'marketten'];

/** Ürün eşleşmesi ya da market niyeti varsa hazır yanıt döndürür, yoksa null. */
export function marketAnswer(text, kb) {
  if (!kb || !kb.items?.length) return null;
  const t = norm(text);
  const intent = INTENT_KEYS.some((k) => t.includes(norm(k)));
  const scored = kb.items
    .map((it) => {
      const keys = [it.title, ...(it.features || '').split(',').map((f) => f.trim()).filter(Boolean).slice(0, 2)];
      const score = keys.reduce((acc, k) => acc + (t.includes(norm(k)) ? norm(k).length + 4 : 0), 0);
      return { it, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  const bundles = (kb.bundles || []).filter((b) => b.title && t.includes(norm(b.title)));
  if (!intent && !scored.length && !bundles.length) return null;

  const fmtP = (n) => `${Number(n || 0).toLocaleString('tr-TR')} ₺`;
  const lines = [];
  const options = [];
  const top = scored.slice(0, 3).map((s) => s.it);
  if (top.length) {
    lines.push('Markette tam aradığın ürünler var 👇');
    top.forEach((it) => {
      lines.push(`• ${it.title} — ${fmtP(it.price)}${it.billing === 'monthly' ? ' /ay' : ''}${it.badge ? ` (${it.badge})` : ''}`);
      options.push(it.title);
    });
  } else {
    // niyet var, ürün adı yok: kategoriye göre özet
    const cats = {};
    kb.items.forEach((it) => {
      const c = CAT_LABEL[it.category] || it.category;
      (cats[c] = cats[c] || []).push(it);
    });
    lines.push('Markette yayında olan ürünler:');
    Object.entries(cats).slice(0, 4).forEach(([c, list]) => {
      const cheapest = list.reduce((m, x) => Math.min(m, Number(x.price) || 0), Infinity);
      lines.push(`• ${c}: ${list.length} ürün, ${fmtP(cheapest === Infinity ? 0 : cheapest)}'den başlıyor`);
    });
  }
  bundles.slice(0, 2).forEach((b) => lines.push(`🎁 ${b.title} (bundle) — ${fmtP(b.price)}${b.description ? `: ${b.description}` : ''}`));
  const camp = (kb.campaigns || []).find((c) => c.code);
  if (camp) lines.push(`🏷️ Aktif kampanya: ${camp.title} — ${camp.code} koduyla ${camp.discount_type === 'percent' ? `%${camp.discount_value}` : fmtP(camp.discount_value)} indirim.`);
  lines.push('Ürün adına tıklayıp detay sayfasına gidebilir, "Markete göz at" ile vitrini gezebilirsin.');
  return { text: lines.join('\n'), options: [...options.slice(0, 3), 'Markete göz at'] };
}