import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, MessageSquare, UserPlus, FileText, Phone, Copy, Check } from 'lucide-react';
import { CONTACT } from '@/lib/contact';

const btn = 'inline-flex flex-col items-center justify-center gap-1 rounded-xl border border-mint/50 bg-card py-3 px-2 text-xs font-semibold text-mint hover:bg-mint hover:text-ink hover:-translate-y-0.5 transition-all';

/** Sohbet sonrası teklif kanalları: teklif sayfası, WhatsApp (DijiBot oturumu + işletme numarası), SMS ve kayıt/panel. */
export default function QuoteChannels({ info, quoteUrl }) {
  const [copied, setCopied] = useState(false);
  const waText = `Merhaba! ${info?.service ? `${info.service} için` : ''} teklif talep ettim${info?.name ? `, ben ${info.name}` : ''}. (dijitrak.com - DijiBot)`;
  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(waText)}`;
  const sms = `sms:${CONTACT.phone}?&body=${encodeURIComponent(waText)}`;
  const botUrl = wa;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(quoteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="mt-3 rounded-2xl border-2 border-sun/40 bg-card p-3 space-y-2">
      {quoteUrl && (
        <a href={quoteUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-2 rounded-xl bg-mint text-ink px-4 py-3 text-sm font-semibold shadow-sticker hover:-translate-y-0.5 transition-all">
          <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Teklif sayfasını aç (PDF indirilebilir)</span>
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.preventDefault(); copyLink(); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); copyLink(); } }}
            className="p-1.5 rounded-lg hover:bg-ink/10 transition-colors"
            aria-label="Linki kopyala"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </span>
        </a>
      )}
      <div className="grid grid-cols-3 gap-2">
        <a href={botUrl} target="_blank" rel="noreferrer" className={btn}>
          <MessageCircle className="w-4 h-4" /> WhatsApp (DijiBot)
        </a>
        <a href={sms} className={btn}>
          <MessageSquare className="w-4 h-4" /> SMS
        </a>
        <Link to="/musteri-portali" className={btn}>
          <UserPlus className="w-4 h-4" /> Kayıt / Panel
        </Link>
      </div>
      <a href={wa} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-mint transition-colors">
        <Phone className="w-3 h-3" /> veya numaramızdan yaz: {CONTACT.phone}
      </a>
    </div>
  );
}