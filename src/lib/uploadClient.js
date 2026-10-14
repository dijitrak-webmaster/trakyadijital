import { base44 } from '@/api/base44Client';

/**
 * Cloudflare R2 (S3 uyumlu) özel depoya gerçek ilerleme takibli yükleme.
 * Sunucudan kısa süreli imzalı PUT adresi alınır, dosya doğrudan R2'ye XHR ile gider.
 * Dönen değer: { file_uri } — "r2://" önekli özel adres.
 */
export function uploadWithProgress(file, { onProgress, signal } = {}) {
  return base44.functions
    .invoke('r2Storage', { action: 'presign_put', fileName: file.name })
    .then(({ data }) => new Promise((resolve, reject) => {
      if (!data?.upload_url || !data?.file_uri) return reject(new Error('Sunucu yükleme adresi döndürmedi.'));
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', data.upload_url, true);
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.min(99, Math.round((e.loaded / e.total) * 100)));
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress?.(100);
          resolve({ file_uri: data.file_uri });
        } else if (xhr.status === 429) {
          reject(new Error('Hizmet yoğun — birkaç saniye sonra tekrar deneyin.'));
        } else {
          reject(new Error(`Yükleme başarısız (HTTP ${xhr.status}).`));
        }
      };
      xhr.onerror = () => reject(new Error('Ağ hatası — yükleme tamamlanamadı.'));
      xhr.onabort = () => reject(new Error('Yükleme iptal edildi.'));
      if (signal) {
        signal.addEventListener('abort', () => xhr.abort(), { once: true });
      }
      xhr.send(file);
    }))
    .catch((e) => {
      if (e instanceof Error && /iptal|yoğun|başarısız|Ağ|adresi/.test(e.message)) throw e;
      throw new Error(e?.response?.data?.error || e?.message || 'Yükleme hazırlanamadı.');
    });
}

/** Dosyayı imzalı bağlantıyla açar: R2 dosyaları fonksiyondan, eski özel dosyalar Core'dan imzalanır. */
export async function signFileUri(file_uri, expires_in = 600) {
  if (file_uri && String(file_uri).startsWith('r2://')) {
    const { data } = await base44.functions.invoke('r2Storage', { action: 'presign_get', file_uri, expires_in });
    return { signed_url: data?.signed_url };
  }
  return base44.integrations.Core.CreateFileSignedUrl({ file_uri, expires_in });
}