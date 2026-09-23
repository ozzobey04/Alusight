/* src/utils/visionAnalysis.js — AluSight AI Görsel Analizi
 * Çoklu fotoğraf + video kare desteği
 */
import CATALOG_KNOWLEDGE from '../data/catalogKnowledge'
import { buildKnowledgeContext } from '../data/facadeKnowledgeBase'
import { knowledgeBase as FUAT_KB } from '../data/knowledgeBase'

const FACADE_KB = buildKnowledgeContext()

const FUAT_KB_TEXT = FUAT_KB.map(item =>
  `[${item.source}]\n` + (item.bolumler || []).map(b =>
    `${b.baslik}: ${b.detay}\nHatalar: ${(b.hatalar||[]).join(', ')}\nDoğru Uygulama: ${b.dogruUygulama||''}`
  ).join('\n')
).join('\n\n')

const PROMPT_BASE = `Sen deneyimli bir alüminyum doğrama, cephe ve yapı yalıtımı uzmanısın. Müşteriye sunulacak profesyonel bir rapor hazırlıyorsun.
Aşağıdaki teknik bilgi tabanlarını SADECE kendi analizin için arka planda kullan:

${CATALOG_KNOWLEDGE}

${FACADE_KB}

${FUAT_KB_TEXT}

Sağlanan TÜM görselleri (fotoğraf ve/veya video kareleri) birlikte değerlendirerek alüminyum sistemdeki sorunları tespit et.
Birden fazla görsel varsa farklı açılardan bütüncül bir analiz yap.

KESİNLİKLE YAPMA:
- Marka, sistem adı veya sistem tahmini belirtme; system_guess alanını boş bırak
- "VCS-001", "DAF-003", "VCS-008" gibi iç kod veya referans numarası yazma
- "bilgi tabanında", "vaka çalışmasında", "kaynakta", "literatürde" gibi ifadeler kullanma
- Teknik veritabanı adı veya kaynak kodu zikretme
Bunların yerine: gözlemlediğin durumu kendi cümlelerinle, müşterinin anlayacağı sade ve profesyonel Türkçe ile açıkla.

GÖRÜNÜRLÜK SINIFLANDIRMASI — HER TESPİT İÇİN ZORUNLU:
Her sorun için "visibility" alanını doldur. Bu, raporun güvenilirliği için kritiktir.

1. "confirmed" (Görüntüden doğrulandı):
   - Fotoğrafta NET olarak görünen, ölçülebilir veya sayılabilir durumlar
   - Örnek: kırık cam, ayrılmış profil, görünür su birikintisi, eksik vida, belirgin çizik
   - Bu tespitler için description'da "fotoğrafta görüldüğü üzere" ifadesini kullan

2. "probable" (Olası bulgu — yerinde kontrol gerekli):
   - Görsel ipuçlarından mantıken çıkarılabilen ama fotoğraftan kesin doğrulanamayan durumlar
   - Örnek: conta hatlarında şüpheli görünüm, muhtemel drenaj sorunu (delikler görünmüyor ama su izi var)
   - Bu tespitler için description'da "olası", "şüpheli", "kontrol edilmeli" ifadelerini kullan
   - solution'da mutlaka "yerinde kontrol", "söküm incelemesi" veya "test" öner

3. "not_assessable" (Fotoğraftan değerlendirilemez):
   - Fotoğrafta görünmeyen, kesit/ölçüm/test gerektiren durumlar
   - Örnek: termal bariyer varlığı, setting block konumu, Uf değeri, cam kalınlığı, drenaj delikleri (görünmüyorsa), membran, ses yalıtımı
   - Bu tespitler için description'da "fotoğraftan değerlendirilemez", "kesit/ölçüm/test gerekli" ifadelerini kullan
   - solution'da mutlaka "kesit açma", "katalog inceleme", "ölçüm", "test" öner
   - standard alanına ilgili standardı yaz ama "test/ölçüm ile doğrulanmalı" notunu ekle

YASAKLI İDDİALAR — fotoğraftan asla yapılamayacak çıkarımlar:
- Drenaj delikleri tıkalı/yetersiz (delikler görünmüyorsa)
- Termal bariyer yok/yetersiz (kesit görünmüyorsa)
- Setting block yanlış konumda (cam çıtası içinde kalır)
- Cam 4+16+4 gibi kesin cam yapısı (etiket/ölçüm yoksa)
- Uf, Uw, Rw gibi performans değerleri (hesap/test gerekir)
- Profil genişliği 170 mm gibi kesin ölçü (ölçek yoksa)
- EN 12208'e göre su sızdırmazlığı yetersiz (test gerekir)

Sadece bu JSON formatında yanıtla, başka metin ekleme. TÜM alanları eksiksiz doldur:
{
  "is_aluminum_related": true,
  "error": "",
  "found_issues": [
    {
      "category": "Isı Yalıtımı | Su Yalıtımı | Ses Yalıtımı | Montaj | Profil | Cam | Fitil & Conta | Bağlantı & Sabitleme | Drenaj | Yüzey & Kaplama",
      "title": "Sorunun kısa başlığı, en fazla 8 kelime",
      "severity": "Düşük | Orta | Yüksek | Kritik",
      "visibility": "confirmed | probable | not_assessable",
      "description": "Görselde tam olarak NE gördüğünü ve bunun NEDEN sorun olduğunu 2-4 cümleyle, müşterinin anlayacağı sade ve profesyonel Türkçe ile açıkla. Visibility'ye uygun dil kullan.",
      "solution": "Uygulanacak çözümü 2-4 cümleyle, somut malzeme adı ve yöntem vererek adım adım anlat. Visibility'ye uygun olarak yerinde kontrol/test öner.",
      "standard": "İlgili standardın kodu ve adı, örn: 'TS EN ISO 10077-2 — Isıl geçirgenlik' veya 'EN 1027 — Su sızdırmazlık' veya 'ASTM C1193 — Mastik uygulama' veya 'EN ISO 11600 — Derz dolgu sınıfı' veya 'TS 825 — Isı yalıtım kuralları'"
    }
  ],
  "system_guess": "",
  "insulation_report": {
    "thermal": {
      "status": "Yeterli | Yetersiz | Eksik | Belirsiz | Değerlendirilemez",
      "observations": "Isı yalıtımı açısından gözlemlerini 2-3 cümleyle açıkla. Fotoğraftan değerlendirilemiyorsa bunu açıkça belirt.",
      "required_materials": ["gerekli malzeme adı", "gerekli malzeme adı"],
      "application_method": "Uygulama yöntemini 1-2 cümleyle özetle"
    },
    "acoustic": {
      "status": "Yeterli | Yetersiz | Eksik | Belirsiz | Değerlendirilemez",
      "observations": "Ses yalıtımı açısından gözlemlerini 2-3 cümleyle açıkla. Fotoğraftan değerlendirilemiyorsa bunu açıkça belirt.",
      "required_materials": ["gerekli malzeme adı"],
      "application_method": "Uygulama yöntemini 1-2 cümleyle özetle"
    },
    "waterproofing": {
      "status": "Yeterli | Yetersiz | Eksik | Belirsiz | Değerlendirilemez",
      "observations": "Su yalıtımı ve drenaj açısından gözlemlerini 2-3 cümleyle açıkla. Fotoğraftan değerlendirilemiyorsa bunu açıkça belirt.",
      "required_materials": ["gerekli malzeme adı"],
      "application_method": "Uygulama yöntemini 1-2 cümleyle özetle"
    }
  },
  "missing_materials": [
    {
      "name": "Eksik veya gerekli malzemenin adı",
      "purpose": "Ne işe yaradığı, tek cümle",
      "quantity_hint": "Yaklaşık miktar veya ölçü, örn: '~12 m' veya '2 kartuş'",
      "priority": "Acil | Yüksek | Orta"
    }
  ],
  "overall_condition": "İyi | Orta | Kötü | Kritik | Sınırlı Değerlendirme",
  "summary": "2-3 cümle genel değerlendirme, Türkçe. Fotoğraftan sınırlı değerlendirme yapılabildiğini belirt.",
  "positive_notes": ["doğru uygulanmış veya iyi görünen noktalar"],
  "ai_disclaimer": "Bu rapor yapay zeka destekli bir ÖN DEĞERLENDİRMEDİR. Kesin mühendislik kararları için AluSight teknik ekibi tarafından saha incelemesi yapılması zorunludur."
}

ZORUNLU DOLDURMA KURALLARI:
- found_issues içindeki HER sorun için category, title, severity, visibility, description, solution ve standard alanlarının HEPSİ dolu olmalı. Hiçbirini boş bırakma, "—" veya "bilinmiyor" yazma.
- visibility alanı asla boş kalmasın; her tespit için üç sınıftan birini seç.
- standard alanı asla boş kalmasın; en yakın ilgili TS/EN/ASTM/DIN standardını kodu ve kısa adıyla yaz. not_assessable durumlarda standardın test/ölçüm gerektirdiğini belirt.
- description ve solution alanları en az 2 cümle olsun; tek kelimelik veya yarım cümlelik yanıt verme.
- insulation_report içinde thermal, acoustic ve waterproofing anahtarlarının ÜÇÜ de bulunmalı ve her birinin status, observations, required_materials, application_method alanları dolu olmalı. Değerlendirilemez durumlarda status "Değerlendirilemez" olsun ve observations'da nedenini açıkla.
- Görselde en az 3, mümkünse 5-8 sorun tespit et. Gerçekten sorun yoksa found_issues boş dizi olsun ve positive_notes'u zenginleştir.
- missing_materials en az 2 kalem içersin.
- overall_condition'da "Sınırlı Değerlendirme" seçeneğini kullan; fotoğraftan kesin "Kötü" veya "Kritik" demekten kaçın.

ÖNCELİKLİ KURAL:
1. Görselde alüminyum profil, alüminyum cephe giydirme, cam balkon, korkuluk, ofis bölmesi, pencere, kapı, pergola, kompozit panel veya bunların montaj/yalıtım detayları NET olarak görünmüyorsa is_aluminum_related:false döndür ve found_issues boş bırak.
2. İnsan yüzü, yemek, araba, ev eşyası, manzara, ekran görüntüsü gibi alakasız görseller için kesinlikle rapor oluşturma.
3. is_aluminum_related:false durumunda error alanında şunu yaz: 'Yüklenen görselde alüminyum sistem, cephe veya doğrama elemanı tespit edilemedi. Lütfen konuya uygun bir fotoğraf yükleyin.'
`

