import React, { useEffect, useState } from 'react';
import { ExternalLink, Loader2, ShieldAlert } from 'lucide-react';
import { normalizePreviewUrl } from '@/lib/marketUtils';

const WIDTHS = { desktop: 'w-full', tablet: 'w-[768px] border-x', mobile: 'w-[390px] border-x' };

/** Ürün linkini tam ekran açar; tablet/mobilde genişliği daraltır. Site çerçeveyi reddediyorsa yeni sekme önerir. */
export default function FullPreviewFrame({ src, device, title, embeddable }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(false), [src]);

  if (embeddable === false) {
    return (
      <div className="h-full grid place-items-center px-5 text-center">
        <div className="max-w-md">
          <ShieldAlert className="w-10 h-10 text-coral mx-auto" />
          <p className="mt-4 font-display text-xl font-semibold">Bu site önizleme çerçevesinde açılmaya izin vermiyor</p>
          <p className="mt-2 text-sm text-muted-foreground">Demoyu tam ekran olarak doğrudan açabilirsin.</p>
          <a href={src} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-6 py-3 text-sm hover:shadow-sticker transition-shadow">
            Demoyu Aç <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex justify-center">
      <div className={`relative h-full max-w-full border-border bg-background transition-[width] duration-300 ${WIDTHS[device]}`}>
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center"><Loader2 className="w-7 h-7 text-mint animate-spin" /></div>
        )}
        {embeddable && (
          <iframe
            src={normalizePreviewUrl(src)}
            title={title}
            onLoad={() => setLoaded(true)}
            className="absolute inset-0 w-full h-full border-0"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}