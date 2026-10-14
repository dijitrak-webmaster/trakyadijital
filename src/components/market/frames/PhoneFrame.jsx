import React from 'react';
import { BatteryFull, Signal, Wifi } from 'lucide-react';
import useClock from '@/hooks/useClock';

/** iPhone kasası: canlı saat, Dynamic Island ve yan tuşlar. */
export default function PhoneFrame({ children }) {
  const clock = useClock();
  return (
    <div className="relative w-[416px] h-[870px] rounded-[3.2rem] p-[3px] bg-gradient-to-b from-zinc-300 via-zinc-500 to-zinc-400 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]">
      <span className="absolute -left-[3px] top-[17%] w-[4px] h-[3.5%] rounded-l-md bg-zinc-400" />
      <span className="absolute -left-[3px] top-[24%] w-[4px] h-[7%] rounded-l-md bg-zinc-400" />
      <span className="absolute -left-[3px] top-[33%] w-[4px] h-[7%] rounded-l-md bg-zinc-400" />
      <span className="absolute -right-[3px] top-[27%] w-[4px] h-[11%] rounded-r-md bg-zinc-400" />
      <div className="w-full h-full rounded-[3rem] bg-terminal p-[10px]">
        <div className="relative w-full h-full overflow-hidden rounded-[2.4rem] bg-background flex flex-col">
          <div className="h-10 shrink-0 relative flex items-center justify-between px-[9%] text-[11px] font-semibold text-foreground">
            <span>{clock}</span>
            <span className="flex items-center gap-1"><Signal className="w-3 h-3" /><Wifi className="w-3 h-3" /><BatteryFull className="w-4 h-4" /></span>
          </div>
          <div className="relative flex-1 min-h-0">{children}</div>
          <span className="absolute top-[7px] left-1/2 -translate-x-1/2 w-[31%] h-[24px] rounded-full bg-black z-10 pointer-events-none" />
          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[35%] h-[4px] rounded-full bg-zinc-500/80 z-10 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}