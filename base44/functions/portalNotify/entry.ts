import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { secrets, waitUntil } from 'base44:runtime';
import { sendWhatsAppText } from '../../shared/whatsapp.ts';
import { normalizePhone } from '../../shared/customerService.ts';

const PORTAL_URL = 'https://trakya-digital-core.base44.app/portal';
const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const STATUS_LABELS = { planned: 'Planlamada', in_progress: 'Devam ediyor', review: 'İncelemede', launched: 'Yayında' };

const mail = (title, sub, rows, cta = 'Portala Git') => `
  <div style="font-family:Arial,sans-serif;max-width:560px">
    <h2 style="color:#5fdca2;margin:0 0 4px">${esc(title)}</h2>
    <p style="color:#666;font-size:13px">${esc(sub)}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${rows.filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;color:#888;width:130px;vertical-align:top">${esc(k)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee"><strong>${esc(v)}</strong></td></tr>`).join('')}
    </table>
    <p style="margin-top:16px"><a href="${PORTAL_URL}" style="background:#5fdca2;color:#101728;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:bold">${esc(cta)}</a></p>
  </div>`;

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const event = body?.event;
    const isAdmin = user.role === 'admin';

    let adminTo = 'merhaba@dijitrak.com';
    try { adminTo = secrets.get('ADMIN_ALERT_EMAIL') || adminTo; } catch {}

    let to, subject, html;
    let waRevision = null;

    if (event === 'question_created') {
      const msg = await base44.entities.ClientMessage.get(body.message_id);
      if (!msg) return Response.json({ error: 'not found' }, { status: 404 });
      if (!isAdmin && msg.client_email !== user.email) return Response.json({ error: 'forbidden' }, { status: 403 });
      to = adminTo;
      subject = `💬 Yeni müşteri sorusu: ${msg.client_email}`;
      html = mail('Yeni müşteri sorusu', 'Portaldan yeni bir soru geldi.', [['Müşteri', msg.client_email], ['Soru', (msg.question || '').slice(0, 500)]], 'Panelde Yanıtla');
    } else if (event === 'question_answered') {
      if (!isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });
      const msg = await base44.entities.ClientMessage.get(body.message_id);
      if (!msg) return Response.json({ error: 'not found' }, { status: 404 });
      to = msg.client_email;
      subject = 'Sorunuz yanıtlandı 🌾';
      html = mail('Sorunuz yanıtlandı', 'Dijitrak ekibi sorunuzu yanıtladı.', [['Sorunuz', (msg.question || '').slice(0, 300)], ['Yanıt', (msg.answer || '').slice(0, 800)]]);
    } else if (event === 'revision_created') {
      const rec = await base44.entities.RevisionRequest.get(body.revision_id);
      if (!rec) return Response.json({ error: 'not found' }, { status: 404 });
      if (!isAdmin && rec.client_email !== user.email) return Response.json({ error: 'forbidden' }, { status: 403 });
      to = adminTo;
      subject = `🔧 Yeni revizyon talebi: ${rec.client_email}`;
      html = mail('Yeni revizyon talebi', 'Portaldan bir revizyon talebi geldi.', [['Müşteri', rec.client_email], ['Talep', (rec.text || '').slice(0, 500)]], 'Panelde Görüntüle');
    } else if (event === 'revision_resolved') {
      if (!isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });
      const rec = await base44.entities.RevisionRequest.get(body.revision_id);
      if (!rec) return Response.json({ error: 'not found' }, { status: 404 });
      to = rec.client_email;
      subject = 'Revizyon talebiniz çözüldü ✅';
      html = mail('Revizyon talebiniz çözüldü', 'Talebiniz tamamlandı ve kapatıldı.', [['Talebiniz', (rec.text || '').slice(0, 500)], ...(rec.response ? [['Ekibin Yanıtı', rec.response.slice(0, 800)]] : [])]);
      waRevision = rec;
    } else if (event === 'file_added') {
      if (!isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });
      const file = await base44.entities.ProjectFile.get(body.file_id);
      if (!file) return Response.json({ error: 'not found' }, { status: 404 });
      to = file.client_email;
      subject = `Yeni dosya paylaşıldı: ${file.title}`;
      html = mail('Projene yeni bir dosya eklendi', 'Portaldaki dosyalar bölümünden indirebilirsin.', [['Dosya', file.title], ['Not', file.note]]);
    } else if (event === 'project_updated') {
      if (!isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });
      const project = await base44.entities.ClientProject.get(body.project_id);
      if (!project) return Response.json({ error: 'not found' }, { status: 404 });
      to = project.client_email;
      subject = `Proje güncellendi: ${project.title}`;
      html = mail('Projen güncellendi', 'Proje durumunda yeni gelişme var.', [['Proje', project.title], ['Durum', STATUS_LABELS[project.status] || project.status], ['Tamamlanma', `%${project.progress || 0}`], ['Rapor', (project.report || '').slice(0, 800)]]);
    } else if (event === 'subscription_created') {
      if (!isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });
      const sub = await base44.entities.Subscription.get(body.subscription_id);
      if (!sub) return Response.json({ error: 'not found' }, { status: 404 });
      to = sub.client_email;
      subject = `Yeni aboneliğiniz başladı: ${sub.item_title}`;
      html = mail('Yeni aboneliğiniz aktif edildi', 'Portalda Aboneliklerim bölümünden detayları görebilirsiniz.', [
        ['Abonelik', sub.item_title],
        ['Aylık ücret', `${sub.monthly_price || 0} ₺ /ay`],
        ['Süre', `${sub.months || 1} ay`],
        ['Bitiş', sub.end_date],
        ...(sub.note ? [['Not', sub.note]] : []),
      ]);
    } else {
      return Response.json({ error: 'bilinmeyen event' }, { status: 400 });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({ to, from_name: 'Dijitrak Portal', subject, html });

    // Revizyon kapanışı: numarası eşleştirilmiş müşteriye WhatsApp bildirimi de gider.
    // Hata olursa e-posta akışını bozmamak için arka planda loglanır.
    if (waRevision) {
      const rec = waRevision;
      waitUntil((async () => {
        try {
          const mapped = (await base44.asServiceRole.entities.ClientPhone.filter(
            { client_email: rec.client_email }, '-created_date', 1
          ))[0] || null;
          if (!mapped?.phone) return;
          const lines = [
            'Merhaba,',
            '',
            'Dijitrak ekibi olarak revizyon talebinizi çözüme kavuşturduk.',
            '',
            `Talebiniz: "${String(rec.text || '').slice(0, 300)}"`,
          ];
          if (rec.response) lines.push('', `Ekibin yanıtı: ${String(rec.response).slice(0, 600)}`);
          lines.push('', 'Tüm güncellemeler müşteri portalınızda: https://trakya-digital-core.base44.app/portal');
          await sendWhatsAppText(normalizePhone(mapped.phone), lines.join('\n'));
        } catch (e) {
          console.error('WhatsApp revizyon bildirimi hatasi:', e?.message || String(e));
        }
      })());
    }

    return Response.json({ ok: true, to });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}