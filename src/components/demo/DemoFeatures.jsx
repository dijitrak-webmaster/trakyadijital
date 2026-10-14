import React from 'react';

export default function DemoFeatures({ theme }) {
  return (
    <section id="ozellikler" className="max-w-6xl mx-auto px-5 py-16 md:py-24">
      <h2 className={`[font-family:var(--d-head)] text-3xl md:text-4xl font-bold ${theme.headClass}`}>{theme.featuresTitle}</h2>
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {theme.features.map((f) => (
          <div key={f.title} className="rounded-2xl bg-[var(--d-surface)] border border-[var(--d-border)] p-6">
            <span className="grid place-items-center w-11 h-11 rounded-xl bg-[var(--d-accent)] text-[var(--d-on)]">
              <f.icon className="w-5 h-5" />
            </span>
            <h3 className="mt-5 font-semibold text-lg">{f.title}</h3>
            <p className="mt-2 text-sm text-[var(--d-muted)] leading-relaxed">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}