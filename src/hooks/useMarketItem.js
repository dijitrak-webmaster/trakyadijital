import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

/** Market ürününü slug ya da id ile yükler: undefined = yükleniyor, null = bulunamadı. */
export default function useMarketItem(slug) {
  const [item, setItem] = useState(undefined);

  useEffect(() => {
    let on = true;
    setItem(undefined);
    base44.entities.MarketItem.filter({ slug }).then(async (list) => {
      let it = list[0];
      if (!it) {
        try { it = await base44.entities.MarketItem.get(slug); } catch { it = null; }
      }
      if (on) setItem(it || null);
    }).catch(() => { if (on) setItem(null); });
    return () => { on = false; };
  }, [slug]);

  return item;
}