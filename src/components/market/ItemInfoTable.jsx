import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import StarRating from '@/components/market/StarRating';

const fmt = (d) => (d ? format(new Date(d), 'd MMMM yyyy', { locale: tr }) : '—');

export default function ItemInfoTable({ item, catLabel }) {
  const rows = [
    ['Son güncelleme', fmt(item.updated_date)],
    ['Yayın tarihi', fmt(item.created_date)],
    ['Kategori', catLabel],
    ...(item.preview_url ? [['Düzen', 'Responsive'], ['Uyumluluk', 'Masaüstü, Tablet, Mobil']] : []),
  ];
  const ratingRow = item.rating ? (
    <div className="flex justify-between gap-4 py-2.5">
      <dt className="text-muted-foreground">Puan</dt>
      <dd><StarRating rating={item.rating} count={item.rating_count} /></dd>
    </div>
  ) : null;
  return (
    <div className="rounded-3xl border border-border bg-card p-5 md:p-6">
      <h2 className="font-display text-lg font-semibold">Ürün bilgileri</h2>
      <dl className="mt-3 divide-y divide-border text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-2.5">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="font-medium text-right">{v}</dd>
          </div>
        ))}
        {ratingRow}
      </dl>
    </div>
  );
}