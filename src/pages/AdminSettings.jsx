import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import SectionToggles from '@/components/admin/SectionToggles';
import UsersPanel from '@/components/admin/UsersPanel';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { Rss, Globe, BellRing, KeyRound } from 'lucide-react';

const LIVE_URL = 'https://trakya-digital-core.base44.app';

export default function AdminSettings() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    Promise.all([
      base44.entities.User.list(),
      base44.entities.ClientProject.list(),
    ]).then(([users, projects]) => {
      setStats({
        users: users.length,
        admins: users.filter((u) => u.role === 'admin').length,
        clients: projects.length,
      });
    }).catch(() => setStats({ users: 0, admins: 0, clients: 0 }));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-5 py-10 space-y-6 w-full">
      <AdminPageHeader
        crumb="Yönetim / Ayarlar"
        title="Site Ayarları"
        subtitle="Modüller, kullanıcı erişimi ve sistem bildirimleri — tüm değişiklikler anında yayına yansır."
      />

      {/* Özet */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          ['Kullanıcı', stats?.users],
          ['Yönetici', stats?.admins],
          ['Müşteri Projesi', stats?.clients],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-border bg-card/50 p-4">
            <p className="font-display text-3xl font-semibold text-mint">{value ?? '–'}</p>
            <p className="font-mono text-[10px] uppercase text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Site görünürlüğü */}
      <div className="border border-border rounded-2xl p-5 bg-card/50">
        <p className="font-mono text-xs uppercase text-mint">Site Görünürlüğü</p>
        <p className="text-sm text-foreground/60 mt-2">Modülleri ve ana sayfa bölümlerini aç-kapa. Kapalı modül anasayfada ve kendi sayfasında görünmez.</p>
        <div className="mt-4"><SectionToggles /></div>
      </div>

      {/* Kullanıcı & erişim */}
      <div className="border border-border rounded-2xl p-5 bg-card/50">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-mint" />
          <p className="font-mono text-xs uppercase text-mint">Kullanıcı & Erişim Yönetimi</p>
        </div>
        <div className="mt-4"><UsersPanel /></div>
      </div>

      {/* Sistem & bildirim */}
      <div className="border border-border rounded-2xl p-5 bg-card/50 space-y-5">
        <div className="flex items-center gap-2">
          <BellRing className="w-4 h-4 text-mint" />
          <p className="font-mono text-xs uppercase text-mint">Sistem & Bildirim</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Otomatik e-posta bildirimleri</p>
          <p className="text-sm text-foreground/60 mt-1">
            Portal soru-cevapları, revizyon talepleri, dosya paylaşımı ve proje güncellemeleri e-posta ile bildirilir.
            Yönetici uyarıları <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">ADMIN_ALERT_EMAIL</span> gizli anahtarına giden adrese gönderilir.
          </p>
        </div>
        <div className="border-t border-border pt-5">
          <p className="text-sm font-semibold">SEO dosyaları</p>
          <div className="flex flex-wrap gap-3 mt-2">
            <a href={`${LIVE_URL}/functions/sitemap`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-secondary/60 px-4 py-2 font-mono text-xs hover:text-mint transition-colors">
              <Rss className="w-3.5 h-3.5" /> sitemap.xml
            </a>
            <a href={`${LIVE_URL}/robots.txt`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-secondary/60 px-4 py-2 font-mono text-xs hover:text-mint transition-colors">
              <Rss className="w-3.5 h-3.5" /> robots.txt
            </a>
            <a href={LIVE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-secondary/60 px-4 py-2 font-mono text-xs hover:text-mint transition-colors">
              <Globe className="w-3.5 h-3.5" /> yayındaki site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}