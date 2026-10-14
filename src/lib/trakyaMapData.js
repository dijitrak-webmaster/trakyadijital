// Trakya Dijital Haritası — ilçe düğümleri (temsilî endeks skoru)
// x/y: 860x620 viewBox üzerinde gerçek coğrafi konumlara göre ölçeklenmiş koordinatlar

export const mapDistricts = [
  { slug: 'edirne', name: 'Edirne', province: 'Edirne', score: 49, x: 282, y: 85 },
  { slug: 'uzunkopru', name: 'Uzunköprü', province: 'Edirne', score: 38, x: 328, y: 208 },
  { slug: 'ipsala', name: 'İpsala', province: 'Edirne', score: 35, x: 206, y: 310 },
  { slug: 'kesan', name: 'Keşan', province: 'Edirne', score: 40, x: 307, y: 331 },
  { slug: 'kirklareli', name: 'Kırklareli', province: 'Kırklareli', score: 42, x: 425, y: 80 },
  { slug: 'luleburgaz', name: 'Lüleburgaz', province: 'Kırklareli', score: 45, x: 486, y: 166 },
  { slug: 'tekirdag', name: 'Tekirdağ', province: 'Tekirdağ', score: 54, x: 612, y: 288 },
  { slug: 'malkara', name: 'Malkara', province: 'Tekirdağ', score: 37, x: 433, y: 316 },
  { slug: 'corlu', name: 'Çorlu', province: 'Tekirdağ', score: 57, x: 728, y: 241 },
  { slug: 'cerkezkoy', name: 'Çerkezköy', province: 'Tekirdağ', score: 52, x: 758, y: 253 },
];

export const scoreColor = (score) => {
  if (score >= 55) return 'hsl(var(--mint))';
  if (score >= 45) return 'hsl(var(--sun))';
  return 'hsl(var(--coral))';
};

export const provinceAverages = (districts) => {
  const groups = {};
  districts.forEach((d) => {
    (groups[d.province] ||= []).push(d.score);
  });
  return Object.entries(groups).map(([name, scores]) => ({
    name,
    score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  }));
};