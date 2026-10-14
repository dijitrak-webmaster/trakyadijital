import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssistant } from '@/lib/AssistantContext';
import { useCart } from '@/lib/CartContext';
import RobotMascot from '@/components/mascot/RobotMascot';

const AMBIENT = ['idle', 'happy', 'thinking'];

// Interactive guide bubbles — greeting first, then rotating tips
const BUBBLES = [
  { text: 'Merhaba, ben DijiBot! Tıkla — fiyat, teklif, randevu… hepsinde yardımcı olurum.', emotion: 'happy' },
  { text: 'Fiyat teklifi 30 saniyede hazır — hemen başlayalım mı?', emotion: 'excited' },
  { text: 'Proje simülatörüyle bütçeni adım adım hesaplayabilirim!', emotion: 'thinking' },
  { text: 'Randevu ayarlamak çok kolay — bana tıkla!', emotion: 'excited' },
];

/**
 * Floating DijiBot companion: greets you, rotates guide tips, changes emotions
 * on its own, gets excited on hover and opens the AI assistant on click.
 */
export default function MascotCompanion() {
  const { openAssistant, isOpen } = useAssistant();
  const { items } = useCart();
  // çerez bandı ekrandayken maskot onun üstüne binmesin
  const [consented] = useState(() => !!localStorage.getItem('dijitrak_cookie_consent'));
  const [emotion, setEmotion] = useState('happy');
  const [bubbleText, setBubbleText] = useState(null);
  const [hover, setHover] = useState(false);
  const [typed, setTyped] = useState('');
  const tipRef = useRef(0);
  const prevCart = useRef(items.length);
  const flashTimer = useRef(null);

  // Greeting on arrival, then a rotating tip every 45s
  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => { setBubbleText(BUBBLES[0].text); setEmotion('happy'); }, 2500));
    timers.push(setTimeout(() => setBubbleText(null), 16000));
    const rotate = setInterval(() => {
      tipRef.current = (tipRef.current % (BUBBLES.length - 1)) + 1;
      setBubbleText(BUBBLES[tipRef.current].text);
      setEmotion(BUBBLES[tipRef.current].emotion);
      timers.push(setTimeout(() => setBubbleText(null), 9000));
    }, 45000);
    return () => { timers.forEach(clearTimeout); clearInterval(rotate); clearTimeout(flashTimer.current); };
  }, []);

  // Sayfa gezinirken / okurken 'düşünüyor' — kaydırma bitince keyiflenir
  useEffect(() => {
    let t;
    const onScroll = () => {
      setEmotion('thinking');
      clearTimeout(t);
      t = setTimeout(() => setEmotion((e) => (e === 'thinking' ? 'happy' : e)), 800);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(t); };
  }, []);

  // Sekmeye geri dönünce sevinerek selamlar
  useEffect(() => {
    const onVis = () => { if (!document.hidden) { setEmotion('excited'); setHover(true); setTimeout(() => setHover(false), 2500); } };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Sepete ekleme: zıplar + kısa tebrik balonu
  useEffect(() => {
    if (items.length > prevCart.current) {
      setEmotion('excited');
      setBubbleText('Sepete eklendi — iyi seçim! 🛒');
      clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setBubbleText(null), 5500);
    }
    prevCart.current = items.length;
  }, [items.length]);

  // Ambient emotion changes while no bubble is showing
  useEffect(() => {
    if (hover || bubbleText) return;
    const i = setInterval(() => setEmotion(AMBIENT[Math.floor(Math.random() * AMBIENT.length)]), 7000);
    return () => clearInterval(i);
  }, [hover, bubbleText]);

  // Typewriter effect for the tip bubble
  useEffect(() => {
    if (!bubbleText) { setTyped(''); return; }
    setTyped('');
    let i = 0;
    const iv = setInterval(() => {
      i += 2;
      setTyped(bubbleText.slice(0, i));
      if (i >= bubbleText.length) clearInterval(iv);
    }, 26);
    return () => clearInterval(iv);
  }, [bubbleText]);

  if (isOpen) return null;

  return (
    <div className={`fixed right-4 ${consented ? 'bottom-24' : 'bottom-60'} lg:bottom-5 lg:right-5 z-40 flex flex-col items-end pointer-events-none`}>
      <AnimatePresence>
        {bubbleText && (
          <motion.button
            key={bubbleText}
            onClick={() => openAssistant()}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="pointer-events-auto mb-2 max-w-[210px] min-h-[64px] rounded-2xl border-2 border-ink bg-card px-4 py-2.5 text-left text-xs font-semibold shadow-sticker cursor-pointer hover:-translate-y-0.5 transition-transform"
          >
            {typed}
            {bubbleText && typed.length < bubbleText.length && <span className="text-mint cursor-blink">▌</span>}
          </motion.button>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => openAssistant()}
        onMouseEnter={() => { setHover(true); setEmotion('excited'); }}
        onMouseLeave={() => { setHover(false); setEmotion('idle'); }}
        animate={emotion === 'excited' ? { y: [0, -12, 0] } : {}}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        whileHover={{ scale: 1.08, rotate: -4 }}
        whileTap={{ scale: 0.9 }}
        aria-label="DijiBot ile konuş"
        className="pointer-events-auto"
      >
        <RobotMascot emotion={emotion} />
      </motion.button>
    </div>
  );
}