import React from 'react';

/** Yönetim paneli sayfa başlığı — tüm modüllerde ortak yapı: kırıntı, başlık, alt yazı, eylemler */
export default function AdminPageHeader({ crumb, title, subtitle, actions, live = false }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <span className="font-mono text-xs uppercase text-mint">{crumb}</span>
        <h1 className="font-display text-4xl font-semibold mt-1">
          {title}
          {live && (
            <span className="ml-3 align-middle inline-flex items-center gap-1.5 rounded-full border border-mint/40 bg-mint/10 px-3 py-1 font-mono text-[10px] text-mint">
              <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" /> CANLI
            </span>
          )}
        </h1>
        {subtitle && <div className="text-sm text-foreground/60 mt-2 max-w-2xl">{subtitle}</div>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}