/**
 * DijiBot persona — konuşmaya eşlik eden kısa taktımlar.
 * Amaç: insan bir danışman gibi durmak — robot ağzı, oyun dili ve abartı yok.
 * Taktımlar SEYREK ve DEĞİŞKEN: her üç mesajda yalnız bir kez, hep farklı bir kalıpla.
 */
const FLAVOR = {
  quote: [
    'Sohbetinize göre hazırladım:',
    'İşte sizin için planım:',
    'Notlarımı aldım, bunu öneririm:',
  ],
  success: [
    'Talebiniz alındı, teşekkürler:',
    'Kayıtlarımıza geçti — devam edelim:',
  ],
  idle: [
    'Bunu memnuniyetle yanıtlarım:',
    'Net cevap şöyle:',
    'Size şöyle yardımcı olabilirim:',
  ],
};

export function flavorLine(kind, i) {
  const arr = FLAVOR[kind] || FLAVOR.idle;
  // Çoğu yanıt doğrudan başlar; her 3. mesajda bir taktım devreye girer.
  if (i % 3 !== 0) return '';
  return arr[((i / 3) | 0) % arr.length];
}