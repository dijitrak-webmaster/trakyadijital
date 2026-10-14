import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, CalendarClock, Download, MessageCircle, PhoneCall } from 'lucide-react';
import { downloadPackagePdf } from '@/lib/quotePdf';
import { base44 } from '@/api/base44Client';
import { CONTACT } from '@/lib/contact';
import { useLanguage } from '@/lib/LanguageContext';

/** DijiBot'un sohbete göre kurduğu özel paketin sohbet içi vitrin kartı. */
export default function PackageCard({ pkg, customer, onBook }) {
  const { lang } = useLanguage();
  const tr = lang !== 'en';

  const waText = encodeURIComponent(
    tr
      ? `Merhaba! DijiBot ile konuşuyordum, ${pkg.name} paketi hakkında bilgi almak istiyorum.`
      : `Hello! I was chatting with DijiBot and I'd like info about the ${pkg.name} package.`
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="mt-2.5 rounded-2xl border-2 border-mint/50 bg-card overflow-hidden text-left"
    >
      {/* üst şerit: paket adı + süre rozeti */}
      <div className="flex items-center gap-2 bg-mint/10 border-b-2 border-mint/40 px-4 py-3">
        <Sparkles className="w-4 h-4 shrink-0 text-mint" />
        <span className="font-display font-semibold text-sm text-foreground leading-tight min-w-0 truncate">{pkg.name}</span>
        {pkg.duration && (
          <span className="ml-auto shrink-0 inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            <CalendarClock className="w-3 h-3" /> {pkg.duration}
          </span>
        )}
      </div>

      {/* içerik listesi */}
      <ul className="px-4 py-3 space-y-1.5">
        <li className="flex items-start gap-2 text-sm">
          <Check className="w-4 h-4 text-mint shrink-0 mt-0.5" />
          <span><span className="font-semibold">{pkg.base}</span> <span className="text-muted-foreground">{tr ? '— ana hizmet' : '— core service'}</span></span>
        </li>
        {(pkg.addons || []).map((a) => (
          <li key={a.title} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-mint shrink-0 mt-0.5" />
            <span>
              {a.title}
              {a.monthly && <span className="text-muted-foreground text-xs"> {tr ? '(aylık)' : '(monthly)'}</span>}
            </span>
          </li>
        ))}
      </ul>

      {/* fiyat bloğu */}
      {(pkg.priceOne || pkg.priceMonthly) && (
        <div className="mx-4 mb-3 rounded-xl border-2 border-sun/40 bg-sun/10 px-4 py-3 flex items-end justify-between gap-3">
          {pkg.priceOne && (
            <div className="min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{tr ? 'Tek seferlik' : 'One-time'}</div>
              <div className="font-display font-bold text-lg text-sun leading-tight truncate">{pkg.priceOne}</div>
            </div>
          )}
          {pkg.priceMonthly && (
            <div className="min-w-0 text-right">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{tr ? 'Aylık' : 'Monthly'}</div>
              <div className="font-display font-bold text-sm text-coral leading-tight truncate">{pkg.priceMonthly}</div>
            </div>
          )}
        </div>
      )}

      {pkg.pitch && <p className="mx-4 mb-2 text-xs font-medium text-mint">{pkg.pitch}</p>}
      {pkg.note && <p className="mx-4 mb-2 text-xs text-muted-foreground">{pkg.note}</p>}
      {pkg.includes && (
        <p className="mx-4 mb-3 text-[11px] text-mint/85">{tr ? 'Pakete dahil: ' : 'Included: '}{pkg.includes.join(' · ')}</p>
      )}

      {/* dönüş adımları: PDF + WhatsApp + keşif */}
      <div className="border-t border-border bg-secondary/40 px-4 py-3 grid gap-2">
        <button
          onClick={() => { base44.analytics.track({ eventName: 'package_pdf_download', properties: { package: pkg.name } }); downloadPackagePdf(pkg, { name: customer }); }}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink/20 bg-mint text-ink font-semibold px-4 py-2.5 text-xs shadow-sticker hover:-translate-y-0.5 active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5" /> {tr ? 'Teklifi PDF olarak indir' : 'Download quote as PDF'}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`https://wa.me/${CONTACT.whatsapp}?text=${waText}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => base44.analytics.track({ eventName: 'package_whatsapp_click', properties: { package: pkg.name } })}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-border bg-card text-foreground font-semibold px-3 py-2 text-xs hover:border-mint hover:text-mint transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-mint" /> {tr ? 'WhatsApp’tan yaz' : 'WhatsApp us'}
          </a>
          <button
            onClick={() => onBook?.()}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-border bg-card text-foreground font-semibold px-3 py-2 text-xs hover:border-sun hover:text-sun transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-sun" /> {tr ? 'Ücretsiz keşif' : 'Free consult'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}