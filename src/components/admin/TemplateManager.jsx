import React, { useEffect, useState } from 'react';
import { Send, Loader2, CheckCircle2, XCircle, Info } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Meta onaylı şablon mesaj gönderimi — 24 saat penceresi dışı iletişim.
// Şablonlar Meta Business Manager > WhatsApp > Mesaj Şablonları'ndan
// oluşturulup onaylanır; onaylanan şablonun adı buraya yazılarak gönderilir.
const LANGS = ['tr', 'en', 'de', 'ar'];

export default function TemplateManager() {
  const [phones, setPhones] = useState([]); // {phone, label}
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // {ok, message}
  const [form, setForm] = useState({
    phone: '',
    template: '',
    language: 'tr',
    varCount: 0,
    vars: ['', '', '', ''],
  });

  useEffect(() => {
    // Alıcı önerileri: eşleştirilmiş müşteri numaraları + WhatsApp'tan yazanlar
    base44.entities.ClientPhone.list('-created_date', 100)
      .then((rows) => setPhones(rows.map((r) => ({ phone: r.phone, label: r.client_email || r.note || 'Müşteri' }))))
      .catch(() => {});
    base44.entities.Lead.filter({ referral: 'whatsapp' }, '-created_date', 100)
      .then((rows) => {
        setPhones((prev) => {
          const seen = new Set(prev.map((p) => p.phone));
          const extra = rows
            .filter((r) => r.phone && !seen.has(r.phone))
            .map((r) => ({ phone: r.phone, label: r.name || 'WhatsApp lead' }));
          return [...prev, ...extra];
        });
      })
      .catch(() => {});
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setVar = (i, v) => setForm((f) => {
    const vars = [...f.vars];
    vars[i] = v;
    return { ...f, vars };
  });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await base44.functions.invoke('whatsappTemplate', {
        phone: form.phone.trim(),
        template: form.template.trim(),
        language: form.language,
        params: form.vars.slice(0, form.varCount),
      });
      if (res.data?.ok) {
        setResult({ ok: true, message: 'Mesaj gönderildi — alıcının WhatsApp\'ında şablon olarak görünecek.' });
        setForm((f) => ({ ...f, phone: '', vars: ['', '', '', ''] }));
      } else {
        setResult({ ok: false, message: res.data?.error || 'Gönderim başarısız.' });
      }
    } catch (err) {
      setResult({ ok: false, message: err?.response?.data?.error || err?.message || 'Gönderim başarısız.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-2xl border border-fog/30 bg-card/60 p-4 text-sm text-foreground/75">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-fog" />
        <p>
          Şablonları önce Meta Business Manager → WhatsApp → <span className="font-semibold text-foreground">Mesaj Şablonları</span> bölümünde oluşturup onaylatın
          (ör. <span className="font-mono text-xs text-mint">abonelik_hatirlatma</span>). Onaylanan şablonun adını ve değişkenlerini buraya yazıp gönderin;
          şablon mesajlar, müşteri son yazışmasından 24 saat geçse bile ulaşır.
        </p>
      </div>

      <form onSubmit={submit} className="rounded-2xl border-2 border-border bg-card p-5 space-y-4">
        <div>
          <label className="font-mono text-xs text-muted-foreground">Alıcı numara</label>
          <input
            list="tm-phones"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="905xxxxxxxxx"
            className="w-full mt-1.5 rounded-xl bg-terminal border border-border px-4 py-2.5 text-sm font-mono focus:border-mint outline-none"
          />
          <datalist id="tm-phones">
            {phones.map((p) => <option key={p.phone} value={p.phone} />)}
          </datalist>
          {phones.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {phones.slice(0, 8).map((p) => (
                <button
                  key={p.phone}
                  type="button"
                  onClick={() => set('phone', p.phone)}
                  className="rounded-full border border-border px-3 py-1 text-[11px] font-mono text-foreground/60 hover:border-mint hover:text-mint transition-colors"
                  title={p.label}
                >
                  {p.phone}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-xs text-muted-foreground">Şablon adı (Meta'da onaylı)</label>
            <input
              value={form.template}
              onChange={(e) => set('template', e.target.value)}
              placeholder="abonelik_hatirlatma"
              className="w-full mt-1.5 rounded-xl bg-terminal border border-border px-4 py-2.5 text-sm font-mono focus:border-mint outline-none"
            />
          </div>
          <div>
            <label className="font-mono text-xs text-muted-foreground">Dil kodu</label>
            <select
              value={form.language}
              onChange={(e) => set('language', e.target.value)}
              className="w-full mt-1.5 rounded-xl bg-terminal border border-border px-4 py-2.5 text-sm focus:border-mint outline-none"
            >
              {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="font-mono text-xs text-muted-foreground">Değişken sayısı (şablondaki {'{{1}}'} adedi)</label>
          <div className="mt-1.5 flex gap-1.5">
            {[0, 1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => set('varCount', n)}
                className={`w-10 h-10 rounded-xl border text-sm font-mono transition-colors ${
                  form.varCount === n ? 'bg-mint text-ink border-mint font-bold' : 'border-border text-foreground/60 hover:border-mint'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          {Array.from({ length: form.varCount }, (_, i) => (
            <input
              key={i}
              value={form.vars[i]}
              onChange={(e) => setVar(i, e.target.value)}
              placeholder={`Değişken {{${i + 1}}} değeri`}
              className="w-full mt-2 rounded-xl bg-terminal border border-border px-4 py-2.5 text-sm focus:border-mint outline-none"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || !form.phone.trim() || !form.template.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-mint px-5 py-2.5 text-sm font-bold text-ink hover:bg-mint/85 transition-colors disabled:opacity-40"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Şablonu gönder
        </button>
      </form>

      {result && (
        <div className={`flex items-start gap-2 rounded-2xl border-2 p-4 text-sm ${result.ok ? 'border-mint/50 text-mint' : 'border-coral/50 text-coral'}`}>
          {result.ok ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> : <XCircle className="w-4 h-4 mt-0.5 shrink-0" />}
          <span>{result.message}</span>
        </div>
      )}
    </div>
  );
}