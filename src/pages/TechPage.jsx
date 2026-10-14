import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Cloud, CreditCard, Megaphone, Palette, ShieldCheck, Gauge, Cpu } from 'lucide-react';
import Reveal from '@/components/site/Reveal';
import { useLanguage } from '@/lib/LanguageContext';
import useSeo from '@/hooks/useSeo';

const STACK = [
  {
    icon: Code2, color: 'bg-mint', title: 'Diller & Çerçeveler', desc: 'Modern, hızlı ve bakımı kolay arayüzler.',
    items: ['React & JavaScript (ES6+)', 'Tailwind CSS ile tasarım sistemi', 'Framer Motion animasyonları', 'Node.js tabanlı özel yazılımlar'],
  },
  {
    icon: Cloud, color: 'bg-sun', title: 'Bulut & Altyapı', desc: 'Kurumsal sunucu dertleri tarihe karışıyor.',
    items: ['Yönetilen bulut altyapısı (BaaS)', 'Global CDN ile ışık hızında yüklenme', 'Otomatik yedekleme ve güncellemeler', 'SSL sertifikası dahil'],
  },
  {
    icon: CreditCard, color: 'bg-coral', title: 'E-Ticaret & Ödeme', desc: 'Satışa hazır, entegre mağazalar.',
    items: ['Güvenli online ödeme altyapısı', 'Kargo anlaşması ve takip entegrasyonu', 'Stok ve sipariş panelleri', 'Fatura ve teslimat otomasyonları'],
  },
  {
    icon: Megaphone, color: 'bg-sage', title: 'Pazarlama & Analitik', desc: 'Her kuruşun hesabı tutan kampanyalar.',
    items: ['Google Ads & Search Console', 'Google Analytics ile ölçümleme', 'Meta (Instagram/Facebook) reklam yönetimi', 'Aylık şeffaf performans raporları'],
  },
  {
    icon: Palette, color: 'bg-fog', title: 'Tasarım & İşbirliği', desc: 'Onay süreciniz şeffaf ve hızlı.',
    items: ['Prototip ve tasarım konsepti onayı', 'Gerçek zamanlı işbirliği araçları', 'Müşteri portalında süreç takibi', 'Panelden bağımsız içerik yönetimi'],
  },
  {
    icon: ShieldCheck, color: 'bg-mint', title: 'Güvenlik & Sürdürülebilirlik', desc: 'Veriniz ve itibarınız güvende.',
    items: ['Rol bazlı erişim kontrolü', 'Veri yalıtımı ve izin yönetimi', 'Performans optimizasyonu (%90+ hız puanı)', 'Yayın sonrası bakım paketleri'],
  },
];

export default function TechPage() {
  const { tl } = useLanguage();
  useSeo({
    title: 'Teknoloji Yığını — Modern, Hızlı ve Güvenli Altyapı | Dijitrak',
    description: 'React tabanlı arayüzler, bulut altyapısı, e-ticaret entegrasyonları ve güvenlik standartları — teknoloji seçimimizde tek kriter: ölçülebilir sonuç.',
    path: '/teknoloji',
  });
  return (
    <div className="pt-36 md:pt-44 pb-24 max-w-6xl mx-auto px-5 md:px-6">
      <span className="inline-block rounded-full border border-mint/40 bg-mint/10 text-mint font-mono text-xs px-4 py-1.5">{tl('TEKNOLOJİ YIĞINI')}</span>
      <h1 className="font-display text-4xl md:text-6xl font-semibold mt-4 tracking-tight">{tl('Kullandığımız teknolojiler')}</h1>
      <p className="text-foreground/70 mt-4 max-w-2xl text-lg">
        {tl('Modası geçmeyen, hızlı ve güvenli altyapılar kuruyoruz. Teknoloji seçiminde tek kriterimiz: işletmenize ölçülebilir sonuç getirmesi.')}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
        {STACK.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.06}>
            <div className="h-full bg-card rounded-3xl border border-border p-6 hover:border-mint/50 transition-colors">
              <span className={`w-11 h-11 rounded-2xl ${s.color} text-ink flex items-center justify-center`}>
                <s.icon className="w-5 h-5" />
              </span>
              <h2 className="font-display font-semibold text-lg mt-4">{tl(s.title)}</h2>
              <p className="text-xs text-foreground/60 mt-1">{tl(s.desc)}</p>
              <ul className="mt-4 space-y-2">
                {s.items.map((it) => (
                  <li key={it} className="text-sm text-foreground/75 flex items-start gap-2">
                    <Cpu className="w-3.5 h-3.5 text-mint shrink-0 mt-1" /> {tl(it)}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-14 grid md:grid-cols-3 gap-4">
        {[
          { icon: Gauge, value: '90+', label: tl('Ortalama hız puanı') },
          { icon: ShieldCheck, value: 'SSL', label: tl('Her sitede standart') },
          { icon: Cloud, value: '99.9%', label: tl('Erişilebilirlik hedefi') },
        ].map((m) => (
          <div key={m.label} className="bg-card rounded-3xl border border-border p-6 flex items-center gap-4">
            <span className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center text-mint shrink-0"><m.icon className="w-5 h-5" /></span>
            <div>
              <p className="font-display font-bold text-2xl">{m.value}</p>
              <p className="text-xs text-foreground/60">{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-foreground/70 text-sm mt-10">
        {tl('Teknolojiden çok sonuca odaklıyız — ')}<Link to="/is-surecleri" className="text-mint font-semibold hover:underline">{tl('nasıl çalıştığımızı')}</Link> {tl('inceleyin.')}
      </p>
    </div>
  );
}