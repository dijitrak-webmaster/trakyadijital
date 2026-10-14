import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useLanguage } from '@/lib/LanguageContext';
import { readMinutes, parseTags } from '@/lib/blogUtils';

const fmtDate = (d) => new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

export default function BlogCard({ post, onTag }) {
  const { tl } = useLanguage();
  const tags = parseTags(post.tags);

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col rounded-3xl bg-card border border-border overflow-hidden hover:border-mint/50 hover:-translate-y-1 hover:shadow-sticker transition-all"
    >
      <div className="h-48 overflow-hidden">
        {post.image_url ? (
          <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
            <Image src={post.image_url} className="w-full h-full" />
          </div>
        ) : (
          <div className={`${post.color || 'bg-mint'} w-full h-full`} />
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
          <span className="text-mint">{post.category || 'Rehber'}</span>
          <span className="text-muted-foreground">· {fmtDate(post.created_date)}</span>
          {post.author && <span className="text-muted-foreground">· {post.author}</span>}
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" /> {readMinutes(post.content)} {tl('dk okuma')}
          </span>
        </div>
        <h3 className="font-display font-semibold text-xl leading-snug mt-2.5">{post.title}</h3>
        {post.excerpt && <p className="text-sm text-foreground/70 leading-relaxed mt-2.5 flex-1">{post.excerpt}</p>}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {tags.slice(0, 3).map((t) => (
              <span
                key={t}
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTag?.(t);
                }}
                className="rounded-full border border-border bg-secondary/50 px-2.5 py-1 font-mono text-[10px] text-foreground/70 hover:border-mint/60 hover:text-mint transition-colors cursor-pointer"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-mint">
          Oku <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}