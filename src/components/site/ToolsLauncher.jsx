import React from 'react';
import { ScanSearch } from 'lucide-react';
import { openToolsDrawer } from '@/lib/seoScan';

// Ücretsiz Araçlar çekiçmesi — sağ kenarda (masaüstü) ve sol altta (mobil)
export default function ToolsLauncher() {
  return (
    <>
      <button
        type="button"
        onClick={() => openToolsDrawer('menu')}
        className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 items-center gap-2 rounded-l-2xl bg-mint text-ink font-mono text-xs font-bold px-2.5 py-4 [writing-mode:vertical-rl] rotate-180 shadow-sticker hover:px-3.5 transition-all"
      >
        <ScanSearch className="w-4 h-4" />
        ÜCRETSİZ ARAÇLAR
      </button>
      <button
        type="button"
        onClick={() => openToolsDrawer('menu')}
        className="md:hidden fixed left-3 bottom-5 z-40 flex items-center gap-2 rounded-full bg-mint text-ink font-mono text-xs font-bold pl-4 pr-4 py-3 shadow-sticker active:scale-95 transition-transform"
      >
        <ScanSearch className="w-4 h-4" />
        Ücretsiz Araçlar
      </button>
    </>
  );
}