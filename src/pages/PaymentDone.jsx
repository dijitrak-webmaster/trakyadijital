import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LogoMark } from '@/components/site/Logo';

/** iyzico ödeme sonucu sayfası — ödeme sonrası buraya dönülür. */
export default function PaymentDone() {
  const ok = new URLSearchParams(window.location.search).get('durum') !== 'basarisiz';
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background">
      <LogoMark className="w-14 h-14" />
      {ok ? (
        <>
          <CheckCircle2 className="w-12 h-12 text-mint mx-auto mt-6" />
          <h1 className="font-display text-2xl md:text-3xl font-semibold mt-4">Ödemeniz alındı</h1>
          <p className="mt-2 text-sm text-foreground/70 max-w-md">
            Teşekkürler! Siparişiniz ekibimizde; hazırlık sürecine hemen başlandı.
            Güncellemeler e-posta ve WhatsApp ile iletilecek.
          </p>
        </>
      ) : (
        <>
          <XCircle className="w-12 h-12 text-coral mx-auto mt-6" />
          <h1 className="font-display text-2xl md:text-3xl font-semibold mt-4">Ödeme tamamlanamadı</h1>
          <p className="mt-2 text-sm text-foreground/70 max-w-md">
            Ödemeniz alınamadı veya iptal edildi. Sepetinizden tekrar deneyebilir ya da
            ekibimiz size ödeme bağlantısı gönderebilir.
          </p>
        </>
      )}
      <Link to="/market" className="mt-8 rounded-full bg-mint text-ink font-semibold px-8 py-3 text-sm hover:shadow-sticker transition-shadow">
        Markete dön
      </Link>
    </div>
  );
}