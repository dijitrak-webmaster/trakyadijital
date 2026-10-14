import { Monitor, ShoppingCart, Search, Megaphone, BadgeCheck, Cog, Tractor, Factory, Store, Hotel, UtensilsCrossed } from 'lucide-react';

export const services = [
  { id: 'web', slug: 'web-tasarimi', title: 'Web Tasarım', desc: 'Tarım ve sanayi işletmelerine özel, hızlı ve mobil uyumlu kurumsal siteler.', icon: Monitor, color: 'bg-mint', price: [4900, 14500] },
  { id: 'eticaret', slug: 'e-ticaret', title: 'E-Ticaret', desc: 'Ürünlerinizi Türkiye geneline ve ihracata açan online mağazalar.', icon: ShoppingCart, color: 'bg-coral', price: [12900, 28000] },
  { id: 'seo', slug: 'seo', title: 'SEO', desc: '"Edirne ayçiçek yağı" gibi aramalarda ilk sayfaya çıkın.', icon: Search, color: 'bg-sun', price: [1950, 4950], monthly: true },
  { id: 'pazarlama', slug: 'reklam-yonetimi', title: 'Dijital Pazarlama', desc: 'Google ve sosyal medya reklamlarıyla ölçülebilir müşteri akışı.', icon: Megaphone, color: 'bg-sage', price: [2750, 6950], monthly: true },
  { id: 'kimlik', slug: 'kurumsal-kimlik', title: 'Kurumsal Kimlik', desc: 'Logo, katalog ve ambalajda güven veren tutarlı marka dili.', icon: BadgeCheck, color: 'bg-fog', price: [3900, 9900] },
  { id: 'otomasyon', slug: 'web-uygulama', title: 'Otomasyon & Yazılım', desc: 'Sipariş, stok ve teklif süreçlerinizi dijitalleştiren özel yazılımlar.', icon: Cog, color: 'bg-mint', price: [14900, 49000] },
];

export const stats = [
  { value: '120+', label: 'Proje', color: 'bg-mint' },
  { value: '%340', label: 'Ortalama Trafik Artışı', color: 'bg-sage' },
  { value: '3', label: 'Trakya İli', color: 'bg-coral' },
  { value: '24/7', label: 'AI Asistan', color: 'bg-sun' },
];

