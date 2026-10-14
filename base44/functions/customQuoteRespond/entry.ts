import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { secrets } from 'base44:runtime';
import { waitUntil } from 'base44:runtime';

// Müşteri özel teklifi — token'la korunan paylaşımlı uç nokta:
//  - action: 'fetch'    → teklif verisini döner (paylaşılan onay sayfası; RLS kapalıyken buradan okunur)
//  - action: 'accepted' → teklifi kabul eder, siparişe çevirir (mükerrer kontrolü), admin'i bilgilendirir
//  - action: 'rejected' → teklifi reddeder, admin'i bilgilendirir
// Süresi geçmiş teklif (valid_until) kabul edilemez.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const token = String(body.token || '').trim();
    const action = String(body.action || '').trim();
    if (!token) return Response.json({ error: 'token gerekli' }, { status: 400 });

    const base = base44.asServiceRole;
    const found = await base.entities.CustomQuote.filter({ token }, { limit: 1 });
    const quote = (found.items || [])[0];
    if (!quote) return Response.json({ error: 'Teklif bulunamadı' }, { status: 404 });

    // Paylaşılan sayfa: token'la yalnızca gerekli alanları döndür
    if (action === 'fetch') {
      return Response.json({
        quote: {
          title: quote.title,
          client_name: quote.client_name,
          client_email: quote.client_email,
          client_phone: quote.client_phone,
          items: quote.items,
          discount_amount: quote.discount_amount,
          total: quote.total,
          note: quote.note,
          valid_until: quote.valid_until,
          status: quote.status,
          created_date: quote.created_date,
        },
      });
    }

    if (!['accepted', 'rejected'].includes(action)) return Response.json({ error: 'Geçersiz işlem' }, { status: 400 });

    // Geçerlilik süresi dolmuşsa işlem yok — sayfa 'expired' mesajı gösterir
    if (quote.valid_until && new Date(`${quote.valid_until}T23:59:59`) < new Date()) {
      return Response.json({ ok: false, error: 'expired' });
    }

    if (quote.status === 'accepted' || quote.status === 'rejected') {
      return Response.json({ ok: true, status: quote.status });
    }

    await base.entities.CustomQuote.update(quote.id, { status: action });

    let order_id = null;
    if (action === 'accepted') {
      const existing = await base.entities.Order.filter({ lead_id: quote.id }, { limit: 1 });
      if (!existing.items.length) {
        const cleanItems = (() => {
          try { return JSON.parse(quote.items || '[]'); } catch { return []; }
        })();
        const subtotal = cleanItems.length
          ? cleanItems.reduce((t, it) => t + (Number(it.price) || 0), 0)
          : Number(quote.total) || 0;
        // Sipariş kalem alanı 'title' — market siparişleriyle aynı yapı; aksi halde
        // sipariş yöneticisi ve bildirimler kalem adını boş gösterir.
        const orderItems = cleanItems.map((it) => ({
          title: it.name || it.title || 'Kalem',
          description: it.description || '',
          price: Number(it.price) || 0,
          billing: it.billing,
        }));
        const order = await base.entities.Order.create({
          customer_name: quote.client_name || quote.client_email,
          phone: quote.client_phone || '',
          email: quote.client_email || '',
          items: JSON.stringify(orderItems),
          subtotal,
          discount_amount: Number(quote.discount_amount) || 0,
          total: Number(quote.total) || 0,
          lead_id: quote.id,
          payment_status: 'unpaid',
          status: 'new',
          note: `Özel teklif: ${quote.title}`,
        });
        order_id = order.id;
      }
    }

    // Admin bildirimi arka planda; kredi tükense bile akış bozulmaz
    waitUntil(notifyAdmin(quote, action, order_id).catch((e) => console.error('Teklif bildirimi hatasi:', e?.message)));

    return Response.json({ ok: true, status: action, order_id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

async function notifyAdmin(quote, action, order_id) {
  const to = secrets.get('ADMIN_ALERT_EMAIL');
  if (!to) return;
  const label = action === 'accepted' ? 'KABUL EDİLDİ ✅' : 'REDDEDİLDİ ❌';
  const lines = [
    'Özel teklif güncellemesi:',
    '',
    `Teklif: ${quote.title}`,
    `Müşteri: ${quote.client_name || '—'} (${quote.client_email || '—'})`,
    `Tutar: ${Number(quote.total || 0).toLocaleString('tr-TR')} ₺`,
    `Sonuç: ${label}`,
    order_id ? `Oluşan sipariş no: ${order_id}` : '',
  ].filter(Boolean);
  await base44.asServiceRole.integrations.Core.SendEmail({
    to,
    subject: `Dijitrak özel teklif ${action === 'accepted' ? 'kabul edildi' : 'reddedildi'}: ${quote.title}`,
    body: lines.join('\n'),
  });
}