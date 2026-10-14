import React, { useState } from 'react';
import { Volume2, Square } from 'lucide-react';

// 🗣️ Sesli yanıt: tarayıcının konuşma sentezini kullanır — kredi gerektirmez
export default function SpeakButton({ text, lang }) {
  const [speaking, setSpeaking] = useState(false);

  const toggle = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'en' ? 'en-US' : 'tr-TR';
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={speaking ? 'Seslendirmeyi durdur' : 'Sesli oku'}
      title={speaking ? 'Seslendirmeyi durdur' : 'Sesli oku'}
      className={`inline-flex items-center justify-center rounded-md border-2 bg-secondary/70 p-1 transition-colors ${speaking ? 'border-mint/60 text-mint' : 'border-border text-muted-foreground/80 hover:text-mint hover:border-mint/60'}`}
    >
      {speaking ? <Square className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
    </button>
  );
}