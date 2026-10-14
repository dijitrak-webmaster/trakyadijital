import React from 'react';

// Teklif/paket akışında adım göstergesi: Hizmet → Sektör → Bilgiler
export default function QuoteSteps({ step, lang }) {
  const idx = step === 'service' ? 0 : step === 'sector' ? 1 : step === 'form' ? 2 : -1;
  if (idx === -1) return null;
  const labels = lang === 'en' ? ['Service', 'Sector', 'Details'] : ['Hizmet', 'Sektör', 'Bilgiler'];
  return (
    <div className="px-4 sm:px-5 pt-4 flex items-center gap-1.5">
      {labels.map((l, i) => (
        <React.Fragment key={l}>
          {i > 0 && <div className={`h-0.5 rounded-full flex-1 ${i <= idx ? 'bg-mint/60' : 'bg-border'}`} />}
          <span className={`rounded-lg border-2 px-2.5 py-1 font-mono text-[10px] font-semibold whitespace-nowrap ${i < idx ? 'bg-mint/15 border-mint/50 text-mint' : i === idx ? 'bg-mint border-ink/25 text-ink shadow-sticker' : 'bg-secondary border-border text-muted-foreground'}`}>
            {i + 1} · {l}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}