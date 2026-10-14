import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Info } from 'lucide-react';
import { serviceCategories, serviceCatalog, priceLabel } from '@/lib/serviceCatalog';
import { useLanguage } from '@/lib/LanguageContext';
import Reveal from '@/components/site/Reveal';
import PackageCompare from '@/components/site/PackageCompare';
import MaintenancePlans from '@/components/site/MaintenancePlans';
import CompareTable from '@/components/site/CompareTable';
import useSeo from '@/hooks/useSeo';

export default function PricingPage() {
  const { tl } = useLanguage();
  useSeo({
    title: 'Fiyatlandırma — Şeffaf Fiyatlar, Net Kapsam | Dijitrak',
    description: 'Web tasarımı, e-ticaret ve SEO hizmetlerinin yatırım aralıkları; freelancer seviyesinde rekabetçi fiyatlar, ajans disipliniyle. Net teklif 24 saatte hazır.',
    path: '/fiyatlandirma',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'OfferCatalog',
      name: 'Dijitrak Hizmet Fiyat Aralıkları',
      itemListElement: serviceCatalog
        .filter((s) => Array.isArray(s.price))
        .map((s, i) => ({
          '@type': 'Offer',
          position: i + 1,
          itemOffered: { '@type': 'Service', name: s.title, url: `https://trakya-digital-core.base44.app/hizmet/${s.slug}` },
          priceCurrency: 'TRY',
          lowPrice: s.price[0],
          highPrice: s.price[1],
        })),
    },
  });
  return (
    <div className="pt-36 md:pt-44 pb-24 max-w-6xl mx-auto px-5 md:px-6">
      <span className="inline-block rounded-full border border-coral/40 bg-coral/10 text-coral font-mono text-xs px-4 py-1.5">{tl('FİYATLANDIRMA')}</span>
      <h1 className="font-display text-4xl md:text-6xl font-semibold mt-4 tracking-tight">{tl('Şeffaf fiyatlar, net kapsam')}</h1>
      <p className="text-foreground/70 mt-4 max-w-2xl text-lg">
        {tl('Freelancer seviyesinde rekabetçi fiyatlar, ajans disipliniyle: her hizmetin kapsamı ve yatırım aralığı açıkça listeli. Net teklif, keşif görüşmesinden sonra 24 saat içinde hazır.')}
      </p>

      <Reveal className="mt-12">
        <PackageCompare />
      </Reveal>

      <MaintenancePlans />

      <Reveal className="mt-14">
        <CompareTable />
      </Reveal>

      {serviceCategories.map((c, ci) => (
        <Reveal key={c.id} className="mt-14">
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
            <h2 className="font-display font-bold text-2xl md:text-3xl">{tl(c.name)}</h2>
          </div>
          <p className="text-sm text-foreground/60 mt-1">{tl(c.desc)}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {serviceCatalog.filter((s) => s.category === c.id).map((s) => (
              <div key={s.slug} className="bg-card rounded-3xl border border-border p-6 flex flex-col hover:border-mint/50 transition-colors">
                <div className="flex items-center justify-between">
                  <s.icon className="w-6 h-6 text-mint" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.monthly ? tl('Aylık') : tl('Proje')}</span>
                </div>
                <h3 className="font-display font-semibold text-lg mt-3">{tl(s.title)}</h3>
                <p className="text-sm text-foreground/65 mt-2 leading-relaxed flex-1">{tl(s.tagline)}</p>
                <ul className="mt-4 space-y-2">
                  {s.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-foreground/75">
                      <Check className="w-3.5 h-3.5 text-mint shrink-0 mt-0.5" /> {tl(f)}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-border mt-5 pt-4">
                  <span className="font-mono text-xs text-muted-foreground">{tl('Yatırım aralığı')}</span>
                  <p className="font-display font-bold text-xl text-mint mt-0.5">{priceLabel(s)}</p>
                  <Link to={`/hizmet/${s.slug}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold hover:text-mint transition-colors">
                    {tl('Detaylar')} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {ci === 0 && null}
        </Reveal>
      ))}

      <div className="mt-16 grid md:grid-cols-3 gap-4">
        <div className="bg-card rounded-3xl border border-border p-6">
          <Info className="w-5 h-5 text-sun" />
          <h3 className="font-display font-semibold mt-3">{tl('Neden aralık?')}</h3>
          <p className="text-sm text-foreground/65 mt-2 leading-relaxed">{tl('Sayfa sayısı, dil seçenekleri ve entegrasyonlar kapsamı belirler. Aralıklar gerçekçi bütçe planlamanız içindir.')}</p>
        </div>
        <div className="bg-card rounded-3xl border border-border p-6">
          <Info className="w-5 h-5 text-mint" />
          <h3 className="font-display font-semibold mt-3">{tl('Ödeme planı')}</h3>
          <p className="text-sm text-foreground/65 mt-2 leading-relaxed">{tl('Projelerde %40 başlangıç, %40 tasarım onayı, %20 teslim. Aylık hizmetlerde ay başı ödeme.')}</p>
        </div>
        <div className="bg-card rounded-3xl border border-border p-6">
          <Info className="w-5 h-5 text-coral" />
          <h3 className="font-display font-semibold mt-3">{tl('Sürpriz yok')}</h3>
          <p className="text-sm text-foreground/65 mt-2 leading-relaxed">{tl('Teklifte yazmayan hiçbir kalem faturaya girmez. Kapsam değişirse, önce yazılı onay isteriz.')}</p>
        </div>
      </div>

      <div className="mt-10 rounded-3xl border-2 border-dashed border-mint/40 bg-card p-8 flex flex-col md:flex-row md:items-center gap-5">
        <p className="flex-1 font-display font-semibold text-xl">
          {tl('Bütçenizi 3 adımda hesaplayın: ')}<Link to="/simulasyon" className="text-mint hover:underline">{tl('Proje Simülatörü')}</Link>{tl(', ')}
          <Link to="/#hesaplayici" className="text-mint hover:underline">{tl('SEO Kâr Hesaplayıcı')}</Link>{tl(' çalıştırın ya da net teklif isteyin.')}
        </p>
        <Link to="/iletisim" className="rounded-full bg-mint text-ink font-semibold px-6 py-3 inline-flex items-center gap-2 hover:shadow-sticker transition-all self-start">
          {tl('Ücretsiz teklif al')} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}