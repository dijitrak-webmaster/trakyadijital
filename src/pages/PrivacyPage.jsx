import React from 'react';
import LegalPage from '@/components/site/LegalPage';
import { PRIVACY } from '@/lib/legal';
import { useLanguage } from '@/lib/LanguageContext';

export default function PrivacyPage() {
  const { t, lang } = useLanguage();
  return <LegalPage doc={PRIVACY} other="/kullanim-sartlari" otherLabel={t('footer.terms')} lang={lang} />;
}