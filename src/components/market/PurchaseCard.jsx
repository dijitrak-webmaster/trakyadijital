import React from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, Check, Eye, Plus, RefreshCw, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import StarRating from '@/components/market/StarRating';
import { formatPrice } from '@/lib/marketUtils';

export default function PurchaseCard({ item, previewHref, onCart }) {
  const { add, items } = useCart();
  const inCart = items.some((i) => i.id === item.id);

  return (
    <div className="rounded-3xl border border-border bg-card p-5 md:p-6 space-y-4 lg:sticky lg:top-24">
      <div className="-rotate-1 rounded-2xl bg-sun text-ink p-5 shadow-sticker">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-ink/60">Fiyat</p>
            <p className="font-display text-4xl font-bold leading-none mt-1">
              {formatPrice(item.price)}
              {item.billing === 'monthly' && <span className="font-body text-sm font-semibold text-ink/60"> /ay</span>}
            </p>
          </div>
          {item.badge && <span className="inline-block rounded-full border-2 border-ink/20 bg-ink text-foreground px-3 py-1 font-mono text-[10px] font-semibold -rotate-2">{item.badge}</span>}
        </div>
        <div className="relative mt-4 -mx-5 border-t-2 border-dashed border-ink/30">
          <span className="absolute -top-[11px] -left-2.5 w-5 h-5 rounded-full bg-card" />
          <span className="absolute -top-[11px] -right-2.5 w-5 h-5 rounded-full bg-card" />
        </div>
      </div>
      {item.rating ? <StarRating rating={item.rating} count={item.rating_count} /> : null}
      <button
        onClick={() => add(item)}
        disabled={inCart}
        className={`w-full flex items-center justify-center gap-2 rounded-full py-3.5 font-semibold transition-all ${inCart ? 'bg-secondary text-muted-foreground' : 'bg-coral text-ink border-2 border-ink/20 hover:shadow-sticker hover:-translate-y-0.5'}`}
      >
        {inCart ? <><Check className="w-4 h-4" /> Sepette</> : <><Plus className="w-4 h-4" /> Sepete Ekle</>}
      </button>
      {previewHref && (
        <Link to={previewHref} className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-ink/20 bg-coral text-ink py-3 font-semibold hover:shadow-sticker hover:-translate-y-0.5 transition-all">
          <Eye className="w-4 h-4" /> Canlı Önizleme
        </Link>
      )}
      <button onClick={onCart} className="w-full flex items-center justify-center gap-2 text-sm text-foreground/60 hover:text-mint transition-colors">
        <ShoppingBag className="w-4 h-4" /> Sepete git
      </button>
      <ul className="space-y-2.5 pt-4 border-t border-border text-sm text-foreground/75">
        {item.billing === 'monthly' && (
          <li className="flex gap-2.5"><RefreshCw className="w-4 h-4 text-sun shrink-0 mt-0.5" /> Aylık abonelik — otomatik yenilenir, dilediğiniz ay iptal edebilirsiniz.</li>
        )}
        <li className="flex gap-2.5"><ShieldCheck className="w-4 h-4 text-mint shrink-0 mt-0.5" /> Önce talep, sonra onay — teklif onaylanana kadar tahsilat yapılmaz.</li>
        <li className="flex gap-2.5"><Check className="w-4 h-4 text-mint shrink-0 mt-0.5" /> KDV ve özel kapsamda net teklifle kesinleşir.</li>
        <li className="flex gap-2.5"><BadgeCheck className="w-4 h-4 text-mint shrink-0 mt-0.5" /> Dijitrak güvencesi</li>
      </ul>
    </div>
  );
}