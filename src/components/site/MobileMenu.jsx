import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Menu, Bot, MessageCircle, Phone, ShoppingBag, ArrowUpRight, UserRound,
  Wrench, Images, Tags, Newspaper, Mail, Gauge, Radar, TrendingUp, Rocket,
  Calculator, Route, Cpu, Star, HelpCircle, Sparkles,
} from 'lucide-react';
import { CONTACT } from '@/lib/contact';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { sectors } from '@/lib/siteData';
import { useLanguage } from '@/lib/LanguageContext';
import useSiteSettings from '@/hooks/useSiteSettings';
import LangToggle from '@/components/site/LangToggle';
import Logo from '@/components/site/Logo';
import RobotMascot from '@/components/mascot/RobotMascot';

const WA_URL = `https://wa.me/${CONTACT.whatsapp}`;
const TEL_URL = `tel:${CONTACT.phone}`;

// etiketler i18n anahtarlarıdır; render sırasında çevrilir (sektör adları olduğu gibi geçer)
const MAIN = [
  { label: 'nav.services', href: '/hizmetler', icon: Wrench, chip: 'bg-mint/15 text-mint' },
  { label: 'nav.portfolio', href: '/portfolyo', icon: Images, chip: 'bg-sun/15 text-sun' },
  { label: 'nav.pricing', href: '/fiyatlandirma', icon: Tags, chip: 'bg-coral/15 text-coral' },
  { label: 'nav.blog', href: '/blog', icon: Newspaper, chip: 'bg-sage/15 text-sage' },
  { label: 'nav.contact', href: '/iletisim', icon: Mail, chip: 'bg-fog/15 text-fog' },
];

const EXPLORE = [
  { label: 'nav.maturity', href: '/olgunluk-testi', icon: Gauge },
  { label: 'nav.radar', href: '/rakip-radar', icon: Radar },
  { label: 'nav.index', href: '/trakya-endeks', icon: TrendingUp },
  { label: 'nav.simulator', href: '/simulasyon', icon: Rocket },
  { label: 'nav.calculator', href: '/#hesaplayici', icon: Calculator },
  { label: 'nav.process', href: '/is-surecleri', icon: Route },
  { label: 'nav.tech', href: '/teknoloji', icon: Cpu },
  { label: 'nav.reviews', href: '/yorumlar', icon: Star },
  { label: 'nav.faq', href: '/sss', icon: HelpCircle },
];

const SECTOR_DOTS = ['bg-mint', 'bg-sun', 'bg-coral', 'bg-sage', 'bg-fog'];

const fade = (i) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.05 + i * 0.06, type: 'spring', stiffness: 300, damping: 22 },
});

