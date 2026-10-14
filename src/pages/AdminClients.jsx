import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Trash2, Plus, Search, Paperclip, UserPlus, Github, ExternalLink, FlaskConical } from 'lucide-react';
import { input } from '@/components/admin/formKit';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ClientStatsPanel from '@/components/admin/ClientStatsPanel';
import ClientQuestions from '@/components/admin/ClientQuestions';
import ProjectAssetsDialog from '@/components/admin/ProjectAssetsDialog';
import SubscriptionManager from '@/components/admin/SubscriptionManager';
import PhoneManager from '@/components/admin/PhoneManager';
import RevisionBoard from '@/components/admin/RevisionBoard';
import ClientSetupWizard from '@/components/admin/ClientSetupWizard';
import ClientsPanel from '@/components/admin/ClientsPanel';
import OrderManager from '@/components/admin/OrderManager';
import CustomQuoteManager from '@/components/admin/CustomQuoteManager';


const STATUS = [
  { value: 'planned', label: 'Planlamada' },
  { value: 'in_progress', label: 'Devam ediyor' },
  { value: 'review', label: 'İncelemede' },
  { value: 'launched', label: 'Yayında' },
];

const EMPTY = { title: '', client_email: '', status: 'planned', progress: 0, description: '', report: '', github_url: '', live_url: '', staging_url: '' };

