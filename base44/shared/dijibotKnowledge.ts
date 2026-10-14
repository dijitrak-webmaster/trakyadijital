// DijiBot bilgi bankası — hem site sohbeti (aiAnswer) hem WhatsApp akışı
// (whatsappWebhook) bu tek kaynağı kullanır; fiyatlar ve bilgiler iki kanalda
// daima tutarlı kalır.
export const DIJIBOT_KB = `
Dijitrak: Trakya (Tekirdağ/Edirne/Kırklareli) merkezli dijital ajans.
Hizmetler ve fiyat aralıkları (TL):
- Kurumsal Web Tasarımı: 4900-14500, teslim 3-4 hafta (mobil uyumlu, SEO hazır, yönetim paneli dahil)
- Landing Page / Kampanya Sayfası: 2900-7500, 1-2 hafta
- E-Ticaret Mağazası: 12900-28000, 6-8 hafta (sanal POS, kargo, stok entegrasyonu)
- Mobil Uygulama (iOS+Android): 19900-59000, 8-12 hafta. PWA alternatifi: 9900-24900
- SEO (aylık): 1950-4950; Yerel SEO (aylık): 1450-3950
- Google İşletme Profili: tek seferlik 1900-4500
- Google & Meta Reklam yönetimi (aylık): 2750-6950 (reklam bütçesi ayrı)
- Web Bakım & Destek (aylık): 590-1590
- E-Posta Pazarlama & CRM (aylık): 1450-3950
- WhatsApp Business & Chatbot kurulumu: 4900-12500
- E-Fatura & Muhasebe entegrasyonu: 6500-18500
- Web Uygulama & Otomasyon (panel, stok, teklif takibi): 14900-49000
- Kurumsal Kimlik & Grafik: 3900-9900
Ödeme: %40 başlangıç, %40 ortada, %20 teslimde. Teslim sonrası 1 ay ücretsiz destek.
Süreç 5 adım: ücretsiz keşif -> teklif -> tasarım onayı -> geliştirme -> test + yayına alma.
Ekib Tezgahta görüşme için Edirne, Kırklareli, Tekirdağ'a yerinde geliyor.
Özel işlemler: randevu oluşturma, teklif/link hazırlama, alan adı kontrolü -> "Bir uzman beni arasın" olarak ekibe aktarılır.
`.trim();

// AI'ın "bir sonraki adım" olarak önermesi gereken hizmet başlıkları —
// site sohbetindeki teklif düğmesi bu başlıkları birebir kullanır.
export const DIJIBOT_SERVICES = [
  'Kurumsal Web Tasarımı',
  'Landing Page & Kampanya',
  'E-Ticaret Mağazası',
  'iOS & Android Mobil Uygulama',
  'SEO — Arama Optimizasyonu',
  'Yerel SEO & Harita Sıraları',
  'Google İşletme Profili',
  'Google & Meta Reklamları',
  'Web Bakım & Destek',
  'E-posta Pazarlama & CRM',
  'WhatsApp Business & Chatbot',
  'E-Fatura & Muhasebe Entegrasyonu',
  'Web Uygulama & Otomasyon',
  'Kurumsal Kimlik & Grafik',
];