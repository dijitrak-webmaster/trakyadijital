import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { DIJIBOT_PERSONA } from '../../shared/dijibotPrompt.ts';
import { askOpenAIJson } from '../../shared/openai.ts';

// DijiBot'un sohbete gore kurdugu paketin "neden size uygun" notunu ve
// tanitim cumlesini yapay zeka ile kisisellestirir. Fiyat bilgisi uretmez.
export default async function(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const service = String(body.service || '').slice(0, 60);
    const sector = String(body.sector || '').slice(0, 40);
    const message = String(body.message || '').slice(0, 300);
    const lines = (Array.isArray(body.lines) ? body.lines : []).slice(0, 8).map((l) => String(l).slice(0, 80));
    if (!service) return Response.json({ error: 'service is required' }, { status: 400 });

    const out = await askOpenAIJson({
      system: DIJIBOT_PERSONA,
      user: [
        `GOREV: ${sector || 'musteri'} sektorundeki bir musterimize ozel paket hazirladin.`,
        `Ana hizmet: ${service}.`,
        `Paket kalemleri: ${lines.join(', ')}.`,
        message ? `Sohbetten musterinin notlari: "${message}".` : '',
        'JSON ciktisi: {"note": "bu paketin bu musterinin isine nasil denk dustugunu anlatan 1-2 cumle", "pitch": "paketi tanitan tek cumlelik neşeli tanitim"}. Fiyat ve teslim suresi belirtme.',
      ].filter(Boolean).join('\n'),
    });
    return Response.json({ note: String(out.note || ''), pitch: String(out.pitch || '') });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}