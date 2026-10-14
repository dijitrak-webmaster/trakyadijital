import React, { useEffect, useState } from 'react';
import { Save, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { mapDistricts } from '@/lib/trakyaMapData';

// Harita skorları yönetimi — yönetici ilçe skorlarını 0-100 arası günceller
export default function DistrictScoreManager() {
  const [rows, setRows] = useState(mapDistricts.map((d) => ({ slug: d.slug, name: d.name, province: d.province, score: d.score, id: null })));
  const [savedSlugs, setSavedSlugs] = useState({});
  const [busySlug, setBusySlug] = useState(null);

  useEffect(() => {
    let alive = true;
    base44.entities.DistrictScore.list().then((records) => {
      if (!alive) return;
      const bySlug = Object.fromEntries(records.map((r) => [r.slug, r]));
      setRows((prev) => prev.map((r) => (bySlug[r.slug] ? { ...r, score: bySlug[r.slug].score, id: bySlug[r.slug].id } : r)));
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const save = async (slug) => {
    const row = rows.find((r) => r.slug === slug);
    const score = Math.max(0, Math.min(100, Math.round(Number(row.score) || 0)));
    setBusySlug(slug);
    try {
      if (row.id) await base44.entities.DistrictScore.update(row.id, { score });
      else {
        const created = await base44.entities.DistrictScore.create({ slug, score });
        setRows((prev) => prev.map((r) => (r.slug === slug ? { ...r, id: created.id, score } : r)));
      }
      setRows((prev) => prev.map((r) => (r.slug === slug ? { ...r, score } : r)));
      setSavedSlugs((s) => ({ ...s, [slug]: true }));
      setTimeout(() => setSavedSlugs((s) => ({ ...s, [slug]: false })), 1800);
    } finally {
      setBusySlug(null);
    }
  };

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-foreground/65 mb-4">
        Haritadaki ve ilçe sayfalarındaki dijital olgunluk skorları buradan güncellenir. Değişiklik yayına anında yansır.
      </p>
      <div className="rounded-3xl border border-border bg-card divide-y divide-border">
        {rows.map((r) => (
          <div key={r.slug} className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-sm truncate">{r.name}</p>
              <p className="font-mono text-[10px] text-muted-foreground">{r.province} ili</p>
            </div>
            <input
              type="number"
              min="0"
              max="100"
              value={r.score}
              onChange={(e) => setRows((prev) => prev.map((x) => (x.slug === r.slug ? { ...x, score: e.target.value } : x)))}
              className="w-20 rounded-xl bg-terminal border border-border px-3 py-2 text-sm font-mono text-center focus:outline-none focus:border-mint"
            />
            <button
              type="button"
              onClick={() => save(r.slug)}
              disabled={busySlug === r.slug}
              className="rounded-full bg-mint text-ink p-2.5 hover:shadow-sticker transition-all disabled:opacity-50"
              title="Kaydet"
            >
              {savedSlugs[r.slug] ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}