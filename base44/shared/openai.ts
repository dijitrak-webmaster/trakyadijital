// OpenAI cagirici — uygulamanin kendi OPENAI_API_KEY anahtariyla calisir,
// Base44 entegrasyon kredisi harcamaz. Model: gpt-4o-mini (dusuk maliyet, etkili).
import { secrets } from 'base44:runtime';

const MODEL = 'gpt-4o-mini';

export async function askOpenAI({ system = '', user, image_url = null, max_tokens = 500, temperature = 0.6, json = false }) {
  const apiKey = secrets.get('OPENAI_API_KEY');
  if (!apiKey) throw new Error('OPENAI_API_KEY tanimli degil');
  const content = image_url
    ? [{ type: 'text', text: user }, { type: 'image_url', image_url: { url: image_url } }]
    : user;
  const messages = [
    ...(system ? [{ role: 'system', content: system }] : []),
    { role: 'user', content },
  ];
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens,
      temperature,
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`OpenAI hatasi: ${res.status} ${JSON.stringify(data?.error || data).slice(0, 200)}`);
  return String(data?.choices?.[0]?.message?.content || '');
}

// Yalnizca JSON donen cagri — "yalnizca JSON" talimati ekler ve parse eder.
export async function askOpenAIJson(opts) {
  const raw = await askOpenAI({
    ...opts,
    user: `${opts.user}\n\nCEVAP BICIMI: Yalnizca gecerli JSON dondur, aciklama yazma.`,
    json: true,
  });
  const m = raw.match(/\{[\s\S]*\}/);
  return JSON.parse(m ? m[0] : raw);
}