// Sipariş durumu bildirimleri: müşteriye WhatsApp + e-posta.
// WhatsApp kurumsal düzen (3-6 emoji, kalın başlıklar, ikonlu satırlar).
import { sendWhatsAppText } from './whatsapp.ts';

export function normalizePhoneSafe(p) {
  let d = String(p || '').replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('90')) return d;
  if (d.startsWith('0') && d.length === 11) d = '90' + d.slice(1);
  if (d.startsWith('5') && d.length === 10) d = '90' + d;
  return d;
}

export const TITLES = {
  paid: 'Ödendi',
  approved: 'Onaylandı',
  in_progress: 'Süreçte',
  delivered: 'Teslim edildi',
  cancelled: 'İptal edildi',
  link_sent: 'Ödeme linki gönderildi',
};

const buildMessage = (order, title) => {
  let items = [];
  try { items = JSON.parse(order.items || '[]'); } catch { items = []; }
  const lines = items.map((i) => `• ${i.title} — ${(Number(i.price) || 0).toLocaleString('tr-TR')} ₺${i.billing === 'monthly' ? ' /ay' : ''}`).join('\n');
  return [
    `📦 *Sipariş güncellemesi — Dijitrak*`,
    ``,
    `🧾 *Sipariş:* ${order.customer_name}`,
    lines ? `🛠️ *Ürünler:*\n${lines}` : '',
    `💳 *Durum:* ${title}`,
    order.payment_link ? `🔗 *Ödeme linki:* ${order.payment_link}` : '',
    Number(order.total) ? `💰 *Tutar:* ${Number(order.total).toLocaleString('tr-TR')} ₺` : '',
    ``,
    `🚀 Süreç boyunca güncellemeler buradan iletilecek. Sorunuz olursa yazmanız yeterli.`,
  ].filter(Boolean).join('\n');
};

/** Sipariş bildirimini gönderir; kanallardan biri başarısız olsa bile kayıt etkilenmez. */
export async function sendOrderNotification(base44, order, statusKey) {
  const title = TITLES[statusKey] || statusKey;
  const text = buildMessage(order, title);
  const jobs = [];
  if (order.phone) {
    jobs.push(sendWhatsAppText(normalizePhoneSafe(order.phone), text));
  }
  if (order.email) {
    jobs.push(base44.asServiceRole.integrations.Core.SendEmail({
      to: order.email,
      subject: `Dijitrak sipariş güncellemesi: ${title}`,
      body: [
        `Merhaba ${order.customer_name || ''},`,
        ``,
        `Dijitrak siparişinizin güncel durumu: ${title}`,
        ``,
        text.replace(/\*/g, ''),
        ...(order.payment_link ? ['', `Ödeme linki: ${order.payment_link}`] : []),
        ``,
        `İyi çalışmalar,`,
        `Dijitrak Dijital Atölye`,
      ].join('\n'),
    }));
  }
  const results = await Promise.allSettled(jobs);
  results.forEach((r) => {
    if (r.status === 'rejected') console.error('Bildirim gönderilemedi:', r.reason?.message || String(r.reason));
  });
  return { ok: true };
}