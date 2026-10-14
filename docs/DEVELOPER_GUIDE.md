# Dijitrak — Geliştirici Dokümanı

> Trakya bölgesindeki işletmeler için web tasarım, e-ticaret ve SEO odaklı dijital dönüşüm platformu.
> Yayın adresi: https://trakya-digital-core.base44.app
> Son güncelleme: 15 Ekim 2026

---

## 1. Genel Mimari

| Katman | Teknoloji |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS, JavaScript (JSX) |
| UI Kit | shadcn/ui (`@/components/ui/*`), lucide-react ikonlar |
| Animasyon | framer-motion, canvas-confetti (başarı kutlaması) |
| Veri | Base44 entities (MongoDB benzeri, JSON şemalı) + canlı `subscribe()` güncellemeleri |
| Auth | Base44 yerleşik kimlik doğrulama (e-posta/şifre + Google OAuth + OTP) |
| Backend | Base44 functions — `base44/functions/{ad}/entry.ts` (Deno çalışma zamanı) |
| AI | Uygulamanın **kendi** `OPENAI_API_KEY` anahtarı (`base44/shared/openai.ts`, `gpt-4o-mini`) — Base44 entegrasyon kredisi harcamaz |
| Ödeme | iyzico — **manuel link modeli**: admin iyzico panelinden link üretir, `OrderManager` siparişe yapıştırıp WhatsApp/e-posta ile gönderir (otomatik checkout bilinçli olarak kaldırıldı) |
| WhatsApp | Meta Cloud API — webhook (`whatsappWebhook`) + doğrudan gönderim (`shared/whatsapp.ts`) |
| Depolama | Cloudflare R2, S3 uyumlu presign yükleme/indirme (`r2Storage` + `src/lib/uploadClient.js`) |
| Grafik | Recharts (admin dashboard) |
| PDF | jsPDF (`src/lib/quotePdf.js` — kurumsal teklif/proforma üretimi) |
| Marka | Logo, metinler ve iletişim "Dijitrak" — tek kaynak `src/lib/contact.js` + bileşenler |

### Dizin yapısı

```
src/
  pages/            → rotalanmış sayfalar (App.jsx'e bağlanır)
  components/
    site/           → genel site parçaları (Navbar, Footer, Hero, CookieBanner…)
    assistant/      → DijiBot sohbet akışı (panel, form, paket kartı, QuoteSteps…)
    admin/          → yönetim paneli bileşenleri (layout, tablolar, yöneticiler, NotificationCenter)
    market/         → market vitrini, PurchaseCard, MobileBuyBar, DevicePreview, CartDialog
    market/frames/  → cihaz önizleme çerçeveleri (Phone/Tablet/Laptop + PreviewViewport)
    mascot/         → DijiBot robot maskotu (SVG, duygu durumlu) + MascotCompanion
    blog/ sector/ demo/ radar/ map/ tools/ maturity/ → içerik ve araç bileşenleri
    portal/         → müşteri portalı bileşenleri (overview, projects, quotes, files…)
    ui/             → shadcn/ui temel bileşenler
  lib/              → i18n, context'ler (Assistant, Language, Auth, Cart, Favorites), quotePdf, packageBuilder, uploadClient (R2 yükleme), inviteLink (magic link), visitorInfo
  hooks/            → useDistrictScores, useMarketItem, useSiteSettings, useClock…
base44/
  entities/         → veri modelleri (JSONC şema + RLS)
  functions/        → backend fonksiyonları
  shared/           → ortak modüller (dijibotPrompt, dijibotKnowledge, domainAvailability, whatsapp, customerService, orderNotify, orderFulfillment, iyzico, marketKB, openai)
  agents/           → (boş — WhatsApp ajanı `whatsappWebhook` fonksiyonuyla yürütülür, ayrı ajan dosyası yok)
```

---

## 2. Rota Haritası (`src/App.jsx`)

