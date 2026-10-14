import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Search, FileDown } from 'lucide-react';
import { downloadLeadsCsv } from '@/lib/leadCsv';
import AppointmentCalendar from '@/components/admin/AppointmentCalendar';
import LeadStats from '@/components/admin/LeadStats';
import LeadTable from '@/components/admin/LeadTable';
import LeadPipeline from '@/components/admin/LeadPipeline';
import LeadDetailDialog from '@/components/admin/LeadDetailDialog';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

export default function AdminLeads() {
  const [leads, setLeads] = useState(null);
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState(null);
  const [tab, setTab] = useState('leads');
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    base44.entities.Lead.list('-created_date', 300).then(setLeads);
  }, []);

  // canlı akış: panel açıkken yeni talepler anında düşer
  useEffect(() => {
    const unsub = base44.entities.Lead.subscribe((event) => {
      if (event.type === 'create') {
        toast({ title: 'Canlı · Yeni talep geldi', description: event.data?.name ? `${event.data.name} bizlere ulaştı.` : undefined });
        base44.entities.Lead.list('-created_date', 300).then(setLeads);
      }
      if (event.type === 'update') {
        setLeads((ls) => (ls ? ls.map((l) => (l.id === event.data?.id ? { ...l, ...event.data } : l)) : ls));
      }
    });
    return unsub;
  }, []);

  const updateStatus = async (id, status) => {
    await base44.entities.Lead.update(id, { status });
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const removeLead = async (id) => {
    if (!window.confirm('Bu talep kalıcı olarak silinsin mi?')) return;
    await base44.entities.Lead.delete(id);
    setLeads((ls) => ls.filter((l) => l.id !== id));
    setActive(null);
    toast({ title: 'Talep silindi' });
  };

  const q = search.trim().toLowerCase();
  const shown = (leads || [])
    .filter((l) => filter === 'all' || (l.status || 'new') === filter)
    .filter((l) => !q || [l.name, l.phone, l.email, l.company, l.service, l.sector, l.quote_no].filter(Boolean).some((v) => v.toLowerCase().includes(q)));

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-5 py-10 space-y-6">
        <AdminPageHeader crumb="Yönetim / Talepler" title="Potansiyel Müşteriler" live />
        <div className="flex items-center gap-2">
          <button onClick={() => setTab('leads')} className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${tab === 'leads' ? 'bg-mint text-ink' : 'bg-secondary/60 text-foreground/70 hover:text-mint'}`}>Talepler</button>
          <button onClick={() => setTab('appointments')} className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${tab === 'appointments' ? 'bg-mint text-ink' : 'bg-secondary/60 text-foreground/70 hover:text-mint'}`}>
            Randevular
            {(leads || []).filter((l) => l.appointment_date).length > 0 && (
              <span className="ml-1.5 font-mono text-xs opacity-80">{(leads || []).filter((l) => l.appointment_date).length}</span>
            )}
          </button>
          <button onClick={() => setTab('board')} className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${tab === 'board' ? 'bg-mint text-ink' : 'bg-secondary/60 text-foreground/70 hover:text-mint'}`}>Pano</button>
        </div>
        {tab === 'leads' && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="İsim, telefon, hizmet ara..."
                className="w-full rounded-full border border-border bg-secondary/60 pl-10 pr-4 py-2 text-sm outline-none focus:border-mint/50"
              />
            </div>
            <button onClick={() => downloadLeadsCsv(shown)} disabled={!shown.length} className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-semibold hover:border-mint/50 hover:text-mint transition-colors disabled:opacity-50">
              <FileDown className="w-4 h-4" /> CSV indir
            </button>
          </div>
        )}
        {leads === null ? (
          <div className="border border-border rounded-2xl bg-card/50 p-12 text-center font-mono text-sm text-muted-foreground">Talepler yükleniyor...</div>
        ) : tab === 'appointments' ? (
          <AppointmentCalendar leads={leads} />
        ) : tab === 'board' ? (
          <LeadPipeline leads={shown} onOpen={setActive} onMove={updateStatus} />
        ) : (
          <>
            <LeadStats leads={leads} filter={filter} onFilter={setFilter} />
            <LeadTable leads={shown} onStatus={updateStatus} onOpen={setActive} />
          </>
        )}
      </main>
      <LeadDetailDialog lead={active} onClose={() => setActive(null)} onDelete={removeLead} />
    </div>
  );
}