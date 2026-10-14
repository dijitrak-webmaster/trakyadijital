import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '@/components/site/Hero';
import MarqueeStrip from '@/components/site/MarqueeStrip';
import StatsStrip from '@/components/site/StatsStrip';
import ServicesGrid from '@/components/site/ServicesGrid';
import WhyUs from '@/components/site/WhyUs';
import Sectors from '@/components/site/Sectors';
import Process from '@/components/site/Process';
import PackageCompare from '@/components/site/PackageCompare';
import Reveal from '@/components/site/Reveal';
import HarvestCalculator from '@/components/site/HarvestCalculator';
import CaseStudies from '@/components/site/CaseStudies';
import PortfolioGrid from '@/components/site/PortfolioGrid';
import Testimonials from '@/components/site/Testimonials';
import InstagramFeed from '@/components/site/InstagramFeed';
import HomeFaq from '@/components/site/HomeFaq';
import CtaBanner from '@/components/site/CtaBanner';
import ToolTeasers from '@/components/site/ToolTeasers';
import { useLanguage } from '@/lib/LanguageContext';
import useSeo from '@/hooks/useSeo';
import useSiteSettings from '@/hooks/useSiteSettings';
import MarketTeaser from '@/components/site/MarketTeaser';

export default function Home() {
  const { tl } = useLanguage();
  const [s] = useSiteSettings();
  useSeo({
    title: "Dijitrak — Trakya'nın Dijital Ajansı | Web Tasarım, E-Ticaret ve SEO",
    description: "Trakya'daki tarım, sanayi, ticaret, turizm ve gıda işletmeleri için web tasarımı, e-ticaret, SEO ve dijital dönüşüm çözümleri. Proje Simülatörü ile bütçenizi 3 adımda hesaplayın.",
    path: '/',
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Dijitrak', url: window.location.origin },
  });
  return (
    <>
      {s.show_hero !== false && <Hero />}
      {s.show_marquee !== false && <MarqueeStrip />}
      <div className="max-w-6xl mx-auto px-5 md:px-6 pb-14 md:pb-24 space-y-12 md:space-y-24">
        <div className="space-y-4">
          {s.show_stats !== false && <StatsStrip />}
          {s.show_services !== false && <ServicesGrid />}
        </div>
        {s.show_why !== false && <WhyUs />}
        {s.show_sectors !== false && <Sectors />}
        {s.show_process !== false && <Process />}
        {s.show_packages !== false && <PackageCompare />}
        {s.show_simulator !== false && (
          <Reveal>
            <Link to="/simulasyon" className="group flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-dashed border-mint/40 bg-card p-6 md:p-7 hover:border-mint hover:-translate-y-1 transition-all">
              <div>
                <p className="font-mono text-xs text-sun">{tl('// PROJE SİMÜLATÖRÜ')}</p>
                <p className="mt-1.5 font-display font-semibold text-xl md:text-2xl">{tl('Projenizi 3 adımda simüle edin — tahmini bütçe ve süreç takvimi anında.')}</p>
              </div>
              <span className="rounded-full bg-mint text-ink font-semibold px-6 py-3 inline-flex items-center gap-2 group-hover:shadow-sticker transition-all">
                {tl('Başla')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </Reveal>
        )}
        {s.show_tools !== false && <ToolTeasers />}
        {s.show_calculator !== false && (
          <section className="space-y-6">
            <div>
              <p className="font-mono text-xs text-sun">{tl('// ÜCRETSİZ ARAÇ')}</p>
              <h2 className="mt-1.5 font-display text-3xl md:text-4xl font-semibold">{tl('SEO Kâr Hesaplayıcı')}</h2>
              <p className="mt-2 text-foreground/70 max-w-xl">{tl('SEO yatırım seviyenizi kaydırın, 6 aylık tahmini ziyaretçi ve müşteri getirinizi görün.')}</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
              <HarvestCalculator />
              <CaseStudies />
            </div>
          </section>
        )}
        {s.show_testimonials !== false && <Testimonials />}
        {s.show_portfolio !== false && <PortfolioGrid />}
        {s.market_enabled && <MarketTeaser />}
        {s.show_instagram !== false && <InstagramFeed />}
        {s.show_faq !== false && <HomeFaq />}
        {s.show_cta !== false && <CtaBanner />}
      </div>
    </>
  );
}