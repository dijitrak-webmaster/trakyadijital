// Trakya Dijital Endeksi — Dijitrak'ın bölge gözlemlerine dayanan temsilî veri seti

export const sectorScores = [
  { name: 'Tarım & Üretim', score: 34, change: 6 },
  { name: 'Gıda & İhracat', score: 46, change: 9 },
  { name: 'Sanayi', score: 51, change: 7 },
  { name: 'Ticaret & Perakende', score: 55, change: 8 },
  { name: 'Turizm & Konaklama', score: 62, change: 11 },
  { name: 'Hizmet & Profesyonel', score: 58, change: 10 },
];

export const cityScores = [
  { name: 'Tekirdağ', score: 54 },
  { name: 'Edirne', score: 49 },
  { name: 'Kırklareli', score: 42 },
];

export const trendSeries = [
  { q: '2024 Ç1', v: 31 }, { q: 'Ç2', v: 33 }, { q: 'Ç3', v: 37 }, { q: 'Ç4', v: 39 },
  { q: '2025 Ç1', v: 41 }, { q: 'Ç2', v: 44 }, { q: 'Ç3', v: 47 }, { q: 'Ç4', v: 50 },
  { q: '2026 Ç1', v: 51 }, { q: 'Ç2', v: 53 }, { q: 'Ç3', v: 55 },
];

export const highlights = [
  { title: 'Turizm öncü, tarım geriden', text: 'Konaklama işletmeleri dijitalde açık ara önde; tarım ve üretimde hâlâ büyük bir ilk adım fırsatı var.' },
  { title: 'E-ticarete geçiş hızlandı', text: 'Son iki yılda bölgede online satışa açılan üretici sayısı iki katına çıktı.' },
  { title: 'Şehir farkı kapanıyor', text: 'Kırklareli\'nin geride olmasına rağmen büyüme hızı üç il arasında en yüksek.' },
];

export const INDEX_NOTE =
  'Trakya Dijital Endeksi; Dijitrak\'ın bölgede yürüttüğü projelerden, saha gözlemlerinden ve kamuya açık dijital ayak izi taramalarından türetilmiş temsilî bir göstergedir. Akademik bir araştırma değil, işletmelere yön vermek için tasarlanmış bir pusuladır.';