import React from 'react';
import { base44 } from '@/api/base44Client';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import Reveal from '@/components/site/Reveal';

// Blog bülteni kaydı — e-posta Lead olarak kaydedilir (gönderim bağlanacak)
export default function NewsletterSignup() {
  const { tl } = useLanguage();
  const [email, setEmail] = React.useState('');
  const [state, setState] = React.useState('idle'); // idle | loading | done | error

  const submit = async (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!value || !value.includes('@')) return;
    setState('loading');
    try {
      await base44.entities.Lead.create({
        name: 'Bülten Abonesi',
        email: value,
        type: 'question',
        service: 'Bülten aboneliği',
        message: 'Blog sayfasından bülten kaydı',
      });
      setState('done');
    } catch {
      setState('error');
    }
  };

  return (
    <Reveal className="mt-16">
      <div className="rounded-[2rem] border-2 border-dashed border-mint/40 bg-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <span className="shrink-0 w-12 h-12 rounded-2xl bg-mint/15 text-mint flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </span>
          {state === 'done' ? (
            <p className="flex-1 text-sm font-semibold text-mint flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" /> {tl('Kaydınız alındı! Yeni rehberler bültenimize düşecek.')}
            </p>
          ) : (
            <>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-display font-semibold text-xl">{tl('Dijitrak Bülteni')}</h3>
                <p className="text-sm text-foreground/70 mt-1">{tl('Ayda bir e-posta: Trakya işletmeleri için uygulanabilir dijital ipuçları.')}</p>
              </div>
              <form onSubmit={submit} className="w-full sm:w-auto flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={tl('E-posta adresiniz')}
                  className="rounded-full border border-border bg-secondary/60 px-5 py-3 text-sm outline-none focus:border-mint/60 w-full sm:w-64"
                />
                <button
                  type="submit"
                  disabled={state === 'loading'}
                  className="rounded-full bg-mint text-ink font-semibold px-6 py-3 text-sm inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-sticker transition-all disabled:opacity-60"
                >
                  {state === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                  {tl('Kaydol')}
                </button>
              </form>
            </>
          )}
        </div>
        {state === 'error' && (
          <p className="text-xs text-coral mt-3">{tl('Kayıt yapılamadı, lütfen tekrar deneyin.')}</p>
        )}
      </div>
    </Reveal>
  );
}