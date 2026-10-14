import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { CONTENT_TABS } from '@/pages/AdminContent';
import {
  LayoutDashboard, Inbox, FolderKanban, ShoppingBag, RefreshCcw, MessageSquare,
  HelpCircle, Phone, Settings, LogOut, ExternalLink, MessageCircle, Gauge, Users, FileText,
} from 'lucide-react';
import AdminGate from '@/components/admin/AdminGate';
import NotificationCenter from '@/components/admin/NotificationCenter';
import { LogoMark } from '@/components/site/Logo';
import { base44 } from '@/api/base44Client';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu,
  SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarProvider,
  SidebarRail, SidebarTrigger,
} from '@/components/ui/sidebar';

// URL'deki ?tab= parametresiyle müşteri alt sayfalarını eşleyen yardımcı
const tabMatch = (key) => (loc) => {
  if (loc.pathname !== '/admin/musteriler') return false;
  const t = new URLSearchParams(loc.search).get('tab');
  return (t || 'projects') === key;
};

// İçerik & pazar yeri menüleri CONTENT_TABS'tan (grup + ikon) türetilir
const tabLink = (t) => ({
  to: `/admin/icerik/${t.key}`,
  label: t.label,
  icon: t.icon,
  match: (l) => l.pathname === `/admin/icerik/${t.key}`,
});

// Bölümlenmiş yönetim menüsü — shadcn Sidebar üzerinde çalışır
const NAV_SECTIONS = [
  { label: null, items: [{ to: '/admin', label: 'Genel Bakış', icon: LayoutDashboard, match: (l) => l.pathname === '/admin' }] },
  {
    label: 'Satış',
    items: [{ to: '/admin/talepler', label: 'Talepler', icon: Inbox, badge: 'leads', match: (l) => l.pathname === '/admin/talepler' }],
  },
  {
    label: 'Müşteriler',
    items: [
      { to: '/admin/musteriler?tab=clients', label: 'Müşteriler', icon: Users, match: tabMatch('clients') },
      { to: '/admin/crm', label: 'CRM Analizi', icon: Gauge, match: (l) => l.pathname === '/admin/crm' },
      { to: '/admin/musteriler', label: 'Projeler', icon: FolderKanban, match: tabMatch('projects') },
      { to: '/admin/musteriler?tab=quotes', label: 'Özel Teklifler', icon: FileText, match: tabMatch('quotes') },
      { to: '/admin/musteriler?tab=orders', label: 'Siparişler', icon: ShoppingBag, badge: 'orders', match: tabMatch('orders') },
      { to: '/admin/musteriler?tab=subscriptions', label: 'Abonelikler', icon: RefreshCcw, match: tabMatch('subscriptions') },
      { to: '/admin/musteriler?tab=revisions', label: 'Revizyonlar', icon: MessageSquare, badge: 'revisions', match: tabMatch('revisions') },
      { to: '/admin/musteriler?tab=questions', label: 'Sorular', icon: HelpCircle, match: tabMatch('questions') },
      { to: '/admin/musteriler?tab=phones', label: 'WhatsApp Numaraları', icon: Phone, match: tabMatch('phones') },
    ],
  },
  { label: 'İçerik', items: CONTENT_TABS.filter((t) => t.group === 'icerik').map(tabLink) },
  { label: 'Pazar Yeri', items: CONTENT_TABS.filter((t) => t.group === 'market').map(tabLink) },
  { label: 'İletişim', items: [{ to: '/admin/whatsapp', label: 'WhatsApp Şablonları', icon: MessageCircle, match: (l) => l.pathname === '/admin/whatsapp' }] },
  { label: 'Sistem', items: [{ to: '/admin/ayarlar', label: 'Ayarlar', icon: Settings, match: (l) => l.pathname === '/admin/ayarlar' }] },
];

const fmtCount = (n) => (n > 9 ? '9+' : String(n));

