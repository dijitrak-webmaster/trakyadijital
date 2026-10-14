import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cases } from '@/lib/siteData';
import { useLanguage } from '@/lib/LanguageContext';

export default function CaseStudies() {
  const { tl } = useLanguage();
  return (
    <div id="vakalar" className="scroll-mt-28 flex flex-col">
      <h2 className="font-display font-semibold text-3xl md:text-4xl mb-5">{tl('Vaka Analizleri')}</h2>
      <div className="grid sm:grid-cols-2 gap-4 flex-1">
        {cases.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className={`${c.color} text-ink rounded-3xl p-5 flex flex-col`}
          >
            <span className="self-start rounded-full bg-ink text-foreground text-[11px] font-mono px-2.5 py-1">{tl('Vaka Çalışması')}</span>
            <h3 className="mt-4 font-display font-semibold text-2xl leading-tight">{tl(c.title)}</h3>
            <div className="mt-1 font-display font-semibold text-xl">{tl(c.metric)}</div>
            <p className="mt-3 text-sm text-ink/75 leading-relaxed">{tl(c.desc)}</p>
            <Link to={`/sektor/${c.sector}`} className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold hover:gap-2.5 transition-all">
              {tl('Detayları Gör')} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}