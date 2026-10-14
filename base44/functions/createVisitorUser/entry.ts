import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Müşteri Portalı daveti: DijiBot (WhatsApp) ziyaretçiden e-posta aldığında
// bu fonksiyon davet oluşturur. Yalnızca geçerli e-posta kabul edilir.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const email = (body?.email || '').trim().toLowerCase();
    const name = (body?.name || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'gecerli_bir_eposta_gerekli' }, { status: 400 });
    }

    // zaten davetli/kayıtlı mı?
    const existing = await base44.asServiceRole.entities.User.filter({ email });
    if ((existing || []).length > 0) {
      return Response.json({ ok: true, existed: true });
    }

    await base44.users.inviteUser(email, 'user');
    return Response.json({ ok: true, existed: false, name });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}