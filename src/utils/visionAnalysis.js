/* src/utils/visionAnalysis.js — OZZO Alüminyum AI Görsel Analizi
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

SADECE bu JSON formatında yanıtla, başka metin ekleme:
{
  "found_issues": [
    {
      "category": "SİLİKON/MASTİK|KENAR BOŞLUĞU|CONTA|MONTAJ|KOROZYON|CAM|ISI YALITIMI|SES YALITIMI|SU YALITIMI|ANKRAJ|DRENAJ|MEMBRAN|TOLERANS|YAMUKLUK/EĞİLME|KOMPOZİT|MENTEŞE|KOL|AKSESUAR",
      "title": "kısa Türkçe başlık",
      "severity": "Düşük|Orta|Yüksek|Kritik",
      "description": "fotoğrafta gözlemlenen durumun detaylı Türkçe açıklaması",
      "solution": "önerilen çözüm, malzeme ve uygulama yöntemi",
      "standard": "ilgili EN/ISO/ASTM standardı"
    }
  ],
  "system_guess": "",
  "insulation_report": {
    "thermal":      { "status": "Yeterli|Yetersiz|Eksik|Belirsiz", "observations": "açıklama", "required_materials": ["malzeme"], "application_method": "uygulama" },
    "acoustic":     { "status": "Yeterli|Yetersiz|Eksik|Belirsiz", "observations": "açıklama", "required_materials": ["malzeme"], "application_method": "uygulama" },
    "waterproofing":{ "status": "Yeterli|Yetersiz|Eksik|Belirsiz", "observations": "açıklama", "required_materials": ["malzeme"], "application_method": "uygulama" }
  },
  "missing_materials": [
    { "name": "malzeme adı", "purpose": "amaç", "quantity_hint": "tahmini miktar", "priority": "Acil|Yüksek|Orta" }
  ],
  "overall_condition": "İyi|Orta|Kötü|Kritik",
  "summary": "2-3 cümle genel değerlendirme Türkçe",
  "positive_notes": ["iyi görünen şeyler"]
}

Görseller alüminyum içermiyorsa: {"error":"Alüminyum sistem tespit edilemedi"}`

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

  const apiKey = import.meta.env.VITE_GEMINI_KEY || localStorage.getItem('ozzo_gemini_key') || ''
  if (!apiKey) throw new Error('API anahtarı bulunamadı. Lütfen yöneticinizle iletişime geçin.')

  const compressed = await Promise.all(imageList.map(b => compressImage(b)))

  const imageParts = compressed.map(b => ({
    inline_data: {
      mime_type: b.match(/^data:(image\/\w+);/)?.[1] || 'image/jpeg',
      data: b.replace(/^data:image\/\w+;base64,/, ''),
    }
  }))

  const body = {
    contents: [{
      parts: [
        { text: PROMPT_BASE + (imageList.length > 1 ? `\n\nNot: ${imageList.length} adet görsel/kare gönderildi. Hepsini birlikte değerlendir.` : '') },
        ...imageParts,
      ]
    }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 8192,
    },
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 55000)

  const MODELS = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.5-pro',
  ]

  let lastError = null
  for (const model of MODELS) {
    try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    clearTimeout(timer)

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      const msg = err?.error?.message || `HTTP ${res.status}`
      if (res.status === 503 || (msg && msg.toLowerCase().includes('high demand'))) {
        lastError = new Error(msg); continue
      }
      if (res.status === 400 && msg.toLowerCase().includes('api_key')) throw new Error('API anahtarı geçersiz.')
      if (res.status === 429) throw new Error('İstek limiti aşıldı, 1 dakika bekleyip tekrar deneyin.')
      throw new Error(`Analiz hatası: ${msg}`)
    }

    const data = await res.json()
    if (data?.promptFeedback?.blockReason) throw new Error(`İçerik engellendi: ${data.promptFeedback.blockReason}`)

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    if (!text) throw new Error('Boş yanıt alındı, tekrar deneyin.')

    // Sağlam JSON çıkarma
    let jsonStr = null
    const mdMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
    if (mdMatch) jsonStr = mdMatch[1]
    if (!jsonStr) {
      const start = text.indexOf('{')
      if (start !== -1) {
        let depth = 0, end = -1
        for (let i = start; i < text.length; i++) {
          if (text[i] === '{') depth++
          else if (text[i] === '}') { depth--; if (depth === 0) { end = i; break } }
        }
        if (end !== -1) jsonStr = text.slice(start, end + 1)
      }
    }
    if (!jsonStr) throw new Error('AI yanıtı JSON içermiyor, tekrar deneyin.')

    let parsed
    try { parsed = JSON.parse(jsonStr) }
    catch {
      const condMatch   = jsonStr.match(/"overall_condition"\s*:\s*"([^"]*)"/)
      const summaryMatch = jsonStr.match(/"summary"\s*:\s*"([^"]*)"/)
      parsed = {
        found_issues: [],
        overall_condition: condMatch?.[1] || 'Belirsiz',
        summary: summaryMatch?.[1] || 'Analiz kısmen tamamlandı.',
        insulation_report: {},
        missing_materials: [],
      }
    }
    if (parsed.error) throw new Error(parsed.error)
    return parsed
    } catch (e) {
      clearTimeout(timer)
      if (e.name === 'AbortError') throw new Error('Zaman aşımı (55s). Daha az görsel deneyin.')
      if (e.message && e.message.toLowerCase().includes('high demand')) { lastError = e; continue }
      throw e
    }
  }
  throw lastError || new Error('Tüm modeller şu an yoğun, lütfen tekrar deneyin.')
}

/* ── Geri uyumluluk: tekli görsel ── */
export async function analyzeImage(imageBase64, apiKey) {
  return analyzeImages([imageBase64], apiKey)
}

export function getStoredApiKey() { return localStorage.getItem('ozzo_gemini_key') || '' }
export function saveApiKey(key)   { localStorage.setItem('ozzo_gemini_key', key.trim()) }
