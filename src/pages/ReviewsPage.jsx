import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Star, Quote, ArrowRight } from 'lucide-react';
import Reveal from '@/components/site/Reveal';
import { useLanguage } from '@/lib/LanguageContext';
import useSeo from '@/hooks/useSeo';

// veritabanı boş/erişilemezken gösterilen örnek yorumlar
const REVIEWS = [
  { name: 'Hüseyin K.', role: 'Ayçiçek Üreticisi · Edirne', color: 'bg-mint', text: 'Mahsulümüzü ilk kez aracısız sattık. Mağaza kurulalı 8 ay oldu, online satışlar beklediğimizden hızlı büyüdü.', project: 'E-Ticaret + Yerel SEO' },
  { name: 'Merve A.', role: 'Tekstil İşletmesi · Çorlu', color: 'bg-sun', text: 'Alman müşterilerimiz artık bizi Google\'da buluyor. Çok dilli site sayesinde ihracat talepleri adeta ikiye katlandı.', project: 'Kurumsal Site + B2B SEO' },
  { name: 'Emre T.', role: 'Peynir İşletmesi · Malkara', color: 'bg-coral', text: 'En çok yorumlar şaşırttı: Google profilimizi düzenledikten sonra hafta sonları sıra oluşuyor. Hesaplı ve etkili bir yatırım oldu.', project: 'Google İşletme Dönüşümü' },
  { name: 'Selin D.', role: 'Butik Otel · Enez', color: 'bg-sage', text: 'Yaz dolu, kış boş derdik; artık sezon dışı da dolmaya başladı. Doğrudan rezervasyon sistemi komisyonları da cebimizde bıraktı.', project: 'Doğrudan Rezervasyon Sitesi' },
  { name: 'Kemal B.', role: 'Metal Sanayi · Çerkezköy', color: 'bg-fog', text: 'Teklif talepleri artık e-postada kaybolmuyor; hepsi tek panelde. Yabancı alıcıların teknik sorularına hızlı cevap veriyoruz.', project: 'Teknik Katalog + Akıllı Form' },
  { name: 'Zeynep S.', role: 'Kuyumcu · Keşan', color: 'bg-mint', text: 'Mahallede 30 yıldırız, ama gençler bizi haritada bulamıyormuş. Profil çalışmasından sonra genç müşteri girişimiz belirgin arttı.', project: 'Yerel SEO + Reklam' },
  { name: 'Ahmet R.', role: 'Zeytinyağı Butiği · İpsala', color: 'bg-sun', text: 'Ambalajdan siteye aynı marka dilini görmek bizi de şaşırttı. Müşteri güveni bambaşka oldu; hediye kutusu siparişleri patladı.', project: 'Kurumsal Kimlik + E-Ticaret' },
  { name: 'Deniz Ç.', role: 'Kafe & Kahvaltı · Uzunköprü', color: 'bg-coral', text: 'QR menü ve fotoğraf çalışmasıyla "yakınımda kahvaltı" aramalarında ilk sayfadayız. Sipariş telefonları artık hiç durmuyor.', project: 'Dijital Menü + Yerel SEO' },
  { name: 'Fatma Ö.', role: 'Kooperatif Yöneticisi · Lüleburgaz', color: 'bg-sage', text: 'Üye üreticiler artık sertifikalarını ve ödemelerini portalda görüyor. Bizim de yönetim yükümüz yarıya indi.', project: 'Kooperatif Portalı' },
];

export default function ReviewsPage() {
  const { tl } = useLanguage();
  const [reviews, setReviews] = useState(REVIEWS);
  useSeo({
    title: 'Müşteri Yorumları — Trakya Bizden Bahsediyor | Dijitrak',
    description: "Trakya'daki iş ortaklarımızın Dijitrak deneyimi: e-ticaret, SEO ve kurumsal web projelerinden gerçek sonuçlar, kendi cümleleriyle.",
    path: '/yorumlar',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Dijitrak Müşteri Yorumları',
      itemListElement: reviews.slice(0, 10).map((r, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Review',
          author: { '@type': 'Person', name: r.author || r.name },
          reviewBody: r.text,
          reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5 },
        },
      })),
    },
  });

  useEffect(() => {
    base44.entities.Testimonial.filter({ status: 'published' })
      .then((items) => items.length && setReviews(items))
      .catch(() => {});
  }, []);

  return (
    <div className="pt-36 md:pt-44 pb-24 max-w-6xl mx-auto px-5 md:px-6">
      <div className="text-center">
        <span className="inline-block rounded-full border border-mint/40 bg-mint/10 text-mint font-mono text-xs px-4 py-1.5">{tl('YORUMLAR')}</span>
        <h1 className="font-display text-4xl md:text-6xl font-semibold mt-4 tracking-tight">{tl('Trakya bizden bahsediyor')}</h1>
        <p className="text-foreground/70 mt-4 text-lg max-w-xl mx-auto">{tl('İş ortaklarımızın Dijitrak deneyimi — kendi cümleleriyle.')}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
        {reviews.map((q, i) => (
          <Reveal key={q.author || q.name} delay={i * 0.05}>
            <div className="h-full rounded-2xl border-2 border-border bg-card p-6 flex flex-col hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between">
                <Quote className={`w-8 h-8 ${q.color} rounded-lg p-1.5 text-ink border-2 border-ink`} />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => <Star key={s} className="w-3.5 h-3.5 text-sun fill-sun" />)}
                </div>
              </div>
              <p className="mt-4 text-foreground/85 leading-relaxed flex-1">"{tl(q.text)}"</p>
              <div className="mt-5 border-t border-border pt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-sm">{q.author || q.name}</div>
                  <div className="text-xs text-foreground/60">{tl(q.role)}</div>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wide text-mint text-right shrink-0">{tl(q.project)}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-14 rounded-3xl border-2 border-dashed border-mint/40 bg-card p-8 text-center">
        <p className="font-display font-semibold text-xl">{tl('Sıradaki yorum sizinki olsun.')}</p>
        <p className="text-sm text-foreground/65 mt-2">{tl('Projenizi anlatın, ilk sonuçları 90 gün içinde birlikte ölçelim.')}</p>
        <Link to="/iletisim" className="mt-5 inline-flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-6 py-3 hover:shadow-sticker transition-all">
          {tl('Ücretsiz görüşme planla')} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}