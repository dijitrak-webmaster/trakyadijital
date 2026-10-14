import React, { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useMarketItem from '@/hooks/useMarketItem';
import useEmbeddable from '@/hooks/useEmbeddable';
import { useCart } from '@/lib/CartContext';
import FullPreviewBar from '@/components/market/FullPreviewBar';
import FullPreviewFrame from '@/components/market/FullPreviewFrame';
import CartDialog from '@/components/market/CartDialog';

const DEVICES = ['desktop', 'tablet', 'mobile'];

/** ThemeForest tarzı tam ekran önizleme: üstte ince şerit, altta ürünün kendi linki. */
export default function MarketPreviewPage() {
  const { slug } = useParams();
  const item = useMarketItem(slug);
  const embeddable = useEmbeddable(item);
  const [params, setParams] = useSearchParams();
  const [device, setDevice] = useState(DEVICES.includes(params.get('cihaz')) ? params.get('cihaz') : 'desktop');
  const [checkout, setCheckout] = useState(false);
  const { add, items } = useCart();

  const changeDevice = (d) => {
    setDevice(d);
    setParams({ cihaz: d }, { replace: true });
  };

  if (item === undefined) {
    return <div className="h-[100dvh] grid place-items-center"><Loader2 className="w-8 h-8 text-mint animate-spin" /></div>;
  }
  if (!item || !item.preview_url) {
    return (
      <div className="h-[100dvh] grid place-items-center text-center px-5">
        <div>
          <p className="font-display text-2xl font-semibold">Bu ürün için önizleme yok</p>
          <Link to={`/market/${slug}`} className="mt-5 inline-block rounded-full bg-mint text-ink font-semibold px-6 py-3">Ürüne Dön</Link>
        </div>
      </div>
    );
  }

  const buy = () => {
    if (!items.some((i) => i.id === item.id)) add(item);
    setCheckout(true);
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-terminal">
      <FullPreviewBar item={item} device={device} onDevice={changeDevice} onBuy={buy} onCart={() => setCheckout(true)} />
      <div className="flex-1 min-h-0">
        <FullPreviewFrame src={item.preview_url} device={device} title={item.title} embeddable={embeddable} />
      </div>
      <CartDialog open={checkout} onClose={() => setCheckout(false)} />
    </div>
  );
}