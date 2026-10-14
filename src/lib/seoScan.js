// Ücretsiz Araçlar çekiçmesi + SEO Tarayıcı motoru (tamamen tarayıcıda çalışır, kredi gerekmez)

export const OPEN_TOOLS_EVENT = 'dijitrak:open-tools';

// Her yerden çekiçme: DijiBot çipleri, butonlar → pencereyi sağdan açar
export const openToolsDrawer = (tool = 'seo') =>
  window.dispatchEvent(new CustomEvent(OPEN_TOOLS_EVENT, { detail: { tool } }));

export const normalizeUrl = (url) => {
  const trimmed = url.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

// Sitenin ana sayfasını indirir (CORS engellerse null döner → kontrol listesine düşer)
export const fetchSite = async (url) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const res = await fetch(normalizeUrl(url), { signal: controller.signal });
    const html = await res.text();
    return html && html.length > 200 ? html : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

export const scanSteps = [
  'Siteye bağlanılıyor…',
  'HTML kaynak kodu çekiliyor…',
  'Başlık ve açıklama etiketleri okunuyor…',
  'Görseller, yapısal veri ve mobil uyum denetleniyor…',
  'Puanlama ve aksiyon planı hazırlanıyor…',
];

// Otomatik tarama: HTML üzerinden gerçek SEO kontrolleri
export const analyzeHtml = (html, finalUrl) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const checks = [];
  const add = (label, pass, tip, weight = 11) => checks.push({ label, pass, tip, weight });

  const title = doc.querySelector('title')?.textContent?.trim() || '';
  add(
    'Sayfa başlığı (title)',
    title.length >= 10 && title.length <= 65,
    title
      ? title.length > 65
        ? `Başlık ${title.length} karakter — 65'i aşarsa Google'da kesilir. 10–65 ideal.`
        : title.length < 10
          ? `Başlık çok kısa (${title.length} karakter) — ana anahtar kelimeyi ekleyin.`
          : 'Başlık uzunluğu ideal aralıkta.'
      : 'Title etiketi yok: arama sonuçlarında siteniz başlıksız görünür. En kritik eksik.',
  );

  const desc = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
  add(
    'Meta açıklama',
    desc.length >= 70 && desc.length <= 160,
    desc
      ? desc.length < 70
        ? `Açıklama ${desc.length} karakter — 70–160 arası, net çağrı ile güçlendirin.`
        : desc.length > 160
          ? `Açıklama ${desc.length} karakter — 160'ı aşan kısım görünmez.`
          : 'Meta açıklama ideal uzunlukta.'
      : 'Meta açıklama yok: Google kendi uydurduğu cümleyi gösterir, tıklanma düşer.',
  );

  const h1s = Array.from(doc.querySelectorAll('h1'));
  add(
    'Tek ve net H1 başlığı',
    h1s.length === 1,
    h1s.length === 0
      ? 'H1 yok: sayfanın konusu arama motoruna belirsiz kalır.'
      : h1s.length > 1
        ? `${h1s.length} adet H1 var — tek ana başlık SEO için idealdir.`
        : 'Tek H1 mevcut.',
  );

  add(
    'Mobil uyum (viewport)',
    !!doc.querySelector('meta[name="viewport"]'),
    doc.querySelector('meta[name="viewport"]')
      ? 'Viewport etiketi mevcut; site mobilde ölçekleniyor.'
      : 'Viewport etiketi yok: mobil cihazlarda site küçülerek garip görünür.',
  );

  const imgs = Array.from(doc.querySelectorAll('img'));
  const noAlt = imgs.filter((i) => !i.getAttribute('alt') || !i.getAttribute('alt').trim());
  add(
    'Görsellerde alt metni',
    imgs.length === 0 ? true : noAlt.length === 0,
    noAlt.length === 0
      ? imgs.length === 0
        ? 'Sayfada görsel yok — görsellerle güven artar.'
        : 'Tüm görsellerde alt metni mevcut.'
      : `${noAlt.length}/${imgs.length} görselde alt metni eksik — Google Görseller'de görünmezler.`,
  );

  const og = doc.querySelector('meta[property^="og:"]');
  add(
    'Sosyal medya paylaşım kartı (og:)',
    !!og,
    og ? 'Open Graph etiketleri mevcut: paylaşımlarda görsel kart çıkar.' : 'og: etiketi yok: WhatsApp/Instagram paylaşımlarında sade link görünür.',
  );

  add(
    'Dil bildirimi (html lang)',
    !!doc.documentElement.getAttribute('lang'),
    doc.documentElement.getAttribute('lang')
      ? 'lang özniteliği tanımlı.'
      : 'html lang eksik: arama motoru sayfa dilini tahmin etmek zorunda kalır.',
  );

  add(
    'Güvenli bağlantı (HTTPS)',
    /^https:/i.test(finalUrl || ''),
    /^https:/i.test(finalUrl || '') ? 'Site HTTPS üzerinden servis ediliyor.' : 'HTTPS yok: tarayıcılar "güvenli değil" uyarısı gösterir.',
  );

  add(
    'Canonical adres',
    !!doc.querySelector('link[rel="canonical"]'),
    doc.querySelector('link[rel="canonical"]')
      ? 'Canonical tanımlı; kopya içerik riski düşük.'
      : 'Canonical yok: aynı sayfanın farklı adresleri, sıralama gücünü bölebilir.',
  );

  const ldCount = Array.from(doc.querySelectorAll('script[type="application/ld+json"]')).length;
  add(
    'Yapısal veri (schema.org)',
    ldCount > 0,
    ldCount > 0 ? `${ldCount} yapısal veri bloğu mevcut; zengin sonuçlara aday.` : 'Yapısal veri yok: Google yıldız/fiyat gibi zengin sonuçlarda gösteremez.',
  );

  const robotsMeta = doc.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
  add(
    'Arama motorlarına açık',
    !/noindex/i.test(robotsMeta),
    /noindex/i.test(robotsMeta)
      ? 'Sayfa noindex: Google\'da asla çıkmaz! Acil düzeltilmeli.'
      : 'Sayfa indekslemeye açık.',
  );

  return checks;
};

