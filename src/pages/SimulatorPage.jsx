import React from 'react';
import ProjectSimulator from '@/components/site/ProjectSimulator';
import useSeo from '@/hooks/useSeo';

export default function SimulatorPage() {
  useSeo({
    title: 'Proje Simülatörü — Tahmini Bütçe ve Süre Hesaplayın | Dijitrak',
    description: 'Web mi mobil mi? Hangi özellikler? 3 adımda projenizi simüle edin; tahmini maliyet aralığını ve süreç takvimini anında görün.',
    path: '/simulasyon',
  });
  return (
    <div className="max-w-6xl mx-auto px-5 md:px-6 pt-28 md:pt-32 pb-24">
      <ProjectSimulator />
    </div>
  );
}