/* ── JSON çıkarma / onarma ── */

/* Metinden ilk dengeli JSON bloğunu al. Kesilmişse kalanı aynen döndürür. */
function extractJson(text) {
  const md  = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const raw = (md ? md[1] : text).trim()
  const start = raw.indexOf('{')
  if (start === -1) return null

  let depth = 0, inStr = false, esc = false
  for (let i = start; i < raw.length; i++) {
    const c = raw[i]
    if (esc) { esc = false; continue }
    if (c === '\\') { esc = true; continue }
    if (c === '"') { inStr = !inStr; continue }
    if (inStr) continue
    if (c === '{' || c === '[') depth++
    else if (c === '}' || c === ']') {
      depth--
      if (depth === 0) return raw.slice(start, i + 1)
    }
  }
  return raw.slice(start)
}

/* Yarıda kesilmiş JSON'u kapatarak kurtar — gelen alanlar kaybolmasın */
function repairTruncatedJson(str) {
  let out = str
  let inStr = false, esc = false
  const stack = []

  for (let i = 0; i < out.length; i++) {
    const c = out[i]
    if (esc) { esc = false; continue }
    if (c === '\\') { esc = true; continue }
    if (c === '"') { inStr = !inStr; continue }
    if (inStr) continue
    if (c === '{' || c === '[') stack.push(c)
    else if (c === '}' || c === ']') stack.pop()
  }

  if (esc) out = out.slice(0, -1)
  if (inStr) out += '"'

  out = out.replace(/,?\s*"[^"]*"\s*:\s*$/, '')   // yarım kalan anahtar
  out = out.replace(/,\s*$/, '')                   // sondaki virgül

  while (stack.length) out += stack.pop() === '{' ? '}' : ']'
  return out
}