export const sectors = [
  {
    slug: 'tarim', name: 'Tarım', icon: Tractor, color: 'bg-mint',
    title: 'Tarım — Ürününüzü dijitale taşıyın',
    intro: 'Kooperatiflerden üretici birliklerine, tarladan sofraya uzanan dijital yol haritası. Ürününüzü aracısız, doğru fiyattan ve doğru alıcıya ulaştırın.',
    pains: [
      { title: 'Aracıya bağımlılık', desc: 'Ürün değerinin büyük kısmı tüccarda kalıyor, üreticiye az pay düşüyor.' },
      { title: 'Görünmezlik', desc: 'Toptancılar ve marketler sizi Google\'da bulamıyor.' },
      { title: 'Mevsimsel nakit akışı', desc: 'Tarım sezonu dışında satış ve iletişim duruyor.' },
    ],
    solutions: [
      { title: 'Doğrudan satış mağazası', desc: 'Ayçiçek yağı, bal, peynir gibi ürünler için kargo entegre e-ticaret.' },
      { title: 'Kooperatif portalı', desc: 'Üye üreticiler, sertifikalar ve ürün izlenebilirliği tek sitede.' },
      { title: 'Yerel SEO', desc: 'Edirne, Kırklareli, Tekirdağ aramalarında haritada ilk sıralar.' },
      { title: 'Ön sipariş sistemi', desc: 'Sezon öncesi sipariş toplayarak nakit akışını dengeleyin.' },
    ],
    guides: [
      { title: 'Tarım ürünleri için Google\'da nasıl üst sıralara çıkılır?', body: 'Ürün + şehir odaklı sayfalar oluşturun (ör. "Trakya ayçiçek yağı"), Google İşletme Profilinizi fotoğraflarla güncel tutun ve her ürün için üretim hikayesi anlatan özgün içerik yazın. Müşteri yorumlarını düzenli toplamak yerel sıralamayı hızla yükseltir.' },
      { title: 'Kooperatifler için e-ticarete geçiş rehberi', body: 'Önce en çok talep gören 5–10 ürünle başlayın. Kargo anlaşması, ambalaj standardı ve ürün fotoğrafları hazır olduğunda mağazayı açın. İlk 3 ayda mevcut toptan müşterilerinizi online siparişe yönlendirmek en hızlı sonucu verir.' },
      { title: 'Coğrafi işaretli ürünleri dijitalde öne çıkarmak', body: 'Coğrafi işaret belgenizi sitede görünür kılın, ürün sayfalarında yapısal veri kullanın ve menşe hikayesini fotoğraf ve videoyla anlatın. Bu, fiyat rekabetinden çok kalite algısıyla satış yapmanızı sağlar.' },
    ],
  },
  {
    slug: 'sanayi', name: 'Sanayi', icon: Factory, color: 'bg-coral',
    title: 'Sanayi — Üretim gücünüzü dünyaya gösterin',
    intro: 'Çorlu, Çerkezköy ve Ergene OSB\'lerindeki üreticiler için teklif talebi toplayan, ihracata hazır, çok dilli dijital vitrinler.',
    pains: [
      { title: 'Eski katalog siteler', desc: 'Yıllardır güncellenmeyen site, yeni alıcılarda güven kaybı yaratıyor.' },
      { title: 'Dağınık teklif süreci', desc: 'Talepler e-posta ve telefonda kayboluyor, takip zorlaşıyor.' },
      { title: 'İhracatta dil engeli', desc: 'Yabancı alıcılar ürün teknik detaylarına ulaşamıyor.' },
    ],
    solutions: [
      { title: 'Teknik ürün kataloğu', desc: 'Filtrelenebilir ürünler, teknik çizimler ve indirilebilir dokümanlar.' },
      { title: 'Akıllı teklif formu', desc: 'Adet, malzeme ve teslim bilgisiyle gelen, takip edilebilir talepler.' },
      { title: 'Çok dilli site', desc: 'İngilizce, Almanca ve Arapça sürümlerle ihracat pazarlarına açılın.' },
      { title: 'B2B SEO', desc: '"CNC işleme Türkiye" gibi global aramalarda görünürlük.' },
    ],
    guides: [
      { title: 'Sanayi firmaları için B2B SEO temelleri', body: 'Her üretim kabiliyeti için ayrı sayfa açın (ör. lazer kesim, CNC, döküm), teknik terimleri hem Türkçe hem İngilizce kullanın ve sertifikalarınızı (ISO, CE) sayfalarda belirtin. Alıcılar teknik detay arar; kısa değil, kapsamlı içerik kazanır.' },
      { title: 'İhracat için web sitesi kontrol listesi', body: 'Çok dilli yapı, uluslararası birimler (mm/inç), hızlı yüklenen görseller, açık iletişim ve saat dilimi bilgisi, referans ülkeler haritası. Bu beş madde yabancı alıcının güvenini ilk ziyarette kazanır.' },
      { title: 'Teklif taleplerini 3 katına çıkarmak', body: 'Teklif formunu her ürün sayfasına ekleyin, dosya (teknik çizim) yüklemeye izin verin ve 24 saat içinde dönüş sözü verin. Ölçülebilir takip için talepleri tek panelde toplayın.' },
    ],
  },
  {
    slug: 'yerel-ticaret', name: 'Yerel Ticaret', icon: Store, color: 'bg-sun',
    title: 'Yerel Ticaret — Mahallenizin yeni vitrini',
    intro: 'Esnafından butiğine, marketinden kuyumcusuna; Keşan\'dan Lüleburgaz\'a Trakya esnafının dijital vitrini. Müşteri artık yol geçerken değil, telefonunda sizi ararken buluyor.',
    pains: [
      { title: 'Sessiz vitrin', desc: 'Dükkân haritada görünmüyor; yol geçen müşteri rakibin ışıklı camına çekiliyor.' },
      { title: 'Elden yürüyen işler', desc: 'Sosyal medya hesabı var ama telefona dönüşmüyor; takipçi müşteriye dönüşmüyor.' },
      { title: 'Defterde kalan talepler', desc: 'Sipariş ve rezervasyon mesaj dağınıklığında kayboluyor.' },
    ],
    solutions: [
      { title: 'Google İşletme dönüşümü', desc: 'Profil, fotoğraf ve yorum yönetimiyle harita aramalarında ilk sıra.' },
      { title: 'Mini e-ticaret', desc: 'Katalog, sipariş ve WhatsApp entegrasyonlu hafif mağaza.' },
      { title: 'Semt bazlı reklam', desc: 'Bütçenizi ilçenizdeki potansiyel müşteriye harcayan Google kampanyaları.' },
      { title: 'Sipariş paneli', desc: 'Telefon, WhatsApp ve online talepler tek ekranda kayıtlı.' },
    ],
    packages: [
      {
        tag: 'Başlangıç', name: 'Vitrin Paketi', price: [6000, 12000], duration: '3–4 hafta',
        features: [
          'Google İşletme Profili kurulumu ve optimizasyonu',
          'Fotoğraf planı ve dükkân cephesi çekim düzeni',
          'Mesai, harita ve ödeme bilgisi doğruluğu',
          'Tek sayfalık tanıtım sitesi ve WhatsApp bağlantısı',
          'Yorum toplama ve yanıt şablonları',
        ],
      },
      {
        tag: 'En çok tercih edilen', name: 'Mahalle Mağazası', price: [12000, 25000], duration: '5–7 hafta',
        features: [
          'Mini e-ticaret: katalog, sepet ve online ödeme',
          'WhatsApp bildirimli sipariş takip paneli',
          'Kargo anlaşması ve takip entegrasyonu',
          'Semt bazlı Google reklam kurulumu',
          'Google İşletme dönüşümü ve yerel SEO',
          '1 ay ücretsiz destek ve panel eğitimi',
        ],
      },
      {
        tag: 'Büyüme', name: 'Esnaf Büyüme Planı', price: [2000, 5000], monthly: true, duration: 'Aylık yürütme',
        features: [
          'Google profil ve yorum yönetimi',
          'Aylık içerik üretimi (görsel + yazı)',
          'Semt bazlı reklam yönetimi ve optimizasyonu',
          'Sipariş ve taleplerin tek panelde takibi',
          'Aylık ölçülebilir büyüme raporu',
        ],
      },
    ],
    guides: [
      { title: 'Esnaf için Google İşletme Profili kontrol listesi', body: 'Kategorinizi doğru seçin, dükkân cephesi ve ürün fotoğraflarını her ay ekleyin, mesai ve ödeme bilgilerini güncel tutun. Yorumları her hafta yanıtlamak harita sıralamasını belirgin yükseltir.' },
      { title: 'Sosyal medya takipçisini müşteriye çevirmek', body: 'Her paylaşıma tek bir net aksiyon koyun: WhatsApp sipariş, yol tarifi veya telefon. Profilinizde adres ve saat bilgisi güncelse takipçi vitrine uğramaya başlar.' },
      { title: 'Küçük bütçeyle yerel reklam', body: 'İlçe merkezine 5 km yarıçaplı Google reklamı açın, "yakınımda" aramalarında öne çıkın. Günlük 100–150 TL bütçeyle bile küçük bir esnaf için ölçülebilir telefona dönüş sağlanabilir.' },
    ],
  },
  {
    slug: 'turizm', name: 'Turizm & Konaklama', icon: Hotel, color: 'bg-sage',
    title: 'Turizm & Konaklama — Sezonu 12 aya taşıyın',
    intro: 'Enez\'in koylarından Istranca yaylalarına; butik oteller, pansiyonlar ve gastronomi durakları için rezervasyondan dijital vitrine eksiksiz çözüm.',
    pains: [
      { title: 'Mevsimsel doluluk', desc: 'Yazın dolu, kışın boş; yıllık gelir üç aya sıkışmış.' },
      { title: 'OTA bağımlılığı', desc: 'Platform komisyonları kârı eritiyor; misafir sizin değil, aracının müşterisi.' },
      { title: 'Anlatılamayan güzellikler', desc: 'Koyunuz, kahvaltınız, konumunuz Instagram dışında görünmüyor.' },
    ],
    solutions: [
      { title: 'Doğrudan rezervasyon', desc: 'Komisyonsuz online rezervasyon, ödeme ve müsaitlik takvimi.' },
      { title: 'Deneyim odaklı içerik', desc: 'Fotoğraf, video ve bölge hikayeleriyle konaklamayı önceden satın.' },
      { title: 'Çok dilli vitrin', desc: 'Yabancı misafir için İngilizce ve Bulgarca sayfalar.' },
      { title: 'Yorum & itibar', desc: 'Google ve Booking yorumlarının düzenli takibi ve yanıtları.' },
    ],
    packages: [
      {
        tag: 'Başlangıç', name: 'Dijital Vitrin', price: [8000, 16000], duration: '4 hafta',
        features: [
          'Fotoğraf odaklı, mobil öncelikli tanıtım sitesi',
          'Çok dilli yapı (TR / EN / BG)',
          'Deneyim içerik sayfaları (koy, kahvaltı, aktivite)',
          'Google İşletme Profili dönüşümü',
          'Yorum daveti ve yanıt ritmi kurulumu',
        ],
      },
      {
        tag: 'En çok tercih edilen', name: 'Doğrudan Rezervasyon', price: [20000, 45000], duration: '6–8 hafta',
        features: [
          'Müsaitlik takvimi ve oda yönetimi',
          'Karta ödeme ve ön ödeme altyapısı',
          'Komisyonsuz doğrudan rezervasyon akışı',
          'OTA fiyat uyumu ve otomatik e-postalar',
          'Çok dilli rezervasyon sayfaları',
          '1 ay ücretsiz destek ve panel eğitimi',
        ],
      },
      {
        tag: 'Büyüme', name: 'Sezon Yönetimi', price: [2500, 6500], monthly: true, duration: 'Aylık yürütme',
        features: [
          'Yorum ve itibar yönetimi',
          'Sezon ve hafta sonu kampanya sayfaları',
          'Aylık içerik takvimi (görsel + yazı)',
          'Doluluk ve kanal performans raporu',
          'Sezon dışı yerel reklam yönetimi',
        ],
      },
    ],
    guides: [
      { title: 'Butik otel için doğrudan rezervasyon oranı nasıl artırılır', body: 'Siteye müsaitlik takvimi ve karta ödeme ekleyin, OTA fiyatından %5 iyi bir doğrudan fiyat verin ve rezervasyon sonrası e-posta ile tekrar gelmesini sağlayın. Doğrudan kanal oranı %20\'den %40\'a çıkabilir.' },
      { title: 'Sezon dışı doluluğu yükselten dijital taktikler', body: 'Bölgesel etkinlik takvimini (av turu, yürüyüş, gastronomi) içerik haline getirin, "hafta sonu kaçamağı" paketleri yayınlayın ve kış aylarında yerel reklam bütçesini hafta sonuna odaklayın.' },
      { title: 'Turizm işletmelerinde yorum yönetimi', body: 'Konaklamadan sonra otomatik bir yorum daveti gönderin, tüm olumsuz yorumları profesyonel cevaplayın ve fotoğrafları yılda iki kez yenileyin. Puan ortalamasındaki her 0,1 doluluğa doğrudan yansır.' },
    ],
  },
  {
    slug: 'gida', name: 'Gıda & Restoran', icon: UtensilsCrossed, color: 'bg-fog',
    title: 'Gıda & Restoran — Damak tadınıza gelir katın',
    intro: 'İpsala\'dan Uzunköprü\'ye; lokantalar, kafeler ve gıda üreticileri için dijital menüden online siparişe uzanan dijital lezzet hattı.',
    pains: [
      { title: 'Telefonda kayıp siparişler', desc: 'Yoğun saatte açılamayan telefon, doğrudan giden ciro demek.' },
      { title: 'Platform payları', desc: 'Sipariş uygulamaları her tabaktan %30\'a varan pay alıyor.' },
      { title: 'Eski menüler', desc: 'Fiyat ve ürün değişiklikleri ne sitede ne de haritada güncelleniyor.' },
    ],
    solutions: [
      { title: 'Dijital menü & QR', desc: 'Anlık güncellenen, fotoğraflı ve iştah açan mobil menü.' },
      { title: 'Kendi sipariş kanalı', desc: 'Komisyonsuz online sipariş ve ödeme, WhatsApp bildirimli.' },
      { title: 'Google profil dönüşümü', desc: 'Haritada ön sıra, fotoğraflarla dolu profesyonel profil.' },
      { title: 'Yerel SEO', desc: '"Yakınımda kahvaltı" aramalarında öne çıkan sayfalar.' },
    ],
    packages: [
      {
        tag: 'Başlangıç', name: 'Dijital Menü', price: [4000, 9000], duration: '2–3 hafta',
        features: [
          'QR kodlu, fotoğraflı mobil menü',
          'Anlık fiyat ve ürün güncelleme paneli',
          'İştah açan görsel düzeni',
          'Google İşletme Profili dönüşümü',
          'Menü fotoğrafı çekim planı',
        ],
      },
      {
        tag: 'En çok tercih edilen', name: 'Kendi Sipariş Kanalım', price: [15000, 32000], duration: '5–7 hafta',
        features: [
          'Komisyonsuz online sipariş ve ödeme',
          'WhatsApp bildirimli mutfak ekranı',
          'Teslimat ve gel-al yönetimi',
          'Müşteri verisi ve tekrar sipariş akışı',
          'Google profil ve yerel SEO sinerjisi',
          '1 ay ücretsiz destek ve panel eğitimi',
        ],
      },
      {
        tag: 'Büyüme', name: 'Lezzet Markası', price: [3500, 8000], monthly: true, duration: 'Aylık yürütme',
        features: [
          'Yerel SEO ("yakınımda kahvaltı" aramaları)',
          'Yorum ve itibar yönetimi',
          'Sosyal medya içerik takvimi',
          'Kampanya ve menü lansman sayfaları',
          'Aylık sipariş ve trafik raporu',
        ],
      },
    ],
    guides: [
      { title: 'Restoran için Google profili nasıl iştah açar', body: 'Menü fotoğrafları, iç mekân çekimleri ve güncel mesai bilgisi profil etkileşimini iki katına çıkarır. "Yemek" kategorisindeki fotoğraf sayısı yüksek profiller haritada üst sıralarda kalır.' },
      { title: 'Komisyonsuz online sipariş nasıl kurulur', body: 'Menünüzü siteye taşımak ve ödeme bağlamak iki haftalık iş: kendi kanalınızda her siparişin %100\'ü kasada kalır, müşteri verisi de sizde olur.' },
      { title: 'Gıda üreticisi için e-ticaret kontrol listesi', body: 'Ürün fotoğrafı, son tüketim tarihi görünürlüğü, kargo süresi ve coğrafi işaret bilgisi güven yaratır. Yorumlar ve üretim hikayesi fiyat rekabetini kalite algısına çevirir.' },
    ],
  },
];

export const cases = [
  { sector: 'tarim', title: 'Edirne Ayçiçek Kooperatifi', metric: '+%280 online satış', desc: 'Yeni e-ticaret altyapısı ve yerel SEO ile 8 ayda online satışlar 3,8 katına çıktı.', color: 'bg-mint' },
  { sector: 'sanayi', title: 'Çorlu Metal Sanayi', metric: '3x teklif talebi', desc: 'Teknik katalog, çok dilli site ve akıllı teklif formu ile ihracat talepleri üçe katlandı.', color: 'bg-fog' },
  { sector: 'turizm', title: 'Enez Butik Otel', metric: '%60 doluluk artışı', desc: 'Doğrudan rezervasyon sitesi ve yorum yönetimiyle sezon dışı aylarda doluluk sıçradı.', color: 'bg-sage' },
  { sector: 'yerel-ticaret', title: 'İpsala Zeytinyağı Butiği', metric: '2x telefon siparişi', desc: 'Google İşletme dönüşümü ve mini e-ticaret ile mahalle satışı Türkiye geneline taşındı.', color: 'bg-sun' },
];