export default function AdminClients() {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  // Aktif sekme URL'den gelir (?tab=) — kenar çubuğu bağlantıları doğru sekmeyi açar
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tab = ['clients', 'projects', 'quotes', 'questions', 'revisions', 'orders', 'subscriptions', 'phones'].includes(tabParam)
    ? tabParam
    : 'projects';
  const setTab = (t) => setSearchParams(t === 'projects' ? {} : { tab: t }, { replace: true });
  const [assetsFor, setAssetsFor] = useState(null);
  const [setupOpen, setSetupOpen] = useState(false);

  const load = () => base44.entities.ClientProject.list('-updated_date', 200).then(setItems);
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Otomatik üyelik: e-posta sistemde kayıtlı değilse proje kaydedilirken
  // müşteriye otomatik portal daveti (üyelik) açılır.
  const ensureMembership = async (email) => {
    try {
      const users = await base44.entities.User.list();
      const known = users.some((u) => (u.email || '').toLowerCase() === email.toLowerCase());
      if (!known) await base44.users.inviteUser(email, 'user');
    } catch (e) {
      console.error('Otomatik davet hatası:', e?.message);
    }
  };

  const save = async () => {
    if (!form.title.trim() || !form.client_email.trim()) return;
    setSaving(true);
    const data = { ...form, progress: Math.min(100, Math.max(0, Number(form.progress) || 0)) };
    if (form.id) {
      const prev = (items || []).find((i) => i.id === form.id);
      if (data.client_email !== prev?.client_email) await ensureMembership(data.client_email.trim());
      await base44.entities.ClientProject.update(form.id, data);
      if (data.report?.trim() && data.report !== prev?.report) {
        base44.functions.invoke('portalNotify', { event: 'project_updated', project_id: form.id }).catch(() => {});
      }
    } else {
      await base44.entities.ClientProject.create(data);
      await ensureMembership(data.client_email.trim());
    }
    setSaving(false);
    setForm(null);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Bu proje silinsin mi?')) return;
    await base44.entities.ClientProject.delete(id);
    load();
  };

  const q = search.trim().toLowerCase();
  const shown = (items || []).filter((i) => status === 'all' || i.status === status)
    .filter((i) => !q || [i.title, i.client_email].filter(Boolean).some((v) => v.toLowerCase().includes(q)));

  return (
    <div>
      <div className="max-w-7xl mx-auto px-5 py-10 space-y-6">
          <AdminPageHeader
            crumb="Yönetim / Müşteri Projeleri"
            title="Müşteri Projeleri"
            subtitle={<>Müşteri, portalda (<span className="font-mono text-xs">/portal</span>) yalnızca kendi e-postasına atanmış projeleri görür.</>}
            actions={
              <>
                <button onClick={() => setSetupOpen(true)} className="flex items-center gap-2 rounded-full border border-mint text-mint font-semibold px-5 py-2.5 text-sm hover:bg-mint/10 transition-colors">
                  <UserPlus className="w-4 h-4" /> Yeni Müşteri
                </button>
                <button onClick={() => setForm({ ...EMPTY })} className="flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-5 py-2.5 text-sm hover:shadow-sticker transition-shadow">
                  <Plus className="w-4 h-4" /> Yeni Proje
                </button>
              </>
            }
          />
          <div className="flex gap-2">
            <button onClick={() => setTab('clients')} className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${tab === 'clients' ? 'bg-mint text-ink' : 'bg-secondary/60 text-foreground/70 hover:text-mint'}`}>Müşteriler</button>
            <button onClick={() => setTab('quotes')} className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${tab === 'quotes' ? 'bg-mint text-ink' : 'bg-secondary/60 text-foreground/70 hover:text-mint'}`}>Özel Teklifler</button>
            <button onClick={() => setTab('orders')} className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${tab === 'orders' ? 'bg-mint text-ink' : 'bg-secondary/60 text-foreground/70 hover:text-mint'}`}>Siparişler</button>
            <button onClick={() => setTab('projects')} className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${tab === 'projects' ? 'bg-mint text-ink' : 'bg-secondary/60 text-foreground/70 hover:text-mint'}`}>Projeler</button>
            <button onClick={() => setTab('questions')} className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${tab === 'questions' ? 'bg-mint text-ink' : 'bg-secondary/60 text-foreground/70 hover:text-mint'}`}>Sorular</button>
            <button onClick={() => setTab('revisions')} className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${tab === 'revisions' ? 'bg-mint text-ink' : 'bg-secondary/60 text-foreground/70 hover:text-mint'}`}>Revizyonlar</button>
            <button onClick={() => setTab('subscriptions')} className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${tab === 'subscriptions' ? 'bg-mint text-ink' : 'bg-secondary/60 text-foreground/70 hover:text-mint'}`}>Abonelikler</button>
            <button onClick={() => setTab('phones')} className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${tab === 'phones' ? 'bg-mint text-ink' : 'bg-secondary/60 text-foreground/70 hover:text-mint'}`}>WhatsApp Telefonları</button>
          </div>

          {tab === 'clients' ? (
            <ClientsPanel onNew={() => setSetupOpen(true)} />
          ) : tab === 'revisions' ? (
            <RevisionBoard />
          ) : tab === 'quotes' ? (
            <CustomQuoteManager />
          ) : tab === 'orders' ? (
            <OrderManager />
          ) : tab === 'subscriptions' ? (
            <SubscriptionManager />
          ) : tab === 'phones' ? (
            <PhoneManager />
          ) : tab === 'questions' ? (
            <ClientQuestions />
          ) : items === null ? (
            <div className="border border-border rounded-2xl bg-card/50 p-10 text-center font-mono text-sm text-muted-foreground">Yükleniyor...</div>
          ) : (
            <>
          {items.length > 0 && <ClientStatsPanel items={items} />}
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {[{ value: 'all', label: 'Tümü' }, ...STATUS].map((s) => (
                <button key={s.value} onClick={() => setStatus(s.value)} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${status === s.value ? 'bg-mint text-ink' : 'bg-secondary/60 text-foreground/70 hover:text-mint'}`}>
                  {s.value === 'all' ? `${s.label} (${items.length})` : `${s.label} (${items.filter((i) => i.status === s.value).length})`}
                </button>
              ))}
            </div>
            <div className="relative md:max-w-xs w-full">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Proje veya e-posta ara..."
                className="w-full rounded-full border border-border bg-secondary/60 pl-10 pr-4 py-2 text-sm outline-none focus:border-mint/50"
              />
            </div>
          </div>
          {shown.length === 0 ? (
            <div className="border border-border rounded-2xl p-10 text-center font-mono text-sm text-muted-foreground">{items.length === 0 ? 'Henüz müşteri projesi yok.' : 'Aramanıza uygun proje yok.'}</div>
          ) : (
            <div className="divide-y divide-border border border-border rounded-2xl">
              {shown.map((it) => (
                <div key={it.id} className="flex items-center gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">{it.title}</p>
                    <p className="font-mono text-xs text-muted-foreground">{it.client_email} · {STATUS.find((s) => s.value === it.status)?.label}</p>
                  </div>
                  <div className="w-32 hidden sm:block">
                    <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-mint rounded-full" style={{ width: `${it.progress || 0}%` }} />
                    </div>
                    <p className="font-mono text-xs text-muted-foreground mt-1 text-center">{it.progress || 0}%</p>
                  </div>
                  {it.github_url && (
                    <a href={it.github_url} target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub deposu">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {it.staging_url && (
                    <a href={it.staging_url} target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-sun transition-colors" aria-label="Demo / staging">
                      <FlaskConical className="w-4 h-4" />
                    </a>
                  )}
                  {it.live_url && (
                    <a href={it.live_url} target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-mint transition-colors" aria-label="Canlı site">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button onClick={() => setAssetsFor(it)} className="p-2 hover:text-sun transition-colors" aria-label="Dosyalar & Revizyonlar">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button onClick={() => setForm({ ...it })} className="p-2 hover:text-mint transition-colors" aria-label="Düzenle">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => remove(it.id)} className="p-2 hover:text-coral transition-colors" aria-label="Sil">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
            </>
          )}
      </div>

        <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
          <DialogContent className="bg-card border-border max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">{form?.id ? 'Projeyi düzenle' : 'Yeni müşteri projesi'}</DialogTitle>
            </DialogHeader>
            {form && (
              <div className="grid gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Proje adı</label>
                  <input className={`${input} mt-1`} value={form.title} onChange={set('title')} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Müşteri e-postası (portal girişi)</label>
                  <input className={`${input} mt-1`} type="email" value={form.client_email} onChange={set('client_email')} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Durum</label>
                    <select className={`${input} mt-1`} value={form.status} onChange={set('status')}>
                      {STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Tamamlanma (%)</label>
                    <input className={`${input} mt-1`} type="number" min="0" max="100" value={form.progress} onChange={set('progress')} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Kapsam / teslimatlar</label>
                  <textarea className={`${input} mt-1`} rows={3} value={form.description} onChange={set('description')} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Müşteriye görünen rapor</label>
                  <textarea className={`${input} mt-1`} rows={4} value={form.report} onChange={set('report')} />
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">GitHub deposu</label>
                    <input className={`${input} mt-1`} value={form.github_url} onChange={set('github_url')} placeholder="https://github.com/..." />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Demo / staging</label>
                    <input className={`${input} mt-1`} value={form.staging_url} onChange={set('staging_url')} placeholder="https://demo..." />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Canlı site</label>
                    <input className={`${input} mt-1`} value={form.live_url} onChange={set('live_url')} placeholder="https://..." />
                  </div>
                </div>
                <button onClick={save} disabled={saving || !form.title.trim() || !form.client_email.trim()} className="rounded-full bg-mint text-ink font-semibold py-2.5 disabled:opacity-50">
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            )}
          </DialogContent>
      </Dialog>

      <ProjectAssetsDialog project={assetsFor} onClose={() => setAssetsFor(null)} onChanged={load} />
      <ClientSetupWizard open={setupOpen} onClose={() => setSetupOpen(false)} onDone={load} />
    </div>
  );
}