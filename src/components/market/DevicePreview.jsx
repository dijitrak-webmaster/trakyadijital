import React, { useEffect, useRef, useState } from 'react';
import PhoneFrame from '@/components/market/frames/PhoneFrame';
import TabletFrame from '@/components/market/frames/TabletFrame';
import LaptopFrame from '@/components/market/frames/LaptopFrame';
import PreviewViewport from '@/components/market/frames/PreviewViewport';

// Kasalar gerçek ölçüde çizilir, `zoom` ile orantılı küçülür — tıklama koordinatları doğru kalır, sayfa kaymaz
const DEVICES = {
  desktop: { outer: [1480, 878], screen: [1280, 760], maxH: 10000, Frame: LaptopFrame },
  tablet: { outer: [916, 1276], screen: [864, 1200], maxH: 660, Frame: TabletFrame },
  mobile: { outer: [416, 870], screen: [390, 804], maxH: 660, Frame: PhoneFrame },
};

/** Canlı demoyu gerçek cihaz çözünürlüğünde açar, kutuya sığacak şekilde ölçekler. `fill`: bulunduğu alanın yüksekliğine sığar. */
export default function DevicePreview({ src, device, title, fill = false, zoom = 1 }) {
  const box = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  const { outer: [ow, oh], screen: [w, h], maxH, Frame } = DEVICES[device];
  const s = size.w
    ? Math.max(0.1, Math.min(1, (size.w - 24) / ow, ((fill ? size.h : maxH) - 24) / oh)) * zoom
    : 0;

  return (
    <div ref={box} className={`w-full flex justify-center ${fill ? 'h-full items-center' : ''}`}>
      {s > 0 && (
        <div style={{ zoom: s }}>
          <Frame title={title}>
            <PreviewViewport src={src} title={title} width={w} height={h} />
          </Frame>
        </div>
      )}
    </div>
  );
}