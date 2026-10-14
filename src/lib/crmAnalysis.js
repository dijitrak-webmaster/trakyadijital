// CRM analiz motoru — para + memnuniyet ağırlıklı müşteri sağlık skoru.
// Skor 0-100: %50 para (ciro, yinelenen gelir, alım tazeliği) + %50 memnuniyet
// (destek yükü, yanıtsız sorular, temas tazeliği, proje momentumu).

const DAY = 24 * 3600 * 1000;

const daysSince = (iso) => {
  if (!iso) return null;
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / DAY));
};

// v start günü içinde 100, end'de 0 — arada lineer düşer
const rampDown = (v, start, end) => {
  if (v == null) return 0;
  if (v <= start) return 100;
  if (v >= end) return 0;
  return Math.round(100 * (end - v) / (end - start));
};

// v hedef değere ulaşınca 100
const ratioScore = (v, target) => Math.min(100, Math.round((v / target) * 100));

const ORDER_VALUED = ['approved', 'in_progress', 'delivered'];

export const SEGMENTS = [
  { key: 'healthy', label: 'Sağlıklı', cls: 'bg-mint', hex: 'hsl(150 78% 58%)' },
  { key: 'watch', label: 'İzlemede', cls: 'bg-sun', hex: 'hsl(46 100% 60%)' },
  { key: 'risky', label: 'Riskli', cls: 'bg-coral', hex: 'hsl(12 100% 66%)' },
];

