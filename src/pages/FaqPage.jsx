import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircleQuestion } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useLanguage } from '@/lib/LanguageContext';
import useSeo from '@/hooks/useSeo';

const CATS = ['Hizmetler', 'Ödeme & Süreç', 'Dijital Dönüşüm'];

const FAQS = [
  { cat: 'Hizmetler', q: 'Hangi hizmetleri sunuyorsunuz?', a: 'Kurumsal web tasarımı, e-ticaret, Google İşletme Profili ve yerel SEO, reklam yönetimi, kurumsal kimlik, sosyal medya yönetimi ve özel yazılım geliştirme. Tüm hizmetleri Hizmetler sayfamızda kapsamları ve fiyat aralıklarıyla inceleyebilirsiniz.' },
  { cat: 'Hizmetler', q: 'Web sitem ne kadar sürede hazır olur?', a: 'Tek sayfalık tanıtım siteleri 2–3 hafta, kurumsal siteler 3–5 hafta, e-ticaret mağazaları 5–8 hafta içinde yayında olur. Süreç, içerik ve görsellerin zamanında teslimine göre değişir; başlangıçta net bir takvim paylaşıyoruz.' },
  { cat: 'Hizmetler', q: 'Mevcut sitemi yenileyebilir misiniz?', a: 'Evet. Önce ücretsiz bir site analizi yapıyor, hız, SEO ve dönüşüm açısından eksikleri raporluyoruz. Ardından mevcut içeriğinizi koruyarak yenileme planı sunuyoruz.' },
  { cat: 'Hizmetler', q: 'Site yayına alındıktan sonra da desteğe devam ediyor musunuz?', a: 'Her projede 1 ay ücretsiz destek dahildir. Sonrasında aylık bakım paketlerimizle güncelleme, yedekleme ve içerik desteği sürdürülür; dilerseniz sadece ihtiyaç oldukça da devralabiliriz.' },
  { cat: 'Ödeme & Süreç', q: 'Ödemeyi nasıl yapıyorum?', a: 'Projeler genelde %40 başlangıç, %40 tasarım onayı ve %20 teslimde olacak şekilde taksitlidir. Aylık yürüyen hizmetlerde (SEO, reklam, bakım) ay başında ödeme alınır. Havale/EFT ve online kart ödemesi kabul edilir.' },
  { cat: 'Ödeme & Süreç', q: 'Net fiyatı ne zaman öğrenirim?', a: 'Keşif görüşmesinden sonra 24 saat içinde kapsamı, takvimi ve net fiyatı içeren yazılı teklif hazırlıyoruz. Teklif onaylanmadan hiçbir ödeme talep etmeyiz.' },
  { cat: 'Ödeme & Süreç', q: 'Fiyatlar neden aralık olarak veriliyor?', a: 'Her işletmenin ihtiyacı farklıdır; sayfa sayısı, dil seçenekleri, ödeme entegrasyonları gibi unsurlar kapsamı belirler. Aralık, gerçekçi bir bütçe planı yapmanız içindir; net teklif ücretsizdir.' },
  { cat: 'Ödeme & Süreç', q: 'Çalışmaya nasıl başlıyoruz?', a: 'İletişim formundan veya telefonla ulaşmanızın ardından 45 dakikalık ücretsiz keşif görüşmesi yapıyoruz. Ardından strateji, teklif ve sözleşme; onayla süreci başlatıyoruz.' },
  { cat: 'Dijital Dönüşüm', q: 'Dijital dönüşüme nereden başlamalıyım?', a: 'En doğru başlangıç, müşterilerinizin sizi nerede aradığını anlamaktır. Küçük bir işletme için Google İşletme Profili ve hızlı bir tanıtım sitesi; satış yapan işletmeler için e-ticaret ilk adımdır. Proje Simülatörü ile 3 adımda size özel yol haritası çıkarabilirsiniz.' },
  { cat: 'Dijital Dönüşüm', q: 'SEO sonuçları ne zaman görülür?', a: 'Yerel aramalarda ilk iyileşmeler genelde 4–8 hafta içinde görülür; rekabetçi kelimelerde kalıcı sıralama 3–6 aylık düzenli çalışma ister. Aylık raporlarla ilerlemeyi şeffaf takip edersiniz.' },
  { cat: 'Dijital Dönüşüm', q: 'Sosyal medya takipçim var ama satış yok. Ne yapmalıyım?', a: 'Sorun genelde takipçi değil, dönüşüm yolundadır: her paylaşımda tek bir net aksiyon (WhatsApp siparişi, yol tarifi, telefon) olmalı ve profil bilgileri güncel tutulmalıdır. Bu dönüşümü ölçümleyen bir planla birlikte çalışıyoruz.' },
  { cat: 'Dijital Dönüşüm', q: 'Rakiplerim Google\'da önde. Nasıl geçerim?', a: 'Yerel SEO, düzenli içerik ve yorum yönetimi üçlüsü en etkili silahtır. Sektörünüze özel bir analizin ardından hangi aramalarda öne çıkabileceğinizi ve tahmini süreyi net biçimde paylaşırız.' },
];

export default function FaqPage() {
  const { tl } = useLanguage();
  const [cat, setCat] = useState('Tümü');
  const shown = cat === 'Tümü' ? FAQS : FAQS.filter((f) => f.cat === cat);
  useSeo({
    title: 'Sık Sorulan Sorular | Dijitrak',
    description: 'Hizmetlerimiz, ödeme koşulları ve dijital dönüşüm süreci hakkında en sık sorulan soruların yanıtları.',
    path: '/sss',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  });

  return (
    <div className="pt-36 md:pt-44 pb-24 max-w-4xl mx-auto px-5 md:px-6">
      <div className="text-center">
        <span className="inline-block rounded-full border border-sun/40 bg-sun/10 text-sun font-mono text-xs px-4 py-1.5">{tl('SSS')}</span>
        <h1 className="font-display text-4xl md:text-6xl font-semibold mt-4 tracking-tight">{tl('Aklınıza takılanlar')}</h1>
        <p className="text-foreground/70 mt-4 text-lg max-w-xl mx-auto">{tl('Hizmetler, ödeme süreçleri ve dijital dönüşüm adımları hakkında en sık aldığımız sorular.')}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-8">
        {['Tümü', ...CATS].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${cat === c ? 'bg-mint text-ink' : 'bg-secondary hover:bg-muted'}`}
          >
            {tl(c)}
          </button>
        ))}
      </div>

      <Accordion type="single" collapsible className="mt-8 border-2 border-border rounded-3xl bg-card px-5 overflow-hidden">
        {shown.map((f, i) => (
          <AccordionItem key={f.q} value={f.q} className={i === 0 ? 'border-t-0' : ''}>
            <AccordionTrigger className="text-left font-semibold text-base py-5 hover:text-mint transition-colors">
              <span className="flex items-start gap-3">
                <MessageCircleQuestion className="w-4 h-4 text-mint shrink-0 mt-0.5" /> {tl(f.q)}
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-foreground/75 leading-relaxed">{tl(f.a)}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <p className="text-center text-foreground/70 text-sm mt-8">
        {tl('Cevabını bulamadınız mı?')} <Link to="/iletisim" className="text-mint font-semibold hover:underline">{tl('Bize sorun')}</Link> {tl('— 24 saat içinde dönelim.')}
      </p>
    </div>
  );
}