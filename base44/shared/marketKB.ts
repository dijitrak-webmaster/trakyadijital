// Market ürünleri DijiBot'un tüm kanalları için ortak bilgi kaynağı.
// WhatsApp webhook'u bu modülü kullanır; site sohbeti frontend kopyasıyla.
export async function loadMarketBrief(base44) {
  try {
    const [items, campaigns] = await Promise.all([
      base44.asServiceRole.entities.MarketItem.filter({ status: 'published' }, '-created_date', 8),
      base44.asServiceRole.entities.Campaign.filter({ status: 'published' }, '-created_date', 3),
    ]);
    const lines = (items || []).map((i) =>
      `- ${i.title} (${i.category}) — ${i.billing === 'monthly' ? 'aylık' : 'tek seferlik'} ${Number(i.price || 0).toLocaleString('tr-TR')} TL${i.features ? `, özellikler: ${String(i.features).slice(0, 60)}` : ''}`
    );
    const camps = (campaigns || []).filter((c) => c.code).map((c) =>
      `- ${c.title}: ${c.code} kodu, ${c.discount_type === 'percent' ? `%${c.discount_value}` : `${Number(c.discount_value).toLocaleString('tr-TR')} TL`} indirim`
    );
    return [
      'MARKET ÜRÜNLERİ (yayında — ürün/fiyat bilgisini yalnızca buradan ver):',
      ...lines,
      camps.length ? 'AKTİF KAMPANYALAR:' : '',
      ...camps,
    ].filter(Boolean).join('\n');
  } catch (e) {
    console.error('Market bilgisi alınamadı:', e?.message);
    return '';
  }
}