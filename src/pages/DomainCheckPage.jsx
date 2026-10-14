import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, AtSign, Loader2, CheckCircle2, XCircle, HelpCircle, ArrowRight, MailCheck } from 'lucide-react';
import Reveal from '@/components/site/Reveal';
import ToolAssistantCta from '@/components/site/ToolAssistantCta';
import { useLanguage } from '@/lib/LanguageContext';
import { base44 } from '@/api/base44Client';

const STATE_STYLE = {
  available: { label: 'MÜSAİT', cls: 'border-mint bg-mint/10 text-mint', Icon: CheckCircle2 },
  taken: { label: 'ALINMIŞ', cls: 'border-coral/60 bg-coral/10 text-coral', Icon: XCircle },
  unknown: { label: 'SORGULANAMADI', cls: 'border-border bg-card text-muted-foreground', Icon: HelpCircle },
};

export default function DomainCheckPage() {
  const { tl } = useLanguage();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const runCheck = async () => {
    if (!name.trim() || loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await base44.functions.invoke('domainCheck', { name });
      setResult(res.data);
    } catch {
      setError('Kontrol başarısız oldu, tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-6 py-12 md:py-16">
      <Reveal>
        <p className="font-mono text-[10px] uppercase tracking-widest text-mint">ÜCRETSİZ ARAÇ · kayıt gerekmez</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl mt-2 flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-sun text-ink grid place-items-center shrink-0"><Globe className="w-6 h-6" /></span>
          {tl('Alan Adı & E-posta Kontrolü')}
        </h1>
        <p className="text-sm text-foreground/70 mt-3 leading-relaxed max-w-xl">
          {tl('İşletme adınızı yazın; .com, .com.tr ve diğer alan adlarının müsaitliğini saniyeler içinde kontrol edip size profesyonel bir e-posta adresi öneriyoruz.')}</p>
      </Reveal>

      <Reveal delay={0.08} className="mt-8">
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runCheck()}
              placeholder={tl('örn. Ayçiçek Emlak')}
              className="flex-1 rounded-2xl bg-terminal border border-border px-4 py-3 text-base placeholder:text-muted-foreground focus:outline-none focus:border-mint"
            />
            <button
              type="button"
              onClick={runCheck}
              disabled={!name.trim() || loading}
              className="rounded-full bg-mint text-ink font-semibold px-6 py-3 hover:shadow-sticker transition-all disabled:opacity-40 whitespace-nowrap flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              {loading ? tl('Kontrol ediliyor…') : tl('Kontrol Et')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {['Kervan Pide', 'Mürefte Bağları', 'Çorlu Makina'].map((ex) => (
              <button key={ex} type="button" onClick={() => setName(ex)} className="rounded-full border border-border px-3 py-1 text-[11px] font-mono text-muted-foreground hover:border-mint hover:text-mint transition-colors">
                {ex}
              </button>
            ))}
          </div>
          {error && <p className="mt-4 text-sm text-coral">{error}</p>}
        </div>
      </Reveal>

      {result && (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 90, damping: 16 }} className="mt-6 space-y-4">
          <p className="text-sm text-foreground/70">
            {tl('İşletmeniz için önerdiğimiz alan adı kökü:')} <span className="font-mono font-semibold text-mint">{result.slug}</span>
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.domains.map((d) => {
              const s = STATE_STYLE[d.state] || STATE_STYLE.unknown;
              return (
                <div key={d.tld} className={`rounded-2xl border p-4 flex items-center justify-between ${s.cls}`}>
                  <span className="flex items-center gap-2.5 font-mono font-semibold text-base">
                    <s.Icon className="w-5 h-5" /> {result.slug}.{d.tld}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest font-bold">{s.label}</span>
                </div>
              );
            })}
          </div>

          {result.emailSuggestion && (
            <div className="rounded-3xl border border-mint/50 bg-mint/10 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="w-11 h-11 rounded-2xl bg-mint text-ink grid place-items-center shrink-0"><MailCheck className="w-6 h-6" /></span>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-lg">{tl('Profesyonel e-posta öneriniz')}</h3>
                <p className="text-sm text-foreground/75 mt-1">
                  <span className="font-mono font-semibold text-mint">{result.emailSuggestion}</span> — {tl('Gmail adresi yerine kendi alan adınızla e-posta, müşteride kurumsal güven yaratır. Alan adı + e-posta kurulumunu teklifimize dahil edebiliriz.')}
                </p>
              </div>
            </div>
          )}

          <ToolAssistantCta
            message={`Alan adı kontrolü yaptım: "${result.slug}" için ${result.emailSuggestion ? `${result.emailSuggestion} uygun görünüyor` : 'alan adlarının çoğu alınmış'}. Sohbette bana müsait alan adları önerir misin?`}
            domain={{ business: result.slug }}
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/iletisim" className="rounded-full bg-mint text-ink font-semibold px-6 py-3 hover:shadow-sticker transition-all inline-flex items-center justify-center gap-2">
              {tl('Alan adı + site teklifi al')} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/fiyatlandirma" className="rounded-full border border-border px-6 py-3 font-semibold text-foreground/80 hover:border-mint hover:text-mint transition-colors inline-flex items-center justify-center gap-2">
              {tl('Paketleri gör')}
            </Link>
          </div>
          <p className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5"><AtSign className="w-3.5 h-3.5" /> {tl('.com/.net/.org canlı kayıt veritabanından (RDAP) sorgulanır; .com.tr DNS kanıtıyla doğrulanır — şüphede bize yazın, kesin kontrol edelim.')}</p>
        </motion.div>
      )}
    </div>
  );
}