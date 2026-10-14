import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useLanguage } from '@/lib/LanguageContext';
import { BOT_TEXTS } from '@/lib/botI18n';
import { useAssistant } from '@/lib/AssistantContext';
import useAssistantFlow from '@/components/assistant/useAssistantFlow';
import ChatMessage from '@/components/assistant/ChatMessage';
import ChatInput from '@/components/assistant/ChatInput';
import QuickActions from '@/components/assistant/QuickActions';
import QuoteSteps from '@/components/assistant/QuoteSteps';
import RobotMascot from '@/components/mascot/RobotMascot';
import confetti from 'canvas-confetti';

const MOOD_EMOTIONS = { greeting: 'happy', quote: 'excited', happy: 'happy', success: 'excited', sending: 'sending', error: 'error', idle: 'idle' };
const STATUS_KEYS = { greeting: 'statusGreeting', quote: 'statusQuote', happy: 'statusHappy', success: 'statusSuccess', sending: 'statusSending', error: 'statusError', idle: 'statusIdle' };

export default function AssistantPanel() {
  const { isOpen, setOpen, pending, clearPending } = useAssistant();
  const { lang, toggle } = useLanguage();
  const S = BOT_TEXTS[lang] || BOT_TEXTS.tr;
  const flow = useAssistantFlow();
  const endRef = useRef(null);

  const emotion = flow.typing ? 'thinking' : MOOD_EMOTIONS[flow.mood] || 'idle';
  const status = flow.typing ? S.typing : S[STATUS_KEYS[flow.mood]] || S.statusIdle;

  // Celebration when a lead is successfully submitted
  useEffect(() => {
    if (flow.mood !== 'success') return;
    confetti({
      particleCount: 130,
      spread: 80,
      startVelocity: 42,
      origin: { x: 0.82, y: 0.35 },
      colors: ['#7fe2b0', '#ffe14d', '#ff7a64'],
    });
  }, [flow.mood]);

  useEffect(() => {
    if (!pending) return;
    if (pending.domain) flow.startDomainSuggest(pending.domain);
    else if (pending.text) flow.sendText(pending.text);
    else if (pending.service) flow.startQuoteFor(pending.service);
    else if (pending.sector) flow.startWithSector(pending.sector);
    else if (pending.intent) flow.startIntent(pending.intent);
    clearPending();
  }, [pending]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [flow.messages, flow.typing]);

  const last = flow.messages.length - 1;

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="fixed w-full h-[100dvh] max-h-[100dvh] sm:max-w-none sm:w-[480px] lg:w-[40vw] p-0 gap-0 bg-background border-l border-border flex flex-col overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border bg-card">
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }} className="relative shrink-0 rounded-xl border border-border bg-background p-1">
              <RobotMascot emotion={emotion} className="w-9 h-11" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="font-display text-lg sm:text-xl font-semibold text-foreground leading-tight tracking-tight">
                Diji<span className="text-mint">Bot</span>
              </SheetTitle>
              <SheetDescription className="font-mono text-[10px] sm:text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${flow.typing ? 'bg-sun' : 'bg-mint'}`} />
                <span className="truncate">{status}</span>
              </SheetDescription>
            </div>
            <button
              type="button"
              onClick={flow.reset}
              title={lang === 'en' ? 'New chat' : 'Yeni sohbet'}
              aria-label={lang === 'en' ? 'New chat' : 'Yeni sohbet'}
              className="shrink-0 rounded-full border border-border bg-card/60 p-2 text-muted-foreground hover:text-mint hover:border-mint/50 hover:rotate-180 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={toggle}
              title="Türkçe / English"
              className="shrink-0 mr-8 sm:mr-9 rounded-full border border-border bg-card/60 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wide text-muted-foreground hover:text-mint hover:border-mint/50 transition-colors"
            >
              {lang === 'tr' ? 'EN' : 'TR'}
            </button>
          </div>
        </div>
        {flow.quoteFlow && <QuoteSteps step={flow.step} lang={lang} />}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 sm:py-6 space-y-5 bg-dots">
          <div className="flex justify-center">
            <span className="font-mono text-[11px] text-muted-foreground bg-secondary border border-border rounded-full px-4 py-1">
              {lang === 'en' ? 'Today' : 'Bugün'}
            </span>
          </div>
          {flow.messages.map((m, i) => <ChatMessage key={i} message={m} isLast={i === last} flow={flow} />)}
          {flow.typing && (
            <div className="flex items-center gap-2">
              <RobotMascot emotion="thinking" className="w-8 h-9 shrink-0" />
              <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-2.5">
                <div className="flex gap-1">
                  {[0, 1, 2].map((d) => <span key={d} className="w-1.5 h-1.5 rounded-full bg-mint animate-bounce" style={{ animationDelay: `${d * 140}ms` }} />)}
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">{S.typing}</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        {flow.step !== 'form' && <QuickActions onSend={flow.sendText} onReset={flow.reset} onCoach={() => flow.startIntent('coach')} disabled={flow.typing} />}
        <ChatInput onSend={flow.sendText} onScreenshot={flow.sendScreenshot} disabled={flow.typing} />
      </SheetContent>
    </Sheet>
  );
}