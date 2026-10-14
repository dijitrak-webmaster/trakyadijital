import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { normalizePreviewUrl } from '@/lib/marketUtils';

/** Ürünün önizleme linki çerçeve içinde açılabiliyor mu: undefined = kontrol ediliyor, true/false = sonuç. */
export default function useEmbeddable(item) {
  const url = (item?.preview_url || '').trim();
  // site içi /demo linkleri ve YouTube (embed'e çevrilir) kontrolsüz açılır
  const needsCheck = /^https?:\/\//i.test(url) && normalizePreviewUrl(url) === url;
  const [result, setResult] = useState({ url: null, ok: true });

  useEffect(() => {
    if (!needsCheck) return;
    let on = true;
    base44.functions.invoke('previewEmbedCheck', { slug: item.slug || item.id, host: window.location.host })
      .then((r) => on && setResult({ url, ok: r.data?.embeddable !== false }))
      .catch(() => on && setResult({ url, ok: true }));
    return () => { on = false; };
  }, [url, needsCheck]);

  if (!needsCheck) return true;
  return result.url === url ? result.ok : undefined;
}