import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Reveal from '@/components/site/Reveal';
import { useAssistant } from '@/lib/AssistantContext';

const fmtPrice = (p) =>
  `${p.price[0].toLocaleString('tr-TR')}₺ – ${p.price[1].toLocaleString('tr-TR')}₺${p.monthly ? ' / ay' : ''}`;

export default function SectorPackages({ sector }) {
  const { openAssistant } = useAssistant();
  if (!sector.packages?.length) return null;

  return (
    <section>
      <Reveal>
        <span className="font-mono text-xs text-mint uppercase tracking-widest">Hizmet Paketleri</span>
        <h2 className="mt-2 font-display font-semibold text-4xl md:text-5xl">{sector.name} işletmeniz için hazır paketler</h2>
        <p className="mt-3 text-foreground/70 max-w-2xl">İhtiyacınızın büyüklüğüne göre seçebileceğiniz, kapsamı ve teslim süresi net paketler; hepsi Dijitrak güvencesiyle.</p>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-4 mt-8 items-stretch">
        {sector.packages.map((pkg, i) => (
          <Reveal key={pkg.name} delay={i * 0.08} className="h-full">
            <div className={`h-full flex flex-col rounded-3xl bg-card border p-7 transition-all hover:-translate-y-1 hover:shadow-sticker ${i === 1 ? 'border-mint/60' : 'border-border'}`}>
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">{pkg.tag}</span>
              <h3 className="mt-2 font-display font-semibold text-2xl leading-tight">{pkg.name}</h3>
              <p className="mt-3 font-display font-semibold text-xl text-mint">{fmtPrice(pkg)}</p>
              <p className="font-mono text-xs text-muted-foreground mt-1">Teslim: {pkg.duration}</p>
              <ul className="mt-5 space-y-2.5 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/75 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-mint shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => openAssistant({ intent: 'quote' })}
                className="group mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-mint text-ink font-semibold px-6 py-2.5 hover:-translate-y-0.5 transition-all"
              >
                Teklif Al <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}