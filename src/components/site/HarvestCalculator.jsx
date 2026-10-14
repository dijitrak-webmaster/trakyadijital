import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Flower2, TrendingUp } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/lib/LanguageContext';
import IconBadge from '@/components/site/IconBadge';

const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'];
const BASE = 2000;

export default function HarvestCalculator() {
  const { tl } = useLanguage();
  const [level, setLevel] = useState(50);
  const data = MONTHS.map((m, i) => ({ m: tl(m), v: Math.round(BASE * (1 + (level / 100) * 0.4 * i * (1 + i * 0.15))) }));
  const visitors = data[data.length - 1].v;
  const leads = Math.round(visitors * 0.025);

  return (
    <div id="hesaplayici" className="group scroll-mt-28 bg-sun text-ink rounded-3xl p-6 md:p-7 grid sm:grid-cols-2 gap-6">
      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display font-semibold text-3xl leading-[1.05]">{tl('SEO Kâr Hesaplayıcı')}</h3>
          <IconBadge icon={TrendingUp} />
        </div>
        <p className="mt-3 text-sm text-ink/75">{tl('SEO yatırım seviyenizi kaydırın, 6 aylık tahmini getirinizi görün.')}</p>
        <div className="mt-6">
          <Slider value={[level]} max={150} step={5} onValueChange={([v]) => setLevel(v)} className="[&_[role=slider]]:bg-ink [&_[role=slider]]:border-ink [&>span:first-child]:bg-ink/15 [&>span:first-child>span]:bg-ink" />
          <div className="mt-2 flex justify-between text-sm font-mono font-medium">
            <span>0</span><span>%{level}</span><span>150</span>
          </div>
        </div>
        <IconBadge icon={Flower2} tile="bg-mint" className="mt-auto hidden sm:flex -rotate-6" />
      </div>
      <div className="bg-ink text-foreground rounded-2xl p-4 flex flex-col">
        <div className="flex justify-between">
          <div><div className="font-display text-2xl font-semibold">{visitors.toLocaleString('tr-TR')}</div><div className="text-xs text-foreground/60">{tl('aylık ziyaretçi')}</div></div>
          <div className="text-right"><div className="font-display text-2xl font-semibold text-mint">{leads}</div><div className="text-xs text-foreground/60">{tl('potansiyel müşteri')}</div></div>
        </div>
        <div className="h-36 mt-3 -ml-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="harvest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--mint))" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(var(--mint))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" tick={{ fill: 'hsl(var(--foreground) / 0.55)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Area type="monotone" dataKey="v" stroke="hsl(var(--mint))" strokeWidth={2.5} fill="url(#harvest)" animationDuration={500} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}