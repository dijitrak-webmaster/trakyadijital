import { services } from '@/lib/siteData';
import { serviceCatalog } from '@/lib/serviceCatalog';

const FALLBACK = 'Tam anlayamadım, biraz daha açar mısınız? Ne yapmak istediğinizi kendi cümlelerinizle yazarsanız daha isabetli yönlendiririm. İsterseniz hemen "Fiyat teklifi al" diyin, işinize özel tahmini bütçeyi 30 saniyede çıkarayım — ya da gerçek ekibimizden biri sizi arasın.';

const faq = [
  { keys: ['merhaba', 'selam', 'iyi günler', 'günaydın', 'naber', 'hey bot'], answer: 'Merhaba! Ben DijiBot, Dijitrak\'ın dijital dönüşüm asistanıyım. Hizmetler, fiyatlar, süreler, randevu... Merak ettiğiniz ne varsa sorun, hemen yanıtlarım.' },
  { keys: ['dijibot', 'sen kimsin', 'nesin', 'robot musun', 'kim yazıyor'], answer: 'Ben DijiBot — Dijitrak\'ın asistanıyım. Soruları yanıtlar, size özel paket kurar, randevunuzu ayarlarım; isterseniz gerçek ekibimizle de bağlarım. İnsandan insana devam etmek isterseniz "Bir uzman beni arasın" demeniz yeterli.' },
  { keys: ['fiyat', 'ücret', 'ne kadar', 'maliyet', 'bütçe', 'kaç para', 'kaç tl', 'pahalı', 'indirim'], answer: 'Dürüst olmalıyım: fiyat kapsamına göre değişiyor. Yaklaşık aralıklar şöyle — kurumsal web ₺4.900–14.500, landing page ₺2.900–7.500, e-ticaret ₺12.900–28.000, mobil uygulama ₺19.900–59.000; SEO aylık ₺1.950–4.950, bakım ₺590\'den başlıyor. Net sayı isterseniz "Fiyat teklifi al" derim — kendi işinize özel tahmini bütçeyi 30 saniyede çıkarırım.' },
  { keys: ['süre', 'ne zaman', 'kaç gün', 'teslim', 'kaç hafta', 'ne zaman hazır', 'ne zaman biter'], answer: 'Genelde şöyle: kurumsal site 3–4 hafta, landing page 1–2 hafta, e-ticaret 6–8 hafta, mobil uygulama 8–12 hafta. SEO\'da ilk hareketlenme 2–3 ayda görülür, kalıcı sıralama 4–6 ayda oturur. Zaman kısıtınız varsa hangisi olduğunu yazın, ona göre konuşalım.' },
  { keys: ['ödeme', 'taksit', 'vade', 'sözleşme', 'iade', 'garanti'], answer: 'Ödemeyi üç dilimde alıyoruz: %40 başlangıçta, %40 geliştirme ortasında, %20 teslimde. Her iş yazılı sözleşmeyle yürür, teslimden sonra 1 ay ücretsiz destek dahildir. KVKK uyumu ve SSL de her projede standart — ayrıca düşünmenize gerek yok.' },
  { keys: ['referans', 'portföy', 'portfoy', 'örnek proje', 'daha önce yapmış', 'kiminle çalıştınız'], testi: true, answer: 'Portföy sayfamızda tarımdan sanayiye, turizmden gıdaya tamamlanmış projelerimiz ve ölçülebilir sonuçları var. Aşağıda gerçek müşteri yorumlarımızdan birkaçını da görüyorsunuz. Örnek istediğiniz sektöre özel çalışmalar da gösterebiliriz — "Bir uzman beni arasın" deyin, sektorünüze en yakın örnekleri paylaşalım.' },
  { keys: ['güvenilir', 'kimse ne diyor', 'müşteri memnuniyeti', 'ne kadar iyi', 'emin olamadım'], testi: true, answer: 'Güven en iyi referanslarla kurulur — aşağıda gerçek müşterilerimizin yorumlarını görüyorsunuz. Portföy sayfamızda ölçülebilir proje sonuçlarımız da var; isterseniz sektörünüze en yakın örnekleri paylaşırız.' },
  { keys: ['web sitesi', 'web tasarım', 'kurumsal site', 'site yaptır', 'sitem olsun', 'yeni site', 'site yenile'], service: 'Kurumsal Web Tasarımı', answer: 'Kurumsal site tarafında nasıl çalıştığımızı söyleyeyim: mobil uyumlu, 2 saniyenin altında açılan ve SEO altyapısı hazır bir site teslim ediyoruz; içeriği kendinizin güncelleyebileceği panel de dahil. Bütçe ₺4.900–14.500 arası değişiyor, 3–4 haftada yayındayız. Aşağıdaki teklif düğmesiyle tahmini bütçeyi hemen çıkarabilirim.' },
  { keys: ['e-ticaret', 'eticaret', 'mağaza aç', 'online satış', 'sanal pos', 'trendyol', 'hepsiburada', 'marketplace'], service: 'E-Ticaret Mağazası', answer: 'E-ticarete geçiş en çok geri dönüş getiren hamlelerden. Mağazanız sanal POS, kargo ve stok entegrasyonlarıyla, kupon ve ön sipariş sistemiyle teslim edilir; derseniz Trendyol/Hepsiburada senkronizasyonu da kurarız. Bütçe ₺12.900–28.000 arası, 6–8 haftada yayındayız. Teklif akışını başlatayım mı?' },
  { keys: ['e-fatura', 'fatura', 'muhasebe', 'logo yazılım', 'mikro', 'paraşüt', 'e-arşiv', 'ön muhasebe', 'gib'], service: 'E-Fatura & Muhasebe Entegrasyonu', answer: 'Sipariş→e-fatura, stok ve cari akışınızı Logo, Mikro, Paraşüt gibi programlarla otomatikleştiriyoruz: satışta fatura kesilir, stok düşer, kimse kopyala-yapıştır yapmaz. Fiyat aralığı ₺6.500–18.500. Detay için teklif alabilir veya sizi uzmanımıza bağlayabilirim.' },
  { keys: ['whatsapp', 'chatbot', 'sohbet botu', 'mesaj otomatik', 'bot kur'], service: 'WhatsApp Business & Chatbot', answer: 'WhatsApp Business hesabınızı kurar, sipariş/randevu akışlı chatbot bağlarız: sık soruları bot karşılar, kritik görüşmeleri personelinize aktarır. Fiyat aralığı ₺4.900–12.500. Yerel işletmelerde telefona en yakın dijital kanal — çok hızlı geri dönüş sağlıyor.' },
  { keys: ['e-posta', 'eposta', 'bülten', 'newsletter', 'crm', 'segment', 'terk eden sepet', 'mail marketing'], service: 'E-posta Pazarlama & CRM', answer: 'Terk eden sepet, hoş geldin ve hatırlatma akışlarını otomatikleştirip müşteri segmentasyonuyla satışa çeviriyoruz; aylık bülten tasarımı ve raporlaması dahil. Aylık ₺1.450–3.950. Mevcut listenizi büyütmek için site ve WhatsApp üzerinden izinli toplama akışı da kuruyoruz.' },
  { keys: ['seo', 'arama', 'sıralama', 'ilk sayfa', 'google\'da çık', 'organik'], service: 'SEO — Arama Optimizasyonu', answer: 'SEO hizmetimizde teknik denetim, aylık içerik üretimi, sayfa içi optimizasyon, backlink ve şeffaf aylık raporlama var. Hedefimiz "şehir + ürün" aramalarında sizi ilk sayfaya taşımak. Aylık ₺1.950–4.950; ilk iyileşmeler 2–3 ayda gelir.' },
  { keys: ['yerel seo', 'harita', 'yakınımda', 'yerelde görün', 'şehir bazlı'], service: 'Yerel SEO & Harita Sıraları', answer: 'Yerel SEO ile Edirne, Tekirdağ, Kırklareli aramalarında harita sıralarınızı yükseltiyoruz: konum sayfaları, atıf inşası ve Google İşletme sinerjisi. Aylık ₺1.450–3.950. Fiziksel işyeri olan herkes için en hızlı geri dönüşlü yatırım.' },
  { keys: ['google işletme', 'işletme profili', 'google harita kayıt', 'profilim'], service: 'Google İşletme Profili', answer: 'Google İşletme Profilinizi kurar/optimize ederiz: doğru kategori, fotoğraf planı, ürün listesi, mesai doğruluğu ve yorum toplama düzeni. Tek seferlik ₺1.900–4.500; 4–8 hafta içinde "yakınımda" aramalarında belirgin artış beklenir.' },
  { keys: ['reklam', 'ads', 'google reklam', 'instagram reklam', 'facebook reklam', 'tıklama'], service: 'Google & Meta Reklamları', answer: 'Google Search, YouTube, Instagram ve Facebook reklamlarında kurgu, hedefleme ve dönüşüm optimizasyonu yapıyoruz — tıklama değil, teklif ve satış üzerinden çalışırız. Aylık yönetim ₺2.750–6.950; reklam harcaması ayrıca platformlara gider.' },
  { keys: ['mobil uygulama', 'ios', 'android', 'app', 'play store', 'app store'], service: 'iOS & Android Mobil Uygulama', answer: 'Sipariş, sadakat puanı veya randevu alan native mobil uygulamalar geliştiriyoruz; tek kod tabanıyla iki mağazaya da yayınlıyoruz. Fiyat ₺19.900–59.000, teslim 8–12 hafta. Mağaza onayı istemiyorsanız PWA alternatifi de var.' },
  { keys: ['pwa', 'ana ekrana ekle', 'mağaza onayı olmadan'], service: 'Progressive Web App (PWA)', answer: 'PWA ile siteniz ana ekrana eklenen, çevrimdışı çalışabilen ve bildirim gönderebilen bir uygulamaya dönüşür — mağaza onayı ve komisyonu yok. Fiyat ₺9.900–24.900. Bildirim ve sadakat yeterliyse native yerine daha hızlı ve ekonomiktir.' },
  { keys: ['bakım', 'destek', 'yedek', 'güvenlik taraması', 'site bozuldu', 'hatchery'], service: 'Web Bakım & Destek', answer: 'Aylık bakım paketimizde haftalık yedek, aylık güvenlik taraması, 2 sayfa içerik güncellemesi, 7/24 erişim izleme ve öncelikli destek var. Aylık ₺590–1.590. Başka firmada yapılmış siteleri de devralıp bakabiliriz.' },
  { keys: ['yorum', 'itibar', 'şikayet', 'google puan'], service: 'Yorum & İtibar Yönetimi', answer: 'Tüm platformlardaki yorumları izler, mutlu müşterilerden yorum toplama akışını otomatikleştirir ve marka sesinizle yanıtlarız; negatif yorum krize dönüşmeden çözülür. Aylık ₺790–1.950.' },
  { keys: ['sosyal medya', 'instagram', 'facebook', 'linkedin', 'içerik takvimi', 'gönderi'], service: 'Sosyal Medya Yönetimi', answer: 'Aylık içerik takvimi, özgün görsel ve kısa video tasarımı, mesaj/yorum yönetimi ile markanıza uygun düzenli bir akış kuruyoruz. Aylık ₺2.450–5.950. Başlangıçta 1–2 platformda güçlü olmayı öneriyoruz.' },
  { keys: ['logo', 'kimlik', 'ambalaj', 'tabela', 'kurumsal renk'], service: 'Kurumsal Kimlik & Grafik', answer: 'Logo, renk paleti, tipografi ve uygulamalardan (tabela, kartvizit, ambalaj, sosyal medya şablonu) oluşan tutarlı bir kimlik sistemi teslim ediyoruz; 2–3 konsept sunup seçtiğiniz yönde sınırsız ince ayar yapıyoruz. Fiyat ₺3.900–9.900.' },
  { keys: ['otomasyon', 'yazılım', 'panel', 'stok takibi', 'teklif takibi', 'bayi', 'excel', 'erp'], service: 'Web Uygulama & Otomasyon', answer: 'Excel\'de takip ettiğiniz işleri tek panelde toplayan özel yazılımlar geliştiriyoruz: teklif takibi, stok, üretim planlama, bayi sipariş portalları ve raporlama. Rol bazlı yetkilendirme ve muhasebe programıyla veri akışı dahil. Fiyat ₺14.900–49.000.' },
  { keys: ['landing', 'kampanya sayfası', 'dönüşüm sayfası'], service: 'Landing Page & Kampanya', answer: 'Reklamla gelen ziyaretçiyi kaybetmeden teklif/araya/satın almaya yönlendiren, dönüşüm odaklı kampanya sayfaları: A/B testi varyasyonu, pikseller ve dönüşüm takibi dahil. Fiyat ₺2.900–7.500, teslim 1–2 hafta.' },
  { keys: ['tarım', 'kooperatif', 'çiftlik', 'tarla', 'ayçiçek', 'üretici'], answer: 'Tarım işletmeleri için doğrudan satış mağazaları, kooperatif portalları, ön sipariş sistemleri ve yerel SEO kuruyoruz. "Trakya ayçiçek yağı" gibi aramalarda ilk sayfaya çıkma ve aracısız satış hedefliyoruz. Tarım çözümleri sayfamızda örnek süreçler var.' },
  { keys: ['sanayi', 'fabrika', 'üretim', 'ihracat', 'osb', 'katalog', 'b2b'], answer: 'Sanayi firmaları için teknik ürün katalogları, çok dilli (TR/EN/DE) siteler, akıllı teklif formları ve B2B portallar hazırlıyoruz; ihracat odaklı SEO da sunuyoruz. Sanayi çözümleri sayfamızda detayları bulabilirsiniz.' },
  { keys: ['otel', 'turizm', 'pansiyon', 'konaklama', 'butik otel', 'rezervasyon'], answer: 'Butik otel ve pansiyonlar için komisyonsuz doğrudan rezervasyon siteleri, çok dilli vitrinler ve yorum yönetimi sunuyoruz. Turizm çözümleri sayfamızda örnek süreç ve fiyatlara göz atabilirsiniz.' },
  { keys: ['restoran', 'lokanta', 'kafe', 'kahvaltı', 'menü', 'sipariş ver', 'yemek'], answer: 'Restoran ve kafeler için dijital menü (QR), komisyonsuz online sipariş ve Google İşletme dönüşümü yapıyoruz. Gıda çözümleri sayfamızda süreci adım adım anlattık.' },
  { keys: ['esnaf', 'dükkân', 'dükkan', 'yerel ticaret', 'mahalle', 'bakkal'], answer: 'Yerel işletmeler için Google İşletme dönüşümü, mini e-ticaret ve semt bazlı reklam çözümlerimiz var. Küçük bütçeyle "yakınımda" aramalarında görünür olma hedefliyoruz. Yerel Ticaret sayfamızdan detaylara ulaşabilirsiniz.' },
  { keys: ['adres', 'nerede', 'ofis', 'tekirdağ', 'konum', 'ulaşım', 'telefon', 'iletişim', 'e-posta adresiniz', 'mail adresiniz'], answer: 'Ofisimiz Tekirdağ\'da; Edirne, Kırklareli ve Tekirdağ\'daki işletmelere yerinde toplantı için de geliyoruz. İletişim sayfamızda tüm bilgiler var — isterseniz hemen bir randevu da oluşturabilirim.' },
  { keys: ['randevu', 'görüşme', 'toplantı', 'ne zaman konuşuruz'], answer: 'Randevu oluşturmak çok kolay: "Randevu oluştur" seçeneğini seçin, uygun gün ve saati belirleyin, bilgilerinizi bırakın — ekibimiz onaylamak için sizi arar.' },
  { keys: ['çok dilli', 'ingilizce', 'almanca', 'dil seçeneği', 'yabancı'], answer: 'Tüm sitelerimize TR/EN/DE çok dilli yapı kurabiliyoruz; ihracat yapan firmalar için Almanca/İngilizce içerik üretimi de sağlıyoruz. Hedef pazarınıza göre dil setini birlikte belirleriz.' },
  { keys: ['domain', 'hosting', 'alan adı', 'sunucu', 'site nerede durur', 'e-posta hesabı', 'kurumsal mail'], answer: 'Domain, hosting ve kurumsal e-posta kurulumunu biz yaparız: ilk yıl domain ve hosting ücreti projeye dahildir. Sunucular yurtiçi lokasyonlu ve yedekli; siteniz kimsenin elinde rehin kalmaz — tüm erişimleri size teslim ederiz.' },
  { keys: ['kvkk', 'güvenlik', 'ssl', 'veri koruma', 'çerez', 'hack', 'saldırı', 'kişisel veri'], answer: 'Tüm projelerde SSL sertifikası, KVKK uyumlu form ve çerez metni standarttır; form verileri şifreli iletilir ve sadece sizin yetkilendirdiğiniz kişiler erişir. E-ticaret projelerinde ödeme sayfaları PCI-DSS uyumlu sanal POS altyapısıyla çalışır.' },
  { keys: ['süreç', 'nasıl çalışıyorsunuz', 'aşama', 'nasıl ilerliyor', 'brief', 'tasarım onayı', 'ne yapıyorsunuz adım'], answer: 'Süreç 5 adımdır: (1) ücretsiz keşif görüşmesi, (2) ihtiyaç ve kapsamın netleştiği teklif, (3) tasarım ve onay, (4) geliştirme ve haftalık ilerleme bildirimi, (5) test, yayına alma ve 1 ay ücretsiz destek. Her adımda neyi neden yaptığımızı şeffafçe anlatıyoruz.' },
  { keys: ['panel', 'içerik güncelle', 'kendi güncelley', 'eğitim', 'yönetim paneli', 'admin paneli', 'ürün ekley'], answer: 'Her site, kod bilmeden içerik, ürün, fiyat ve görsel güncelleyebileceğiniz bir yönetim paneliyle teslim edilir; video anlatımlı kısa eğitim de veriyoruz. Panelden yapmak istemediklarınız için bakım paketimizle biz de üstlenebiliriz.' },
  { keys: ['mevcut sitemi', 'devral', 'başka firmadan', 'site taşı', 'eski sitem', 'yarım kalan proje'], answer: 'Başka firmada yapılmış ya da yarım kalmış projeleri devralabiliriz: önce ücretsiz durum tespiti yapıp neyin kullanılabilir neyin yenilenmesi gerektiğini raporlarız. Erişimler sizde kaldığı için rehin sorunu yaşamazsınız.' },
  { keys: ['neden siz', 'farkınız', 'rakam', 'kim daha iyi', 'avantaj', 'diğer ajanslardan'], answer: 'Trakya\'ya odaklanıyoruz: yerinde toplantı, aynı gün dönüş, sadece site değil satış artışı hedefli çalışıyoruz. Tüm fiyatlar şeffaf, süreler sözleşmeli ve her proje ölçülebilir sonuçlarla raporlanıyor. Portföy sayfamızdaki sonuçlar bunun kanıtı.' },
  { keys: ['içerik yaz', 'metin', 'fotoğraf', 'ürün fotoğraf', 'ürün çekimi', 'görsel hazırlanır'], answer: 'İçerik üretimini de üstleniyoruz: ürün/hizmet metinleri, sektör blog yazıları ve gerekirse yerinde ürün çekimi. Elinizdeki malzemelerle başlayıp eksikleri biz tamamlarız — "boş site" teslim etmeyiz.' },
  { keys: ['olgunluk testi', 'olgunluk', 'dijital olgunluk', 'kendimi test', 'test yap', 'dijitalde neredeyim'], answer: 'Dijital Olgunluk Testi işletmenizin dijitalde nerede olduğunu 2 dakikada ölçer: web, sosyal medya, SEO ve satış kanallarınızı puanlar, zayıf halkayı gösterir. Sonuca göre hangi hizmete ihtiyacınız olduğunu da söyleriz — /olgunluk-testi adresinden hemen deneyebilirsiniz.' },
  { keys: ['rakip radar', 'rakip analizi', 'rekabet analizi', 'rakibim kim', 'rakiplerimi'], answer: 'Rakip Radar, sizin sektörünüz ve ilçenizdeki rakiplerin dijital hamlelerini tarar: kim hangi hizmete yatırım yapmış, kim Google\'da öne çıkmış, sizin boş bıraktığınız alan neresi. /rakip-radar adresinden ücretsiz başlatılabilir; detaylı analiz için ekibimiz rapor çıkarır.' },
  { keys: ['dijital harita', 'harita skoru', 'ilçe skoru', 'trakya haritası'], answer: 'Dijital Harita, Trakya\'nın tüm ilçelerini dijital olgunluk skoruna göre renklendirir: Edirne merkezi mi önde, Çorlu mu, Keşan mı? Bölgenizin skorunu görünce sizin için en yüksek getirili dijital hamleyi birlikte belirleyebiliriz — /dijital-harita adresinde.' },
  { keys: ['trakya endeksi', 'endeks', 'bölge raporu', 'bölgesel veri'], answer: 'Trakya Endeksi, bölgenin dijitalleşme seyrini ay ay takip eder: hangi sektör dijitale yöneliyor, hangi ilçe hızlanıyor, nerede fırsat var. /trakya-endeks adresinden güncel tabloya bakabilirsiniz.' },
  { keys: ['ücretsiz araç', 'bedava', 'seo analizi', 'seo tarama', 'site analizi', 'sitemi analiz', 'araçlar'], answer: 'Ücretsiz araçlarımızı kullanabilirsiniz: SEO Taraması sitenizi 30 saniyede kritere göre puanlar, Olgunluk Testi dijital olgunluğunuzu ölçer, Rakip Radar rakiplerinizi tarar. Sol alttaki "Ücretsiz Araçlar" düğmesinden hepsine ulaşabilirsiniz — hiçbir ücret ya da kayıt yok.' },
  { keys: ['blog', 'yazı', 'makale', 'rehber oku', 'bilgi edinmek'], answer: 'Blog sayfamızda Trakya işletmelerine özel rehberler var: "Web sitesi fiyatları 2026", "Google İşletme Profili kurulumu", e-ticaret başlangıç rehberleri ve sektör analizleri. /blog adresinden okuyabilir, yazılara yorum da bırakabilirsiniz.' },
  { keys: ['market', 'tema', 'temalar', 'nfc', 'hazır ürün', 'vitrin'], answer: 'Markette yayında olan hazır ürünler var: ön yüz temaları, NFC işletme kartları, başlangıç paketleri ve eklentiler — tek tıkla sepete eklenir, ödeme linki iyzico üzerinden iletilir. /market adresinden gezebilirsin; hangi ürünü merak ediyorsan adını yaz, fiyatını hemen söyleyeyim.' },
  { keys: ['kampanya', 'indirim kodu', 'kupon', 'kampanyalar', 'hoş geldin indirimi'], answer: 'Aktif kampanyaların kodlarını market vitrininde ve sepet adımında görebilirsin: kodu sepetteki indirim alanına yazdığında toplam anında düşer. Hangi kampanyayı merak ediyorsan sor, güncel kod ve oranı söyleyeyim.' },
  { keys: ['portal', 'müşteri paneli', 'musteri paneli', 'giriş yap', 'projemi takip', 'teklifim nerede', 'kayıt ol'], answer: 'Müşteri Portalı, bizimle çalıştığınız sırada her şeyi tek ekranda gösterir: projenizin ilerleme yüzdesi, son durum raporu, teklifiniz, soru-cevap ve randevunuz. Kayıt olup girdiğinizde teklifiniz otomatik olarak panelinize düşer — /portal adresinden erişebilirsiniz.' },
  { keys: ['simülasyon', 'simülatör', 'proje simülasyon', 'önizleme', 'proje nasıl görünür'], answer: 'Proje Simülatörü ile siteniz yayına girmeden önce dijital maketini gezer, renk ve bölümleri denersiniz; böylece geliştirmeye geçmeden önce sonuç zihnen netleşir. /simulasyon adresinden deneyebilirsiniz.' },
  { keys: ['rakip ajans', 'bölgedeki ajans', 'edirne ajans', 'çorlu ajans', 'trakya ajans', 'm8', 'turuncumavi', 'koozmo', 'ajansları kim'], answer: 'Bölgedeki ana rakipler: M8 Dijital (Edirne — sosyal medya ve prodüksiyon odaklı), Turuncumavi (Çorlu — paket fiyatlı kurumsal site), Ajans.io ve Renkli Kalem (konum SEO sayfaları), Koozmo Medya (reklam ağırlıklı). Ancak DijiBot asistanı, müşteri portalı, proje simülatörü ve şeffaf fiyat aralıkları gibi kombinasyonu bölgede yalnız biz sunuyoruz. Güncel karşılaştırma /rakip-radar adresindeki Trakya Ajans Radarı\'nda.' },
];

