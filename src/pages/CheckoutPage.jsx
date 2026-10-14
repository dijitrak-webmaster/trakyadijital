import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShoppingBag, CreditCard, Trash2, Send, Zap, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useCart } from '@/lib/CartContext';
import { Image } from '@/components/ui/image';

const CAT = { tema: 'Tema', paket: 'Paket', nfckart: 'NFC Kart', eklenti: 'Eklenti' };
const inputCls = 'w-full rounded-2xl border border-border bg-secondary/60 px-4 py-2.5 text-sm outline-none focus:border-mint/50';

/** Profesyonel ödeme ekranı: sepet, indirim kodu, iletişim ve iyzico güvenli ödeme. */
export default function CheckoutPage() {
  const { items, remove, clear, total, discount, discountAmount, discountedTotal, applyDiscount, removeDiscount } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [discCode, setDiscCode] = useState('');
  const [discBusy, setDiscBusy] = useState(false);
  const [discErr, setDiscErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const applyCode = async () => {
    setDiscBusy(true);
    const r = await applyDiscount(discCode);
    setDiscBusy(false);
    if (r.ok) { setDiscCode(''); setDiscErr(''); }
    else setDiscErr(r.error || 'Kod uygulanamadı.');
  };

  const submit = async () => {
    if (!form.name.trim() || (!form.phone.trim() && !form.email.trim())) {
      setError('Ad soyad ve telefon veya e-posta gerekli.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const message = `Market siparişi (${items.length} ürün):\n${items.map((i) => `• ${i.title}${i.category ? ` — ${CAT[i.category] || i.category}` : ''}${i.billing === 'monthly' ? ' (abonelik)' : ''}\n  ${(i.price || 0).toLocaleString('tr-TR')} ₺${i.billing === 'monthly' ? ' /ay' : ''}${i.description ? `\n  ${i.description}` : ''}`).join('\n')}\n\nAra toplam: ${total.toLocaleString('tr-TR')} ₺${discount ? `\nİndirim kodu ${discount.code}: -${discountAmount.toLocaleString('tr-TR')} ₺\nÖdenecek: ${discountedTotal.toLocaleString('tr-TR')} ₺` : `\nÖdenecek: ${total.toLocaleString('tr-TR')} ₺`}`;
      const lead = await base44.entities.Lead.create({
        name: form.name, phone: form.phone, email: form.email,
        type: 'quote', service: 'Market Siparişi', message, referral: 'market',
      });
      if (lead?.id) base44.functions.invoke('leadNotify', { lead_id: lead.id }).catch(() => {});
      const order = await base44.entities.Order.create({
        customer_name: form.name, phone: form.phone, email: form.email,
        items: JSON.stringify(items), subtotal: total,
        discount_code: discount?.code || '', discount_amount: discountAmount,
        total: discountedTotal, lead_id: lead?.id || '',
      });
      clear();
      setDone(true);
    } catch (e) {
      setError(e.message || 'Sipariş gönderilemedi, tekrar deneyin.');
    }
    setBusy(false);
  };

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-card border border-border rounded-3xl p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-mint/15 border border-mint/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7 text-mint" />
          </div>
          <h1 className="font-display text-2xl font-semibold mt-5">Sipariş talebiniz alındı</h1>
          <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
            Ödeme linki iyzico üzerinden en kısa sürede size WhatsApp veya e-posta ile iletilecek. Ödemeniz onaylanır onaylanmaz dijital hizmetiniz anında başlar ve müşteri portalınızda görünür.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/market" className="rounded-full border border-border bg-secondary px-6 py-2.5 text-sm font-semibold hover:text-mint transition-colors">Markete dön</Link>
            <Link to="/" className="rounded-full bg-mint text-ink px-6 py-2.5 text-sm font-semibold hover:shadow-sticker transition-shadow">Anasayfa</Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-card border border-border rounded-3xl p-12 text-center">
          <ShoppingBag className="w-10 h-10 text-mint mx-auto" />
          <h1 className="font-display text-2xl font-semibold mt-4">Sepetiniz boş</h1>
          <p className="mt-2 text-sm text-foreground/70">Hizmet paketlerini inceleyip sepete ekleyin; ödemeyi buradan güvenle yapabilirsiniz.</p>
          <Link to="/market" className="mt-6 inline-block rounded-full bg-mint text-ink font-semibold px-8 py-3 text-sm hover:shadow-sticker transition-shadow">Markete git</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-mint">
          <span className="w-1.5 h-1.5 rounded-full bg-mint" /> hizmet talebi
        </span>
        <h1 className="font-display text-3xl font-semibold mt-3">Ödeme &amp; Sepet</h1>
        <p className="text-sm text-foreground/60 mt-1">Seçtiğiniz dijital hizmetler ödeme onayından sonra anında aktifleşir.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr,380px] gap-6 items-start">
        <div className="space-y-5">
          <section className="bg-card border border-border rounded-3xl p-5 md:p-6">
            <h2 className="font-display text-lg font-semibold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-mint" /> Sepetiniz ({items.length} ürün)
            </h2>
            <div className="mt-4 divide-y divide-border border border-border rounded-2xl">
              {items.map((i) => (
                <div key={i.id} className="flex items-center gap-3 p-3">
                  {i.image_url && (
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-border shrink-0">
                      <Image src={i.image_url} className="w-full h-full" fittingType="fill" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate">{i.title}</p>
                    <p className="font-mono text-xs text-muted-foreground">{CAT[i.category] || 'Dijital ürün'} · {(i.price || 0).toLocaleString('tr-TR')} ₺{i.billing === 'monthly' ? ' /ay (abonelik)' : ''}</p>
                    {i.description && <p className="text-xs text-foreground/60 mt-0.5">{i.description}</p>}
                  </div>
                  <button onClick={() => remove(i.id)} className="p-2 hover:text-coral transition-colors" aria-label="Kaldır"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-card border border-border rounded-3xl p-5 md:p-6">
            <h2 className="font-display text-lg font-semibold">İletişim bilgileri</h2>
            <p className="text-xs text-muted-foreground mt-1">Ödeme sonrası hizmet başlangıcı ve teslimat bu bilgilerle yürütülür.</p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <input className={inputCls} placeholder="Ad Soyad" value={form.name} onChange={set('name')} />
              <input className={inputCls} placeholder="Telefon" value={form.phone} onChange={set('phone')} />
              <input className={`${inputCls} sm:col-span-2`} type="email" placeholder="E-posta" value={form.email} onChange={set('email')} />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-sun shrink-0" /> Portal müşterisiyseniz kayıtlı e-postanızı yazın — hizmetler portalınıza anında düşer.
            </p>
          </section>

          <section className="bg-card border border-border rounded-3xl p-5 md:p-6">
            {discount ? (
              <div className="flex items-center justify-between rounded-xl border border-mint/40 bg-mint/10 px-3 py-2.5">
                <span className="text-sm font-semibold text-mint">{discount.code} — {discount.type === 'percent' ? `%${discount.value}` : `${Number(discount.value).toLocaleString('tr-TR')} ₺`} indirim</span>
                <button onClick={() => { removeDiscount(); setDiscErr(''); }} className="text-xs text-muted-foreground hover:text-coral">Kaldır</button>
              </div>
            ) : (
              <div>
                <h2 className="font-display text-lg font-semibold mb-3">İndirim kodu</h2>
                <div className="flex gap-2">
                  <input className={inputCls} placeholder="İndirim kodu" value={discCode} onChange={(e) => setDiscCode(e.target.value.toUpperCase())} />
                  <button onClick={applyCode} disabled={discBusy || !discCode.trim()} className="rounded-xl bg-secondary border border-border px-4 text-sm font-semibold whitespace-nowrap hover:text-mint disabled:opacity-50">
                    {discBusy ? 'Kontrol...' : 'Uygula'}
                  </button>
                </div>
                {discErr && <p className="text-xs text-coral mt-1.5">{discErr}</p>}
              </div>
            )}
          </section>

          {error && <div className="rounded-2xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-coral">{error}</div>}

          <button onClick={submit} disabled={busy} className="w-full rounded-full bg-mint text-ink font-semibold py-3.5 text-sm hover:shadow-sticker transition-shadow disabled:opacity-50 flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /> {busy ? 'Gönderiliyor...' : 'Sipariş Talebini Gönder'}
          </button>
        </div>

        <aside className="bg-card border border-border rounded-3xl p-5 md:p-6 lg:sticky lg:top-24 space-y-3">
          <h2 className="font-display text-lg font-semibold">Sipariş özeti</h2>
          <div className="space-y-1.5 text-sm">
            {items.map((i) => (
              <div key={i.id} className="flex items-center justify-between gap-3">
                <span className="truncate">{i.title}{i.billing === 'monthly' ? ' /ay' : ''}</span>
                <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">{(i.price || 0).toLocaleString('tr-TR')} ₺</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Ara toplam</span><span className="font-mono">{total.toLocaleString('tr-TR')} ₺</span></div>
            {discount && <div className="flex justify-between text-mint"><span>{discount.code}</span><span className="font-mono">-{discountAmount.toLocaleString('tr-TR')} ₺</span></div>}
            <div className="flex justify-between font-display text-lg font-semibold pt-1">
              <span>{items.some((i) => i.billing === 'monthly') ? 'Aylık toplam' : 'Toplam'}</span>
              <span>{(discount ? discountedTotal : total).toLocaleString('tr-TR')} ₺</span>
            </div>
          </div>
          <div className="border-t border-border pt-3 space-y-2 text-xs text-muted-foreground">
            <p className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-mint shrink-0" /> Ödeme linki iyzico üzerinden iletilir</p>
            <p className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-mint shrink-0" /> Kart, kredi kartı ve taksit desteği</p>
            <p className="flex items-center gap-2"><Zap className="w-4 h-4 text-sun shrink-0" /> Ödeme onayında anında hizmet başlangıcı</p>
          </div>
        </aside>
      </div>
    </div>
  );
}