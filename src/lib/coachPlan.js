// Kural tabanlı koç planı — AI plan dönmediğinde ya da AI geçici erişilemezken
// DijiBot'un koç yanıtına somut, bugünden uygulanabilir mini plan ekler.
// Eşleşme yoksa null döner: her yanıta plan yapıştırılmaz.
const RULES = [
  {
    re: /(google|görünü|gorunu|çıkm|cikm|harita|arama|seo)/i,
    tr: [
      'Google İşletme Profilini bugün oluştur: kategori, saat, fotoğraf ve hizmet bölümlerini eksiksiz doldur.',
      'Haftada 1 gönderi paylaş ve gelen her yoruma 24 saat içinde yanıt ver.',
      'Ana sayfa başlığına "sektör + şehir" kelimelerini ekle.',
    ],
    en: [
      'Create your Google Business Profile today: fill category, hours, photos and services.',
      'Post once a week and reply to every review within 24 hours.',
      'Add "service + city" keywords to your homepage title.',
    ],
  },
  {
    re: /(satış|satis|sipariş|siparis|e-ticaret|mağaza|magaza)/i,
    tr: [
      'En çok satan 5 ürününü online mağazana taşımakla başla — hepsi değil.',
      'Ürün fotoğraflarını gün ışığında, tek fonda yenile.',
      'WhatsApp\'tan sipariş hattı aç: kısa yoldan satış, hemen gelir.',
    ],
    en: [
      'Start by moving your 5 best-sellers online — not everything at once.',
      'Re-shoot product photos in daylight on a clean background.',
      'Open a WhatsApp ordering line for quick sales.',
    ],
  },
  {
    re: /(sosyal|instagram|facebook|tiktok)/i,
    tr: [
      'Haftalık 3 içerik planı yap: 1 ürün, 1 işletme arkası, 1 müşteri yorumu.',
      'Profil biyografisine net hizmet + konum + iletişim yaz.',
      'Hikâyelerde haftada 1 anket/soru ile etkileşim ölç.',
    ],
    en: [
      'Plan 3 posts a week: one product, one behind-the-scenes, one customer story.',
      'Put a clear service + location + contact line in your bio.',
      'Run a weekly poll in stories to measure engagement.',
    ],
  },
  {
    re: /(site|web|yavaş|yavas|yenile|tasarım|tasarim)/i,
    tr: [
      'Siteni telefonda aç: 3 saniyeden uzun yükleniyorsa görselleri sıkıştır.',
      'Her hizmete kendi sayfasını ver — tek sayfada her şey anlatılmaz.',
      'Ana sayfaya tek net harekete geçirici buton ekle (arama / teklif).',
    ],
    en: [
      'Open your site on a phone: if it loads over 3 seconds, compress images.',
      'Give each service its own page instead of one crowded page.',
      'Add one clear call-to-action button on the homepage.',
    ],
  },
  {
    re: /(yorum|değerlendir|degerlendir|referans|memnuniyet)/i,
    tr: [
      'Memnun müşterilerine yorum linkini içeren kısa bir mesaj şablonu hazırla.',
      'Her yoruma teşekkür/yanıt yaz — Google bunu görünürlüğe çevirir.',
      'İyi yorumları sitende ve sosyal medyanda göster.',
    ],
    en: [
      'Prepare a short review-request message for happy customers.',
      'Reply to every review — Google turns this into visibility.',
      'Showcase your best reviews on your site and social media.',
    ],
  },
  {
    re: /(reklam|kampanya|meta|ads)/i,
    tr: [
      'Reklamdan önce hedef sayfanı hazırla: tek teklif, tek buton.',
      'En iyi 3 müşteri tipini yaz; reklamı sadece onlara göster.',
      'Küçük bütçeyle 1 hafta test et, kazananı ölçeklendir.',
    ],
    en: [
      'Prepare the landing page before ads: one offer, one button.',
      'List your top 3 customer types and target only them.',
      'Test with a small budget for a week, then scale the winner.',
    ],
  },
];

export default function coachPlan(text, lang = 'tr') {
  const rule = RULES.find((r) => r.re.test(text || ''));
  if (!rule) return null;
  return lang === 'en' ? rule.en : rule.tr;
}