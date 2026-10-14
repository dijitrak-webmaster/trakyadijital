import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function NavDropdown({ label, items }) {
  // uzun listeler (Keşfet) iki sütunda açılır — menü kısa ve dengeli kalır
  const wide = items.length > 8;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group inline-flex items-center gap-1 h-9 px-3 rounded-full outline-none text-foreground/80 hover:bg-foreground/10 hover:text-mint data-[state=open]:bg-foreground/10 data-[state=open]:text-mint transition-colors">
        {label} <ChevronDown className="w-3.5 h-3.5 opacity-70 transition-transform group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={12}
        className={`bg-card border-border rounded-2xl p-1.5 shadow-xl shadow-black/30 ${wide ? 'grid grid-cols-2 gap-0.5 min-w-[380px]' : 'min-w-[220px]'}`}
      >
        {items.map((it) => (
          <DropdownMenuItem key={it.label} asChild className="rounded-xl px-3 py-2 text-sm font-medium text-foreground/85 cursor-pointer focus:bg-secondary focus:text-mint">
            {it.href.startsWith('/#') ? <a href={it.href}>{it.label}</a> : <Link to={it.href}>{it.label}</Link>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}