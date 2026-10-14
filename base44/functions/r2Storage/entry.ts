import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { secrets } from 'base44:runtime';

const enc = new TextEncoder();

async function hmacSha256(keyBytes, msg) {
  const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(msg));
  return new Uint8Array(sig);
}

async function sha256Hex(msg) {
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(msg));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function parseR2Uri(fileUri) {
  const m = /^r2:\/\/([^/]+)\/(.+)$/.exec(fileUri);
  if (!m) return null;
  return { bucket: m[1], key: m[2] };
}

async function presign({ accountId, accessKey, secretKey, bucket, key, expires, method }) {
  const host = `${accountId}.r2.cloudflarestorage.com`;
  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const scope = `${dateStamp}/auto/s3/aws4_request`;
  const credential = encodeURIComponent(`${accessKey}/${scope}`);
  const canonicalRequest = [
    method,
    `/${bucket}/${key}`,
    `X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=${credential}&X-Amz-Date=${amzDate}&X-Amz-Expires=${expires}&X-Amz-SignedHeaders=host`,
    `host:${accountId}.r2.cloudflarestorage.com\n`,
    'host',
    'UNSIGNED-PAYLOAD',
  ].join('\n');
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    scope,
    await sha256Hex(canonicalRequest),
  ].join('\n');

  let kDate = await hmacSha256(enc.encode(`AWS4${secretKey}`), dateStamp);
  let kRegion = await hmacSha256(kDate, 'auto');
  let kService = await hmacSha256(kRegion, 's3');
  let kSigning = await hmacSha256(kService, 'aws4_request');
  const signature = [...await hmacSha256(kSigning, stringToSign)]
    .map((b) => b.toString(16).padStart(2, '0')).join('');

  return `https://${host}/${bucket}/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=${credential}&X-Amz-Date=${amzDate}&X-Amz-Expires=${expires}&X-Amz-SignedHeaders=host&X-Amz-Signature=${signature}`;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const action = body.action;

    const accountId = (secrets.get('CLOUDFLARE_ACCOUNT_ID') || '').trim();
    const accessKey = (secrets.get('R2_ACCESS_KEY_ID') || '').trim();
    const secretKey = (secrets.get('R2_SECRET_ACCESS_KEY') || '').trim();
    const bucket = (secrets.get('R2_BUCKET') || '').trim();
    if (!accountId || !accessKey || !secretKey || !bucket) {
      return Response.json({ error: 'R2 ayarları eksik — gizli anahtarları tamamlamalısınız.' }, { status: 500 });
    }

    if (action === 'presign_put') {
      const safeName = String(body.fileName || 'dosya').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
      const key = `private/${Date.now()}-${Math.random().toString(36).slice(2, 10)}/${safeName}`;
      const expires = Math.min(Math.max(Number(body.expires_in) || 900, 60), 3600);
      const upload_url = await presign({ accountId, accessKey, secretKey, bucket, key, expires, method: 'PUT' });
      return Response.json({ upload_url, file_uri: `r2://${bucket}/${key}` });
    }

    if (action === 'presign_get') {
      const parsed = parseR2Uri(String(body.file_uri || ''));
      if (!parsed) return Response.json({ error: 'Geçersiz dosya adresi.' }, { status: 400 });
      const expires = Math.min(Math.max(Number(body.expires_in) || 600, 60), 7200);
      const signed_url = await presign({ accountId, accessKey, secretKey, bucket: parsed.bucket, key: parsed.key, expires, method: 'GET' });
      return Response.json({ signed_url });
    }

    return Response.json({ error: 'Bilinmeyen işlem.' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}