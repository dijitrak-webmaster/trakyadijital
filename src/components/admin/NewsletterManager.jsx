import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, MailCheck, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NewsletterManager() {
  const [count, setCount] = useState(null);
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | done
  const [error, setError] = useState('');

  useEffect(() => {
    base44.entities.Lead.filter({ service: 'Bülten aboneliği' }, '-created_date', 200)
      .then((leads) => setCount(new Set(leads.map((l) => (l.email || '').toLowerCase())).size))
      .catch(() => setCount(0));
  }, []);

  const send = async () => {
    setError('');
    setState('sending');
    try {
      const res = await base44.functions.invoke('sendNewsletter', { subject, text });
      setSubject('');
      setText('');
      setState('done');
      return res;
    } catch (e) {
      setError(e?.response?.data?.error || e.message || 'Gönderim başlatılamadı.');
      setState('idle');
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 border border-border rounded-3xl bg-card p-6 space-y-4">
        <div>
          <label className="font-mono text-xs uppercase text-mint">Konu</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={150}
            placeholder="Ör. Ekim ayında Trakya'da e-ticaret"
            className="mt-2 w-full rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm outline-none focus:border-mint/60"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase text-mint">İçerik</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            maxLength={10000}
            placeholder="Bülten metni — boş satırlar paragraf olarak gönderilir."
            className="mt-2 w-full rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm outline-none focus:border-mint/60 resize-y"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={send} disabled={state === 'sending' || !subject.trim() || !text.trim()} className="rounded-full bg-mint text-ink font-semibold px-6">
            {state === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Gönderimi Başlat
          </Button>
          <span className="font-mono text-xs text-muted-foreground">Konu en fazla 150, metin en fazla 10.000 karakter.</span>
        </div>
        {error && <p className="text-sm text-coral">{error}</p>}
        {state === 'done' && (
          <p className="text-sm text-mint flex items-center gap-2">
            <MailCheck className="w-4 h-4" /> Gönderim kuyruğa alındı — abonelere arka planda iletiliyor.
          </p>
        )}
      </div>
      <div className="border border-border rounded-3xl bg-card p-6 h-fit">
        <p className="font-mono text-xs uppercase text-muted-foreground">Abone Sayısı</p>
        <p className="font-display text-4xl font-semibold mt-2">
          {count === null ? <Loader2 className="w-6 h-6 animate-spin text-mint" /> : count}
        </p>
        <p className="text-xs text-foreground/60 mt-2">Blog sayfasından bülten kaydı yapan ziyaretçiler. Gönderim çağrı başına en fazla 200 aboneye ulaşır.</p>
      </div>
    </div>
  );
}