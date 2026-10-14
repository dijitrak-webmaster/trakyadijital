import React from 'react';
import { base44 } from '@/api/base44Client';
import { ShieldAlert, LogOut } from 'lucide-react';

const UserNotRegisteredError = () => (
  <div className="min-h-screen flex items-center justify-center bg-background px-4">
    <div className="max-w-md w-full text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-coral mb-5">
        <ShieldAlert className="w-7 h-7 text-ink" aria-hidden="true" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Bu hesap davetli değil</h1>
      <p className="text-muted-foreground mt-3 leading-relaxed">
        Dijitrak'a giriş yalnızca davet edilen hesaplarla açılır. İşletmenizle anlaşma sağlandığında
        yönetici size e-posta daveti gönderir — davetteki bağlantıyla hesabınızı açabilirsiniz.
      </p>
      <div className="bg-card rounded-2xl border border-border p-5 mt-6 text-sm text-muted-foreground">
        Yanlış hesapla giriş yaptıysanız çıkış yapıp davet geldiği hesapla tekrar deneyin.
        Davet e-postanız ulaşmadıysa yöneticinize haber verin.
      </div>
      <button
        onClick={() => base44.auth.logout('/login')}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-6 py-3 hover:shadow-sticker transition-shadow"
      >
        <LogOut className="w-4 h-4" /> Çıkış Yap ve Girişe Dön
      </button>
    </div>
  </div>
);

export default UserNotRegisteredError;