import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ShieldCheck, Wrench } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import Reveal from '@/components/site/Reveal';

// Web Bakım & Destek abonelik paketleri — aylık sabit fiyatlarla öne çıkarılmış.
const plans = [
  {
    name: 'Temel',
    price: '590₺',
    color: 'bg-fog',
    features: [
      'Haftalık tam yedekleme',
      'Aylık güvenlik taraması',
      'Ayda 1 içerik güncelleme',
      'E-posta desteği (1 iş günü dönüş)',
    ],
  },
  {
    name: 'Güven',
    price: '990₺',
    color: 'bg-mint',
    featured: true,
    features: [
      'Haftalık tam yedekleme',
      'Güvenlik taraması + SSL takibi',
      'Ayda 2 içerik güncelleme',
      '7/24 erişim izleme',
      'Acil durumda 4 saat içinde dönüş',
    ],
  },
  {
    name: 'Pro',
    price: '1.490₺',
    color: 'bg-sun',
    features: [
      'Günlük yedekleme',
      'Güvenlik + SSL + hız raporu',
      'Küçük içerik güncellemeleri sınırsız',
      'Öncelikli destek hattı',
      'Ayda 1 SEO kontrolü',
    ],
  },
];

export default function MaintenancePlans() {
  const { tl } = useLanguage();
  return (
    <Reveal className="mt-14">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-2xl bg-mint/15 text-mint flex items-center justify-center">
          <Wrench className="w-5 h-5" />
        </span>
        <div>
          <h2 className="font-display font-bold text-2xl md:text-3xl">{tl('Web Bakım & Destek Abonelikleri')}</h2>
          <p className="text-sm text-foreground/60 mt-1">{tl('Siteniz yayında kaldığı sürece çalışsın: aylık sabit ücret, sürprizsiz kapsam. Mevcut siteniz bizim dışımızda yapıldıysa da devralırız.')}</p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative bg-card rounded-3xl border p-6 flex flex-col ${
              p.featured ? 'border-mint shadow-sticker' : 'border-border'
            }`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-6 rounded-full bg-mint text-ink font-mono text-[10px] uppercase tracking-widest px-3 py-1">
                {tl('En çok tercih edilen')}
              </span>
            )}
            <div className="flex items-center justify-between">
              <span className={`rounded-xl ${p.color} text-ink font-display font-bold px-4 py-1.5`}>{tl(p.name)}</span>
              <span className="text-foreground/60 font-mono text-xs flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> {tl('aylık')}</span>
            </div>
            <p className="font-display font-bold text-4xl mt-4">
              {p.price}<span className="text-base font-semibold text-muted-foreground">/{tl('ay')}</span>
            </p>
            <ul className="mt-5 space-y-2.5 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground/75">
                  <Check className="w-4 h-4 text-mint shrink-0 mt-0.5" /> {tl(f)}
                </li>
              ))}
            </ul>
            <Link
              to="/iletisim"
              className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full font-semibold px-6 py-3 text-sm transition-all ${
                p.featured ? 'bg-mint text-ink hover:shadow-sticker' : 'border border-border hover:border-mint'
              }`}
            >
              {tl('Başlat')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </Reveal>
  );
}