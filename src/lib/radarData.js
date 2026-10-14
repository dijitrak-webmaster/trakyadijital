// Rakip Radarı — kaba erişilebilirlik ölçümü ve karşılaştırma listesi

export const RADAR_FEATURES = [
  'Online satış / e-ticaret',
  'Çok dilli sayfalar',
  'Blog veya içerik rehberi',
  'Müşteri yorumları',
  'WhatsApp / canlı destek',
  'E-bülten kaydı',
  'Net fiyat / teklif bilgisi',
  'Hızlı mobil açılış',
];

// tarayıcıdan no-cors ölçüm: ağ hatasında reddeder, HTTP yanıtı gelirse çözer
async function tryProbe(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const t = performance.now();
    await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: ctrl.signal });
    return { url, ok: true, ms: Math.round(performance.now() - t) };
  } catch {
    return { url, ok: false };
  } finally {
    clearTimeout(timer);
  }
}

export async function probeDomain(raw) {
  const domain = raw.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
  if (!domain) return { domain: '', ok: false };
  for (const url of [`https://${domain}`, `https://www.${domain}`]) {
    const res = await tryProbe(url);
    if (res.ok) return { domain, ...res };
  }
  return { domain, ok: false };
}