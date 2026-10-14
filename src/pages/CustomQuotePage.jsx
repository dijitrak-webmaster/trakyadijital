import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, CheckCircle2, XCircle, CalendarClock } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const fmt = (n) => (Number(n) || 0).toLocaleString('tr-TR');

/** Müşteriye özel teklifin paylaşılan sayfası — /teklif-onayi/:token */
export default function CustomQuotePage() {
  const { token } = useParams();
  const [q, setQ] = useState(null);
  const [state, setState] = useState('loading');
  const [responding, setResponding] = useState(null);

  useEffect(() => {
    let alive = true;
    setState('loading');
    base44.functions.invoke('customQuoteRespond', { token, action: 'fetch' })
      .then((res) => {
        if (!alive) return;
        const item = res?.data?.quote;
        if (item) { setQ(item); setState('ready'); }
        else setState('error');
      })
      .catch(() => { alive && setState('error'); });
    return () => { alive = false; };
  }, [token]);

  const respond = async (action) => {
    setResponding(action);
    try {
      const res = await base44.functions.invoke('customQuoteRespond', { token, action });
      const st = res?.data?.status;
      if (st === 'accepted' || st === 'rejected') setQ((cur) => ({ ...cur, status: st }));
      else if (res?.data?.error === 'expired') setState('expired');
      else throw new Error('no');
    } catch {
      setState('respond_error');
    }
    setResponding(null);
  };

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
        <p className="text-sm text-muted-foreground max-w-xs">Bu bağlantı geçersiz olabilir. Teklifi bizden yeniden isteyebilirsiniz.</p>
        <Link to="/" className="inline-flex items-center gap-1.5 font-mono text-xs text-mint hover:underline mt-2"><ArrowLeft className="w-3.5 h-3.5" /> ana sayfa</Link>
      </div>
    );
  }

  let items = [];
  try { items = JSON.parse(q.items || '[]'); } catch { items = []; }
  const canRespond = q.status === 'draft' || q.status === 'sent';
  const no = `DJT-${(q.id || '').slice(-6).toUpperCase()}`;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-border overflow-hidden bg-card">
          <div className="bg-terminal px-6 py-6 relative">
            <div className="h-1 bg-mint absolute bottom-0 left-0 right-0" />
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-3xl font-semibold text-mint">DIJITRAK</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/80 mt-1">ÖZEL TEKLİF</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs text-sun">No: {no}</p>
                <p className="font-mono text-[10px] text-white/50 mt-1">{new Date(q.created_date || Date.now()).toLocaleDateString('tr-TR')}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 border-b border-border">
            <p className="font-display text-xl font-semibold">{q.client_name || q.title}</p>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              {[q.client_phone, q.client_email].filter(Boolean).join(' · ')}
            </p>
            {q.valid_until && (
              <p className="font-mono text-xs text-sun mt-2 inline-flex items-center gap-1.5">
                <CalendarClock className="w-3.5 h-3.5" /> Geçerlilik: {new Date(q.valid_until).toLocaleDateString('tr-TR')}
              </p>
            )}
          </div>

          <div className="px-6 py-5 space-y-4">
            <p className="font-display text-xl font-semibold">{q.title}</p>
            {q.note && <p className="text-sm text-foreground/75 whitespace-pre-wrap leading-relaxed">{q.note}</p>}

            <div className="space-y-3">
              <p className="font-mono text-[10px] uppercase text-mint">Teklif kalemleri</p>
              {items.map((it, i) => (
                <div key={i} className="rounded-xl border border-border p-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold text-sm">{it.name}{it.billing === 'monthly' ? ' (aylık)' : ''}</p>
                    <p className="font-mono text-xs text-mint whitespace-nowrap">{fmt(it.price)} ₺{it.billing === 'monthly' ? ' /ay' : ''}</p>
                  </div>
                  {it.description && <p className="text-xs text-foreground/70 mt-1.5 whitespace-pre-wrap">{it.description}</p>}
                </div>
              ))}
            </div>

            <div className="space-y-1.5 pt-1">
              {Number(q.discount_amount) > 0 && (
                <div className="flex items-center justify-between gap-3 text-sm text-mint">
                  <span>İndirim</span>
                  <span className="font-mono text-xs">-{fmt(q.discount_amount)} ₺</span>
                </div>
              )}
              <div className="rounded-xl bg-sun text-ink p-4">
                <p className="font-mono text-[10px] uppercase font-bold">Genel toplam</p>
                <p className="font-display text-xl font-semibold mt-1">
                  {fmt(q.total)} ₺{items.some((it) => it.billing === 'monthly') ? ' + aylık hizmetler' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* onay / red */}
        {canRespond ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-4">
            <p className="text-sm text-foreground/75">Teklifi incelediniz mi? Onaylarsanız siparişiniz anında oluşturulur ve ödeme bağlantısı en kısa sürede size iletilir.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => respond('accepted')}
                disabled={!!responding}
                className="inline-flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-7 py-3 text-sm hover:shadow-sticker transition-shadow disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" /> {responding === 'accepted' ? 'Onaylanıyor...' : 'Teklifi onayla'}
              </button>
              <button
                onClick={() => respond('rejected')}
                disabled={!!responding}
                className="inline-flex items-center gap-2 rounded-full border border-coral/50 text-coral font-semibold px-7 py-3 text-sm hover:bg-coral/10 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" /> Reddet
              </button>
            </div>
            {state === 'respond_error' && (
              <p className="text-xs text-coral">Şu anda işlenemedi — lütfen WhatsApp'tan veya telefondan bize yazın, hemen ilgileniyoruz.</p>
            )}
            {state === 'expired' && (
              <p className="text-xs text-coral">Teklifin geçerlilik süresi doldu — güncel bir teklif için bize yazın.</p>
            )}
          </div>
        ) : (
          <div className={`rounded-2xl border p-6 text-center ${q.status === 'accepted' ? 'border-mint/40 bg-mint/10' : 'border-border bg-card'}`}>
            {q.status === 'accepted' ? (
              <p className="text-sm text-mint font-semibold">Teklifinizi onayladınız — siparişiniz oluşturuldu. Ödeme linki en kısa sürede WhatsApp veya e-posta ile iletilecek.</p>
            ) : q.status === 'rejected' ? (
              <p className="text-sm text-muted-foreground">Bu teklifi reddettiniz. Yeni bir teklif için bize ulaşabilirsiniz.</p>
            ) : (
              <p className="text-sm text-muted-foreground">Teklif henüz paylaşılmadı.</p>
            )}
          </div>
        )}

        <p className="text-center font-mono text-[10px] text-muted-foreground pb-6">merhaba@dijitrak.com · +90 554 203 04 73 · Tekirdağ, Türkiye</p>
      </div>
    </div>
  );
}