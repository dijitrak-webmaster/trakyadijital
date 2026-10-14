// RDAP + DNS doğrulama yardımcıları — domainCheck ve domainSuggest ortak kullanır.
export const TR_MAP = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' };

export const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[çğıöşü]/g, (c) => TR_MAP[c])
    .replace(/[^a-z0-9]/g, '');

// Bilinen TLD'ler için doğrudan kayıt defteri RDAP'ı.
const KNOWN_RDAP = {
  com: (d) => `https://rdap.verisign.com/com/v1/domain/${d}`,
  net: (d) => `https://rdap.verisign.com/net/v1/domain/${d}`,
  org: (d) => `https://rdap.publicinterestregistry.org/rdap/domain/${d}`,
};

// IANA RDAP bootstrap — tüm TLD'lerin RDAP sunucuları; oturum boyunca önbelleklenir.
let bootstrap = null;
export const bootstrapRdapBase = async (tld) => {
  if (!bootstrap) {
    try {
      const res = await fetch('https://data.iana.org/rdap/dns.json', { signal: AbortSignal.timeout(8000) });
      bootstrap = res.ok ? (await res.json()).services || [] : [];
    } catch {
      bootstrap = [];
    }
  }
  for (const [tlds, urls] of bootstrap || []) {
    if (Array.isArray(tlds) && tlds.includes(tld)) return urls[0];
  }
  return null;
};

export const rdapUrlFor = async (tld, domain) => {
  if (KNOWN_RDAP[tld]) return KNOWN_RDAP[tld](domain);
  const base = await bootstrapRdapBase(tld);
  return base ? `${base.replace(/\/+$/, '')}/domain/${domain}` : null;
};

// Google DNS üzerinden NS kanıtı — RDAP'ı olmayan/engellenen uzantılar için.
export const hasNs = async (domain) => {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${domain}&type=NS`, { signal: AbortSignal.timeout(8000) });
    const data = await res.json().catch(() => ({}));
    return !!(data && data.Answer && data.Answer.length > 0);
  } catch {
    return false;
  }
};

// 'available' | 'taken' | 'unknown' — müsaitlik yalnızca RDAP 404 + DNS NS yoksa söylenir.
export const checkDomain = async (tld, domain) => {
  try {
    const url = await rdapUrlFor(tld, domain);
    if (!url) {
      // RDAP sunucusu yok (.tr gibi) — DNS NS kanıtı: kayıt varsa "taken", yoksa "unknown".
      return (await hasNs(domain)) ? 'taken' : 'unknown';
    }
    const res = await fetch(url, { redirect: 'follow' });
    if (res.status === 200) return 'taken';
    if (res.status === 404) {
      // RDAP kayıt yok diyor — DNS'te NS varsa kayıtlıdır (tutulmuş/askıda olabilir).
      return (await hasNs(domain)) ? 'taken' : 'available';
    }
    // RDAP engellendi/kapalı — DNS sinyaliyle müsaitlik doğrulanamaz, sadece kayıt tespit edilir.
    return (await hasNs(domain)) ? 'taken' : 'unknown';
  } catch {
    return (await hasNs(domain)) ? 'taken' : 'unknown';
  }
};