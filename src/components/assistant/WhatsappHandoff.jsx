import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { CONTACT } from '@/lib/contact';

// DijiBot sohbetinden WhatsApp'a geçiş: bir dokunuşla işletmenin kendi hattına.
export default function WhatsappHandoff({ text }) {
  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text || 'Merhaba! DijiBot sohbetinden devam ediyorum.')}`;
  return (
    <div className="mt-3 space-y-2">
      <a
        href={wa}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 rounded-2xl border-2 border-mint/50 bg-card px-4 py-3 text-sm font-semibold text-mint hover:bg-mint hover:text-ink hover:-translate-y-0.5 transition-all"
      >
        <MessageCircle className="w-4 h-4" /> WhatsApp'tan devam et (DijiBot)
      </a>
      <a href={wa} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-mint transition-colors">
        <Phone className="w-3 h-3" /> veya numaramızdan yaz: {CONTACT.phone}
      </a>
    </div>
  );
}