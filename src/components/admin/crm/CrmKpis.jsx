import React from 'react';
import { Wallet, TrendingUp, Gauge, AlertTriangle, Repeat } from 'lucide-react';

/** CRM analiz sayfasının üst KPI şeridi — para + memnuniyet odaklı özet. */
export default function CrmKpis({ kpis }) {
  const cards = [
    { label: 'Aylık Yinelenen Gelir (MRR)', value: `₺${kpis.totalMrr.toLocaleString('tr-TR')}`, icon: Wallet, cls: 'text-mint border-mint/50' },
    { label: '90 Günlük Ciro', value: `₺${kpis.revenue90.toLocaleString('tr-TR')}`, sub: `${kpis.orderCount} sipariş`, icon: TrendingUp, cls: 'text-sun border-sun/50' },
    { label: 'Ortalama Sağlık Skoru', value: `${kpis.avgScore}/100`, sub: `${kpis.total} müşteri`, icon: Gauge, cls: 'text-fog border-fog/50' },
    { label: 'Riskli Müşteri', value: kpis.risky, sub: 'skoru 45 altında', icon: AlertTriangle, cls: 'text-coral border-coral/50' },
  ];
  if (kpis.conversion != null) {
    cards.push({ label: 'Lead → Müşteri', value: `${kpis.conversion}%`, sub: 'kapanan taleplerde', icon: Repeat, cls: 'text-mint border-mint/50' });
  }

  return (
    <div className={`grid gap-3 ${cards.length === 5 ? 'sm:grid-cols-2 lg:grid-cols-5' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
      {cards.map((c) => (
        <div key={c.label} className={`border ${c.cls} rounded-2xl bg-card p-4`}>
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{c.label}</p>
            <c.icon className="w-4 h-4 opacity-70" />
          </div>
          <p className="font-display text-2xl font-semibold mt-2">{c.value}</p>
          {c.sub && <p className="font-mono text-[11px] text-muted-foreground mt-0.5">{c.sub}</p>}
        </div>
      ))}
    </div>
  );
}