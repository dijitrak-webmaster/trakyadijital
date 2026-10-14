import React from 'react';
import { Star } from 'lucide-react';

/** Yıldız puan göstergesi — puan yoksa hiçbir şey çizmez. */
export default function StarRating({ rating, count, size = 'w-3.5 h-3.5', className = '' }) {
  if (!rating) return null;
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} title={`${rating} / 5${count ? ` · ${count} değerlendirme` : ''}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${size} ${n <= Math.round(rating) ? 'fill-sun text-sun' : 'text-foreground/25'}`} />
      ))}
      <span className="font-mono text-[11px] text-muted-foreground">
        {Number(rating).toLocaleString('tr-TR', { minimumFractionDigits: 1 })}{count ? ` (${count})` : ''}
      </span>
    </span>
  );
}