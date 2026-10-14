import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// "*.base44.app" gibi joker kaynakları da destekleyerek host eşleşmesi
const matchHost = (token, host) => {
  const t = token.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  if (!host) return false;
  if (t.startsWith('*.')) return host.endsWith(t.slice(1));
  return t === host;
};

/** Market ürününün önizleme linki iframe (önizleme çerçevesi) içinde açılmaya izin veriyor mu? */
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { slug, host } = await req.json();
    if (!slug || typeof slug !== 'string') return Response.json({ error: 'slug gerekli' }, { status: 400 });
    const cleanHost = typeof host === 'string' ? host.toLowerCase().slice(0, 200) : '';

    let [item] = await base44.entities.MarketItem.filter({ slug }, undefined, 1);
    if (!item) item = await base44.entities.MarketItem.get(slug).catch(() => null);
    const url = (item?.preview_url || '').trim();
    if (!/^https?:\/\//i.test(url)) return Response.json({ embeddable: true });

    let res;
    try {
      res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(8000) });
    } catch (_) {
      return Response.json({ embeddable: true });
    }
    const xfo = (res.headers.get('x-frame-options') || '').toLowerCase();
    const csp = (res.headers.get('content-security-policy') || '').toLowerCase();
    await res.body?.cancel();

    const fa = csp.split(';').map((s) => s.trim()).find((s) => s.startsWith('frame-ancestors'));
    let embeddable;
    if (fa) {
      const tokens = fa.split(/\s+/).slice(1);
      embeddable = tokens.some((t) => t === '*' || matchHost(t, cleanHost));
    } else {
      embeddable = !xfo.includes('deny') && !xfo.includes('sameorigin');
    }
    return Response.json({ embeddable });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}