import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { input } from '@/components/admin/formKit';
import InviteLinkCard from '@/components/admin/InviteLinkCard';
import { inviteLink, magicLinkUrl } from '@/lib/inviteLink';
import { Mail, Plus, ShieldCheck, Search, Trash2, FolderKanban } from 'lucide-react';

const ROLE_LABEL = { admin: 'Yönetici', user: 'Kullanıcı' };

/** Kullanıcı davetleri, rolleri ve portal erişimi — kayıt tamamen davetle çalışır. */
export default function UsersPanel() {
  const { toast } = useToast();
  const [users, setUsers] = useState(null);
  const [me, setMe] = useState(null);
  const [projects, setProjects] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [lastInvite, setLastInvite] = useState(null);

  const load = () => {
    base44.entities.User.list().then(setUsers).catch(() => setUsers([]));
    base44.entities.ClientProject.list().then(setProjects).catch(() => {});
  };
  useEffect(() => {
    base44.auth.me().then(setMe).catch(() => setMe(false));
    load();
  }, []);

  const projectCount = (u) => projects.filter((p) => p.client_email === u.email).length;

  const invite = async () => {
    if (!email.includes('@')) return;
    setBusy(true);
    try {
      await base44.users.inviteUser(email.trim(), role);
      let link = inviteLink(email.trim(), role);
      if (role === 'user') {
        try {
          const res = await base44.functions.invoke('magicLink', { action: 'create', email: email.trim().toLowerCase() });
          link = magicLinkUrl(res.data.token);
        } catch (magicErr) {
          toast({ title: 'Hızlı giriş linki oluşturulamadı', description: 'Standart davet linki gösteriliyor.' });
        }
      }
      toast({ title: 'Davet gönderildi', description: `${email} ${ROLE_LABEL[role]} olarak davet edildi.` });
      setLastInvite({ email: email.trim(), link });
      setEmail('');
      load();
    } catch (e) {
      toast({ title: 'Davet gönderilemedi', description: e.message || 'Lütfen tekrar deneyin.' });
    }
    setBusy(false);
  };

  const changeRole = async (u, r) => {
    try {
      await base44.entities.User.update(u.id, { role: r });
      toast({ title: 'Rol güncellendi', description: `${u.email} → ${ROLE_LABEL[r]}` });
      load();
    } catch (e) {
      toast({ title: 'Rol güncellenemedi', description: e.message });
    }
  };

  const removeUser = async (u) => {
    try {
      await base44.entities.User.delete(u.id);
      toast({ title: 'Erişim kaldırıldı', description: `${u.email} artık panele/portala giriş yapamaz.` });
      setConfirmId(null);
      load();
    } catch (e) {
      toast({ title: 'Kullanıcı silinemedi', description: e.message });
    }
  };

  const filtered = (users || []).filter((u) =>
    `${u.email} ${u.full_name || ''}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Davet */}
      <div>
        <p className="font-mono text-xs uppercase text-mint">Yeni kullanıcı davet et</p>
        <p className="text-sm text-foreground/60 mt-1">
          Sitede açık kayıt yok — müşteriyle anlaşma sağlandığında buradan e-posta daveti gönderilir; davet edilen kullanıcı
          e-postadaki bağlantıyla hesabını açar.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="flex-1 relative">
            <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input className={`${input} pl-10`} type="email" placeholder="ornek@isletme.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <select className={`${input} sm:w-40`} value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">Kullanıcı (portal)</option>
            <option value="admin">Yönetici (panel)</option>
          </select>
          <button onClick={invite} disabled={busy || !email.includes('@')} className="flex items-center justify-center gap-2 rounded-full bg-mint text-ink font-semibold px-6 py-2.5 text-sm hover:shadow-sticker transition-shadow disabled:opacity-50">
            <Plus className="w-4 h-4" /> {busy ? 'Gönderiliyor...' : 'Davet Gönder'}
          </button>
        </div>
        {lastInvite && <div className="mt-4"><InviteLinkCard email={lastInvite.email} link={lastInvite.link} /></div>}
      </div>

      {/* Liste */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs uppercase text-mint">Kullanıcılar</p>
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input className={`${input} w-56 pl-9 py-2`} placeholder="E-posta ara..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        {users === null ? (
          <div className="mt-3 border border-border rounded-2xl p-10 text-center font-mono text-sm text-muted-foreground">Yükleniyor...</div>
        ) : (
          <div className="mt-3 divide-y divide-border border border-border rounded-2xl">
            {filtered.map((u) => (
              <div key={u.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="grid place-items-center w-9 h-9 rounded-full bg-mint/15 text-mint font-display font-semibold uppercase shrink-0">
                  {(u.full_name || u.email)[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{u.full_name || u.email}</p>
                  <p className="font-mono text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
                {projectCount(u) > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-coral/15 text-coral px-3 py-1 font-mono text-[10px]">
                    <FolderKanban className="w-3 h-3" /> {projectCount(u)} PROJE
                  </span>
                )}
                {u.role === 'admin' && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/15 text-mint px-3 py-1 font-mono text-[10px]"><ShieldCheck className="w-3 h-3" /> YÖNETİCİ</span>
                )}
                {me?.id === u.id ? (
                  <span className="font-mono text-xs text-muted-foreground">siz</span>
                ) : confirmId === u.id ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => removeUser(u)} className="rounded-full bg-coral text-ink font-mono text-[10px] font-bold px-3 py-1.5">SİL — EMİNİM</button>
                    <button onClick={() => setConfirmId(null)} className="font-mono text-xs text-muted-foreground hover:text-foreground">iptal</button>
                  </div>
                ) : (
                  <>
                    <select className={`${input} w-36`} value={u.role} onChange={(e) => changeRole(u, e.target.value)}>
                      <option value="user">Kullanıcı</option>
                      <option value="admin">Yönetici</option>
                    </select>
                    <button onClick={() => setConfirmId(u.id)} aria-label="Erişimi kaldır" className="p-2 rounded-lg text-muted-foreground hover:text-coral hover:bg-coral/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
            {users.length === 0 && <p className="p-10 text-center font-mono text-xs text-muted-foreground">Kullanıcı bulunamadı.</p>}
            {users.length > 0 && filtered.length === 0 && <p className="p-10 text-center font-mono text-xs text-muted-foreground">Aramaya uyan kullanıcı yok.</p>}
          </div>
        )}
      </div>
    </div>
  );
}