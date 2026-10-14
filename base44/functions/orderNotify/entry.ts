import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { waitUntil } from 'base44:runtime';
import { sendOrderNotification, TITLES } from '../../shared/orderNotify.ts';

// Yönetici sipariş durumunu değiştirdiğinde müşteriye WhatsApp + e-posta
// bildirim gönderir. Yetki: yalnızca admin — değilse 403.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const orderId = String(body.order_id || '').trim();
    const statusKey = String(body.status || '').trim();
    if (!orderId || !TITLES[statusKey]) {
      return Response.json({ error: 'order_id ve geçerli status gerekli' }, { status: 400 });
    }
    const order = await base44.asServiceRole.entities.Order.get(orderId);
    if (!order) return Response.json({ error: 'Sipariş bulunamadı' }, { status: 404 });

    waitUntil(sendOrderNotification(base44, order, statusKey)
      .catch((e) => console.error('orderNotify hatasi:', e?.message)));
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}