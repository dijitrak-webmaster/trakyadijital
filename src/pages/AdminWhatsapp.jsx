import React, { useState } from 'react';
import TemplateManager from '@/components/admin/TemplateManager';
import WhatsappInbox from '@/components/admin/WhatsappInbox';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

const TABS = [
  { key: 'inbox', label: 'Sohbetler' },
  { key: 'templates', label: 'Şablonlar' },
];

export default function AdminWhatsapp() {
  const [tab, setTab] = useState('inbox');
  return (
    <div className="max-w-5xl mx-auto p-5 md:p-8">
      <AdminPageHeader
        crumb="Yönetim / WhatsApp"
        title="WhatsApp"
        subtitle="DijiBot'un WhatsApp yazışmalarını takip edin; 24 saatlik serbest pencere dışı gönderimler için Meta onaylı şablonları yönetin."
      />
      <div className="mt-6 flex gap-2 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-semibold -mb-px border-b-2 transition-colors ${tab === t.key ? 'border-mint text-mint' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tab === 'inbox' ? <WhatsappInbox /> : <TemplateManager />}
      </div>
    </div>
  );
}