import React from 'react';
import { Quote } from 'lucide-react';

// ⭐ Sohbet içinde gerçek müşteri yorumları
export default function TestimonialBubbles({ items }) {
  if (!items?.length) return null;
  // ⭐ kart şeritleri mint / sun / coral renklerinde dönüşümlü
  const STRIPES = ['border-l-mint', 'border-l-sun', 'border-l-coral'];
  return (
    <div className="mt-3 space-y-2">
      {items.map((t, i) => (
        <div key={i} className={`rounded-xl border border-mint/25 border-l-4 ${STRIPES[i % 3]} bg-background/60 p-3`}>
          <div className="flex items-start gap-2">
            <Quote className="w-3.5 h-3.5 text-mint shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-foreground/90">“{t.text}”</p>
          </div>
          <p className="mt-1.5 font-mono text-[10px] text-mint">
            {t.author}{t.role ? ` · ${t.role}` : ''}{t.project ? ` · ${t.project}` : ''}
          </p>
        </div>
      ))}
    </div>
  );
}