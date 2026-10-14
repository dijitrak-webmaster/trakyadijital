import React, { useRef, useState } from 'react';
import { Send, Mic, MicOff, Paperclip } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { BOT_TEXTS } from '@/lib/botI18n';

const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

export default function ChatInput({ onSend, onScreenshot, disabled }) {
  const { lang } = useLanguage();
  const T = BOT_TEXTS[lang] || BOT_TEXTS.tr;
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);
  const fileRef = useRef(null);

  const toggleMic = () => {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const rec = new SR();
    rec.lang = lang === 'en' ? 'en-US' : 'tr-TR';
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e) => {
      const t = Array.from(e.results).map((r) => r[0].transcript).join(' ').trim();
      if (t) setText((p) => (p ? `${p} ${t}` : t));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  };

  const pickFile = (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (f && !disabled) onScreenshot?.(f);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <form onSubmit={submit} className="border-t border-border bg-card p-3 sm:p-4">
      <div
        className={`flex items-center gap-2 sm:gap-3 rounded-xl border bg-card px-4 py-2.5 font-body text-sm transition-colors ${
          listening ? 'border-coral' : 'border-border focus-within:border-mint'
        }`}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={listening ? T.inputListening : T.inputPlaceholder}
          className="flex-1 min-w-0 bg-transparent outline-none text-base sm:text-sm text-foreground placeholder:text-foreground/40"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          aria-label={lang === 'en' ? 'Send a screenshot' : 'Ekran görüntüsü gönder'}
          title={lang === 'en' ? 'Send a screenshot' : 'Ekran görüntüsü gönder'}
          className="text-muted-foreground hover:text-mint transition-colors"
        >
          <Paperclip className="w-[18px] h-[18px]" />
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickFile} />
        {SR && (
          <button
            type="button"
            onClick={toggleMic}
            aria-label={listening ? 'Dinlemeyi durdur' : 'Sesli sor'}
            className={listening ? 'text-coral animate-pulse' : 'text-muted-foreground hover:text-mint transition-colors'}
          >
            {listening ? <MicOff className="w-[18px] h-[18px]" /> : <Mic className="w-[18px] h-[18px]" />}
          </button>
        )}
        <button type="submit" aria-label="Gönder" disabled={disabled} className="text-mint hover:text-sun transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}