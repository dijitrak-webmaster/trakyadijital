import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, Workflow, MessageSquareHeart, Cpu, HelpCircle, LayoutGrid, ShoppingBag, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import Reveal from '@/components/site/Reveal';
import useSiteSettings from '@/hooks/useSiteSettings';

const BASE_LINKS = [
  { to: '/fiyatlandirma', icon: Tag, color: 'bg-mint', title: 'Fiyatlandırma', desc: 'Freelancer seviyesinde şeffaf fiyat aralıkları' },
  { to: '/is-surecleri', icon: Workflow, color: 'bg-sun', title: 'İş Süreçleri', desc: 'İlk telefondan lansmana 6 adımlı metodoloji' },
  { to: '/yorumlar', icon: MessageSquareHeart, color: 'bg-coral', title: 'Yorumlar', desc: 'Trakya iş ortaklarının deneyimleri' },
  { to: '/teknoloji', icon: Cpu, color: 'bg-sage', title: 'Teknoloji Yığını', desc: 'Hızlı ve güvenli altyapı seçimlerimiz' },
  { to: '/sss', icon: HelpCircle, color: 'bg-fog', title: 'Sıkça Sorulanlar', desc: 'Hizmet, ödeme ve süreç sorularınızın cevabı' },
  { to: '/portfolyo', icon: LayoutGrid, color: 'bg-coral', title: 'Portföy', desc: 'Bitirdiğimiz işler ve ölçülebilir sonuçlar' },
  { to: '/#hesaplayici', icon: TrendingUp, color: 'bg-sun', title: 'SEO Kâr Hesaplayıcı', desc: 'SEO yatırımınızın 6 aylık tahmini getirisi' },
];

export default function ExploreLinks() {
  const { tl } = useLanguage();
  const [s] = useSiteSettings();
  const LINKS = [
    ...BASE_LINKS,
    ...(s.market_enabled ? [{ to: '/market', icon: ShoppingBag, color: 'bg-sun', title: 'Market', desc: 'Temalar, paketler, NFC kartlar ve eklentiler' }] : []),
  ];
  return (
    <section>
      <Reveal className="text-center max-w-2xl mx-auto">
        <p className="font-mono text-xs text-coral">{tl('// KEŞFEDİN')}</p>
        <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl">{tl('Merak ettiğiniz her şey')}</h2>
        <p className="mt-4 text-foreground/70 text-lg">{tl('Fiyatlardan süreçlere, yorumlardan teknolojiye — karar vermeniz için gereken tüm bilgiler.')}</p>
      </Reveal>
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LINKS.map((l, i) => (
          <Reveal key={l.to} delay={i * 0.05}>
            <Link to={l.to} className="group flex items-center gap-4 h-full rounded-2xl border-2 border-border bg-card p-5 hover:border-mint/60 hover:-translate-y-1 transition-all">
              <span className={`w-12 h-12 rounded-2xl ${l.color} text-ink flex items-center justify-center shrink-0 shadow-sticker group-hover:rotate-6 transition-transform`}>
                <l.icon className="w-5 h-5" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-display font-semibold">{tl(l.title)}</span>
                <span className="block text-xs text-foreground/60 mt-0.5">{tl(l.desc)}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-mint group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}