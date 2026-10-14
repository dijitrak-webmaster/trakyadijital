import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Teklif sayfası linki:
//  - token olmadan çağrılırsa (lead_id ile) link üretir; oturum zorunlu.
//    Kimlik doğrulamasız isteklerde yalnızca DijiBot'un paket verisiyle kaydettiği
//    teklif lead'leri (package_data dolu) kabul edilir — bot sohbeti için gerekli.
//  - token ile çağrılırsa teklif verisini döner (paylaşılan sayfa için, token gate'li).
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const lead_id = body?.lead_id;
    if (!lead_id) return Response.json({ error: 'lead_id gerekli' }, { status: 400 });

    const lead = await base44.asServiceRole.entities.Lead.get(lead_id);
    if (!lead) return Response.json({ error: 'not_found' }, { status: 404 });

    if (!body?.token) {
      const user = await base44.auth.me().catch(() => null);
      if (!user && !lead.package_data) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      let quoteToken = lead.quote_token;
      if (!quoteToken) {
        quoteToken = [...crypto.getRandomValues(new Uint8Array(16))]
          .map((b) => b.toString(16).padStart(2, '0')).join('');
        await base44.asServiceRole.entities.Lead.update(lead_id, { quote_token: quoteToken });
      }
      // paylaşılan linkler uygulamanın yayın adresine işaret etmeli (bot çağrılarında worker adresi çıkabilir)
      const reqOrigin = new URL(req.url).origin;
      const origin = reqOrigin.includes('workers.dev') ? 'https://trakya-digital-core.base44.app' : reqOrigin;
      return Response.json({
        lead_id,
        token: quoteToken,
        url: `${origin}/teklif/${lead_id}?token=${quoteToken}`,
      });
    }

    if (lead.quote_token !== body.token) {
      return Response.json({ error: 'forbidden' }, { status: 403 });
    }
    let pkg = null;
    try { pkg = lead.package_data ? JSON.parse(lead.package_data) : null; } catch { pkg = null; }
    return Response.json({
      name: lead.name,
      company: lead.company,
      phone: lead.phone,
      email: lead.email,
      service: lead.service,
      sector: lead.sector,
      estimate: lead.estimate,
      package_summary: lead.package_summary,
      pkg,
      appointment_date: lead.appointment_date,
      appointment_time: lead.appointment_time,
      created_date: lead.created_date,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}