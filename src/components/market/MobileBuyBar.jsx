import React from 'react';
import { Check, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { formatPrice } from '@/lib/marketUtils';

export default function MobileBuyBar({ item, onCart }) {
  const { add, items } = useCart();
  const inCart = items.some((i) => i.id === item.id);
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur-xl border-t border-border px-5 py-3 flex items-center gap-3">
      <span className="font-display text-2xl font-semibold whitespace-nowrap">{formatPrice(item.price)}</span>
      <button
        onClick={() => add(item)}
        disabled={inCart}
        className={`flex-1 flex items-center justify-center gap-2 rounded-full py-3 font-semibold transition-all ${inCart ? 'bg-secondary text-muted-foreground' : 'bg-coral text-ink border border-ink/20 active:scale-95'}`}
      >
        {inCart ? <><Check className="w-4 h-4" /> Sepette</> : <><Plus className="w-4 h-4" /> Sepete Ekle</>}
      </button>
      <button
        onClick={onCart}
        aria-label="Sepete git"
        className="grid place-items-center w-12 h-12 shrink-0 rounded-full border border-mint/50 text-mint active:scale-95 transition-transform"
      >
        <ShoppingBag className="w-5 h-5" />
      </button>
    </div>
  );
}