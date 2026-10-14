import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import CommentForm from '@/components/blog/CommentForm';

const fmtDate = (d) => new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });

/** Yazıya ait onaylı yorumları listeler ve yorum formunu gösterir. */
export default function BlogComments({ slug }) {
  const { tl } = useLanguage();
  const [comments, setComments] = useState(null);

  const load = () => base44.entities.BlogComment.filter({ blog_slug: slug, status: 'approved' }, 'created_date', 100).then(setComments).catch(() => setComments([]));
  useEffect(() => { load(); }, [slug]);

  return (
    <section className="mt-16" id="yorumlar">
      <h3 className="font-display text-2xl font-semibold flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-mint" /> {tl('Yorumlar')} {comments ? `(${comments.length})` : ''}
      </h3>

      <div className="mt-6 space-y-4">
        {comments === null && <div className="h-16 rounded-3xl bg-secondary animate-pulse" />}
        {comments?.length === 0 && (
          <p className="border-2 border-dashed border-border rounded-3xl p-8 text-center font-mono text-sm text-muted-foreground">
            {tl('İlk yorumu siz yazın.')}
          </p>
        )}
        {comments?.map((c) => (
          <div key={c.id} className="flex gap-4 rounded-3xl border border-border bg-card p-5">
            <span className="w-9 h-9 rounded-full bg-mint/15 text-mint font-display font-semibold grid place-items-center shrink-0">
              {(c.author_name || '?').charAt(0).toLocaleUpperCase('tr')}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold flex flex-wrap items-baseline gap-2">
                {c.author_name} <span className="font-mono text-[10px] text-muted-foreground">{fmtDate(c.created_date)}</span>
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed mt-1 whitespace-pre-line">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <CommentForm slug={slug} />
      </div>
    </section>
  );
}