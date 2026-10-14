import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { normalizePreviewUrl } from '@/lib/marketUtils';

/** Cihaz ekranındaki canlı demo: iframe gerçek çözünürlükte açılır, gerekirse ölçeklenir. */
export default function PreviewViewport({ src, title, width, height }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="absolute inset-0 overflow-hidden bg-background">
      {!loaded && (
        <div className="absolute inset-0 grid place-items-center">
          <Loader2 className="w-6 h-6 text-mint animate-spin" />
        </div>
      )}
      <iframe
        src={normalizePreviewUrl(src)}
        title={title}
        onLoad={() => setLoaded(true)}
        className="absolute inset-0 w-full h-full border-0"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}