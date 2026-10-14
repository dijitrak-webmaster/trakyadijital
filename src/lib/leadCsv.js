const esc = (v) => `"${String(v ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;

/** Filtrelenmiş talep listesini Excel uyumlu (UTF-8 BOM + noktalı virgül) CSV olarak indirir. */
export function downloadLeadsCsv(leads) {
  const headers = ['Tarih', 'Ad', 'Telefon', 'E-posta', 'Firma', 'Tip', 'Hizmet', 'Sektör', 'Tahmini Bütçe', 'Randevu', 'Durum', 'Referans', 'Mesaj'];
  const rows = leads.map((l) => [
    new Date(l.created_date).toLocaleString('tr-TR'),
    l.name, l.phone, l.email, l.company, l.type, l.service, l.sector, l.estimate,
    l.appointment_date ? `${l.appointment_date} ${l.appointment_time || ''}`.trim() : '',
    l.status || 'new', l.referral, l.message,
  ]);
  const csv = [headers, ...rows].map((r) => r.map(esc).join(';')).join('\r\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dijitrak-talepler-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}