export default function AdminLayout() {
  const loc = useLocation();
  const [me, setMe] = useState(null);
  // bekleyen iş göstergeleri: yeni talep, yeni sipariş, açık revizyon
  const [counts, setCounts] = useState({ leads: 0, orders: 0, revisions: 0 });
  useEffect(() => { base44.auth.me().then(setMe).catch(() => setMe(false)); }, []);
  useEffect(() => {
    let mounted = true;
    const load = () => Promise.all([
      base44.entities.Lead.filter({ status: 'new' }, '-created_date', 100).catch(() => []),
      base44.entities.Order.filter({ status: 'new' }, '-created_date', 100).catch(() => []),
      base44.entities.RevisionRequest.filter({ status: 'open' }, '-updated_date', 100).catch(() => []),
    ]).then(([l, o, r]) => {
      if (mounted) setCounts({ leads: l.length, orders: o.length, revisions: r.length });
    });
    load();
    const unsubs = [base44.entities.Lead, base44.entities.Order, base44.entities.RevisionRequest]
      .map((e) => e.subscribe(load));
    return () => { mounted = false; unsubs.forEach((u) => u()); };
  }, []);
  const logout = () => base44.auth.logout('/login');
  const initial = (me?.full_name || me?.email || 'A').charAt(0).toUpperCase();

  return (
    <AdminGate>
      <SidebarProvider>
        <Sidebar collapsible="icon" className="border-r border-border bg-card/80 backdrop-blur-xl">
          <SidebarHeader className="border-b border-border p-0">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Genel Bakış" className="!h-14 !w-full">
                  <Link to="/admin" aria-label="Yönetim ana sayfası">
                    <LogoMark className="w-8 h-8 shrink-0" />
                    <span className="font-display font-bold text-lg leading-none whitespace-nowrap group-data-[collapsible=icon]:hidden">
                      DİJİ<span className="text-mint">TRAK</span>
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent className="py-2">
            {NAV_SECTIONS.map((sec) => (
              <SidebarGroup key={sec.label || 'genel'} className="px-2 py-1">
                {sec.label && <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">{sec.label}</SidebarGroupLabel>}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sec.items.map((l) => {
                      const badgeCount = l.badge ? counts[l.badge] : 0;
                      return (
                        <SidebarMenuItem key={l.to}>
                          <SidebarMenuButton asChild isActive={l.match(loc)} tooltip={l.label} className="font-semibold">
                            <Link to={l.to}>
                              <l.icon className="w-[18px] h-[18px] shrink-0" />
                              <span className="whitespace-nowrap">{l.label}</span>
                            </Link>
                          </SidebarMenuButton>
                          {badgeCount > 0 && (
                            <SidebarMenuBadge className="rounded-full bg-coral text-ink font-mono text-[10px] font-bold px-2 group-data-[collapsible=icon]:hidden">
                              {fmtCount(badgeCount)}
                            </SidebarMenuBadge>
                          )}
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
          <SidebarFooter className="border-t border-border">
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2 px-2 py-1.5 group-data-[collapsible=icon]:justify-center">
                <div className="w-8 h-8 rounded-full bg-mint text-ink font-bold flex items-center justify-center text-sm shrink-0" title={me?.email || ''}>{initial}</div>
                <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                  <p className="font-mono text-xs truncate" title={me?.email || ''}>{me?.email || ''}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-mint">{me?.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}</p>
                </div>
                <button onClick={logout} aria-label="Çıkış" className="p-2 rounded-xl text-muted-foreground hover:text-coral hover:bg-secondary transition-colors group-data-[collapsible=icon]:hidden">
                  <LogOut className="w-4 h-4" />
                </button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="min-w-0 bg-background">
          <header className="sticky top-0 z-40 flex items-center justify-between gap-3 h-14 px-4 md:px-6 bg-background/95 backdrop-blur border-b border-border">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-foreground/80 hover:text-mint" aria-label="Menüyü aç/kapat" />
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <NotificationCenter />
              <Link to="/" className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-mint transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> siteye dön
              </Link>
              <p className="hidden sm:block font-mono text-xs truncate max-w-[180px]" title={me?.email || ''}>{me?.email || ''}</p>
              <button onClick={logout} aria-label="Çıkış" className="p-2 rounded-xl text-muted-foreground hover:text-coral hover:bg-card transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>
          <main className="min-w-0">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AdminGate>
  );
}