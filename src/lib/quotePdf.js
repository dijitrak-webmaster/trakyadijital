import { jsPDF } from 'jspdf';

// ── kurumsal marka paleti ───────────────────────────────────────
const MINT = [46, 196, 141];
const MINT_DARK = [22, 138, 96];
const SUN = [255, 200, 51];
const INK = [17, 24, 39];
const TERMINAL = [11, 16, 29];
const GREY = [100, 116, 139];
const SOFT = [148, 158, 172];
const CARD_BG = [246, 248, 251];
const LINE = [223, 228, 236];

// jsPDF'in standart fontları WinAnsi kodladığı için yedek (fallback) metinde Türkçe karakterleri sadeleştiriyoruz
export const trToAscii = (s) =>
  (s || '')
    .replace(/İ/g, 'I').replace(/ı/g, 'i')
    .replace(/Ş/g, 'S').replace(/ş/g, 's')
    .replace(/Ğ/g, 'G').replace(/ğ/g, 'g')
    .replace(/Ü/g, 'U').replace(/ü/g, 'u')
    .replace(/Ö/g, 'O').replace(/ö/g, 'o')
    .replace(/Ç/g, 'C').replace(/ç/g, 'c');

// 🌐 DejaVu Sans: Türkçe harfleri ve ₺ işaretini birebir destekler.
// Fontlar public/fonts altında uygulamayla birlikte servis edilir (CDN engeli/Türkiye erişim sorunu yaşanmaz);
// yerel dosya bulunamazsa CDN yedeği devreye girer.
const FONT_LOCAL = '/fonts';
const FONT_CDN = 'https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf';
const fonts = { normal: null, bold: null };

const toB64 = (buf) => {
  const bytes = new Uint8Array(buf);
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  return btoa(bin);
};

const loadTtf = async (file) => {
  for (const base of [FONT_LOCAL, FONT_CDN]) {
    try {
      const res = await fetch(`${base}/${file}`);
      if (!res.ok) continue;
      return toB64(await res.arrayBuffer());
    } catch { /* sıradaki kaynağı dene */ }
  }
  return false;
};

let logoCache = null;
/** V3 tipografik logoyu SVG'den PNG'ye dönüştürür (jsPDF gömme için); başarısızsa false. */
const logoPng = async () => {
  if (logoCache !== null) return logoCache;
  try {
    const res = await fetch('/logos/logo-dark.svg?v=3');
    if (!res.ok) { logoCache = false; return false; }
    let svg = await res.text();
    const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    if (!vb) { logoCache = false; return false; }
    const w = 400;
    const h = Math.round((+vb[2]) * w / (+vb[1]));
    svg = svg.replace('<svg ', `<svg width="${w}" height="${h}" `);
    const img = new Image();
    await new Promise((ok, err) => {
      img.onload = ok;
      img.onerror = err;
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    });
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    // Şeffaf PNG jsPDF'de bazı durumlarda siyah zeminle basılır — koyu bant rengine boyayıp gömüyoruz
    ctx.fillStyle = 'rgb(11, 16, 29)';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    logoCache = canvas.toDataURL('image/png');
  } catch {
    logoCache = false;
  }
  return logoCache;
};

/** PDF dokümanını hazırlar; unicode font yüklenirse Türkçe harfler/₺ birebir yazılır, yoksa ASCII'ye düşer. */
const prepDoc = async () => {
  const doc = new jsPDF();
  if (fonts.normal === null) fonts.normal = await loadTtf('DejaVuSans.ttf');
  if (fonts.bold === null) fonts.bold = await loadTtf('DejaVuSans-Bold.ttf');
  let font = 'helvetica';
  if (fonts.normal && fonts.bold) {
    doc.addFileToVFS('DejaVuSans.ttf', fonts.normal);
    doc.addFont('DejaVuSans.ttf', 'DejaVu', 'normal');
    doc.addFileToVFS('DejaVuSans-Bold.ttf', fonts.bold);
    doc.addFont('DejaVuSans-Bold.ttf', 'DejaVu', 'bold');
    font = 'DejaVu';
  }
  // ₺ glifi jsPDF'in font alt-kümecisinde bozulduğu için her durumda 'TL ' yazılır;
  // fallback'te ayrıca Türkçe harfler ASCII'ye sadeleşir
  const T = (s) => (font === 'DejaVu'
    ? String(s ?? '')
    : trToAscii(String(s ?? ''))).replace(/₺/g, 'TL ');
  const logo = await logoPng();
  return { doc, font, T, logo };
};

