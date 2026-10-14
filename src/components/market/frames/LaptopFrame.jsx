import React from 'react';
import { Lock, RotateCw } from 'lucide-react';

/** MacBook kasası — gerçek ölçüde (1480×878 px, ekran 1280×800) çizilir, dışarıdan ölçeklenir. */
export default function LaptopFrame({ title, children }) {
  return (
    <div className="w-[1480px] h-[878px] flex flex-col items-center">
      <div className="relative w-[1322px] h-[852px] rounded-t-[26px] rounded-b-[6px] p-[3px] bg-gradient-to-b from-zinc-400 to-zinc-600">
        <div className="relative w-full h-full rounded-t-[23px] rounded-b-[4px] bg-black px-[18px] pt-[26px] pb-[20px]">
          <span className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full bg-zinc-800" />
          <div className="relative w-full h-full overflow-hidden rounded-[3px] bg-background flex flex-col">
            <div className="h-[40px] shrink-0 flex items-center gap-4 px-4 bg-secondary border-b border-border">
              <span className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-coral" />
                <span className="w-3 h-3 rounded-full bg-sun" />
                <span className="w-3 h-3 rounded-full bg-mint" />
              </span>
              <span className="flex-1 flex justify-center">
                <span className="w-[520px] h-[26px] rounded-lg bg-background/70 flex items-center justify-center gap-2 text-[13px] text-muted-foreground">
                  <Lock className="w-3 h-3" /><span className="truncate">{title}</span>
                </span>
              </span>
              <RotateCw className="w-3.5 h-3.5 text-muted-foreground mr-10" />
            </div>
            <div className="relative flex-1 min-h-0">{children}</div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-[26px] rounded-t-[3px] rounded-b-[44px] bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-600 shadow-[0_30px_40px_-12px_rgba(0,0,0,0.7)]">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-[230px] h-[10px] rounded-b-[12px] bg-zinc-500" />
      </div>
    </div>
  );
}