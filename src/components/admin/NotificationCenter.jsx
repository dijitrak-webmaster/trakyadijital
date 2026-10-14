import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Inbox, FileCheck2, RefreshCw, XCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { base44 } from '@/api/base44Client';

const SEEN_KEY = 'dj_notif_seen';

const KIND = {
  lead: { icon: Inbox, cls: 'bg-mint/15 text-mint', label: 'Yeni talep' },
  quote: { icon: FileCheck2, cls: 'bg-sun/15 text-sun', label: 'Teklif tamamlandı' },
  sub_active: { icon: RefreshCw, cls: 'bg-mint/15 text-mint', label: 'Abonelik aktif' },
  sub_cancelled: { icon: XCircle, cls: 'bg-coral/15 text-coral', label: 'Abonelik iptal' },
};

const ts = (d) => new Date(d || 0).getTime();
const fmtAgo = (d) => {
  const mins = Math.floor((Date.now() - ts(d)) / 60000);
  if (mins < 1) return 'şimdi';
  if (mins < 60) return `${mins} dk önce`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h} saat önce`;
  return `${Math.floor(h / 24)} gün önce`;
};

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [subs, setSubs] = useState([]);
  const [lastSeen, setLastSeen] = useState(() => Number(localStorage.getItem(SEEN_KEY) || 0));

  useEffect(() => {
    let mounted = true;
    const load = () => Promise.all([
      base44.entities.Lead.list('-created_date', 30).catch(() => []),
      base44.entities.Subscription.list('-updated_date', 30).catch(() => []),
    ]).then(([l, s]) => { if (mounted) { setLeads(l || []); setSubs(s || []); } });
    load();
    const unsubs = [base44.entities.Lead.subscribe(load), base44.entities.Subscription.subscribe(load)];
    return () => { mounted = false; unsubs.forEach((u) => u()); };
  }, []);

  const items = useMemo(() => [
    ...leads
      .filter((l) => (l.status || 'new') === 'new')
      .map((l) => ({ id: `lead-${l.id}`, kind: 'lead', title: l.name || 'İsimsiz', sub: l.service || 'Hizmet belirtilmedi', date: l.created_date, to: '/admin/talepler' })),
    ...leads
      .filter((l) => l.quote_token)
      .map((l) => ({ id: `quote-${l.id}`, kind: 'quote', title: l.name || 'İsimsiz', sub: l.package_summary ? String(l.package_summary).slice(0, 60) : 'Paket teklifi hazır', date: l.updated_date || l.created_date, to: '/admin/talepler' })),
    ...subs.map((s) => ({
      id: `sub-${s.id}`, kind: s.status === 'cancelled' ? 'sub_cancelled' : 'sub_active',
      title: s.item_title, sub: `${s.client_email} · ${s.monthly_price || 0} ₺/ay · bitiş ${s.end_date || '-'}`,
      date: s.updated_date || s.created_date, to: '/admin/musteriler',
    })),
  ].sort((a, b) => ts(b.date) - ts(a.date)), [leads, subs]);

  const unread = items.filter((i) => ts(i.date) > lastSeen).length;

  const toggleOpen = (o) => {
    setOpen(o);
    if (o) {
      const now = Date.now();
      localStorage.setItem(SEEN_KEY, String(now));
      setLastSeen(now);
    }
  };

  return (
    <Popover open={open} onOpenChange={toggleOpen}>
      <PopoverTrigger className="relative p-2 rounded-xl text-foreground/70 hover:text-mint transition-colors" aria-label="Bildirimler">
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 rounded-full bg-coral text-ink font-mono text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-[340px] max-w-[92vw] p-0 bg-card border-border">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="font-display font-semibold text-sm">Bildirimler</p>
          <span className="font-mono text-[10px] text-muted-foreground">canlı</span>
        </div>
        <div className="max-h-[360px] overflow-y-auto divide-y divide-border">
          {items.length === 0 ? (
            <p className="px-4 py-10 text-center font-mono text-xs text-muted-foreground">Yeni bildirim yok.</p>
          ) : (
            items.slice(0, 15).map((i) => {
              const k = KIND[i.kind];
              const Icon = k.icon;
              const isUnread = ts(i.date) > lastSeen;
              return (
                <Link
                  key={i.id}
                  to={i.to}
                  onClick={() => toggleOpen(false)}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors ${isUnread ? 'bg-mint/[0.04]' : ''}`}
                >
                  <span className={`mt-0.5 rounded-lg p-1.5 ${k.cls}`}><Icon className="w-3.5 h-3.5" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate">{i.title}</span>
                      {isUnread && <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-coral" />}
                    </span>
                    <span className="block font-mono text-[10px] text-muted-foreground mt-0.5">{k.label} · {i.sub}</span>
                    <span className="block font-mono text-[10px] text-foreground/40 mt-0.5">{fmtAgo(i.date)}</span>
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}