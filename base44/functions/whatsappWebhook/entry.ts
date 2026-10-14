import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { secrets } from 'base44:runtime';
import { waitUntil } from 'base44:runtime';
import { DIJIBOT_PERSONA } from '../../shared/dijibotPrompt.ts';
import { normalizePhone, customerServiceReply } from '../../shared/customerService.ts';
import { sendWhatsAppText, sendWhatsAppQuickReplies, markAsRead, downloadWhatsAppMedia, mediaDataUrl } from '../../shared/whatsapp.ts';
import { askOpenAI } from '../../shared/openai.ts';
import { DIJIBOT_KB } from '../../shared/dijibotKnowledge.ts';
import { loadMarketBrief } from '../../shared/marketKB.ts';

// Dijitrak WhatsApp Cloud API webhook — DijiBot artık işletmenin KENDİ
// WhatsApp Business numarasından cevap verir.
//  - GET  : Meta webhook doğrulaması (hub.challenge)
//  - POST : gelen mesaj → CRM'e Lead kaydı → AI cevabı → Cloud API ile gönderim
// AKIS: Numara yönetici tarafından bir müşteri e-postasına eşleştirilmişse
// MUSTERI HIZMETLERI (proje durumu, revizyon talebi, abonelik, destek);
// eşleşmemişse satış asistanı (DijiBot) yanıt verir.
// Yetki: Meta sunucusu çağırır (kullanıcı yetkisi yok), verify_token + gizli
// token ile korunur; CRM işlemleri service role ile yapılır.

// Bilgi bankası ortak kaynaktan gelir (site sohbeti ile birebir aynı fiyat/bilgi)

const FALLBACK =
  '🤔 Bunu birlikte netleştirelim\n\nSorununuzu biraz daha açık yazarsanız daha isabetli yanıt verebilirim.\n\n📞 "Bir uzman beni arasın" derseniz ekibimiz sizi arasın.';

// Cevabi sekillendir: Türkçe karakterler korunur, aşırı boş satırlar tek boş satıra düşer.
const tidy = (s) => String(s || '')
  .replace(/\r/g, '')
  .replace(/\n{3,}/g, '\n\n')
  .replace(/[ \t]+\n/g, '\n')
  .trim();

