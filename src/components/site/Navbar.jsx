import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useAssistant } from '@/lib/AssistantContext';
import { useLanguage } from '@/lib/LanguageContext';
import { sectors } from '@/lib/siteData';
import { serviceCategories } from '@/lib/serviceCatalog';
import Logo from '@/components/site/Logo';
import NavbarActions from '@/components/site/NavbarActions';
import useSiteSettings from '@/hooks/useSiteSettings';
import NavDropdown from '@/components/site/NavDropdown';
import MobileMenu from '@/components/site/MobileMenu';

// tüm menü öğeleri aynı yükseklik/dolguda — logo ve sağ grupla aynı ritimde (h-11 kapsül, h-9 öğe)
const ITEM = 'inline-flex items-center h-9 px-3 rounded-full transition-colors';
const PILL = 'flex items-center gap-0.5 h-11 p-1 rounded-full bg-secondary/40 border border-border';
const linkClass = ({ isActive }) =>
  `${ITEM} ${isActive ? 'bg-mint/15 text-mint' : 'text-foreground/80 hover:bg-foreground/10 hover:text-mint'}`;

export default function Navbar() {
  const { openAssistant } = useAssistant();
  const { t, tl } = useLanguage();
  const [s] = useSiteSettings();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener('scroll', on);
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 bg-background/85 backdrop-blur-xl border-b ${scrolled ? 'border-border shadow-lg shadow-black/20' : 'border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex justify-between xl:grid xl:grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <Logo className="h-8 md:h-9 xl:h-10" />
        </div>
        <nav className={`hidden xl:flex ${PILL} text-sm font-semibold whitespace-nowrap`}>
          <NavDropdown label={t('nav.services')} items={[{ label: t('nav.servicesAll'), href: '/hizmetler' }, ...serviceCategories.map((c) => ({ label: tl(c.name), href: `/hizmetler?k=${c.id}` }))]} />
          <NavDropdown label={t('nav.sectors')} items={sectors.map((sec) => ({ label: tl(sec.name), href: `/sektor/${sec.slug}` }))} />
          <NavLink to="/fiyatlandirma" className={linkClass}>{t('nav.pricing')}</NavLink>
          <NavDropdown label={t('nav.discover')} items={[
            { label: t('nav.portfolio'), href: '/portfolyo' },
            { label: t('nav.blog'), href: '/blog' },
            { label: t('nav.about'), href: '/hakkimizda' },
            { label: t('nav.maturity'), href: '/olgunluk-testi' },
            { label: t('nav.radar'), href: '/rakip-radar' },
            { label: t('nav.index'), href: '/trakya-endeks' },
            { label: t('nav.simulator'), href: '/simulasyon' },
            { label: t('nav.calculator'), href: '/#hesaplayici' },
            { label: t('nav.process'), href: '/is-surecleri' },
            { label: t('nav.tech'), href: '/teknoloji' },
            { label: t('nav.reviews'), href: '/yorumlar' },
            { label: t('nav.faq'), href: '/sss' },
            { label: t('nav.portal'), href: '/portal' },
          ]} />
          {s.market_enabled && (
            <NavLink
              to="/market"
              className={({ isActive }) => `${ITEM} gap-1.5 text-sun ${isActive ? 'bg-sun/20' : 'hover:bg-sun/10'}`}
            >
              <ShoppingBag className="w-4 h-4" /> {t('nav.market')}
            </NavLink>
          )}
          <NavLink to="/iletisim" className={linkClass}>{t('nav.contact')}</NavLink>
        </nav>
        <div className="flex items-center gap-2 shrink-0 xl:justify-self-end">
          <NavbarActions />
          <MobileMenu onAssistant={() => openAssistant()} />
        </div>
      </div>
    </header>
  );
}