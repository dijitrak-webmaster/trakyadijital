// Dijitrak WhatsApp Cloud API yardımcıları — webhook (DijiBot) ve portal
// bildirimleri (revizyon kapanışı vb.) bu tek modülü paylaşır.
import { secrets } from 'base44:runtime';

async function credentials() {
  const token = secrets.get('WHATSAPP_ACCESS_TOKEN');
  const phoneId = secrets.get('WHATSAPP_PHONE_NUMBER_ID');
  if (!token || !phoneId) throw new Error('WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID tanimli degil');
  return { token, phoneId };
}

export async function sendWhatsAppText(to, text) {
  const { token, phoneId } = await credentials();
  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { preview_url: false, body: text.slice(0, 900) },
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Cloud API hatasi: ${res.status} ${JSON.stringify(data).slice(0, 300)}`);
  return data;
}

// Hızlı yanıt butonları — en fazla 3 seçenek, başlıklar en fazla 20 karakter.
export async function sendWhatsAppQuickReplies(to, body, buttons) {
  const { token, phoneId } = await credentials();
  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: String(body || '').slice(0, 1024) },
        action: {
          buttons: buttons.slice(0, 3).map((title, i) => ({
            type: 'reply',
            reply: { id: `btn_${i}`, title: String(title).slice(0, 20) },
          })),
        },
      },
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Cloud API hatasi: ${res.status} ${JSON.stringify(data).slice(0, 300)}`);
  return data;
}

// Meta'dan onaylanmış şablon mesajı gönderir — 24 saatlik serbest yazışma
// penceresi kapandıktan sonra da ulaşan tek mesaj türü. params: {{1}}..{{n}}.
export async function sendWhatsAppTemplate(to, templateName, langCode = 'tr', params = []) {
  const { token, phoneId } = await credentials();
  const name = String(templateName || '').trim();
  if (!name) throw new Error('Sablon adi bos');
  const body = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'template',
    template: {
      name,
      language: { code: String(langCode || 'tr') },
    },
  };
  if (params.length) {
    body.template.components = [{
      type: 'body',
      parameters: params.slice(0, 10).map((p) => ({ type: 'text', text: String(p || '').slice(0, 300) })),
    }];
  }
  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Cloud API hatasi: ${res.status} ${JSON.stringify(data).slice(0, 300)}`);
  return data;
}

// Okundu (mavi çift tik) bilgisi — destek hattı deneyimi için.
export async function markAsRead(messageId) {
  if (!messageId) return;
  const { token, phoneId } = await credentials();
  await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', status: 'read', message_id: messageId }),
  }).catch(() => {});
}

// Meta'dan medya (ses/görsel/belge) indirir — meta sorgusu sonra bytes.
export async function downloadWhatsAppMedia(mediaId) {
  const token = secrets.get('WHATSAPP_ACCESS_TOKEN');
  if (!token) throw new Error('WHATSAPP_ACCESS_TOKEN tanimli degil');
  const metaRes = await fetch(`https://graph.facebook.com/v21.0/${mediaId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meta = await metaRes.json().catch(() => ({}));
  if (!metaRes.ok || !meta?.url) throw new Error(`Medya url alinamadi: ${metaRes.status}`);
  const binRes = await fetch(meta.url, { headers: { Authorization: `Bearer ${token}` } });
  if (!binRes.ok) throw new Error(`Medya indirilemedi: ${binRes.status}`);
  return { bytes: new Uint8Array(await binRes.arrayBuffer()), mime: meta.mime_type || 'application/octet-stream' };
}

// Görseli vision (OpenAI) için inline data URL'e çevirir — public depoya yüklemez.
export async function mediaDataUrl(mediaId) {
  const { bytes, mime } = await downloadWhatsAppMedia(mediaId);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return `data:${mime};base64,${btoa(bin)}`;
}