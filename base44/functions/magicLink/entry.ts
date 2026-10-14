import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Magic link akışı — tek fonksiyon, üç işlem:
//  create (yalnızca yönetici): e-posta için tek kullanımlık bağlantı üretir;
//    hesap şifresi otomatik üretilir, davetlinin hiçbir şey girmesi gerekmez.
//  redeem (herkese açık): bağlantıdaki anahtarı karşılığında hesap bilgisini döner;
//    anahtar tek kullanımlıktır ve süresi dolabilir — anahtarın kendisi yetki kanıtıdır.
//  send (herkese açık): kayıtlı kullanıcının e-postasına yeni bir giriş bağlantısı gönderir;
//    kayıtlı olmayan adreslere her durumda olumlu yanıt döner (adres sızdırılmaz).

const PASSWORD_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';

const genPassword = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => PASSWORD_CHARS[b % PASSWORD_CHARS.length]).join('');
};

const genToken = () =>
  crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createMagicLink = async (base44, email) => {
  // yeni bağlantı üretmeden önce aynı e-postanın kullanılmamış eski bağlantılarını geçersiz kıl
  const existing = await base44.asServiceRole.entities.MagicLink.filter({ email });
  const stale = (existing || []).filter((r) => !r.used);
  if (stale.length > 0) {
    await base44.asServiceRole.entities.MagicLink.bulkUpdate(
      stale.map((r) => ({ id: r.id, used: true }))
    );
  }
  const token = genToken();
  const password = genPassword();
  await base44.asServiceRole.entities.MagicLink.create({
    token,
    email,
    password,
    used: false,
    expires_at: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
  });
  return token;
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const action = body?.action;
    const origin = new URL(req.url).origin;

    if (action === 'create') {
      const me = await base44.auth.me();
      if (!me || me.role !== 'admin') {
        return Response.json({ error: 'yetki_yok' }, { status: 403 });
      }
      const email = String(body?.email || '').trim().toLowerCase();
      if (!EMAIL_RE.test(email)) {
        return Response.json({ error: 'gecersiz_eposta' }, { status: 400 });
      }
      const token = await createMagicLink(base44, email);
      return Response.json({ token, email });
    }

    if (action === 'redeem') {
      const token = String(body?.token || '').trim();
      if (!token) return Response.json({ error: 'link_gecersiz' }, { status: 400 });
      const recs = await base44.asServiceRole.entities.MagicLink.filter({ token });
      const rec = (recs || [])[0];
      if (!rec) return Response.json({ error: 'link_gecersiz' }, { status: 404 });
      if (rec.used) return Response.json({ error: 'link_kullanildi' }, { status: 410 });
      if (rec.expires_at && new Date(rec.expires_at).getTime() < Date.now()) {
        return Response.json({ error: 'link_suresi_gecmis' }, { status: 410 });
      }
      await base44.asServiceRole.entities.MagicLink.update(rec.id, { used: true });
      return Response.json({ email: rec.email, password: rec.password });
    }

    if (action === 'send') {
      const email = String(body?.email || '').trim().toLowerCase();
      if (!EMAIL_RE.test(email)) {
        return Response.json({ error: 'gecersiz_eposta' }, { status: 400 });
      }
      const users = await base44.asServiceRole.entities.User.filter({ email });
      if ((users || []).length === 0) {
        // adresin kayıtlı olup olmadığı sızdırılmaz
        return Response.json({ ok: true });
      }
      // saatte en fazla 3 bağlantı
      const existing = await base44.asServiceRole.entities.MagicLink.filter({ email });
      const recent = (existing || []).filter(
        (r) => !r.used && new Date(r.created_date).getTime() > Date.now() - 3600 * 1000
      );
      if (recent.length >= 3) {
        return Response.json({ error: 'cok_fazla_istek' }, { status: 429 });
      }
      const token = await createMagicLink(base44, email);
      const link = `${origin}/register?mtoken=${token}&returnTo=/portal`;
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: email,
        from_name: 'Dijitrak',
        subject: 'Dijitrak giriş bağlantınız',
        body: `<p>Merhaba,</p><p>Dijitrak hesabınıza aşağıdaki tek kullanımlık bağlantıyla girebilirsiniz:</p><p><a href="${link}" style="display:inline-block;background:#22c878;color:#0f172a;padding:12px 24px;border-radius:999px;font-weight:600;text-decoration:none;">Hesabımı Aç</a></p><p style="font-size:12px;color:#64748b;">Bağlantı 14 gün geçerlidir ve yalnızca bir kez kullanılabilir.</p><p>Dijitrak Ekibi</p>`,
      });
      return Response.json({ ok: true });
    }

    return Response.json({ error: 'gecersiz_islem' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}