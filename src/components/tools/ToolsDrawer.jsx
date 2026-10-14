import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ScanSearch, Loader2, ClipboardCheck, Gauge, Radar, TrendingUp, Map, Calculator, Globe, History } from 'lucide-react';
import ScanResult from '@/components/tools/ScanResult';
import {
  OPEN_TOOLS_EVENT, openToolsDrawer, fetchSite, analyzeHtml, scanSteps,
  checklistItems, scoreOf, gradeOf,
} from '@/lib/seoScan';

const TOOL_MENU = [
  { id: 'seo', icon: ScanSearch, color: 'text-mint', title: 'SEO Tarayıcı', desc: 'Sitenizi tarar, puanlar ve düzeltme planı verir — pencere içinde çalışır.', inline: true },
  { icon: Gauge, color: 'text-sun', title: 'Dijital Olgunluk Testi', desc: '10 soruda puanınız ve yol haritanız.', href: '/olgunluk-testi' },
  { icon: Radar, color: 'text-coral', title: 'Rakip Radarı', desc: 'Rakibinizi ölçün, açık verdiğiniz alanları bulun.', href: '/rakip-radar' },
  { icon: Map, color: 'text-mint', title: 'Trakya Dijital Haritası', desc: 'İlçe ilçe interaktif dijital harita.', href: '/dijital-harita' },
  { icon: TrendingUp, color: 'text-sun', title: 'Trakya Dijital Endeksi', desc: 'Bölgenin çeyreklik dijital adaptasyon skoru.', href: '/trakya-endeks' },
  { icon: Calculator, color: 'text-coral', title: 'Proje Simülatörü', desc: 'Bütçenizi ve takvimi 3 adımda hesaplayın.', href: '/simulasyon' },
  { icon: TrendingUp, color: 'text-sun', title: 'SEO Kâr Hesaplayıcı', desc: 'SEO yatırımınızın 6 aylık tahmini ziyaretçi ve müşteri getirisi.', href: '/#hesaplayici' },
  { icon: Globe, color: 'text-sun', title: 'Alan Adı Kontrolü', desc: 'İşletme adınıza müsait .com/.com.tr ve profesyonel e-posta önerisi.', href: '/alan-adi-kontrolu' },
  { icon: History, color: 'text-coral', title: '"Sitem Eski mi?" Testi', desc: 'Sitenizin hangi kuşakta olduğunu saniyeler içinde puanlar.', href: '/site-yenileme' },
];

