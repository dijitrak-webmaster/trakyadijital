import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

/** CRM analiz grafikleri: 6 aylık ciro eğrisi + müşteri segment dağılımı. */
export default function CrmCharts({ monthly, segmentDist }) {
  const pieData = segmentDist.filter((s) => s.n > 0);

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 border border-border rounded-2xl bg-card p-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Son 6 Ay · Ciro</p>
        <div className="h-56 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthly} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="crmRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(150 78% 58%)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(150 78% 58%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: 'hsl(43 20% 72%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(43 20% 72%)', fontSize: 11 }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => `₺${v >= 1000 ? `${(v / 1000).toFixed(1)}b` : v}`} />
              <Tooltip
                formatter={(v) => [`₺${Number(v).toLocaleString('tr-TR')}`, 'Ciro']}
                contentStyle={{ background: 'hsl(222 36% 16%)', border: '1px solid hsl(222 25% 24%)', borderRadius: 12, color: 'hsl(43 100% 94%)' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(150 78% 58%)" strokeWidth={2} fill="url(#crmRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="border border-border rounded-2xl bg-card p-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Segment Dağılımı</p>
        {pieData.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground mt-6 text-center">Henüz müşteri verisi yok.</p>
        ) : (
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="n" nameKey="label" innerRadius={50} outerRadius={80} paddingAngle={4} stroke="none">
                  {pieData.map((s) => <Cell key={s.key} fill={s.hex} />)}
                </Pie>
                <Legend formatter={(v) => <span style={{ color: 'hsl(43 20% 72%)', fontSize: 12 }}>{v}</span>} />
                <Tooltip
                  formatter={(v, name) => [`${v} müşteri`, name]}
                  contentStyle={{ background: 'hsl(222 36% 16%)', border: '1px solid hsl(222 25% 24%)', borderRadius: 12, color: 'hsl(43 100% 94%)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}