// Satir asistani — eslesmemis (potansiyel musteri) numaralar icin DijiBot satis akisi.
async function salesReply(history, text, image = null, market = '') {
  const system = [
    DIJIBOT_PERSONA,
    '',
    'TON VE YAZIM (WhatsApp kanali): Kurumsal ama insan — ajansin icinden gercek biri yaziyormus gibi, modern ve dogal bir Turkce ile.',
    '- DIL: Tam Türkçe yaz; Türkçe karakterleri (ç, ğ, ı, i, ö, ş, ü) eksiksiz kullan. WhatsApp UTF-8 destekler, karakterleri asla sadeleştirme.',
    '- YAZIM VE NOKTALAMA: Doğru imla ve noktalama; bitişik yazılmış yanlış şekiller ("olurmu", "nasilsiniz") kullanma.',
    '- DOĞALLIK: Kalıp laflarla ("Merhaba, hoş geldiniz, size nasıl yardımcı olabilirim?") başlama; soruya kısa ve doğal bir girişle direkt gir. "Hemen dönüş yapalım", "ekibimiz memnuniyetle..." gibi şablon cümlelerden kaçın, somut bilgi ver.',
    '- FORMAT: Bol ikonlu ve düzenli kurumsal düzen — mesajı konuya uygun emoji ikonlarla (ör. 📞 📅 🚀 ✅ 💡 🔧 📝 💳) bölümlendir; bölüm başlıklarını WhatsApp kalın yazımıyla (*böyle*) yaz; maddeler her satırda "ikon metin" düzeninde başlasın; bölümler arasına boş satır koy; toplam en fazla 6 satır.',
    '- VURGU: Önemli bir kelime veya fiyat için WhatsApp kalın yazımı *böyle* kullan; ikon sayısı 3-6 arasında kalsın, abartma.',
    '- HAVA: Samimi ama güven veren; şaka ve abartı yok. Yönlendirmeler doğal olsun: "İstersen ekibi aradım diye geçiştirmek yerine, senin için net bir teklif çıkaralım" gibi insani bir ton.',
    '',
    '- KALITE: Sorunun kendisine cevap ver, genel geçer cümlelerle geçiştirme. Sohbet geçmişindeki konuya bağlan; aynı soruyu tekrar sorup baştan başlama. Kapanışta tek net sonraki adım öner (teklif, randevu veya yerinde görüşme) — komut gibi değil, doğal bir cümleyle.',
    '- AŞAĞIDAKİ BİLGİ BANKASI DIŞINDA FİYAT VE BİLGİ UYDURMA:',
    DIJIBOT_KB,
    ...(market ? ['', market] : []),
  ].join('\n\n');
  const user = [
    history ? `OZET SOHBET GECMISI:\n${history}` : '',
    ...(image ? ['Müşteri bu mesajla birlikte bir görsel/ekran görüntüsü gönderdi; görsel içeriğini inceleyip yanıtını buna göre kur.'] : []),
    `WhatsApp'tan gelen kullanici mesaji: "${text}"`,
    'Kural: Kisa (en fazla 4-5 cumle), kurumsal ve net; yukaridaki FORMAT kuralina gore ikonlu ve duzenli yaz; yazim, noktalama ve paragraf kurallarina tam uy. Fiyat sorulursa yalnizca bilgi bankasindaki araligi ver, ardindan detayli teklif icin ekibe yonlendir ("Detayli teklif icin sizi arayabiliriz" gibi). Sadece cevabin metnini yaz.',
  ].filter(Boolean).join('\n\n');
  const out = await askOpenAI({ system, user, image_url: image, max_tokens: 400, temperature: 0.6 });
  return out || FALLBACK;
}

// Gelen mesaji ayristirir: metin, buton yanıtı, görsel (vision), sesli not
// (yazıya döküm) ve belge/video açıklamaları desteklenir. null = işlenemez.
async function extractMessage(base44, msg) {
  const type = msg.type || '';
  if (type === 'text') return { text: (msg.text?.body || '').trim() };
  if (type === 'interactive') {
    return { text: (msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title || '').trim() };
  }
  if (type === 'reaction') return { skip: true };
  if (type === 'image' || type === 'video' || type === 'document') {
    const cap = (msg.image?.caption || msg.video?.caption || msg.document?.caption || '').trim();
    if (type === 'image') {
      try {
        return { text: cap, image: await mediaDataUrl(msg.image.id), note: cap ? '[Görsel + açıklama]' : '[Görsel mesaj]' };
      } catch (e) {
        console.error('Gorsel indirme hatasi:', e?.message);
        return cap ? { text: cap, note: '[Görsel indirilemedi]' } : { skip: true };
      }
    }
    return cap ? { text: cap, note: type === 'video' ? '[Video mesajı]' : '[Belge mesajı]' } : { skip: true };
  }
  if (type === 'voice' || type === 'audio') {
    try {
      const media = msg.voice || msg.audio;
      const { bytes, mime } = await downloadWhatsAppMedia(media.id);
      const up = await base44.asServiceRole.integrations.Core.UploadPrivateFile({
        file: new Blob([bytes], { type: mime }),
      });
      const { signed_url } = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({ file_uri: up.file_uri });
      const tr = await base44.asServiceRole.integrations.Core.TranscribeAudio({ audio_url: signed_url });
      const text = String(tr || '').trim();
      if (!text) throw new Error('Transkript bos');
      return { text, note: '[Sesli mesajın yazıya dökülmüş hali]' };
    } catch (e) {
      console.error('Ses yazıya dökme hatasi:', e?.message);
      return null;
    }
  }
  return null;
}

