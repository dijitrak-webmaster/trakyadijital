import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Copy, ShoppingBag, ShoppingCart, X } from 'lucide-react';
import { LogoMark } from '@/components/site/Logo';
import DeviceSwitcher from '@/components/market/DeviceSwitcher';
import { formatPrice, itemHref } from '@/lib/marketUtils';

const iconBtn = 'hidden sm:grid place-items-center w-9 h-9 shrink-0 rounded-full border border-border hover:text-mint hover:border-mint/40 transition-colors';

/** ThemeForest tarzı ince üst şerit: logo + ürün, cihaz seçimi, fiyat, Satın Al, çerçeveyi kaldır. */
export default function FullPreviewBar({ item, device, onDevice, onBuy, onCart }) {
  const [copied, setCopied] = useState(false);
  const share = () => navigator.clipboard.writeText(window.location.href).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  });

  return (
    <header className="h-14 shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-5 bg-background border-b border-border">
      <Link to={itemHref(item)} aria-label="Ürün detayına dön" title="Detaya dön" className="grid place-items-center w-9 h-9 shrink-0 rounded-full hover:text-mint transition-colors">
        <ArrowLeft className="w-4 h-4" />
      </Link>
      <Link to="/" aria-label="Dijitrak" className="shrink-0"><LogoMark className="w-8 h-8" /></Link>
      <p className="font-display font-semibold truncate min-w-0 flex-1 md:flex-none md:max-w-[30%]">{item.title}</p>
      <div className="hidden md:flex flex-1 justify-center"><DeviceSwitcher value={device} onChange={onDevice} /></div>
      <span className="hidden sm:block font-display text-lg font-semibold whitespace-nowrap">
        {formatPrice(item.price)}{item.billing === 'monthly' && <span className="text-xs text-muted-foreground"> /ay</span>}
      </span>
      <button onClick={onBuy} className="inline-flex items-center gap-1.5 rounded-full bg-mint text-ink px-4 py-2 text-sm font-semibold whitespace-nowrap hover:shadow-sticker transition-shadow">
        <ShoppingCart className="w-4 h-4" /> Satın Al
      </button>
      <button onClick={onCart} aria-label="Sepet" title="Sepet" className={iconBtn}><ShoppingBag className="w-4 h-4" /></button>
      <button onClick={share} aria-label="Önizleme bağlantısını kopyala" title="Bağlantıyı kopyala" className={iconBtn}>
        {copied ? <Check className="w-4 h-4 text-mint" /> : <Copy className="w-4 h-4" />}
      </button>
      <a href={item.preview_url} aria-label="Çerçeveyi kaldır" title="Çerçeveyi kaldır" className={iconBtn}><X className="w-4 h-4" /></a>
    </header>
  );
}