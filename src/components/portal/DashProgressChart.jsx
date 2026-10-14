import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowRight } from 'lucide-react';

const BAR_COLORS = ['#2ecc8f', '#f5c518', '#ff7a59', '#7fc7a4', '#8fa8c7'];

/** Projelerin ilerleme grafiği — dashboard görünümü */
export default function DashProgressChart({ projects, goto }) {
  const data = (projects || []).slice(0, 5).map((p) => ({
    name: p.title.length > 14 ? `${p.title.slice(0, 13)}…` : p.title,
    value: Math.min(100, Math.max(0, p.progress || 0)),
  }));

  return (
    <div className="bg-card border border-border rounded-3xl p-6 h-full">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold">Proje İlerlemesi</h3>
        <button onClick={() => goto('projects')} className="font-mono text-xs text-mint inline-flex items-center gap-1">
          Projeler <ArrowRight className="w-3 h-3" />
        </button>
      </div>
      {data.length ? (
        <div className="mt-4 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
              <XAxis dataKey="name" tick={{ fill: 'hsl(43 20% 72%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} interval={0} />
              <YAxis domain={[0, 100]} tick={{ fill: 'hsl(43 20% 72%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: 'hsl(222 30% 20% / 0.5)' }}
                contentStyle={{ background: 'hsl(222 36% 16%)', border: '1px solid hsl(222 25% 24%)', borderRadius: 12, fontSize: 12 }}
                formatter={(v) => [`%${v}`, 'Tamamlanma']}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={38}>
                {data.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mt-4">Grafik için henüz proje yok.</p>
      )}
    </div>
  );
}