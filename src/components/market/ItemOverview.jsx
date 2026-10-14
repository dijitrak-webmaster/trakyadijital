import React, { useState } from 'react';
import { Check, ClipboardCheck, MessageSquareText, Monitor, Rocket, Smartphone, Tablet } from 'lucide-react';
import { parseFeatures } from '@/lib/marketUtils';

const STEPS = [
  { icon: MessageSquareText, title: 'Talep', desc: 'Sepetinizi gönderin; aynı gün dönüş yaparız.' },
  { icon: ClipboardCheck, title: 'Onay & Teklif', desc: 'Kapsamı netleştirir, resmî teklifi ve ödeme bağlantısını paylaşırız.' },
  { icon: Rocket, title: 'Teslim', desc: 'Onayınız sonrası üretime geçer, söz verilen günde teslim ederiz.' },
];
const DEVICES = [[Monitor, 'Masaüstü'], [Tablet, 'Tablet'], [Smartphone, 'Mobil']];
const TABS = [['overview', 'Genel Bakış'], ['process', 'Satın Alma Süreci']];

export default function ItemOverview({ item }) {
  const [tab, setTab] = useState('overview');
  const features = parseFeatures(item.features);

  return (
    <div className="rounded-3xl border border-border bg-card">
      <div className="flex gap-1 border-b border-border px-3 overflow-x-auto">
        {TABS.map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 py-4 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${tab === k ? 'border-mint text-mint' : 'border-transparent text-foreground/60 hover:text-foreground'}`}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="p-5 md:p-7">
        {tab === 'overview' ? (
          <div className="space-y-6">
            {item.description && <p className="text-foreground/80 leading-relaxed md:text-lg">{item.description}</p>}
            {features.length > 0 && (
              <div>
                <p className="font-mono text-xs uppercase text-mint">Öne çıkan özellikler</p>
                <div className="mt-3 grid sm:grid-cols-2 gap-2.5">
                  {features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 rounded-full bg-secondary/60 border border-border px-4 py-2.5 text-sm">
                      <Check className="w-4 h-4 text-mint shrink-0" />
                      <p className="first-letter:uppercase">{f}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {item.preview_url && (
              <div className="flex flex-wrap gap-2.5">
                {DEVICES.map(([Icon, l]) => (
                  <span key={l} className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-xs text-foreground/75">
                    <Icon className="w-4 h-4 text-mint" /> {l} uyumlu
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <ol className="space-y-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="grid place-items-center w-11 h-11 rounded-2xl bg-mint/10 text-mint shrink-0"><s.icon className="w-5 h-5" /></span>
                <div>
                  <p className="font-display font-semibold">{i + 1}. {s.title}</p>
                  <p className="text-sm text-foreground/65 mt-1">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}