import React from 'react';

const STEPS = [
  { id: 'planned', label: 'Planlama' },
  { id: 'in_progress', label: 'Tasarım & Geliştirme' },
  { id: 'review', label: 'İnceleme' },
  { id: 'launched', label: 'Yayın' },
];

/** Proje zaman çizelgesi — müşterinin projesi hangi aşamada, düz çizgi-milestone görünümü */
export default function ProjectTimeline({ status }) {
  const idx = Math.max(0, STEPS.findIndex((s) => s.id === status));
  return (
    <div className="mt-5">
      <span className="font-mono text-xs uppercase text-mint">Süreç</span>
      <div className="flex items-start mt-3">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center shrink-0 w-16 sm:w-20">
              <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-mono text-[10px] font-bold ${i < idx ? 'bg-mint border-mint text-ink' : i === idx ? 'border-mint text-mint bg-mint/10' : 'border-border text-muted-foreground'}`}>
                {i < idx ? '✓' : i + 1}
              </span>
              <span className={`font-mono text-[10px] mt-1.5 text-center leading-tight ${i <= idx ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 mt-3.5 min-w-2 ${i < idx ? 'bg-mint' : 'bg-border'}`} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}