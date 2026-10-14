import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor, ShoppingCart, Smartphone, Layers, CreditCard, CalendarCheck,
  LayoutGrid, Newspaper, Languages, Users, KanbanSquare, Bot, ArrowRight,
  ArrowLeft, Sprout, Search, PenTool, Code2, FlaskConical, Rocket,
} from 'lucide-react';
import { useAssistant } from '@/lib/AssistantContext';
import Reveal from '@/components/site/Reveal';

const PLATFORMS = [
  { id: 'web', name: 'Kurumsal Web', desc: 'Tanıtım sitesi + blog', icon: Monitor, price: [8000, 15000], weeks: [3, 4], color: 'bg-mint' },
  { id: 'ecommerce', name: 'E-Ticaret', desc: 'Online mağaza + POS', icon: ShoppingCart, price: [15000, 28000], weeks: [6, 8], color: 'bg-sun' },
  { id: 'mobil', name: 'Mobil Uygulama', desc: 'iOS + Android', icon: Smartphone, price: [20000, 35000], weeks: [8, 10], color: 'bg-coral' },
  { id: 'both', name: 'Web + Mobil', desc: 'Komple dijital dönüşüm', icon: Layers, price: [30000, 55000], weeks: [12, 14], color: 'bg-sage' },
];

const NEEDS = [
  { id: 'pos', label: 'Ödeme / Sanal POS', price: 3000, weeks: 1, icon: CreditCard },
  { id: 'reservation', label: 'Rezervasyon & Takvim', price: 3500, weeks: 1, icon: CalendarCheck },
  { id: 'catalog', label: 'Ürün Kataloğu', price: 2500, weeks: 1, icon: LayoutGrid },
  { id: 'cms', label: 'Blog & İçerik Yönetimi', price: 2000, weeks: 1, icon: Newspaper },
  { id: 'multilang', label: 'Çok Dilli', price: 2500, weeks: 1, icon: Languages },
  { id: 'portal', label: 'Müşteri Portalı', price: 4000, weeks: 2, icon: Users },
  { id: 'crm', label: 'CRM & Form Entegrasyonu', price: 3000, weeks: 1, icon: KanbanSquare },
  { id: 'ai', label: 'AI Asistan', price: 3500, weeks: 1, icon: Bot },
];

const PHASES = [
  { name: 'Keşif & Analiz', share: 0.12, desc: 'İhtiyaç analizi, rakip araştırması, yol haritası', icon: Search },
  { name: 'UI/UX Tasarım', share: 0.25, desc: 'Wireframe, moodboard, tıklanabilir prototip', icon: PenTool },
  { name: 'Geliştirme', share: 0.4, desc: 'Kodlama, özellik entegrasyonları, içerik girişi', icon: Code2 },
  { name: 'Test & Revizyon', share: 0.15, desc: 'Cihaz testleri, performans, düzeltmeler', icon: FlaskConical },
  { name: 'Yayın & Eğitim', share: 0.08, desc: 'Yayına alma, SEO temeli, kullanım eğitimi', icon: Rocket },
];

const STEPS = ['Platform', 'İhtiyaçlar', 'Kapsam'];

const fmt = (n) => `₺${Math.round(n / 1000)}k`;

