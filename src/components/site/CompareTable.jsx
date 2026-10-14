import React from 'react';
import { Check, Minus, X, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const ROWS = [
  { label: 'Kurumsal site başlangıcı', diji: '4.900₺', others: ['15.000₺+', 'Aylık abonelik', '3.000₺ (riskli)'], verdicts: ['bad', 'neutral', 'neutral'] },
  { label: 'Bölgeyi bilen yerel SEO', diji: 'Edirne–Çorlu hattı odaklı', others: ['Uzaktan, jenerik', 'Yok', 'Genelde yok'], verdicts: ['bad', 'no', 'no'] },
  { label: 'Teklifte yazmayan kalem faturalanmaz', diji: true, others: ['Değişken', false, 'Değişken'], verdicts: ['bad', 'no', 'neutral'] },
  { label: 'Site + alan adı tamamen sizin', diji: true, others: ['Genelde evet', false, 'Kontrol etmelisin'], verdicts: ['bad', 'no', 'neutral'] },
  { label: 'Bakım & yanıt süresi', diji: 'Kritik konuda 4 saat', others: ['Ticket kuyruğu', 'Mail ile', 'Nöbet halinde'], verdicts: ['bad', 'no', 'neutral'] },
  { label: 'Aylık ölçülebilir rapor', diji: true, others: [true, false, false], verdicts: ['bad', 'no', 'no'] },
  { label: 'İçerik girişi dahil', diji: true, others: ['Ek ücret', 'Kendiniz', 'Ek ücret'], verdicts: ['bad', 'no', 'neutral'] },
];

const Cell = ({ v, text }) => {
  if (v === 'bad') return <span className="text-coral font-mono text-[11px]">{text}</span>;
  if (v === 'neutral') return <span className="text-foreground/50 font-mono text-[11px]">{text}</span>;
  if (v === 'no') return <X className="w-4 h-4 text-coral/70" />;
  if (v === false) return <X className="w-4 h-4 text-coral/70" />;
  return <Check className="w-4 h-4 text-mint" />;
};

// Rakip karşılaştırma tablosu: Dijitrak vs İstanbul ajansı / hazır platform / freelancer
export default function CompareTable() {
  const { tl } = useLanguage();
  const cols = [tl('İstanbul ajansı'), tl('Hazır site platformu'), tl('Freelancer')];
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-coral" />
        <h2 className="font-display font-bold text-2xl md:text-3xl">{tl('Dijitrak mı, başka biri mi?')}</h2>
      </div>
      <p className="text-sm text-foreground/60 mt-1">{tl('Bölgedeki alternatiflerle yan yana: karar vermeden önce bunu görün.')}</p>
      <div className="mt-6 overflow-x-auto rounded-3xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left font-mono text-[11px] uppercase tracking-widest text-muted-foreground p-4">{tl('Kriter')}</th>
              <th className="p-4 bg-mint/10 min-w-[150px]">
                <span className="inline-flex items-center gap-1.5 text-mint font-display font-bold"><Sparkles className="w-4 h-4" /> Dijitrak</span>
              </th>
              {cols.map((c) => (
                <th key={c} className="p-4 text-foreground/60 font-display font-semibold text-left min-w-[120px]">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.label} className={i % 2 ? 'bg-card' : 'bg-transparent'}>
                <td className="p-4 font-semibold text-foreground/85 border-t border-border">{tl(r.label)}</td>
                <td className="p-4 bg-mint/10 border-t border-mint/20 text-mint font-semibold">
                  {typeof r.diji === 'boolean' ? <Check className="w-4 h-4" /> : r.diji}
                </td>
                {r.others.map((o, oi) => (
                  <td key={oi} className="p-4 border-t border-border">
                    <Cell v={r.verdicts[oi]} text={o} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-3 font-mono">
        <Minus className="w-3 h-3" /> {tl('Genel pazar gözlemidir; bireysel teklifler değişebilir.')}
      </p>
      <p className="md:hidden flex items-center gap-1.5 text-[11px] text-sun mt-1.5 font-mono">→ {tl('Tabloyu yana kaydırarak tüm alternatifleri görün.')}</p>
    </div>
  );
}