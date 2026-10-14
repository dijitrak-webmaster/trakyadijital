import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Instagram Business hesabının son gönderilerini ana sayfa vitrini için getirir.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');

    // Kullanıcı kimliği önce alınır (Instagram Graph API kuralı)
    const meRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
    const me = await meRes.json();
    if (me.error) return Response.json({ error: me.error.message }, { status: 502 });

    const mediaRes = await fetch(
      `https://graph.instagram.com/${me.id}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&limit=8&access_token=${accessToken}`
    );
    const media = await mediaRes.json();
    if (media.error) return Response.json({ error: media.error.message }, { status: 502 });

    const posts = (media.data || [])
      .map((p) => ({
        id: p.id,
        type: p.media_type,
        image: p.media_type === 'VIDEO' || p.media_type === 'CAROUSEL_ALBUM' ? (p.thumbnail_url || p.media_url) : p.media_url,
        caption: (p.caption || '').slice(0, 160),
        permalink: p.permalink,
        timestamp: p.timestamp,
      }))
      .filter((p) => p.image);

    return Response.json({ username: me.username, posts });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}