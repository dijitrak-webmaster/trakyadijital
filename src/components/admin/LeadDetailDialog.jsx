import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TYPE } from '@/components/admin/leadMeta';
import { Download, Sparkles, Trash2, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { downloadQuotePdf } from '@/lib/quotePdf';
import ConversationLog from '@/components/admin/ConversationLog';

export default function LeadDetailDialog({ lead, onClose, onDelete }) {
  const [summary, setSummary] = useState(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    setSummary(null);
    setAiBusy(false);
    setOrder(undefined);
    if (lead?.referral === 'market') {
      base44.entities.Order.filter({ lead_id: lead.id }, '-created_date', 1)
        .then((o) => setOrder(o[0] || null))
        .catch(() => setOrder(null));
    } else setOrder(null);
  }, [lead?.id]);

  const aiSummary = async () => {
    setAiBusy(true);
    try {
      const res = await base44.functions.invoke('aiLeadSummary', {
        name: lead.name || '',
        service: lead.service || '',
        conversation: lead.conversation || lead.message || '',
      });
      if (res?.data?.summary) setSummary(res.data.summary);
    } catch (e) {
      setSummary('AI özeti şu an kullanılamıyor — entegrasyon kredileri yenilendiğinde çalışacak.');
    }
    setAiBusy(false);
  };

  const openQuotePage = async () => {
    try {
      const res = await base44.functions.invoke('quoteLink', { lead_id: lead.id });
      if (res?.data?.url) window.open(res.data.url, '_blank');
    } catch {
      setSummary('Teklif sayfası linki üretilemedi — tekrar deneyin.');
    }
  };

  const rows = lead ? [['Telefon', lead.phone], ['E-posta', lead.email], ['Firma', lead.company], ['Tip', TYPE[lead.type]], ['Hizmet', lead.service], ['Sektör', lead.sector], ['Tahmini bütçe', lead.estimate], ['Randevu', lead.appointment_date && `${lead.appointment_date} ${lead.appointment_time || ''}`], ['Mesaj', lead.message], ['Özel paket', lead.package_summary], ['Referans', lead.referral], ['Oturum kodu', lead.session_id], ['IP adresi', lead.ip_address], ['Cihaz', lead.device_info]] : [];
  return (
    <Dialog open={!!lead} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-background border-border rounded-none max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-display text-2xl">{lead?.name}</DialogTitle></DialogHeader>
        <dl className="grid grid-cols-[140px,1fr] border border-border font-mono text-sm">
          {rows.filter(([, v]) => v).map(([k, v]) => (
            <React.Fragment key={k}>
              <dt className="p-2.5 border-b border-r border-border text-muted-foreground">{k}</dt>
              <dd className="p-2.5 border-b border-border whitespace-pre-wrap">{v}</dd>
            </React.Fragment>
          ))}
        </dl>
        {lead?.referral === 'market' && order && (() => {
          let parsed = [];
          try { parsed = JSON.parse(order.items || '[]'); } catch { parsed = []; }
          const OSTAT = { new: 'Yeni', approved: 'Onaylandı', in_progress: 'Süreçte', delivered: 'Teslim edildi', cancelled: 'İptal' };
          return (
            <div className="border border-mint/30 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="font-mono text-xs uppercase text-mint">Bağlı sipariş</h4>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] border border-border rounded-full px-2 text-muted-foreground">{OSTAT[order.status] || order.status}</span>
                  {order.payment_status === 'paid'
                    ? <span className="font-mono text-[10px] bg-mint text-ink rounded-full px-2 font-bold">Ödendi</span>
                    : <span className="font-mono text-[10px] text-muted-foreground border border-border rounded-full px-2">Ödeme bekliyor</span>}
                </div>
              </div>
              <div className="divide-y divide-border text-sm">
                {parsed.map((p, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 py-1.5">
                    <span className="truncate">{p.title}{p.billing === 'monthly' ? ' (abonelik)' : ''}</span>
                    <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">{(Number(p.price) || 0).toLocaleString('tr-TR')} ₺{p.billing === 'monthly' ? ' /ay' : ''}</span>
                  </div>
                ))}
                {Number(order.discount_amount) > 0 && (
                  <div className="flex items-center justify-between gap-3 py-1.5 text-mint text-sm">
                    <span>İndirim ({order.discount_code})</span>
                    <span className="font-mono text-xs">-{(Number(order.discount_amount) || 0).toLocaleString('tr-TR')} ₺</span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-3 py-1.5 font-semibold">
                  <span>Ödenecek</span>
                  <span className="font-mono">{(Number(order.total) || 0).toLocaleString('tr-TR')} ₺</span>
                </div>
              </div>
            </div>
          );
        })()}
        {summary && (
          <div className="border border-mint/40 bg-mint/10 rounded-xl p-3">
            <h4 className="font-mono text-xs uppercase text-mint mb-1">AI özeti</h4>
            <p className="text-sm text-foreground/85">{summary}</p>
          </div>
        )}
        {lead?.conversation && (
          <div>
            <h4 className="font-mono text-xs uppercase text-muted-foreground mb-2">Konuşma geçmişi</h4>
            <ConversationLog conversation={lead.conversation} />
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={aiSummary}
            disabled={aiBusy || !(lead?.conversation || lead?.message)}
            className="inline-flex items-center gap-2 rounded-full border border-mint/50 text-mint font-semibold px-5 py-2.5 text-sm disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" /> {aiBusy ? 'Özetleniyor...' : 'AI ile özetle'}
          </button>
          <button
            onClick={() => downloadQuotePdf(lead)}
            className="inline-flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-5 py-2.5 text-sm hover:shadow-sticker transition-shadow"
          >
            <Download className="w-4 h-4" /> Teklif PDF indir
          </button>
          <button
            onClick={openQuotePage}
            className="inline-flex items-center gap-2 rounded-full border border-sun/50 text-sun font-semibold px-5 py-2.5 text-sm hover:bg-sun/10 transition-colors"
          >
            <FileText className="w-4 h-4" /> Teklif sayfası
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(lead.id)}
              className="inline-flex items-center gap-2 rounded-full border border-coral/50 text-coral font-semibold px-5 py-2.5 text-sm hover:bg-coral/10 transition-colors ml-auto"
            >
              <Trash2 className="w-4 h-4" /> Sil
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}