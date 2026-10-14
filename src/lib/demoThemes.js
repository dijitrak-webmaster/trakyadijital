import {
  Sprout, Tractor, Truck, Wheat, Cog, Factory, ShieldCheck, Gauge,
  Coffee, Croissant, UtensilsCrossed, CalendarCheck, BedDouble, Waves, Trees, Sparkles,
} from 'lucide-react';

/**
 * Market temalarının canlı önizleme (demo) içerikleri.
 * Renkler demo sitenin kendi paletidir; DemoSite bunları CSS değişkeni olarak uygular.
 */
export const DEMO_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Space+Grotesk:wght@500;700&family=Fraunces:wght@600;700&family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600&display=swap';

export const DEMO_THEMES = {
  harvest: {
    brand: 'Altın Başak Tarım',
    head: "'Playfair Display', serif",
    headClass: '',
    heroStyle: 'overlay',
    palette: { bg: '#f7f3e8', surface: '#ffffff', text: '#1f2a1c', muted: '#5f6b58', accent: '#d99a1e', on: '#1f2a1c', border: '#e6dfcc' },
    nav: ['Ana Sayfa', 'Ürünler', 'Hakkımızda', 'İletişim'],
    hero: {
      eyebrow: "Keşan · Edirne — 1987'den beri",
      title: 'Toprağın bereketini sofranıza taşıyoruz',
      text: 'Ayçiçeği, buğday ve kanola üretiminde üç kuşaklık tecrübe — şimdi dijitalde, bayi ve toptan siparişe açık.',
      cta: 'Ürünleri İncele', cta2: 'Teklif Alın',
      image: 'https://media.base44.com/images/public/6ab8fa93b9e867cf626a1c69/b2f14fcf9_generated_image.png',
    },
    featuresTitle: 'Neden Altın Başak?',
    features: [
      { icon: Sprout, title: 'Sertifikalı Tohum', text: 'Bölge toprağına uygun, yüksek verimli tohum çeşitleri.' },
      { icon: Tractor, title: 'Modern Ekipman', text: 'Hassas ekim ve verimli biçimle kayıpsız üretim.' },
      { icon: Wheat, title: 'Toptan Satış', text: 'Un fabrikaları ve yağ tesislerine düzenli tedarik.' },
      { icon: Truck, title: 'Hızlı Teslimat', text: 'Trakya genelinde 48 saatte sevkiyat.' },
    ],
    about: {
      title: 'Üç kuşaktır aynı tarlada',
      text: 'Dedemizden kalan 40 dönümle başladık; bugün 1.200 dönümde iyi tarım uygulamalarıyla üretiyoruz. Her parti analizli, her teslimat izlenebilir.',
      image: 'https://media.base44.com/images/public/6ab8fa93b9e867cf626a1c69/ff14a8848_generated_image.png',
      stats: [['1.200', 'Dönüm ekili alan'], ['35+', 'Yıllık tecrübe'], ['14', 'Bayi noktası']],
    },
    quote: { text: 'Siparişten teslimata her adımı takip edebiliyoruz. Trakya’da böyle düzenli bir tedarikçi bulmak zor.', author: 'Murat Y. — Un Fabrikası Satın Alma' },
    contact: { phone: '+90 284 000 00 00', address: 'Keşan, Edirne', hours: 'Hafta içi 08:00 – 18:00' },
  },
  terminal: {
    brand: 'ÇORLU MAKİNA OSB',
    head: "'Space Grotesk', sans-serif",
    headClass: 'uppercase tracking-tight',
    heroStyle: 'split',
    palette: { bg: '#0b0f14', surface: '#121821', text: '#e6edf3', muted: '#8b98a5', accent: '#22d3ee', on: '#0b0f14', border: '#1f2a36' },
    nav: ['Çözümler', 'Tesis', 'Kalite', 'İletişim'],
    hero: {
      eyebrow: '> ISO 9001 · Çorlu OSB',
      title: 'Mikron hassasiyetinde üretim',
      text: '5 eksen CNC, robotik kaynak ve 7/24 üretim hattıyla otomotiv ve beyaz eşya sektörüne parça üretiyoruz.',
      cta: 'Teklif İste', cta2: 'Tesisi Gez',
      image: 'https://media.base44.com/images/public/6ab8fa93b9e867cf626a1c69/e61831edc_generated_image.png',
    },
    featuresTitle: 'Üretim Kabiliyetleri',
    features: [
      { icon: Cog, title: 'CNC İşleme', text: '5 eksen, ±0.005 mm tolerans.' },
      { icon: Factory, title: 'Seri Üretim', text: 'Aylık 250.000 parça kapasite.' },
      { icon: ShieldCheck, title: 'Kalite Kontrol', text: 'CMM ölçüm ve tam izlenebilirlik.' },
      { icon: Gauge, title: 'Hızlı Termin', text: 'Prototipten seriye 10 iş günü.' },
    ],
    about: {
      title: 'Veriyle yönetilen tesis',
      text: 'Her tezgâh anlık izleniyor; OEE, fire ve termin verileri müşteri panelinde canlı. Üretiminizi uzaktan takip edin.',
      image: 'https://media.base44.com/images/public/6ab8fa93b9e867cf626a1c69/616fe2ea4_generated_image.png',
      stats: [['%98,7', 'Zamanında teslim'], ['42', 'CNC tezgâh'], ['24/7', 'Üretim']],
    },
    quote: { text: 'Termin ve kalite raporlarına panelden anında ulaşıyoruz. Tedarik zincirimizin en güvenilir halkası.', author: 'Selin K. — Satın Alma Müdürü' },
    contact: { phone: '+90 282 000 00 00', address: 'Çorlu OSB, Tekirdağ', hours: '7/24 üretim · Ofis 08:30 – 18:00' },
  },
  sunny: {
    brand: 'Sıcak Fırın',
    head: "'Fraunces', serif",
    headClass: '',
    heroStyle: 'split',
    palette: { bg: '#fff8ef', surface: '#ffffff', text: '#3b2416', muted: '#8a6a55', accent: '#e8622c', on: '#ffffff', border: '#f1e1cf' },
    nav: ['Menü', 'Hikâyemiz', 'Rezervasyon', 'İletişim'],
    hero: {
      eyebrow: 'Lüleburgaz · Her sabah 06:00',
      title: 'Taş fırından, sıcacık mutluluk',
      text: 'Ekşi mayalı ekmek, çıtır simit ve ev yapımı tatlılar. Kahvaltı masanızı ayırtın, siparişinizi kapıya getirelim.',
      cta: 'Menüyü Gör', cta2: 'Masa Ayırt',
      image: 'https://media.base44.com/images/public/6ab8fa93b9e867cf626a1c69/1826a3205_generated_image.png',
    },
    featuresTitle: 'Bugün fırında',
    features: [
      { icon: Croissant, title: 'Tereyağlı Kruvasan', text: 'Fransız usulü, 72 katman.' },
      { icon: Coffee, title: 'Nitelikli Kahve', text: 'Günlük kavrulmuş çekirdekler.' },
      { icon: UtensilsCrossed, title: 'Serpme Kahvaltı', text: 'Hafta sonu 08:00 – 13:00.' },
      { icon: CalendarCheck, title: 'Online Rezervasyon', text: 'Masanızı 30 saniyede ayırtın.' },
    ],
    about: {
      title: 'Mahallenin fırını, 1974',
      text: 'Ustamızın tarifleriyle, odun ateşinde pişen ekmeğin kokusu hâlâ aynı. Yerel değirmenlerden un, köy tereyağı ve bolca sevgi.',
      image: 'https://media.base44.com/images/public/6ab8fa93b9e867cf626a1c69/c54f69282_generated_image.png',
      stats: [['50+', 'Çeşit ürün'], ['4,9', 'Google puanı'], ['1974', 'Kuruluş']],
    },
    quote: { text: 'Pazar kahvaltısı için artık telefonla uğraşmıyoruz; rezervasyonu siteden yapıyoruz. Kruvasanlar efsane!', author: 'Ayşe D. — Müdavim' },
    contact: { phone: '+90 288 000 00 00', address: 'Lüleburgaz, Kırklareli', hours: 'Her gün 06:00 – 22:00' },
  },
  fog: {
    brand: 'Sis Konak',
    head: "'Cormorant Garamond', serif",
    headClass: '',
    heroStyle: 'overlay',
    palette: { bg: '#eef1f0', surface: '#ffffff', text: '#1d2a2e', muted: '#64757a', accent: '#3f6f6a', on: '#ffffff', border: '#d9e0de' },
    nav: ['Odalar', 'Deneyimler', 'Galeri', 'Rezervasyon'],
    hero: {
      eyebrow: 'Kıyıköy · Butik Konak',
      title: 'Ormanın ve denizin buluştuğu sessizlik',
      text: 'Yedi odalı taş konağımızda sisli sabahlar, şömine başında akşamlar. Şehirden iki saat, gürültüden çok uzak.',
      cta: 'Odaları Keşfet', cta2: 'Müsaitlik Sor',
      image: 'https://media.base44.com/images/public/6ab8fa93b9e867cf626a1c69/6e1443760_generated_image.png',
    },
    featuresTitle: 'Konakta sizi neler bekliyor',
    features: [
      { icon: BedDouble, title: '7 Özel Oda', text: 'Her biri manzaralı, şömineli.' },
      { icon: Waves, title: 'Plaja 5 Dakika', text: 'Kıyıköy koyuna yürüme mesafesi.' },
      { icon: Trees, title: 'Longoz Turları', text: 'Rehberli orman ve kano rotaları.' },
      { icon: Sparkles, title: 'Köy Kahvaltısı', text: 'Yerel üreticilerden, her sabah.' },
    ],
    about: {
      title: 'Taş, ahşap ve sis',
      text: '120 yıllık bir taş evi aslına uygun restore ettik. Yalın tasarım, doğal malzemeler ve yalnızca kuş sesleriyle uyanacağınız odalar.',
      image: 'https://media.base44.com/images/public/6ab8fa93b9e867cf626a1c69/265e14277_generated_image.png',
      stats: [['7', 'Oda'], ['9,6', 'Misafir puanı'], ['120', 'Yıllık konak']],
    },
    quote: { text: 'Hayatımızın en huzurlu hafta sonuydu. Rezervasyondan kahvaltıya kadar her detay düşünülmüş.', author: 'Elif & Can — İstanbul' },
    contact: { phone: '+90 288 000 00 01', address: 'Kıyıköy, Vize / Kırklareli', hours: 'Resepsiyon 7/24' },
  },
};