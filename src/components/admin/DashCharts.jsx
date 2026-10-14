import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#7fe2b0', '#ffe14d', '#ff7a75', '#b9e0cf', '#8fa0b5', '#c0a8ff'];
const TOOLTIP = { backgroundColor: '#131a2b', border: '1px solid #2a3450', borderRadius: 12, fontSize: 12 };

/** Haftalık talep akışı ve sektör dağılımı grafikleri */
export default function DashCharts({ leads }) {
  const now = Date.now();
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const end = now - (7 - i) * 604800000;
    const start = end - 604800000;
    return {
      label: new Date(end).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
      talep: leads.filter((l) => { const t = new Date(l.created_date).getTime(); return t > start && t <= end; }).length,
    };
  });
  const sectors = Object.entries(
    leads.reduce((acc, l) => { const k = l.sector || 'Belirtilmedi'; acc[k] = (acc[k] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="border border-border rounded-2xl p-5 lg:col-span-3 bg-card/50">
        <p className="font-mono text-xs uppercase text-mint">Haftalık talep akışı</p>
        <div className="h-56 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeks} margin={{ top: 4, right: 8, bottom: 0, left: -22 }}>
              <defs>
                <linearGradient id="mintFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7fe2b0" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#7fe2b0" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3450" />
              <XAxis dataKey="label" tick={{ fill: '#8fa0b5', fontSize: 11 }} axisLine={{ stroke: '#2a3450' }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: '#8fa0b5', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP} labelStyle={{ color: '#7fe2b0' }} />
              <Area type="monotone" dataKey="talep" stroke="#7fe2b0" strokeWidth={2.5} fill="url(#mintFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="border border-border rounded-2xl p-5 lg:col-span-2 bg-card/50">
        <p className="font-mono text-xs uppercase text-mint">Sektör dağılımı</p>
        <div className="h-56 mt-4">
          {sectors.length === 0 ? (
            <div className="h-full flex items-center justify-center font-mono text-xs text-muted-foreground">Veri yok</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sectors} dataKey="value" nameKey="name" innerRadius={42} outerRadius={72} paddingAngle={3}>
                  {sectors.map((s, i) => <Cell key={s.name} fill={COLORS[i % COLORS.length]} stroke="#131a2b" />)}
                </Pie>
                <Tooltip contentStyle={TOOLTIP} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#8fa0b5' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}