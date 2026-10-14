import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { services } from '@/lib/siteData';
import { serviceCatalog } from '@/lib/serviceCatalog';
import { answerContext, estimateFor } from '@/lib/assistantKnowledge';
import { buildPackage, summaryText } from '@/lib/packageBuilder';
import { flavorLine } from '@/lib/dijiBotPersona';
import { BOT_TEXTS, SECTOR_LABELS } from '@/lib/botI18n';
import { useLanguage } from '@/lib/LanguageContext';
import { useAssistant } from '@/lib/AssistantContext';
import { getVisitorInfo } from '@/lib/visitorInfo';
import { loadMarketKB, marketAnswer, marketBrief } from '@/lib/marketKnowledge';
import detectNeeds from '@/lib/detectNeeds';
import coachPlan from '@/lib/coachPlan';
import { uploadWithProgress, signFileUri } from '@/lib/uploadClient';

const SECTORS = ['Tarım', 'Sanayi', 'Yerel Ticaret', 'Turizm & Konaklama', 'Gıda & Restoran', 'Diğer'];
const STORE_KEY = 'dijibot-session-v2'; // v1: eski biçimli oturumlar yeni sürümde paneli çökertebiliyordu
// ⭐ referans/yorum niyeti — sohbete gerçek müşteri kartları eklenir
const TESTI_KEYS = ['referans', 'yorum', 'memnuniyet', 'testimonial', 'review', 'reference'];
const clock = () => new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

// 💾 sohbet oturumu tarayıcıda saklanır — geri dönünce kaldığı yerden devam
// bozuk/eski biçimli oturumlar panelin açılmasını engellemesin: hepsi doğrulanır
const VALID_STEPS = ['menu', 'service', 'sector', 'discover', 'free', 'form', 'domain'];
const loadSession = () => {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (!s || !Array.isArray(s.messages)) return null;
    const ok = s.messages.filter((m) => m && typeof m.role === 'string' && typeof m.text === 'string');
    if (!ok.length || ok.length !== s.messages.length) return null;
    return {
      messages: ok.map((m) => ({ ...m, options: Array.isArray(m.options) ? m.options : undefined })),
      step: VALID_STEPS.includes(s.step) ? s.step : 'menu',
      draft: s.draft && typeof s.draft === 'object' && !Array.isArray(s.draft) ? s.draft : {},
      reminded: Boolean(s.reminded),
    };
  } catch { return null; }
};
const saveSession = (s) => {
  // görsel önizlemeleri (blob URL) kalıcı değil — kayıtta çıkarılır
  try { localStorage.setItem(STORE_KEY, JSON.stringify({ ...s, messages: s.messages.map(({ image, ...m }) => m) })); } catch { /* kota dolu vs. — sessizce */ }
};

