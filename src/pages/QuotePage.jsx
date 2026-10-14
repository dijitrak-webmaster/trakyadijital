import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Download, Loader2, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { downloadPackagePdf } from '@/lib/quotePdf';

const fmtPrice = (p) =>
  Array.isArray(p) ? `₺${p[0].toLocaleString('tr-TR')} - ₺${p[1].toLocaleString('tr-TR')}` : p;

/** DijiBot teklifinin paylaşılan sayfası — /teklif/:leadId?token=... */
export default function QuotePage() {
  const { leadId } = useParams();
  const [params] = useSearchParams();
  const token = params.get('token');
  const [q, setQ] = useState(null);
  const [state, setState] = useState('loading');

  useEffect(() => {
    let alive = true;
    setState('loading');
    base44.functions.invoke('quoteLink', { lead_id: leadId, token })
      .then((res) => {
        if (!alive) return;
        if (res?.data && !res.data.error) {
          setQ(res.data); setState('ready');
          // açılma sayacı — oturum başına bir kez, sessizce
          const key = `qview-${leadId}`;
          if (leadId && token && !sessionStorage.getItem(key)) {
            sessionStorage.setItem(key, '1');
            base44.functions.invoke('quoteOpened', { lead_id: leadId, token }).catch(() => {});
          }
        } else setState('error');
      })
      .catch(() => { alive && setState('error'); });
    return () => { alive = false; };
  }, [leadId, token]);

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-mint" />
        <p className="font-mono text-xs text-muted-foreground">Teklif hazırlanıyor...</p>
      </div>
    );
  }

  if (state === 'error' || !q) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-6">
        <p className="font-display text-xl font-semibold">Teklif bulunamadı</p>
        <p className="text-sm text-muted-foreground max-w-xs">Bu bağlantı geçersiz olabilir. Teklifi DijiBot'tan veya bizden yeniden isteyebilirsiniz.</p>
        <Link to="/" className="inline-flex items-center gap-1.5 font-mono text-xs text-mint hover:underline mt-2"><ArrowLeft className="w-3.5 h-3.5" /> ana sayfa</Link>
      </div>
    );
  }

  const pkg = q.pkg;
  const items = (pkg?.items && pkg.items.length ? pkg.items : [{ title: pkg?.base || q.service || 'Teklif', monthly: false, price: null, features: [] }]);
  const no = `DJT-${(leadId || '').slice(-6).toUpperCase()}`;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* başlık bandı */}
        <div className="rounded-2xl border border-border overflow-hidden bg-card">
          <div className="bg-terminal px-6 py-6 relative">
            <div className="h-1 bg-mint absolute bottom-0 left-0 right-0" />
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-3xl font-semibold text-mint">DIJITRAK</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/80 mt-1">{pkg ? 'ÖZEL PAKET TEKLİFİ' : 'DİJİTAL DÖNÜŞÜM TEKLİFİ'}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs text-sun">No: {no}</p>
                <p className="font-mono text-[10px] text-white/50 mt-1">{new Date(q.created_date || Date.now()).toLocaleDateString('tr-TR')}</p>
              </div>
            </div>
          </div>

          {/* müşteri */}
          <div className="px-6 py-5 border-b border-border">
            <p className="font-display text-lg font-semibold">{q.name}</p>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              {[q.company, q.phone, q.email].filter(Boolean).join(' · ')}
            </p>
          </div>

          {/* kapsam */}
          <div className="px-6 py-4 border-b border-border">
            <p className="font-mono text-[10px] uppercase text-mint mb-2">Kapsam</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
              {[['Hizmet', q.service], ['Sektör', q.sector], ['Tahmini bütçe', q.estimate], ['Randevu', q.appointment_date && `${q.appointment_date} ${q.appointment_time || ''}`]].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-muted-foreground text-xs min-w-[92px]">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* paket kalemleri */}
          {pkg ? (
            <div className="px-6 py-5 space-y-4">
              <div>
                <p className="font-display text-xl font-semibold">{pkg.name}</p>
                {pkg.note && <p className="text-sm text-muted-foreground mt-1">{pkg.note}</p>}
              </div>
              <div className="space-y-3">
                <p className="font-mono text-[10px] uppercase text-mint">Paket Kapsamı</p>
                {items.map((it, i) => (
                  <div key={i} className="rounded-xl border border-border p-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-semibold text-sm">{it.title}{it.monthly ? ' (aylık)' : ''}</p>
                      <p className="font-mono text-xs text-mint whitespace-nowrap">{it.price ? `${fmtPrice(it.price)}${it.monthly ? ' /ay' : ''}` : 'Talep üzerine'}</p>
                    </div>
                    {(it.features || []).length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {it.features.map((f, j) => (
                          <li key={j} className="text-xs text-foreground/70 flex gap-1.5"><span className="text-mint">+</span>{f}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* toplam */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-sun text-ink p-4">
                  <p className="font-mono text-[10px] uppercase font-bold">Tek seferlik toplam</p>
                  <p className="font-display text-xl font-semibold mt-1">{pkg.priceOne || 'Talep üzerine'}</p>
                </div>
                {pkg.priceMonthly && (
                  <div className="rounded-xl bg-secondary p-4">
                    <p className="font-mono text-[10px] uppercase text-muted-foreground">Aylık hizmetler</p>
                    <p className="font-display text-xl font-semibold mt-1">{pkg.priceMonthly}</p>
                  </div>
                )}
              </div>

              {(pkg.includes || []).length > 0 && (
                <div>
                  <p className="font-mono text-[10px] uppercase text-mint mb-2">Pakete dahil</p>
                  <ul className="space-y-1">
                    {pkg.includes.map((inc, j) => (
                      <li key={j} className="text-sm text-foreground/80 flex gap-1.5"><span className="text-mint">+</span>{inc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {pkg.priceOne && (
                <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Ödeme planı:</span> %40 başlangıç · %40 tasarım onayı · %20 teslim</p>
              )}
            </div>
          ) : (
            q.package_summary && (
              <div className="px-6 py-5">
                <p className="font-mono text-[10px] uppercase text-mint mb-2">Özel paket önerisi</p>
                <p className="text-sm text-foreground/85 whitespace-pre-wrap">{q.package_summary}</p>
              </div>
            )
          )}
        </div>

        {/* PDF + koşullar */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => pkg && downloadPackagePdf(pkg, { name: q.name })}
            className="inline-flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-6 py-3 text-sm hover:shadow-sticker transition-shadow disabled:opacity-40"
            disabled={!pkg}
          >
            <Download className="w-4 h-4" /> Teklifi PDF olarak indir
          </button>
          <p className="text-xs text-muted-foreground text-center max-w-sm">
            Bu belge, sohbetinizde birlikte kurduğumuz paketin ön teklif özetidir. Net fiyat ve takvim, ücretsiz keşif görüşmesinden sonra 24 saat içinde yazılı teklifle kesinleşir. Teklif 15 gün geçerlidir.
          </p>
        </div>

        <p className="text-center font-mono text-[10px] text-muted-foreground pb-6">merhaba@dijitrak.com · +90 554 203 04 73 · Tekirdağ, Türkiye</p>
      </div>
    </div>
  );
}