import React, { useState } from 'react';
import { Send, HelpCircle, User, Clock, Headset } from 'lucide-react';
import { base44 } from '@/api/base44Client';

/** Müşteri portalında soru-cevap: geçmiş sorular, yanıtlar ve yeni soru formu. */
export default function PortalQuestions({ messages, email, onAsked }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const ask = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const rec = await base44.entities.ClientMessage.create({ question: text.trim(), client_email: email });
      base44.functions.invoke('portalNotify', { event: 'question_created', message_id: rec.id }).catch(() => {});
      onAsked(rec);
      setText('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-card border border-border rounded-3xl p-6">
        <h3 className="font-display text-xl font-semibold">Bize bir sorun</h3>
        <p className="text-sm text-foreground/60 mt-1">Sorunuz ekibimize iletilir; yanıtlandığında burada görünür.</p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            placeholder="Örn. Sitemde yeni bir ödeme yöntemi ekleyebilir miyiz?"
            className="flex-1 rounded-2xl border border-border bg-secondary/60 p-3.5 text-sm outline-none focus:border-mint/50"
          />
          <button
            onClick={ask}
            disabled={sending || !text.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-mint text-ink font-semibold px-6 py-2.5 text-sm hover:shadow-sticker transition-shadow disabled:opacity-50 h-fit"
          >
            <Send className="w-4 h-4" /> {sending ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </div>
      </div>

      {!messages.length ? (
        <div className="border border-border rounded-3xl p-12 text-center">
          <HelpCircle className="w-10 h-10 text-mint mx-auto" />
          <p className="mt-4 text-foreground/70">Henüz sorunuz yok. İlk sorunuzu yukarıdan iletebilirsiniz.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="bg-card border border-border rounded-3xl p-5 md:p-6 hover:border-mint/30 transition-colors space-y-3">
              <div className="flex items-center justify-end gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span className="truncate">{new Date(m.created_date).toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                <User className="w-3 h-3" />
                <span>Siz</span>
              </div>
              <div className="flex justify-end">
                <p className="max-w-[90%] rounded-2xl bg-secondary/60 border border-border px-4 py-3 text-sm font-semibold whitespace-pre-line leading-relaxed">{m.question}</p>
              </div>
              {m.answer ? (
                <>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-mint">
                    <Headset className="w-3 h-3" />
                    <span>Dijitrak ekibi</span>
                  </div>
                  <p className="max-w-[90%] rounded-2xl bg-card border border-mint/30 px-4 py-3 text-sm text-foreground/85 whitespace-pre-line leading-relaxed">{m.answer}</p>
                </>
              ) : (
                <p className="inline-flex items-center gap-1.5 rounded-full bg-sun/15 px-3.5 py-1.5 font-mono text-[11px] text-sun">
                  <Clock className="w-3.5 h-3.5" /> Ekip yanıtı bekleniyor
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}