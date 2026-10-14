import React from 'react';
import LegalPage from '@/components/site/LegalPage';
import { TERMS } from '@/lib/legal';
import { useLanguage } from '@/lib/LanguageContext';

export default function TermsPage() {
  const { t, lang } = useLanguage();
  return <LegalPage doc={TERMS} other="/gizlilik" otherLabel={t('footer.privacy')} lang={lang} />;
}