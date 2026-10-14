import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { mapDistricts } from '@/lib/trakyaMapData';

// Harita skorlarını veritabanından çeker; kayıt yoksa statik değerle devam eder
export default function useDistrictScores() {
  const [districts, setDistricts] = useState(mapDistricts);

  useEffect(() => {
    let alive = true;
    base44.entities.DistrictScore.list()
      .then((rows) => {
        if (!alive || !rows?.length) return;
        const bySlug = Object.fromEntries(rows.map((r) => [r.slug, r.score]));
        setDistricts(mapDistricts.map((d) => ({ ...d, score: bySlug[d.slug] ?? d.score })));
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  return districts;
}