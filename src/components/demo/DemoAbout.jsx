import React from 'react';
import { Image } from '@/components/ui/image';

export default function DemoAbout({ theme }) {
  const { about, headClass } = theme;
  return (
    <section id="hakkimizda" className="bg-[var(--d-surface)] border-y border-[var(--d-border)]">
      <div className="max-w-6xl mx-auto px-5 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <Image src={about.image} className="w-full aspect-[4/3] rounded-3xl" />
        <div>
          <h2 className={`[font-family:var(--d-head)] text-3xl md:text-4xl font-bold ${headClass}`}>{about.title}</h2>
          <p className="mt-4 text-[var(--d-muted)] leading-relaxed">{about.text}</p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {about.stats.map(([v, l]) => (
              <div key={l}>
                <p className="[font-family:var(--d-head)] text-2xl sm:text-3xl font-bold text-[var(--d-accent)]">{v}</p>
                <p className="text-xs text-[var(--d-muted)] mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}