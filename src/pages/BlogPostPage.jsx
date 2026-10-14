import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronRight, Clock, ListTree, User } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { motion } from 'framer-motion';
import { useAssistant } from '@/lib/AssistantContext';
import { useLanguage } from '@/lib/LanguageContext';
import useSeo, { anchorId } from '@/hooks/useSeo';
import BlogCard from '@/components/blog/BlogCard';
import BlogComments from '@/components/blog/BlogComments';
import ShareButtons from '@/components/site/ShareButtons';

const fmtDate = (d) => new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

export default function BlogPostPage() {
  const { slug } = useParams();
  const { openAssistant } = useAssistant();
  const { tl } = useLanguage();
  const [post, setPost] = useState(undefined);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    setPost(undefined);
    setRelated([]);
    base44.entities.BlogPost.filter({ slug, status: 'published' }).then((r) => {
      const p = r[0] || null;
      setPost(p);
      // SEO iç bağlantı ağı: aynı kategori/etiket paylaşan yazılar "ilgili yazılar" olarak önerilir
      if (p) {
        base44.entities.BlogPost.filter({ status: 'published' }, '-created_date', 20).then((all) => {
          const others = all.filter((x) => x.id !== p.id);
          const tags = (p.tags || '').split(',').map((t) => t.trim()).filter(Boolean);
          const score = (x) =>
            (x.category === p.category ? 2 : 0) +
            ((x.tags || '').split(',').some((t) => tags.includes(t.trim())) ? 1 : 0);
          const rel = others
            .map((x) => [x, score(x)])
            .filter(([, sc]) => sc > 0)
            .sort((a, b) => b[1] - a[1])
            .map(([x]) => x);
          setRelated((rel.length ? rel : others).slice(0, 3));
        });
      }
    });
  }, [slug]);

  const blocks = post ? (post.content || '').split('\n').filter((t) => t.trim()) : [];
  const headings = blocks.filter((t) => t.startsWith('## ')).map((t) => t.slice(3).trim());
  const readMin = Math.max(1, Math.round(blocks.join(' ').replace(/##/g, '').split(/\s+/).filter(Boolean).length / 200));
  const tags = post ? (post.tags || '').split(',').map((t) => t.trim()).filter(Boolean) : [];

  useSeo(post && {
    title: post.meta_title || `${post.title} — Dijitrak Blog`,
    description: post.meta_description || post.excerpt || '',
    image: post.image_url || null,
    path: `/blog/${post.slug}`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.meta_description || post.excerpt || '',
        image: post.image_url ? [post.image_url] : undefined,
        datePublished: post.created_date,
        author: post.author ? { '@type': 'Person', name: post.author } : { '@type': 'Organization', name: 'Dijitrak' },
        publisher: { '@type': 'Organization', name: 'Dijitrak' },
        mainEntityOfPage: `${window.location.origin}/blog/${post.slug}`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Blog', item: `${window.location.origin}/blog` },
          { '@type': 'ListItem', position: 2, name: post.category || 'Rehber' },
          { '@type': 'ListItem', position: 3, name: post.title },
        ],
      },
    ],
  });

  if (post === undefined) {
    return (
      <div className="pt-40 pb-24 max-w-3xl mx-auto px-6 animate-pulse">
        <div className="h-3 w-24 rounded bg-secondary" />
        <div className="h-64 md:h-80 rounded-[2rem] bg-secondary mt-8" />
        <div className="h-9 w-full rounded bg-secondary mt-8" />
        <div className="h-9 w-2/3 rounded bg-secondary mt-3" />
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="pt-40 pb-24 max-w-3xl mx-auto px-6 text-center">
        <h1 className="font-display text-4xl font-semibold">{tl('Yazı bulunamadı')}</h1>
        <Link to="/blog" className="inline-block mt-6 rounded-full bg-mint text-ink font-semibold px-6 py-3">{tl('Tüm yazılar')}</Link>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="pt-32 md:pt-36 pb-24 max-w-3xl mx-auto px-5 md:px-6"
    >
      <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-muted-foreground">
        <Link to="/blog" className="inline-flex items-center gap-1.5 hover:text-mint transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> {tl('Blog')}
        </Link>
        <ChevronRight className="w-3 h-3 opacity-50" />
        <span>{tl(post.category || 'Rehber')}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-3 font-mono text-xs mt-8">
        <span className="rounded-full bg-mint/15 text-mint px-3 py-1">{tl(post.category || 'Rehber')}</span>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <User className="w-3 h-3" /> {post.author || 'Dijitrak'}
        </span>
        <span className="text-muted-foreground">{fmtDate(post.created_date)}</span>
        <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="w-3 h-3" /> {readMin} {tl('dk okuma')}</span>
      </div>

      <h1 className="font-display text-4xl md:text-6xl font-semibold leading-tight mt-4 tracking-tight">{post.title}</h1>

      {post.image_url ? (
        <div className="mt-8 rounded-[2rem] overflow-hidden">
          <Image src={post.image_url} className="w-full h-72 md:h-96" />
        </div>
      ) : (
        <div className={`h-1.5 rounded-full ${post.color || 'bg-mint'} mt-8`} />
      )}

      {post.excerpt && <p className="text-xl text-foreground/75 leading-relaxed mt-10">{post.excerpt}</p>}

      {/* içindekiler: "## " başlıklarından otomatik üretilir */}
      {headings.length > 1 && (
        <div className="border border-border rounded-2xl p-5 mt-8 bg-card/50">
          <p className="inline-flex items-center gap-2 font-mono text-xs uppercase text-mint"><ListTree className="w-3.5 h-3.5" /> {tl('İçindekiler')}</p>
          <ol className="mt-3 space-y-1.5 list-decimal list-inside text-sm">
            {headings.map((h) => (
              <li key={h}>
                <a href={`#${anchorId(h)}`} className="hover:text-mint transition-colors">{h}</a>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="space-y-6 mt-8">
        {blocks.map((para, i) =>
          para.startsWith('## ') ? (
            <h2 key={i} id={anchorId(para.slice(3).trim())} className="font-display text-2xl md:text-3xl font-semibold mt-12 mb-1 scroll-mt-28">
              {para.slice(3).trim()}
            </h2>
          ) : (
            <p key={i} className="text-lg text-foreground/85 leading-8">{para}</p>
          )
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10">
          {tags.map((t) => (
            <span key={t} className="rounded-full border border-border bg-card px-3.5 py-1.5 font-mono text-xs text-foreground/75">#{t}</span>
          ))}
        </div>
      )}

      <ShareButtons title={post.title} className="mt-6" />

      <div className="bg-card border border-border rounded-[2rem] p-8 md:p-10 mt-16 text-center">
        <h3 className="font-display text-2xl md:text-3xl font-semibold">{tl('Projeniz için hazır mısınız?')}</h3>
        <p className="text-sm text-foreground/70 mt-2">{tl('Ücretsiz keşif görüşmesiyle başlayalım; 24 saat içinde dönüş yapıyoruz.')}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={() => openAssistant({ intent: 'quote' })} className="rounded-full bg-mint text-ink font-semibold px-8 py-3 hover:-translate-y-0.5 hover:shadow-sticker transition-all">
            {tl('Bu konu için 30 saniyede fiyat')}
          </button>
          <button onClick={() => openAssistant({ intent: 'appointment' })} className="rounded-full border border-mint/50 text-mint font-semibold px-8 py-3 hover:-translate-y-0.5 transition-all">
            {tl('Randevu Al')}
          </button>
        </div>
      </div>

      <BlogComments slug={post.slug} />

      {related.length > 0 && (
        <section className="mt-16">
          <h3 className="font-display text-2xl font-semibold flex items-center gap-2">
            {tl('İlgili yazılar')} <ArrowRight className="w-5 h-5 text-mint" />
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {related.map((p) => <BlogCard key={p.id} post={p} />)}
        </div>
        </section>
      )}
    </motion.article>
  );
}