import React from 'react';
import { motion } from 'framer-motion';
import Reveal from '@/components/site/Reveal';

const SOLUTION_COLORS = ['bg-sun', 'bg-mint', 'bg-coral', 'bg-sage'];

export default function SectorDetails({ sector }) {
  return (
    <>
      <section>
        <Reveal><h2 className="font-display font-semibold text-4xl md:text-5xl mb-8">Karşılaştığınız zorluklar</h2></Reveal>
        <div className="grid md:grid-cols-3 gap-4">
          {sector.pains.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-card border border-border p-6">
                <span className="font-mono text-xs text-coral">0{i + 1}</span>
                <h3 className="mt-3 font-display font-semibold text-2xl">{p.title}</h3>
                <p className="mt-2 text-foreground/70 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section>
        <Reveal><h2 className="font-display font-semibold text-4xl md:text-5xl mb-8">Çözümlerimiz</h2></Reveal>
        <div className="grid sm:grid-cols-2 gap-4">
          {sector.solutions.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -6 }} className={`${SOLUTION_COLORS[i % 4]} text-ink rounded-3xl p-7`}>
              <h3 className="font-display font-semibold text-2xl md:text-3xl">{s.title}</h3>
              <p className="mt-2 text-ink/75">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}