// DijiBot içi AI destekli alan adı önerisi — kontrollü: tek AI çağrısı, en fazla 5 doğrulanmış öneri.
// Önerilen her isim RDAP/DNS ile kayıt defterinde gerçekten müsait olduğu doğrulanmadan dönmez.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { askOpenAIJson } from '../../shared/openai.ts';
import { slugify, checkDomain } from '../../shared/domainAvailability.ts';

const MAX_CHECK = 8; // doğrulanacak aday sayısı
const MAX_SUGGEST = 5; // önerilecek maksimum isim

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const businessName = String(body.businessName || '').slice(0, 60).trim();
    const exclude = (Array.isArray(body.exclude) ? body.exclude : []).map((s) => String(s).toLowerCase()).slice(0, 30);
    if (!businessName) return Response.json({ error: 'İşletme adı gerekli.' }, { status: 400 });

    // 1) AI: işletme adına göre yaratıcı kök adayları (tek çağrı, sınırlı sayıda)
    let aiNames = [];
    try {
      const ai = await askOpenAIJson({
        user: `Türkçe bir işletme adı verildi: "${businessName}". Bu işletme için alternatif alan adı kökleri öner. Kurallar: yalnızca küçük a-z harfleri ve rakamlar; Türkçe özel karakter yok (ç→c, ş→s, ğ→g, ü→u, ö→o, ı→i); 3-16 karakter; kısa, akılda kalıcı ve telaffuzu kolay. Yaklaşımlar: adın bitişik yazımı, kısaltması, "get/by/go" öneki, "global/web/ofis/evi/tr" soneki, hafif yaratıcı varyasyonlar. Tam 10 adet öner, liste halinde. JSON ciktisi: {"names": ["ad1", "ad2", ...]}.`,
      });
      aiNames = Array.isArray(ai?.names) ? ai.names : [];
    } catch { /* AI yoksa kural tabanlı adaylara düş */ }

    // 2) temizle + tekrar/hariç tutulanları ele; AI boşsa kural tabanlı adaylar
    const base = slugify(businessName);
    const fallback = base.length >= 3
      ? [base, `${base}global`, `${base}web`, `by${base}`, `${base}evi`, `${base}co`, `get${base}`, `${base}ofis`]
      : [];
    const seen = new Set(exclude);
    const candidates = [];
    for (const raw of [...aiNames, ...fallback]) {
      const n = slugify(raw);
      if (n.length < 3 || n.length > 20 || seen.has(n)) continue;
      seen.add(n);
      candidates.push(n);
      if (candidates.length >= MAX_CHECK) break;
    }

    // 3) kayıt defterinde doğrula — yalnızca GERÇEKTEN müsait olanlar önerilir
    const suggestions = [];
    for (const name of candidates) {
      for (const tld of ['com', 'net']) {
        if (await checkDomain(tld, `${name}.${tld}`) === 'available') {
          suggestions.push({ name, tld, domain: `${name}.${tld}` });
          break;
        }
      }
      if (suggestions.length >= MAX_SUGGEST) break;
    }

    return Response.json({ suggestions });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}