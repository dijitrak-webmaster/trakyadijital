import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/lib/CartContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/** Sepet çekmecesi: ürünler, indirim kodu ve ödeme ekranına geçiş. Ödeme /odeme sayfasında iyzico ile alınır. */
export default function CartDialog({ open, onClose }) {
  const { items, remove, total, discount, discountAmount, discountedTotal, applyDiscount, removeDiscount } = useCart();
  const [discCode, setDiscCode] = useState('');
  const [discBusy, setDiscBusy] = useState(false);
  const [discErr, setDiscErr] = useState('');

  const applyCode = async () => {
    setDiscBusy(true);
    const r = await applyDiscount(discCode);
    setDiscBusy(false);
    if (r.ok) { setDiscCode(''); setDiscErr(''); }
    else setDiscErr(r.error || 'Kod uygulanamadı.');
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Sepetim</DialogTitle>
        </DialogHeader>
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Sepetiniz boş.</p>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="divide-y divide-border border border-border rounded-xl">
              {items.map((i) => (
                <div key={i.id} className="flex items-center gap-3 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate">{i.title}</p>
                    <p className="font-mono text-xs text-muted-foreground">{(i.price || 0).toLocaleString('tr-TR')} ₺{i.billing === 'monthly' ? ' /ay' : ''}</p>
                  </div>
                  <button onClick={() => remove(i.id)} className="p-2 hover:text-coral transition-colors" aria-label="Kaldır"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            {discount ? (
              <div className="flex items-center justify-between rounded-xl border border-mint/40 bg-mint/10 px-3 py-2.5">
                <span className="text-sm font-semibold text-mint">{discount.code} — {discount.type === 'percent' ? `%${discount.value}` : `${Number(discount.value).toLocaleString('tr-TR')} ₺`} indirim</span>
                <button onClick={() => { removeDiscount(); setDiscErr(''); }} className="text-xs text-muted-foreground hover:text-coral">Kaldır</button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input className="w-full rounded-2xl border border-border bg-secondary/60 px-4 py-2.5 text-sm outline-none focus:border-mint/50" placeholder="İndirim kodu" value={discCode} onChange={(e) => setDiscCode(e.target.value.toUpperCase())} />
                  <button onClick={applyCode} disabled={discBusy || !discCode.trim()} className="rounded-xl bg-secondary border border-border px-4 text-sm font-semibold whitespace-nowrap hover:text-mint disabled:opacity-50">
                    {discBusy ? 'Kontrol...' : 'Uygula'}
                  </button>
                </div>
                {discErr && <p className="text-xs text-coral mt-1.5">{discErr}</p>}
              </div>
            )}
            {discount && (
              <p className="text-sm text-right text-muted-foreground">İndirim: -{discountAmount.toLocaleString('tr-TR')} ₺</p>
            )}
            <p className="font-display text-xl font-semibold text-right">
              {items.some((i) => i.billing === 'monthly') ? 'Aylık toplam: ' : 'Toplam: '}{(discount ? discountedTotal : total).toLocaleString('tr-TR')} ₺
            </p>
            <Link
              to="/odeme"
              onClick={onClose}
              className="block text-center w-full rounded-full bg-mint text-ink font-semibold py-3 text-sm hover:shadow-sticker transition-shadow"
            >
              Siparişi Tamamla
            </Link>
            <p className="text-center text-xs text-muted-foreground">Ödeme linki iyzico üzerinden size iletilir.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}