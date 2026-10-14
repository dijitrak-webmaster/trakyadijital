import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useAssistant } from '@/lib/AssistantContext';
import { useLanguage } from '@/lib/LanguageContext';

const TIERS = [
  {
    name: 'Başlangıç',
    tagline: 'İlk dijital adım',
    price: '₺1.450 – 7.500',
    color: 'bg-sun',
    features: ['Google İşletme Profili optimizasyonu', 'Landing page & kampanya sayfası', 'Yerel SEO başlangıç kurgusu'],
  },
  {
    name: 'Büyüme',
    tagline: 'Düzenli satış akışı',
    price: '₺4.900 – 14.500',
    color: 'bg-mint',
    features: ['Kurumsal web sitesi + yönetim paneli', 'SEO veya reklam ile trafik', 'WhatsApp & CRM entegrasyonu'],
    highlight: true,
  },
  {
    name: 'Kurumsal',
    tagline: 'Tam dijital dönüşüm',
    price: '₺12.900 – 49.000',
    color: 'bg-coral',
    features: ['E-ticaret veya özel yazılım', 'Çok dilli yapı (TR/EN/DE)', 'Otomasyon & aylık raporlama'],
  },
];

// Fiyat sayfasındaki hazır paket karşılaştırması; CTA DijiBot paket akışını açar.
export default function PackageCompare() {
  const { openAssistant } = useAssistant();
  const { tl } = useLanguage();
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-mint" />
        <h2 className="font-display font-bold text-2xl md:text-3xl">{tl('Hazır paket karşılaştırması')}</h2>
      </div>
      <p className="text-sm text-foreground/60 mt-1">{tl('Aradığınızı bulursanız tek dokunuşla sohbetteki paket motoruna taşıyın.')}</p>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {TIERS.map((t) => (
          <div key={t.name} className={`bg-card rounded-3xl border p-6 flex flex-col ${t.highlight ? 'border-mint shadow-sticker' : 'border-border'}`}>
            <div className="flex items-center justify-between">
              <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
              {t.highlight && <span className="font-mono text-[10px] uppercase tracking-widest text-mint">{tl('En popüler')}</span>}
            </div>
            <h3 className="font-display font-bold text-xl mt-3">{tl(t.name)}</h3>
            <p className="text-sm text-foreground/60">{tl(t.tagline)}</p>
            <p className="font-display font-bold text-2xl text-mint mt-3">{t.price}</p>
            <ul className="mt-4 space-y-2 flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-foreground/75">
                  <Check className="w-3.5 h-3.5 text-mint shrink-0 mt-0.5" /> {tl(f)}
                </li>
              ))}
            </ul>
            <button onClick={() => openAssistant({ intent: 'package' })} className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-mint text-ink font-semibold px-5 py-2.5 text-sm hover:-translate-y-0.5 hover:shadow-sticker transition-all">
              <Sparkles className="w-4 h-4" /> {tl('Bu paketi sohbette kur')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}