// ── ortak parçalar ──────────────────────────────────────────────

const M = 15; // sayfa kenar boşluğu
const CW = (W) => W - M * 2; // içerik genişliği
const CONTACT = 'merhaba@dijitrak.com · +90 554 203 04 73 · Tekirdağ, Türkiye';

const wrap = (doc, text, width) => doc.splitTextToSize(text || '', width);

/** İçerik alanının sonuna gelmeden yeni sayfa açar */
const makeEnsure = (doc) => {
  const H = doc.internal.pageSize.getHeight();
  // Aktüel y'yi parametre alır; sayfa taşarsa yeni sayfa açar ve 20 döndürür
  return (y, need) => (y + need > H - 30 ? (doc.addPage(), 20) : null);
};

/** Kurumsaj mast head: koyu bant, logo işareti, marka, belge rozeti, no ve tarih */
const drawHeader = (doc, { font, T, subtitle, no, dateStr, logo }) => {
  const W = doc.internal.pageSize.getWidth();
  doc.setFillColor(...TERMINAL);
  doc.rect(0, 0, W, 40, 'F');
  doc.setFillColor(...MINT);
  doc.rect(0, 40, W, 2, 'F');

  if (logo) {
    // V3 tipografik logo: simge + "Dijitrak" yazısı tek görselde (1003×323 oranlı)
    doc.addImage(logo, 'PNG', M, 8, 40, 12.9);
  } else {
    // yedek: basit işaret + marka yazısı
    doc.setFillColor(...MINT);
    doc.roundedRect(M, 9, 13, 13, 3, 3, 'F');
    doc.setFont(font, 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...TERMINAL);
    doc.text('D', M + 6.5, 17.5, { align: 'center' });
    doc.setTextColor(...MINT);
    doc.setFontSize(19);
    doc.text('DIJITRAK', M + 17, 17);
    doc.setFontSize(7.5);
    doc.setTextColor(190, 198, 210);
    doc.text(T('DİJİTAL DÖNÜŞÜM AJANSI · TRAKYA'), M + 17, 24);
  }

  // sağ: belge türü rozeti + no + tarih — rozet gömülü Türkçe fontta çizilmeli
  // (font ayarı yapılmadan çizilirse yedek fonta düşer: İ → '0' olur ve ölçüsüz taşar)
  doc.setFont(font, 'bold');
  const badge = T(subtitle);
  doc.setFontSize(7);
  doc.setDrawColor(...MINT);
  doc.setLineWidth(0.4);
  const bw = doc.getTextWidth(badge) + 8;
  doc.roundedRect(W - M - bw, 9, bw, 8, 2, 2);
  doc.setTextColor(...MINT);
  doc.text(badge, W - M - bw / 2, 14.2, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(...SUN);
  doc.text(no, W - M, 24.5, { align: 'right' });
  doc.setFontSize(7.5);
  doc.setTextColor(160, 168, 182);
  doc.text(dateStr, W - M, 30, { align: 'right' });
};

/** Numaralı bölüm başlığı: mint rozet + kalın başlık + ince kural — dönüş yeni y */
const section = (doc, { font, T, num, text, y, W }) => {
  doc.setFillColor(...MINT);
  doc.roundedRect(M, y - 4.5, 9, 9, 1.8, 1.8, 'F');
  doc.setFont(font, 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...TERMINAL);
  doc.text(num, M + 4.5, y + 1.2, { align: 'center' });
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text(T(text), M + 13, y + 1.5);
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.3);
  const titleW = doc.getTextWidth(T(text));
  doc.line(M + 17 + titleW, y + 1, W - M, y + 1);
  return y + 12;
};

