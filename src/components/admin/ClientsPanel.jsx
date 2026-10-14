import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { input } from '@/components/admin/formKit';
import ClientSetupWizard from '@/components/admin/ClientSetupWizard';
import { Search, Pencil, Trash2, Plus, Building2 } from 'lucide-react';

const PROJECT_STATUS = [
  { value: 'planned', label: 'Planlamada' },
  { value: 'in_progress', label: 'Devam ediyor' },
  { value: 'review', label: 'İncelemede' },
  { value: 'launched', label: 'Yayında' },
];

const EMPTY_EDIT = { business_name: '', contact_name: '', phone: '', sector: '', note: '' };

/** Müşteri kayıtları: Client tablosu (işletme, yetkili, iletişim) + her müşteriye
 *  sınırsız proje ekleme; portal daveti olmayan eski projeler için kayıt oluşturma. */
export default function ClientsPanel({ onNew }) {
  const { toast } = useToast();
  const [clients, setClients] = useState(null);
  const [projects, setProjects] = useState([]);
  const [q, setQ] = useState('');
  const [editForm, setEditForm] = useState(null);
  const [addFor, setAddFor] = useState(null); // proje ekleme dialog'u açılan client
  const [addRow, setAddRow] = useState({ title: '', status: 'planned' });
  const [wizardFor, setWizardFor] = useState(''); // kayıtsız e-posta için sihirbaz
  const [confirmId, setConfirmId] = useState(null);

  const load = () => {
    base44.entities.Client.list('-updated_date', 200).then(setClients).catch(() => setClients([]));
    base44.entities.ClientProject.list('-updated_date', 200).then(setProjects).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const knownEmails = new Set((clients || []).map((c) => (c.email || '').toLowerCase()));
  const projectCount = (email) => projects.filter((p) => (p.client_email || '').toLowerCase() === email.toLowerCase()).length;
  // Projesi olan ama Client kaydı olmayan e-postalar — tek tıkla kayıt oluşturma
  const orphanEmails = [...new Set(projects.map((p) => (p.client_email || '').toLowerCase()).filter((e) => e && !knownEmails.has(e)))];

  const saveEdit = async () => {
    await base44.entities.Client.update(editForm.id, {
      business_name: editForm.business_name.trim(),
      contact_name: (editForm.contact_name || '').trim(),
      phone: (editForm.phone || '').trim(),
      sector: (editForm.sector || '').trim(),
      note: (editForm.note || '').trim(),
    });
    toast({ title: 'Müşteri güncellendi' });
    setEditForm(null);
    load();
  };

  const removeClient = async (c) => {
    await base44.entities.Client.delete(c.id);
    toast({ title: 'Müşteri kaydı silindi', description: 'Projeler korunur; isterseniz oradan yeniden kayıt açabilirsiniz.' });
    setConfirmId(null);
    load();
  };

  const addProject = async () => {
    if (!addRow.title.trim() || !addFor) return;
    await base44.entities.ClientProject.create({
      title: addRow.title.trim(),
      client_email: addFor.email,
      status: addRow.status,
      progress: 0,
    });
    toast({ title: 'Proje eklendi', description: `${addFor.business_name} · ${addRow.title.trim()}` });
    setAddFor(null);
    setAddRow({ title: '', status: 'planned' });
    load();
  };

  const query = q.trim().toLowerCase();
  const match = (name, email) => !query || `${name} ${email}`.toLowerCase().includes(query);
  const shownClients = (clients || []).filter((c) => match(c.business_name, c.email));
  const shownOrphans = orphanEmails.filter((e) => match(e, e));

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative md:max-w-xs w-full">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="İşletme veya e-posta ara..." className="w-full rounded-full border border-border bg-secondary/60 pl-10 pr-4 py-2 text-sm outline-none focus:border-mint/50" />
        </div>
        <button onClick={() => onNew?.()} className="flex items-center gap-2 rounded-full border border-mint text-mint font-semibold px-5 py-2.5 text-sm hover:bg-mint/10 transition-colors w-fit">
          <Plus className="w-4 h-4" /> Yeni Müşteri Ekle
        </button>
      </div>

      {clients === null ? (
        <div className="border border-border rounded-2xl bg-card/50 p-10 text-center font-mono text-sm text-muted-foreground">Yükleniyor...</div>
      ) : (
        <div className="divide-y divide-border border border-border rounded-2xl">
          {shownClients.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="grid place-items-center w-10 h-10 rounded-2xl bg-mint/15 text-mint shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">{c.business_name}</p>
                <p className="font-mono text-xs text-muted-foreground truncate">
                  {c.email}{c.contact_name ? ` · ${c.contact_name}` : ''}{c.phone ? ` · ${c.phone}` : ''}
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-mint/15 text-mint px-3 py-1 font-mono text-[10px] font-bold">
                {projectCount(c.email)} PROJE
              </span>
              <button
                onClick={() => { setAddFor(c); setAddRow({ title: '', status: 'planned' }); }}
                className="flex items-center gap-1.5 rounded-full bg-mint text-ink font-semibold px-4 py-1.5 text-xs hover:shadow-sticker transition-shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Proje Ekle
              </button>
              <button onClick={() => setEditForm({ ...EMPTY_EDIT, ...c })} className="p-2 text-muted-foreground hover:text-mint transition-colors" aria-label="Düzenle">
                <Pencil className="w-4 h-4" />
              </button>
              {confirmId === c.id ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => removeClient(c)} className="rounded-full bg-coral text-ink font-mono text-[10px] font-bold px-3 py-1.5">SİL — EMİNİM</button>
                  <button onClick={() => setConfirmId(null)} className="font-mono text-xs text-muted-foreground hover:text-foreground">iptal</button>
                </div>
              ) : (
                <button onClick={() => setConfirmId(c.id)} className="p-2 text-muted-foreground hover:text-coral transition-colors" aria-label="Sil">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {shownOrphans.map((email) => (
            <div key={email} className="flex flex-wrap items-center gap-3 p-4 bg-sun/5">
              <div className="grid place-items-center w-10 h-10 rounded-2xl bg-sun/15 text-sun shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm truncate">{email}</p>
                <p className="font-mono text-xs text-muted-foreground">kayıtsız müşteri · {projectCount(email)} proje</p>
              </div>
              <button onClick={() => setWizardFor(email)} className="flex items-center gap-1.5 rounded-full border border-sun text-sun font-semibold px-4 py-1.5 text-xs hover:bg-sun/10 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Kaydı Oluştur
              </button>
            </div>
          ))}

          {shownClients.length === 0 && shownOrphans.length === 0 && (
            <p className="p-10 text-center font-mono text-sm text-muted-foreground">
              {(clients || []).length === 0 ? 'Henüz müşteri kaydı yok — sağ üstten yeni müşteri ekleyin.' : 'Aramanıza uygun müşteri yok.'}
            </p>
          )}
        </div>
      )}

      {/* müşteri düzenleme */}
      <Dialog open={!!editForm} onOpenChange={(o) => !o && setEditForm(null)}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Müşteriyi düzenle</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="grid gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">İşletme adı *</label>
                <input className={`${input} mt-1`} value={editForm.business_name} onChange={(e) => setEditForm((f) => ({ ...f, business_name: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Yetkili kişi</label>
                <input className={`${input} mt-1`} value={editForm.contact_name} onChange={(e) => setEditForm((f) => ({ ...f, contact_name: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">E-posta (portal girişi)</label>
                <input className={`${input} mt-1 opacity-60`} value={editForm.email} readOnly />
                <p className="text-[11px] text-muted-foreground mt-1">Portal erişimi bu e-postaya bağlıdır; değiştirmek için yeni müşteri oluşturun.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Telefon</label>
                  <input className={`${input} mt-1`} value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Sektör</label>
                  <input className={`${input} mt-1`} value={editForm.sector} onChange={(e) => setEditForm((f) => ({ ...f, sector: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Yönetici notu</label>
                <textarea className={`${input} mt-1`} rows={2} value={editForm.note} onChange={(e) => setEditForm((f) => ({ ...f, note: e.target.value }))} />
              </div>
              <button
                onClick={saveEdit}
                disabled={!editForm.business_name.trim()}
                className="rounded-full bg-mint text-ink font-semibold py-2.5 disabled:opacity-50"
              >
                Kaydet
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* müşteriye proje ekleme */}
      <Dialog open={!!addFor} onOpenChange={(o) => !o && setAddFor(null)}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Proje ekle — {addFor?.business_name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Proje adı *</label>
              <input className={`${input} mt-1`} value={addRow.title} onChange={(e) => setAddRow((r) => ({ ...r, title: e.target.value }))} placeholder="Ör. Kurumsal web sitesi" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Durum</label>
              <select className={`${input} mt-1`} value={addRow.status} onChange={(e) => setAddRow((r) => ({ ...r, status: e.target.value }))}>
                {PROJECT_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <button onClick={addProject} disabled={!addRow.title.trim()} className="rounded-full bg-mint text-ink font-semibold py-2.5 disabled:opacity-50">
              Projeyi Ekle
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* kayıtsız e-posta için sihirbaz */}
      <ClientSetupWizard open={!!wizardFor} initialEmail={wizardFor} onClose={() => setWizardFor('')} onDone={load} />
    </div>
  );
}