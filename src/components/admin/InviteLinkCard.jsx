import React, { useState } from 'react';
import { Copy, Check, MessageCircle, Zap } from 'lucide-react';

/** Davet sonrası gösterilen giriş bağlantısı.
 *  Magic link (?mtoken=): tek tıkla hesap açılır, yalnızca e-postadaki kod girilir.
 *  Standart davet linki: e-posta dolu kayıt sayfası açılır. */
export default function InviteLinkCard({ email, link }) {
  const [copied, setCopied] = useState(false);
  const isMagic = !!link && link.includes('mtoken=');

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wa = `https://wa.me/?text=${encodeURIComponent(
    `Dijitrak hesabınızı açmak için bu bağlantıyı kullanın (tek kullanımlık): ${link}`
  )}`;

  return (
    <div className="rounded-2xl border border-mint/40 bg-mint/10 p-4">
      <p className="flex items-center gap-1.5 font-mono text-xs uppercase text-mint">
        {isMagic && <Zap className="w-3.5 h-3.5" />}
        {isMagic ? 'Tek kullanımlık giriş linki' : 'Hesap açma linki'} · {email}
      </p>
      <p className="text-xs text-foreground/60 mt-1">
        {isMagic
          ? 'Müşteri linke tıkladığında hesabı otomatik açılır; yalnızca e-postasına gelen 6 haneli kodu girmesi yeterli. Şifre belirlemesi gerekmez.'
          : 'Bu linki davetliye iletin — e-postası dolu şifre belirleme sayfası açılır.'}
      </p>
      <div className="mt-3 rounded-xl bg-secondary border border-border px-3 py-2 font-mono text-xs break-all">{link}</div>
      <div className="flex flex-wrap gap-2 mt-3">
        <button onClick={copy} className="flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-4 py-2 text-xs">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'Kopyalandı' : 'Linki Kopyala'}
        </button>
        <a href={wa} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-mint text-mint font-semibold px-4 py-2 text-xs hover:bg-mint/10">
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp ile Gönder
        </a>
      </div>
    </div>
  );
}