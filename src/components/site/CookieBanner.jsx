import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const TEXTS = {
  tr: {
    text: 'Sitemizde yalnızca zorunlu çerezler kullanılır (oturum, dil ve bu onay). Detaylar için',
    link: 'Gizlilik Politikası',
    accept: 'Kabul Et',
    decline: 'Reddet',
  },
  en: {
    text: 'We use strictly necessary cookies only (session, language and this consent). See our',
    link: 'Privacy Policy',
    accept: 'Accept',
    decline: 'Decline',
  },
};

/**
 * KVKK uyumlu çerez bildirimi — onay localStorage'da saklanır, ret durumunda da yalnızca
 * zorunlu çerezler kullanıldığı için site çalışmaya devam eder.
 */
export default function CookieBanner() {
  const { lang } = useLanguage();
  const T = TEXTS[lang] || TEXTS.tr;
  const [choice, setChoice] = useState(() => localStorage.getItem('dijitrak_cookie_consent'));

  if (choice) return null;

  const decide = (value) => {
    localStorage.setItem('dijitrak_cookie_consent', value);
    setChoice(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      className="fixed inset-x-3 bottom-3 z-[90] md:inset-x-auto md:left-6 md:bottom-6 md:max-w-sm"
      role="dialog"
      aria-label={lang === 'en' ? 'Cookie consent' : 'Çerez onayı'}
    >
      <div className="rounded-xl border-2 border-border bg-card p-4 shadow-sticker">
        <div className="flex items-start gap-3">
          <span className="w-9 h-9 shrink-0 rounded-lg bg-mint/15 border border-mint/50 flex items-center justify-center">
            <Cookie className="w-4 h-4 text-mint" />
          </span>
          <p className="text-xs text-foreground/80 leading-relaxed">
            {T.text}{' '}
            <Link to="/gizlilik" className="text-mint underline underline-offset-2 hover:text-sun">{T.link}</Link>.
          </p>
        </div>
        <div className="mt-3 flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => decide('declined')}
            className="rounded-lg border border-border px-4 py-1.5 font-mono text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors"
          >
            {T.decline}
          </button>
          <button
            type="button"
            onClick={() => decide('accepted')}
            className="rounded-lg bg-mint text-ink px-4 py-1.5 font-mono text-[11px] font-bold shadow-sticker hover:bg-sun transition-colors"
          >
            {T.accept}
          </button>
        </div>
      </div>
    </motion.div>
  );
}