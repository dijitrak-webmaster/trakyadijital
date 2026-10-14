import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban, FileText, HelpCircle, LogOut, LayoutDashboard, RefreshCw,
  ExternalLink, BarChart3,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { AssistantProvider, useAssistant } from '@/lib/AssistantContext';
import AssistantPanel from '@/components/assistant/AssistantPanel';
import PortalOverview from '@/components/portal/PortalOverview';
import PortalProjects from '@/components/portal/PortalProjects';
import PortalQuotes from '@/components/portal/PortalQuotes';
import PortalQuestions from '@/components/portal/PortalQuestions';
import PortalSubscriptions from '@/components/portal/PortalSubscriptions';
import PortalReports from '@/components/portal/PortalReports';
import NotificationCenter from '@/components/portal/NotificationCenter';
import { LogoMark } from '@/components/site/Logo';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu,
  SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarProvider,
  SidebarRail, SidebarTrigger,
} from '@/components/ui/sidebar';

const NAV_SECTIONS = [
  { label: null, items: [{ id: 'overview', label: 'Genel Bakış', icon: LayoutDashboard }] },
  {
    label: 'İşlerim',
    items: [
      { id: 'projects', label: 'Projelerim', icon: FolderKanban },
      { id: 'quotes', label: 'Tekliflerim', icon: FileText },
      { id: 'subs', label: 'Aboneliklerim', icon: RefreshCw },
      { id: 'reports', label: 'Raporlarım', icon: BarChart3 },
    ],
  },
  { label: 'Destek', items: [{ id: 'questions', label: 'Soru & Cevap', icon: HelpCircle }] },
];