// Kontrol listesi modu: site okunamadığında 60 saniyelik hızlı denetim
export const checklistItems = [
  { id: 'first5', text: 'Siteme giren biri, ne iş yaptığımı ilk 5 saniyede anlıyor.', weight: 14, tip: 'Ana başlık tek cümleyle işinizi anlatmalı: "X işletmelerine Y üretiyoruz".' },
  { id: 'mobile', text: 'Telefondan açınca site düzgün ve kullanılabilir.', weight: 14, tip: 'Ziyaretçilerin büyük kısmı telefondan gelir; mobil deneyim sıralamayı doğrudan etkiler.' },
  { id: 'google', text: 'İşletme adım Google\'da aratıldığında üst sıralarda çıkıyorum.', weight: 12, tip: 'Çıkmıyorsanız Google İşletme Profili + yerel SEO eksik demektir.' },
  { id: 'gmb', text: 'Google İşletme Profilim var, bilgileri ve fotoğrafları güncel.', weight: 12, tip: 'Profil, "yakınımda" aramalarının bir numaralı görünüm kaynağıdır.' },
  { id: 'meta', text: 'Her sayfanın başlığı ve açıklaması birbirinden farklı.', weight: 10, tip: 'Aynı başlıklı sayfalar birbirini rekabette gömer; sayfa başına özgün title yazın.' },
  { id: 'speed', text: 'Site 3 saniyeden hızlı yükleniyor.', weight: 12, tip: 'Yavaş site, ziyaretçinin yarısını kaybeder; görselleri sıkıştırın.' },
  { id: 'cta', text: 'Teklif/iletişim formu her sayfadan en fazla 1 tık uzakta.', weight: 12, tip: 'Ziyaretçiyi harekete geçirecek buton görünür alanda olmalı.' },
  { id: 'trust', text: 'Referanslar, yorumlar ve hakkımızda bölümü güven veriyor.', weight: 14, tip: 'Yerel referanslar ve gerçek yorumlar, dönüşümü en çok artıran içeriklerdir.' },
];

export const scoreOf = (checks) => {
  const total = checks.reduce((s, c) => s + c.weight, 0);
  const got = checks.reduce((s, c) => s + (c.pass ? c.weight : 0), 0);
  return Math.round((got / total) * 100);
};

export const gradeOf = (score) => {
  if (score >= 80) return { letter: 'A', label: 'Güçlü temel' };
  if (score >= 60) return { letter: 'B', label: 'Fırsat var' };
  if (score >= 40) return { letter: 'C', label: 'Ciddi eksikler' };
  return { letter: 'D', label: 'Acil bakım' };
};

export const gradeColor = (score) => {
  if (score >= 80) return 'hsl(var(--mint))';
  if (score >= 60) return 'hsl(var(--sun))';
  if (score >= 40) return 'hsl(var(--coral))';
  return 'hsl(var(--coral))';
};

export const topActions = (checks, count = 3) =>
  checks
    .filter((c) => !c.pass)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, count);