### Site (SiteLayout içinde, herkese açık)
| Rota | Sayfa |
|---|---|
| `/` | Home (Hero + hizmetler + market teaser + portfolyo + araçlar + CTA; bölüm aç/kapa SiteSettings'ten) |
| `/hizmetler` · `/hizmet/:slug` · `/hizmet/:slug/:location` | Hizmet kataloğu + detay + ilçe varyantı |
| `/sektor/:slug` | Sektor sayfaları (tarim, sanayi, yerel-ticaret, turizm, gida) |
| `/konum/:slug` | İlçe sayfaları (edirne, tekirdag, kirklareli, corlu…) |
| `/blog` · `/blog/:slug` | Blog listesi + yazı detayı (onaylı yorum sistemi) |
| `/fiyatlandirma` · `/simulasyon` · `/portfolyo` · `/yorumlar` | Ticari dönüşüm sayfaları |
| `/olgunluk-testi` · `/rakip-radar` · `/trakya-endeks` · `/dijital-harita` | Ücretsiz araçlar |
| `/alan-adi-kontrolu` | Alan adı kontrol aracı (domainCheck + sohbete devir) |
| `/site-yenileme` | Eski site tarama/yenileme aracı (siteAgeCheck) |
| `/temalar` | `/market?kat=tema`'ya yönlendirme |
| `/market` · `/market/:slug` | Market vitrini + ThemeForest tarzı detay sayfası |
| `/preview/:slug` | Market ürünü canlı cihaz önizlemesi (mobil/tablet/masaüstü) |
| `/demo/:themeKey` | Tema demo sayfaları (demoThemes.js'ten) |
| `/teknoloji` · `/is-surecleri` · `/sss` · `/hakkimizda` | Kurumsal |
| `/iletisim` | İletişim formu (Lead kaydı + bildirim tetikler) |
| `/gizlilik` · `/kullanim-sartlari` | KVKK / hukuki |
| `/teklif/:leadId?token=` | DijiBot'un ürettiği paylaşılan teklif sayfası (token gate'li) |
| `/teklif-onayi/:token` | Adminin hazırladığı özel teklif onay sayfası (kabul → otomatik sipariş) |
| `/odeme` | Market ödeme/sipariş ekranı (sepet → Lead + Order) |
| `/odeme-tamam` | iyzico ödeme sonuç sayfası (`?durum=basarili/basarisiz`) |

### Yetkili bölge (`ProtectedRoute` altında)
| Rota | İçerik |
|---|---|
| `/admin`, `/admin/talepler`, `/admin/crm`, `/admin/icerik/:tab`, `/admin/musteriler`, `/admin/whatsapp`, `/admin/ayarlar` | AdminLayout ile korunan yönetim paneli (menü grupları: Operasyon / İçerik / Pazar Yeri / İletişim) |
| `/portal`, `/musteri-portali` | Müşteri portalı (RLS ile e-posta eşleşmesi) |

Auth rotaları: `/login`, `/register`, `/forgot-password`, `/reset-password` (platform demirbaşları — asla silmeyin/paralel sürüm yazmayın). Kayıt herkese açık değildir: hesap erişimi yalnızca admin davetiyle açılır (`inviteUser` veya MagicLink `?mtoken=` davet linki).

---

## 3. Veri Modeli (`base44/entities/*.jsonc`)

Her kayıtta hazır alanlar: `id`, `created_date`, `updated_date`, `created_by_id` (şemaya yazılmaz).

| Entity | Amaç | Kritik alanlar | RLS özeti |
|---|---|---|---|
| **Lead** | Tüm potansiyel müşteri kayıtları (teklif/randevu/soru/market siparişi) | `type`, `service`, `package_summary` + `package_data` (JSON string → teklif sayfası + PDF), `quote_no` (**kalıcı** DJT-PKG-… numarası — PDF'te ve CRM aramasında; rastgele üretimden bu alana taşındı), `quote_token` (teklif paylaşım anahtarı), `quote_open_count` + `quote_last_open_at` (müşterinin teklif açılma takibi — `quoteOpened` fonksiyonu yazar), `session_id` (DJB-XXXXXX web↔WhatsApp köprüsü), `ip_address`, `device_info`, `referral` (?ref= veya 'market'/'whatsapp'), `status` (new→contacted→won/lost) | Okuma: e-posta eşleşmesi **veya** admin; yazma: admin |
| **ClientProject** | Müşteri portalındaki proje durumu | `client_email`, `status` (planned→in_progress→review→launched), `progress`, `report`, `theme_id`/`theme_name` (portaldan seçilen tema) | E-posta eşleşmesi veya admin |
| **RevisionRequest** | Portal revizyon talepleri | `project_id`, `client_email`, `text`, `status` (open→resolved) | Oluşturma: kendi e-postası; okuma: eşleşme/admin |
| **ProjectFile** | Portal teslim dosyaları | `project_id`, `client_email`, `file_uri` (UploadPrivateFile sonucu — indirmede imzalı URL) | E-posta eşleşmesi veya admin; dosya yoksa bile satır görünür |
| **ClientMessage** | Portal soru-cevap | `client_email`, `answer` (boşsa yanıt bekliyor) | Oluşturma: kendi e-postası; okuma: eşleşme/admin |
| **Subscription** | Müşteri abonelikleri (bakım/ajans hizmeti) | `client_email`, `item_title`, `monthly_price`, `months`, `start/end_date`, `status` (active/cancelled) | Okuma: eşleşme/admin; yazma: admin |
| **MarketItem** | Market ürünleri (tema, paket, NFC kart, eklenti) | `slug`, `category`, `billing` (one_time/monthly), `preview_url` (önizleme adresi), `color` (kart şeridi), `status` (draft/published — yalnızca published vitrinde) | Okuma herkese; yazma admin |
| **SiteSettings** | Anasayfa bölüm aç/kapa anahtarları | `market_enabled` (kapalıyken market + teaser gizlenir), `show_*` alanları | Okuma herkese; yazma admin |
| **BlogPost / BlogComment** | Blog yazıları ve onaylı yorumlar | `slug`, `content` (`## başlık`), `meta_*`, `status` | Yazı okuma herkese; yorumlar approved/admin |
| **PortfolioProject / Testimonial** | Portfolyo ve referanslar | `status` (draft/published), `color` | Okuma herkese; yazma admin |
| **DistrictScore** | Dijital harita ilçe skorları | `slug` (harita düğüm adlarıyla eşleşir), `score` (0-100) | Okuma herkese; yazma admin |
| **Order** | Market siparişleri | `items` (JSON), `total`, `discount_code/amount`, `payment_status` (unpaid/paid), `payment_link` (iyzico), `iyzico_token`, `lead_id`, `status` (new→approved→in_progress→delivered/cancelled) | Oluşturma herkese; okuma kendi/admin; yazma admin |
| **CustomQuote** | Adminin hazırladığı kişiye özel teklif | `items`, `total`, `token` (`/teklif-onayi/:token`), `valid_until`, `status` (draft→sent→accepted/rejected) | Okuma herkese (token sayfası); yazma admin |
| **DiscountCode** | Sepet indirim kodları | `code`, `discount_type/value`, `status` (active/passive) | Okuma herkese; yazma admin |
| **Bundle** | Market bundle paketleri (tek ürün gibi satılır) | `item_ids` (virgüllü), `price` (indirimli paket fiyatı), `badge`, `status` | Okuma herkese; yazma admin |
| **Campaign** | Vitrin kampanyaları | `code` (sepet kodu), `discount_type/value`, `valid_until`, `status` | Okuma herkese; yazma admin |
| **ClientPhone** | WhatsApp numarası ↔ müşteri eşleşmesi | `phone` (905xx… normalize), `client_email` | Yalnızca admin |
| **MagicLink** | Tek kullanımlık giriş daveti | `token`, `email`, `password`, `used`, `expires_at` (14 gün) | Yalnızca admin |
| **Client** | CRM müşteri kartı (AdminClients) | `business_name`, `contact_name`, `email` (portal girişiyle eşleşir), `phone`, `sector`, `note` | Yalnızca admin |
| **DemoTheme** | `/demo/:key` tema önizlemeleri (ThemeDemoPage) | `key` (demo adres anahtarı), `brand`, `data` (JSON — palet, menü, hero, özellikler) | Okuma herkese; yazma admin |
| **User** (yerleşik) | Kullanıcılar — `role` alanı özelleştirildi | `role` (admin/user) | Şemayla asla oluşturulmaz — davetle girer |

> `image_url` alanları yönetim panelindeki `ImageUpload` bileşeniyle doldurulur. Büyük içerik (base64/PDF/blob) **asla** entity alanına yazılmaz — dosyalar Cloudflare R2'ye `uploadClient.js` ile yüklenir (`r2://bucket/key` döner), indirme `signFileUri()` üzerinden imzalı URL'le açılır (`r2://` → `r2Storage.presign_get`, eski Base44 URI'leri → `CreateFileSignedUrl`). Base44 `UploadPrivateFile` entegrasyon kredisi harcadığı için devre dışıdır.

---

## 4. DijiBot (AI Asistan) Akışı

Mimari üç parçalı, hepsi Türkçe/İngilizce (tr/en) çift dilli:

1. **`src/lib/AssistantContext.jsx`** — panel aç/kapa durumu + `pending` (bir sayfadan asistana "önceden tanımlı niyet" aktarımı: metin, hizmet veya sektor). Panel açılışları analytics'e izlenir.
2. **`src/components/assistant/useAssistantFlow.js`** — asıl konuşma durum makinesi:
   - Menü/niyet seçimi → teklif adımları (`QuoteSteps`: hizmet, sektor, form)
   - Serbest metin: `detectNeeds.js` niyet çıkarımı (hizmet/sektör/teklif isteği) — "butik otelim için web sitesi paketi istiyorum" gibi cümleler doğrudan paket akışına düşer
   - Soru-cevap: önce `assistantKnowledge.js` bilgi bankası; sonra `aiAnswer` fonksiyonuyla AI cevap — AI uygulamanın KENDİ `OPENAI_API_KEY`'iyle (`shared/openai.ts`, `gpt-4o-mini`) çalışır, Base44 entegrasyon kredisi harcamaz; market ürün/kampanya bilgisi `marketKnowledge.js`'ten bağlam olarak eklenir
   - **Her teklif akışı mutlaka paket üretir** (`packageBuilder.js`) — böylece form sonrası teklif sayfası + PDF her zaman oluşur; `aiPackageNote` notu kişiselleştirir (kredi yoksa kural tabanlı not aynen kalır, akış kopmaz)
   - Referans niyeti: sohbete gerçek `Testimonial` kartları eklenir
   - Alan adı önerisi: `domainSuggest` → adaylar sohbette sunulur, hepsi kayıt defterinde doğrulanmış; seçilen ad "Beğenilen alan adı" olarak paket akışına taşınır
   - Ekran görüntüsü incelemesi: `uploadClient.js` (Cloudflare R2 presign yükleme) → imzalı URL → `aiScreenshotReview`
   - Lead gönderimi: `Lead.create` + analytics + `leadNotify` (admin e-postası) + `quoteLink` (teklif sayfası URL'i, `window.location.origin` bazlı — önizleme/özel alan adında da çalışır)
   - Sohbet geçmişi **localStorage**'da (`dijibot-session-v2`); bozuk/eski biçimli oturumlar doğrulanıp reddedilir; yarım kalan formda dönüşte tek seferlik hatırlatma
   - Ziyaretçi künyesi: `visitorInfo.js` — oturum kodu (DJB-XXXXXX), IP, cihaz bilgisi Lead'e yazılır
3. **Görsel katman** — `AssistantPanel` (Sheet), `ChatMessage` (bot/kart/form ayırımı), `ChatInput` (metin + ses `TranscribeAudio` + ekran görüntüsü), `RobotMascot` (duygu durumları) + `MascotCompanion` (her sayfada yüzen maskot).

### PDF çıktısı (`src/lib/quotePdf.js`)
- `downloadQuotePdf(lead)` — hızlı teklif özeti (admin LeadDetailDialog + portal PortalQuotes)
- `downloadPackagePdf(pkg, info)` — DijiBot paketi için kalem kalem, çok sayfalı **proforma** (PackageCard + QuotePage + portal)
- Kurumsal tasarım: koyu mast head, numaralı bölümler, DejaVu Sans (CDN'den, Türkçe + ₺) — yüklenemezse `trToAscii` fallback'i
- Dikkat: jsPDF renk çağrıları `setTextColor(...ARRAY)` şeklinde **yayılmalı**; diziyi tek argüman geçmek "Invalid argument passed to jsPDF.f3" çökertir

### Teklif sayfası zinciri
Sohbette paket kurulur → form gönderilir → Lead'e `package_data` + `quote_token` yazılır → `/teklif/:leadId?token=` sayfası herkese açık paylaşılabilir → sayfadan PDF indirilir. `quoteLink` fonksiyonu token'sız çağrıda yalnızca oturumlu kullanıcıyı **veya** `package_data` dolu lead'i kabul eder.

### Koçluk planı ve yedek yanıt
- Yanıt üretimi kredi kesintisi/timeout durumunda `src/lib/coachPlan.js`'teki kural tabanlı `coachPlanFallback` devreye girer — teşhis cümlesi + mini eylem planı + tek net sonraki adım; akış asla kilitlenmez.
- Ton kuralları: broşür dili, robotik söylem ("bip bup") ve aşırı nezaret yok; her yanıt bir öncekine atıf yapar, flavor satırları her üç mesajda bir kez seyreltilir.

### Persona
`src/lib/dijiBotPersona.js` (flavor satırları) + `base44/shared/dijibotPrompt.ts` (sistem promptu) — Değişiklikleri iki yerde senkron tutun.

### WhatsApp kanalı (`base44/functions/whatsappWebhook`)
DijiBot, işletmenin KENDİ WhatsApp Business numarasından Meta Cloud API **webhook** üzerinden çalışır:
- **GET**: Meta doğrulaması — `hub.verify_token` = `WHATSAPP_VERIFY_TOKEN` secret'ıyla birebir eşleşmelidir; Meta panelindeki webhook adresi `https://trakya-digital-core.base44.app/functions/whatsappWebhook`, abone alan **messages** olmalıdır.
- **POST**: Meta'ya hemen 200 döner, mesaj `waitUntil` ile arka planda işlenir. CRM yazımları **ISO zaman damgalı** ve **attempt-retry yarış korumasıyla** yapılır — kronolojik bozulma önlenir.
- **Akış**: gelen mesaj → CRM'de `Lead` (telefonla eşleşir, yoksa yeni; `referral: 'whatsapp'`; mesaj id `#wamid…` ile dedup) → AI cevap → `sendWhatsAppText`. Desteklenen türler: metin, buton/liste yanıtı, görsel (vision), sesli not (transcribe), belge/video açıklaması; ilk temasta karşılama + hızlı butonlar gönderilir.
- **Yönlendirme**: numara `ClientPhone` tablosunda bir müşteri e-postasına eşleşiyorsa **müşteri hizmetleri** akışı (`shared/customerService.ts` — proje durumu, revizyon, abonelik, destek); eşleşmiyorsa satış asistanı (DijiBot).
- **Ürün bilgisi canlı**: `shared/marketKB.ts` → `loadMarketBrief()` published `MarketItem` + `Campaign` kayıtlarını prompt'a ekler (web sohbeti frontend kopyasıyla aynı bilgi kaynağını paylaşmaz; ikisi de güncel tutulmalı).
- **24 saat penceresi**: serbest yazışma penceresi kapanınca tek yol Meta onaylı şablonlar — `whatsappTemplate` fonksiyonu (AdminWhatsapp panelinden gönderilir, CRM sohbet kaydına düşer).
- **Randevu**: `appointmentSlots` — `date` (YYYY-MM-DD) ile doluluk sorgusu; 09:00–11:00 & 13:00–16:00. Saat listesi `LeadCaptureForm.jsx`'teki `TIMES` sabitiyle senkron tutulmalı.
- **Portal daveti**: e-posta alınınca `createVisitorUser` ile kullanıcı daveti.

### Sohbet görsel dili
- "Oyunbaz sticker" estetiği: kalın gölge (`shadow-sticker`), net kenarlıklar, yumuşak yay animasyonları
- Bot ve kullanıcı mesajları keskin ayrıştırılır; aşırı neon/glow yok (kullanıcı tercihi)
- Bot kart renkleri: `mint`, `coral`, `sun` (canlı/doygun tonlar)

---

## 5. Backend Fonksiyonları (`base44/functions/*/entry.ts`)

| Fonksiyon | Görev | Tetiklenme |
|---|---|---|
| `aiAnswer` | DijiBot'un serbest soru cevapları | Asistan akışı (kredi harcar) |
| `aiScreenshotReview` | Ekran görüntüsü incelemesi (SEO/UX) | ChatInput'tan yüklenen görsel |
| `aiLeadSummary` | Lead özetleme (admin) | AdminLeads detayında |
| `aiBlogDraft` | Blog taslağı üretimi | AdminContent |
| `aiPackageNote` | Paket notu + pitch kişiselleştirme | Paket kurulum akışı |
| `appointmentSlots` | Randevu doluluk kontrolü (dolu saatleri döner) | Asistan randevu adımı + DijiBot WhatsApp ajanı |
| `leadNotify` | Yeni Lead → admin'e HTML e-posta | Lead.create sonrası (15 dk tazelik koruması) |
| `portalNotify` | Portal olayları → admin bildirimi/e-postası | `question_created`, `revision_created`, `revision_resolved`, `file_added`, `subscription_created` |
| `quoteLink` | Teklif sayfası linki üretimi / token'la veri dönüşü | Sohbet formu + admin LeadDetailDialog + QuotePage |
| `quoteOpened` | Teklif açılma sayacı — `lead_id` + `token` doğrular, `quote_open_count` +1 ve `quote_last_open_at` yazar | QuotePage (oturum başına bir kez, sessionStorage gate'li; hata sessizce yutulur) |
| `domainCheck` | Alan adı müsaitlik sorgusu (DNS kanıtlı) | Alan adı aracı + WhatsApp ajanı |
| `domainSuggest` | AI destekli alan adı önerisi (kayıt defterinde doğrulanmış) | Alan adı aracı → sohbet akışı |
| `siteAgeCheck` | Eski site taraması (yaş, teknoloji, SEO) | `/site-yenileme` aracı |
| `createVisitorUser` | Sohbette alınan e-postaya portal daveti (`inviteUser`) | DijiBot WhatsApp kanalı |
| `selectProjectTheme` | Müşterinin portalda seçtiği temayı ClientProject'e yazar | ThemePicker |
| `instagramFeed` | Instagram Business son gönderileri (connector üzerinden Graph API) | Ana sayfa vitrini |
| `sendNewsletter` | Bülten toplu gönderimi | AdminContent → NewsletterManager |
| `sitemap` | Dinamik sitemap üretimi | SEO |
| `whatsappWebhook` | Meta Cloud API webhook — DijiBot gelen mesajları CRM + AI akışıyla yanıtlar | Meta sunucusu (GET doğrulama + POST mesaj) |
| `whatsappTemplate` | Meta onaylı şablon mesaj gönderimi (CRM sohbet kaydına düşer) | AdminWhatsapp paneli |
| `orderNotify` | Sipariş durum bildirimi (WhatsApp + e-posta); `status: 'link_sent'` = ödeme linki + bilgilendirme | OrderManager durum seçimi / "Linki gönder" |
| `orderPaid` | Ödemeyi onaylar: `paid` + `fulfillOrder` (abonelik/proje başlatma) + müşteri bildirimi | OrderManager "Ödemeyi onayla" |
| `customQuoteRespond` | Özel teklif kabul/red; kabulde mükerrer kontrollü otomatik `Order` üretimi | CustomQuotePage (token'la anonim) |
| `magicLink` | Tek kullanımlık giriş daveti — `create` (admin) / `redeem` (herkese açık) / `send` (kayıtlı kullanıcıya e-posta) | UsersPanel davet + `/register?mtoken=` |
| `r2Storage` | Cloudflare R2 presign — `presign_put` (yükleme) / `presign_get` (indirme), `r2://` URI | `uploadClient.js` (portal/admin dosyaları) |
| `previewEmbedCheck` | Demo önizleme iframe açılabilirlik kontrolü | MarketPreviewPage |

Kurallar:
- Handler imzası sabit: `export default async function(req): Promise<Response>`; istemci SDK `createClientFromRequest(req)`
- Core entegrasyonları (`InvokeLLM`, `SendEmail`, `TranscribeAudio`…) **yalnızca** backend'de `base44.asServiceRole.integrations.Core.*` ile; `UploadPublicFile`/`UploadPrivateFile`/`CreateFileSignedUrl` istemciden çağrılabilir
- Secrets: `import { secrets } from "base44:runtime"` → `secrets.get("NAME")` (ör. `ADMIN_ALERT_EMAIL`)
- Paylaşılan mantık `base44/shared/`'a — fonksiyonlar arasında kopyalamak yasak (ör. `domainAvailability.ts`)
- Admin-gerektiren fonksiyonlar `base44.auth.me()` + `role === 'admin'` kontrolü yapmalı
- Frontend çağrısı: `await base44.functions.invoke('ad', { param })` → sonuç `response.data`'da; kredi harcayan çağrılar `.catch(() => {})` ile sarılır

---

## 6. Market Modülü

- **Vitrin** (`MarketPage`): kategori filtreli (tema/paket/nfckart/eklenti), yalnızca `published` ürünler; `SiteSettings.market_enabled` kapalıysa teaser + sayfa gizlenir, `/temalar` eski adresi markete yönlendirir.
- **Detay** (`MarketItemPage`): ThemeForest estetiği — solda açıklama, sağda yapışkan fiyat paneli (`PurchaseCard`), üstte görsel önizleme; "Kart Yığını" sticker dili (yamuk rozetler, coral/mint).
- **Önizleme** (`MarketPreviewPage` + `DevicePreview`/frames): iPhone (390×844, Dynamic Island, gerçek saatli durum çubuğu), iPad ve masaüstü çerçeveleri; demo içi kaydırma `overflow-hidden` ile cihaz içine hapsedilir.
- **Satın alma**: `CartContext` sepeti site genelinde taşır; `CartDialog`'da indirim kodu (`DiscountCode`/`Campaign`) uygulanır, bundle'lar tek ürün gibi eklenir → `/odeme` ödeme ekranı. Otomatik iyzico checkout akışı kişiye özel hizmet yapısı nedeniyle bilinçli olarak kaldırıldı — güncel model aşağıda.
- `MobileBuyBar` alıcı çubuğu maskotla çakışmayacak z-index'te; `FavoritesContext` ürün beğenme listesini tutar.
- **DijiBot entegrasyonu**: web sohbeti `marketKnowledge.js`, WhatsApp `shared/marketKB.ts` ile yayınlanmış ürün/kampanyaları okur — bot "fiyat uydurmaz", yalnızca canlı veriyi verir.

### Sipariş ve ödeme akışı (manuel iyzico modeli)
1. Müşteri `/odeme`'den sipariş kurar → `Lead` (referral: `market`) + `Order` (payment_status: `unpaid`) kaydı oluşur; `leadNotify` admin'e gider.
2. Admin `OrderManager`'da iyzico panelinden ürettiği ödeme linkini siparişe yapıştırır → "Linki gönder" (`orderNotify`, `status: 'link_sent'`) WhatsApp + e-posta ile müşteriye ulaşır.
3. Ödeme onayı tek yoldan: yönetici "Ödemeyi onayla" (`orderPaid`) → `paid` + `fulfillOrder`: **aylık ürün → `Subscription`** (1 ay, bugünden itibaren), **tek seferlik → `ClientProject`** (e-posta eşleşiyorsa portala anında düşer) + müşteri bildirimi.
4. **Özel teklifler**: admin `CustomQuote` oluşturur (token üretir) → `/teklif-onayi/:token` sayfası paylaşılır → müşteri kabul ederse `customQuoteRespond` otomatik `Order` açar; ödeme aynı link modeliyle ilerler.
5. Not: Eski otomatik iyzico Checkout Form akışı (iyzicoCheckout/iyzicoCallback) kişinin hizmet yapısına uymadığı için kaldırıldı; `iyzicoCheckout`/`iyzicoCallback` klasörleri boş artık — yeni bir otomatik yapı kurulurken başlangıç noktası alınıp tamamlanmalı.

### Teklif açılma takibi (CRM)
- `/teklif/:leadId?token=` sayfası her açılışında `quoteOpened` tetiklenir — `sessionStorage` (`qview-<leadId>`) gate'i sayesinde aynı oturumda saymaz; çağrı `.catch(() => {})` ile sessizdir.
- CRM'de `LeadTable`'ın **Görüntüleme** sütunu `quote_open_count`'u gösterir; sütun başındaki sayaç admin'e müşterinin ilgisine dair sinyal verir. `quote_no` sütunu da arama/filtrelemeye açıktır.

---

## 7. Dijital Harita (`/dijital-harita`)

- **Veri**: `src/lib/trakyaGeo.js` — OpenStreetMap kaynaklı **gerçek ilçe sınır poligonları** (28 ilçe, öngörülmüş koordinatlar + her izlenen düğüm için `cx/cy` merkezleri). Görsel illüstrasyon değil, kurumsal coğrafi veri.
- **Renklendirme**: `useDistrictScores` hook'u `DistrictScore` entity'sinden skorları okur (veri yoksa statik varsayılan); `scoreColor()` 0–100 skorunu mint/sun/coral skalasına çevirir. Slug'ı olan ve skor kaydı bulunan 10 ilçe tıklanabilir → `/konum/:slug`.
- **Bileşenler**: `TrakyaMap` (SVG choropleth + framer-motion hover + öncü ilçe nabız halkası), `AiRegionInsight` (ilçe skorlarını DijiBot'a `openAssistant` ile aktaran analiz kutusu).
- Yeni ilçe eklerken: poligon + merkez + slug'ı `trakyaGeo.js`'e, skorunu `DistrictScore`'a ve konum sayfası verisini `src/lib/locations.js`'e ekleyin.

## 8. Müşteri Portalı ve Yönetim Paneli

### Portal (`/portal`, e-posta eşleşmeli RLS)
- Genel bakış (aktif proje, abonelik özeti), proje listesi + zaman çizelgesi, **tema seçici** (`selectProjectTheme`), dosyalar (imzalı indirme; dosya yoksa da satır görünür), teklifler (PDF indirilebilir), revizyon talepleri, soru-cevap, abonelikler.
- Tüm portal listeleri `base44.entities.*.subscribe()` ile canlı güncellenir.

### Yönetim (`/admin/*`)
- Dashboard (KPI + grafik + funnel), Talepler (CRM boru hattı + AI özet + PDF), **CRM** (müşteri analiz kartları, KPI, grafikler), İçerik (blog, portfolyo, referans, yorum, bülten, market/bundle/kampanya/indirim kodu yöneticileri + bölüm anahtarları), Müşteriler (proje, dosya, abonelik, soru yönetimi + `ClientSetupWizard`, `ClientPhone` WhatsApp eşleme), **WhatsApp** (webhook durumu, numara eşleme, `whatsappTemplate` şablon gönderimi, `WhatsappInbox` — tüm WhatsApp görüşmeleri panelde kronolojik sohbet görünümü), Siparişler (`OrderManager` — durum, iyzico link gönderimi, ödeme onayı), Ayarlar (SiteSettings + kullanıcılar).
- Özel teklifler: `CustomQuoteManager` — kalem kalem teklif kurulumu, token'lı paylaşım, kabul/red takibi.
- **NotificationCenter**: portal olayları gerçek zamanlı rozetle düşer.
- Kullanıcı yönetimi tamamen manuel: admin davet eder (`inviteUser`), kayıt herkese açık değildir.

---

## 9. Tasarım Sistemi

### Renk jetonları (`src/index.css` :root + `tailwind.config.js`)
| Jeton | Değer (HSL) | Kullanım |
|---|---|---|
| `--background` | 221 41% 12% | Koyu lacivert zemin |
| `--foreground` | 43 100% 94% | Krem metin |
| `--primary` / `--mint` | 150 78% 58% | Aksiyonlar, vurgular |
| `--accent` / `--sun` | 46 100% 62% | Uyarı/enerji vurgusu |
| `--coral` | 12 100% 66% | İkincil vurgu |
| `--terminal` | 222 45% 7% | Terminal/konsol kartları |

### Tipografi
- Başlık/gösterim: **Fredoka** (`font-heading`, `font-display`)
- Gövde: **Plus Jakarta Sans** (`font-body`)
- Mono: **JetBrains Mono** (`font-mono` — durum metinleri, etiketler)

### Kaideler
- Hardcode renk/font yok — her şey token sınıfı (`bg-mint`, `font-display`…). Tailwind literal string purging'e dikkat: `bg-${x}-500` gibi dinamik sınıflar derlemede kaybolur.
- Kaydırma çubukları site genelinde özelleştirilmiş (mint thumb, koyu track); demo/önizleme sayfalarında varsayılan kaydırma çubukları gizlenir.
- Glow/pulse gibi ışıltı efektleri kullanıcı kararıyla kaldırıldı — geri getirmeyin.
- Kart gölgesi: `shadow-sticker` (4px 4px 0).
- İçerik görselleri her zaman `Image` bileşeniyle (`@/components/ui/image`), asla düz `<img>` ile değil.
- Logo bileşeni `React.useId()` ile benzersiz gradyan kimliği üretir — kopyala/yapıştır'ta ID çakışması olmasın.

---

## 10. Secrets ve dış servisler

Tüm gizli anahtarlar Dashboard → Secrets'ta saklanır; kod `import { secrets } from 'base44:runtime'` ile okur. Bir secret **yalnızca kendi servisini** doğrulamak için kullanılır — asla yanıt içinde döndürülmez/loglanmaz.

| Secret | Kullanım |
|---|---|
| `WHATSAPP_ACCESS_TOKEN` · `WHATSAPP_PHONE_NUMBER_ID` | Cloud API mesaj gönderimi, medya indirme (`shared/whatsapp.ts`) |
| `WHATSAPP_VERIFY_TOKEN` | Meta webhook doğrulaması — Meta panelindeki değerle **birebir** aynı olmalı |
| `OPENAI_API_KEY` | Tüm AI çağrıları (`shared/openai.ts`, gpt-4o-mini) — platform kredisi harcamaz |
| `IYZICO_API_KEY` · `IYZICO_SECRET_KEY` | iyzico REST v2 Basic auth; `IYZICO_BASE_URL` opsiyonel (varsayılan sandbox) |
| `CLOUDFLARE_ACCOUNT_ID` · `R2_BUCKET` · `R2_ACCESS_KEY_ID` · `R2_SECRET_ACCESS_KEY` | R2 SigV4 presign (`r2Storage`) |
| `ADMIN_ALERT_EMAIL` | leadNotify / portalNotify admin bildirimleri |

### Kaynak haritası: hangi özellik neyi harcıyor?

Sistemde **dört ayrı kaynak havuzu** var; bir özellik çalışmıyorsa önce hangi havuza dokunduğunu buradan tespit et.

**1) Platform entegrasyon kredileri (Base44 Core) — ŞU AN TÜKENMİŞ, 2026-11-01'de yenilenir.**
Aşağıdaki Core çağrıları her seferinde platform kredisi harcar ve kredi bittiğinde 402 döner. Ayrıca krediler tükendiğinde **backend fonksiyonları çalışmaz** — kredi bağımsız görünen fonksiyonlar bile çağrılamaz; 1 Kasım'da veya plan yükseltmede hepsi kendiliğinden döner (kod tarafında yapılacak bir şey yok).

| Core çağrısı | Harcayan özellikler |
|---|---|
| `InvokeLLM` | Şu an hiçbir yerde kullanılmıyor — tüm AI, kendi OpenAI anahtarından geçer |
| `SendEmail` | leadNotify (form/teklif admin bildirimi) · portalNotify (portal bildirimleri) · orderNotify (sipariş e-postaları) · customQuoteRespond (teklif onay/reddet) · magicLink (sihirli bağlantı gönderimi) · sendNewsletter (bülten) |
| `TranscribeAudio` | whatsappWebhook — müşterinin WhatsApp sesli mesajının metne çevrilmesi |
| `UploadPrivateFile` + `CreateFileSignedUrl` | whatsappWebhook — sesli mesaj dosyasının depolanıp imzalı link üretilmesi |
| `UploadPublicFile` | Kullanılmıyor — tüm yükleme akışları R2'ye taşındı |
| `GenerateImage/Video/Speech`, `ExtractDataFromUploadedFile` | Kullanılmıyor |

**2) Uygulamanın kendi AI anahtarı (`OPENAI_API_KEY`, `shared/openai.ts` → gpt-4o-mini) — platform kredisinden bağımsız.**
Maliyeti doğrudan OpenAI hesabına işler; kredi kesintisinden etkilenmez ama backend fonksiyonları genel olarak kapalıyken tetiklenemez.

| Fonksiyon / modül | İş |
|---|---|
| `aiAnswer` | DijiBot web sohbeti yanıtları |
| `aiPackageNote` | DijiBot paket notu üretimi |
| `aiLeadSummary` | CRM lead özeti |
| `aiBlogDraft` | Blog taslağı üretimi |
| `aiScreenshotReview` | Ekran görüntüsü inceleme (vision) |
| `domainSuggest` | Alan adı önerileri |
| `whatsappWebhook` | WhatsApp mesaj/görsel yanıtları (vision) |
| `shared/customerService.ts` | Portal müşteri sorusu yanıtları |

**3) Kendi anahtarlarımızla dış servisler — krediden bağımsız.**
- **Cloudflare R2** (`r2Storage`): tüm dosya yükleme/indirme presign'ları.
- **WhatsApp Cloud API** (`shared/whatsapp.ts`): mesaj gönderimi, şablonlar, medya (`whatsappWebhook`, `whatsappTemplate`) — kredi harcamaz ama Meta tarafı kesintilerde durur.
- **iyzico** (`IYZICO_API_KEY/SECRET`): manuel ödeme linki modeli.

**4) Krediden bağımsız fonksiyonlar (DB/dış HTTP/DNS).**
`quoteLink` · `quoteOpened` · `appointmentSlots` · `createVisitorUser` · `selectProjectTheme` · `orderPaid` · `sitemap` · `domainCheck` (DNS sorgusu) · `siteAgeCheck` (HTTP) · `previewEmbedCheck` (HTTP) — bunlar harcama yapmaz, yine de kredi kesintisi döneminde platform kuralı gereği tetiklenemez.

**5) Bağlayıcılar (OAuth).** `instagramFeed` Instagram bağlayıcısının kendi token'ı ile çalışır — Core kredisinden ayrıdır.

---

## 11. i18n

- `src/lib/i18n.js`: sayfa metinleri — `t('anahtar')`
- `src/lib/botI18n.js`: asistan metinleri — `BOT_TEXTS[lang]` (yeni anahtar eklerken **her iki dilde** de tanımlı olmalı)
- `useLanguage()` context: `lang` ('tr'/'en'), `toggle()`, `tl()` (kelime sözlüğü)
- Site varsayılanı Türkçe; auth sayfaları dahil tüm görünür metinler çift dilli olmalı
- CRM'e yazılan değerler (hizmet, sektör adları) hep Türkçe kalır; gösterim etiketleri `revService`/`revSector` eşlemeyle çevrilir

---

## 12. SEO & Analitik

### SEO
- `src/hooks/useSeo.js` — sayfa başına title/description/OG yönetimi
- `public/sitemap.xml` + `public/robots.txt` — tüm hizmet, sektor, ilçe kombinasyonları listelenir; yeni sayfa eklerken **sitemap'i de güncelleyin**
- `public/manifest.json` — PWA metadata
- Dinamik SEO sayfaları: hizmet×ilçe (`/hizmet/:slug/:location`) ve ilçe (`/konum/:slug`) rotaları
- og:image henüz bağlanmadı → kredi ilk iş olarak üretilecek

### Analitik
`base44.analytics.track({ eventName, properties })` — takip edilen olaylar:
- `lead_submit` (asistan), `contact_form_submit` (iletişim), `package_pdf_download` (paket kartı), asistan açılışları
- Not: `.track()` çağrılarında `.catch()` zinciri kullanmayın — önceki bir hata analiz akışını kesmişti

---

## 13. Geliştirme Kaideleri (kırmayın!)

1. **Auth platform demirbaşı** — Login/Register/Reset sayfalarını yeniden yazmayın; OTP akışı çok adımlı kalmalı.
2. **`@/` alias** kullanın; göreli `src/` yolları kırılgandır.
3. **ESM** — Vite projesinde `require()`/`module.exports` yok.
4. **Hooks** sadece bileşen tepesinde; koşullu çağrı yok.
5. `src/App.jsx`'i wholesale değil, **find/replace ile** düzenleyin; `<Routes>` içine yalnız `<Route>` girer; layout route'lar `<Outlet />` render etmeli.
6. Entity işlemleri `base44.entities.*` SDK'sından; toplu işlem için `bulkCreate`/`bulkUpdate`/`updateMany`/`deleteMany`.
7. Yeni entity → RLS'i hemen kurun: okuma/içerik herkese, yazma admin; müşteri verisi e-posta eşleşmesi.
8. Kredi harcayan çağrılar (AI, e-posta, görsel) her yerde `.catch(() => {})` ile sarılır — kredi bitince UX bozulmamalı; ama akış `await`'in arkasında kilitlenmemeli.
9. Maskot `RobotMascot` duygu durumları sayfa genelinde `MascotCompanion` ile gezinir; yeni duygu eklerken `Eyes` + `Mouth` ikisini de güncelleyin; mobilde `MobileBuyBar` ile çakışmasın.
10. jsPDF renk/dolgu çağrılarında dizi argümanları **mutlaka spread** edin (`setFillColor(...MINT)`).
11. Randevu saatleri iki yerde (`LeadCaptureForm.TIMES` + `appointmentSlots`) — senkron tutun.
12. Test verisi: panel `AdminDashboard` — yeni talep rozeti canlı sayaçla gelir.

---

## 14. Yayın ve Sınırlar

- **Plan:** Free — entegrasyon kredileri Core entegrasyonlarını (InvokeLLM, SendEmail, UploadPrivateFile, TranscribeAudio, görsel/video üretimi…) harcar; **tükendiğinde backend fonksiyonları da 402 döner.** Güncel durum: krediler tükenmiş, 2026-11-01'de veya plan yükseltmede yenilenir — DijiBot AI yanıtları ve e-posta bildirimleri bu tarihe kadar sessizdir (kod hazır, akışlar kendiliğinden döner).
- AI çağrıları uygulamanın kendi `OPENAI_API_KEY`'iyle çalıştığından kredi harcamaz; ancak kredi bittiğinde WhatsApp webhook dahil tüm fonksiyonlar çalışmaz (DijiBot susar). Kredi yenilenince Meta otomatik tekrar denemeleriyle akış kendiliğinden döner — ek ayar gerekmez.
- Dosya depolama kredi bağımsızdır: Cloudflare R2 (`uploadClient.js` + `r2Storage`).
- **Özel alan adı:** Dashboard → Domains üzerinden bağlanır; e-postaların kayıtlı olmayan adreslere ulaşması için özel alan adı + ücretli plan gerekir.
- **API erişimi:** Dashboard → API (kendi Base44 API anahtarları + SDK dokümanı).
- **Instagram:** işletme hesabı connector ile bağlı (`instagram_business_basic` + mesaj yetkisi).

---

## 15. Yapılacaklar (open backlog)

- [ ] Meta Business Manager'da WhatsApp webhook canlı doğrulaması (messages alanındaki "Test" düğmesiyle uçtan uca)
- [ ] Meta onaylı WhatsApp şablonları oluşturma (24 saat penceresi kapanan müşteriler için `whatsappTemplate` gerekli)
- [ ] OG görseli üret ve `index.html`'e bağla
- [ ] 9 blog yazısına kapak görseli (ImageUpload ile veya AI üretim)
- [ ] iyzico yerine yeni otomatik ödeme yapısının kurulması + uçtan uca test (mevcut model: manuel link)
- [ ] Google Analytics / Search Console bağlantısı
- [ ] 373px mobil senaryolar: sohbet paneli, alıcı çubuğu, maskot çakışma kontrolü
- [ ] `leadNotify` / `sendNewsletter` canlı gönderim testi
- [ ] Admin paneline gerçek referans fotoğrafları
- [ ] Özel alan adı bağlama + SEO kontrol listesi
- [ ] Boş kalan `iyzicoCheckout` / `iyzicoCallback` klasörlerinin tamamen temizlenmesi