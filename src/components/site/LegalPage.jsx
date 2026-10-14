import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

/**
 * Hukuki sayfa şablonu — KVKK/Gizlilik ve Kullanım Şartları için ortak yapı.
 */
export default function LegalPage({ doc, other, otherLabel }) {
  const { lang } = useLanguage();
  const content = doc[lang] || doc.tr;

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="absolute -top-32 left-1/4 w-[520px] h-[320px] rounded-full bg-mint/10 blur-[120px] pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-5 md:px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-mint/15 border border-mint/50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-mint" />
            </span>
            <span className="font-mono text-xs text-muted-foreground">{content.updated}</span>
          </div>
          <h1 className="mt-5 font-display font-bold text-4xl md:text-5xl tracking-tight">{content.title}</h1>
          <p className="mt-4 text-foreground/75 text-lg leading-relaxed">{content.intro}</p>
        </motion.div>

        <div className="mt-10 space-y-8">
          {content.sections.map((s, i) => (
            <motion.div
              key={s.h}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
              className="rounded-xl border border-border bg-card p-5 md:p-6"
            >
              <h2 className="font-display font-semibold text-xl text-foreground">{s.h}</h2>
              <div className="mt-3 space-y-2">
                {s.p.map((para, j) => (
                  <p key={j} className="text-sm md:text-[15px] text-foreground/75 leading-relaxed">{para}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {other && (
          <Link
            to={other}
            className="mt-10 inline-flex items-center gap-2 rounded-full border-2 border-mint/50 bg-mint/10 px-5 py-2.5 font-mono text-xs font-semibold text-mint hover:bg-mint hover:text-ink transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            {otherLabel}
          </Link>
        )}
      </div>
    </section>
  );
}