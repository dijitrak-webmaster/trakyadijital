import React from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

const DEVICES = [
  { key: 'desktop', label: 'Masaüstü', icon: Monitor },
  { key: 'tablet', label: 'Tablet', icon: Tablet },
  { key: 'mobile', label: 'Mobil', icon: Smartphone },
];

export default function DeviceSwitcher({ value, onChange }) {
  return (
    <div className="inline-flex rounded-full border border-border bg-secondary/60 p-1" role="group" aria-label="Cihaz seçimi">
      {DEVICES.map((d) => (
        <button
          key={d.key}
          onClick={() => onChange(d.key)}
          aria-pressed={value === d.key}
          title={d.label}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${value === d.key ? 'bg-mint text-ink' : 'text-foreground/65 hover:text-foreground'}`}
        >
          <d.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{d.label}</span>
        </button>
      ))}
    </div>
  );
}