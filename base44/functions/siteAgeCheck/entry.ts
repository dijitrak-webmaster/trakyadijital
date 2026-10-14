// "Sitem eski mi?" — sunucu tarafında sitenin HTML'ini indirir, kuşak/yaş sinyallerini puanlar.
// SEO Tarayıcı (tarayıcı-içi) ile kesişmez: burada teknoloji çağı ve yaş sinyallerine bakılır.
const CURRENT_YEAR = 2026;

const oldTags = (html) => (html.match(/<(center|font|marquee|frameset|blink)\b/gi) || []).length;

const tableCount = (html) => (html.match(/<table\b/gi) || []).length;

const copyrightYear = (html) => {
  const matches = [...html.matchAll(/(?:©|&copy;|copyright)[^\n<]{0,40}?((?:19|20)\d{2})/gi)];
  const years = matches.map((m) => parseInt(m[1], 10)).filter((y) => y >= 1995 && y <= CURRENT_YEAR + 1);
  return years.length ? Math.max(...years) : null;
};

const legacyStack = (html) =>
  /jquery-(0|1|2)\./i.test(html) || /mootools|prototype\.js|scriptaculous|swfobject|swfobject/i.test(html);

const oldGenerator = (html) => {
  const m = html.match(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']{0,80})["']/i);
  if (!m) return null;
  return /wordpress\s*(0|1|2|3|4)\.|joomla!?\s*1|drupal\s*[0-7]\b/i.test(m[1]) ? m[1] : null;
};

export default async function(req) {
  try {
    const body = await req.json().catch(() => ({}));
    let url = String(body.url || '').trim();
    if (!url) return Response.json({ error: 'url required' }, { status: 400 });
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return Response.json({ error: 'unreachable' }, { status: 200 });
    }
    if (!parsed.hostname.includes('.')) return Response.json({ error: 'unreachable' }, { status: 200 });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    let html = '';
    let finalUrl = url;
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        redirect: 'follow',
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DijitrakBot/1.0)' },
      });
      html = await res.text();
      finalUrl = res.url || url;
    } catch {
      return Response.json({ error: 'unreachable' }, { status: 200 });
    } finally {
      clearTimeout(timer);
    }
    if (!html || html.length < 200) return Response.json({ error: 'unreachable' }, { status: 200 });

    const checks = [];
    const add = (label, pass, tip, weight) => checks.push({ label, pass, tip, weight });

    const httpsOk = /^https:/i.test(finalUrl);
    add('Güvenli bağlantı (HTTPS)', httpsOk, httpsOk ? 'Site HTTPS üzerinden servis ediliyor.' : 'HTTPS yok: tarayıcılar "güvenli değil" uyarısı gösterir.', 16);

    const viewport = /<meta[^>]+name=["']viewport["']/i.test(html);
    add('Mobil uyum altyapısı', viewport, viewport ? 'Viewport tanımlı; site mobilde ölçekleniyor.' : 'Viewport yok: mobil ziyaretçi siteyi küçülerek zor okur — eski kuşak sinyali.', 18);

    const year = copyrightYear(html);
    const fresh = year !== null && CURRENT_YEAR - year <= 2;
    add('Telif yılı güncel', fresh, year === null ? 'Sayfada telif yılı bulunamadı — footerda güncel yıl güven verir.' : fresh ? `Telif yılı ${year}: site düzenli bakılıyor görünüyor.` : `Telif yılı ${year}: ${CURRENT_YEAR - year} yıldır güncellenmemiş görünüyor.`, 20);

    const legacy = legacyStack(html);
    add('Modern teknoloji yığını', !legacy, legacy ? 'Eski kuşak kütüphane izleri (eski jQuery/Flash araçları) var — sitenin yaşı belli oluyor.' : 'Eski kütüphane izi bulunmadı.', 14);

    const tags = oldTags(html);
    add('Güncel HTML kullanımı', tags === 0, tags === 0 ? 'Kullanımdan kalkmış etiket yok.' : `${tags} adet center/font/marquee gibi emekli etiket bulundu — 2000'ler tasarımı.`, 12);

    const tables = tableCount(html);
    add('Tablo tabanlı düzen yok', tables <= 6, tables <= 6 ? 'Düzen modern yöntemlerle kurulmuş görünüyor.' : `${tables} adet tablo etiketi: düzen büyük ihtimalle tablo ile kurulmuş eski yöntem.`, 10);

    const gen = oldGenerator(html);
    add('Altyapı sürümü güncel', !gen, gen ? `Altyapı etiketi eski sürümü ele veriyor: ${gen}.` : 'Eski sürümlü altyapı etiketi bulunmadı.', 10);

    const score = checks.reduce((s, c) => s + (c.pass ? c.weight : 0), 0);
    const grade = score >= 80 ? { letter: 'A', label: 'Güncel kuşak' } : score >= 60 ? { letter: 'B', label: 'Orta kuşak' } : score >= 40 ? { letter: 'C', label: 'Eski kuşağa yakın' } : { letter: 'D', label: 'Eski kuşak' };
    const verdict = score >= 80
      ? 'Siteniz güncel kuşakta: işletmenizi modern ve güvenilir gösteriyor. Küçük rötuşlarla yıllarca yeter.'
      : score >= 60
        ? 'Temel sağlam ama birkaç kuşak sinyali eskimiş: küçük yenilemeler (telif yılı, mobil rötuşlar) algıyı yukarı çeker.'
        : score >= 40
          ? 'Eski kuşak sinyalleri belirgin: ziyaretçiler güncelliğinizi sorgulayabilir. Yenileme değerine dönüştürmede ciddi kazanç var.'
          : 'Siteniz eski kuşak: yenileme hem güven hem dönüşüm için acil. Bizimle kısa bir keşif görüşmesinde yol haritasını çıkarabiliriz.';

    return Response.json({ url: finalUrl, checks, score, grade, verdict });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}