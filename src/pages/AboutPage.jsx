import React from 'react';
import { Link } from 'react-router-dom';
import { Handshake, MapPinned, LineChart, RefreshCcw, Bot, Quote } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import useSeo from '@/hooks/useSeo';
import Reveal from '@/components/site/Reveal';
import Sticker from '@/components/site/Sticker';
import IconBadge from '@/components/site/IconBadge';
import CtaBanner from '@/components/site/CtaBanner';
import RobotMascot from '@/components/mascot/RobotMascot';

const STATS = [
  { v: '120+', k: 'tamamlanmış proje' },
  { v: '%340', k: 'ortalama trafik artışı' },
  { v: '12', k: 'Trakya ilçesinde hizmet' },
  { v: '24 saat', k: 'içinde dönüş taahhüdü' },
];

const VALUES = [
  { icon: Handshake, tile: 'bg-mint', title: 'Şeffaflık', text: 'Fiyattan sürece, yazılı tekliften aylık rapora kadar her şeyi net biçimde paylaşıyoruz.' },
  { icon: MapPinned, tile: 'bg-sun', title: 'Yerellik', text: "Trakya'nın pazarını, sezonunu ve insanını biliyoruz; sablon değil yerinde çözüm üretiyoruz." },
  { icon: LineChart, tile: 'bg-coral', title: 'Ölçülebilirlik', text: 'Tahminle değil veriyle çalışırız: her projenin çıktısı somut metriklerle raporlanır.' },
  { icon: RefreshCcw, tile: 'bg-sage', title: 'Süreklilik', text: 'Teslim sonrası bakım, güncelleme ve büyüme desteğiyle yanınızdayız; proje değil ortaklık.' },
];

const TEAM = [
  { name: 'Meriç Aksu', role: 'Kurucu & Kreatif Direktör', bio: '12 yıllık web tasarımı deneyimi; Trakya sanayisinden bağcılığa 80+ projenin kreatif lideri.', tile: 'bg-mint', initials: 'MA' },
  { name: 'Deniz Yıldız', role: 'Teknoloji Lideri', bio: 'React, e-ticaret altyapıları ve performans optimizasyonu konusunda takımın teknik beyni.', tile: 'bg-sun', initials: 'DY' },
  { name: 'Sedef Kaya', role: 'SEO & İçerik Direktörü', bio: 'Yerel SEO stratejileri ve içerik planlamasıyla işletmeleri Google haritasında öne taşıyor.', tile: 'bg-coral', initials: 'SK' },
  { name: 'Barış Demir', role: 'Müşteri Deneyimi', bio: 'Keşiften yayına tüm süreçte işletmelerle tek muhatap; randevular ve eğitimlerin koordinatörü.', tile: 'bg-sage', initials: 'BD' },
];

