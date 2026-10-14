import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tractor, Store, Hotel, Bot, CornerDownLeft, Sparkles, ArrowRight, CheckCircle2, ShoppingBag, FileText, CalendarClock, TrendingUp } from 'lucide-react';
import { useAssistant } from '@/lib/AssistantContext';
import { useLanguage } from '@/lib/LanguageContext';
import Sticker from '@/components/site/Sticker';
import RobotMascot from '@/components/mascot/RobotMascot';

const TRUST_ICONS = [CheckCircle2, ShoppingBag, Sparkles];

const DEMO_SCRIPT = {
  tr: {
    greeting: 'Merhaba! Ben DijiBot. Projenizle ilgili neyi merak ederseniz sorun — size özel paket hazırlarım.',
    dialog: [
      { q: 'E-ticaret sitesi ne kadar?', a: 'İhtiyacınıza göre paket kuruyorum: ürün sayısı, ödeme ve kargo entegrasyonu… Size özel teklif hazırlayayım!' },
      { q: "Google'da nasıl öne çıkarım?", a: 'Yerel SEO + içerik stratejisiyle ilk sayfa hedefliyoruz. Siteniz için ücretsiz analiz başlatalım.' },
    ],
    capabilities: [
      { icon: FileText, label: 'Özel teklif paketi', intent: 'quote' },
      { icon: CalendarClock, label: 'Randevu planlama', intent: 'appointment' },
      { icon: TrendingUp, label: 'Büyüme analizi', intent: null },
    ],
    online: 'ÇEVRİMİÇİ',
    replyIn: '7/24 anında yanıt',
  },
  en: {
    greeting: "Hi! I'm DijiBot. Ask me anything about your project — I'll put together a package for you.",
    dialog: [
      { q: 'How much for e-commerce?', a: "I build a package around your needs: product count, payment and shipping integrations… Let me prepare a custom quote!" },
      { q: 'How do I rank on Google?', a: 'Local SEO + content strategy targeting page one. Shall we start a free analysis of your site?' },
    ],
    capabilities: [
      { icon: FileText, label: 'Custom quote package', intent: 'quote' },
      { icon: CalendarClock, label: 'Book a meeting', intent: 'appointment' },
      { icon: TrendingUp, label: 'Growth analysis', intent: null },
    ],
    online: 'ONLINE',
    replyIn: 'Instant replies, 24/7',
  },
};

// phases: greeting → q (user bubble) → thinking → answer → pause → next q
function useDemoScript(script) {
  const [phase, setPhase] = useState('greeting');
  const [typed, setTyped] = useState('');
  const [turn, setTurn] = useState(0);

  useEffect(() => {
    setPhase('greeting');
    setTyped('');
    setTurn(0);
  }, [script]);

  // daktilo efekti
  useEffect(() => {
    if (phase !== 'greeting') return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(script.greeting.slice(0, i));
      if (i >= script.greeting.length) {
        clearInterval(id);
        setTimeout(() => setPhase('q'), 700);
      }
    }, 26);
    return () => clearInterval(id);
  }, [phase, script]);

  useEffect(() => {
    if (phase === 'q') {
      const id = setTimeout(() => setPhase('thinking'), 1300);
      return () => clearTimeout(id);
    }
    if (phase === 'thinking') {
      const id = setTimeout(() => setPhase('answer'), 1600);
      return () => clearTimeout(id);
    }
    if (phase === 'answer') {
      const id = setTimeout(() => {
        const next = (turn + 1) % script.dialog.length;
        setTurn(next);
        setPhase('q');
      }, 4200);
      return () => clearTimeout(id);
    }
  }, [phase, turn, script]);

  return { phase, typed, turn };
}

