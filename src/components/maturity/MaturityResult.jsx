import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, RotateCcw, ArrowRight } from 'lucide-react';
import { useAssistant } from '@/lib/AssistantContext';
import { useLanguage } from '@/lib/LanguageContext';
import RobotMascot from '@/components/mascot/RobotMascot';
import { scoreOf, tierOf, roadmapOf } from '@/lib/maturityQuiz';

const R = 52;
const CIRC = 2 * Math.PI * R;

// puan halkası + seviye + yol haritası + DijiBot geçişi
export default function MaturityResult({ answers, onRetake }) {
  const { tl } = useLanguage();
  const { openAssistant } = useAssistant();
  const score = scoreOf(answers);
  const tier = tierOf(score);
  const roadmap = roadmapOf(answers);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div className="relative w-32 h-32 shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r={R} fill="none" stroke="hsl(222 30% 20%)" strokeWidth="10" />
            <motion.circle
              cx="60" cy="60" r={R} fill="none" stroke="hsl(150 62% 68%)" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={CIRC}
              initial={{ strokeDashoffset: CIRC }}
              animate={{ strokeDashoffset: CIRC * (1 - score / 100) }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display font-bold text-3xl">{score}</span>
            <span className="font-mono text-[9px] text-muted-foreground">/ 100</span>
          </div>
        </div>
        <div className="text-center sm:text-left">
          <p className="font-mono text-[10px] tracking-[0.22em] text-sun">{tl('DİJİTAL OLGUNLUK PUANINIZ')}</p>
          <h2 className={`font-display font-bold text-2xl mt-1 ${tier.color}`}>{tl(tier.label)}</h2>
          <p className="text-sm text-foreground/70 mt-1">{tl(tier.note)}</p>
        </div>
        <RobotMascot emotion={score >= 65 ? 'happy' : 'thinking'} className="w-16 h-16 shrink-0 hidden sm:block" />
      </div>

      <div className="mt-8">
        <h3 className="font-display font-bold text-lg">{tl('Size Özel Yol Haritası')}</h3>
        <p className="text-xs text-foreground/60 mt-0.5">{tl('En zayıf alanlarınızdan başlayarak sıraladık.')}</p>
        <div className="mt-4 space-y-3">
          {roadmap.length === 0 && (
            <div className="rounded-2xl border-2 border-mint/50 bg-card p-4 text-sm">{tl('Her alanda güçlü çıktınız — harika! Bizi arayın, sizi bir üst seviyeye taşıyalım.')}</div>
          )}
          {roadmap.map((r, i) => (
            <div key={r.key} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-coral">{tl(`ÖNCELİK ${i + 1}`)}</span>
                {r.service && (
                  <Link to={`/hizmet/${r.service.slug}`} className="text-xs font-semibold text-mint hover:underline inline-flex items-center gap-1">
                    {tl(r.service.title)} <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
              <p className="text-sm text-foreground/75 mt-2">{tl(r.why)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-3xl border-2 border-dashed border-mint/40 bg-card p-5 flex flex-col sm:flex-row items-center gap-4">
        <RobotMascot emotion="happy" className="w-12 h-12 shrink-0 sm:hidden" />
        <div className="flex-1 text-center sm:text-left">
          <p className="font-display font-semibold">{tl('Puanınızı DijiBot\'a taşıyın')}</p>
          <p className="text-xs text-foreground/60 mt-0.5">{tl('Yapay zekâ asistanımız bu sonuçlara göre size özel bir paket kursun.')}</p>
        </div>
        <button
          onClick={() => {
            const alanlar = roadmap.map((r) => r.key).join(', ');
            openAssistant({ text: `Olgunluk testi sonuçlarımı paylaşıyorum: ${score}/100 puan, seviye "${tier.label}". Gelişme gereken alanlarım: ${alanlar || 'yok — üst seviyeye taşıma'}. Bana özel paket kurar mısın?` });
          }}
          className="w-full sm:w-auto rounded-full bg-mint text-ink font-semibold px-6 py-3 inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-sticker transition-all"
        >
          <Bot className="w-4 h-4" /> {tl('DijiBot ile strateji kur')}
        </button>
      </div>
      <button onClick={onRetake} className="mt-4 mx-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-mint transition-colors">
        <RotateCcw className="w-3.5 h-3.5" /> {tl('Testi tekrar çöz')}
      </button>
    </motion.div>
  );
}