import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Reveal from '@/components/site/Reveal';

export default function SectorGuides({ sector }) {
  return (
    <section id="rehber" className="scroll-mt-28">
      <Reveal>
        <span className="font-mono text-xs text-mint uppercase tracking-widest">SEO Rehberi</span>
        <h2 className="mt-2 font-display font-semibold text-4xl md:text-5xl">{sector.name} için dijital rehber</h2>
      </Reveal>
      <Accordion type="single" collapsible defaultValue="g0" className="mt-8 space-y-3">
        {sector.guides.map((g, i) => (
          <AccordionItem key={g.title} value={`g${i}`} className="rounded-2xl bg-card border border-border px-6">
            <AccordionTrigger className="font-display text-lg md:text-xl font-semibold text-left hover:no-underline">{g.title}</AccordionTrigger>
            <AccordionContent className="text-base text-foreground/75 leading-relaxed">{g.body}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}