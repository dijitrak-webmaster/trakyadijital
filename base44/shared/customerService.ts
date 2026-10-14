// WhatsApp müşteri hizmetleri modülü — numarası yönetici tarafından bir müşteri
// e-postasına eşleştirilmiş kişilere destek akışı: proje durumu, revizyon
// talebi, abonelik bilgisi ve genel destek. Eşleşmeyen numaralar satış
// asistanına (whatsappWebhook içindeki DijiBot akışı) düşer.
import { askOpenAIJson } from './openai.ts';

// Türkiye odaklı numara normalizasyonu: 05xx / 5xx / 905xx -> 905xxxxxxxxx
export function normalizePhone(raw) {
  const d = String(raw || '').replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('90')) return d;
  if (d.length === 11 && d.startsWith('0')) return '90' + d.slice(1);
  if (d.length === 10) return '90' + d;
  return d;
}

const STATUS_LABEL = {
  planned: 'Planlamada',
  in_progress: 'Devam ediyor',
  review: 'İncelemede',
  launched: 'Yayında',
};

// Müşteri bağlamını yükler, AI ile cevabı üretir ve revizyon/destek kayıtlarını açar.
export async function customerServiceReply(base44, clientEmail, text, history, image = null) {
  const [projects, subs, revisions] = await Promise.all([
    base44.asServiceRole.entities.ClientProject.filter({ client_email: clientEmail }, '-updated_date', 20),
    base44.asServiceRole.entities.Subscription.filter({ client_email: clientEmail }, '-created_date', 20),
    base44.asServiceRole.entities.RevisionRequest.filter({ client_email: clientEmail }, '-created_date', 20),
  ]);
  const ctx = {
    musteri_epostasi: clientEmail,
    projeler: projects.map((p) => ({
      proje_id: p.id,
      proje_adi: p.title,
      durum: STATUS_LABEL[p.status] || p.status,
      ilerleme: `${p.progress || 0}%`,
      son_rapor: (p.report || '').slice(0, 400),
    })),
    abonelikler: subs.filter((s) => s.status !== 'cancelled').map((s) => ({
      hizmet: s.item_title,
      aylik_fiyat: s.monthly_price ? `${s.monthly_price} TL` : null,
      baslangic: s.start_date,
      yenileme: s.end_date,
    })),
    acik_revizyon_talepleri: revisions.filter((r) => r.status === 'open').map((r) => ({
      proje: projects.find((p) => p.id === r.project_id)?.title || r.project_id,
      metin: (r.text || '').slice(0, 200),
    })),
  };

  const out = await askOpenAIJson({
    system: [
      'Sen Dijitrak müşteri hizmetleri asistanısın; kayıtlı müşterilerimize WhatsApp üzerinden destek veriyorsun.',
      'TON VE YAZIM: Kurumsal ama insancıl; kalıp cümleler yerine doğal, kısa ve net yaz (robotik "talebiniz alınmıştır" üslubundan kaçın).',
      '- Tam Türkçe yaz; Türkçe karakterleri (ç, ğ, ı, i, ö, ş, ü) eksiksiz kullan; imla ve noktalama kurallarına tam uy.',
      '- FORMAT: Bol ikonlu ve düzenli — konuya uygun emoji ikonlarla bölümlendir (ör. 📊 proje durumu, 🔧 revizyon, 💳 abonelik, 🆘 destek); bölüm başlıklarını WhatsApp kalın yazımıyla (*böyle*) yaz; liste gerekiyorsa en fazla 3 madde, her madde ikonlu ayrı satırda başlar; bölümler arasına boş satır koy.',
      'KURALLAR:',
      '1) Yalnızca sana verilen MÜŞTERİ BİLGİSİ verilerini kullan; proje adı, tarih, fiyat uydurma.',
      '2) Proje durumu sorulursa proje adı, durum, ilerleme ve son raporun kısa özetini ver.',
      '3) Müşteri bir değişiklik, hata veya ekleme talebi (revizyon) isterse intent "revizyon" olur: talebi kısa ve net bir metin olarak revizyon_metni alanına yaz; hangi proje olduğu bağlamdan netse revizyon_proje_id alanına o projenin id\'sini yaz; birden fazla proje var ve hangisi olduğu belirsizse reply içinde hangi projeyi kastettiğini sor.',
      '4) Abonelik, yenileme veya faturalama sorularında abonelikler verisini kullan.',
      '5) Bunların dışındaki destek konularında (danışma, şikayet, bilgi talebi) intent "genel" olur ve kaydet=true yap: mesaj ekibe kaydedilir.',
      '6) Yeni proje, teklif veya satış talebi gelirse bu kanalın müşteri hizmetleri olduğunu belirt, satış ekibinin kendileriyle iletişime geçeceğini söyle ve kaydet=true yap.',
      '7) Emin olmadığında kısa cevap ver ve mesajın ekibe iletileceğini belirt.',
      '8) Müşteri görsel gönderdiyse görseli incele; ekran görüntüsündeki hata veya istek bir değişiklik talebi niteliğindeyse intent "revizyon" olarak değerlendir ve revizyon_metni sonuna "(müşteriden görsel iletildi)" yaz.',
    ].join('\n'),
    user: [
      history ? `SOHBET GEÇMİŞİ:\n${history}` : '',
      `MÜŞTERİ BİLGİSİ (yalnızca bu verileri kullan):\n${JSON.stringify(ctx)}`,
      ...(image ? ['Müşterinin mesajıyla birlikte bir görsel/ekran görüntüsü gönderdi; görsel içeriğini inceleyip yanıtında dikkate al.'] : []),
      `Müşterinin mesajı: "${text}"`,
      'CEVAP ŞEMASI: {"intent":"durum|revizyon|abonelik|genel","reply":"müşteriye gönderilecek metin","revizyon_metni":"varsa talep metni","revizyon_proje_id":"varsa proje id","kaydet":true}',
    ].filter(Boolean).join('\n\n'),
    ...(image ? { image_url: image } : {}),
    max_tokens: 500,
  });

  let reply = String(out.reply || '').slice(0, 800);

  // Revizyon talebini sisteme kaydet
  if (out.intent === 'revizyon' && String(out.revizyon_metni || '').trim()) {
    let project = projects.find((p) => p.id === out.revizyon_proje_id);
    if (!project && projects.length === 1) project = projects[0];
    if (project) {
      await base44.asServiceRole.entities.RevisionRequest.create({
        project_id: project.id,
        client_email: clientEmail,
        text: String(out.revizyon_metni).slice(0, 1000),
        via: 'whatsapp',
        status: 'open',
      });
      if (!/kaydedild/i.test(reply)) reply += '\n\n🔧 *Talebiniz revizyon olarak sisteme kaydedildi*\n\nEkibimiz en kısa sürede dönüş yapacak. ✅';
    }
  }

  // Genel destek mesajını ekibe kaydet (yönetim panelindeki Sorular listesine düşer)
  if (out.intent === 'genel' && out.kaydet) {
    await base44.asServiceRole.entities.ClientMessage.create({
      question: text.slice(0, 1000),
      client_email: clientEmail,
    });
    if (!/ileti|kaydedild/i.test(reply)) reply += '\n\n✅ *Mesajınızı ekibimize ilettim*\n\nEn kısa sürede dönüş yapacağız. 📞';
  }

  return reply || '✅ Mesajınız alındı; ekibimiz kısa sürede dönüş yapacak.';
}