const INS_KEYS = ['thermal', 'acoustic', 'waterproofing']
const AI_DISCLAIMER =
  'Bu rapor yapay zeka destekli bir ÖN DEĞERLENDİRMEDİR. Kesin mühendislik kararları için AluSight teknik ekibi tarafından saha incelemesi yapılması zorunludur.'

/* UI ve PDF'in beklediği alanları garanti altına al */
function normalizeReport(r) {
  r.found_issues      = Array.isArray(r.found_issues) ? r.found_issues.filter(Boolean) : []
  r.missing_materials = Array.isArray(r.missing_materials) ? r.missing_materials.filter(Boolean) : []
  r.positive_notes    = Array.isArray(r.positive_notes) ? r.positive_notes.filter(Boolean) : []
  r.overall_condition = r.overall_condition || 'Belirsiz'
  r.summary           = r.summary || ''
  r.ai_disclaimer     = r.ai_disclaimer || AI_DISCLAIMER

  if (!r.insulation_report || typeof r.insulation_report !== 'object') r.insulation_report = {}
  for (const k of INS_KEYS) {
    const d = r.insulation_report[k]
    r.insulation_report[k] = (d && typeof d === 'object') ? d : {}
    const t = r.insulation_report[k]
    t.status = t.status || 'Belirsiz'
    if (!Array.isArray(t.required_materials)) t.required_materials = []
  }

  for (const iss of r.found_issues) {
    iss.severity    = iss.severity    || 'Orta'
    iss.category    = iss.category    || 'Genel'
    iss.title       = iss.title       || 'Tespit'
    iss.visibility  = iss.visibility  || 'probable'
    iss.description = iss.description || ''
    iss.solution    = iss.solution    || ''
    iss.standard    = iss.standard    || ''
  }
  return r
}

