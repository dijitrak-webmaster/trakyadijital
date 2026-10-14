import React, { useState } from 'react';
import { Search, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { probeDomain } from '@/lib/radarData';

// alan adı girişi + canlı erişilebilirlik ölçümü kartı
export default function RadarForm({ onResult }) {
  const { tl } = useLanguage();
  const [domain, setDomain] = useState('');
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!domain.trim() || busy) return;
    setBusy(true);
    const res = await probeDomain(domain);
    setBusy(false);
    onResult(res);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2.5">
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          placeholder={tl('rakipsiteniz.com')}
          className="flex-1 rounded-2xl border-2 border-border bg-terminal px-4 py-3 text-sm font-semibold placeholder:text-foreground/35 focus:border-mint focus:outline-none"
        />
        <button
          onClick={run}
          disabled={busy || !domain.trim()}
          className="rounded-2xl bg-mint text-ink font-semibold px-6 py-3 inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-sticker transition-all disabled:opacity-40"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {busy ? tl('Ölçülüyor...') : tl('Analiz Et')}
        </button>
      </div>
      <p className="text-xs text-foreground/50 mt-2.5">
        {tl('Sadece erişilebilirlik ve yanıt süresi ölçülür; site içeriği okunmaz.')}
      </p>
    </div>
  );
}

// ölçüm sonucu şeridi
export function RadarTechCard({ probe, onReset }) {
  const { tl } = useLanguage();
  if (!probe) return null;
  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {probe.ok ? (
          <>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-mint"><CheckCircle2 className="w-4 h-4" /> {tl('Erişilebilir (HTTPS)')}</span>
            <span className="text-sm text-foreground/75">{tl('Yaklaşık yanıt süresi:')} <span className="font-mono text-mint">{probe.ms} ms</span></span>
          </>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-coral"><XCircle className="w-4 h-4" /> {tl('Tarayıcıdan ulaşılamadı — adresi kontrol edin. Listeyi işaretleyerek devam edebilirsiniz.')}</span>
        )}
      </div>
      <p className="text-[11px] text-foreground/50 mt-2">{tl('Tarayıcı üzerinden kaba ölçümdür; kesin hız raporu PageSpeed denetimiyle verilir.')}</p>
      <button onClick={onReset} className="mt-2 text-xs text-muted-foreground hover:text-mint transition-colors">{tl('Başka bir site dene')}</button>
    </div>
  );
}