import React from 'react';
import { PackageCheck } from 'lucide-react';

const INCLUDED = {
  tema: [
    'Seçtiğiniz temanın kurulumu ve yayına alınması',
    'Marka renkleri ve logonuza uyarlanır',
    'Masaüstü, tablet ve mobil uyumlu düzen',
    '1 yıl güncelleme desteği',
  ],
  paket: [
    'Alan adı kurulumu ve SSL sertifikası',
    'Web sitesi tasarımı ve geliştirme',
    'Temel SEO ayarları ve Google bağlantıları',
    '1 yıl bakım ve teknik destek',
  ],
  nfckart: [
    'Kişiselleştirilmiş NFC kart (marka renklerinizle)',
    'Dijital kartvizit sayfası kurulumu',
    'Sınırsız tarama ve içerik güncelleme',
    'Türkiye geneline ücretsiz kargo',
  ],
  eklenti: [
    'Eklentinin kurulumu ve ayarlanması',
    'İşletmenize özel özelleştirme',
    'Kısa kullanım eğitimi',
    '1 yıl teknik destek',
  ],
};

/** "Bu üründe neler var?" — kategoriye göre teslimat kapsamı. */
export default function ItemIncluded({ item }) {
  const list = INCLUDED[item.category] || INCLUDED.paket;

  return (
    <div className="rounded-3xl border border-border bg-card p-5 md:p-7">
      <h2 className="font-display text-xl font-bold">Bu üründe neler var?</h2>
      <ul className="mt-5 grid sm:grid-cols-2 gap-3">
        {list.map((line) => (
          <li key={line} className="flex items-start gap-3 rounded-full bg-secondary/50 border border-border px-4 py-3">
            <PackageCheck className="w-5 h-5 text-mint shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed text-foreground/85">{line}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}