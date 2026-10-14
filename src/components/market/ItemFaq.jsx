import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

/** Ürün SSS — teslim, revizyon, iade ve destek koşulları. */
export default function ItemFaq({ item, catLabel }) {
  const faqs = [
    {
      q: 'Teslimat ne kadar sürer?',
      a: `Talebiniz onaylandıktan sonra ${item.category === 'nfckart' ? '3-5 iş günü içinde kartınız kargolanır' : item.category === 'tema' ? '2-3 iş günü içinde temanız yayına alınır' : 'kapsama göre 1-3 hafta içinde projeniz teslim edilir'}. Her aşamada müşteri portalından ilerlemeyi canlı takip edebilirsiniz.`,
    },
    {
      q: 'Revizyon hakkım var mı?',
      a: 'Evet. Teslimden sonra belirtilen kapsamda 2 revizyon turu ücretsizdir; renk, metin ve görsel değişiklikleri bu turlarda tamamlanır.',
    },
    {
      q: 'İade koşulları nedir?',
      a: 'Teklif onaylanana kadar tahsilat yapılmaz; onay öncesi talebinizi hiçbir bedel ödemeden iptal edebilirsiniz. Teslim sonrası ilk 14 gün içinde kapsam dışı iş yapılmamışsa ücret iadesi yapılır.',
    },
    {
      q: 'Ödeme nasıl yapılıyor?',
      a: 'Onay sonrası size özel ödeme bağlantısı gönderilir. Kart veya banka havalesi ile tek seferde ya da büyük paketlerde 2 taksitte ödeyebilirsiniz.',
    },
    {
      q: 'Destek ve güncellemeler dahil mi?',
      a: 'Evet, 1 yıl ücretsiz destek dahildir. Destek süresince küçük içerik güncellemeleri ve teknik sorunlar ücretsiz çözülür; sonrasında yıllık bakım paketine geçebilirsiniz.',
    },
  ];

  return (
    <div className="rounded-3xl border border-border bg-card p-5 md:p-7">
      <h2 className="font-display text-xl font-bold">{catLabel} SSS</h2>
      <Accordion type="single" collapsible className="mt-4">
        {faqs.map((f, i) => (
          <AccordionItem key={f.q} value={`f${i}`} className="border-border last:border-0">
            <AccordionTrigger className="text-left text-sm md:text-base font-semibold hover:text-mint hover:no-underline py-4">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-foreground/70 leading-relaxed pb-4">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}