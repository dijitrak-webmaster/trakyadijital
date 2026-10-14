import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Send, Youtube, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { CONTACT } from '@/lib/contact';
import { LogoMark } from '@/components/site/Logo';

const socials = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Send, href: 'https://telegram.org', label: 'Telegram' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
];

export default function Footer() {
  const { t } = useLanguage();
  const waUrl = `https://wa.me/${CONTACT.whatsapp}`;
  return (
    <footer id="iletisim" className="border-t border-border">
      <div className="max-w-6xl mx-auto px-5 md:px-6 pt-12">
        <div className="flex items-center gap-3.5 pb-8 border-b border-border">
          <LogoMark className="w-12 h-12" />
          <span className="font-display font-bold leading-none tracking-tight text-2xl">
            DİJİ<span className="text-mint">TRAK</span>
            <span className="block text-[10px] font-mono font-medium tracking-[0.28em] text-foreground/45 mt-1.5">
              TRAKYA'NIN DİJİTAL ATÖLYESİ
            </span>
          </span>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-5 md:px-6 py-10 grid gap-10 sm:grid-cols-3">
        <div>
          <h4 className="font-display font-semibold text-xl mb-4">{t('footer.contact')}</h4>
          <a href="tel:+905542030473" className="flex items-center gap-2 text-sm text-foreground/80 hover:text-mint"><Phone className="w-4 h-4" /> +90 554 203 04 73</a>
          <a href="mailto:merhaba@dijitrak.com" className="mt-2 flex items-center gap-2 text-sm text-foreground/80 hover:text-mint"><Mail className="w-4 h-4" /> merhaba@dijitrak.com</a>
          <a href={waUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-full bg-mint/15 border border-mint/50 px-4 py-1.5 text-xs font-semibold text-mint hover:bg-mint hover:text-ink transition-colors">
            <MessageCircle className="w-4 h-4" /> DijiBot'u WhatsApp'a Bağla
          </a>
        </div>
        <div>
          <h4 className="font-display font-semibold text-xl mb-4">{t('footer.address')}</h4>
          <a href="https://maps.google.com/?q=Tekirdağ" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-foreground/80 hover:text-mint"><MapPin className="w-4 h-4" /> Tekirdağ, Türkiye</a>
        </div>
        <div className="sm:text-right">
          <h4 className="font-display font-semibold text-xl mb-4">{t('footer.social')}</h4>
          <div className="flex gap-3 sm:justify-end">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-mint hover:text-ink transition-colors">
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-5 md:px-6 pb-10">
        <h4 className="font-display font-semibold text-xl mb-4">Hizmet Bölgeleri</h4>
        <div className="flex flex-wrap gap-2">
          <Link to="/dijital-harita" className="rounded-full bg-mint/15 border border-mint/50 px-4 py-1.5 text-xs font-semibold text-mint hover:bg-mint hover:text-ink transition-colors">Dijital Harita</Link>
          {['edirne', 'tekirdag', 'kirklareli', 'corlu', 'luleburgaz', 'kesan', 'uzunkopru', 'malkara', 'cerkezkoy', 'ipsala'].map((slug) => (
            <Link key={slug} to={`/konum/${slug}`} className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground/70 hover:border-mint hover:text-mint transition-colors">
              {slug === 'corlu' ? 'Çorlu' : slug === 'kirklareli' ? 'Kırklareli' : slug === 'tekirdag' ? 'Tekirdağ' : slug === 'uzunkopru' ? 'Uzunköprü' : slug.charAt(0).toUpperCase() + slug.slice(1)}
            </Link>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-5 md:px-6 pb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-foreground/50 font-mono">
        <span className="flex items-center gap-1.5"><LogoMark className="w-4 h-4" /> © 2026 Dijitrak</span>
        <Link to="/hakkimizda" className="hover:text-mint">{t('nav.about')}</Link>
        <Link to="/gizlilik" className="hover:text-mint">{t('footer.privacy')}</Link>
        <Link to="/kullanim-sartlari" className="hover:text-mint">{t('footer.terms')}</Link>
        <Link to="/admin" className="ml-auto hover:text-mint">{t('footer.admin')}</Link>
      </div>
      <div className="h-3 bg-mint" />
    </footer>
  );
}