import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { askOpenAIJson } from '../../shared/openai.ts';

// Admin: blog yazısı için AI taslağı üretir (kısa özet + gövde).
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const title = String(body.title || '').slice(0, 90);
    const category = String(body.category || 'Rehber').slice(0, 30);
    if (title.trim().length < 5) return Response.json({ error: 'title is required' }, { status: 400 });

    const out = await askOpenAIJson({
      user: [
        'Sen Dijitrak blogunun yazarisin. Dijitrak, Trakya bolgesindeki kobi ve yerel isletmelere web tasarimi, e-ticaret, SEO ve dijital donusum sunan bir ajans.',
        `GOREV: "${title}" basliginda${category ? ` "${category}" kategorisinde` : ''} bir blog yazisi taslagi yaz.`,
        'Kurallar: Turkce yaz. 6-8 paragraf; paragraflari bos satirla ayir. Sadece govde metnini yaz, baslik ekleme. Pratik, somut ve harekete gecirici olsun; Trakya isletmelerinden ornekler kur. Fiyat soz verme. Emoji ve markdown kullanma.',
        'JSON ciktisi: {"excerpt": "kisa ozet", "content": "govde metni"}.',
      ].join('\n'),
      max_tokens: 2000,
    });
    return Response.json({ excerpt: String(out.excerpt || '').slice(0, 400), content: String(out.content || '').slice(0, 6000) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}