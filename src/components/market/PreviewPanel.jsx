import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ExternalLink } from 'lucide-react';
import DeviceSwitcher from '@/components/market/DeviceSwitcher';
import DevicePreview from '@/components/market/DevicePreview';
import useEmbeddable from '@/hooks/useEmbeddable';

export default function PreviewPanel({ item, previewHref }) {
  const [device, setDevice] = useState('desktop');
  const embeddable = useEmbeddable(item);
  return (
    <div className="rounded-3xl border border-border bg-card p-3 sm:p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <DeviceSwitcher value={device} onChange={setDevice} />
        <Link
          to={previewHref}
          className="inline-flex items-center gap-2 rounded-full bg-mint text-ink px-4 py-2 text-sm font-semibold hover:shadow-sticker transition-shadow"
        >
          <Eye className="w-4 h-4" /> Canlı Önizleme
        </Link>
      </div>
      {embeddable === false ? (
        <div className="rounded-2xl border border-dashed border-border px-5 py-12 text-center">
          <p className="font-semibold">Bu site çerçeve içinde önizlenemiyor</p>
          <a href={item.preview_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-mint">
            Demoyu yeni sekmede aç <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      ) : (
        <DevicePreview src={embeddable ? item.preview_url : undefined} device={device} title={item.title} />
      )}
    </div>
  );
}