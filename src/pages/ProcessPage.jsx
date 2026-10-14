import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, FileText, PenTool, Code2, FlaskConical, Rocket, ArrowRight } from 'lucide-react';
import Reveal from '@/components/site/Reveal';
import { useLanguage } from '@/lib/LanguageContext';
import useSeo from '@/hooks/useSeo';

const STEPS = [
  {
    icon: PhoneCall, color: 'bg-mint', num: '01', time: '1. gün',
    title: 'Keşif Görüşmesi',
    desc: 'İşletmenizi, hedeflerinizi, müşteri profilinizi ve rakiplerinizi tanıyoruz. 45 dakikalık ücretsiz görüşme, tüm yol haritasının temeli.',
    out: ['İhtiyaç özeti', 'Öncelik listesi'],
  },
  {
    icon: FileText, color: 'bg-sun', num: '02', time: '2–3 gün',
    title: 'Strateji & Teklif',
    desc: 'Size özel yol haritası: hangi hizmet, hangi sırayla, hangi takvimde. Kapsam, süre ve net fiyat yazılı teklifte netleşir.',
    out: ['Yazılı teklif', 'Proje takvimi', 'Ödeme planı'],
  },
  {
    icon: PenTool, color: 'bg-coral', num: '03', time: '1–2 hafta',
    title: 'Tasarım & Onay',
    desc: 'Tasarım konsepti ve içerik planı sizin onayınıza sunulur. Onayınız olmadan tek satır kod yazılmaz; revizyonlar bu aşamada karşılıksızdır.',
    out: ['Tasarım konsepti', 'İçerik planı', 'Onay raporu'],
  },
  {
    icon: Code2, color: 'bg-sage', num: '04', time: '2–5 hafta',
    title: 'Geliştirme & Entegrasyon',
    desc: 'Site, mağaza veya uygulama; ödeme, kargo ve paneller dahil her şey kurulumuyla inşa edilir. Süreci müşteri portalından adım adım izlersiniz.',
    out: ['Çalışan prototip', 'Entegrasyonlar', 'Portal erişimi'],
  },
  {
    icon: FlaskConical, color: 'bg-fog', num: '05', time: '3–5 gün',
    title: 'Test & Eğitim',
    desc: 'Hız, mobil uyum ve güvenlik testleri; ardından panel eğitimi. Sitenizi yönetecek ekibiniz her şeyi bizden öğrenir.',
    out: ['Test raporu', 'Panel eğitimi', 'Kullanım kılavuzu'],
  },
  {
    icon: Rocket, color: 'bg-mint', num: '06', time: 'Yayın günü',
    title: 'Lansman & Büyüme',
    desc: 'Yayın sonrası SEO, reklam ve aylık raporlamayla büyümeyi birlikte sürdürüyoruz. 1 ay ücretsiz destek her projede dahildir.',
    out: ['Yayın', 'Bakım desteği', 'Aylık raporlar'],
  },
];

export default function ProcessPage() {
  const { tl } = useLanguage();
  useSeo({
    title: 'İş Süreçleri — İlk Telefondan Lansmana | Dijitrak',
    description: 'Keşif görüşmesinden lansmana 6 adımlık şeffaf süreç: strateji, yazılı teklif, tasarım onayı, geliştirme, test ve yayın sonrası büyüme.',
    path: '/is-surecleri',
  });
  return (
    <div className="pt-36 md:pt-44 pb-24 max-w-5xl mx-auto px-5 md:px-6">
      <span className="inline-block rounded-full border border-coral/40 bg-coral/10 text-coral font-mono text-xs px-4 py-1.5">{tl('İŞ SÜREÇLERİ')}</span>
      <h1 className="font-display text-4xl md:text-6xl font-semibold mt-4 tracking-tight">{tl('İlk telefondan lansmana')}</h1>
      <p className="text-foreground/70 mt-4 max-w-2xl text-lg">
        {tl("Her adımı net, takipli ve onaylı. Sürüpriz olmadan çalışan bir metodoloji — çünkü Trakya'da referansla büyüyoruz.")}
      </p>

      <div className="mt-14 space-y-0">
        {STEPS.map((s, i) => (
          <Reveal key={s.num} delay={i * 0.05}>
            <div className="flex gap-5 md:gap-8">
              <div className="flex flex-col items-center">
                <span className={`w-14 h-14 rounded-2xl ${s.color} text-ink flex items-center justify-center shrink-0 shadow-sticker`}>
                  <s.icon className="w-6 h-6" />
                </span>
                {i < STEPS.length - 1 && <span className="w-px flex-1 bg-border my-2" />}
              </div>
              <div className="pb-12 flex-1 bg-card rounded-3xl border border-border p-6 md:p-7">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">{tl('ADIM')} {s.num}</span>
                  <span className="rounded-full bg-secondary px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground/70">{tl(s.time)}</span>
                </div>
                <h2 className="font-display font-semibold text-2xl mt-2">{tl(s.title)}</h2>
                <p className="text-sm text-foreground/70 mt-3 leading-relaxed">{tl(s.desc)}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {s.out.map((o) => (
                    <span key={o} className="rounded-full border border-mint/40 bg-mint/10 text-mint text-xs font-semibold px-3 py-1">{tl(o)}</span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="rounded-3xl border-2 border-dashed border-mint/40 bg-card p-8 flex flex-col md:flex-row md:items-center gap-5">
        <p className="flex-1 font-display font-semibold text-xl">{tl('Süreci hızlandıralım: ilk görüşme bugün, teklif yarın hazır.')}</p>
        <Link to="/iletisim" className="rounded-full bg-mint text-ink font-semibold px-6 py-3 inline-flex items-center gap-2 hover:shadow-sticker transition-all self-start">
          {tl('Keşif görüşmesi planla')} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}