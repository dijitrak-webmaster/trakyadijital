// Alan adı uygunluk kontrolü — kayıt defterlerinin RDAP uçları + Google DNS doğrulaması; API anahtarı gerekmez.
// Doğrulama mantığı base44/shared/domainAvailability.ts'te, domainSuggest ile paylaşımlı.
import {
  TR_MAP, slugify, rdapUrlFor, hasNs, checkDomain,
} from '../../shared/domainAvailability.ts';

const TLDS = ['com', 'com.tr', 'net', 'org'];
// İkinci seviye etiketler: bunlardan biri + ccTLD (tr, uk...) → çok parçalı TLD
const MULTI_SLD = new Set(['com', 'co', 'net', 'org', 'gov', 'edu', 'k12', 'av', 'bel', 'mil', 'name', 'info', 'biz']);

// Kullanıcı tam adres de yazabilir (örn. "murefte.com", "firma.io") — etiketi ve TLD'yi ayır.
const parseInput = (raw) => {
  let v = String(raw || '').toLowerCase().trim();
  v = v.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  v = v.replace(/[çğıöşü]/g, (c) => TR_MAP[c]);
  if (v.includes('.')) {
    const parts = v.split('.').filter(Boolean);
    let tld = parts.pop();
    // İkinci seviye uzantılar (com.tr, co.uk gibi): "com" + "tr" → "com.tr"
    if (parts.length && tld.length === 2 && MULTI_SLD.has(parts[parts.length - 1])) {
      tld = `${parts.pop()}.${tld}`;
    }
    const slug = parts.join('').replace(/[^a-z0-9]/g, '');
    if (tld && /^[a-z0-9]{2,10}(\.[a-z0-9]{2,10})?$/.test(tld) && slug.length >= 2) {
      return { slug, preferredTld: tld };
    }
    return null;
  }
  const slug = v.replace(/[^a-z0-9]/g, '');
  return slug.length >= 2 ? { slug, preferredTld: null } : null;
};

export default async function(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = parseInput(body.name);
    if (!parsed) return Response.json({ error: 'Geçerli bir işletme adı veya adres girin.' }, { status: 400 });
    const { slug, preferredTld } = parsed;

    // Kullanıcı belirli bir TLD yazdıysa onu ilk sıraya al (her uzantı desteklenir).
    const tlds = preferredTld ? [preferredTld, ...TLDS.filter((t) => t !== preferredTld)] : TLDS;
    const domains = await Promise.all(
      tlds.map(async (tld) => ({ tld, state: await checkDomain(tld, `${slug}.${tld}`) })),
    );
    const firstFree = domains.find((d) => d.state === 'available');
    return Response.json({
      slug,
      domains,
      emailSuggestion: firstFree ? `info@${slug}.${firstFree.tld}` : null,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}