import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { DIJIBOT_PERSONA } from '../../shared/dijibotPrompt.ts';
import { askOpenAIJson } from '../../shared/openai.ts';

// 📎 Ziyaretcinin yukledigi ekran goruntusunu (imzali, gecici URL) dijital ajan
// uzmani gozuyle inceler; 3-5 somut iyilestirme onerisi dondurur.
export default async function(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const imageUrl = String(body.image_url || '').slice(0, 500);
    const message = String(body.message || '').slice(0, 300);
    const lang = body.lang === 'en' ? 'en' : 'tr';
    if (!/^https?:\/\//.test(imageUrl)) return Response.json({ error: 'image_url is required' }, { status: 400 });

    const out = await askOpenAIJson({
      system: DIJIBOT_PERSONA,
      user: [
        lang === 'en'
          ? 'TASK: The visitor uploaded a screenshot (of their website, social media page or business material). Review it as a digital agency expert and give 3-5 short, concrete improvement suggestions for a Trakya-based business. Reply in English, max 5 sentences.'
          : 'GOREV: Ziyaretcinin yukledigi ekran goruntusunu (web sitesi, sosyal medya sayfasi veya isletme materyali olabilir) dijital ajan uzmani olarak incele; Trakya isletmesi icin 3-5 kisa, somut iyilestirme onerisi ver. Turkce yanitla, en fazla 5 cumle.',
        message ? (lang === 'en' ? `Visitor note: "${message}".` : `Ziyaretcinin notu: "${message}".`) : '',
        'JSON ciktisi: {"text": "..."}',
      ].filter(Boolean).join('\n'),
      image_url: imageUrl,
      max_tokens: 600,
    });
    return Response.json({ text: String(out.text || '') });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}