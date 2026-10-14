import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useLanguage } from '@/lib/LanguageContext';
import { readMinutes } from '@/lib/blogUtils';

const fmtDate = (d) => new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

export default function BlogFeatured({ post }) {
  const { tl } = useLanguage();
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group grid md:grid-cols-2 rounded-[2rem] bg-card border border-border overflow-hidden hover:border-mint/50 hover:-translate-y-1 hover:shadow-sticker transition-all"
    >
      <div className="relative h-60 sm:h-72 md:h-auto md:min-h-[340px] overflow-hidden">
        {post.image_url ? (
          <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
            <Image src={post.image_url} className="w-full h-full" />
          </div>
        ) : (
          <div className={`${post.color || 'bg-mint'} w-full h-full flex items-center justify-center font-mono text-sm text-ink/50`}>
            DIJITRAK BLOG
          </div>
        )}
      </div>
      <div className="p-8 md:p-10 flex flex-col justify-center">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <span className="rounded-full bg-mint/15 text-mint px-3 py-1">{post.category || 'Rehber'}</span>
          <span className="text-muted-foreground">{fmtDate(post.created_date)}</span>
          <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="w-3 h-3" /> {readMinutes(post.content)} {tl('dk okuma')}</span>
        </div>
        <h2 className="font-display font-semibold text-3xl md:text-4xl leading-tight mt-4">{post.title}</h2>
        <p className="text-foreground/70 leading-relaxed mt-4">{post.excerpt}</p>
        <span className="mt-6 inline-flex items-center gap-2 font-semibold text-mint">
          Yazıyı Oku <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}