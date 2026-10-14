import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Portal tema seçimi: müşteri yalnızca KENDİ projesine, marketteki yayında bir temayı atayabilir.
// RLS güncellemesi admin'e kilitli olduğu için tema alanını bu fonksiyon yazar.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const projectId = String(body.project_id || '');
    const themeId = String(body.theme_id || '');
    if (!projectId || !themeId) return Response.json({ error: 'Eksik parametre.' }, { status: 400 });

    let theme = null;
    let project = null;
    try { theme = await base44.asServiceRole.entities.MarketItem.get(themeId); } catch { theme = null; }
    if (!theme || theme.category !== 'tema' || theme.status !== 'published') {
      return Response.json({ error: 'Tema bulunamadı.' }, { status: 404 });
    }

    try { project = await base44.asServiceRole.entities.ClientProject.get(projectId); } catch { project = null; }
    if (!project || project.client_email !== user.email) {
      return Response.json({ error: 'Bu proje size ait değil.' }, { status: 403 });
    }

    await base44.asServiceRole.entities.ClientProject.update(projectId, {
      theme_id: themeId,
      theme_name: theme.title,
    });
    return Response.json({ ok: true, theme_name: theme.title });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}