export default function AboutPage() {
  const { tl } = useLanguage();

  useSeo({
    title: 'Hakkımızda & Ekip | Dijitrak',
    description: "Dijitrak'ın hikayesi, değerlerimiz ve Trakya'nın dijital dönüşümünü birlikte yürüten ekip tanıtımı.",
    path: '/hakkimizda',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'Hakkımızda | Dijitrak',
    },
  });

  return (
    <div className="pt-32 md:pt-44 pb-24">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        {/* Hero */}
        <Reveal>
          <span className="inline-block rounded-full border border-mint/40 bg-mint/10 text-mint font-mono text-xs px-4 py-1.5">{tl('HAKKIMIZDA')}</span>
          <h1 className="font-display font-bold text-5xl md:text-7xl tracking-tight mt-4 leading-[0.98]">
            {tl('Trakya’da yetişen,')}<br /><span className="text-shimmer">{tl('dijitalde sonuç veren ekip')}</span>
          </h1>
          <p className="text-foreground/75 text-lg max-w-2xl mt-5">
            {tl('Dijitrak, 2019’da Edirne’de üç kişilik bir masada kuruldu. Bugün web tasarımı, e-ticaret ve Google odaklı büyüme alanlarında Trakya’nın 12 ilçesindeki işletmelere “kurumsal düzeyde, mahalle sıcaklığında” hizmet veriyoruz. Tarlada başlayan hikayemizi, işletmelerin dijitaldeki hasadına dönüştürüyoruz.')}
          </p>
        </Reveal>

        {/* İstatistik şeridi */}
        <Reveal delay={0.1}>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.v} className="rounded-2xl border-2 border-border bg-card p-5 text-center">
                <div className="font-display font-bold text-4xl text-mint">{s.v}</div>
                <div className="font-mono text-[11px] text-muted-foreground mt-1.5">{tl(s.k)}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Misyon — alıntı kartı */}
        <Reveal delay={0.15}>
          <div className="relative mt-14 rounded-3xl border-2 border-mint/50 bg-terminal p-8 md:p-12">
            <Sticker icon={Quote} tile="bg-sun" size="md" rotate={-8} delay={0.2} className="hidden md:block right-[5%] top-8" />
            <RobotMascot emotion="excited" className="w-20 h-[88px] md:w-24 md:h-[106px]" />
            <p className="font-display font-semibold text-2xl md:text-4xl leading-snug mt-6 max-w-3xl">
              {tl('“Misyonumuz basit: Trakya’daki hiçbir işletme, dijital büyüme fırsatını görmezlikten gelmesin.”')}
            </p>
            <p className="font-mono text-xs text-muted-foreground mt-4">{tl('— Dijitrak ekibinin çalışma sözü')}</p>
          </div>
        </Reveal>

        {/* Değerler */}
        <Reveal delay={0.1}>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-20 tracking-tight">{tl('Değerlerimiz')}</h2>
          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            {VALUES.map((v) => (
              <div key={v.title} className="group rounded-2xl border-2 border-border bg-card p-6 hover:border-mint/60 transition-colors">
                <IconBadge icon={v.icon} tile={v.tile} />
                <h3 className="font-display font-semibold text-2xl mt-4">{tl(v.title)}</h3>
                <p className="text-foreground/70 mt-2">{tl(v.text)}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Ekip */}
        <Reveal delay={0.1}>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-20 tracking-tight">{tl('Ekibimiz')}</h2>
          <p className="text-foreground/70 mt-3 max-w-2xl">{tl('Masamız küçük, sahamız geniş. Her projede aynı çekirdek ekip çalışır; işiniz kimseye devredilmez.')}</p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map((m) => (
              <div key={m.name} className="rounded-2xl border-2 border-border bg-card p-6 text-center hover:-translate-y-1 transition-transform">
                <div className={`mx-auto w-20 h-20 rounded-full ${m.tile} border-2 border-ink shadow-sticker flex items-center justify-center font-display font-bold text-2xl text-ink`}>
                  {m.initials}
                </div>
                <h3 className="font-display font-semibold text-xl mt-4">{tl(m.name)}</h3>
                <p className="font-mono text-[11px] text-mint mt-1">{tl(m.role)}</p>
                <p className="text-sm text-foreground/70 mt-3">{tl(m.bio)}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* DijiBot kartı */}
        <Reveal delay={0.1}>
          <div className="mt-16 rounded-2xl border-2 border-border bg-card p-6 flex flex-col sm:flex-row items-center gap-5">
            <RobotMascot emotion="idle" className="w-16 h-[70px] shrink-0" />
            <div className="text-center sm:text-left">
              <h3 className="font-display font-semibold text-xl">{tl('Ekipte bir de DijiBot var')}</h3>
              <p className="text-foreground/70 text-sm mt-1 max-w-xl">
                {tl('7/24 yanıt veren AI danışmanımız DijiBot, paket kurma, randevu planlama ve ücretsiz analiz konularında ekibin dijital yardımcısıdır.')}
              </p>
            </div>
            <Link to="/iletisim" className="sm:ml-auto shrink-0 rounded-full bg-mint text-ink font-semibold px-6 py-2.5 hover:bg-sun transition-colors">
              {tl('Bize Ulaşın')}
            </Link>
          </div>
        </Reveal>
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-6 mt-20">
        <CtaBanner />
      </div>
    </div>
  );
}