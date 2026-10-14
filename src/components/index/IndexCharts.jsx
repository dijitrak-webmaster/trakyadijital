import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Cell } from 'recharts';
import { sectorScores, trendSeries } from '@/lib/trakyaIndexData';

const PALETTE = ['hsl(150,62%,68%)', 'hsl(46,100%,62%)', 'hsl(12,100%,67%)'];
const AXIS = { fill: 'hsl(43,20%,72%)', fontSize: 10 };
const TOOLTIP_STYLE = { background: 'hsl(222,36%,16%)', border: '1px solid hsl(222,25%,24%)', borderRadius: 12, color: 'hsl(43,100%,94%)', fontSize: 12 };

export function SectorChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={sectorScores} margin={{ top: 8, right: 8, left: -22, bottom: 4 }}>
        <XAxis dataKey="name" tick={AXIS} interval={0} angle={-18} textAnchor="end" height={52} axisLine={false} tickLine={false} tickFormatter={(v) => v.split(' & ')[0]} />
        <YAxis tick={AXIS} domain={[0, 100]} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'hsl(222,30%,20%,0.35)' }} />
        <Bar dataKey="score" radius={[6, 6, 0, 0]}>
          {sectorScores.map((s, i) => <Cell key={s.name} fill={PALETTE[i % PALETTE.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={trendSeries} margin={{ top: 8, right: 12, left: -22, bottom: 4 }}>
        <CartesianGrid stroke="hsl(222,25%,24%)" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="q" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} domain={[25, 60]} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Line type="monotone" dataKey="v" name="Endeks" stroke="hsl(46,100%,62%)" strokeWidth={3} dot={{ r: 3, fill: 'hsl(46,100%,62%)' }} />
      </LineChart>
    </ResponsiveContainer>
  );
}