export default function ProjectSimulator() {
  const { openAssistant } = useAssistant();
  const [step, setStep] = useState(0);
  const [platformId, setPlatformId] = useState('web');
  const [needs, setNeeds] = useState([]);

  const platform = PLATFORMS.find((p) => p.id === platformId);
  const selected = NEEDS.filter((n) => needs.includes(n.id));

  const result = useMemo(() => {
    const low = platform.price[0] + selected.reduce((s, n) => s + n.price, 0);
    const high = platform.price[1] + selected.reduce((s, n) => s + n.price, 0);
    const weeksLow = platform.weeks[0] + selected.reduce((s, n) => s + n.weeks, 0);
    const weeksHigh = platform.weeks[1] + selected.reduce((s, n) => s + n.weeks, 0);
    const phases = PHASES.map((p) => ({
      ...p,
      weeks: Math.max(1, Math.round(p.share * weeksHigh)),
      low: Math.round(p.share * low),
      high: Math.round(p.share * high),
    }));
    return { low, high, weeksLow, weeksHigh, phases };
  }, [platform, selected]);

  const toggle = (id) =>
    setNeeds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const pickPlatform = (id) => {
    setPlatformId(id);
    setStep(1);
  };

  return (
    <section id="simulator" className="scroll-mt-28">
      <Reveal className="max-w-2xl">
        <p className="font-mono text-xs text-sun">// PROJE SİMÜLATÖRÜ</p>
        <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl">Projeni 3 adımda simüle et</h2>
        <p className="mt-4 text-foreground/70 text-lg">
          Web mi mobil mi? Hangi özellikler? Adım adım seç, tahmini maliyeti ve süreç takvimini anında gör.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <div className="flex items-center gap-2 sm:gap-3">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors ${i === step ? 'bg-mint text-ink font-semibold' : i < step ? 'bg-mint/15 text-mint' : 'bg-card text-muted-foreground border border-border'}`}>
                <span className="font-bold">{i + 1}</span> {label}
              </div>
              {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 rounded-full transition-colors ${i < step ? 'bg-mint/40' : 'bg-border'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-card p-5 md:p-8 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-mint/10 blur-[90px] pointer-events-none" />
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                <p className="font-mono text-xs text-muted-foreground">PROJE TİPİNİ SEÇ <span className="text-foreground/60">— seçince otomatik geç</span></p>
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  {PLATFORMS.map((p) => {
                    const active = p.id === platformId;
                    return (
                      <button key={p.id} onClick={() => pickPlatform(p.id)} className={`text-left rounded-2xl border-2 p-4 flex items-center gap-3 transition-all ${active ? 'border-mint bg-mint/10 shadow-sticker' : 'border-border bg-background hover:border-mint/40'}`}>
                        <span className={`w-11 h-11 rounded-xl ${p.color} text-ink flex items-center justify-center shrink-0 ${active ? 'rotate-6' : ''} transition-transform`}>
                          <p.icon className="w-5 h-5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-semibold">{p.name}</span>
                          <span className="block text-xs text-foreground/60 font-mono mt-0.5">{p.desc}</span>
                          <span className="block text-xs text-mint font-mono mt-1">{fmt(p.price[0])} – {fmt(p.price[1])} · {p.weeks[0]}–{p.weeks[1]} hafta</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                <p className="font-mono text-xs text-muted-foreground">HANGİ ÖZELLİKLER GEREKLİ? <span className="text-foreground/60">(kaç tanesi gerekliyse seç)</span></p>
                <div className="flex flex-wrap gap-2.5 mt-4">
                  {NEEDS.map((n) => {
                    const active = needs.includes(n.id);
                    return (
                      <button key={n.id} onClick={() => toggle(n.id)} className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all ${active ? 'border-sun bg-sun text-ink rotate-1 shadow-sticker' : 'border-border bg-background text-foreground/75 hover:border-sun/50'}`}>
                        <n.icon className="w-4 h-4" /> {n.label}
                        <span className={`font-mono text-[11px] ${active ? 'text-ink/70' : 'text-foreground/40'}`}>+{fmt(n.price)}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <button onClick={() => setStep(0)} className="rounded-full border-2 border-border font-semibold px-5 py-2.5 text-sm hover:border-mint/50 inline-flex items-center gap-1.5 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Geri
                  </button>
                  <button onClick={() => setStep(2)} className="rounded-full bg-mint text-ink font-semibold px-6 py-2.5 text-sm hover:-translate-y-0.5 hover:shadow-sticker transition-all inline-flex items-center gap-2">
                    Kapsamı Hesapla <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="hidden sm:block font-mono text-xs text-muted-foreground">{platform.name} + {selected.length} modül</span>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">TAHMİNİ BÜTÇE</p>
                    <div className="flex items-end gap-2 mt-1">
                      <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-display font-bold text-4xl md:text-5xl text-mint">{fmt(result.low)}</motion.span>
                      <span className="font-display font-bold text-3xl text-foreground/40">–</span>
                      <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-display font-bold text-4xl md:text-5xl text-mint">{fmt(result.high)}</motion.span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-secondary px-4 py-3">
                    <p className="font-mono text-[11px] text-muted-foreground">TOPLAM SÜRE</p>
                    <p className="font-display font-semibold text-2xl mt-0.5">{result.weeksLow}–{result.weeksHigh} hafta</p>
                  </div>
                </div>

                <div className="mt-7">
                  <p className="font-mono text-xs text-muted-foreground">SÜREÇ TAKVİMİ — ADIM ADIM</p>
                  <div className="mt-4 space-y-0">
                    {result.phases.map((p, i) => (
                      <div key={p.name} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${i % 2 ? 'bg-sun' : 'bg-mint'} text-ink`}>
                            <p.icon className="w-4 h-4" />
                          </span>
                          {i < result.phases.length - 1 && <span className="w-0.5 flex-1 bg-border my-1" />}
                        </div>
                        <div className="flex-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 pb-5">
                          <span className="font-semibold">{p.name}</span>
                          <span className="text-sm text-foreground/60">{p.desc}</span>
                          <span className="ml-auto font-mono text-xs text-mint whitespace-nowrap">~{p.weeks} hafta · {fmt(p.low)}–{fmt(p.high)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ink text-foreground text-xs font-semibold px-3 py-1.5">
                    <Sprout className="w-3 h-3" /> {platform.name}
                  </span>
                  {selected.map((n) => (
                    <span key={n.id} className="inline-flex items-center gap-1.5 rounded-full bg-secondary text-xs font-semibold px-3 py-1.5 text-foreground/75">
                      <n.icon className="w-3 h-3" /> {n.label}
                    </span>
                  ))}
                </div>

                <p className="mt-4 text-xs text-foreground/50 font-mono">* Tahmini aralıktır; net teklif keşif görüşmesi sonrası verilir.</p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button onClick={() => setStep(1)} className="rounded-full border-2 border-border font-semibold px-5 py-2.5 text-sm hover:border-mint/50 inline-flex items-center gap-1.5 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Düzenle
                  </button>
                  <button onClick={() => openAssistant({ intent: 'quote' })} className="rounded-full bg-mint text-ink font-semibold px-6 py-2.5 text-sm hover:-translate-y-0.5 hover:shadow-sticker transition-all inline-flex items-center gap-2">
                    Bu kapsamı netleştir <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}