import React from 'react';
import { motion } from 'framer-motion';
import LeadCaptureForm from '@/components/assistant/LeadCaptureForm';
import PackageCard from '@/components/assistant/PackageCard';
import QuoteChannels from '@/components/assistant/QuoteChannels';
import RobotMascot from '@/components/mascot/RobotMascot';
import SpeakButton from '@/components/assistant/SpeakButton';
import TestimonialBubbles from '@/components/assistant/TestimonialBubbles';
import NextStepsCard from '@/components/assistant/NextStepsCard';
import PlanCard from '@/components/assistant/PlanCard';
import WhatsappHandoff from '@/components/assistant/WhatsappHandoff';
import { useLanguage } from '@/lib/LanguageContext';
import { BOT_TEXTS } from '@/lib/botI18n';

export default function ChatMessage({ message, isLast, flow }) {
  const isBot = message.role === 'bot';
  const { lang } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 17 }}
      className={`flex ${isBot ? '' : 'justify-end'}`}
    >
      <div className={`relative max-w-[85%] ${message.image ? 'w-[92%] max-w-[280px]' : isBot ? 'w-[92%]' : ''}`}>
        <p className={`mb-1 font-mono text-[9px] font-semibold tracking-[0.18em] uppercase ${isBot ? 'text-mint/90' : 'text-muted-foreground text-right'}`}>
          {isBot ? 'DijiBot' : (lang === 'en' ? 'You' : 'Sen')}
        </p>
        <div
          className={`${message.image ? 'flex-col' : 'flex items-start gap-3'} px-4 py-3 font-body text-sm leading-relaxed text-foreground/90 ${
            isBot
              ? 'rounded-xl rounded-tl-sm border border-border bg-card'
              : 'rounded-xl rounded-tr-sm border border-primary/40 bg-primary/10'
          }`}
        >
          {isBot && (
            <RobotMascot
              emotion={isLast ? (message.pkg || flow.mood === 'quote' || flow.mood === 'success' ? 'excited' : 'happy') : 'idle'}
              className="w-9 h-10 shrink-0"
            />
          )}
          {message.image && (
            <img src={message.image} alt={message.text} className="mb-2 max-h-44 w-full max-w-[220px] rounded-lg border border-border object-cover" />
          )}
          <span className="min-w-0 whitespace-pre-line">{message.text}</span>
        </div>
        {isBot ? (
          <div className="mt-1.5 flex items-center gap-1.5">
            {message.time && <span className="font-mono text-[10px] text-muted-foreground/60">{message.time}</span>}
            <SpeakButton text={message.text} lang={lang} />
          </div>
        ) : (
          message.time && <span className="mt-1 block font-mono text-[10px] text-muted-foreground/60 text-right">{message.time}</span>
        )}
        {message.pkg && <PackageCard pkg={message.pkg} customer={message.customer} onBook={() => flow.choose(BOT_TEXTS[lang]?.menuAppt || 'Randevu al')} />}
        {message.plan?.length > 0 && <PlanCard items={message.plan} />}
        {message.nextSteps && <NextStepsCard />}
        {message.testimonials?.length > 0 && <TestimonialBubbles items={message.testimonials} />}
        {message.whatsapp && <WhatsappHandoff text={message.whatsapp} />}
        {isLast && message.channels && <QuoteChannels info={message.channels} quoteUrl={message.channels.quoteUrl} />}
        {isLast && !flow.typing && message.options && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.options.map((o, i) => (
              <motion.button
                key={o}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.12 + i * 0.07, type: 'spring', stiffness: 320, damping: 20 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => flow.choose(o)}
                className="rounded-full border border-mint/60 bg-mint/10 text-mint px-4 py-2 font-body text-xs font-semibold hover:bg-mint hover:text-ink transition-colors"
              >
                {o}
              </motion.button>
            ))}
          </div>
        )}
        {isLast && message.widget && flow.step === 'form' && <LeadCaptureForm mode={message.widget} onSubmit={flow.submitLead} />}
      </div>
    </motion.div>
  );
}