/* Ekranda boş rapor göstermemek için asgari içerik kontrolü */
function isReportUsable(r) {
  if (r.found_issues.some(i => i.title && (i.description || i.solution))) return true
  if (INS_KEYS.some(k => (r.insulation_report[k]?.observations || '').trim())) return true
  if (r.positive_notes.length && r.summary.trim()) return true
  return false
}

/* ── Görsel sıkıştırma ── */
async function compressImage(base64, maxPx = 640, quality = 0.65) {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      let w = img.width, h = img.height
      if (w > maxPx || h > maxPx) {
        const r = Math.min(maxPx / w, maxPx / h)
        w = Math.round(w * r); h = Math.round(h * r)
      }
      const c = document.createElement('canvas')
      c.width = w; c.height = h
      c.getContext('2d').drawImage(img, 0, 0, w, h)
      resolve(c.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => resolve(base64)
    img.src = base64
  })
}

/* ── Video'dan kare çıkarma ── */
export async function extractVideoFrames(file, maxFrames = 6) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.preload = 'auto'
    video.muted = true
    video.src = url

    video.onloadedmetadata = async () => {
      const duration = video.duration
      if (!isFinite(duration) || duration <= 0) { reject(new Error('Video süresi okunamadı')); return }

      const frames = []
      const count = Math.min(maxFrames, Math.max(3, Math.floor(duration / 5)))
      const canvas = document.createElement('canvas')

      for (let i = 0; i < count; i++) {
        const t = i === 0 ? 0.5 : i === count - 1 ? duration - 0.5 : (duration / (count - 1)) * i
        await new Promise(res => {
          video.currentTime = Math.min(Math.max(t, 0), duration - 0.01)
          video.onseeked = () => {
            canvas.width  = Math.min(video.videoWidth,  800)
            canvas.height = Math.min(video.videoHeight, 600)
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
            frames.push(canvas.toDataURL('image/jpeg', 0.7))
            res()
          }
        })
      }

      URL.revokeObjectURL(url)
      resolve(frames)
    }

    video.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Video yüklenemedi')) }
  })
}

