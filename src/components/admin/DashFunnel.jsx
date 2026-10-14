/** Yönetim paneli analitiği: dönüşüm hunisi (talep → iletişim → kazanım) ve kanal performansı */
export default function DashFunnel({ leads }) {
  const total = leads.length;
  const contacted = leads.filter((l) => ['contacted', 'won'].includes(l.status)).length;
  const won = leads.filter((l) => l.status === 'won').length;
  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);
  const stages = [
    { label: 'Talep geldi', n: total, cls: 'bg-fog' },
    { label: 'İletişime geçildi', n: contacted, cls: 'bg-sun' },
    { label: 'Kazanıldı', n: won, cls: 'bg-mint' },
  ];
  const channels = Object.entries(
    leads.reduce((acc, l) => {
      const k = l.referral || 'Doğrudan / site';
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxCh = Math.max(1, ...channels.map((c) => c[1]));

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="border border-border rounded-2xl p-5 bg-card/50">
        <p className="font-mono text-xs uppercase text-mint">Dönüşüm hunisi</p>
        <div className="mt-4 space-y-3.5">
          {stages.map((s) => (
            <div key={s.label}>
              <div className="flex justify-between font-mono text-xs mb-1.5">
                <span className="text-muted-foreground">{s.label}</span>
                <span>{s.n} · %{pct(s.n)}</span>
              </div>
              <div className="h-3 rounded-full bg-secondary overflow-hidden">
                <div className={`h-full rounded-full ${s.cls}`} style={{ width: `${Math.max(4, pct(s.n))}%` }} />
              </div>
            </div>
          ))}
          <p className="font-mono text-xs text-muted-foreground pt-1">
            Talep → kazanım: %{pct(won)} · iletişim oranı: %{pct(contacted)}
          </p>
        </div>
      </div>
      <div className="border border-border rounded-2xl p-5 bg-card/50">
        <p className="font-mono text-xs uppercase text-mint">Kanal / kaynak performansı</p>
        <div className="mt-4 space-y-3.5">
          {channels.length === 0 && <p className="font-mono text-xs text-muted-foreground">Veri yok</p>}
          {channels.map(([name, n]) => (
            <div key={name}>
              <div className="flex justify-between font-mono text-xs mb-1.5">
                <span className="text-muted-foreground">{name}</span>
                <span>{n} talep</span>
              </div>
              <div className="h-3 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-coral" style={{ width: `${Math.max(4, Math.round((n / maxCh) * 100))}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}