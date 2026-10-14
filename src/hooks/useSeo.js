import { useEffect } from 'react';

// Türkçe karakterleri URL'e uygun kimliğe çevirir (## başlıklar için TOC bağlantısı)
const TR_MAP = { İ: 'i', ı: 'i', Ş: 's', ş: 's', Ğ: 'g', ğ: 'g', Ü: 'u', ü: 'u', Ö: 'o', ö: 'o', Ç: 'c', ç: 'c' };
export const anchorId = (s) =>
  (s || '')
    .replace(/[İıŞşĞğÜüÖöÇç]/g, (c) => TR_MAP[c])
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/**
 * Sayfa bazlı SEO: document.title, meta description, OpenGraph/Twitter etiketleri,
 * canonical bağlantı ve JSON-LD şemalarını ayarlar; sayfadan ayrılınca eski haline döndürür.
 */
export default function useSeo(seo) {
  const key = JSON.stringify(seo || {});
  useEffect(() => {
    const { title, description, image, path, jsonLd } = seo || {};
    const prevTitle = document.title;
    if (title) document.title = title;

    const originals = new Map();
    const setMeta = (selector, attr, name, value) => {
      if (!value) return;
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      if (!originals.has(selector)) originals.set(selector, el.getAttribute('content'));
      el.setAttribute('content', value);
    };
    const setLink = (selector, rel, href) => {
      if (!href) return;
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      if (!originals.has(selector)) originals.set(selector, el.getAttribute('href'));
      el.setAttribute('href', href);
    };

    const url = path ? `${window.location.origin}${path}` : null;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    if (image) {
      setMeta('meta[property="og:image"]', 'property', 'og:image', image);
      setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);
    }
    setLink('link[rel="canonical"]', 'canonical', url);

    const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd.filter(Boolean) : [jsonLd]) : [];
    const scripts = schemas.map((schema) => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-page-seo', 'true');
      s.textContent = JSON.stringify(schema);
      document.head.appendChild(s);
      return s;
    });

    return () => {
      document.title = prevTitle;
      originals.forEach((content, selector) => {
        const el = document.head.querySelector(selector);
        if (!el) return;
        if (content === null) el.remove();
        else el.setAttribute('content', content);
      });
      scripts.forEach((s) => s.remove());
    };
  }, [key]);
}