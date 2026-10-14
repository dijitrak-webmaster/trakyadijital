import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations, literals } from '@/lib/i18n';

// sağlayıcı yoksa bile bileşenler çökmesin: varsayılan Türkçe sözlük
const fallback = {
  lang: 'tr',
  setLang: () => {},
  toggle: () => {},
  t: (key) => translations.tr[key] || key,
  tl: (s) => s,
};
const LanguageContext = createContext(fallback);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => (typeof localStorage !== 'undefined' && localStorage.getItem('dijitrak-lang')) || 'tr');

  useEffect(() => {
    localStorage.setItem('dijitrak-lang', lang);
  }, [lang]);

  const t = (key) =>
    (translations[lang] && translations[lang][key]) ||
    translations.tr[key] ||
    (lang === 'en' ? literals[key] ?? key : key);
  // düz metin çevirisi: Türkçe veri dizilerini İngilizce sözlükten çevirir
  const tl = (s) => (lang === 'en' && typeof s === 'string' ? literals[s] ?? s : s);
  const toggle = () => setLang((l) => (l === 'tr' ? 'en' : 'tr'));

  return <LanguageContext.Provider value={{ lang, setLang, toggle, t, tl }}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);