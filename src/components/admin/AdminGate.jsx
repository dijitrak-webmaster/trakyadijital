import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export default function AdminGate({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(false));
  }, []);

  if (user === null) {
    return <div className="min-h-screen flex items-center justify-center font-mono text-sm text-muted-foreground">Yükleniyor...</div>;
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-display text-3xl font-semibold">Bu alan yalnızca yöneticiler içindir.</h1>
        <Link to="/" className="rounded-full bg-mint text-ink font-semibold px-6 py-3">Siteye dön</Link>
      </div>
    );
  }

  return <>{children}</>;
}