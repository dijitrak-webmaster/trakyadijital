import React from 'react';

const COLORS = ['bg-mint', 'bg-sun', 'bg-coral', 'bg-sage', 'bg-fog'];
const input = 'w-full rounded-xl bg-secondary border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

export { COLORS, input };

export const slugify = (t) =>
  t
    .replace(/İ/g, 'i').replace(/I/g, 'i')
    .toLowerCase()
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export function ColorSelect({ value, onChange }) {
  return (
    <select className={input} value={value} onChange={(e) => onChange(e.target.value)}>
      {COLORS.map((c) => <option key={c} value={c}>{c.replace('bg-', '')}</option>)}
    </select>
  );
}