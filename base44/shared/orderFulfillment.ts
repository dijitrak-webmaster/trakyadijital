// Ödeme tamamlanan siparişleri anında devreye alır:
//  - aylık ürünler → Subscription kaydı (1 ay, bugünden itibaren)
//  - tek seferlik ürünler → ClientProject kaydı (müşteri portalına anında düşer)
// Hizmet satın alanın e-postası portal giriş e-postasıyla eşleşirse hizmet
// portalda hemen görünür; eşleşmese de CRM'de kayıt oluşur.
export async function fulfillOrder(base44, order) {
  let items = [];
  try { items = JSON.parse(order.items || '[]'); } catch { items = []; }
  const email = String(order.email || '').trim();
  if (!email) return { ok: false, reason: 'E-posta yok — otomatik başlatma atlandı' };

  const today = new Date();
  const iso = today.toISOString().slice(0, 10);
  const end = new Date(today.getTime() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10);

  const jobs = items.slice(0, 20).map((it) => it.billing === 'monthly'
    ? base44.asServiceRole.entities.Subscription.create({
        client_email: email,
        item_id: String(it.id || ''),
        item_title: it.title || 'Abonelik',
        monthly_price: Number(it.price) || 0,
        months: 1,
        start_date: iso,
        end_date: end,
        status: 'active',
        note: 'Market siparişi — iyzico ile ödendi',
      })
    : base44.asServiceRole.entities.ClientProject.create({
        title: it.title || 'Dijital hizmet',
        client_email: email,
        status: 'planned',
        progress: 0,
        description: [it.description, 'Market siparişi — iyzico ile ödendi, kurulum ekibimizde.'].filter(Boolean).join('\n'),
      }));

  const results = await Promise.allSettled(jobs);
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error('Otomatik baslatma hatasi:', items[i]?.title, r.reason?.message || String(r.reason));
    }
  });
  return { ok: true, created: results.filter((r) => r.status === 'fulfilled').length };
}