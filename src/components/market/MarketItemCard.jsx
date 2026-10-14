import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, Eye, Heart } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useFavorites } from '@/lib/FavoritesContext';
import { Image } from '@/components/ui/image';
import StarRating from '@/components/market/StarRating';
import { previewHref as itemPreviewHref } from '@/lib/marketUtils';

const CAT = { tema: 'Tema', paket: 'Paket', nfckart: 'NFC Kart', eklenti: 'Eklenti' };
const BAND = { tema: 'bg-mint', paket: 'bg-sun', nfckart: 'bg-fog', eklenti: 'bg-coral' };

/** Bento vitrin ürün kartı: renkli kategori bandı + görsel + fiyat/satın alma. */
export default function MarketItemCard({ item }) {
  const { add, items } = useCart();
  const { toggle, has } = useFavorites();
  const inCart = items.some((i) => i.id === item.id);
  const features = (item.features || '').split(',').map((f) => f.trim()).filter(Boolean);
  const href = `/market/${item.slug || item.id}`;
  return (
    <div className="group h-full flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:-translate-y-1 hover:shadow-sticker transition-all">
      <div className={`flex items-center justify-between gap-2 px-4 py-2.5 ${BAND[item.category] || 'bg-mint'} text-ink`}>
        <span className="font-display text-sm font-bold">{CAT[item.category] || item.category}</span>
        <div className="flex items-center gap-1.5">
          {item.billing === 'monthly' && <span className="rounded-full bg-ink text-foreground px-2.5 py-0.5 font-mono text-[10px] font-semibold">Aylık</span>}
          {item.badge && <span className="rounded-full bg-ink text-foreground px-2.5 py-0.5 font-mono text-[10px] font-semibold">{item.badge}</span>}
        </div>
      </div>
      <div className="relative">
        <Link to={href} className="block overflow-hidden">
          {item.image_url ? (
            <Image src={item.image_url} className="h-44 w-full transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className={`h-44 w-full ${item.color || 'bg-mint'} opacity-60`} />
          )}
        </Link>
        <button
          onClick={(e) => { e.preventDefault(); toggle(item.id); }}
          title={has(item.id) ? 'Favorilerden çıkar' : 'Favorilere ekle'}
          aria-label={has(item.id) ? 'Favorilerden çıkar' : 'Favorilere ekle'}
          className="absolute top-3 right-3 z-10 grid place-items-center w-9 h-9 rounded-full bg-ink/70 text-foreground backdrop-blur hover:bg-ink transition-colors"
        >
          <Heart className={`w-4 h-4 ${has(item.id) ? 'fill-coral text-coral' : ''}`} />
        </button>
      </div>
      <div className="flex flex-col flex-1 p-5 gap-2.5">
        <Link to={href} className="font-display text-xl font-semibold hover:text-mint transition-colors">{item.title}</Link>
        <StarRating rating={item.rating} count={item.rating_count} />
        {item.description && <p className="text-sm text-foreground/65 leading-relaxed">{item.description}</p>}
        {features.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {features.map((f) => (
              <li key={f} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground/70">{f}</li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
          <span className="font-display text-2xl font-semibold">{(item.price || 0).toLocaleString('tr-TR')} ₺{item.billing === 'monthly' && <span className="font-body text-xs font-semibold text-muted-foreground"> /ay</span>}</span>
          <div className="flex items-center gap-2">
            {item.preview_url && (
              <Link to={itemPreviewHref(item)} title="Canlı önizleme" aria-label="Canlı önizleme" className="grid place-items-center w-9 h-9 rounded-full border border-mint/40 text-mint hover:bg-mint/10 transition-colors">
                <Eye className="w-4 h-4" />
              </Link>
            )}
            <button
              onClick={() => add(item)}
              disabled={inCart}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${inCart ? 'bg-secondary text-muted-foreground' : 'bg-mint text-ink hover:shadow-sticker'}`}
            >
              {inCart ? <><Check className="w-4 h-4" /> Sepette</> : <><Plus className="w-4 h-4" /> Ekle</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}