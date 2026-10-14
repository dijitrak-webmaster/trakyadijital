import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useSeo from '@/hooks/useSeo';
import useMarketItem from '@/hooks/useMarketItem';
import { CAT_LABELS, previewHref as itemPreviewHref } from '@/lib/marketUtils';
import { Image } from '@/components/ui/image';
import ItemHeader from '@/components/market/ItemHeader';
import PreviewPanel from '@/components/market/PreviewPanel';
import ItemOverview from '@/components/market/ItemOverview';
import ItemIncluded from '@/components/market/ItemIncluded';
import BuyTogether from '@/components/market/BuyTogether';
import ItemFaq from '@/components/market/ItemFaq';
import PurchaseCard from '@/components/market/PurchaseCard';
import ItemInfoTable from '@/components/market/ItemInfoTable';
import RelatedList from '@/components/market/RelatedList';
import MobileBuyBar from '@/components/market/MobileBuyBar';
import CartDialog from '@/components/market/CartDialog';

export default function MarketItemPage() {
  const { slug } = useParams();
  const item = useMarketItem(slug);
  const [checkout, setCheckout] = useState(false);

  useSeo({
    title: item?.title ? `${item.title} — Dijitrak Market` : 'Dijitrak Market',
    description: item?.description || '',
    path: `/market/${slug}`,
  });

  if (item === undefined) {
    return <div className="pt-40 pb-32 text-center"><Loader2 className="w-8 h-8 text-mint animate-spin mx-auto" /></div>;
  }
  if (!item) {
    return (
      <div className="max-w-2xl mx-auto px-5 pt-40 pb-28 text-center">
        <h1 className="font-display text-3xl font-semibold">Ürün bulunamadı</h1>
        <Link to="/market" className="mt-6 inline-block rounded-full bg-mint text-ink font-semibold px-6 py-3">Markete Dön</Link>
      </div>
    );
  }

  const catLabel = CAT_LABELS[item.category] || item.category;
  const previewHref = item.preview_url ? itemPreviewHref(item) : null;

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-6 pt-24 md:pt-32 pb-32 lg:pb-16">
      <ItemHeader item={item} catLabel={catLabel} />

      <div className="mt-8 grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
        <div className="space-y-6 min-w-0">
          {previewHref ? (
            <PreviewPanel item={item} previewHref={previewHref} />
          ) : (
            <div className="rounded-3xl border border-border bg-card p-3 sm:p-4">
              {item.image_url ? (
                <Image src={item.image_url} className="w-full aspect-[16/10] rounded-2xl" fittingType="fit" />
              ) : (
                <div className={`w-full aspect-[16/10] rounded-2xl ${item.color || 'bg-mint'} opacity-50`} />
              )}
            </div>
          )}
          <ItemOverview item={item} />
          <ItemIncluded item={item} />
          <BuyTogether item={item} />
          <ItemFaq item={item} catLabel={catLabel} />
        </div>

        <aside className="space-y-6">
          <PurchaseCard item={item} previewHref={previewHref} onCart={() => setCheckout(true)} />
          <ItemInfoTable item={item} catLabel={catLabel} />
          <RelatedList item={item} />
        </aside>
      </div>

      <MobileBuyBar item={item} onCart={() => setCheckout(true)} />
      <CartDialog open={checkout} onClose={() => setCheckout(false)} />
    </div>
  );
}