export default function Hero() {
  const { openAssistant } = useAssistant();
  const { t, lang } = useLanguage();
  const [q, setQ] = useState('');
  const script = useMemo(() => DEMO_SCRIPT[lang] || DEMO_SCRIPT.tr, [lang]);
  const demo = useDemoScript(script);

  const submit = (e) => {
    e.preventDefault();
    openAssistant(q.trim() ? { text: q.trim() } : null);
    setQ('');
  };

  const trust = [t('hero.trust1'), t('hero.trust2'), t('hero.trust3')];
  const currentQ = script.dialog[demo.turn]?.q;

  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-44 md:pb-24">
      <div className="absolute inset-0 bg-dots pointer-events-none" />
      {/* tek, sakin atmosfer ışığı */}
      <div className="absolute -top-40 left-1/4 w-[640px] h-[420px] rounded-full bg-mint/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[420px] h-[320px] rounded-full bg-sun/10 blur-[120px] pointer-events-none" />

      {/* sektörel vurgu — az sayıda, köşelere yerleşmiş sticker */}
      <Sticker icon={Tractor} tile="bg-mint" size="md" rotate={-10} delay={0.4} className="hidden lg:block left-[4%] top-[38%]" />
      <Sticker icon={Store} tile="bg-sun" size="sm" rotate={8} delay={0.55} className="hidden lg:block right-[4%] top-[22%]" />
      <Sticker icon={Hotel} tile="bg-coral" size="sm" rotate={10} delay={0.7} className="hidden lg:block right-[6%] bottom-16" />

      <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
        {/* Sol: mesaj */}
        <div className="text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-mint/40 bg-mint/10 text-mint font-mono text-xs px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {t('hero.badge')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight"
          >
            {t('hero.h1a')}
            <br />
            <span className="text-shimmer">{t('hero.h1b')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-6 text-lg md:text-xl text-foreground/75 max-w-xl mx-auto lg:mx-0"
          >
            {t('hero.sub')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3"
          >
            <button
              onClick={() => openAssistant({ intent: 'quote' })}
              className="group rounded-full bg-mint text-ink font-semibold px-7 py-3 shadow-sticker hover:-translate-y-0.5 hover:bg-sun transition-all inline-flex items-center gap-2"
            >
              {t('hero.quote')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#hizmetler" className="rounded-full border-2 border-foreground/70 font-semibold px-7 py-2.5 hover:bg-foreground hover:text-ink transition-colors">
              {t('hero.explore')}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="mt-10 flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3"
          >
            {trust.map((item, i) => {
              const Icon = TRUST_ICONS[i];
              return (
                <span key={item} className="inline-flex items-center gap-2 font-mono text-xs text-foreground/60">
                  <Icon className="w-3.5 h-3.5 text-mint" />
                  {item}
                </span>
              );
            })}
          </motion.div>
        </div>

        {/* Sağ: DijiBot canlı terminal kartı */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: 1 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-md mx-auto w-full lg:max-w-none"
        >
          <div className="rounded-2xl border-2 border-border bg-terminal shadow-sticker overflow-hidden">
            {/* pencere başlığı + çevrimiçi durumu */}
            <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-3">
              <span className="w-2.5 h-2.5 rounded-full bg-coral" />
              <span className="w-2.5 h-2.5 rounded-full bg-sun" />
              <span className="w-2.5 h-2.5 rounded-full bg-mint" />
              <span className="ml-2 font-mono text-[11px] text-muted-foreground">dijibot@trakya ~</span>
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-mint/10 border border-mint/40 px-2 py-0.5 font-mono text-[9px] font-bold text-mint tracking-wider">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-60 animate-ping" />
                  <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-mint" />
                </span>
                {script.online}
              </span>
            </div>

            <div className="p-5 space-y-4">
              {/* canlı mini sohbet demosu */}
              <div className="space-y-3 min-h-[210px]">
                {/* bot karşılama (daktilo) */}
                <div className="flex items-start gap-2.5">
                  <RobotMascot emotion={demo.phase === 'thinking' ? 'thinking' : 'happy'} className="w-9 h-10 shrink-0" />
                  <div className="rounded-2xl rounded-tl-md border border-mint/40 bg-card px-3.5 py-2.5 font-body text-[12.5px] leading-relaxed text-foreground/90 min-w-0">
                    {demo.phase === 'greeting' ? (
                      <span>
                        {demo.typed}
                        <span className="cursor-blink">▍</span>
                      </span>
                    ) : (
                      script.greeting
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {demo.phase !== 'greeting' && (
                    <motion.div
                      key={`q-${demo.turn}`}
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                      className="flex justify-end"
                    >
                      <div className="rounded-2xl rounded-tr-md border border-sun/60 bg-card px-3.5 py-2.5 font-body text-[12.5px] text-foreground/90 max-w-[85%]">
                        {currentQ}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* bot düşünüyor → yanıt */}
                <AnimatePresence mode="wait">
                  {demo.phase === 'thinking' ? (
                    <motion.div
                      key="thinking"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 pl-11"
                    >
                      <div className="flex gap-1.5 rounded-xl border border-mint/30 bg-card px-3.5 py-3">
                        {[0, 1, 2].map((d) => (
                          <span key={d} className="w-1.5 h-1.5 rounded-full bg-mint animate-bounce" style={{ animationDelay: `${d * 140}ms` }} />
                        ))}
                      </div>
                    </motion.div>
                  ) : demo.phase === 'answer' ? (
                    <motion.div
                      key={`a-${demo.turn}`}
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                      className="flex items-start gap-2.5"
                    >
                      <RobotMascot emotion="excited" className="w-9 h-10 shrink-0 -ml-[0px]" />
                      <div className="rounded-2xl rounded-tl-md border border-mint/40 bg-card px-3.5 py-2.5 font-body text-[12.5px] leading-relaxed text-foreground/90 max-w-[85%]">
                        {script.dialog[demo.turn]?.a}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              {/* yetenek rozetleri (mobilde gizli — kart kompakt kalır) */}
              <div className="hidden sm:grid grid-cols-3 gap-2">
                {script.capabilities.map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.label}
                      onClick={() => openAssistant(c.intent ? { intent: c.intent } : { text: c.label })}
                      className="group flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card px-2 py-3 hover:border-mint/60 hover:-translate-y-0.5 transition-all"
                    >
                      <Icon className="w-4 h-4 text-mint" />
                      <span className="font-mono text-[9px] text-center text-muted-foreground group-hover:text-foreground leading-tight">{c.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* aynı işlevi koruyan soru kutusu */}
              <form
                onSubmit={submit}
                className="flex items-center gap-3 rounded-xl bg-card border border-foreground/10 px-4 py-3 font-mono text-sm focus-within:border-mint/60 transition-colors"
              >
                <span className="text-mint cursor-blink">&gt;_</span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t('hero.placeholder')}
                  className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-foreground/45 text-[13px]"
                />
                <button type="submit" aria-label={lang === 'en' ? 'Send' : 'Gönder'} className="text-mint hover:scale-110 transition">
                  <CornerDownLeft className="w-4 h-4" />
                </button>
              </form>

              <p className="font-mono text-[10px] text-muted-foreground text-center">{script.replyIn}</p>
            </div>
          </div>

          {/* kart köşe rozeti */}
          <div className="absolute -top-3 -right-3 hidden sm:flex items-center gap-1.5 rounded-full bg-sun text-ink font-mono text-[10px] font-bold px-3 py-1 shadow-sticker rotate-2">
            <Sparkles className="w-3 h-3" />
            {lang === 'en' ? 'AI ADVISOR' : 'AI DANIŞMAN'}
          </div>
        </motion.div>
      </div>
    </section>
  );
}