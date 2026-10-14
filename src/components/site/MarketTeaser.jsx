import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Eye } from 'lucide-react';
import Reveal from '@/components/site/Reveal';
import { base44 } from '@/api/base44Client';
import RobotMascot from '@/components/mascot/RobotMascot';

/** Anasayfa market tanıtımı — mini bento: tanıtım + cihaz önizleme + vitrin sayacı. */
export default function MarketTeaser() {
  const [count, setCount] = useState(null);
  useEffect(() => {
    base44.entities.MarketItem.filter({ status: 'published' }, '-created_date', 50)
      .then((r) => setCount(r.length))
      .catch(() => {});
  }, []);

  return (
    <Reveal>
      <Link to="/market" className="group grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="col-span-1 lg:col-span-3 flex flex-col items-start gap-3 rounded-3xl border-2 border-dashed border-sun/50 bg-card p-6 md:p-7 hover:border-sun transition-colors">
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-secondary px-4 py-1.5 font-mono text-xs text-sun">
            <ShoppingBag className="w-3.5 h-3.5" /> DİJİTRAK MARKET
          </span>
          <p className="font-display font-semibold text-2xl md:text-3xl leading-snug">
            Temalar, paketler, NFC kartlar ve eklentiler — <span className="text-shimmer">tek vitrinde.</span>
          </p>
          <span className="mt-1 rounded-full bg-sun text-ink font-semibold px-6 py-3 inline-flex items-center gap-2 group-hover:shadow-sticker transition-all">
            Markete Git <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        <div className="col-span-1 lg:col-span-1 flex flex-col justify-between gap-3 rounded-3xl bg-mint text-ink p-5">
          <Eye className="w-6 h-6" />
          <p className="font-display font-bold text-lg leading-snug">Temaları cihaz önizlemesinde dene</p>
          <p className="text-xs font-semibold text-ink/60">iPhone · iPad · Masaüstü</p>
        </div>

        <div className="col-span-1 lg:col-span-2 flex items-center gap-4 rounded-3xl bg-coral text-ink p-5">
          <RobotMascot emotion="happy" className="w-14 h-16 shrink-0" />
          <p className="font-display font-bold text-lg leading-snug">
            {count !== null ? `${count} ürün` : 'Ürünler'} vitrinde seni bekliyor — kararsızsan DijiBot'a sor.
          </p>
        </div>
      </Link>
    </Reveal>
  );
}