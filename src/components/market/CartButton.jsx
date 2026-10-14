import React, { useState } from 'react';
import { ShoppingCart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import CartDialog from '@/components/market/CartDialog';

const fmt = (n) => (n || 0).toLocaleString('tr-TR');

/** Navbar sepet düğmesi: rozette ürün sayısı, hover'da mini özet, tıklayınca sepet. */
const DEFAULT_CLASS = 'relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-mint/40 text-mint hover:bg-mint/10 active:scale-95 transition-all';

export default function CartButton({ className = DEFAULT_CLASS }) {
  const { items, total } = useCart();
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="relative group">
        <button
          onClick={() => setOpen(true)}
          title="Sepetim"
          aria-label="Sepetim"
          className={className}
        >
          <ShoppingCart className="w-4 h-4" />
          {items.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 grid place-items-center min-w-[18px] h-[18px] rounded-full bg-coral text-ink text-[10px] font-bold px-1">
              {items.length}
            </span>
          )}
        </button>

        {items.length > 0 && (
          <div className="hidden sm:block absolute right-0 top-full pt-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto pointer-events-none transition-all z-50">
            <div className="w-64 rounded-2xl border border-border bg-card p-3 shadow-sticker">
              <ul className="space-y-1.5 max-h-44 overflow-y-auto">
                {items.slice(0, 5).map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate font-medium">{i.title}</span>
                    <span className="font-mono text-muted-foreground shrink-0">{fmt(i.price)} ₺</span>
                  </li>
                ))}
                {items.length > 5 && <li className="text-[11px] text-muted-foreground">+{items.length - 5} ürün daha…</li>}
              </ul>
              <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-xs font-semibold">
                <span>Toplam</span>
                <span className="font-mono">{fmt(total)} ₺</span>
              </div>
              <button
                onClick={() => setOpen(true)}
                className="mt-2 w-full flex items-center justify-center gap-2 rounded-full bg-mint text-ink text-xs font-bold py-2 hover:shadow-sticker transition-shadow"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Sepeti Aç
              </button>
            </div>
          </div>
        )}
      </div>
      <CartDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}