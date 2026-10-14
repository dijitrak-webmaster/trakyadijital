import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

const client = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  appBaseUrl
});

// ── 429 (Rate limit exceeded) → bekle, yeniden dene ─────────────
// Platform tarafı istek limiti kısa süreli olarak dolduğunda hata kullanıcıya
// düşmesin: tüm entity ve fonksiyon çağrıları tek noktadan sarılıdır.
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const isRateLimited = (e) => e?.status === 429 || /rate limit/i.test(e?.message || '');
const MAX_RETRIES = 4;

const withRetry = (fn) => async (...args) => {
  let attempt = 0;
  for (;;) {
    try {
      return await fn(...args);
    } catch (e) {
      if (!isRateLimited(e) || attempt >= MAX_RETRIES) throw e;
      await wait(900 * 2 ** attempt + Math.random() * 400);
      attempt += 1;
    }
  }
};

// ── eşzamanlılık kuyruğu ─────────────────────────────────────────
// Bir sayfa aynı anda onlarca liste/filtre isteği açtığında platform hız
// limiti dolup hata kullanıcıya düşüyor. Tüm çağrılar bu FIFO kuyruktan
// geçer; aynı anda en fazla MAX_CONCURRENT istek havalanır.
const MAX_CONCURRENT = 4;
let active = 0;
const queue = [];
const pump = () => {
  while (active < MAX_CONCURRENT && queue.length > 0) {
    const job = queue.shift();
    active += 1;
    job.start().then(job.resolve, job.reject).finally(() => {
      active -= 1;
      pump();
    });
  }
};
const limit = (fn) => (...args) =>
  new Promise((resolve, reject) => {
    queue.push({ start: () => fn(...args), resolve, reject });
    pump();
  });

// entities Proxy başına erişimde yeni handler üretir → sarılıp önbelleğe alınır
const entityCache = new Map();
const entities = new Proxy(
  {},
  {
    get(_target, entityName) {
      if (typeof entityName !== 'string' || entityName === 'then' || entityName.startsWith('_')) return undefined;
      if (!entityCache.has(entityName)) {
        const handler = client.entities[entityName];
        const wrapped = {};
        Object.keys(handler).forEach((key) => {
          const val = handler[key];
          if (typeof val === 'function' && key !== 'subscribe') wrapped[key] = limit(withRetry(val));
          else wrapped[key] = val;
        });
        entityCache.set(entityName, wrapped);
      }
      return entityCache.get(entityName);
    },
  }
);

// functions.invoke tek noktadan sarılır
if (client.functions && typeof client.functions.invoke === 'function') {
  client.functions.invoke = limit(withRetry(client.functions.invoke.bind(client.functions)));
}

export const base44 = new Proxy(client, {
  get(_target, prop) {
    if (prop === 'entities') return entities;
    return client[prop];
  },
});