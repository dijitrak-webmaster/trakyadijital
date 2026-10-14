import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { askOpenAIJson } from '../../shared/openai.ts';

// Admin: uzun DijiBot sohbetini tek paragraflık özete indirir.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const name = String(body.name || '').slice(0, 60);
    const service = String(body.service || '').slice(0, 60);
    const conversation = String(body.conversation || '').slice(0, 4000);
    if (conversation.trim().length < 20) return Response.json({ error: 'conversation is required' }, { status: 400 });

    const out = await askOpenAIJson({
      user: [
        'Bir dijital ajansin satis ekibi icin DijiBot sohbet kayitlarini ozetliyorsun.',
        `Musteri: ${name || 'bilinmiyor'}${service ? ` · ilgilendigi hizmet: ${service}` : ''}.`,
        'GOREV: Asagidaki sohbet kaydindan 3-4 cumlelik Turkce bir ozet yaz: musterinin istegi, onemli detaylar ve ekibin ilk adimda ne yapmali.',
        'Fiyat uydurma; sadece sohbette gecen bilgileri kullan. Markdown ve emoji kullanma.',
        '',
        'SOHBET:',
        conversation,
        'JSON ciktisi: {"summary": "..."}.',
      ].join('\n'),
    });
    return Response.json({ summary: String(out.summary || '').slice(0, 1200) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}