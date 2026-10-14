import React, { useState } from 'react';
import useSeo from '@/hooks/useSeo';
import { MATURITY_QUESTIONS } from '@/lib/maturityQuiz';
import QuizStep from '@/components/maturity/QuizStep';
import MaturityResult from '@/components/maturity/MaturityResult';

// Dijital Olgunluk Testi — 10 soru, anında puan ve yol haritası
export default function MaturityPage() {
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  useSeo({
    title: 'Dijital Olgunluk Testi — 10 Soruda Dijital Durumunuz | Dijitrak',
    description: '10 soruluk ücretsiz testle dijital olgunluk puanınızı öğrenin; eksik alanlarınızı ve size özel yol haritasını anında görün.',
    path: '/olgunluk-testi',
  });

  const total = MATURITY_QUESTIONS.length;
  const answered = Object.keys(answers).length;
  const finished = done || answered >= total;

  const select = (points) => {
    const q = MATURITY_QUESTIONS[answered];
    setAnswers((a) => ({ ...a, [q.key]: points }));
  };

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-6 pt-36 md:pt-44 pb-24">
      <header className="mb-8">
        <p className="font-mono text-xs tracking-[0.22em] text-sun">// ÜCRETSİZ ARAÇ</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl mt-2">Dijital Olgunluk <span className="text-mint">Testi</span></h1>
        <p className="text-sm text-foreground/70 mt-2 max-w-xl">
          10 soruda işletmenizin dijital durumunu ölçün; 100 üzerinden puanınızı ve en zayıf alanlarınıza özel yol haritanızı anında görün. Kayıt gerekmez.
        </p>
      </header>
      <div className="rounded-3xl border-2 border-border bg-card p-5 md:p-8 shadow-sticker">
        {finished ? (
          <MaturityResult answers={answers} onRetake={() => { setAnswers({}); setDone(false); }} />
        ) : (
          <QuizStep question={MATURITY_QUESTIONS[answered]} index={answered} total={total} onSelect={select} />
        )}
      </div>
    </div>
  );
}