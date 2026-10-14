import React from 'react';
import { Link } from 'react-router-dom';
import { Gauge, Radar, TrendingUp, Map, ScanSearch, Globe, History } from 'lucide-react';
import Reveal from '@/components/site/Reveal';
import { useLanguage } from '@/lib/LanguageContext';
import { openToolsDrawer } from '@/lib/seoScan';

const TOOLS = [
  { icon: ScanSearch, color: 'bg-mint', title: 'SEO Tarayıcı', text: 'Sitenizi tarar, puanlar ve düzeltme planı verir.', tool: true },
  { icon: Gauge, color: 'bg-mint', title: 'Dijital Olgunluk Testi', text: '10 soruda puanınızı ve yol haritanızı görün.', href: '/olgunluk-testi' },
  { icon: Radar, color: 'bg-coral', title: 'Rakip Radarı', text: 'Rakibinizi ölçün, açık verdiğiniz alanları bulun.', href: '/rakip-radar' },
  { icon: TrendingUp, color: 'bg-sun', title: 'Trakya Dijital Endeksi', text: 'Bölgenin dijital adaptasyon skoru.', href: '/trakya-endeks' },
  { icon: Map, color: 'bg-mint', title: 'Trakya Dijital Haritası', text: 'İlçe ilçe interaktif dijital harita.', href: '/dijital-harita' },
  { icon: Globe, color: 'bg-sun', title: 'Alan Adı Kontrolü', text: 'Müsait .com/.com.tr + profesyonel e-posta önerisi.', href: '/alan-adi-kontrolu' },
  { icon: History, color: 'bg-coral', title: '"Sitem Eski mi?" Testi', text: 'Sitenizin hangi kuşakta olduğunu puanlayın.', href: '/site-yenileme' },
];

// ana sayfada üç ücretsiz aracı tanıtan kompakt şerit
export default function ToolTeasers() {
  const { tl } = useLanguage();
  return (
    <Reveal>
      <section>
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-sun" />
          <h2 className="font-display font-bold text-2xl md:text-3xl">{tl('Ücretsiz Araçlar')}</h2>
        </div>
        <p className="text-sm text-foreground/60 mt-1">{tl('Kayıt gerekmez; 2 dakikada size özel çıktı.')}</p>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 mt-6">
          {TOOLS.map((t) => {
            const inner = (
              <>
                <div className="flex items-center justify-between">
                  <span className={`w-9 h-9 rounded-2xl ${t.color} text-ink flex items-center justify-center`}>
                    <t.icon className="w-5 h-5" />
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground group-hover:text-mint transition-colors">{tl('ÜCRETSİZ')}</span>
                </div>
                <h3 className="font-display font-bold text-lg mt-3 group-hover:text-mint transition-colors">{tl(t.title)}</h3>
                <p className="text-xs text-foreground/60 mt-1">{tl(t.text)}</p>
              </>
            );
            return t.tool ? (
              <button
                key={t.title}
                type="button"
                onClick={() => openToolsDrawer('seo')}
                className="group text-left bg-card rounded-3xl border border-mint/50 p-4 sm:p-5 hover:border-mint hover:-translate-y-1 hover:shadow-sticker active:scale-[0.98] transition-all"
              >
                {inner}
              </button>
            ) : (
              <Link
                key={t.title}
                to={t.href}
                className="group bg-card rounded-3xl border border-border p-4 sm:p-5 hover:border-mint hover:-translate-y-1 hover:shadow-sticker active:scale-[0.98] transition-all"
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </section>
    </Reveal>
  );
}