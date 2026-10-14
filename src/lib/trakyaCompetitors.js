// Trakya bölgesi rakip ajans veri seti — Ekim 2026 site taramaları
// Kaynak: Edirne, Tekirdağ/Çorlu ve Kırklareli hattındaki ajans sitelerinin manuel analizi

export const TRAKYA_AGENCIES = [
  {
    name: 'M8 Dijital',
    site: 'm8dijital.com',
    city: 'Edirne',
    focus: 'Sosyal medya + reklam + prodüksiyon + WhatsApp pazarlama',
    threat: 'yüksek',
    strong: ['Tam hizmet: içerik çekimi, UGC, matbaa dahil', 'Colora Baskı ve EdirneQR ile ortaklık ağı', 'Agresif lead toplama formu'],
    weak: ['Wix altyapısı — hız ve özelleştirme sınırlı', 'Fiyat şeffaflığı yok', 'Müşteri paneli / takip sistemi yok'],
  },
  {
    name: 'Turuncumavi',
    site: 'turuncumavi.com',
    city: 'Çorlu',
    focus: 'Özgün yazılımlı kurumsal site + paket fiyat',
    threat: 'yüksek',
    strong: ['Paket sayfasıyla net fiyat veriyor', 'Özgün yazılım + yönetim paneli + çoklu dil', 'Sanayi odaklı canlı referans akışı'],
    weak: ['Klasik/kurumsal sunum, genç segmente zayıf', 'AI asistan veya simülasyon gibi araç yok'],
  },
  {
    name: 'Ajans.io',
    site: 'ajansio.com.tr',
    city: 'Çorlu',
    focus: 'Konum bazlı SEO açılış sayfaları',
    threat: 'orta',
    strong: ['Çorlu, Lüleburgaz, Edirne için ayrı SEO sayfaları', 'SEO odaklı içerik üretimi'],
    weak: ['Genel ajans sunumu, ürün derinliği az', 'Yerel saha varlığı sınırlı'],
  },
  {
    name: 'Renkli Kalem',
    site: 'renklikalem.com',
    city: 'Çorlu / Edirne',
    focus: 'SEO uyumlu web tasarım',
    threat: 'orta',
    strong: ['Aynı konum-SEO stratejisi (Edirne + Lüleburgaz sayfaları)', 'Düz fiyat vurgusu'],
    weak: ['Şablon-vari sunum', 'Ölçülebilir sonuç raporlaması yok'],
  },
  {
    name: 'Koozmo Medya',
    site: 'koozmo.com',
    city: 'Edirne',
    focus: 'Reklam + SEO + sosyal medya',
    threat: 'orta',
    strong: ['Reklam yönetiminde deneyim', 'Yerel marka bilinirliği'],
    weak: ['Web geliştirme tarafı zayıf', 'E-ticaret çözümü sınırlı'],
  },
  {
    name: 'AWT / Edirne Web Tasarım',
    site: 'edirnewebtasarim.com',
    city: 'Edirne',
    focus: 'Kampanyalı web + tabela + baskı',
    threat: 'düşük',
    strong: ['Uygun fiyat konumlandırması', 'Baskı/tabela ile çapraz satış'],
    weak: ['Genel kalite ve derinlik düşük', 'SEO içeriği zayıf'],
  },
  {
    name: 'Kırklareli Web Tasarım',
    site: 'kirklareliwebtasarim.com',
    city: 'Kırklareli / Lüleburgaz',
    focus: 'Ekonomik fiyat web sitesi',
    threat: 'düşük',
    strong: ['Bölge yerelliği', 'Düşük segment fiyat'],
    weak: ['Şablon satış yaklaşımı', 'İçerik ve SEO yatırımı yok'],
  },
  {
    name: 'MedyaKap',
    site: 'medyakap.com',
    city: 'Çorlu',
    focus: 'Butik web tasarım (2010’dan beri)',
    threat: 'düşük',
    strong: ['Uzun süreli yerel deneyim'],
    weak: ['Butik kapasite, ölçek sınırlı', 'Dijital ürün çeşitliliği az'],
  },
];

// Rakiplerin hiçbirinde birlikte bulunmayan Dijitrak farkları
export const DIJITRAK_EDGE = [
  'DijiBot AI asistanı: 7/24 fiyat hesabı, randevu ve teklif',
  'Müşteri portalı: proje ilerlemesi, dosya ve soru-cevap tek ekranda',
  'Proje simülatörü: yayına girmeden önce dijital maket gezme',
  'Ücretsiz araçlar: olgunluk testi, rakip radarı, Trakya endeksi, dijital harita',
  'Şeffaf fiyat aralıkları + 24 saatte yazılı net teklif',
];