import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import BlogFeatured from '@/components/blog/BlogFeatured';
import BlogCard from '@/components/blog/BlogCard';
import NewsletterSignup from '@/components/blog/NewsletterSignup';
import { parseTags } from '@/lib/blogUtils';
import Reveal from '@/components/site/Reveal';
import { useLanguage } from '@/lib/LanguageContext';
import useSeo from '@/hooks/useSeo';

export default function Blog() {
  const { tl } = useLanguage();
  const [posts, setPosts] = useState(null);
  const [cat, setCat] = useState('Tümü');
  const [tag, setTag] = useState(null);
  const [query, setQuery] = useState('');

  useSeo({
    title: 'Blog — Rehberler & Duyurular | Dijitrak',
    description: "Trakya'daki işletmeler için web tasarımı, e-ticaret ve SEO rehberleri; uygulanabilir ipuçları ve yol haritaları.",
    path: '/blog',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Dijitrak Blog',
      description: "Trakya'daki işletmeler için dijital büyüme rehberleri.",
      url: `${window.location.origin}/blog`,
    },
  });

  useEffect(() => {
    base44.entities.BlogPost.filter({ status: 'published' }, '-created_date', 50).then(setPosts);
  }, []);

  const cats = posts ? ['Tümü', ...new Set(posts.map((p) => p.category || 'Rehber'))] : [];
  // kategori + etiket + arama birleşik filtresi — posts yüklenene dek list boş dizi olmalı
  const list = posts
    ? posts.filter((p) => {
        const inCat = cat === 'Tümü' || (p.category || 'Rehber') === cat;
        const inTag = !tag || parseTags(p.tags).includes(tag);
        const q = query.trim().toLocaleLowerCase('tr');
        const inQuery = !q || `${p.title} ${p.excerpt || ''} ${p.tags || ''}`.toLocaleLowerCase('tr').includes(q);
        return inCat && inTag && inQuery;
      })
    : [];
  const filtering = Boolean(tag) || query.trim().length > 0;
  const featured = !filtering && cat === 'Tümü' && list.length > 1 ? list[0] : null;
  const rest = featured ? list.slice(1) : list;

  return (
    <div className="pt-36 md:pt-44 pb-24 max-w-6xl mx-auto px-5 md:px-6">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <span className="inline-block rounded-full border border-mint/40 bg-mint/10 text-mint font-mono text-xs px-4 py-1.5">{tl('BLOG')}</span>
        <h1 className="font-display text-4xl md:text-6xl font-semibold mt-4 tracking-tight">{tl('Rehberler & Duyurular')}</h1>
        <p className="text-foreground/70 mt-4 max-w-2xl text-lg">{tl("Dijitalde büyümenin yol haritaları; Trakya'daki işletmeler için uygulanabilir ipuçları.")}</p>
      </motion.div>

      {posts && (
        <div className="relative mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tl('Yazı ara…')}
            className="w-full rounded-full border border-border bg-card pl-11 pr-10 py-3 text-sm outline-none focus:border-mint/60"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-mint"
              aria-label={tl('Aramayı temizle')}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {tag && (
        <div className="flex items-center gap-2 mt-4">
          <span className="rounded-full bg-mint/15 text-mint px-3.5 py-1.5 font-mono text-xs font-semibold inline-flex items-center gap-1.5">
            #{tl(tag)}
            <button onClick={() => setTag(null)} className="hover:text-ink" aria-label={tl('Etiketi kaldır')}>
              <X className="w-3 h-3" />
            </button>
          </span>
        </div>
      )}

      {posts && cats.length > 2 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${cat === c ? 'bg-mint text-ink border-mint' : 'border-border bg-card text-foreground/75 hover:border-mint/60 hover:text-mint'}`}
            >
              {tl(c)}
            </button>
          ))}
        </div>
      )}

      {posts === null && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-3xl bg-card border border-border overflow-hidden animate-pulse">
              <div className="h-48 bg-secondary" />
              <div className="p-6 space-y-3">
                <div className="h-3 w-20 rounded bg-secondary" />
                <div className="h-5 w-full rounded bg-secondary" />
                <div className="h-5 w-2/3 rounded bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      )}

      {posts !== null && posts.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-3xl p-14 text-center font-mono text-sm text-muted-foreground mt-10">
          {tl('Yakında burada rehberler yayınlamaya başlayacağız.')}
        </div>
      )}

      {posts !== null && posts.length > 0 && list.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-3xl p-14 text-center font-mono text-sm text-muted-foreground mt-10">
          {tl('Aramanıza uygun yazı bulunamadı.')}
        </div>
      )}

      {featured && (
        <Reveal className="mt-10">
          <BlogFeatured post={featured} />
        </Reveal>
      )}

      {rest.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {rest.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06} className="h-full">
              <BlogCard post={p} onTag={setTag} />
            </Reveal>
          ))}
        </div>
      )}

      <NewsletterSignup />
    </div>
  );
}