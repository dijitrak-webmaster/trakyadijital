import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { services } from '@/lib/siteData';
import { useLanguage } from '@/lib/LanguageContext';
import IconBadge from '@/components/site/IconBadge';

export default function ServicesGrid() {
  const { tl } = useLanguage();
  return (
    <section id="hizmetler" className="scroll-mt-28">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            whileHover={{ y: -6, rotate: i % 2 ? 0.6 : -0.6 }}
            className="flex"
          >
            <Link
              to={`/hizmet/${s.slug}`}
              className={`group ${s.color} text-ink rounded-3xl p-6 min-h-[170px] flex flex-col justify-between flex-1 hover:shadow-sticker transition-shadow`}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display font-semibold text-3xl leading-[1.05]">{tl(s.title)}</h3>
                <IconBadge icon={s.icon} />
              </div>
              <p className="mt-4 text-sm text-ink/75 leading-relaxed">{tl(s.desc)}</p>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-6">
        <Link to="/hizmetler" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 font-semibold text-sm hover:border-mint hover:text-mint transition-colors">
          {tl('Tüm hizmetleri gör')} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}