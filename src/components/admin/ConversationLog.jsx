import React from 'react';
import { User, Bot, SendHorizonal } from 'lucide-react';
import moment from 'moment';

// Lead.conversation kaydını okunur sohbet balonlarına çevirir.
// Satır biçimi: "[iso #mesajId] Kullanici: metin" / "[iso] DijiBot: metin" / "[iso] Sablon (ad): ..."
// Eski kayıtlarda bot cevapları damgasız "DijiBot: ..." diye başlayabilir — bunlar da
// ayrı balon olarak gösterilir (müşterinin balonuna karışmasın).
const AUTHOR_PREFIX = [
  [/^DijiBot:/, 'bot'],
  [/^Kullanici:/, 'user'],
  [/^Asistan:/, 'bot'],
  [/^Ziyaret[çc]i:/, 'user'],
  [/^Sablon/, 'template'],
];
const parse = (raw) => {
  const out = [];
  String(raw || '').split('\n').forEach((line) => {
    const trim = line.trim();
    if (/^\[/.test(trim)) {
      const m = trim.match(/^\[([^\]]+)\]\s*(.*)$/);
      if (m) {
        const meta = m[1].split('#')[0].trim();
        const rest = m[2];
        const isBot = rest.startsWith('DijiBot:') || rest.startsWith('Asistan:');
        const isTpl = rest.startsWith('Sablon');
        out.push({
          time: meta && !isNaN(new Date(meta).getTime()) ? meta : null,
          author: isBot ? 'bot' : isTpl ? 'template' : 'user',
          text: isBot ? rest.replace(/^(DijiBot|Asistan):\s*/, '').trim() : isTpl ? rest.slice(6).trim() : rest.replace(/^Kullanici:\s*/, '').replace(/^Ziyaret[çc]i:\s*/, '').trim(),
        });
        return;
      }
    }
    const un = AUTHOR_PREFIX.find(([re]) => re.test(trim));
    if (un) {
      const isTpl = un[1] === 'template';
      out.push({
        time: null,
        author: un[1],
        text: isTpl ? trim.slice(6).trim() : trim.replace(/^(DijiBot|Asistan|Kullanici):\s*/, '').replace(/^Ziyaret[çc]i:\s*/, '').trim(),
      });
      return;
    }
    if (out.length) out[out.length - 1].text += `\n${line}`;
  });
  return out;
};

const STYLES = {
  user: { align: 'justify-end', bubble: 'bg-secondary/70 border-border', name: 'Müşteri' },
  bot: { align: 'justify-start', bubble: 'bg-card border-mint/30', name: 'DijiBot' },
  template: { align: 'justify-start', bubble: 'bg-card border-sun/40', name: 'Şablon' },
};

export default function ConversationLog({ conversation }) {
  const entries = parse(conversation);
  if (!entries.length) return null;
  return (
    <div className="space-y-2.5">
      {entries.map((e, i) => {
        const s = STYLES[e.author];
        return (
          <div key={i} className={`flex ${s.align}`}>
            <div className={`max-w-[85%] rounded-2xl border px-3.5 py-2.5 ${s.bubble}`}>
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {e.author === 'bot' ? <Bot className="w-3 h-3 text-mint" /> : e.author === 'template' ? <SendHorizonal className="w-3 h-3 text-sun" /> : <User className="w-3 h-3" />}
                <span>{s.name}</span>
                {e.time && <span className="normal-case tracking-normal">· {moment(e.time).format('DD MMM HH:mm')}</span>}
              </div>
              <p className="text-sm whitespace-pre-wrap leading-relaxed mt-1">{e.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}