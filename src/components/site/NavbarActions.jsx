import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Bot, LayoutDashboard, MessageCircle, UserRound } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { CONTACT } from '@/lib/contact';
import { useAssistant } from '@/lib/AssistantContext';
import { useLanguage } from '@/lib/LanguageContext';
import LangToggle from '@/components/site/LangToggle';
import CartButton from '@/components/market/CartButton';

const WA_URL = `https://wa.me/${CONTACT.whatsapp}`;

const CIRCLE =
  'inline-flex items-center justify-center w-10 h-10 rounded-full border border-border bg-secondary/40 text-foreground/80 hover:border-mint/50 hover:text-mint active:scale-95 transition-all';

/** Navbar sağ kümesi: hesap ikonları, dil, sepet, WhatsApp ve AI Danışman düğmesi. */
export default function NavbarActions() {
  const { openAssistant } = useAssistant();
  const { t } = useLanguage();
  const [authed, setAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then((ok) => {
      setAuthed(ok);
      if (ok) base44.auth.me().then((u) => setIsAdmin(u?.role === 'admin')).catch(() => {});
    }).catch(() => {});
  }, []);

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
      {authed && (
        <NavLink to="/portal" title="Müşteri Portalı" className={`${CIRCLE} hidden sm:inline-flex`}>
          <UserRound className="w-4 h-4" />
        </NavLink>
      )}
      {isAdmin && (
        <NavLink to="/admin" title="Panel" className={`${CIRCLE} hidden sm:inline-flex`}>
          <LayoutDashboard className="w-4 h-4" />
        </NavLink>
      )}
      <div className="hidden sm:block">
        <LangToggle className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border bg-secondary/40 font-mono text-xs font-bold text-foreground/80 hover:border-mint/50 hover:text-mint active:scale-95 transition-all" />
      </div>
      <CartButton className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-mint/40 text-mint hover:bg-mint/10 active:scale-95 transition-all" />
      <a href={WA_URL} target="_blank" rel="noreferrer" title="DijiBot'u WhatsApp'ta aç" className={`${CIRCLE} hidden sm:inline-flex`}>
        <MessageCircle className="w-4 h-4" />
      </a>
      <button
        onClick={() => openAssistant()}
        aria-label={t('nav.assistant')}
        className="inline-flex items-center justify-center gap-2 h-10 w-10 sm:w-auto sm:px-5 rounded-full bg-mint text-ink text-sm font-bold whitespace-nowrap hover:-translate-y-0.5 hover:shadow-sticker active:scale-95 transition-all"
      >
        <Bot className="w-4 h-4" /> <span className="hidden sm:inline">{t('nav.assistant')}</span>
      </button>
    </div>
  );
}