import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, Loader2, ShoppingBag, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import useSeo from '@/hooks/useSeo';
import useSiteSettings from '@/hooks/useSiteSettings';
import { useCart } from '@/lib/CartContext';
import { useFavorites } from '@/lib/FavoritesContext';
import Reveal from '@/components/site/Reveal';
import MarketItemCard from '@/components/market/MarketItemCard';
import CartDialog from '@/components/market/CartDialog';
import MarketHero from '@/components/market/MarketHero';
import MarketToolbar from '@/components/market/MarketToolbar';
import CampaignTicker from '@/components/market/CampaignTicker';
import CampaignsSection from '@/components/market/CampaignsSection';
import BundleSection from '@/components/market/BundleSection';
import CompareTable from '@/components/market/CompareTable';
import TrustStrip from '@/components/market/TrustStrip';
import { motion } from 'framer-motion';
import { useAssistant } from '@/lib/AssistantContext';

const CATS = [
  { key: 'all', label: 'Tümü' },
  { key: 'tema', label: 'Temalar' },
  { key: 'paket', label: 'Paketler' },
  { key: 'nfckart', label: 'NFC Kart' },
  { key: 'eklenti', label: 'Eklentiler' },
  { key: 'favs', label: 'Favoriler' },
];

export default function MarketPage() {
  useSeo({
    title: 'Dijitrak Market — Temalar, Paketler, NFC Kartlar ve Eklentiler',
    description: 'Dijitrak market: hazır web temaları, özel paketler, NFC işletme kartları ve dijital eklentiler.',
    path: '/market',
  });
  const [s, ready] = useSiteSettings();
  const [items, setItems] = useState(null);
  const [cat, setCat] = useState(() => {
    const kat = new URLSearchParams(window.location.search).get('kat');
    return CATS.some((c) => c.key === kat) ? kat : 'all';
  });
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('new');
  const [checkout, setCheckout] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [bundles, setBundles] = useState([]);
  const { items: cart, total, discount, discountedTotal } = useCart();
  const favs = useFavorites();
  const { openAssistant } = useAssistant();

  useEffect(() => {
    base44.entities.MarketItem.filter({ status: 'published' }, '-created_date', 100).then(setItems).catch(() => setItems([]));
    base44.entities.Campaign.filter({ status: 'published' }, '-created_date', 20).then(setCampaigns).catch(() => {});
    base44.entities.Bundle.filter({ status: 'published' }, '-created_date', 20).then(setBundles).catch(() => {});
  }, []);

  const visible = useMemo(() => {
    let list = items || [];
    if (cat === 'favs') list = list.filter((i) => favs.ids.includes(i.id));
    else if (cat !== 'all') list = list.filter((i) => i.category === cat);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((i) => `${i.title} ${i.description || ''} ${i.features || ''}`.toLowerCase().includes(q));
    if (sort === 'price_asc') list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === 'price_desc') list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
    return list;
  }, [items, cat, query, sort, favs.ids]);

  if (!ready) {
    return <div className="py-32 text-center"><Loader2 className="w-8 h-8 text-mint animate-spin mx-auto" /></div>;
  }

  if (!s.market_enabled) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-28 text-center">
        <ShoppingBag className="w-12 h-12 text-mint mx-auto" />
        <h1 className="font-display text-3xl font-semibold mt-4">Market şu anda kapalı</h1>
        <p className="text-foreground/60 mt-2">Çok yakında! Bu arada hizmetlerimize göz atabilirsiniz.</p>
        <Link to="/hizmetler" className="mt-6 inline-block rounded-full bg-mint text-ink font-semibold px-6 py-3 hover:shadow-sticker transition-shadow">Hizmetler</Link>
      </div>
    );
  }

  const filtersActive = cat !== 'all' || query.trim() !== '' || sort !== 'new';

  return (
    <div className="pb-28">
      <MarketHero
        campaigns={campaigns}
        bundles={bundles}
        stats={{ products: (items || []).length, bundles: bundles.length, campaigns: campaigns.length }}
        onAsk={() => openAssistant({ text: 'Marketteki ürün ve paketler hakkında bilgi almak istiyorum.' })}
      />

      <CampaignTicker campaigns={campaigns} />

      <TrustStrip />

      <div className="mt-14">
        <div id="urunler" className="scroll-mt-24 max-w-7xl mx-auto px-5 md:px-6 pb-4 flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl md:text-3xl font-semibold">
            Tüm Ürünler
            {items !== null && <span className="ml-2 font-mono text-sm text-muted-foreground">({visible.length})</span>}
          </h2>
        </div>
        <MarketToolbar
          cats={CATS}
          cat={cat}
          setCat={setCat}
          query={query}
          setQuery={setQuery}
          sort={sort}
          setSort={setSort}
          items={items || []}
          favsCount={favs.ids.length}
        />

        <div className="max-w-7xl mx-auto px-5 md:px-6 pt-8">
          {items === null ? (
            <div className="py-20 text-center"><Loader2 className="w-8 h-8 text-mint animate-spin mx-auto" /></div>
          ) : visible.length === 0 ? (
            <div className="border border-border rounded-3xl p-16 text-center space-y-4">
              <p className="text-muted-foreground">{filtersActive ? 'Bu filtreye uygun ürün bulunamadı.' : 'Bu kategoride henüz ürün yok.'}</p>
              {filtersActive && (
                <button
                  onClick={() => { setCat('all'); setQuery(''); setSort('new'); }}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-semibold hover:border-mint/50 hover:text-mint transition-colors"
                >
                  <X className="w-4 h-4" /> Filtreleri Temizle
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((item, i) => (
                <Reveal key={item.id} delay={i * 0.05}>
                  <MarketItemCard item={item} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      <CampaignsSection campaigns={campaigns} />

      <BundleSection bundles={bundles} items={items || []} />

      <CompareTable items={items || []} />

      {cart.length > 0 && (
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 20 }}
          className="fixed bottom-0 inset-x-0 z-40 border-t-2 border-ink bg-terminal"
        >
          <button
            onClick={() => setCheckout(true)}
            className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3 px-5 md:px-6 py-3.5"
          >
            <span className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground">
              <ShoppingBag className="w-4 h-4 text-mint" /> SEPET ÇUBUĞU
            </span>
            <span className="flex items-center gap-3">
              {discount && <span className="rounded-full bg-sun text-ink px-3 py-1 font-mono text-xs font-bold">{discount.code}</span>}
              {discount && <span className="line-through opacity-50 font-mono text-sm">{total.toLocaleString('tr-TR')} ₺</span>}
              <span className="font-display text-base md:text-lg font-bold">Sepet ({cart.length}) — {discountedTotal.toLocaleString('tr-TR')} ₺</span>
              <ChevronUp className="w-5 h-5 text-mint" />
            </span>
          </button>
        </motion.div>
      )}

      <CartDialog open={checkout} onClose={() => setCheckout(false)} />
    </div>
  );
}