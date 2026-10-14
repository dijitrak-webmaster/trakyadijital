import React, { createContext, useContext, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

const CartContext = createContext(null);
const STORE_KEY = 'dijitrak-cart-v1';
const DISCOUNT_KEY = 'dijitrak-cart-discount-v1';

/** Sepet + indirim kodu: tarayıcıda saklanır — ziyaretçi sayfalar ve oturumlar arasında kaybetmez. */
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE_KEY));
      return Array.isArray(raw) ? raw.filter((i) => i && i.id && i.title) : [];
    } catch { return []; }
  });
  const [discount, setDiscount] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DISCOUNT_KEY)); } catch { return null; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(items)); } catch { /* kota dolu vs. */ }
  }, [items]);
  useEffect(() => {
    try {
      if (discount) localStorage.setItem(DISCOUNT_KEY, JSON.stringify(discount));
      else localStorage.removeItem(DISCOUNT_KEY);
    } catch { /* sessiz */ }
  }, [discount]);

  const add = (item) =>
    setItems((p) => (p.some((i) => i.id === item.id) ? p : [...p, {
      id: item.id, title: item.title, price: item.price,
      category: item.category, description: item.description,
      image_url: item.image_url, slug: item.slug,
      billing: item.billing || 'one_time',
    }]));
  const remove = (id) => setItems((p) => p.filter((i) => i.id !== id));
  const clear = () => { setItems([]); setDiscount(null); };
  const total = items.reduce((t, i) => t + (i.price || 0), 0);

  const discountAmount = discount ? Math.min(discount.amount || 0, total) : 0;
  const discountedTotal = Math.max(0, total - discountAmount);

  /** Kodu hem bağımsız indirim kodlarından hem yayınlanmış kampanyalardan arar. */
  const applyDiscount = async (code) => {
    const c = (code || '').trim().toUpperCase();
    if (!c) return { ok: false, error: 'Kod girin.' };
    try {
      const [codes, camps] = await Promise.all([
        base44.entities.DiscountCode.filter({ code: c }).catch(() => []),
        base44.entities.Campaign.filter({ code: c }).catch(() => []),
      ]);
      const row = codes.find((r) => r.status !== 'passive') || camps.find((r) => r.status === 'published');
      if (!row) return { ok: false, error: 'Kod bulunamadı veya geçersiz.' };
      if (row.valid_until && new Date(`${row.valid_until}T23:59:59`) < new Date()) {
        return { ok: false, error: 'Bu kodun süresi doldu.' };
      }
      const type = row.discount_type === 'fixed' ? 'fixed' : 'percent';
      const amount = type === 'percent'
        ? Math.round(total * (Number(row.discount_value) || 0) / 100)
        : Math.min(Number(row.discount_value) || 0, total);
      if (amount <= 0) return { ok: false, error: 'Bu kod sepetine indirim sağlamıyor.' };
      const d = { code: c, type, value: Number(row.discount_value) || 0, amount };
      setDiscount(d);
      return { ok: true, discount: d };
    } catch {
      return { ok: false, error: 'Kod doğrulanamadı, tekrar deneyin.' };
    }
  };
  const removeDiscount = () => setDiscount(null);

  return (
    <CartContext.Provider value={{ items, add, remove, clear, total, discount, discountAmount, discountedTotal, applyDiscount, removeDiscount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);