/* ── Ana analiz fonksiyonu — Google Gemini Vision ── */
export async function analyzeImages(imageList, _apiKey) {
  if (!imageList?.length) throw new Error('En az bir görsel gerekli.')

  const apiKey = import.meta.env.VITE_GEMINI_KEY || getStoredApiKey()
  if (!apiKey) throw new Error('API anahtarı bulunamadı. Lütfen yöneticinizle iletişime geçin.')

  const compressed = await Promise.all(imageList.map(b => compressImage(b)))

  const imageParts = compressed.map(b => ({
    inline_data: {
      mime_type: b.match(/^data:(image\/\w+);/)?.[1] || 'image/jpeg',
      data: b.replace(/^data:image\/[a-zA-Z0-9]+;base64,/, ''),
    }
  }))

  const body = {
    contents: [{
      parts: [
        { text: PROMPT_BASE + (imageList.length > 1 ? '\n\nNot: ' + imageList.length + ' adet görsel/kare gönderildi. Hepsini birlikte değerlendir.' : '') },
        ...imageParts,
      ]
    }],
    generationConfig: {
      temperature: 0.15,
      maxOutputTokens: 16384,
      responseMimeType: 'application/json',
    },
  }

  const MODELS = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.5-pro',
  ]

  /* 2.5-flash / flash-lite'ta düşünme modu çıktı bütçesini yiyip JSON'u
     yarıda kesiyor — bu modellerde kapatıyoruz. Pro'da kapatılamaz. */
  const buildBody = model => {
    if (model === 'gemini-2.5-pro') return body
    return {
      ...body,
      generationConfig: { ...body.generationConfig, thinkingConfig: { thinkingBudget: 0 } },
    }
  }

  const MAX_RETRIES = 3
  const RETRY_DELAY_MS = 2500

  let lastError = null
  for (const model of MODELS) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 55000)

      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildBody(model)),
          signal: controller.signal,
        })
        clearTimeout(timer)

        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          const msg = err?.error?.message || `HTTP ${res.status}`

          if (res.status === 429) {
            lastError = new Error('İstek limiti aşıldı')
            if (attempt < MAX_RETRIES) {
              await new Promise(r => setTimeout(r, RETRY_DELAY_MS * attempt))
              continue
            }
            throw new Error('İstek limiti aşıldı. Lütfen 1-2 dakika bekleyin veya farklı bir API anahtarı deneyin.')
          }

          if (res.status === 503 || (msg && msg.toLowerCase().includes('high demand'))) {
            lastError = new Error(msg)
            if (attempt < MAX_RETRIES) {
              await new Promise(r => setTimeout(r, RETRY_DELAY_MS))
              continue
            }
            break
          }

          if (res.status === 400 && msg.toLowerCase().includes('api_key')) throw new Error('API anahtarı geçersiz.')
          throw new Error(`Analiz hatası: ${msg}`)
        }

        const data = await res.json()
        if (data?.promptFeedback?.blockReason) throw new Error(`İçerik engellendi: ${data.promptFeedback.blockReason}`)

        const cand   = data?.candidates?.[0]
        const finish = cand?.finishReason || ''
        const text   = (cand?.content?.parts || []).map(p => p?.text || '').join('')

        if (!text) {
          lastError = new Error(
            finish === 'MAX_TOKENS'
              ? 'Yanıt token sınırına takıldı, tekrar deneyin.'
              : 'Boş yanıt alındı, tekrar deneyin.'
          )
          if (attempt < MAX_RETRIES) { await new Promise(r => setTimeout(r, RETRY_DELAY_MS)); continue }
          break
        }

        let jsonStr = extractJson(text)
        if (!jsonStr) {
          lastError = new Error('AI yanıtı JSON içermiyor, tekrar deneyin.')
          if (attempt < MAX_RETRIES) { await new Promise(r => setTimeout(r, RETRY_DELAY_MS)); continue }
          break
        }

        let parsed = null
        try {
          parsed = JSON.parse(jsonStr)
        } catch {
          // Kesilmiş JSON'u onarmayı dene — böylece gelen alanlar kaybolmaz
          try { parsed = JSON.parse(repairTruncatedJson(jsonStr)) } catch { parsed = null }
        }

        if (!parsed || typeof parsed !== 'object') {
          lastError = new Error('AI yanıtı okunamadı, tekrar deneyin.')
          if (attempt < MAX_RETRIES) { await new Promise(r => setTimeout(r, RETRY_DELAY_MS)); continue }
          break
        }

        if (typeof parsed.error === 'string' && parsed.error.trim()) throw new Error(parsed.error)
        if (parsed.is_aluminum_related === false) {
          throw new Error('Yüklenen görselde alüminyum sistem, cephe veya doğrama elemanı tespit edilemedi. Lütfen konuya uygun bir fotoğraf yükleyin.')
        }

        normalizeReport(parsed)

        // Rapor gövdesi tamamen boşsa sessizce boş ekran göstermek yerine yeniden dene
        if (!isReportUsable(parsed)) {
          lastError = new Error(
            finish === 'MAX_TOKENS'
              ? 'Rapor token sınırı nedeniyle yarıda kaldı, tekrar deneyin.'
              : 'AI raporu eksik döndü, tekrar deneyin.'
          )
          if (attempt < MAX_RETRIES) { await new Promise(r => setTimeout(r, RETRY_DELAY_MS)); continue }
          break
        }

        return parsed
      } catch (e) {
        clearTimeout(timer)
        if (e.name === 'AbortError') throw new Error('Zaman aşımı (55s). Daha az görsel deneyin.')
        if (e.message && e.message.toLowerCase().includes('api anahtarı geçersiz')) throw e
        if (e.message && e.message.toLowerCase().includes('içerik engellendi')) throw e
        if (e.message && e.message.includes('İstek limiti aşıldı')) {
          lastError = e
          if (attempt < MAX_RETRIES) {
            await new Promise(r => setTimeout(r, RETRY_DELAY_MS * attempt))
            continue
          }
          break
        }
        if (e.message && e.message.toLowerCase().includes('high demand')) {
          lastError = e
          if (attempt < MAX_RETRIES) {
            await new Promise(r => setTimeout(r, RETRY_DELAY_MS))
            continue
          }
          break
        }
        throw e
      }
    }
  }
  throw lastError || new Error('Tüm modeller şu an yoğun, lütfen tekrar deneyin.')
}

/* ── Geri uyumluluk: tekli görsel ── */
export async function analyzeImage(imageBase64, apiKey) {
  return analyzeImages([imageBase64], apiKey)
}

const KEY_STORE        = 'Alusight_gemini_key'
const KEY_STORE_LEGACY = 'ozzo_gemini_key'

export function getStoredApiKey() {
  return (
    localStorage.getItem(KEY_STORE) ||
    localStorage.getItem(KEY_STORE_LEGACY) ||
    ''
  )
}

export function saveApiKey(key) { localStorage.setItem(KEY_STORE, key.trim()) }
