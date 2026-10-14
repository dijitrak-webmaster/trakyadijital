import React from 'react';
import { Bot, MessageCircle } from 'lucide-react';
import { CONTACT } from '@/lib/contact';
import { useAssistant } from '@/lib/AssistantContext';
import { useLanguage } from '@/lib/LanguageContext';
import RobotMascot from '@/components/mascot/RobotMascot';

// Kontrol/araç sonucunu DijiBot'a bağlamla taşıyan + WhatsApp çıkışı sunan kart.
export default function ToolAssistantCta({ message, domain = null }) {
  const { tl } = useLanguage();
  const { openAssistant } = useAssistant();
  const waUrl = `https://wa.me/${CONTACT.whatsapp}`;

  return (
    <div className="rounded-3xl border-2 border-dashed border-mint/40 bg-card p-5 flex flex-col sm:flex-row items-center gap-4">
      <RobotMascot emotion="happy" className="w-12 h-12 shrink-0 hidden sm:block" />
      <div className="flex-1 text-center sm:text-left">
        <p className="font-display font-semibold">{tl('Sonucu DijiBot ile değerlendirin')}</p>
        <p className="text-xs text-foreground/60 mt-0.5">{tl('Sonucu asistanımıza taşır, size özel paketi orada kurarız — dilerseniz WhatsApp\'tan devam edin.')}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => openAssistant(domain ? { text: message, domain } : { text: message })}
          className="rounded-full bg-mint text-ink font-semibold px-6 py-3 inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-sticker transition-all"
        >
          <Bot className="w-4 h-4" /> {tl('DijiBot\'a gönder')}
        </button>
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-border px-6 py-3 font-semibold text-foreground/80 hover:border-mint hover:text-mint transition-colors inline-flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" /> {tl('WhatsApp\'tan yaz')}
        </a>
      </div>
    </div>
  );
}