export function buildCrmData({ projects = [], orders = [], subs = [], revisions = [], messages = [], leads = [], users = [] }) {
  const nameByEmail = {};
  users.forEach((u) => { nameByEmail[(u.email || '').toLowerCase()] = u.full_name || ''; });

  const byEmail = {};
  const ensure = (email) => {
    const k = (email || '').toLowerCase();
    if (!k) return null;
    if (!byEmail[k]) {
      byEmail[k] = {
        email: k,
        name: nameByEmail[k] || k.split('@')[0],
        projects: [], orders: [], subs: [], revisions: [], messages: [],
      };
    }
    return byEmail[k];
  };
  projects.forEach((p) => ensure(p.client_email)?.projects.push(p));
  orders.forEach((o) => ensure(o.email)?.orders.push(o));
  subs.forEach((s) => ensure(s.client_email)?.subs.push(s));
  revisions.forEach((r) => ensure(r.client_email)?.revisions.push(r));
  messages.forEach((m) => ensure(m.client_email)?.messages.push(m));

  const clients = Object.values(byEmail).map((c) => {
    const valuedOrders = c.orders.filter((o) => ORDER_VALUED.includes(o.status) && Number(o.total) > 0);
    const oneoff = valuedOrders.reduce((s, o) => s + Number(o.total), 0);
    const activeSubs = c.subs.filter((s) => s.status === 'active');
    const mrr = activeSubs.reduce((s, x) => s + (Number(x.monthly_price) || 0), 0);
    // LTV: geçmiş tek seferlik ciro + aktif aboneliklerin bugüne kadarki tahmini katkısı (24 ay tavan)
    let recurringToDate = 0;
    activeSubs.forEach((s) => {
      const months = Math.min(24, Math.max(0, (Date.now() - new Date(s.start_date).getTime()) / (30 * DAY)));
      recurringToDate += (Number(s.monthly_price) || 0) * months;
    });
    const ltv = Math.round(oneoff + recurringToDate);

    const openRevisions = c.revisions.filter((r) => r.status === 'open');
    const unanswered = c.messages.filter((m) => !(m.answer || '').trim()).length;
    const lastOrderDate = c.orders.map((o) => o.created_date).filter(Boolean).sort().pop();
    const lastActivityDate = [
      ...c.projects.map((p) => p.updated_date),
      ...c.revisions.map((r) => r.created_date),
      ...c.messages.map((m) => m.created_date),
      ...c.orders.map((o) => o.created_date),
    ].filter(Boolean).sort().pop();

    // PARA — %50
    const ltvScore = ratioScore(oneoff, 20000);
    const mrrScore = ratioScore(mrr, 5000);
    const purchaseRecency = rampDown(daysSince(lastOrderDate), 30, 180);
    const moneyScore = Math.round(0.4 * ltvScore + 0.4 * mrrScore + 0.2 * purchaseRecency);

    // MEMNUNİYET — %50
    const supportScore = rampDown(openRevisions.length, 0, 5);
    const responseScore = rampDown(unanswered, 0, 3);
    const contactScore = rampDown(daysSince(lastActivityDate), 7, 90);
    const moving = c.projects.filter((p) => ['launched', 'in_progress'].includes(p.status));
    const momentumScore = moving.length
      ? Math.round(moving.reduce((s, p) => s + (p.status === 'launched' ? 100 : (p.progress || 0)), 0) / moving.length)
      : c.projects.length ? 50 : 0;
    const satisfactionScore = Math.round(0.35 * supportScore + 0.2 * responseScore + 0.25 * contactScore + 0.2 * momentumScore);

    const score = Math.round(0.5 * moneyScore + 0.5 * satisfactionScore);
    const segment = score >= 70 ? 'healthy' : score >= 45 ? 'watch' : 'risky';

    // Uyarı bayrakları
    const flags = [];
    if (oneoff === 0 && mrr === 0) flags.push('Henüz gelire dönüşmedi');
    if (openRevisions.length > 0) {
      const oldest = Math.max(...openRevisions.map((r) => daysSince(r.created_date) || 0));
      flags.push(oldest >= 14 ? `${oldest} gündür açık revizyon var` : `${openRevisions.length} açık revizyon`);
    }
    if (unanswered > 0) flags.push(`${unanswered} yanıtsız soru`);
    const gap = daysSince(lastActivityDate);
    if (gap != null && gap >= 45) flags.push(`${gap} gündür temas yok`);
    if (c.subs.some((s) => s.status === 'cancelled')) flags.push('İptal edilmiş abonelik');

    return {
      email: c.email,
      name: c.name,
      projectCount: c.projects.length,
      orderCount: valuedOrders.length,
      subCount: activeSubs.length,
      openRevisions: openRevisions.length,
      unanswered,
      mrr,
      ltv,
      lastContact: lastActivityDate,
      scores: {
        money: moneyScore, satisfaction: satisfactionScore,
        ltv: ltvScore, mrr: mrrScore, purchaseRecency,
        support: supportScore, response: responseScore, contact: contactScore, momentum: momentumScore,
      },
      score,
      segment,
      flags,
    };
  }).sort((a, b) => b.score - a.score);

  const paidOrders = orders.filter((o) => ORDER_VALUED.includes(o.status) && Number(o.total) > 0);
  const revenue90 = paidOrders.filter((o) => daysSince(o.created_date) <= 90).reduce((s, o) => s + Number(o.total), 0);
  const totalMrr = clients.reduce((s, c) => s + c.mrr, 0);
  const avgScore = clients.length ? Math.round(clients.reduce((s, c) => s + c.score, 0) / clients.length) : 0;
  const risky = clients.filter((c) => c.segment === 'risky').length;
  const closedLeads = leads.filter((l) => l.status === 'won' || l.status === 'lost');
  const conversion = closedLeads.length
    ? Math.round((leads.filter((l) => l.status === 'won').length / closedLeads.length) * 100)
    : null;

  // son 6 ayın ciro serisi
  const monthly = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthly.push({ key, month: d.toLocaleDateString('tr-TR', { month: 'short' }), revenue: 0, count: 0 });
  }
  const monthIdx = Object.fromEntries(monthly.map((m, i) => [m.key, i]));
  paidOrders.forEach((o) => {
    const dt = new Date(o.created_date);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
    if (key in monthIdx) {
      monthly[monthIdx[key]].revenue += Number(o.total) || 0;
      monthly[monthIdx[key]].count += 1;
    }
  });

  const segmentDist = SEGMENTS.map((s) => ({
    ...s,
    n: clients.filter((c) => c.segment === s.key).length,
  }));

  return {
    clients,
    kpis: { totalMrr, revenue90, avgScore, risky, total: clients.length, conversion, orderCount: paidOrders.length },
    monthly,
    segmentDist,
  };
}