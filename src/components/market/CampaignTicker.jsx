import React from 'react';
import { Sparkles } from 'lucide-react';

/** Hero altındaki kayan kampanya şeridi — kodlar ve fırsatlar sürekli akar. */
export default function CampaignTicker({ campaigns = [] }) {
  const parts = [
    ...campaigns.map((c) =>
      c.discount_type === 'fixed'
        ? `${(c.discount_value || 0).toLocaleString('tr-TR')} ₺ İNDİRİM — KOD: ${c.code}`
        : `%${c.discount_value} İNDİRİM — KOD: ${c.code}`
    ),
    'BUNDLE PAKETLERDE EKSTRA AVANTAJ',
    'TEMALARI CANLI ÖNİZLEMEYLE DENE',
    'DİJİBOT SANA ÖZEL PAKET KURAR',
  ];

  const row = [...parts, ...parts];

  return (
    <div className="mt-10 border-y-2 border-ink bg-sun text-ink overflow-hidden">
      <div className="flex w-max animate-marquee-x py-2.5">
        {row.map((p, i) => (
          <span key={i} className="flex items-center gap-4 px-4 font-mono text-xs font-bold tracking-widest whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 shrink-0" /> {p}
          </span>
        ))}
      </div>
    </div>
  );
}