export default function useAssistantFlow() {
  const { lang, tl } = useLanguage();
  const T = BOT_TEXTS[lang] || BOT_TEXTS.tr;

  const MENU = [T.menuQuote, T.menuAppt, T.menuPackage, T.menuCoach, T.menuQuestion, T.menuWhatsapp];
  const INTENTS = {
    [T.menuQuote]: 'quote',
    [T.menuAppt]: 'appointment',
    [T.menuPackage]: 'package',
    [T.menuCoach]: 'coach',
    [T.menuQuestion]: 'question',
    [T.menuWhatsapp]: 'whatsapp',
    [T.expert]: 'expert',
  };

  // 🌍 gösterim etiketi ↔ kayıtlı değer: kayıtlı değerler (CRM) hep Türkçe kalır
  const serviceLabel = (title) => (typeof title === 'string' ? tl(title) : title);
  const revService = {};
  const serviceOptions = services.map((s) => {
    const l = serviceLabel(s.title);
    revService[l] = s.title;
    return l;
  });
  const revSector = {};
  const sectorOptions = SECTORS.map((s) => {
    const l = SECTOR_LABELS[lang]?.[s] || s;
    revSector[l] = s;
    return l;
  });

  // 🧠 portal bağlamı: kayıtlı müşteri panelinden yazarsa DijiBot dashboard verisini bilir
  const ctxInfo = useAssistant();
  const customerContext = ctxInfo?.customerContext || null;

  // 🛍️ market bilgisi: yayında ürünler, bundle'lar ve kampanyalar canlı DB'den
  const [marketKB, setMarketKB] = useState(null);
  useEffect(() => { loadMarketKB().then(setMarketKB); }, []);

  const customerBrief = () => {
    if (!customerContext?.projects) return null;
    const lines = [];
    if (customerContext.user?.full_name) lines.push(`Müşteri adı: ${customerContext.user.full_name}`);
    const projects = customerContext.projects || [];
    if (projects.length) {
      projects.slice(0, 5).forEach((p) => {
        lines.push(`- Proje "${p.title}": durum ${p.status}, tamamlanma %${p.progress ?? 0}${p.report ? `, son rapor: ${String(p.report).slice(0, 300)}` : ''}${p.live_url ? `, canlı adres: ${p.live_url}` : ''}`);
      });
    } else {
      lines.push('- Henüz aktif projesi yok.');
    }
    (customerContext.leads || []).slice(0, 5).forEach((l) => {
      lines.push(`- Teklif/randevu kaydı: ${l.service || l.type} (${l.status})${l.estimate ? `, tahmin: ${l.estimate}` : ''}`);
    });
    (customerContext.subscriptions || []).filter((s) => s.status !== 'cancelled').slice(0, 5).forEach((s) => {
      lines.push(`- Aktif abonelik: ${s.item_title}, aylık ${s.monthly_price} TL, bitiş ${s.end_date}`);
    });
    const openQs = (customerContext.messages || []).filter((m) => !m.answer);
    if (openQs.length) {
      lines.push(`Yanıt bekleyen ${openQs.length} sorusu var: ${openQs.slice(0, 3).map((m) => `"${String(m.question || m.text || '').slice(0, 80)}"`).join(', ')}`);
    }
    if ((customerContext.files || []).length) lines.push(`Portala ${customerContext.files.length} dosya paylaşılmış.`);
    return lines.length ? lines.join('\n').slice(-2500) : null;
  };

  const session = useRef(loadSession()).current;
  const [messages, setMessages] = useState(() => (session?.messages?.length > 1
    ? session.messages
    : [{ role: 'bot', text: T.greeting, options: MENU, time: clock() }]));
  const [step, setStep] = useState(session?.step || 'menu');
  const [draft, setDraft] = useState(session?.draft || {});
  const [typing, setTyping] = useState(false);
  // DijiBot mood: greeting | quote | happy | success | idle — drives mascot emotions
  const [mood, setMood] = useState('greeting');
  const [reminded, setReminded] = useState(session?.reminded || false);

  useEffect(() => {
    saveSession({ messages, step, draft, reminded });
  }, [messages, step, draft, reminded]);

  // 🔁 yarım kalan form hatırlatması — yalnızca geri dönen oturumda bir kez
  useEffect(() => {
    if (step === 'form' && !reminded && messages.length > 1) {
      setReminded(true);
      setMessages((p) => [...p, { role: 'bot', text: T.nudge, time: clock() }]);
    }
    // yalnızca mount'ta değerlendirilir
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addUser = (text) => setMessages((p) => [...p, { role: 'user', text, time: clock() }]);
  const flavorIdx = useRef(0);
  const botSay = (m) => {
    setTyping(true);
    // response feels alive: delay grows with answer length
    const delay = Math.min(1500, 480 + (m.text || '').length * 6);
    // persona: her yanıta mood'a göre dönen kısa bir taktım eklenir
    const line = flavorLine(m.flavor || 'idle', flavorIdx.current++);
    const body = line ? `${line}\n${m.text}` : m.text;
    setTimeout(() => {
      setMessages((p) => [...p, { role: 'bot', ...m, text: body, time: clock() }]);
      setTyping(false);
    }, delay);
  };

  // AI katmanı: paket notunu kişiselleştirir; AI çalışmıyorsa (kredi/bitmiş servis)
  // kural tabanlı not aynen kalır — akış asla kopmaz
  const enhancePackage = async (next) => {
    try {
      const res = await base44.functions.invoke('aiPackageNote', {
        service: next.service || '',
        sector: next.sector || '',
        message: (next.message || '').slice(0, 300),
        lines: (next.pkg.items || []).map((i) => i.title),
      });
      if (res?.data?.note) next.pkg = { ...next.pkg, note: res.data.note, pitch: res.data.pitch || '' };
    } catch (e) { /* sessizce hazıra dön */ }
  };

  // sektör + hizmet netleşince teklifi/paketi sunar
  // her teklif akışı paket üretir — böylece form sonrası teklif sayfası + PDF her zaman oluşur
  const presentQuote = async (next) => {
    if (next.packageMode || next.type === 'quote') {
      // hazır kalıp yok: önce doğal keşif sohbeti — işletme tam anlaşılınca paket kurulur
      if (!next.discoveryDone) return beginDiscovery(next);
      next.estimate = estimateFor(next.service);
      next.pkg = buildPackage({ service: next.service, sector: next.sector, message: next.message || '' });
      // kalıcı teklif numarası — PDF'te ve Lead kaydında aynı kalır (CRM'de aratılabilir)
      next.pkg.quoteNo = `DJT-PKG-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}${String(Math.floor(Math.random() * 900) + 100)}`;
      setTyping(true);
      await enhancePackage(next);
      botSay({ text: T.packageReady, pkg: next.pkg, widget: 'contact', options: [T.repack, T.expert], flavor: 'quote' });
    } else {
      botSay({ text: T.apptPrompt, widget: 'appointment' });
    }
    setMood('happy');
    setDraft(next);
    setStep('form');
  };

  // sektör sayfasından gelen ziyaretçi: sektör hazır, sadece hizmet sorulur
  const startWithSector = (sector) => {
    setDraft({ type: 'quote', sector });
    setMood('quote');
    setStep('service');
    botSay({ text: T.serviceSectorIntro(SECTOR_LABELS[lang]?.[sector] || sector), options: serviceOptions, flavor: 'quote' });
  };

  const startQuoteFor = (service) => {
    const next = { type: 'quote', service, sector: draft.sector, message: draft.message };
    setMood('quote');
    if (next.sector) return presentQuote(next);
    setDraft(next);
    setStep('sector');
    botSay({ text: T.sectorAskFor(serviceLabel(service)), options: sectorOptions, flavor: 'quote' });
  };

  const startIntent = (intent) => {
    if (intent === 'whatsapp') {
      setDraft((d) => ({ ...d, type: d.type || 'question' }));
      const handoffText = `Merhaba! DijiBot sohbetinden devam ediyorum.${draft.service ? ` Konu: ${draft.service}.` : ''}`;
      return botSay({ text: T.whatsappHandoff, whatsapp: handoffText, options: MENU });
    }
    if (intent === 'expert') {
      setDraft((d) => ({ ...d, type: d.type || 'question' }));
      setStep('form');
      return botSay({ text: T.expertOk, widget: 'contact' });
    }
    if (intent === 'coach') {
      setDraft((d) => ({ ...d, type: d.type || 'question' }));
      setMood('happy');
      setStep('free');
      return botSay({ text: T.coachPrompt });
    }
    if (intent === 'package' || intent === 'quote') {
      // sohbette söylenen hizmet/sektör korunur; eksikler keşif sohbetinde doğal olarak anlaşılır
      const carry = { type: 'quote', packageMode: true, message: draft.message, sector: draft.sector, service: draft.service };
      return presentQuote(carry);
    }
    setDraft({ type: intent });
    setMood(intent === 'quote' ? 'quote' : 'happy');
    if (intent === 'question') {
      setStep('free');
      return botSay({ text: T.freePrompt });
    }
    setStep('service');
    botSay({ text: intent === 'quote' ? T.serviceQuote : T.serviceAppt, options: serviceOptions });
  };

  // ── doğal keşif sohbeti: tekliften önce işletmeyi gerçekten anlamak ──
  const DISC_QUESTIONS = () => [
    { key: 'mevcut', ask: T.discQ1, options: T.discQ1Options },
    { key: 'hedef', ask: T.discQ2, options: T.discQ2Options },
    { key: 'zaman', ask: T.discQ3, options: T.discQ3Options },
    { key: 'butce', ask: T.discQ4, options: T.discQ4Options },
  ];

  // serbest metinden cevap ipucu — kullanıcı seçenek yerine yazarsa biz anlarız
  const autoDetect = (text) => {
    const t = (text || '').toLocaleLowerCase('tr-TR');
    const O = T.discQ1Options, G = T.discQ2Options, Z = T.discQ3Options, B = T.discQ4Options;
    const out = {};
    if (/yenile/.test(t)) out.mevcut = O[0];
    else if (/memnun değil/.test(t)) out.mevcut = O[1];
    else if (/(yok|sıfır|sifir)/.test(t)) out.mevcut = O[2];
    else if (/sosyal medya/.test(t)) out.mevcut = O[3];
    if (/(satış|satis|satmak|mağaza|magaza|e-ticaret)/.test(t)) out.hedef = G[0];
    else if (/(randevu|müşteri|musteri|rezervasyon|lead)/.test(t)) out.hedef = G[1];
    else if (/(marka|tanın|görünürlük|gorunurluk)/.test(t)) out.hedef = G[2];
    else if (/(ihracat|export|dilli|yurt dışı|yurt disi)/.test(t)) out.hedef = G[3];
    if (/(hemen|acil|asap)/.test(t)) out.zaman = Z[0];
    else if (/(1 ay|bir ay)/.test(t)) out.zaman = Z[1];
    else if (/(planlama|planlı|planli|sonra)/.test(t)) out.zaman = Z[2];
    if (/(ekonomik|ucuz|uygun fiyat)/.test(t)) out.butce = B[0];
    else if (/standart/.test(t)) out.butce = B[1];
    else if (/(kapsamlı|kapsamli|uçtan uca|uctan uca|premium)/.test(t)) out.butce = B[2];
    return out;
  };

  const beginDiscovery = (next) => {
    setMood('quote');
    setDraft({ ...next, type: 'quote', packageMode: true, discovery: {}, discIdx: 0, discoveryDone: false });
    setStep('discover');
    botSay({ text: T.discIntro, options: [T.discSkip], flavor: 'quote' });
  };

  const finishDiscovery = async (d = draft) => {
    const disc = d.discovery || {};
    const parts = [
      d.message,
      disc.intro,
      disc.mevcut && `Mevcut durum: ${disc.mevcut}`,
      disc.hedef && `Hedef: ${disc.hedef}`,
      disc.zaman && `Zamanlama: ${disc.zaman}`,
      disc.butce && `Bütçe: ${disc.butce}`,
    ].filter(Boolean);
    const next = { ...d, type: 'quote', packageMode: true, discoveryDone: true, message: parts.join('\n') };
    setDraft(next);
    if (!next.service) {
      setStep('service');
      return botSay({ text: T.serviceQuote, options: serviceOptions, flavor: 'quote' });
    }
    if (!next.sector) {
      setStep('sector');
      return botSay({ text: T.sectorAsk, options: sectorOptions, flavor: 'quote' });
    }
    return presentQuote(next);
  };

  // cevaplandıkça ilerler; serbest metinde zaten anlaşılan sorular otomatik atlanır
  const advanceDiscovery = (d, fromIdx) => {
    const qs = DISC_QUESTIONS();
    const disc = { ...(d.discovery || {}) };
    const detect = () => autoDetect([disc.intro, ...qs.filter((q) => disc[q.key]).map((q) => disc[q.key])].join(' '));
    for (let i = fromIdx; i < qs.length; i += 1) {
      const q = qs[i];
      if (disc[q.key]) continue;
      const auto = detect();
      if (auto[q.key]) { disc[q.key] = auto[q.key]; continue; }
      setDraft((p) => ({ ...p, discovery: disc, discIdx: i + 1 }));
      return botSay({ text: q.ask, options: [...q.options, T.discSkip], flavor: 'quote' });
    }
    return finishDiscovery({ ...d, discovery: disc });
  };

  const recordDiscovery = (text) => {
    const need = detectNeeds(text);
    const disc = { ...(draft.discovery || {}) };
    const idx = draft.discIdx || 0;
    if (idx === 0) disc.intro = text;
    else {
      const q = DISC_QUESTIONS()[idx - 1];
      if (q && !disc[q.key]) disc[q.key] = text;
    }
    const next = {
      ...draft,
      discovery: disc,
      ...(need.service && !draft.service ? { service: need.service } : {}),
      ...(need.sector && !draft.sector ? { sector: need.sector } : {}),
    };
    setDraft(next);
    return advanceDiscovery(next, idx === 0 ? 0 : idx);
  };

  const choose = async (option) => {
    addUser(option);
    // market kısayolları: ürün adı → detay sayfası, "Markete göz at" → vitrin
    if (option === 'Markete göz at') { window.location.href = '/market'; return; }
    const marketItem = (marketKB?.items || []).find((x) => x.title === option);
    if (marketItem) { window.location.href = `/market/${marketItem.slug}`; return; }
    if (step === 'domain') {
      if (option === T.domainMore) return askDomainSuggest(draft.domainBusiness || '', draft.domainExclude || [], T.domainMoreAsk);
      return pickDomain(option);
    }
    if (option.endsWith(' için teklif al')) return startQuoteFor(revService[option.slice(0, -14)] || option.slice(0, -14));
    if (option.startsWith('Quote for ')) return startQuoteFor(revService[option.slice(10)] || option.slice(10));
    if (INTENTS[option]) return startIntent(INTENTS[option]);
    if (step === 'discover') {
      if (option === T.discSkip) return finishDiscovery();
      return recordDiscovery(option);
    }
    if (option === T.repack) {
      setDraft((d) => ({ type: 'quote', packageMode: true, message: d.message }));
      setStep('service');
      return botSay({ text: T.repackAsk, options: serviceOptions, flavor: 'quote' });
    }
    if (step === 'service') {
      const next = { ...draft, service: revService[option] || option };
      if (next.sector) return presentQuote(next);
      setDraft(next);
      setStep('sector');
      return botSay({ text: T.sectorAsk, options: sectorOptions });
    }
    if (step === 'sector') {
      return presentQuote({ ...draft, sector: revSector[option] || option });
    }
  };

  const fetchTestimonials = async () => {
    try {
      const list = await base44.entities.Testimonial.filter({ status: 'published' }, '-created_date', 3);
      return list.map((x) => ({ author: x.author, role: x.role, text: x.text, project: x.project }));
    } catch { return null; }
  };

  // 🔎 AI destekli alan adı önerisi — araç sayfasından gelen ziyaretçi için:
  // öneriler sohbette sunulur, her isim kayıt defterinde doğrulanmış (kontrollü) olur
  const fetchDomainSuggest = async (business, exclude) => {
    try {
      const res = await base44.functions.invoke('domainSuggest', {
        businessName: business, exclude: (exclude || []).slice(-15),
      });
      return res?.data?.suggestions || [];
    } catch { return []; }
  };

  const askDomainSuggest = async (business, exclude, introText) => {
    setTyping(true);
    const list = await fetchDomainSuggest(business, exclude);
    setTyping(false);
    if (!list.length) {
      setStep('menu');
      return botSay({ text: T.domainEmpty, options: MENU });
    }
    setDraft((d) => ({ ...d, domainExclude: [...(d.domainExclude || []), ...list.map((s) => s.name)] }));
    botSay({ text: introText, options: [...list.map((s) => s.domain), T.domainMore], flavor: 'quote' });
  };

  const startDomainSuggest = ({ text, business } = {}) => {
    if (text) addUser(text);
    setMood('quote');
    setDraft({ type: 'question', domainBusiness: business || '', domainExclude: [] });
    setStep('domain');
    askDomainSuggest(business || '', [], T.domainIntro);
  };

  const pickDomain = (option) => {
    setDraft({ type: 'quote', packageMode: true, message: `Beğenilen alan adı: ${option}` });
    setMood('quote');
    setStep('service');
    botSay({ text: T.domainPicked(option), options: serviceOptions, flavor: 'quote' });
  };

  const sendText = async (text) => {
    addUser(text);
    // keşif sohbetinde serbest metin bir cevaptır — soru yanıtı gibi işlenmez
    if (step === 'discover') return recordDiscovery(text);
    const need = detectNeeds(text);
    const message = [draft.message, text].filter(Boolean).join('\n');
    const service = need.service || draft.service;
    const sector = need.sector || draft.sector;
    // AI'ya bağlam: son 6 mesajlık sohbet özeti — yanıtlar konuya bağlı kalır, sorular tekrarlanmaz
    const history = messages.slice(-6)
      .map((m) => `${m.role === 'bot' ? 'DijiBot' : 'Ziyaretçi'}: ${m.text}`)
      .join('\n')
      .slice(-1200);
    // "butik otelim için web sitesi paketi istiyorum" → paket doğrudan hazırlanır
    if (need.wantsQuote && service && sector) {
      setMood('quote');
      return presentQuote({ ...draft, type: 'quote', packageMode: true, service, sector, message });
    }
    setDraft((d) => ({ ...d, message, ...(need.service ? { service } : {}), ...(need.sector ? { sector } : {}) }));
    setStep('menu');
    // 🛍️ market soruları önce: ürün adı/kampanya geçiyorsa canlı vitrinden yanıtla
    const market = marketAnswer(text, marketKB);
    if (market) {
      setMood('happy');
      return botSay({ text: market.text, options: market.options });
    }
    const wantsTesti = TESTI_KEYS.some((k) => text.toLocaleLowerCase('tr-TR').includes(k));
    const customer = customerBrief();
    let reply = null;
    let quoteService = null;
    let testimonials = null;
    let aiPlan = null;
    if (lang === 'en') {
      // 🌍 EN: hazır cevap sözlüğü Türkçe — serbest sorular AI ile İngilizce yanıtlanır
      setTyping(true);
      try {
        const res = await base44.functions.invoke('aiAnswer', {
          question: text.slice(0, 400), service: draft.service || null, sector: draft.sector || null, lang: 'en', history, customer, market: marketBrief(marketKB),
        });
        reply = res?.data?.text;
        aiPlan = res?.data?.plan || null;
      } catch (e) { /* sessizce hazıra dön */ }
    } else {
      const ctx = answerContext(text);
      reply = ctx.text;
      quoteService = ctx.quoteService;
      if (ctx.testimonials) testimonials = await fetchTestimonials();
      if (!ctx.matched) {
        // hazır cevap yoksa AI'ya sor; AI çalışmıyorsa genel yönlendirme kalır
        setTyping(true);
        try {
          const res = await base44.functions.invoke('aiAnswer', {
            question: text.slice(0, 400), service: draft.service || null, sector: draft.sector || null, history, customer, market: marketBrief(marketKB),
          });
          if (res?.data?.text) reply = res.data.text;
          aiPlan = res?.data?.plan || null;
          // AI uygun hizmet önerdiyse teklif düğmesiyle sunulur (katalogda yoksa sessizce atlanır)
          if (res?.data?.service && [...services, ...serviceCatalog].some((s) => s.title === res.data.service)) quoteService = res.data.service;
        } catch (e) { /* sessizce hazıra dön */ }
      }
    }
    if (wantsTesti && !testimonials) testimonials = await fetchTestimonials();
    // AI plan vermediyse (ya da AI geçici erişilemezse) kural tabanlı koç planı devreye girer
    const plan = aiPlan || coachPlan(text, lang);
    setMood(quoteService ? 'quote' : 'happy');
    botSay({
      text: reply,
      plan,
      testimonials,
      options: quoteService
        ? [lang === 'en' ? `Quote for ${serviceLabel(quoteService)}` : `${serviceLabel(quoteService)} için teklif al`, T.menuAppt, T.expert]
        : [...MENU, T.expert],
    });
  };

  // 📎 ekran görüntüsü incelemesi: görsel yüklenir, imzalı URL ile AI inceler
  const sendScreenshot = async (file) => {
    // dosya adı yerine gerçek önizleme: sohbette görsel kendisi görünür
    const previewUrl = URL.createObjectURL(file);
    setMessages((p) => [...p, { role: 'user', text: T.shotMsg(), image: previewUrl, time: clock() }]);
    setMood('quote');
    setTyping(true);
    try {
      const { file_uri } = await uploadWithProgress(file);
      const { signed_url } = await signFileUri(file_uri, 900);
      const res = await base44.functions.invoke('aiScreenshotReview', {
        image_url: signed_url,
        message: (draft.message || '').slice(0, 300),
        lang,
      });
      botSay({ text: res?.data?.text || T.shotError, options: MENU });
    } catch (e) {
      botSay({ text: T.shotError, options: MENU });
    }
  };

  const submitLead = async (values) => {
    const conversation = messages.map((m) => `${m.role === 'bot' ? 'Asistan' : 'Ziyaretçi'}: ${m.text}`).join('\n');
    // referans/tavsiye programı: ?ref= parametresi CRM'e düşer
    const ref = new URLSearchParams(window.location.search).get('ref');
    const { pkg, packageMode, ...draftRest } = draft;
    let quoteUrl = null;
    setMood('sending');
    try {
      const visitor = await getVisitorInfo().catch(() => ({}));
      const created = await base44.entities.Lead.create({ ...draftRest, ...values, type: draft.type || 'question', conversation, referral: ref || null, ip_address: visitor.ip_address || null, device_info: visitor.device_info || null, package_summary: pkg ? summaryText(pkg) : null, package_data: pkg ? JSON.stringify(pkg) : null, quote_no: pkg?.quoteNo || null });
      base44.analytics.track({ eventName: 'lead_submit', properties: { type: draft.type || 'question', has_package: Boolean(pkg) } });
      // yöneticiye e-posta bildirimi (krediler dönünce otomatik çalışır)
      created?.id && base44.functions.invoke('leadNotify', { lead_id: created.id }).catch(() => {});
      // teklif sayfası linki — WhatsApp ve panelde paylaşılacak
      if (created?.id && pkg) {
        try {
          const q = await base44.functions.invoke('quoteLink', { lead_id: created.id });
          // ziyaretçinin bulunduğu adreste açılsın (önizleme / özel alan adı)
          quoteUrl = q?.data?.url ? `${window.location.origin}${new URL(q.data.url).pathname}${new URL(q.data.url).search}` : null;
        } catch {}
      }
    } catch (e) {
      setMood('error');
      setTimeout(() => setMood('idle'), 6000);
      throw e;
    }
    setDraft({});
    setStep('menu');
    setMood('success');
    setTimeout(() => setMood('greeting'), 9000);
    botSay({
      text: pkg ? T.thanksPkg(values.name) : T.thanks(values.name),
      ...(pkg ? { pkg, customer: values.name } : {}),
      channels: { name: values.name, service: draftRest.service, pkgName: pkg?.name, quoteUrl },
      nextSteps: true,
      options: MENU,
      flavor: 'success',
    });
  };

  const reset = () => {
    setMessages([{ role: 'bot', text: T.greeting, options: MENU, time: clock() }]);
    setDraft({});
    setStep('menu');
    setMood('greeting');
    setReminded(true);
  };

  // teklif/paket akışında adım göstergesi için
  const quoteFlow = draft.type === 'quote' && ['service', 'sector', 'discover', 'form'].includes(step);

  return { messages, step, typing, mood, lang, quoteFlow, choose, sendText, sendScreenshot, startIntent, startQuoteFor, startWithSector, startDomainSuggest, submitLead, reset };
}