// Ücretsiz Araçlar penceresi — sağdan kayarak açılır; DijiBot ve butonlar burayı tetikler
export default function ToolsDrawer() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [step, setStep] = React.useState('menu'); // menu | input | scanning | checklist | result
  const [url, setUrl] = React.useState('');
  const [tick, setTick] = React.useState(0);
  const [result, setResult] = React.useState(null);
  const [marked, setMarked] = React.useState({});

  React.useEffect(() => {
    const listener = (event) => {
      const tool = event?.detail?.tool || 'menu';
      setIsMobile(window.innerWidth < 640);
      setOpen(true);
      setStep(tool === 'seo' ? 'input' : 'menu');
      setUrl('');
      setResult(null);
      setMarked({});
    };
    window.addEventListener(OPEN_TOOLS_EVENT, listener);
    return () => window.removeEventListener(OPEN_TOOLS_EVENT, listener);
  }, []);

  React.useEffect(() => {
    if (step !== 'scanning') return;
    const interval = setInterval(() => setTick((t) => t + 1), 700);
    const timer = setTimeout(runScan, 3200);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [step]);

  const runScan = async () => {
    const html = await fetchSite(url);
    if (!html) { setStep('checklist'); return; }
    const checks = analyzeHtml(html, url);
    setResult({ mode: 'auto', checks, score: scoreOf(checks), url });
    setStep('result');
  };

  const finishChecklist = () => {
    const checks = checklistItems.map((item) => ({
      label: item.text,
      pass: !!marked[item.id],
      tip: item.tip,
      weight: item.weight,
    }));
    setResult({ mode: 'manual', checks, score: scoreOf(checks), url: url || 'kontrol listesi' });
    setStep('result');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            key="panel"
            className={`fixed z-50 bg-background flex flex-col ${isMobile ? 'inset-x-0 bottom-0 h-[92dvh] rounded-t-[2rem] border-t' : 'right-0 top-0 h-full w-full max-w-md border-l'} border-border`}
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={{ x: 0, y: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          >
            {isMobile && <div className="mx-auto mt-2.5 h-1.5 w-12 rounded-full bg-border shrink-0" />}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-mint">ÜCRETSİZ ARAÇ</p>
                <h2 className="font-display font-bold text-lg flex items-center gap-2"><ScanSearch className="w-5 h-5 text-mint" /> SEO Tarayıcı</h2>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Kapat" className="w-9 h-9 rounded-full bg-secondary grid place-items-center hover:bg-coral hover:text-ink transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 pb-8">
              {step === 'menu' && (
                <div className="space-y-3">
                  {TOOL_MENU.map((t, i) => (
                    <motion.button
                      key={t.title}
                      type="button"
                      onClick={() => (t.inline ? setStep('input') : (setOpen(false), navigate(t.href)))}
                      className="w-full text-left rounded-2xl border border-border bg-card p-4 flex items-start gap-3.5 hover:border-mint/60 hover:-translate-y-0.5 transition-all"
                      initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 * i, type: 'spring', stiffness: 200, damping: 20 }}
                    >
                      <span className="w-9 h-9 rounded-xl bg-terminal shrink-0 grid place-items-center"><t.icon className={`w-5 h-5 ${t.color}`} /></span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="font-display font-semibold text-sm">{t.title}</span>
                          {t.inline && <span className="rounded-full bg-mint/15 border border-mint/40 text-mint font-mono text-[9px] px-2 py-0.5">PENCEREDE</span>}
                        </span>
                        <span className="block text-xs text-foreground/60 mt-1 leading-relaxed">{t.desc}</span>
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}

              {step === 'input' && (
                <div className="space-y-4">
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Sitenizin adresini yazın; başlıkları, açıklamaları, mobil uyumu, yapısal veriyi ve 10+ SEO kontrolünü saniyeler içinde tarayıp <span className="text-mint font-semibold">puan ve düzeltme planı</span> üretiyoruz.
                  </p>
                  <input
                    autoFocus
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && url.trim() && setStep('scanning')}
                    placeholder="örn. isletmem.com"
                    className="w-full rounded-2xl bg-terminal border border-border px-4 py-3 text-base sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:border-mint"
                  />
                  <div className="flex flex-wrap gap-2">
                    {['naylavitrin.com', 'edirne-ciger.com'].map((ex) => (
                      <button key={ex} type="button" onClick={() => setUrl(ex)} className="rounded-full border border-border px-3 py-1 text-[11px] font-mono text-muted-foreground hover:border-mint hover:text-mint transition-colors">
                        {ex}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    disabled={!url.trim()}
                    onClick={() => { setTick(0); setStep('scanning'); }}
                    className="w-full rounded-full bg-mint text-ink font-semibold px-6 py-3 hover:shadow-sticker transition-all disabled:opacity-40"
                  >
                    Analiz Et
                  </button>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Siteniz tarayıcıdan okunamıyorsa 60 saniyelik kontrol listesine geçeriz — sonuç aynı kalitede.
                  </p>
                </div>
              )}

              {step === 'scanning' && (
                <div className="space-y-4 py-6">
                  {scanSteps.map((s, i) => (
                    <div key={s} className={`flex items-center gap-3 text-sm ${i <= tick ? 'text-foreground' : 'text-muted-foreground/40'}`}>
                      {i < tick ? <Check className="w-4 h-4 text-mint" /> : i === tick ? <Loader2 className="w-4 h-4 text-mint animate-spin" /> : <span className="w-4" />}
                      {s}
                    </div>
                  ))}
                </div>
              )}

              {step === 'checklist' && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-sun/40 bg-sun/10 p-4 text-xs text-foreground/80 leading-relaxed">
                    <strong className="flex items-center gap-1.5 font-display text-sm mb-1"><ClipboardCheck className="w-4 h-4 text-sun" /> Hızlı kontrol listesi</strong>
                    Sitenizi otomatik okuyamadık. Ekranınızda siteyi açık tutun ve aşağıdakileri kendi gözünüzle doğrulayın — 60 saniye sürer.
                  </div>
                  {checklistItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMarked((m) => ({ ...m, [item.id]: !m[item.id] }))}
                      className={`w-full text-left rounded-2xl border p-3.5 flex items-start gap-3 transition-colors ${marked[item.id] ? 'border-mint/60 bg-mint/10' : 'border-border bg-card hover:border-mint/30'}`}
                    >
                      <span className={`w-5 h-5 rounded-md shrink-0 grid place-items-center border-2 mt-0.5 ${marked[item.id] ? 'bg-mint border-mint text-ink' : 'border-border'}`}>
                        {marked[item.id] && <Check className="w-3.5 h-3.5" />}
                      </span>
                      <span className="text-sm text-foreground/85">{item.text}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={finishChecklist}
                    className="w-full rounded-full bg-mint text-ink font-semibold px-6 py-3 hover:shadow-sticker transition-all"
                  >
                    Puanımı Göster
                  </button>
                </div>
              )}

              {step === 'result' && result && (
                <ScanResult
                  score={result.score}
                  checks={result.checks}
                  url={result.url}
                  onRestart={() => { setStep('menu'); setUrl(''); setResult(null); }}
                />
              )}
            </div>

            <div className="px-5 py-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground font-mono">
              <span>100% ücretsiz · kayıt gerekmez</span>
              <button type="button" onClick={() => setStep('menu')} className="hover:text-mint">← araçlar</button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}