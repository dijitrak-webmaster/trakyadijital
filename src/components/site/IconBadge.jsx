import React from 'react';

export default function IconBadge({ icon: Icon, tile = 'bg-foreground', className = '' }) {
  return (
    <div className={`w-12 h-12 shrink-0 rounded-xl ${tile} border-2 border-ink flex items-center justify-center shadow-sticker rotate-6 transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-110 ${className}`}>
      <Icon className="w-6 h-6 text-ink" strokeWidth={2.2} />
    </div>
  );
}