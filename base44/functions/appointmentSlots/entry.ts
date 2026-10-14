import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// 📅 Randevu doluluk bilgisi: girilmis randevu taleplerinden sadece tarih+saat
// kumesini dondurur — kisisel veri icermez, bu yuzden anonim ziyaretciye acik.
// Girdi katilarak dogrulanir (YYYY-MM-DD) ve tek bir gun sorgulanabilir.
export default async function(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const date = String(body.date || '').slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return Response.json({ error: 'invalid date' }, { status: 400 });

    const base44 = createClientFromRequest(req);
    const leads = await base44.asServiceRole.entities.Lead.filter({
      type: 'appointment',
      status: { $in: ['new', 'contacted'] },
      appointment_date: date,
    });

    const seen = new Set();
    const busy = [];
    for (const lead of leads) {
      const time = String(lead.appointment_time || '').slice(0, 5);
      if (time && !seen.has(time)) {
        seen.add(time);
        busy.push({ time });
      }
    }
    return Response.json({ busy });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}