const UNSUPPORTED_REPLY = '⚠️ Bu mesaj türünü buradan işleyemiyorum\n\nTalebinizi şu şekilde iletebilirsiniz:\n📝 Metin mesajı\n📷 Görsel / ekran görüntüsü\n🎙️ Sesli mesaj';
const VOICE_FAIL_REPLY = '🎙️ Sesli mesajınızı yazıya dökemedim\n\nTalebinizi kısa bir metin olarak iletir misiniz? Ekibimiz hemen ilgilenir. ✅';

async function processMessage(base44, msg, profileName) {
  const from = (msg.from || '').trim();
  const mid = msg.id || '';
  if (!from) return;
  markAsRead(mid).catch(() => {}); // okundu (mavi çift tik) bilgisi

  const parsed = await extractMessage(base44, msg);
  if (parsed?.skip) return;
  if (!parsed) {
    try {
      await sendWhatsAppText(from, msg.type === 'voice' || msg.type === 'audio' ? VOICE_FAIL_REPLY : UNSUPPORTED_REPLY);
    } catch (e) {
      console.error('Gonderim hatasi:', e.message);
    }
    return;
  }
  const text = String(parsed.text || '').trim();
  if (!text && !parsed.image) return;

  // CRM: numaradan musteri bul, yoksa yeni Lead ac — Meta'nin tekrar deneme
  // gönderimlerinde ayni mesaj id'si sohbet kaydindan bulunup atlanir.
  const existing = await base44.asServiceRole.entities.Lead.filter({ phone: from }, '-created_date', 1);
  let lead = (existing || [])[0] || null;
  const isNew = !lead;
  if (mid && lead && String(lead.conversation || '').includes(`#${mid}`)) return;
  const stamp = `[${new Date().toISOString()}${mid ? ` #${mid}` : ''}]`;
  const entry = `${stamp} Kullanici: ${parsed.note ? `${parsed.note} ` : ''}${text}`;
  if (!lead) {
    lead = await base44.asServiceRole.entities.Lead.create({
      name: profileName || 'WhatsApp Ziyaretcisi',
      phone: from,
      type: 'question',
      message: text,
      referral: 'whatsapp',
      conversation: entry,
    });
  } else {
    // Yarisa karsi güvenli ek: baska bir mesaj kaydi güncellediyse (kullanici hizli
    // mesaj üstüne mesaj yazdiysa) kayip satiri silmeden tekrar dene.
    let tail = (lead.conversation || '').slice(-4000);
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const body = `${tail}${tail ? '\n' : ''}${entry}`;
      await base44.asServiceRole.entities.Lead.update(lead.id, {
        message: text,
        conversation: body,
      });
      const fresh = await base44.asServiceRole.entities.Lead.get(lead.id);
      const freshConv = String(fresh?.conversation || '');
      if (freshConv === body) break;
      tail = freshConv;
    }
  }

  // Numara bir musteriye eslestiyse musteri hizmetleri akisi; degilse satir asistani.
  const mapped = (await base44.asServiceRole.entities.ClientPhone.filter(
    { phone: normalizePhone(from) }, '-created_date', 1
  ))[0] || null;
  const history = (lead.conversation || '').slice(-2400);
  const image = parsed.image || null;
  const reply = mapped?.client_email
    ? tidy(await customerServiceReply(base44, mapped.client_email, text, history, image))
    : tidy(await salesReply(history, text, image, await loadMarketBrief(base44)));

  // Cevabi CRM'e yaz (gonderim hatasindan bagimsiz sicak) — zaman damgali
  // yazilir ki panel (ConversationLog) bot cevabini ayri balon olarak göstersin.
  // Yarisa karsi güvenli ek: okuma-yazma arasinda kayit degistiyse yeni eklenen
  // satirlari koru (hizli art arda gelen mesajlarda kullanici satirinin silinmemesi icin).
  let tail2 = (lead.conversation || '').slice(-4000);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const body = `${tail2}${tail2 ? '\n' : ''}[${new Date().toISOString()}] DijiBot: ${reply}`;
    await base44.asServiceRole.entities.Lead.update(lead.id, { conversation: body });
    const fresh = await base44.asServiceRole.entities.Lead.get(lead.id);
    const freshConv = String(fresh?.conversation || '');
    if (freshConv === body) break;
    // Baska bir mesaj araya girdi: kayip satirlari koruyarak yeniden ekle
    tail2 = freshConv;
  }

  // Gonderim: hata loglanir, CRM kaydi bozulmaz
  try {
    await sendWhatsAppText(from, reply);
  } catch (e) {
    console.error('WhatsApp gonderim hatasi:', e.message);
    return;
  }

  // İlk temasta karşılama + hazır hızlı soru butonları; butona basıldığında
  // yanıt normal mesaj gibi gelir ve AI akışı işler.
  if (isNew) {
    const mappedUser = Boolean(mapped?.client_email);
    const GREETINGS = {
      sales: '👋 *Dijitrak\'a hoş geldiniz!*\n\nAşağıdaki seçeneklerden birini seçebilir veya sorunuzu doğrudan yazabilirsiniz:\n\n🛠️ Hizmet ve fiyatlar\n📝 Teklif istiyorum\n📅 Randevu almak',
      customer: '👋 *Hoş geldiniz!*\n\nSize hazır seçenekler:\n\n📊 Proje durumu\n🔧 Revizyon talebi\n🆘 Destek talebi\n\nYa da sorunuzu doğrudan yazabilirsiniz.',
    };
    const QUICKS = {
      sales: ['🛠️ Hizmetler', '📝 Teklif al', '📅 Randevu'],
      customer: ['📊 Durum', '🔧 Revizyon', '🆘 Destek'],
    };
    await sendWhatsAppQuickReplies(
      from,
      mappedUser ? GREETINGS.customer : GREETINGS.sales,
      mappedUser ? QUICKS.customer : QUICKS.sales,
    ).catch((e) => console.error('Karsilama gonderim hatasi:', e.message));
  }

  if (isNew) {
    await base44.functions.invoke('leadNotify', { lead_id: lead.id }).catch(() => {});
  }
}

