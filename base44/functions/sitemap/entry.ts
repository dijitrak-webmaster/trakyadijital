import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

const HOST = 'https://trakya-digital-core.base44.app';

const STATIC_ROUTES = [
  ['/', 1.0],
  ['/hizmetler', 0.9],
  ['/hizmet/web-tasarimi', 0.8],
  ['/hizmet/e-ticaret', 0.8],
  ['/hizmet/landing-page', 0.8],
  ['/hizmet/seo', 0.8],
  ['/hizmet/reklam-yonetimi', 0.8],
  ['/hizmet/kurumsal-kimlik', 0.8],
  ['/hizmet/web-uygulama', 0.8],
  ['/blog', 0.8],
  ['/market', 0.7],
  ['/fiyatlandirma', 0.7],
  ['/iletisim', 0.7],
  ['/portfolyo', 0.7],
  ['/yorumlar', 0.6],
  ['/sss', 0.6],
  ['/hakkimizda', 0.6],
  ['/teknoloji', 0.6],
  ['/is-surecleri', 0.6],
  ['/simulasyon', 0.6],
  ['/olgunluk-testi', 0.6],
  ['/rakip-radar', 0.6],
  ['/trakya-endeks', 0.6],
  ['/dijital-harita', 0.6],
  ['/alan-adi-kontrolu', 0.6],
  ['/site-yenileme', 0.6],
  ['/gizlilik', 0.3],
  ['/gizlilik-politikasi', 0.3],
  ['/kullanim-sartlari', 0.3],
];

const SECTORS = ['tarim', 'sanayi', 'yerel-ticaret', 'turizm', 'gida'];
const LOCATIONS = ['edirne', 'tekirdag', 'kirklareli', 'corlu', 'luleburgaz', 'kesan', 'uzunkopru', 'malkara', 'cerkezkoy', 'ipsala'];

const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');

const urlTag = (path, priority, lastmod) =>
  `<url><loc>${HOST}${esc(path)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}<priority>${priority}</priority></url>`;

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);

    const [blogs, items, locations] = await Promise.all([
      base44.asServiceRole.entities.BlogPost.filter({ status: 'published' }),
      base44.asServiceRole.entities.MarketItem.filter({ status: 'published' }),
      base44.asServiceRole.entities.DistrictScore.list(),
    ]);

    const day = (d) => (d ? String(d).slice(0, 10) : undefined);
    const urls = [];

    for (const [path, priority] of STATIC_ROUTES) urls.push(urlTag(path, priority));
    for (const slug of SECTORS) urls.push(urlTag(`/sektor/${slug}`, 0.7));
    for (const loc of locations) urls.push(urlTag(`/konum/${loc.slug}`, 0.6));
    for (const b of blogs) urls.push(urlTag(`/blog/${b.slug}`, 0.7, day(b.updated_date)));
    for (const it of items) urls.push(urlTag(`/market/${it.slug}`, 0.7, day(it.updated_date)));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${urls.join('\n  ')}\n</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}