/** Kurumsal bilgi kutusu: HAZIRLAYAN / ALICI blokları için */
const infoBox = (doc, { font, T, x, y, w, h, label, lines }) => {
  doc.setFillColor(...CARD_BG);
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, w, h, 2, 2, 'FD');
  doc.setFillColor(...MINT);
  doc.roundedRect(x, y, 1.8, h, 0.9, 0.9, 'F');
  doc.setFont(font, 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...GREY);
  doc.text(T(label), x + 6, y + 7.5);
  lines.forEach((l, i) => {
    doc.setFont(font, i === 0 ? 'bold' : 'normal');
    doc.setFontSize(i === 0 ? 10 : 8.5);
    doc.setTextColor(...(i === 0 ? INK : GREY));
    doc.text(l, x + 6, y + 15 + i * 5);
  });
};

/** Alt bant: iletişim + sayfa numarası — her sayfaya uygulanır */
const drawFooters = (doc, tFn, firstLine, font = 'helvetica') => {
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    doc.setFillColor(...MINT);
    doc.rect(0, H - 17, W, 0.8, 'F');
    doc.setFillColor(...TERMINAL);
    doc.rect(0, H - 16.2, W, 16.2, 'F');
    doc.setFont(font, 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(200, 206, 216);
    if (i === 1 && firstLine) doc.text(tFn(firstLine), M, H - 7);
    else doc.text(tFn(CONTACT), M, H - 7);
    doc.setTextColor(140, 148, 162);
    doc.text(`${i} / ${pages}`, W - M, H - 7, { align: 'right' });
  }
};

/** Tablo üst başlığı: koyu bantta beyaz sütun yazıları */
const tableHead = (doc, { font, T, y, W, cols }) => {
  doc.setFillColor(...TERMINAL);
  doc.rect(M, y, CW(W), 8, 'F');
  doc.setFont(font, 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  cols.forEach(([label, x, align]) => doc.text(T(label), x, y + 5.3, { align }));
  return y + 8;
};

// ── 1) Potansiyel müşteri kaydından hızlı teklif PDF'i ─────────

/** Bir potansiyel müşteri kaydından kurumsal görünümlü teklif PDF'i üretir ve indirir. */
export async function downloadQuotePdf(lead) {
  const { doc, font, T, logo } = await prepDoc();
  const W = doc.internal.pageSize.getWidth();
  const ensure = makeEnsure(doc);
  let y;

  drawHeader(doc, {
    font, T, logo,
    subtitle: 'DİJİTAL DÖNÜŞÜM TEKLİFİ',
    no: `No: DJT-${(lead.id || '').slice(-6).toUpperCase()}`,
    dateStr: new Date(lead.created_date || Date.now()).toLocaleDateString('tr-TR'),
  });

  // 01 — firmalar
  y = 54;
  const boxW = (CW(W) - 6) / 2;
  infoBox(doc, {
    font, T, x: M, y, w: boxW, h: 30,
    label: 'HAZIRLAYAN',
    lines: [[T('Dijitrak Ajans')], [T('merhaba@dijitrak.com')], [T('+90 554 203 04 73')]].flat(),
  });
  infoBox(doc, {
    font, T, x: M + boxW + 6, y, w: boxW, h: 30,
    label: 'ALICI',
    lines: [
      T(lead.name || '—'),
      ...(lead.company ? [T(lead.company)] : []),
      ...(lead.phone ? [T(lead.phone)] : []),
      ...(lead.email ? [T(lead.email)] : []),
    ].slice(0, 3),
  });
  y += 40;

  // 02 — kapsam tablosu
  const rows = [
    ['Hizmet', lead.service],
    ['Sektör', lead.sector],
    ['Tahmini bütçe', lead.estimate],
    ['Randevu', lead.appointment_date && `${lead.appointment_date}${lead.appointment_time ? ` · ${lead.appointment_time}` : ''}`],
  ].filter(([, v]) => v);
  if (rows.length) {
    y = ensure(y, 28 + rows.length * 9) ?? y;
    y = section(doc, { font, T, num: '01', text: 'KAPSAM', y, W });
    y = tableHead(doc, { font, T, y, W, cols: [['ALAN', M + 5], ['DETAY', W - M - 5, 'right']] });
    rows.forEach(([k, v], i) => {
      const vLines = wrap(doc, T(String(v)), CW(W) - 70);
      const rowH = Math.max(9, vLines.length * 4.6 + 4.5);
      if (i % 2 === 0) {
        doc.setFillColor(...CARD_BG);
        doc.rect(M, y, CW(W), rowH, 'F');
      }
      doc.setDrawColor(...LINE);
      doc.setLineWidth(0.2);
      doc.line(M, y + rowH, W - M, y + rowH);
      doc.setFont(font, 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...GREY);
      doc.text(T(k), M + 5, y + 6);
      doc.setFont(font, 'normal');
      doc.setTextColor(...INK);
      doc.text(vLines, M + 42, y + 6);
      y += rowH;
    });
    y += 8;
  }

  // 03 — DijiBot'un özel paket önerisi
  if (lead.package_summary) {
    const lines = wrap(doc, T(lead.package_summary), CW(W) - 12);
    y = ensure(y, 30 + lines.length * 4.6) ?? y;
    y = section(doc, { font, T, num: '02', text: 'ÖZEL PAKET ÖNERİSİ', y, W });
    doc.setFillColor(...CARD_BG);
    doc.setDrawColor(...LINE);
    doc.roundedRect(M, y, CW(W), lines.length * 4.6 + 10, 2, 2, 'FD');
    doc.setFont(font, 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...INK);
    doc.text(lines, M + 6, y + 8);
    y += lines.length * 4.6 + 18;
  }

  // 04 — müşteri notu
  if (lead.message) {
    const lines = wrap(doc, T(lead.message), CW(W) - 12);
    y = ensure(y, 26 + lines.length * 4.6) ?? y;
    y = section(doc, { font, T, num: '03', text: 'MÜŞTERİ NOTU', y, W });
    doc.setFillColor(...CARD_BG);
    doc.setDrawColor(...LINE);
    doc.roundedRect(M, y, CW(W), lines.length * 4.6 + 10, 2, 2, 'FD');
    doc.setFont(font, 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...INK);
    doc.text(lines, M + 6, y + 8);
    y += lines.length * 4.6 + 14;
  }

  // koşullar
  {
    const lines = wrap(
      doc,
      T('Bu belge ön teklif özetidir. Kesin fiyat ve teslim takvimi, ücretsiz keşif görüşmesinin ardından 24 saat içinde yazılı teklifte yer alır. Fiyatlar KDV hariçtir ve teklif 15 gün geçerlidir.'),
      CW(W) - 12
    );
    y = ensure(y, 18 + lines.length * 4.2) ?? y;
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.3);
    doc.roundedRect(M, y, CW(W), lines.length * 4.2 + 10, 2, 2);
    doc.setFont(font, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...GREY);
    doc.text(lines, M + 6, y + 7);
  }

  drawFooters(doc, T, 'Bu teklif 15 gün geçerlidir', font);

  const slug = trToAscii(lead.name || 'musteri').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  doc.save(`dijitrak-teklif-${slug}.pdf`);
}