function PortalContent() {
  const [user, setUser] = useState(null);
  const [tab, setTabRaw] = useState(() => new URLSearchParams(window.location.search).get('tab') || 'overview');
  const [data, setData] = useState({ projects: null, leads: null, messages: null, subscriptions: null, files: null, quotes: null });
  const { openAssistant, setCustomerContext } = useAssistant();

  const setTab = (id) => {
    setTabRaw(id);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', id);
    window.history.replaceState({}, '', url.toString());
  };

  useEffect(() => {
    let mounted = true;
    let unsubs = [];
    base44.auth.me()
      .then((u) => {
        if (!mounted) return;
        setUser(u);
        const load = () => Promise.all([
          base44.entities.ClientProject.filter({ client_email: u.email }, '-updated_date', 50).catch(() => []),
          base44.entities.Lead.filter({ email: u.email }, '-created_date', 50).catch(() => []),
          base44.entities.ClientMessage.filter({ client_email: u.email }, '-created_date', 50).catch(() => []),
          base44.entities.Subscription.filter({ client_email: u.email }, '-created_date', 50).catch(() => []),
          base44.entities.ProjectFile.filter({ client_email: u.email }, '-created_date', 50).catch(() => []),
          base44.entities.CustomQuote.filter({ client_email: u.email }, '-created_date', 50).catch(() => []),
        ]).then(([projects, leads, messages, subscriptions, files, quotes]) => {
          if (mounted) setData({ projects, leads, messages, subscriptions, files, quotes });
        });
        load();
        // gerçek zamanlı: teklif, proje veya yanıt güncellenince liste kendini yeniler
        unsubs = [
          base44.entities.ClientProject.subscribe(load),
          base44.entities.Lead.subscribe(load),
          base44.entities.ClientMessage.subscribe(load),
          base44.entities.Subscription.subscribe(load),
          base44.entities.ProjectFile.subscribe(load),
          base44.entities.CustomQuote.subscribe(load),
        ];
      })
      .catch(() => mounted && setUser(false));
    return () => { mounted = false; unsubs.forEach((unsub) => unsub()); };
  }, []);

  // DijiBot'a canlı müşteri bağlamı: panel her açılışta dashboard verisiyle konuşur
  useEffect(() => {
    if (data.projects === null || !user) return;
    setCustomerContext({ ...data, user });
  }, [data, user, setCustomerContext]);

  const logout = () => base44.auth.logout('/login');
  const pending = (data.messages || []).filter((m) => !m.answer).length;

  if (user === null) {
    return <div className="min-h-screen flex items-center justify-center font-mono text-sm text-muted-foreground">Portal yükleniyor...</div>;
  }

  if (user === false) {
    return (
      <div className="min-h-screen max-w-xl mx-auto px-6 flex flex-col items-center justify-center text-center">
        <h1 className="font-display text-3xl font-semibold">Müşteri portalına erişim için giriş yapın</h1>
        <Link to="/login" className="mt-6 rounded-full bg-mint text-ink font-semibold px-8 py-3">Giriş yap</Link>
      </div>
    );
  }

  const { projects, leads, messages, subscriptions, files, quotes } = data;
  const loading = projects === null;

  const initial = (user.full_name || user.email || 'M').charAt(0).toUpperCase();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-border bg-card/80 backdrop-blur-xl">
        <SidebarHeader className="border-b border-border p-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Siteye dön" className="!h-14 !w-full">
                <Link to="/" aria-label="Siteye dön">
                  <LogoMark className="w-8 h-8 shrink-0 group-data-[collapsible=icon]:mx-auto" />
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
                  {sec.items.map((t) => (
                    <SidebarMenuItem key={t.id}>
                      <SidebarMenuButton isActive={tab === t.id} onClick={() => setTab(t.id)} tooltip={t.label} className="font-semibold">
                        <t.icon className="w-[18px] h-[18px] shrink-0" />
                        <span className="whitespace-nowrap">{t.label}</span>
                      </SidebarMenuButton>
                      {t.id === 'questions' && pending > 0 && (
                        <SidebarMenuBadge className="rounded-full bg-sun text-ink font-mono text-[10px] font-bold px-2 group-data-[collapsible=icon]:hidden">
                          {pending}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="border-t border-border">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2 px-2 py-1.5 group-data-[collapsible=icon]:justify-center">
              <div className="w-8 h-8 rounded-full bg-mint text-ink font-bold flex items-center justify-center text-sm shrink-0" title={user.email || ''}>{initial}</div>
              <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <p className="font-mono text-xs truncate" title={user.email || ''}>{user.email}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-mint">Müşteri</p>
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
          <div className="flex items-center gap-2.5 min-w-0">
            <SidebarTrigger className="text-foreground/80 hover:text-mint" aria-label="Menüyü aç/kapat" />
            <LogoMark className="w-7 h-7 shrink-0" />
            <span className="font-display font-bold text-sm leading-none whitespace-nowrap hidden md:inline">
              DİJİ<span className="text-mint">TRAK</span>
              <span className="ml-2 font-mono text-[9px] font-medium tracking-[0.22em] text-foreground/45 align-middle">MÜŞTERİ PORTALI</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <NotificationCenter data={{ projects, leads, messages, files }} goto={setTab} />
            <Link to="/" className="hidden sm:flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-[11px] text-muted-foreground hover:text-mint hover:border-mint/40 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> siteye dön
            </Link>
            <button onClick={logout} aria-label="Çıkış" className="p-2 rounded-full border border-border bg-card text-muted-foreground hover:text-coral hover:border-coral/40 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>
        <main className="flex-1 min-w-0 px-5 md:px-8 py-6 md:py-8">
          <div className="max-w-5xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-mint mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-mint" />
                  {NAV_SECTIONS.flatMap((s) => s.items).find((t) => t.id === tab)?.label}
                </span>
                <h1 className="font-display text-2xl md:text-3xl font-semibold leading-tight">
                  Merhaba{user.full_name ? `, ${user.full_name}` : ''}
                </h1>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-28 rounded-2xl bg-card border border-border animate-pulse" />
                  ))}
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 h-72 rounded-3xl bg-card border border-border animate-pulse" />
                  <div className="h-72 rounded-3xl bg-card border border-border animate-pulse" />
                </div>
                <p className="font-mono text-xs text-muted-foreground">Panel verileri yükleniyor…</p>
              </div>
            ) : tab === 'overview' ? (
              <PortalOverview user={user} data={data} goto={setTab} onAsk={openAssistant} />
            ) : tab === 'projects' ? (
              <PortalProjects projects={projects} email={user.email} onAsk={openAssistant} />
            ) : tab === 'quotes' ? (
              <PortalQuotes leads={leads} quotes={quotes || []} onAsk={openAssistant} />
            ) : tab === 'subs' ? (
              <PortalSubscriptions subs={subscriptions} onAsk={openAssistant} />
            ) : tab === 'reports' ? (
              <PortalReports data={data} />
            ) : (
              <PortalQuestions
                messages={messages}
                email={user.email}
                onAsked={(rec) => setData((d) => ({ ...d, messages: [rec, ...d.messages] }))}
              />
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function Portal() {
  return (
    <AssistantProvider>
      <PortalContent />
      <AssistantPanel />
    </AssistantProvider>
  );
}