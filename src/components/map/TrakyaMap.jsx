import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TRAKYA_GEO } from '@/lib/trakyaGeo';
import { scoreColor } from '@/lib/trakyaMapData';
import useDistrictScores from '@/hooks/useDistrictScores';

// Trakya Dijital Haritası — OpenStreetMap gerçek ilçe sınırları üzerinde
// skor renklendirmesi (choropleth). slug'ı olan 10 ilçe tıklanabilir.
export default function TrakyaMap() {
  const navigate = useNavigate();
  const scores = useDistrictScores();
  const bySlug = Object.fromEntries(scores.map((d) => [d.slug, d.score]));
  const tracked = TRAKYA_GEO.districts.filter((d) => d.slug && bySlug[d.slug] != null);
  const top = tracked.length ? tracked.reduce((a, b) => (b.score > a.score ? b : a)) : null;

  return (
    <div className="rounded-[2rem] border border-border bg-terminal overflow-hidden">
      <svg viewBox={`0 0 ${TRAKYA_GEO.w} ${TRAKYA_GEO.h}`} className="w-full h-auto select-none" role="img" aria-label="Trakya dijital haritası">
        {/* denizler */}
        <text x="688" y="46" fill="hsl(var(--muted-foreground))" fontSize="14" fontFamily="var(--font-mono)" opacity="0.7">KARADENİZ</text>
        <text x="664" y="634" fill="hsl(var(--muted-foreground))" fontSize="14" fontFamily="var(--font-mono)" opacity="0.7">MARMARA</text>
        <text x="86" y="770" fill="hsl(var(--muted-foreground))" fontSize="14" fontFamily="var(--font-mono)" opacity="0.7">EGE DENİZİ</text>

        {/* ilçe poligonları — izlenenler skora göre boyanır */}
        {TRAKYA_GEO.districts.map((d) => {
          const score = d.slug ? bySlug[d.slug] : undefined;
          const active = score != null;
          const c = active ? scoreColor(score) : null;
          return (
            <motion.path
              key={d.name}
              d={d.d}
              fill={active ? c : 'hsl(var(--secondary))'}
              fillOpacity={active ? 0.3 : 1}
              stroke={active ? c : 'hsl(var(--border))'}
              strokeWidth={active ? 1.6 : 1}
              style={active ? { cursor: 'pointer' } : undefined}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={active ? { fillOpacity: 0.5, strokeWidth: 2.4 } : undefined}
              transition={{ duration: 0.3 }}
              onClick={active ? () => navigate(`/konum/${d.slug}`) : undefined}
            />
          );
        })}

        {/* öncü ilçe nabzı */}
        {top && (
          <motion.circle
            cx={top.cx} cy={top.cy} r={26}
            fill="none" stroke="hsl(var(--mint))" strokeWidth="2"
            animate={{ r: [26, 44], opacity: [0.7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            pointerEvents="none"
          />
        )}

        {/* izlenen ilçe etiketleri (isim + skor) */}
        {tracked.map((d) => (
          <g key={`l-${d.slug}`} pointerEvents="none">
            <text
              x={d.cx} y={d.cy - 2} textAnchor="middle"
              fontSize="11.5" fontWeight="600" fill="hsl(var(--foreground))"
              style={{ paintOrder: 'stroke', stroke: 'hsl(var(--terminal))', strokeWidth: 3.5, strokeLinejoin: 'round' }}
            >
              {d.name}
            </text>
            <text
              x={d.cx} y={d.cy + 11} textAnchor="middle"
              fontSize="12.5" fontWeight="700" fontFamily="var(--font-mono)" fill={scoreColor(bySlug[d.slug])}
              style={{ paintOrder: 'stroke', stroke: 'hsl(var(--terminal))', strokeWidth: 3.5, strokeLinejoin: 'round' }}
            >
              {bySlug[d.slug]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}