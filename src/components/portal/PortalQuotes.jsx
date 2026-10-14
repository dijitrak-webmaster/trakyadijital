import React from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText } from 'lucide-react';
import { STATUS, TYPE } from '@/components/admin/leadMeta';
import { downloadQuotePdf, downloadPackagePdf } from '@/lib/quotePdf';

const parsePkg = (s) => {
  try { return s ? JSON.parse(s) : null; } catch { return null; }
};

/** Müşteri portalında kendi e-postasına ait teklif/randevu talepleri ve PDF indirme. */
export default function PortalQuotes({ leads, quotes = [], onAsk }) {
  if (!leads.length && !quotes.length) {
    return (
      <div className="border border-border rounded-3xl p-12 text-center">
        <FileText className="w-10 h-10 text-mint mx-auto" />
        <p className="mt-4 text-foreground/70">Henüz teklif talebiniz bulunmuyor. Teklif almak için bize ulaşın.</p>
        <button onClick={() => onAsk({ intent: 'quote' })} className="mt-6 rounded-full bg-mint text-ink font-semibold px-8 py-3 hover:-translate-y-0.5 hover:shadow-sticker transition-all">
          Teklif Al
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quotes.map((q) => (
        <div key={q.id} className="bg-card border border-border rounded-3xl p-6 hover:border-mint/30 transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-semibold">{q.title}</h3>
              <p className="font-mono text-xs text-muted-foreground mt-1">
                {new Date(q.created_date).toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                {q.valid_until ? ` · geçerlilik: ${new Date(q.valid_until).toLocaleDateString('tr-TR')}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-mint">{(Number(q.total) || 0).toLocaleString('tr-TR')} ₺</span>
              <span className="rounded-full px-4 py-1 text-xs font-semibold border border-border text-muted-foreground">
                {{ draft: 'Taslak', sent: 'Gönderildi', accepted: 'Kabul edildi', rejected: 'Reddedildi' }[q.status] || q.status}
              </span>
            </div>
          </div>
          {q.note && <p className="mt-3 text-sm text-foreground/70 whitespace-pre-line leading-relaxed">{q.note}</p>}
          {q.token ? (
            <Link
              to={`/teklif-onayi/${q.token}`}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-5 py-2.5 text-sm hover:shadow-sticker transition-shadow"
            >
              <FileText className="w-4 h-4" /> Teklifi görüntüle
            </Link>
          ) : (
            <p className="mt-5 text-xs text-muted-foreground">Teklif linki yok — bizimle iletişime geçin.</p>
          )}
        </div>
      ))}
      {leads.map((l) => {
        const meta = STATUS[l.status] || STATUS.new;
        return (
          <div key={l.id} className="bg-card border border-border rounded-3xl p-6 hover:border-mint/30 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-semibold">{[l.service, l.sector].filter(Boolean).join(' · ') || TYPE[l.type] || 'Talep'}</h3>
                <p className="font-mono text-xs text-muted-foreground mt-1">
                  {new Date(l.created_date).toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <span className={`rounded-full px-4 py-1 text-xs font-semibold ${meta.cls}`}>{meta.label}</span>
            </div>
            {l.estimate && <p className="mt-3 font-mono text-sm text-mint">Tahmini bütçe: {l.estimate}</p>}
            {l.appointment_date && (
              <p className="mt-3 font-mono text-sm text-sun">Randevu: {l.appointment_date} {l.appointment_time || ''}</p>
            )}
            {l.package_summary && (
              <div className="border-l-2 border-sun pl-4 mt-4">
                <span className="font-mono text-xs uppercase text-sun">Özel paketiniz</span>
                <p className="text-sm text-foreground/75 mt-1 whitespace-pre-line leading-relaxed">{l.package_summary}</p>
              </div>
            )}
            {l.message && <p className="text-sm text-foreground/60 mt-4 whitespace-pre-line">{l.message}</p>}
            <button
              onClick={() => {
                const pkg = parsePkg(l.package_data);
                if (pkg) downloadPackagePdf(pkg, { name: l.name });
                else downloadQuotePdf(l);
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-5 py-2.5 text-sm hover:shadow-sticker transition-shadow"
            >
              <Download className="w-4 h-4" /> {l.package_data ? 'Paket teklifi PDF indir' : 'Teklif PDF indir'}
            </button>
          </div>
        );
      })}
    </div>
  );
}