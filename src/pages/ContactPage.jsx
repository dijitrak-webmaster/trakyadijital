import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Send, Youtube, CheckCircle2, Loader2, MessageCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/LanguageContext';
import useSeo from '@/hooks/useSeo';

const socials = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Send, href: 'https://telegram.org', label: 'Telegram' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
];

const inputCls = 'w-full rounded-xl bg-terminal border border-border px-4 py-2.5 text-sm outline-none focus:border-mint/60 transition-colors placeholder:text-foreground/40';

export default function ContactPage() {
  const { tl } = useLanguage();
  useSeo({
    title: 'İletişim — Bize Ulaşın | Dijitrak',
    description: 'Tekirdağ merkezli Dijitrak ekibine ulaşın: telefon, e-posta veya form. Projenizi anlatın, 24 saat içinde dönüş yapalım.',
    path: '/iletisim',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Dijitrak İletişim',
      url: 'https://trakya-digital-core.base44.app/iletisim',
      mainEntity: {
        '@type': 'Organization',
        name: 'Dijitrak',
        areaServed: ['Edirne', 'Kırklareli', 'Tekirdağ'],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          telephone: '+905542030473',
          email: 'merhaba@dijitrak.com',
          availableLanguage: ['tr', 'en'],
        },
      },
    },
  });
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;
    setSending(true);
    setError('');
    try {
      const created = await base44.entities.Lead.create({ ...form, type: 'question' });
      base44.analytics.track({ eventName: 'contact_form_submit' });
      created?.id && base44.functions.invoke('leadNotify', { lead_id: created.id }).catch(() => {});
      setSent(true);
      setForm({ name: '', email: '', phone: '', company: '', message: '' });
    } catch {
      setError('Mesajınız gönderilemedi. Lütfen tekrar deneyin ya da bizi arayın.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-36 md:pt-44 pb-24 max-w-6xl mx-auto px-5 md:px-6">
      <span className="inline-block rounded-full border border-mint/40 bg-mint/10 text-mint font-mono text-xs px-4 py-1.5">{tl('İLETİŞİM')}</span>
      <h1 className="font-display text-4xl md:text-6xl font-semibold mt-4 tracking-tight">{tl('Hadi konuşalım')}</h1>
      <p className="text-foreground/70 mt-4 max-w-2xl text-lg">{tl('Projenizi anlatın; 24 saat içinde dönüş yapalım. Yol tarifine ihtiyacınız olursa ofis de kapıda çay da bizden.')}</p>

      <div className="grid lg:grid-cols-5 gap-6 mt-10">
        <div className="lg:col-span-3 bg-card rounded-3xl border border-border p-6 md:p-8">
          {sent ? (
            <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center gap-3">
              <CheckCircle2 className="w-12 h-12 text-mint" />
              <h2 className="font-display font-semibold text-2xl">{tl('Mesajınız bize ulaştı')}</h2>
              <p className="text-foreground/70 text-sm max-w-sm">{tl('En kısa sürede size dönüş yapacağız. Acele edenler için telefon her zaman açık.')}</p>
              <button onClick={() => setSent(false)} className="mt-3 text-sm font-semibold text-mint hover:underline">{tl('Yeni mesaj gönder')}</button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">{tl('Ad Soyad *')}</label>
                  <input className={`${inputCls} mt-1`} value={form.name} onChange={set('name')} placeholder="Ayşe Yılmaz" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">{tl('Telefon')}</label>
                  <input className={`${inputCls} mt-1`} value={form.phone} onChange={set('phone')} placeholder="+90 5xx xxx xx xx" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">{tl('E-posta')}</label>
                  <input type="email" className={`${inputCls} mt-1`} value={form.email} onChange={set('email')} placeholder="ornek@isletmem.com" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">{tl('İşletme adı')}</label>
                  <input className={`${inputCls} mt-1`} value={form.company} onChange={set('company')} placeholder="Yılmaz Ayçiçek A.Ş." />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">{tl('Mesajınız *')}</label>
                <textarea className={`${inputCls} mt-1`} rows={5} value={form.message} onChange={set('message')} placeholder={tl('İhtiyacınızı kısaca anlatın: yeni site, e-ticaret, Google görünürlüğü...')} required />
              </div>
              {error && <p className="text-sm text-coral">{tl(error)}</p>}
              <button type="submit" disabled={sending} className="rounded-full bg-mint text-ink font-semibold py-3 inline-flex items-center justify-center gap-2 hover:shadow-sticker transition-all disabled:opacity-50">
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {sending ? tl('Gönderiliyor...') : tl('Mesajı Gönder')}
              </button>
            </form>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-3xl border border-border p-6 space-y-4">
            <a href="tel:+905542030473" className="flex items-center gap-4 hover:text-mint transition-colors">
              <span className="w-11 h-11 rounded-2xl bg-mint text-ink flex items-center justify-center shrink-0"><Phone className="w-5 h-5" /></span>
              <span>
                <span className="block text-xs text-muted-foreground">{tl('Telefon')}</span>
                <span className="font-semibold">+90 554 203 04 73</span>
              </span>
            </a>
            <a href="mailto:merhaba@dijitrak.com" className="flex items-center gap-4 hover:text-mint transition-colors">
              <span className="w-11 h-11 rounded-2xl bg-sun text-ink flex items-center justify-center shrink-0"><Mail className="w-5 h-5" /></span>
              <span>
                <span className="block text-xs text-muted-foreground">{tl('E-posta')}</span>
                <span className="font-semibold">merhaba@dijitrak.com</span>
              </span>
            </a>
            <a href="https://maps.google.com/?q=Tekirdağ" target="_blank" rel="noreferrer" className="flex items-center gap-4 hover:text-mint transition-colors">
              <span className="w-11 h-11 rounded-2xl bg-coral text-ink flex items-center justify-center shrink-0"><MapPin className="w-5 h-5" /></span>
              <span>
                <span className="block text-xs text-muted-foreground">{tl('Ofis')}</span>
                <span className="font-semibold">Tekirdağ, Türkiye</span>
              </span>
            </a>
            <div className="flex items-center gap-4">
              <span className="w-11 h-11 rounded-2xl bg-sage text-ink flex items-center justify-center shrink-0"><Clock className="w-5 h-5" /></span>
              <span>
                <span className="block text-xs text-muted-foreground">{tl('Çalışma saatleri')}</span>
                <span className="font-semibold">{tl('Hafta içi 09.00 – 18.00')}</span>
              </span>
            </div>
          </div>

          <div className="bg-card rounded-3xl border border-border p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{tl('Sosyal kanallar')}</p>
            <div className="flex gap-3 mt-4">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center hover:bg-mint hover:text-ink transition-colors">
                  <s.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <p className="text-xs text-foreground/60 mt-4">{tl('Haftalık dijital dönüşüm ipuçları için bizi takip edin.')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}