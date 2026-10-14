import React from 'react';
import { motion } from 'framer-motion';
import { Bot, TrendingUp, ShieldCheck } from 'lucide-react';
import { useAssistant } from '@/lib/AssistantContext';
import { useLanguage } from '@/lib/LanguageContext';
import { RADAR_FEATURES } from '@/lib/radarData';

// işaretlenen listeye göre açık analizi ve DijiBot geçişi
export default function RadarReport({ marks }) {
  const { tl } = useLanguage();
  const { openAssistant } = useAssistant();

  const compCount = RADAR_FEATURES.filter((f) => marks[f]?.competitor).length;
  const selfCount = RADAR_FEATURES.filter((f) => marks[f]?.self).length;
  const gaps = RADAR_FEATURES.filter((f) => marks[f]?.competitor && !marks[f]?.self);
  const edges = RADAR_FEATURES.filter((f) => marks[f]?.self && !marks[f]?.competitor);

  if (compCount + selfCount === 0) return null;

  const verdict = gaps.length === 0
    ? tl('Rakibinizin öne geçtiği bir alan yok — pozisyonunuzu koruyup büyümeye odaklanın.')
    : tl(`Rakibiniz ${gaps.length} alanda önde. Bu fark kapanabilir — ve genelde hızlı kapanır.`);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-4">
      <div className="rounded-2xl border-2 border-border bg-card p-4">
        <p className="font-mono text-[10px] tracking-[0.22em] text-sun">{tl('RADAR RAPORU')}</p>
        <p className="text-sm mt-1.5">{verdict}</p>
        <div className="mt-3 flex gap-5 text-xs text-foreground/60">
          <span>{tl('Rakip:')} <span className="font-mono text-coral">{compCount}/8</span></span>
          <span>{tl('Siz:')} <span className="font-mono text-mint">{selfCount}/8</span></span>
        </div>
      </div>

      {gaps.length > 0 && (
        <div className="rounded-2xl border border-coral/40 bg-card p-4">
          <p className="text-xs font-semibold text-coral inline-flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> {tl('Rakibinizin öne geçtiği alanlar')}</p>
          <ul className="mt-2 space-y-1.5">
            {gaps.map((g) => <li key={g} className="text-sm text-foreground/75">• {tl(g)}</li>)}
          </ul>
        </div>
      )}
      {edges.length > 0 && (
        <div className="rounded-2xl border border-mint/40 bg-card p-4">
          <p className="text-xs font-semibold text-mint inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> {tl('Sizin avantajınız')}</p>
          <ul className="mt-2 space-y-1.5">
            {edges.map((e) => <li key={e} className="text-sm text-foreground/75">• {tl(e)}</li>)}
          </ul>
        </div>
      )}

      <div className="rounded-3xl border-2 border-dashed border-mint/40 bg-card p-5 text-center">
        <p className="font-display font-semibold">{tl('Açığı kapatalım')}</p>
        <p className="text-xs text-foreground/60 mt-0.5">{tl('DijiBot, bu karşılaştırmaya göre size özel bir aksiyon paketi kursun.')}</p>
        <button
          onClick={() => {
            const bosluklar = gaps.length ? ` Rakibin önde olduğu alanlar: ${gaps.join(', ')}.` : '';
            openAssistant({ text: `Rakip radar sonuçlarımı paylaşıyorum: rakip ${compCount}/8, biz ${selfCount}/8.${bosluklar} Bu farkı kapatacak aksiyon paketi kurar mısın?` });
          }}
          className="mt-3 rounded-full bg-mint text-ink font-semibold px-6 py-3 inline-flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-sticker transition-all"
        >
          <Bot className="w-4 h-4" /> {tl('DijiBot ile kapatalım')}
        </button>
      </div>
    </motion.div>
  );
}