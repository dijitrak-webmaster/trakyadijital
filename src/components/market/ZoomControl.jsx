import React from 'react';

const LEVELS = [1, 0.75, 0.5];

export default function ZoomControl({ value, onChange }) {
  return (
    <div className="inline-flex rounded-full border border-border bg-secondary/60 p-1" role="group" aria-label="Yakınlaştırma">
      {LEVELS.map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          aria-pressed={value === l}
          className={`rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors ${value === l ? 'bg-mint text-ink' : 'text-foreground/65 hover:text-foreground'}`}
        >
          {l * 100}%
        </button>
      ))}
    </div>
  );
}