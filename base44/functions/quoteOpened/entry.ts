import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Teklif açılma sayacı: /teklif/:leadId?token= sayfası açıldığında çağrılır.
// Token doğrulanır (quoteLink'te üretilen anahtar), sayı artırılır; tarih damgası atılır.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const lead_id = body?.lead_id;
    const token = body?.token;
    if (!lead_id || !token) return Response.json({ error: 'lead_id ve token gerekli' }, { status: 400 });

    const lead = await base44.asServiceRole.entities.Lead.get(lead_id);
    if (!lead) return Response.json({ error: 'not_found' }, { status: 404 });
    if (lead.quote_token !== token) return Response.json({ error: 'forbidden' }, { status: 403 });

    const count = (lead.quote_open_count || 0) + 1;
    await base44.asServiceRole.entities.Lead.update(lead_id, {
      quote_open_count: count,
      quote_last_open_at: new Date().toISOString(),
    });
    return Response.json({ ok: true, quote_open_count: count });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}