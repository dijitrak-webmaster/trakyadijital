import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History, Loader2, Check, X, ArrowRight, ScanSearch, MailCheck } from 'lucide-react';
import Reveal from '@/components/site/Reveal';
import { useLanguage } from '@/lib/LanguageContext';
import { base44 } from '@/api/base44Client';
import { openToolsDrawer } from '@/lib/seoScan';
import ToolAssistantCta from '@/components/site/ToolAssistantCta';

const STEPS = [
  'Siteye bağlanılıyor…',
  'Kaynak kod ve sunucu başlıkları okunuyor…',
  'Teknoloji ve yaş sinyalleri aranıyor…',
  'Kuşak puanı hesaplanıyor…',
];

const SCORE_COLOR = (score) =>
  score >= 80 ? 'text-mint' : score >= 60 ? 'text-sun' : 'text-coral';

export default function SiteAgePage() {
  const { tl } = useLanguage();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);
  const [result, setResult] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => setTick((t) => t + 1), 900);
    return () => clearInterval(interval);
  }, [loading]);

  const runCheck = async () => {
    if (!url.trim() || loading) return;
    setLoading(true);
    setFailed(false);
    setResult(null);
    setTick(0);
    try {
      const res = await base44.functions.invoke('siteAgeCheck', { url });
      if (res.data && res.data.error) setFailed(true);
      else setResult(res.data);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-6 py-12 md:py-16">
      <Reveal>
        <p className="font-mono text-[10px] uppercase tracking-widest text-mint">ÜCRETSİZ ARAÇ · kayıt gerekmez</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl mt-2 flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-coral text-ink grid place-items-center shrink-0"><History className="w-6 h-6" /></span>
          {tl('"Sitem Eski mi?" Testi')}
        </h1>
        <p className="text-sm text-foreground/70 mt-3 leading-relaxed max-w-xl">
          {tl('Mevcut sitenizin adresini yapıştırın; telif yılı, mobil uyum, eski teknoloji izleri ve 4+ kuşak sinyalini tarayıp sitenizin hangi çağda olduğunu puanlarız.')}</p>
      </Reveal>

      <Reveal delay={0.08} className="mt-8">
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              autoFocus
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runCheck()}
              placeholder="örn. isletmem.com"
              className="flex-1 rounded-2xl bg-terminal border border-border px-4 py-3 text-base placeholder:text-muted-foreground focus:outline-none focus:border-mint"
            />
            <button
              type="button"
              onClick={runCheck}
              disabled={!url.trim() || loading}
              className="rounded-full bg-mint text-ink font-semibold px-6 py-3 hover:shadow-sticker transition-all disabled:opacity-40 whitespace-nowrap flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <History className="w-4 h-4" />}
              {loading ? tl('Taranıyor…') : tl('Tara')}
            </button>
          </div>
          {failed && <p className="mt-4 text-sm text-coral">{tl('Siteye ulaşılamadı — adresi kontrol edin (örn. isletmem.com). Site kapalıysa bizimle yazın, birlikte bakalım.')}</p>}
        </div>
      </Reveal>

      {loading && (
        <div className="mt-6 space-y-3 py-4">
          {STEPS.map((s, i) => (
            <div key={s} className={`flex items-center gap-3 text-sm ${i <= tick ? 'text-foreground' : 'text-muted-foreground/60'}`}>
              {i < tick ? <Check className="w-4 h-4 text-mint" /> : i === tick ? <Loader2 className="w-4 h-4 text-mint animate-spin" /> : <span className="w-4" />}
              {s}
            </div>
          ))}
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 90, damping: 16 }} className="mt-6 space-y-5">
          <div className="rounded-3xl border border-border bg-card p-6 flex items-center gap-5">
            <div className="w-20 h-20 rounded-full border-4 border-border grid place-items-center shrink-0">
              <span className={`font-display font-bold text-3xl ${SCORE_COLOR(result.score)}`}>{result.score}</span>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{result.grade.letter} KUŞAK · {result.grade.label}</p>
              <h2 className="font-display font-bold text-xl mt-1">{tl('Kuşak raporu')}</h2>
              <p className="text-sm text-foreground/75 mt-1.5 leading-relaxed">{result.verdict}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card divide-y divide-border overflow-hidden">
            {result.checks.map((c) => (
              <div key={c.label} className="p-4 flex items-start gap-3">
                <span className={`w-6 h-6 rounded-lg shrink-0 grid place-items-center ${c.pass ? 'bg-mint/15 text-mint' : 'bg-coral/15 text-coral'}`}>
                  {c.pass ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{c.label}</p>
                  <p className="text-xs text-foreground/60 mt-0.5 leading-relaxed">{c.tip}</p>
                </div>
              </div>
            ))}
          </div>

          <ToolAssistantCta message={`"${url}" sitemi "Sitem Eski mi?" testinde tarattım: ${result.score} puan (${result.grade.label}) aldı. Yenileme önerilerini ve paketini paylaşır mısın?`} />

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/iletisim" className="rounded-full bg-mint text-ink font-semibold px-6 py-3 hover:shadow-sticker transition-all inline-flex items-center justify-center gap-2">
              {tl('Yenileme teklifi al')} <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => openToolsDrawer('seo')}
              className="rounded-full border border-border px-6 py-3 font-semibold text-foreground/80 hover:border-mint hover:text-mint transition-colors inline-flex items-center justify-center gap-2"
            >
              <ScanSearch className="w-4 h-4" /> {tl('Detaylı SEO taraması da yap')}
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5"><MailCheck className="w-3.5 h-3.5" /> {tl('Rapor anlıktır; puan 100 üzerinden kuşak sinyallerinin ağırlıklı toplamıdır.')}</p>
        </motion.div>
      )}
    </div>
  );
}