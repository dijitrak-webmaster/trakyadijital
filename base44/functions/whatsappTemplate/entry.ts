// Dijitrak — yönetici için Meta onaylı WhatsApp şablonu gönderimi.
// 24 saatlik serbest yazışma penceresi kapandığında müşteriye yine de
// ulaşmanın tek yolu onaylı şablonlardır (abonelik yenileme hatırlatması,
// proje güncellemesi, kampanya duyurusu vb.).
// Yetki: yalnızca admin (base44.auth.me + rol kontrolü).
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { sendWhatsAppTemplate } from '../../shared/whatsapp.ts';
import { normalizePhone } from '../../shared/customerService.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { phone, template, language, params } = await req.json().catch(() => ({}));
    if (!phone || !template) {
      return Response.json({ error: 'Telefon ve sablon adi zorunlu' }, { status: 400 });
    }
    const to = normalizePhone(phone);
    if (!to || to.length < 10) {
      return Response.json({ error: 'Gecerli bir telefon numarasi girin' }, { status: 400 });
    }
    const values = Array.isArray(params) ? params.map((p) => String(p || '').slice(0, 300)) : [];

    // Gönderim — Cloud API
    const res = await sendWhatsAppTemplate(to, template, language || 'tr', values);

    // CRM: numarayla eşleşen Lead varsa sohbet kaydına düş
    try {
      const lead = (await base44.asServiceRole.entities.Lead.filter({ phone: to }, '-created_date', 1))[0] || null;
      if (lead) {
        const entry = `[${new Date().toISOString()}] Sablon (${template})${values.length ? ': ' + values.join(' | ') : ''}`;
        const tail = (lead.conversation || '').slice(-4000);
        await base44.asServiceRole.entities.Lead.update(lead.id, {
          conversation: `${tail}${tail ? '\n' : ''}${entry}`,
        });
      }
    } catch (e) {
      console.error('Sablon CRM kaydi hatasi:', e?.message);
    }

    return Response.json({ ok: true, message_id: res?.messages?.[0]?.id || null });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}