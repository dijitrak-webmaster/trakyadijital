import React, { useState } from 'react';
import { Link2, Check, MessageCircle, Twitter, Linkedin, Facebook } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const channels = [
  { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, href: (u, t) => `https://wa.me/?text=${encodeURIComponent(`${t} — ${u}`)}` },
  { key: 'x', label: 'X', icon: Twitter, href: (u, t) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}` },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, href: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}` },
  { key: 'facebook', label: 'Facebook', icon: Facebook, href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
];

/**
 * İçerik paylaşım butonları: WhatsApp, X, LinkedIn, Facebook + link kopyala.
 * compact modda yalnızca ikonlar gösterilir (kart içi kullanım).
 */
export default function ShareButtons({ title, url, compact = false, className = '' }) {
  const { tl } = useLanguage();
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || '';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* pano izni yok — sessizce geç */ }
  };

  const size = compact ? 'w-8 h-8' : 'w-10 h-10';

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {!compact && (
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground mr-1">{tl('Paylaş')}</span>
      )}
      {channels.map((c) => (
        <a
          key={c.key}
          href={c.href(shareUrl, shareTitle)}
          target="_blank"
          rel="noreferrer"
          aria-label={`${tl('Paylaş')}: ${c.label}`}
          title={c.label}
          className={`${size} rounded-full bg-secondary border border-border flex items-center justify-center text-foreground/80 hover:bg-mint hover:text-ink hover:border-mint transition-colors`}
        >
          <c.icon className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        </a>
      ))}
      <button
        onClick={copy}
        aria-label={tl('Linki kopyala')}
        title={copied ? tl('Kopyalandı') : tl('Linki kopyala')}
        className={`${size} rounded-full bg-secondary border border-border flex items-center justify-center text-foreground/80 hover:bg-mint hover:text-ink hover:border-mint transition-colors`}
      >
        {copied ? <Check className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} /> : <Link2 className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      </button>
    </div>
  );
}