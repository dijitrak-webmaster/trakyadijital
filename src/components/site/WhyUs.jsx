import React from 'react';
import { Zap, Search, ShieldCheck, TrendingUp, Headset, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import Reveal from '@/components/site/Reveal';

const FEATURES = [
  { icon: Zap, color: 'bg-mint', title: 'Yıldız Hız', desc: 'Her site 90+ performans puanıyla yayınlanır. Saniyeler içinde açılan sayfa, müşteriyi rakibinizden önce yakalar.' },
  { icon: Search, color: 'bg-coral', title: 'Google Odaklı', desc: 'Tasarım aşamasından itibaren arama motoruna göre kurgularız; siteniz güzel görünmekle kalmaz, bulunur.' },
  { icon: TrendingUp, color: 'bg-sun', title: 'Ölçülebilir Sonuç', desc: 'Trafik, teklif ve satış rakamlarını şeffaf panellerle takip edersiniz. Tahmin değil, veri konuşur.' },
  { icon: ShieldCheck, color: 'bg-fog', title: 'Güvenilir Teslim', desc: 'Net zaman çizelgesi, sabit fiyat ve söz verilen tarihte teslim. Sürpriz yok, süreç her zaman görünür.' },
  { icon: Headset, color: 'bg-sage', title: 'Yerel Destek', desc: 'Trakya\'dan, telefonla ulaşabileceğiniz gerçek bir ekip. Bilet kuyruğu değil, tanıdık bir ses.' },
  { icon: Globe, color: 'bg-mint', title: 'İhracata Hazır', desc: 'Çok dilli yapılar ve teknik kataloglarla ürününüzü Bulgaristan\'dan Almanya\'ya kadar satışa açıyoruz.' },
];

export default function WhyUs() {
  const { tl } = useLanguage();
  return (
    <section>
      <Reveal className="text-center max-w-2xl mx-auto">
        <p className="font-mono text-xs text-mint">{tl('// NEDEN DİJİTRAK')}</p>
        <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl">{tl('Ajans değil,')} <span className="text-mint">{tl('büyüme ortağı')}</span></h2>
        <p className="mt-4 text-foreground/70 text-lg">{tl('Sitenizi teslim edip kaybolmuyoruz — hedefinizi biz de sahipleniyoruz.')}</p>
      </Reveal>
      <div className="mt-6 md:mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.08}>
            <div className="group h-full rounded-2xl border-2 border-border bg-card p-6 hover:border-mint/60 hover:-translate-y-1 transition-all">
              <div className={`w-12 h-12 ${f.color} rounded-xl border-2 border-ink flex items-center justify-center shadow-sticker group-hover:rotate-6 transition-transform`}>
                <f.icon className="w-6 h-6 text-ink" strokeWidth={2.2} />
              </div>
              <h3 className="mt-5 font-display font-semibold text-xl">{tl(f.title)}</h3>
              <p className="mt-2 text-sm text-foreground/70 leading-relaxed">{tl(f.desc)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}