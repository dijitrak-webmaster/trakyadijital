import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { secrets } from 'base44:runtime';

const TYPE_LABELS = { quote: 'Teklif Talebi', appointment: 'Randevu Talebi', question: 'Soru' };
const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const leadId = body?.lead_id;
    if (!leadId) return Response.json({ error: 'lead_id gerekli' }, { status: 400 });

    const lead = await base44.asServiceRole.entities.Lead.get(leadId);
    if (!lead) return Response.json({ error: 'talep bulunamadı' }, { status: 404 });

    // Sadece çok yakın zamanda oluşan talepler bildirilir (spam/kötüye kullanım koruması)
    const age = Date.now() - new Date(lead.created_date).getTime();
    if (age > 15 * 60 * 1000) return Response.json({ ok: true, skipped: 'stale' });

    let to = 'merhaba@dijitrak.com';
    try { to = secrets.get('ADMIN_ALERT_EMAIL') || to; } catch {}

    const type = TYPE_LABELS[lead.type] || 'Talep';
    const rows = [
      ['İsim', lead.name],
      ['Tip', type],
      ['Hizmet', lead.service],
      ['Sektör', lead.sector],
      ['Telefon', lead.phone],
      ['E-posta', lead.email],
      ['İşletme', lead.company],
      ['Randevu', [lead.appointment_date, lead.appointment_time].filter(Boolean).join(' ')],
      ['Bütçe', lead.estimate],
      ['Paket', lead.package_summary],
      ['Mesaj', (lead.message || '').slice(0, 500)],
      ['Tavsiye kodu', lead.referral],
    ].filter(([, v]) => v);

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px">
        <h2 style="color:#5fdca2;margin:0 0 4px">Yeni ${type.toLowerCase()} geldi 🌾</h2>
        <p style="color:#666;font-size:13px">Dijitrak CRM'e yeni bir kayıt düştü.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${rows.map(([k, v]) => `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;color:#888;width:130px;vertical-align:top">${esc(k)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee"><strong>${esc(v)}</strong></td></tr>`).join('')}
        </table>
        <p style="margin-top:16px"><a href="https://trakya-digital-core.base44.app/admin/talepler" style="background:#5fdca2;color:#101728;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:bold">Panelde Görüntüle</a></p>
      </div>`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to,
      from_name: 'Dijitrak CRM',
      subject: `🌾 Yeni ${type}: ${lead.name || 'İsimsiz'}`,
      html,
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}