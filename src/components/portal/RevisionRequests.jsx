import React, { useState } from 'react';
import { Send, CheckCircle2, Clock3 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

/** Portalda revizyon talebi — müşteri yazar, ekibin panelinde "beklemede" görünür */
export default function RevisionRequests({ projectId, requests, email, onAdded, loading }) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    if (!text.trim()) return;
    setSaving(true);
    const rec = await base44.entities.RevisionRequest.create({ project_id: projectId, client_email: email, text: text.trim() });
    base44.functions.invoke('portalNotify', { event: 'revision_created', revision_id: rec.id }).catch(() => {});
    setText('');
    setSaving(false);
    onAdded?.(rec);
  };
  return (
    <div>
      <span className="font-mono text-xs uppercase text-mint">Revizyon talepleri</span>
      {requests.length > 0 && (
        <div className="mt-3 space-y-2.5">
          {requests.map((r) => (
            <div key={r.id} className="flex items-start gap-2.5 text-sm">
              {r.status === 'resolved' ? <CheckCircle2 className="w-4 h-4 text-mint mt-0.5 shrink-0" /> : <Clock3 className="w-4 h-4 text-sun mt-0.5 shrink-0" />}
              <div className="min-w-0">
                <p className="whitespace-pre-line leading-snug">{r.text}</p>
                <span className="font-mono text-[10px] text-muted-foreground">{r.status === 'resolved' ? 'Çözüldü' : 'Beklemede'}</span>
                {r.status === 'resolved' && r.response && (
                  <div className="mt-1.5 rounded-xl bg-mint/10 border border-mint/30 px-3 py-2 text-xs leading-snug">
                    <span className="font-semibold text-mint">Ekibin yanıtı: </span>
                    <span className="whitespace-pre-line">{r.response}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {loading && (
        <div className="mt-3 space-y-2.5">
          <div className="h-12 rounded-xl bg-secondary/60 animate-pulse" />
        </div>
      )}
      <div className="flex gap-2 mt-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Revizyon talebinizi yazın..."
          className="flex-1 rounded-full border border-border bg-secondary/60 px-4 py-2 text-sm outline-none focus:border-mint/50"
        />
        <button onClick={submit} disabled={saving || !text.trim()} className="rounded-full bg-mint text-ink p-2.5 hover:shadow-sticker transition-shadow disabled:opacity-50" aria-label="Gönder">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}