import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, PhoneCall } from 'lucide-react';
import { gradeOf, gradeColor, topActions } from '@/lib/seoScan';

// Tarama sonucu: puan göstergesi, kontrol listesi, aksiyon planı ve teklif formu
export default function ScanResult({ score, checks, url, onRestart }) {
  const grade = gradeOf(score);
  const color = gradeColor(score);
  const actions = topActions(checks, 3);
  const failed = checks.filter((c) => !c.pass);
  const [lead, setLead] = React.useState({ name: '', phone: '', email: '' });
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState('');

  const R = 52;
  const C = 2 * Math.PI * R;

  const submitLead = async () => {
    setError('');
    if (!lead.name.trim()) { setError('Adınızı yazın.'); return; }
    setSending(true);
    const { base44 } = await import('@/api/base44Client');
    try {
      await base44.entities.Lead.create({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        type: 'question',
        service: 'Ücretsiz SEO Analizi',
        estimate: `Skor ${score}/100 (${grade.label})`,
        message: `Taranan site: ${url}\nEksik bulunan: ${failed.length} kontrol\nKritik eksikler: ${failed.slice(0, 4).map((c) => c.label).join(', ') || 'yok'}`,
      });
      setSent(true);
    } catch {
      setError('Gönderilemedi; tekrar deneyin ya da iletişim sayfasını kullanın.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* puan göstergesi */}
      <div className="flex items-center gap-5">
        <div className="relative w-32 h-32 shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r={R} fill="none" stroke="hsl(var(--border))" strokeWidth="10" />
            <motion.circle
              cx="60" cy="60" r={R} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C - (C * score) / 100 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <span className="font-display font-bold text-3xl" style={{ color }}>{score}</span>
              <span className="block font-mono text-[10px] text-muted-foreground">/100 · {grade.letter}</span>
            </div>
          </div>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">SEO Sağlık Skoru</p>
          <p className="font-display font-bold text-xl mt-1" style={{ color }}>{grade.label}</p>
          <p className="text-xs text-foreground/60 mt-1.5 break-all">{url}</p>
        </div>
      </div>

      {/* aksiyon planı */}
      {actions.length > 0 && (
        <div className="rounded-2xl border border-sun/40 bg-sun/10 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-sun">İlk 3 aksiyon</p>
          <ul className="mt-2.5 space-y-2">
            {actions.map((a, i) => (
              <li key={i} className="text-xs text-foreground/85 flex gap-2"><span className="font-mono text-sun shrink-0">{i + 1}.</span> {a.label} — {a.tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* kontrol listesi */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2.5">
          Kontroller ({checks.filter((c) => c.pass).length}/{checks.length} geçti)
        </p>
        <div className="space-y-2">
          {checks.map((c, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-3 flex gap-3">
              <span className={`w-6 h-6 rounded-full shrink-0 grid place-items-center ${c.pass ? 'bg-mint/20 text-mint' : 'bg-coral/20 text-coral'}`}>
                {c.pass ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{c.label}</p>
                <p className="text-xs text-foreground/60 mt-0.5 leading-relaxed">{c.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* teklif formu */}
      {sent ? (
        <div className="rounded-2xl border border-mint/50 bg-mint/10 p-4 text-center">
          <Check className="w-6 h-6 text-mint mx-auto" />
          <p className="text-sm font-semibold text-mint mt-1.5">Talebiniz alındı!</p>
          <p className="text-xs text-foreground/70 mt-1">Skorunuza göre öncelikli önerileri içeren net teklif 24 saat içinde e-postanızda.</p>
          <button type="button" onClick={onRestart} className="mt-3 text-xs font-mono text-muted-foreground hover:text-mint underline">
            başka site tara
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-mint/40 bg-card p-4">
          <p className="text-sm font-display font-semibold flex items-center gap-2"><PhoneCall className="w-4 h-4 text-mint" /> Bu skoru düzeltelim</p>
          <p className="text-xs text-foreground/60 mt-1">Raporu uzman analiziyle birleştirip size özel düzeltme planı hazırlayalım — ücretsiz.</p>
          <div className="grid grid-cols-1 gap-2 mt-3">
            <input value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} placeholder="Ad soyad *" className="rounded-xl bg-terminal border border-border px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-mint" />
            <div className="grid grid-cols-2 gap-2">
              <input value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} placeholder="Telefon" className="rounded-xl bg-terminal border border-border px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-mint" />
              <input value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} placeholder="E-posta" className="rounded-xl bg-terminal border border-border px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-mint" />
            </div>
          </div>
          {error && <p className="text-xs text-coral mt-2">{error}</p>}
          <div className="flex items-center gap-3 mt-3">
            <button type="button" onClick={submitLead} disabled={sending} className="rounded-full bg-mint text-ink text-sm font-semibold px-5 py-2 hover:shadow-sticker transition-all disabled:opacity-50">
              {sending ? 'Gönderiliyor…' : 'Ücretsiz düzeltme planı'}
            </button>
            <button type="button" onClick={onRestart} className="text-xs font-mono text-muted-foreground hover:text-mint">yeni tarama</button>
          </div>
        </div>
      )}
    </div>
  );
}