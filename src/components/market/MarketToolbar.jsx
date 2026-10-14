import React from 'react';
import { Search } from 'lucide-react';

/** Market filtre çubuğu: kategori çipleri + arama + sıralama. Sayfa kayarken sabit kalır. */
export default function MarketToolbar({ cats, cat, setCat, query, setQuery, sort, setSort, items, favsCount = 0 }) {
  const count = (key) => (key === 'favs' ? favsCount : key === 'all' ? items.length : items.filter((i) => i.category === key).length);
  return (
    <div className="sticky top-14 md:top-16 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-5 md:px-6 py-3 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2 flex-1 min-w-[220px]">
          {cats.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${cat === c.key ? 'bg-sun text-ink border-ink' : 'bg-card text-foreground/70 border-border hover:border-mint/50'}`}
            >
              {c.label}
              {count(c.key) > 0 && <span className="ml-1.5 font-mono text-[10px] opacity-70">{count(c.key)}</span>}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün ara…"
            className="w-44 md:w-56 rounded-full bg-card border border-border pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full bg-card border border-border px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="new">En Yeni</option>
          <option value="price_asc">Fiyat: Artan</option>
          <option value="price_desc">Fiyat: Azalan</option>
        </select>
      </div>
    </div>
  );
}