// ── 2) DijiBot paketi için çok sayfalı kurumsal teklif PDF'i ────

/** DijiBot'un sohbette kurduğu paket için kalem kalem, çok sayfalı kurumsal teklif PDF'i üretir. */
export async function downloadPackagePdf(pkg, info = {}) {
  const { doc, font, T, logo } = await prepDoc();
  const W = doc.internal.pageSize.getWidth();
  const ensure = makeEnsure(doc);
  const fmt = (p) => (Array.isArray(p) ? T(`₺${p[0].toLocaleString('tr-TR')} - ₺${p[1].toLocaleString('tr-TR')}`) : T(p));
  const items = pkg.items && pkg.items.length
    ? pkg.items
    : [{ title: pkg.base, monthly: false, price: null, features: [] }];

  let y;

  drawHeader(doc, {
    font, T, logo,
    subtitle: 'PROFORMA TEKLİF',
    no: `No: ${pkg.quoteNo || `DJT-PKG-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}${String(Math.floor(Math.random() * 900) + 100)}`}`,
    dateStr: new Date().toLocaleDateString('tr-TR'),
  });

  // 01 — firmalar
  y = 54;
  const boxW = (CW(W) - 6) / 2;
  infoBox(doc, {
    font, T, x: M, y, w: boxW, h: 30,
    label: 'HAZIRLAYAN',
    lines: [T('Dijitrak Ajans'), T('merhaba@dijitrak.com'), T('+90 554 203 04 73')],
  });
  infoBox(doc, {
    font, T, x: M + boxW + 6, y, w: boxW, h: 30,
    label: 'ALICI',
    lines: [T(info.name || '—'), ...(info.company ? [T(info.company)] : [])].slice(0, 3),
  });
  y += 38;

  // paket adı + kişiselleştirilmiş not
  if (pkg.name) {
    doc.setFont(font, 'bold');
    doc.setFontSize(15);
    doc.setTextColor(...INK);
    doc.text(wrap(doc, T(pkg.name), CW(W)).slice(0, 2), M, y);
    y += wrap(doc, T(pkg.name), CW(W)).slice(0, 2).length * 7;
  }
  if (pkg.note) {
    doc.setFont(font, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...GREY);
    const noteLines = wrap(doc, T(pkg.note), CW(W));
    doc.text(noteLines, M, y + 1);
    y += noteLines.length * 4.5 + 5;
  } else {
    y += 4;
  }

  // 02 — kalem kalem kapsam tablosu
  y = ensure(y, 50) ?? y;
  y = section(doc, { font, T, num: '01', text: 'PAKET KAPSAMI', y, W });
  y = tableHead(doc, { font, T, y, W, cols: [['KALEM', M + 5], ['TUTAR', W - M - 5, 'right']] });

  items.forEach((it, idx) => {
    const title = `${T(it.title)}${it.monthly ? T(' (aylık)') : ''}`;
    const price = it.price ? `${fmt(it.price)}${it.monthly ? T(' /ay') : ''}` : T('Talep üzerine');
    doc.setFont(font, 'bold');
    doc.setFontSize(10);
    const titleLines = wrap(doc, title, CW(W) - 62);
    doc.setFont(font, 'normal');
    doc.setFontSize(8);
    const featLines = (it.features || []).flatMap((f) => wrap(doc, T(f), CW(W) - 24));
    const rowH = 7 + titleLines.length * 5 + featLines.length * 4.2 + 4;
    y = ensure(y, rowH + 2) ?? y;

    if (idx % 2 === 0) {
      doc.setFillColor(...CARD_BG);
      doc.rect(M, y, CW(W), rowH, 'F');
    }
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.2);
    doc.line(M, y + rowH, W - M, y + rowH);

    // sıra numarası rozeti
    doc.setFillColor(...MINT);
    doc.roundedRect(M + 5, y + 6, 5.5, 5.5, 1, 1, 'F');
    doc.setFont(font, 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...TERMINAL);
    doc.text(String(idx + 1), M + 7.75, y + 10, { align: 'center' });

    doc.setFont(font, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...INK);
    doc.text(titleLines, M + 15, y + 8);
    doc.setFont(font, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...MINT_DARK);
    doc.text(price, W - M - 5, y + 8, { align: 'right' });

    let iy = y + 8 + titleLines.length * 5;
    doc.setFontSize(7.5);
    doc.setTextColor(...GREY);
    featLines.forEach((f) => {
      doc.text(`+  ${f}`, M + 17, iy);
      iy += 4.2;
    });
    y += rowH;
  });
  y += 10;

  // 03 — yatırım özeti
  const hasMonthly = Boolean(pkg.priceMonthly);
  const sumRows = [
    ['Tek seferlik yatırım', pkg.priceOne || 'Talep üzerine'],
    ...(hasMonthly ? [['Aylık hizmetler', pkg.priceMonthly]] : []),
  ];
  const boxH = sumRows.length * 9 + 18;
  y = ensure(y, 12 + boxH + 18) ?? y;
  y = section(doc, { font, T, num: '02', text: 'YATIRIM ÖZETİ', y, W });
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.4);
  doc.roundedRect(M, y, CW(W), boxH, 2, 2);
  doc.setFontSize(9);
  sumRows.forEach(([label, value], i) => {
    doc.setFont(font, 'normal');
    doc.setTextColor(...GREY);
    doc.text(T(label), M + 6, y + 10 + i * 9);
    doc.setFont(font, 'bold');
    doc.setTextColor(...INK);
    doc.text(T(String(value)), W - M - 6, y + 10 + i * 9, { align: 'right' });
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.2);
    doc.line(M, y + 13.5 + i * 9, W - M, y + 13.5 + i * 9);
  });
  // genel toplam şeridi
  doc.setFillColor(...MINT);
  doc.roundedRect(M, y + boxH - 12, CW(W), 12, 2, 2, 'F');
  doc.setFont(font, 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...TERMINAL);
  doc.text(T('GENEL TOPLAM (KDV hariç)'), M + 6, y + boxH - 4.5);
  doc.setFontSize(11);
  doc.text(T(String(pkg.priceOne || pkg.priceMonthly || 'Talep üzerine')), W - M - 6, y + boxH - 4.5, { align: 'right' });
  y += boxH + 6;
  doc.setFont(font, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...SOFT);
  doc.text(T('Tüm fiyatlar KDV hariçtir · Teklif 15 gün geçerlidir'), W - M, y, { align: 'right' });
  y += 10;

  // 04 — pakete dahil
  if ((pkg.includes || []).length) {
    y = ensure(y, 18 + pkg.includes.length * 11) ?? y;
    y = section(doc, { font, T, num: '03', text: 'PAKETE DAHİL', y, W });
    doc.setFont(font, 'normal');
    doc.setFontSize(9);
    pkg.includes.forEach((inc) => {
      const lines = wrap(doc, T(inc), CW(W) - 10);
      doc.setFillColor(...MINT);
      doc.circle(M + 2, y - 1.2, 1.2, 'F');
      doc.setTextColor(...INK);
      doc.text(lines[0], M + 7, y);
      lines.slice(1).forEach((l, j) => doc.text(l, M + 7, y + (j + 1) * 4.3));
      y += lines.length * 4.3 + 2.2;
    });
    y += 6;
  }

  // 05 — ödeme planı: üç aşamalı kurumsal kutu
  if (pkg.priceOne) {
    y = ensure(y, 42) ?? y;
    y = section(doc, { font, T, num: '04', text: 'ÖDEME PLANI', y, W });
    const steps = [
      ['%40', 'İş başlangıcında'],
      ['%40', 'Tasarım onayında'],
      ['%20', 'Teslimde'],
    ];
    const stepW = (CW(W) - 8) / 3;
    steps.forEach(([pct, label], i) => {
      const sx = M + i * (stepW + 4);
      doc.setFillColor(...CARD_BG);
      doc.setDrawColor(...LINE);
      doc.setLineWidth(0.3);
      doc.roundedRect(sx, y, stepW, 20, 2, 2, 'FD');
      doc.setFillColor(...MINT);
      doc.rect(sx, y, stepW, 1.6, 'F');
      doc.setFont(font, 'bold');
      doc.setFontSize(12);
      doc.setTextColor(...MINT_DARK);
      doc.text(pct, sx + 6, y + 11);
      doc.setFont(font, 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...GREY);
      doc.text(T(label), sx + 6, y + 16.5);
    });
    y += 28;
  }

  // 06 — koşullar
  {
    const lines = wrap(
      doc,
      T('Bu belge, sohbetinizde birlikte belirlediğimiz kapsamın ön teklif (proforma) özetidir. Kesin fiyat ve teslim takvimi, ücretsiz keşif görüşmesinin ardından 24 saat içinde yazılı teklifte yer alır. Fiyatlar KDV hariçtir ve teklif 15 gün geçerlidir.'),
      CW(W) - 12
    );
    y = ensure(y, 18 + lines.length * 4.2) ?? y;
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.3);
    doc.roundedRect(M, y, CW(W), lines.length * 4.2 + 10, 2, 2);
    doc.setFont(font, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...GREY);
    doc.text(lines, M + 6, y + 7);
    y += lines.length * 4.2 + 14;
  }

  // 07 — onay / imza
  y = ensure(y, 40) ?? y;
  y = section(doc, { font, T, num: '05', text: 'ONAY', y, W });
  doc.setFont(font, 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...INK);
  doc.text(T('Dijitrak yetkilisi'), M, y);
  doc.text(T('Müşteri'), W / 2 + 10, y);
  doc.setDrawColor(...INK);
  doc.setLineWidth(0.3);
  doc.line(M, y + 10, W / 2 - 12, y + 10);
  doc.line(W / 2 + 10, y + 10, W - M, y + 10);
  doc.setFont(font, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...SOFT);
  doc.text(T('Ad Soyad · Tarih / İmza'), M, y + 15);
  doc.text(T('Ad Soyad · Tarih / İmza'), W / 2 + 10, y + 15);

  drawFooters(doc, T, null, font);

  doc.save('dijitrak-paket-teklifi.pdf');
}