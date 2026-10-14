import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Briefcase, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/LanguageContext';
import { parseTags, readMinutes } from '@/lib/blogUtils';

// Türkçe karakterleri sadeleştirip küçük harfe çevirir — eşleştirme için
const TR_MAP = { İ: 'i', ı: 'i', Ş: 's', ş: 's', Ğ: 'g', ğ: 'g', Ü: 'u', ü: 'u', Ö: 'o', ö: 'o', Ç: 'c', ç: 'c' };
const norm = (s = '') =>
  String(s || '')
    .replace(/[İıŞşĞğÜüÖöÇç]/g, (c) => TR_MAP[c])
    .toLocaleLowerCase('tr')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

// Hizmet slug + başlığından anahtar kelimeler üretir
const serviceTokens = (service) =>
  [...new Set([...norm(service.slug).split(' '), ...norm(service.title).split(' ')].filter((t) => t.length >= 3))];

// Öğenin metninde geçen anahtar kelime sayısı = ilgi puanı
const score = (tokens, text) => {
  const t = norm(text);
  return tokens.reduce((acc, token) => acc + (t.includes(token) ? 1 : 0), 0);
};

const pick = (items, tokens, count) =>
  items
    .map((item) => [item, score(tokens, item.text)])
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([item]) => item);

export default function RelatedContent({ service }) {
  const { tl } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [ready, setReady] = useState(false);
  const tokens = useMemo(() => serviceTokens(service), [service.slug, service.title]);

  useEffect(() => {
    let alive = true;
    Promise.all([
      base44.entities.BlogPost.filter({ status: 'published' }, '-created_date', 50),
      base44.entities.PortfolioProject.filter({ status: 'published' }, '-created_date', 50),
    ]).then(([blog, portfolio]) => {
      if (!alive) return;
      setPosts(
        pick(
          blog.map((p) => ({ ...p, text: `${p.title} ${p.tags || ''} ${p.category || ''} ${p.slug}` })),
          tokens,
          3,
        ),
      );
      setProjects(
        pick(
          portfolio.map((p) => ({ ...p, text: `${p.title} ${p.sector || ''} ${p.summary || ''} ${p.result || ''}` })),
          tokens,
          3,
        ),
      );
      setReady(true);
    });
    return () => { alive = false; };
  }, [tokens]);

  if (!ready || (posts.length === 0 && projects.length === 0)) return null;

  return (
    <section className="mt-16 space-y-8">
      {posts.length > 0 && (
        <div>
          <h3 className="font-display text-xl font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-mint" /> {tl('İlgili yazılar')}
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            {posts.map((p) => (
              <Link
                key={p.id}
                to={`/blog/${p.slug}`}
                className="group flex flex-col justify-between bg-card border border-border rounded-2xl p-5 hover:border-mint/50 transition-colors"
              >
                <div>
                  {parseTags(p.tags)[0] && (
                    <span className="font-mono text-[10px] uppercase text-mint">#{tl(parseTags(p.tags)[0])}</span>
                  )}
                  <p className="font-semibold text-sm leading-snug mt-2 group-hover:text-mint transition-colors">{tl(p.title)}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground mt-4">
                  <Clock className="w-3 h-3" /> {readMinutes(p.content)} {tl('dk okuma')} <ArrowRight className="w-3 h-3 ml-auto text-mint" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div>
          <h3 className="font-display text-xl font-semibold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-mint" /> {tl('İlgili projeler')}
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            {projects.map((p) => (
              <Link
                key={p.id}
                to="/portfolyo"
                className="group bg-card border border-border rounded-2xl p-5 hover:border-mint/50 transition-colors"
              >
                <span className="font-mono text-[10px] uppercase text-mint">{tl(p.sector || 'Proje')}</span>
                <p className="font-semibold text-sm leading-snug mt-2 group-hover:text-mint transition-colors">{tl(p.title)}</p>
                {p.result && <p className="text-xs text-foreground/70 mt-2">{tl(p.result)}</p>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}