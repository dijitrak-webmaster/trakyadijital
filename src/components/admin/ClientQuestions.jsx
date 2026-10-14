import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Check, HelpCircle } from 'lucide-react';
import { input } from '@/components/admin/formKit';

/** Yönetim paneli: müşteri sorularını yanıtlama arayüzü. */
export default function ClientQuestions() {
  const [items, setItems] = useState(null);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(null);

  const load = () => base44.entities.ClientMessage.list('-created_date', 200).then(setItems);
  useEffect(() => { load(); }, []);

  const saveAnswer = async (m) => {
    if (saving) return;
    setSaving(m.id);
    try {
      const isNew = !m.answer;
      await base44.entities.ClientMessage.update(m.id, { answer: answers[m.id] ?? m.answer ?? '' });
      if (isNew) base44.functions.invoke('portalNotify', { event: 'question_answered', message_id: m.id }).catch(() => {});
      setItems((ls) => ls.map((i) => (i.id === m.id ? { ...i, answer: answers[m.id] ?? i.answer ?? '' } : i)));
    } finally {
      setSaving(null);
    }
  };

  if (items === null) {
    return <div className="border border-border p-10 text-center font-mono text-sm text-muted-foreground">Yükleniyor...</div>;
  }
  if (!items.length) {
    return (
      <div className="border border-border rounded-2xl p-10 text-center font-mono text-sm text-muted-foreground">
        Henüz müşteri sorusu yok.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((m) => (
        <div key={m.id} className="border border-border rounded-2xl bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-xs text-muted-foreground">
              {m.client_email} · {new Date(m.created_date).toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
            <span className={`rounded-full px-4 py-1 text-xs font-semibold ${m.answer ? 'bg-mint text-ink' : 'bg-sun text-ink'}`}>
              {m.answer ? 'Yanıtlandı' : 'Yanıt bekliyor'}
            </span>
          </div>
          <p className="font-semibold mt-3 whitespace-pre-line flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-mint shrink-0 mt-0.5" /> {m.question}
          </p>
          <div className="mt-4 flex flex-col md:flex-row gap-3">
            <textarea
              value={answers[m.id] ?? m.answer ?? ''}
              onChange={(e) => setAnswers((a) => ({ ...a, [m.id]: e.target.value }))}
              rows={2}
              placeholder="Dijitrak yanıtı..."
              className={`flex-1 ${input}`}
            />
            <button
              onClick={() => saveAnswer(m)}
              disabled={saving === m.id}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-mint text-ink font-semibold px-5 py-2.5 text-sm hover:shadow-sticker transition-shadow disabled:opacity-50 h-fit"
            >
              <Check className="w-4 h-4" /> {saving === m.id ? 'Kaydediliyor...' : 'Yanıtı kaydet'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}