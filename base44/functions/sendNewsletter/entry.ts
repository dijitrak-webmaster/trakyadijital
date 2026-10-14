import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { waitUntil } from 'base44:runtime';

// Bülten gönderimi — yalnızca admin tetikleyebilir.
// Aboneler: service alanı "Bülten aboneliği" olan Lead kayıtları.
// Gönderim yanıt beklemeden arka planda tamamlanır (waitUntil).
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    let payload = {};
    try { payload = await req.json(); } catch { /* boş gövde */ }
    const subject = String(payload.subject || '').trim();
    const text = String(payload.text || '').trim();
    if (!subject || subject.length > 150) {
      return Response.json({ error: 'Geçerli bir konu girin (en fazla 150 karakter).' }, { status: 400 });
    }
    if (!text || text.length > 10000) {
      return Response.json({ error: 'Geçerli bir metin girin (en fazla 10.000 karakter).' }, { status: 400 });
    }

    // Abone e-postaları — tekrarsız, çağrı başına en fazla 200 adres
    const leads = await base44.entities.Lead.filter({ service: 'Bülten aboneliği' }, '-created_date', 200);
    const emails = [...new Set((leads || []).map((l) => (l.email || '').trim().toLowerCase()).filter((e) => e.includes('@')))];
    if (emails.length === 0) {
      return Response.json({ error: 'Kayıtlı bülten abonesi bulunamadı.' }, { status: 400 });
    }

    const html = `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;line-height:1.7">
      <h2 style="color:#0d1f17">${subject}</h2>
      ${text.split('\n').filter((p) => p.trim()).map((p) => `<p>${p}</p>`).join('')}
      <hr style="border:none;border-top:1px solid #ddd;margin:24px 0">
      <p style="font-size:12px;color:#888">Bu bülteni Dijitrak blog sayfasından aldınız. İstemiyorsanız bize yazın: info@dijitrak.com.tr</p>
    </div>`;

    const sendAll = (async () => {
      for (const to of emails) {
        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to,
            subject,
            html,
            text,
            from_name: 'Dijitrak Bülteni',
          });
        } catch (e) {
          console.log(`Bülten gönderilemedi: ${to} — ${e.message}`);
        }
      }
    })();
    waitUntil(sendAll);

    return Response.json({ ok: true, queued: emails.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}