export default function MobileMenu({ onAssistant }) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const [s] = useSiteSettings();
  const close = () => setOpen(false);

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 h-12 rounded-2xl px-3 transition-colors ${isActive ? 'bg-mint/10 text-mint' : 'text-foreground/85 hover:bg-foreground/5 active:bg-foreground/10'}`;

  const chipLink = ({ isActive }, color) =>
    `flex items-center gap-2 h-11 rounded-xl px-3 text-sm font-medium transition-colors border ${isActive ? `${color} border-current` : 'text-foreground/85 border-border bg-secondary/30 active:bg-foreground/10'}`;

  const sectionLabel = (label) => (
    <span className="block px-3 mb-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
  );

  const tile = 'flex flex-col items-start gap-2 rounded-2xl p-3.5 text-sm font-bold leading-tight transition-transform active:scale-95';

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Menü"
        className="relative xl:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border border-border bg-secondary/40 hover:border-mint/50 hover:text-mint active:scale-95 transition-all"
      >
        <Menu className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-mint animate-pulse" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[88%] max-w-sm h-dvh p-0 flex flex-col">
        <div className="flex items-center h-16 px-6 pr-16 border-b border-border">
          <span onClick={close}><Logo className="h-8" /></span>
          <SheetTitle className="sr-only">Menü</SheetTitle>
        </div>
        <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4 flex flex-col gap-5">
          {/* DijiBot karşılama kartı */}
          <motion.div {...fade(0)} className="mx-1 rounded-2xl border border-mint/30 bg-gradient-to-br from-mint/15 via-card to-card p-4 flex items-center gap-3">
            <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} className="shrink-0">
              <RobotMascot emotion="happy" className="w-12 h-14" />
            </motion.div>
            <div className="min-w-0">
              <p className="font-heading font-bold text-base leading-snug">{t('menu.hello')}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t('menu.helloSub')}</p>
            </div>
          </motion.div>

          {/* AI Danışman — büyük sticker buton */}
          <motion.button
            {...fade(1)}
            onClick={() => { close(); onAssistant(); }}
            className="mx-1 flex items-center gap-3 rounded-2xl bg-mint text-ink p-4 shadow-sticker hover:-rotate-1 active:scale-95 transition-transform"
          >
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-ink/15"><Bot className="w-5 h-5" /></span>
            <span className="flex-1 text-left text-sm font-bold">{t('nav.assistant')}</span>
            <Sparkles className="w-4 h-4 opacity-70" />
          </motion.button>

          {/* Portal + Market kutucukları */}
          <motion.div {...fade(2)} className={`grid gap-2 mx-1 ${s.market_enabled ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <NavLink
              to="/portal"
              onClick={close}
              className={({ isActive }) => `${tile} border ${isActive ? 'bg-mint/20 border-mint text-mint' : 'bg-card border-mint/40 text-mint'}`}
            >
              <span className="flex w-full items-center justify-between"><UserRound className="w-5 h-5" /><ArrowUpRight className="w-4 h-4 opacity-60" /></span>
              {t('nav.portal')}
            </NavLink>
            {s.market_enabled && (
              <NavLink to="/market" onClick={close} className={`${tile} bg-sun text-ink shadow-sticker`}>
                <span className="flex w-full items-center justify-between"><ShoppingBag className="w-5 h-5" /><ArrowUpRight className="w-4 h-4 opacity-60" /></span>
                {t('nav.market')}
              </NavLink>
            )}
          </motion.div>

          {/* Ana bağlantılar — ikonlu tam satırlar */}
          <motion.div {...fade(3)}>
            {sectionLabel(t('menu.sections'))}
            <div className="flex flex-col gap-1">
              {MAIN.map((l) => (
                <NavLink key={l.href} to={l.href} onClick={close} className={linkCls}>
                  <span className={`grid place-items-center w-8 h-8 rounded-lg shrink-0 ${l.chip}`}><l.icon className="w-4 h-4" /></span>
                  <span className="truncate text-base font-semibold">{t(l.label)}</span>
                </NavLink>
              ))}
            </div>
          </motion.div>

          {/* Sektörler — renkli noktalı çipler */}
          <motion.div {...fade(4)}>
            {sectionLabel(t('menu.sectors'))}
            <div className="grid grid-cols-2 gap-1.5">
              {sectors.map((sec, i) => (
                <NavLink key={sec.slug} to={`/sektor/${sec.slug}`} onClick={close} className="flex items-center gap-2 h-11 rounded-xl px-3 text-sm font-medium border border-border bg-secondary/30 text-foreground/85 hover:bg-foreground/5 active:bg-foreground/10 transition-colors">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${SECTOR_DOTS[i % SECTOR_DOTS.length]}`} />
                  <span className="truncate">{sec.name}</span>
                </NavLink>
              ))}
            </div>
          </motion.div>

          {/* Keşfet — ikonlu çipler */}
          <motion.div {...fade(5)}>
            {sectionLabel(t('menu.explore'))}
            <div className="grid grid-cols-2 gap-1.5">
              {EXPLORE.map((l) => (
                <NavLink key={l.href} to={l.href} onClick={close} className={({ isActive }) => chipLink({ isActive }, 'bg-mint/10 text-mint')}>
                  <l.icon className="w-4 h-4 shrink-0 opacity-80" />
                  <span className="truncate">{t(l.label)}</span>
                </NavLink>
              ))}
            </div>
          </motion.div>
        </nav>
        <div className="px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-border flex items-center gap-2">
          <LangToggle className="inline-flex items-center gap-1.5 h-11 px-4 rounded-full border border-border bg-secondary/40 font-mono text-xs font-bold hover:border-mint/50 hover:text-mint active:scale-95 transition-all" />
          <a href={WA_URL} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-border bg-secondary/40 text-mint active:scale-95 transition-transform">
            <MessageCircle className="w-5 h-5" />
          </a>
          <a href={TEL_URL} aria-label={CONTACT.phoneDisplay} className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-full border border-mint/40 bg-mint/10 text-mint text-sm font-bold active:scale-95 transition-transform">
            <Phone className="w-4 h-4 shrink-0" /> <span className="truncate text-xs">{CONTACT.phoneDisplay}</span>
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}