export default async function(req) {
  try {
    const url = new URL(req.url);

    // 1) Webhook dogrulamasi (GET)
    if (req.method === 'GET') {
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');
      if (mode === 'subscribe' && token && token === secrets.get('WHATSAPP_VERIFY_TOKEN')) {
        return new Response(challenge || '', { status: 200 });
      }
      return new Response('Forbidden', { status: 403 });
    }

    // 2) Gelen mesajlar (POST) — Meta hizli 200 bekler, isi arka planda yap (deploy yenileme)
    const body = await req.json().catch(() => ({}));
    const value = body?.entry?.[0]?.changes?.[0]?.value;
    const msg = value?.messages?.[0];
    console.log('Webhook POST:', JSON.stringify({
      object: body?.object || null,
      entries: body?.entry?.length || 0,
      field: body?.entry?.[0]?.changes?.[0]?.field || null,
      keys: value ? Object.keys(value) : [],
      msg_type: msg?.type || null,
      statuses: value?.statuses?.map((s) => `${s.status}${s.errors ? ':' + s.errors.map((e) => e.code).join(',') : ''}`) || null,
    }));

    if (msg && ['text', 'interactive', 'image', 'voice', 'audio'].includes(msg.type)) {
      const base44 = createClientFromRequest(req);
      const name = value?.contacts?.[0]?.profile?.name || '';
      waitUntil(processMessage(base44, msg, name).catch((e) => console.error('processMessage hatasi:', e?.message || String(e))));
    }

    // Durum guncellemeleri (delivered/read) ve diger turler sessizce OK
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 200 });
  }
}