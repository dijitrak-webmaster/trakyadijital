import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle, RefreshCcw, MessageSquareDashed } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DashKpis from '@/components/admin/DashKpis';
import DashCharts from '@/components/admin/DashCharts';
import DashFunnel from '@/components/admin/DashFunnel';
import DashActivity from '@/components/admin/DashActivity';

const STATUS_LABEL = { new: 'Yeni', contacted: 'İletişimde', won: 'Kazanıldı', lost: 'Kaybedildi' };
const STATUS_CLS = { new: 'bg-mint/15 text-mint', contacted: 'bg-sun/15 text-sun', won: 'bg-mint/25 text-mint', lost: 'bg-coral/15 text-coral' };
const ORDER_LABEL = { new: 'Yeni', approved: 'Onaylandı', in_progress: 'Üretimde', delivered: 'Teslim', cancelled: 'İptal' };
const fmtDate = (d) => new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
const DAY = 86400000;

export default function AdminDashboard() {
  const [leads, setLeads] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    base44.entities.Lead.list('-created_date', 300).then(setLeads).catch(() => setLeads([]));
    Promise.all([
      base44.entities.BlogPost.list('-created_date', 200).catch(() => []),
      base44.entities.PortfolioProject.list('-created_date', 200).catch(() => []),
      base44.entities.ClientProject.list('-updated_date', 200).catch(() => []),
      base44.entities.Order.list('-created_date', 100).catch(() => []),
      base44.entities.Subscription.list('-updated_date', 100).catch(() => []),
      base44.entities.RevisionRequest.list('-updated_date', 100).catch(() => []),
      base44.entities.BlogComment.list('-created_date', 100).catch(() => []),
    ]).then(([posts, portfolio, clients, orders, subs, revisions, comments]) =>
      setData({ posts, portfolio, clients, orders, subs, revisions, comments }));
  }, []);

  if (leads === null || data === null) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-10 space-y-6 animate-pulse">
        <div className="h-10 w-64 rounded bg-secondary" />
        <div className="h-28 rounded-2xl bg-secondary" />
        <div className="h-64 rounded-2xl bg-secondary" />
      </div>
    );
  }

  const count = (arr, fn) => arr.filter(fn).length;
  const newLeads = count(leads, (l) => (l.status || 'new') === 'new');
  const stale = count(leads, (l) => (l.status || 'new') === 'new' && Date.now() - new Date(l.created_date).getTime() > 3 * DAY);
  const last30 = count(leads, (l) => Date.now() - new Date(l.created_date).getTime() < 30 * DAY);
  const { posts, portfolio, clients, orders, subs, revisions, comments } = data;

  // abonelik geliri: aktif aboneliklerin aylık toplamı
  const activeSubs = subs.filter((s) => s.status !== 'cancelled');
  const mrr = activeSubs.reduce((a, s) => a + (Number(s.monthly_price) || 0), 0);
  const openOrders = count(orders, (o) => ['new', 'approved', 'in_progress'].includes(o.status));
  const openRevisions = count(revisions, (r) => r.status === 'open');
  const pendingComments = count(comments, (c) => c.status === 'pending');
  // önümüzdeki 14 gün içinde yenilenecek abonelikler
  const renewing = activeSubs.filter((s) => {
    if (!s.end_date) return false;
    const t = new Date(s.end_date).getTime();
    return t >= Date.now() - DAY && t <= Date.now() + 14 * DAY;
  });

  const kpis = [
    { label: 'Yeni talepler', value: newLeads, sub: `son 30 gün: ${last30}` },
    { label: 'Aylık gelir', value: mrr ? `₺${mrr.toLocaleString('tr-TR')}` : '₺0', sub: `${activeSubs.length} aktif abonelik` },
    { label: 'Açık sipariş', value: openOrders, sub: `toplam ${orders.length} sipariş` },
    { label: 'Devam eden proje', value: count(clients, (c) => c.status === 'in_progress'), sub: `yayında: ${count(clients, (c) => c.status === 'launched')}` },
    { label: 'Açık revizyon', value: openRevisions, sub: `çözülen: ${revisions.length - openRevisions}` },
    { label: 'Bekleyen yorum', value: pendingComments, sub: `yayında: ${count(posts, (p) => p.status === 'published')} blog` },
  ];

  // birleşik hareket akışı
  const feed = [
    ...leads.slice(0, 12).map((l) => ({
      kind: 'lead', title: `${l.name || 'İsimsiz'} yeni talep bıraktı`,
      sub: [l.service, l.company].filter(Boolean).join(' · ') || 'Genel talep', date: l.created_date, to: '/admin/talepler',
    })),
    ...orders.slice(0, 8).map((o) => ({
      kind: 'order', title: `Sipariş: ${o.customer_name || 'Müşteri'}`,
      sub: `${o.total != null ? Number(o.total).toLocaleString('tr-TR') + ' ₺' : ''} · ${ORDER_LABEL[o.status] || o.status}`, date: o.created_date, to: '/admin/musteriler',
    })),
    ...revisions.slice(0, 8).map((r) => ({
      kind: 'revision', title: r.status === 'open' ? 'Yeni revizyon talebi' : 'Revizyon çözüldü',
      sub: (r.text || '').slice(0, 60), date: r.updated_date || r.created_date, to: '/admin/musteriler',
    })),
    ...subs.slice(0, 6).map((s) => ({
      kind: 'sub', title: `Abonelik: ${s.item_title}`,
      sub: `${s.client_email} · ${s.monthly_price || 0} ₺/ay`, date: s.updated_date || s.created_date, to: '/admin/musteriler',
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 9);

  const quickLinks = [
    { to: '/admin/talepler', title: 'Talepler', desc: `${leads.length} talep · pano, tablo ve randevular` },
    { to: '/admin/musteriler', title: 'Müşteri Projeleri', desc: `${clients.length} proje · ${openRevisions} açık revizyon` },
    { to: '/admin/icerik', title: 'İçerik Yönetimi', desc: `Blog ${posts.length} · Portföy ${portfolio.length} · Yorum ${comments.length}` },
    { to: '/admin/whatsapp', title: 'WhatsApp Şablonları', desc: '24 saat dışı onaylı mesaj gönderimi' },
    { to: '/admin/ayarlar', title: 'Ayarlar', desc: 'Kullanıcılar, roller ve davetler' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-5 py-10 space-y-6 w-full">
      <AdminPageHeader crumb="Yönetim / Genel Bakış" title="Panel Özeti" />

      <DashKpis items={kpis} />

      {/* uyarılar */}
      <div className="space-y-3">
        {stale > 0 && (
          <Link to="/admin/talepler" className="flex items-center gap-3 border border-coral/40 bg-coral/10 rounded-2xl p-4 hover:border-coral transition-colors">
            <AlertTriangle className="w-5 h-5 text-coral shrink-0" />
            <p className="text-sm"><span className="font-semibold text-coral">{stale} talep</span> 3 gündür "yeni" durumunda bekliyor — hemen takip edin.</p>
            <ArrowRight className="w-4 h-4 text-coral ml-auto shrink-0" />
          </Link>
        )}
        {renewing.length > 0 && (
          <Link to="/admin/musteriler" className="flex items-center gap-3 border border-sun/40 bg-sun/10 rounded-2xl p-4 hover:border-sun transition-colors">
            <RefreshCcw className="w-5 h-5 text-sun shrink-0" />
            <p className="text-sm"><span className="font-semibold text-sun">{renewing.length} abonelik</span> önümüzdeki 14 gün içinde yenilenecek — müşteriyi WhatsApp şablonuyla hatırlatın.</p>
            <ArrowRight className="w-4 h-4 text-sun ml-auto shrink-0" />
          </Link>
        )}
        {openRevisions > 0 && (
          <Link to="/admin/musteriler" className="flex items-center gap-3 border border-fog/40 bg-fog/10 rounded-2xl p-4 hover:border-fog transition-colors">
            <MessageSquareDashed className="w-5 h-5 text-fog shrink-0" />
            <p className="text-sm"><span className="font-semibold text-fog">{openRevisions} açık revizyon talebi</span> müşterinin yanıtını bekliyor.</p>
            <ArrowRight className="w-4 h-4 text-fog ml-auto shrink-0" />
          </Link>
        )}
      </div>

      <DashCharts leads={leads} />

      <div className="grid lg:grid-cols-2 gap-6">
        <DashFunnel leads={leads} />
        <DashActivity items={feed} />
      </div>

      <div className="border border-border rounded-2xl bg-card/50 overflow-hidden">
        <div className="flex items-center justify-between p-5 pb-3">
          <p className="font-mono text-xs uppercase text-mint">Son talepler</p>
          <Link to="/admin/talepler" className="font-mono text-xs text-muted-foreground hover:text-mint transition-colors">tümü →</Link>
        </div>
        <div className="divide-y divide-border">
          {leads.slice(0, 6).map((l) => (
            <Link key={l.id} to="/admin/talepler" className="flex items-center gap-3 px-5 py-3 hover:bg-card transition-colors">
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">{l.name}</p>
                <p className="font-mono text-xs text-muted-foreground truncate">{[l.service, l.sector].filter(Boolean).join(' · ') || 'Genel talep'}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] ${STATUS_CLS[l.status || 'new']}`}>{STATUS_LABEL[l.status || 'new']}</span>
              <span className="font-mono text-xs text-muted-foreground hidden sm:block">{fmtDate(l.created_date)}</span>
            </Link>
          ))}
          {leads.length === 0 && <p className="p-6 text-center font-mono text-xs text-muted-foreground">Henüz talep yok.</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {quickLinks.map((q) => (
          <Link key={q.to} to={q.to} className="border border-border rounded-2xl p-5 hover:border-mint/50 hover:-translate-y-0.5 transition-all">
            <p className="font-semibold flex items-center justify-between text-sm">{q.title} <ArrowRight className="w-4 h-4 text-mint shrink-0" /></p>
            <p className="font-mono text-xs text-muted-foreground mt-1.5">{q.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}