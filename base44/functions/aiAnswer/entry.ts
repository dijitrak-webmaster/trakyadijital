import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { DIJIBOT_PERSONA } from '../../shared/dijibotPrompt.ts';
import { DIJIBOT_KB, DIJIBOT_SERVICES } from '../../shared/dijibotKnowledge.ts';
import { askOpenAIJson } from '../../shared/openai.ts';

// Site sohbetinin (DijiBot) serbest sorularını bilgi bankası + sohbet bağlamıyla
// yanıtlar; uygunsa bir sonraki adım olarak hizmet önerisi döner (teklif düğmesi).
export default async function(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const question = String(body.question || '').slice(0, 400);
    const service = String(body.service || '').slice(0, 60);
    const sector = String(body.sector || '').slice(0, 40);
    const history = String(body.history || '').slice(-1500);
    const customer = String(body.customer || '').slice(-2500);
    const market = String(body.market || '').slice(-1200);
    const lang = body.lang === 'en' ? 'en' : 'tr';
    if (question.trim().length < 3) return Response.json({ error: 'question is required' }, { status: 400 });

    const out = await askOpenAIJson({
      system: [
        DIJIBOT_PERSONA,
        '',
        'BILGI BANKASI — fiyat, süre ve bilgileri yalnızca buradan al:',
        DIJIBOT_KB,
        '',
        'KOÇ KURALLARI:',
        '- Konu büyüme, pazarlama, site ya da teknoloji ise "plan" alanına 2-4 maddelik uygulanabilir mini eylem planı yaz; her madde tek kısa cümle, fiille başlar (ör. "Google İşletme Profilinde hizmet bölümlerini doldur").',
        '- Önce değer ver: ücretsiz, bugün uygulanabilir tavsiyeyi esirgeme; hizmet önerisini yalnızca doğal geçiyorsa ekle.',
        '- YANIT KALİTE KURALLARI:',
        '- Sorunun KENDİSİNE cevap ver: ziyaretçinin gerçek niyetini anla (fiyat mı, süre mi, yeterli mi, nasıl mı) ve tam o noktadan yanıtla; genel geçer cümlelerle geçiştirme.',
        '- Kısmi bilgiyi tamamla: ziyaretçi bir hizmeti isimlendirdiyse yanıtın o hizmetin fiyat aralığı + teslim süresi + en güçlü tek faydası üzerinden kur.',
        '- Sohbete bağlan: daha önce konuşulan konuyu tekrar sorup baştan başlamayın, ilerleyen bir yanıt ver.',
        '- Bilgi bankasında olmayan rakam, isim veya tarih uydurma; emin olmadığında "Bir uzman beni arasın" seçeneğine yönlendir.',
        '- Kapanışta tek net sonraki adım öner (teklif, randevu, ücretsiz araç veya uzman görüşmesi) — komut gibi değil, doğal bir cümleyle.',
        lang === 'en' ? '- IMPORTANT: Reply in English (prices in TRY).' : '',
        ...(customer ? [
          '',
          'PORTAL MÜŞTERİ MODU: Bu sohbet kayıtlı bir müşterinin kendi portalından geliyor. Aşağıdaki MÜŞTERİ VERİLERİ onun gerçek dashboard verisidir — kendi projesinin durumunu, ilerleyişini, son raporunu, dosyalarını, tekliflerini ve aboneliklerini bilir gibi, kişisel ve somut yanıt ver.',
          '- İlerleme yüzdesini, proje adını ve rapor içeriğini sorulan soruya göre aktar; "şu an %40\'dayız, sırada X var" gibi net bilgi ver.',
          '- Verilerde olmayan bilgiyi uydurma; o durumda "Projelerim" veya ilgili sekmeye yönlendir.',
          '- Satış diline girme: buradaki görev müşteri başarısı — durum bilgilendirmesi ve net bir sonraki adım (revizyon, soru sorma, randevu).',
          '',
          'MÜŞTERİ VERİLERİ:',
          customer,
        ] : []),
        ...(market ? ['', 'MARKET ÜRÜNLERİ (yayında — ürün/fiyat bilgisini yalnızca buradan ver):', market] : []),
        `SERVİS ÖNERİSİ: Ziyaretçinin ilgilendiği hizmet netse "service" alanına SADECE şu listeden bir başlık yaz; değilse boş bırak: ${DIJIBOT_SERVICES.join(' | ')}`,
      ].filter(Boolean).join('\n'),
      user: [
        history ? `SON SOHBET:\n${history}` : '',
        service ? `Ziyaretçinin ilgilendiği hizmet: ${service}.` : '',
        sector ? `Sektörü: ${sector}.` : '',
        `Soru: "${question}"`,
        'ZORUNLU: JSON içinde "plan" anahtarı mutlaka olsun — 2-4 maddelik mini eylem planı (her madde tek kısa cümle, fiille başlar). Konu büyüme/pazarlama/site/teknoloji ise boş bırakma.',
        'ÇIKTI: {"text": "2-4 cümlelik net, doğru, akıcı yanıt", "service": "uygunsa listeden başlık, değilse boş", "plan": ["2-4 maddelik mini eylem planı — konu büyüme/pazarlama/site/teknoloji ise ZORUNLU, gerçekten alakasızsa []"]}',
      ].filter(Boolean).join('\n'),
    });
    return Response.json({ text: String(out.text || ''), service: String(out.service || '') });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}