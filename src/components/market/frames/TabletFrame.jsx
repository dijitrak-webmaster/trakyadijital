import React from 'react';
import { BatteryFull, Wifi } from 'lucide-react';
import useClock from '@/hooks/useClock';

/** iPad Air kasası — gerçek ölçüde (916×1276 px, ekran 820×1180) çizilir, dışarıdan ölçeklenir. */
export default function TabletFrame({ children }) {
  const clock = useClock();
  const date = new Date().toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' });
  return (
    <div className="relative w-[916px] h-[1276px] rounded-[60px] p-[4px] bg-gradient-to-b from-zinc-400 via-zinc-500 to-zinc-600 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.75)]">
      <span className="absolute -top-[3px] right-[120px] w-[76px] h-[5px] rounded-t-md bg-zinc-500" />
      <span className="absolute -right-[3px] top-[140px] w-[5px] h-[72px] rounded-r-md bg-zinc-500" />
      <span className="absolute -right-[3px] top-[228px] w-[5px] h-[72px] rounded-r-md bg-zinc-500" />
      <div className="relative w-full h-full rounded-[56px] bg-black p-[22px]">
        <span className="absolute top-[9px] left-1/2 -translate-x-1/2 w-[8px] h-[8px] rounded-full bg-zinc-800" />
        <div className="relative w-full h-full overflow-hidden rounded-[18px] bg-background flex flex-col">
          <div className="h-[24px] shrink-0 flex items-center justify-between px-6 text-[13px] font-semibold text-foreground">
            <span>{clock}<span className="ml-2 font-medium opacity-80">{date}</span></span>
            <span className="flex items-center gap-1.5"><Wifi className="w-4 h-4" /><span>%100</span><BatteryFull className="w-6 h-6" /></span>
          </div>
          <div className="relative flex-1 min-h-0">{children}</div>
          <span className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[200px] h-[5px] rounded-full bg-zinc-500/80 z-10 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}