// lowercase + strip punctuation + fold Turkish diacritics, so "fıyat", "web sıtesı"
// and other misspellings still match ("fiyat", "web sitesi")
const norm = (text) =>
  text
    .toLocaleLowerCase('tr-TR')
    .replace(/[.,!?;:()"'']/g, ' ')
    .replace(/[ıİ]/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/â/g, 'a');

/**
 * Score-based answer matching: longer keyword hits weigh more, so specific
 * questions beat generic ones. Returns the answer plus a suggested service
 * (catalog title) for the "X için teklif al" quick action.
 */
// 📊 sektör bazlı mini rekabet analizi — kural tabanlı, AI gerektirmez
const SECTOR_INSIGHTS = [
  { keys: ['tarım', 'çiftç', 'üretici', 'kooperatif', 'ayçiçek'], insight: 'Trakya\'da üreticiler doğrudan satışa geçiş yaptı: ön siparişli mağaza + "soğuk sıkım ayçiçek yağı" tarzı yerel SEO ile aracısız satan onlarca işletme var. Ürününüzü site + Google İşletme + WhatsApp üçlüsüyle ilk sayfaya taşıyabilirsiniz.' },
  { keys: ['sanayi', 'fabrika', 'osb', 'üretim', 'ihracat'], insight: 'OSB\'lerdeki firmalar teknik katalog + çok dilli siteye geçti; ihracat sorularının çoğu artık Google\'da İngilizce/Almanca aranıyor. TR/EN/DE katalog siteleri rakiplerinize 2-3 ay önde başlık kazandırıyor.' },
  { keys: ['restoran', 'kafe', 'lokanta', 'yemek', 'kahvaltı', 'menü'], insight: 'Bölgedeki kafe ve restoranlarda QR menü + Google yorum toplama kombinasyonu telefon trafiğini ortalama %35 artırıyor; komisyonsuz online sipariş de hızla yayılıyor — kurye platformuna ödediğiniz komisyonu kendi kanalınıza çevirebilirsiniz.' },
  { keys: ['otel', 'turizm', 'pansiyon', 'konaklama', 'rezervasyon'], insight: 'Butik otellerde komisyonsuz doğrudan rezervasyon + çok dilli vitrin standart oluyor; OTA komisyonundan kaçan oteller bu bütçeyi Google & Meta reklamlarına kaydırıp doğrudan rezervasyonu büyütüyor.' },
  { keys: ['esnaf', 'dükk', 'bakkal', 'yerel ticaret', 'mahalle'], insight: 'Semt işletmelerinde "yakınımda" aramaları belirleyici: Google İşletme profilini tamamlayan ve haftada 2 gönderi paylaşan işletmeler haritada 2-3 sıra yukarı çıkıyor. Mini e-ticaret ile semt teslimatı da ekleyebilirsiniz.' },
];

export function answerContext(text) {
  const t = norm(text);
  let best = null;
  let bestScore = 0;
  for (const f of faq) {
    const score = f.keys.reduce((acc, k) => acc + (t.includes(norm(k)) ? k.length + 4 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = f;
    }
  }
  // rakip/rekabet sorularında sektör analizini cevaba ekler
  let insight = null;
  if (/rakip|rekabet|analiz|geride|pazar pay/.test(t)) {
    const si = SECTOR_INSIGHTS.find((s) => s.keys.some((k) => t.includes(norm(k))));
    if (si) insight = si.insight;
  }
  if (!best) {
    if (insight) return { text: `📊 Sektör analizi: ${insight}`, quoteService: null, matched: true, testimonials: false };
    return { text: FALLBACK, quoteService: null, matched: false, testimonials: false };
  }
  return {
    text: best.answer + (insight ? `\n\n📊 Sektör analizi: ${insight}` : ''),
    quoteService: best.service || null,
    matched: true,
    testimonials: !!best.testi,
  };
}

export function findAnswer(text) {
  return answerContext(text).text;
}

const fmt = (n) => `₺${n.toLocaleString('tr-TR')}`;

export function estimateFor(serviceTitle) {
  const s = serviceCatalog.find((x) => x.title === serviceTitle) || services.find((x) => x.title === serviceTitle);
  if (!s) return 'projeye göre belirlenir';
  return `${fmt(s.price[0])} – ${fmt(s.price[1])}${s.monthly ? ' / ay' : ''}`;
}