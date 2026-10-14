import React from 'react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useLanguage } from '@/lib/LanguageContext';
import Reveal from '@/components/site/Reveal';

const FAQS = [
  { q: 'Web sitem ne kadar sürede hazır olur?', a: 'Tek sayfalık tanıtım siteleri 2–3 hafta, kurumsal siteler 3–5 hafta, e-ticaret mağazaları 5–8 hafta içinde yayında olur. Başlangıçta net bir takvim paylaşıyoruz.' },
  { q: 'Ödemeyi nasıl yapıyorum?', a: 'Projelerde %40 başlangıç, %40 tasarım onayı ve %20 teslimde olacak şekilde taksitli ödeme sunuyoruz. Aylık hizmetlerde ödeme ay başında alınır.' },
  { q: 'SEO sonuçları ne zaman görülür?', a: 'Yerel aramalarda ilk iyileşmeler 4–8 hafta içinde görülür; kalıcı sıralama kazançları için 3–6 aylık düzenli çalışma gerekir. Aylık raporlarla ilerlemeyi şeffaf takip edersiniz.' },
  { q: 'Dijital dönüşüme nereden başlamalıyım?', a: 'Müşterilerinizin sizi nerede aradığını anlamaktan: küçük işletme için Google İşletme Profili ve hızlı bir tanıtım sitesi, satış yapan işletme için e-ticaret ilk adımdır.' },
];

export default function HomeFaq() {
  const { tl } = useLanguage();
  return (
    <section className="grid lg:grid-cols-5 gap-8 items-start">
      <Reveal className="lg:col-span-2">
        <p className="font-mono text-xs text-sun">{tl('// SIKÇA SORULAR')}</p>
        <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl leading-tight">{tl('Aklınıza takılanlar')}</h2>
        <p className="mt-4 text-foreground/70">{tl('Süreç, ödeme ve sonuçlar hakkında en sık aldığımız soruların kısa cevapları.')}</p>
        <Link to="/sss" className="mt-5 inline-flex items-center gap-2 font-semibold text-mint hover:underline">
          {tl('Tüm soruları gör')} <span aria-hidden>→</span>
        </Link>
      </Reveal>
      <Reveal className="lg:col-span-3" delay={0.1}>
        <Accordion type="single" collapsible className="border-2 border-border rounded-3xl bg-card px-5 overflow-hidden">
          {FAQS.map((f, i) => (
            <AccordionItem key={f.q} value={f.q} className={i === 0 ? 'border-t-0' : ''}>
              <AccordionTrigger className="text-left font-semibold text-sm md:text-base hover:text-mint transition-colors">{tl(f.q)}</AccordionTrigger>
              <AccordionContent className="text-sm text-foreground/70 leading-relaxed">{tl(f.a)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQS.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        })}
      </script>
    </section>
  );
}