// Dijital Olgunluk Testi — sorular, puanlama ve yol haritası eşleşmeleri
import { serviceBySlug } from '@/lib/serviceCatalog';

export const MATURITY_QUESTIONS = [
  {
    key: 'web',
    q: 'İşletmenizin bir web sitesi var mı?',
    options: [
      { label: 'Hayır, hiç sitemiz yok', points: 0 },
      { label: 'Var ama güncellenmiyor / eskidi', points: 5 },
      { label: 'Var; güncel ve mobil uyumlu', points: 10 },
    ],
  },
  {
    key: 'speed',
    q: 'Siteniz telefondan hızlı açılıyor mu?',
    options: [
      { label: 'Hiç test etmedim / bilmiyorum', points: 0 },
      { label: 'Açılıyor ama bazen yavaşlıyor', points: 5 },
      { label: 'Evet, 3 saniyenin altında', points: 10 },
    ],
  },
  {
    key: 'google',
    q: 'Google İşletme Profiliniz (haritadaki kaydınız) ne durumda?',
    options: [
      { label: 'Yok ya da varlığından habersizim', points: 0 },
      { label: 'Var ama bilgiler eksik', points: 5 },
      { label: 'Tam dolu; yorumlar düzenli geliyor', points: 10 },
    ],
  },
  {
    key: 'seo',
    q: 'Google aramalarında ürün/hizmetiniz bulunuyor mu?',
    options: [
      { label: 'Hayır, hiç görünmüyoruz', points: 0 },
      { label: 'Bazen görünüyoruz', points: 5 },
      { label: 'İstikrarlı şekilde ilk sayfadayız', points: 10 },
    ],
  },
  {
    key: 'sales',
    q: 'Online satış veya sipariş alabiliyor musunuz?',
    options: [
      { label: 'Hayır, sadece fiziksel satış', points: 0 },
      { label: 'WhatsApp / telefonla sipariş', points: 5 },
      { label: 'E-ticaret sitemizden satıyoruz', points: 10 },
    ],
  },
  {
    key: 'content',
    q: 'Dijital içerik üretiyor musunuz (blog, sosyal medya)?',
    options: [
      { label: 'Hiç üretmiyoruz', points: 0 },
      { label: 'Ara sıra paylaşıyoruz', points: 5 },
      { label: 'Düzenli içerik takvimiyle', points: 10 },
    ],
  },
  {
    key: 'crm',
    q: 'Müşteri ve sipariş takibini nasıl yapıyorsunuz?',
    options: [
      { label: 'Defter / telefon notları', points: 0 },
      { label: 'Excel tabloları', points: 5 },
      { label: 'CRM veya otomatik sistem', points: 10 },
    ],
  },
  {
    key: 'ads',
    q: 'Reklam çalışması yapıyor musunuz?',
    options: [
      { label: 'Hiç yapmadık', points: 0 },
      { label: 'Yapıyoruz ama ölçümü yok', points: 5 },
      { label: 'Evet; dönüşüm ölçümlü kampanyalar', points: 10 },
    ],
  },
  {
    key: 'analytics',
    q: 'Site trafiğinizi ve dönüşümünüzü ölçüyor musunuz?',
    options: [
      { label: 'Hayır, ölçmüyoruz', points: 0 },
      { label: 'Bakıyorum ama yorumlayamıyorum', points: 5 },
      { label: 'Düzenli raporla takip ediyoruz', points: 10 },
    ],
  },
  {
    key: 'multi',
    q: 'Yapınız çok dilli veya ihracata açık mı?',
    options: [
      { label: 'Sadece Türkçe', points: 0 },
      { label: 'Bazı sayfalar İngilizce', points: 5 },
      { label: 'Tam çok dilli (TR / EN / DE)', points: 10 },
    ],
  },
];

// kategori → yol haritası önerisi (ilişkili hizmet ile)
const RECIPES = {
  web: { slug: 'web-tasarimi', why: 'Dijital vitrininiz yok; her şeyden önce sizi 7/24 temsil edecek hızlı ve mobil uyumlu bir siteyle başlamalısınız.' },
  speed: { slug: 'web-tasarimi', why: 'Yavaş veya test edilmemiş bir site ziyaretçiyi geri tuşa bastırıyor; hız denetimi ve optimizasyon ilk adım olmalı.' },
  google: { slug: 'google-isletme', why: '"Yakınımda" aramalarında görünürlüğün en hızlı yolu; profil tam dolu olmalı, yorumlar düzenli toplanmalı.' },
  seo: { slug: 'seo', why: 'Google görünürlüğünüz sınırlı; anahtar kelime ve teknik SEO çalışması ilk sayfaya çıkışın yoludur.' },
  sales: { slug: 'e-ticaret', why: 'Online satış kapasiteniz kısıtlı; ödeme ve kargo akışları hazır mağaza pazarınızı Türkiye geneline açar.' },
  content: { slug: 'sosyal-medya', why: 'Düzenli içerik; hem müşteri bağını hem SEO gücünüzü büyüten en düşük maliyetli yatırımdır.' },
  crm: { slug: 'eposta-crm', why: 'Müşteri veriniz dağınık; CRM ve otomatik akışlar tekrar satışı ve sadakati sistematikleştirir.' },
  ads: { slug: 'reklam-yonetimi', why: 'Ölçümsüz reklam bütçe yakar; dönüşüm odaklı kurgu her kuruşu raporlanabilir kılar.' },
  analytics: { slug: 'reklam-yonetimi', why: 'Ölçüm olmadan iyileştirme olmaz; trafik ve dönüşüm raporları kararlarınızı veriye bağlar.' },
  multi: { slug: 'web-tasarimi', why: 'Çok dilli yapı, Trakya\'nın ihracat potansiyeli için Avrupalı alıcıya açılan kapıdır.' },
};

export function scoreOf(answers) {
  const total = MATURITY_QUESTIONS.reduce((s, q) => s + (answers[q.key] ?? 0), 0);
  return Math.round((total / (MATURITY_QUESTIONS.length * 10)) * 100);
}

export function tierOf(score) {
  if (score >= 85) return { label: 'Bölgenin Dijital Lideri', color: 'text-mint', bar: 'bg-mint', note: 'Rakiplerinizin önündesiniz; şimdi ölçek büyütme zamanı.' };
  if (score >= 65) return { label: 'Dijital Olgun', color: 'text-mint', bar: 'bg-mint', note: 'Sağlam bir temeliniz var; eksik halkaları kapatın.' };
  if (score >= 30) return { label: 'Büyüme Aşamasında', color: 'text-sun', bar: 'bg-sun', note: 'İlk adımlar atılmış; doğru öncelik sırası kritik.' };
  return { label: 'Dijital Yolun Başında', color: 'text-coral', bar: 'bg-coral', note: 'Endişelenmeyin — ilk adımlar en hızlı sonucu verir.' };
}

export function roadmapOf(answers) {
  return MATURITY_QUESTIONS
    .map((q) => {
      const rec = RECIPES[q.key];
      return { key: q.key, points: answers[q.key] ?? 0, why: rec.why, service: serviceBySlug(rec.slug) };
    })
    .filter((r) => r.points <= 5)
    .sort((a, b) => a.points - b.points)
    .slice(0, 4);
}