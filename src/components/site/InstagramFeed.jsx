import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { Instagram } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import Reveal from '@/components/site/Reveal';

/**
 * Ana sayfa canlı Instagram vitrini — bağlantılı hesabın son 8 gönderisi.
 * Bağlantı yoksa veya akış boşsa bölüm hiç render edilmez.
 */
export default function InstagramFeed() {
  const { tl } = useLanguage();
  const [feed, setFeed] = useState(undefined); // undefined: yükleniyor · null: kullanılamıyor

  useEffect(() => {
    base44.functions.invoke('instagramFeed', {})
      .then((res) => setFeed(res.data?.posts?.length ? res.data : null))
      .catch(() => setFeed(null));
  }, []);

  if (!feed) return null;

  return (
    <section id="instagram" className="scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="font-mono text-xs uppercase text-coral flex items-center gap-1.5"><Instagram className="w-3.5 h-3.5" /> {tl('Instagram')}</span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mt-2">{tl('Bizi sosyal medyadan takip edin')}</h2>
        </div>
        <a
          href={`https://instagram.com/${feed.username}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-coral/50 text-coral font-semibold px-5 py-2 text-sm hover:bg-coral hover:text-ink transition-colors"
        >
          @{feed.username}
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
        {feed.posts.slice(0, 8).map((p, i) => (
          <Reveal key={p.id} delay={i * 0.04}>
            <a
              href={p.permalink}
              target="_blank"
              rel="noreferrer"
              className="group relative block rounded-2xl overflow-hidden bg-card border border-border hover:border-coral/60 transition-colors"
            >
              <Image src={p.image} className="w-full aspect-square" />
              {p.caption && (
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-ink/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-foreground/90 line-clamp-2">{p.caption}</p>
                </div>
              )}
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}