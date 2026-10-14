import React from 'react';
import { base44 } from '@/api/base44Client';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import useSiteSettings from '@/hooks/useSiteSettings';

const GROUPS = [
  {
    title: 'Modüller',
    keys: [['market_enabled', 'Market']],
  },
  {
    title: 'Ana Sayfa Bölümleri',
    keys: [
      ['show_hero', 'Hero (üst banner)'], ['show_marquee', 'Kayan şerit'], ['show_stats', 'İstatistikler'],
      ['show_services', 'Hizmetler'], ['show_why', 'Neden Dijitrak'], ['show_sectors', 'Sektörler'],
      ['show_process', 'Süreç'], ['show_packages', 'Paket karşılaştırma'], ['show_simulator', 'Simülatör CTA'],
      ['show_tools', 'Araçlar'], ['show_calculator', 'Hesaplayıcı + vaka'], ['show_portfolio', 'Portfolyo'],
      ['show_testimonials', 'Referanslar'], ['show_instagram', 'Instagram'], ['show_faq', 'SSS'],
      ['show_explore', 'Keşfet bağlantıları'], ['show_cta', 'CTA banner'],
    ],
  },
];

/** Site modülleri ve ana sayfa bölümlerini aç-kapa; değişiklik anında siteye yansır. */
export default function SectionToggles() {
  const [s] = useSiteSettings();
  const { toast } = useToast();
  const id = s.id;

  const toggle = async (key) => {
    if (!id) return;
    try {
      await base44.entities.SiteSettings.update(id, { [key]: !s[key] });
      toast({ title: 'Kaydedildi', description: 'Değişiklik siteye anında yansıdı.' });
    } catch (e) {
      toast({ title: 'Güncellenemedi', description: e.message });
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {GROUPS.map((g) => (
        <div key={g.title} className="border border-border rounded-2xl bg-card/50 p-5">
          <p className="font-mono text-xs uppercase text-mint">{g.title}</p>
          <div className="mt-4 space-y-3">
            {g.keys.map(([k, label]) => (
              <div key={k} className="flex items-center justify-between gap-3">
                <span className="text-sm">{label}</span>
                <Switch checked={!!s[k]} disabled={!id} onCheckedChange={() => toggle(k)} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}