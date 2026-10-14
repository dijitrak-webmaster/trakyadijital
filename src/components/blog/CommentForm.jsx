import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const field = 'w-full rounded-2xl bg-card border border-border px-4 py-3 text-sm outline-none focus:border-mint/60';

/** Blog yazısına yorum formu — yorum 'pending' olarak kaydedilir, admin onayı sonrası yayına girer. */
export default function CommentForm({ slug, onDone }) {
  const { tl } = useLanguage();
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | done | error

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setState('sending');
    try {
      await base44.entities.BlogComment.create({ blog_slug: slug, author_name: name.trim(), text: text.trim() });
      setState('done');
      onDone?.();
    } catch {
      setState('error');
    }
  };

  if (state === 'done') {
    return (
      <div className="rounded-3xl border border-mint/40 bg-mint/10 p-6 text-sm text-center">
        {tl('Yorumunuz alındı! Onaylandıktan sonra burada görünecek.')}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-border bg-card/50 p-6">
      <p className="inline-flex items-center gap-2 font-display font-semibold">
        <MessageCircle className="w-4 h-4 text-mint" /> {tl('Yorum yaz')}
      </p>
      <div className="grid gap-3 mt-4">
        <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder={tl('Adınız')} maxLength={60} />
        <textarea className={field} value={text} onChange={(e) => setText(e.target.value)} placeholder={tl('Yorumunuz')} rows={3} maxLength={1000} />
      </div>
      {state === 'error' && <p className="text-coral text-xs mt-2">{tl('Yorum gönderilemedi, lütfen tekrar deneyin.')}</p>}
      <button
        type="submit"
        disabled={state === 'sending' || !name.trim() || !text.trim()}
        className="mt-4 rounded-full bg-mint text-ink font-semibold px-6 py-2.5 text-sm disabled:opacity-50 hover:shadow-sticker transition-shadow"
      >
        {state === 'sending' ? tl('Gönderiliyor...') : tl('Gönder')}
      </button>
    </form>
  );
}