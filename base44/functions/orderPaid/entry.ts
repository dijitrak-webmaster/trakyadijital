import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { waitUntil } from 'base44:runtime';
import { sendOrderNotification } from '../../shared/orderNotify.ts';
import { fulfillOrder } from '../../shared/orderFulfillment.ts';

// Yönetici iyzico linkiyle gelen ödemeyi onaylar: siparişi Ödendi yapar,
// hizmetleri anında başlatır (abonelik + portal projesi) ve müşteriyi bilgilendirir.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const orderId = String(body.order_id || '').trim();
    if (!orderId) return Response.json({ error: 'order_id gerekli' }, { status: 400 });
    const order = await base44.asServiceRole.entities.Order.get(orderId);
    if (!order) return Response.json({ error: 'Sipariş bulunamadı' }, { status: 404 });
    if (order.payment_status === 'paid') return Response.json({ ok: true, already: true });

    await base44.asServiceRole.entities.Order.update(orderId, {
      payment_status: 'paid',
      paid_date: new Date().toISOString(),
      status: (order.status === 'new' || order.status === 'cancelled') ? 'approved' : order.status,
    });
    const updated = { ...order, payment_status: 'paid' };
    waitUntil(Promise.allSettled([
      fulfillOrder(base44, updated),
      sendOrderNotification(base44, updated, 'paid'),
    ]).then((rs) => rs.forEach((r) => {
      if (r.status === 'rejected') console.error('Odeme sonrasi islem hatasi:', r.reason?.message || String(r.reason));
    })));
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}