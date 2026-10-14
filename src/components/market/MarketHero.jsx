import React, { useState } from 'react';
import { ArrowRight, Check, Copy, MessageCircle, Plus, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import RobotMascot from '@/components/mascot/RobotMascot';
import CountUp from '@/components/market/CountUp';
import popConfetti from '@/lib/popConfetti';

const fmt = (n) => (n || 0).toLocaleString('tr-TR');

/** Market bento hero: başlık, DijiBot, kampanya kuponu, bundle ve istatistik karoları. */
export default function MarketHero({ campaigns = [], bundles = [], stats = { products: 0, bundles: 0, campaigns: 0 }, onAsk }) {
  const { add, items: cart } = useCart();
  const [copied, setCopied] = useState('');
  const camp = campaigns[0];
  const bundle = bundles[0];
  const bundleCartId = bundle ? `bundle-${bundle.slug || bundle.id}` : '';
  const inCart = cart.some((x) => x.id === bundleCartId);

  const addBundle = (b, bid, bIn) => {
    if (!bIn) add({ id: bid, title: `${b.title} (Bundle)`, price: b.price, category: 'paket', billing: 'one_time' });
  };
  const copy = (code, e) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    popConfetti(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-6 pt-28 md:pt-32">
      <div className="grid grid-cols-6 gap-4">
        {/* başlık karosu */}
        <div className="col-span-6 lg:col-span-4 rounded-3xl border border-border bg-card p-6 md:p-10 flex flex-col justify-center gap-4">
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-secondary px-4 py-1.5 font-mono text-xs text-mint">
            <Sparkles className="w-3.5 h-3.5" /> DİJİTRAK MARKET
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-semibold leading-tight">
            Temalar, bundle paketler ve <span className="text-shimmer">kampanyalar</span> tek vitrinde
          </h1>
          <p className="text-foreground/60 max-w-md md:text-lg">
            Ürünleri kombinleyip indirimli bundle paket kur, kampanya koduyla ekstra indirim kazan.
            Kararsız mısın? DijiBot'a sor; sana uygun kombinasyonu saniyeler içinde hazırlasın.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={onAsk} className="inline-flex items-center gap-2 rounded-full bg-mint text-ink font-semibold px-6 py-3 hover:shadow-sticker transition-shadow">
              <MessageCircle className="w-4 h-4" /> DijiBot'a Sor
            </button>
            <a href="#urunler" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-semibold hover:border-mint/50 hover:text-mint transition-colors">
              Ürünleri Gez <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* DijiBot karosu */}
        <button onClick={onAsk} className="col-span-6 sm:col-span-3 lg:col-span-2 rounded-3xl bg-mint text-ink p-6 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition-transform">
          <RobotMascot emotion="idle" className="w-28 h-32 md:w-36 md:h-40" />
          <span className="font-display text-xl font-bold">DijiBot</span>
        </button>

        {/* kampanya kuponu karosu */}
        {camp && (
          <div className="col-span-6 lg:col-span-4 rounded-3xl bg-coral text-ink p-6 md:p-8 flex flex-col gap-2">
            <span className="font-display text-3xl md:text-4xl font-bold leading-none">
              {camp.discount_type === 'fixed' ? `${fmt(camp.discount_value)} ₺ indirim` : `%${camp.discount_value} indirim`}
            </span>
            <h3 className="font-display text-lg md:text-xl font-semibold">{camp.title}</h3>
            {camp.description && <p className="text-sm text-ink/75 max-w-md">{camp.description}</p>}
            <div className="mt-1 flex items-center gap-3 flex-wrap">
              <button onClick={(e) => copy(camp.code, e)} className="inline-flex items-center gap-2 rounded-full bg-ink text-foreground px-5 py-2.5 font-mono text-sm font-bold tracking-widest hover:shadow-sticker transition-shadow">
                {copied === camp.code ? <><Check className="w-4 h-4 text-mint" /> KOPYALANDI</> : <><Copy className="w-4 h-4" /> {camp.code}</>}
              </button>
              {camp.valid_until && <span className="font-mono text-[10px] text-ink/60">{new Date(camp.valid_until).toLocaleDateString('tr-TR')} tarihine kadar</span>}
            </div>
          </div>
        )}

        {/* bundle karosu */}
        {bundle && (
          <div className="col-span-6 lg:col-span-2 rounded-3xl bg-sun text-ink p-6 flex flex-col gap-2">
            {bundle.badge && <span className="self-start -rotate-2 rounded-full bg-ink text-foreground px-3 py-1 font-mono text-[10px] font-bold">{bundle.badge}</span>}
            <h3 className="font-display text-xl font-bold">{bundle.title}</h3>
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink/60">Bundle Paketler</span>
            <span className="font-display text-3xl font-bold">{fmt(bundle.price)} ₺</span>
            <button onClick={() => addBundle(bundle, bundleCartId, inCart)} disabled={inCart} className={`mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold border-2 border-ink transition-all ${inCart ? 'bg-ink/20 text-ink/60' : 'bg-ink text-foreground hover:shadow-sticker'}`}>
              {inCart ? <><Check className="w-4 h-4" /> Sepette</> : <><Plus className="w-4 h-4" /> Sepete Ekle</>}
            </button>
          </div>
        )}

        {/* istatistik karoları */}
        <Stat color="bg-mint" value={stats.products} label="ürün" />
        <Stat color="bg-sun" value={stats.bundles} label="bundle" />
        <Stat color="bg-coral" value={stats.campaigns} label="kampanya" />

        {/* DijiBot konuşma karosu */}
        <button onClick={onAsk} className="col-span-6 lg:col-span-3 rounded-3xl border border-border bg-card p-5 text-left flex items-end gap-3 hover:border-mint/40 transition-colors">
          <div className="flex-1 rounded-2xl rounded-bl-none bg-secondary p-4 text-sm text-foreground/75">
            Kararsız mısın? DijiBot'a sor — ihtiyacına uygun tema ve paket kombinasyonunu saniyeler içinde hazırlar.
          </div>
          <RobotMascot emotion="happy" className="w-14 h-16 shrink-0" />
        </button>

        {/* ek kampanyalar */}
        {campaigns.slice(1).map((c) => (
          <div key={c.id} className="col-span-6 sm:col-span-3 lg:col-span-2 rounded-3xl border border-border bg-card p-5 flex flex-col gap-2">
            <span className="font-display text-2xl font-bold text-sun">
              {c.discount_type === 'fixed' ? `${fmt(c.discount_value)} ₺` : `%${c.discount_value}`}
            </span>
            <h3 className="font-display text-base font-semibold">{c.title}</h3>
            <button onClick={(e) => copy(c.code, e)} className="mt-auto inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-xs font-bold tracking-widest hover:border-sun/60 hover:text-sun transition-colors">
              {copied === c.code ? <><Check className="w-3.5 h-3.5 text-mint" /> Kopyalandı</> : <><Copy className="w-3.5 h-3.5" /> {c.code}</>}
            </button>
          </div>
        ))}

        {/* ek bundle'lar */}
        {bundles.slice(1).map((b) => {
          const bid = `bundle-${b.slug || b.id}`;
          const bIn = cart.some((x) => x.id === bid);
          return (
            <div key={b.id} className="col-span-6 sm:col-span-3 lg:col-span-2 rounded-3xl border border-border bg-card p-5 flex flex-col gap-2">
              <span className="font-display text-2xl font-bold text-sun">{fmt(b.price)} ₺</span>
              <h3 className="font-display text-base font-semibold">{b.title}</h3>
              <button
                onClick={() => addBundle(b, bid, bIn)}
                disabled={bIn}
                className={`mt-auto inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${bIn ? 'bg-secondary text-muted-foreground' : 'bg-mint text-ink hover:shadow-sticker'}`}
              >
                {bIn ? <><Check className="w-4 h-4" /> Sepette</> : <><Plus className="w-4 h-4" /> Sepete Ekle</>}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Stat({ color, value, label }) {
  return (
    <div className={`col-span-2 lg:col-span-1 rounded-3xl ${color} text-ink p-4 md:p-5 flex flex-col justify-center items-start gap-1`}>
      <span className="font-display text-3xl font-bold"><CountUp value={value} /></span>
      <span className="font-mono text-xs uppercase tracking-wider text-ink/70">{label}</span>
    </div>
  );
}