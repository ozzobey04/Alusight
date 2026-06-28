import { useState, useRef, useEffect, useCallback } from 'react'
import { getStoredApiKey, saveApiKey } from '../utils/visionAnalysis'
import { knowledgeBase as FUAT_KB } from '../data/knowledgeBase'
import { searchKnowledge } from '../data/facadeKnowledgeBase'

const FUAT_TEXT = FUAT_KB.map(item =>
  `[${item.source}]\n${item.genelOzet || ''}\n` +
  (item.bolumler || []).slice(0, 5).map(b =>
    `• ${b.baslik}: ${(b.hatalar || []).slice(0,2).join(' | ')}`
  ).join('\n')
).join('\n\n')

/* ── Sistem Prompt ─────────────────────────────────────────────────── */
const SYSTEM = `Sen OZZO Alüminyum firmasının uzman teknik danışmanısın.
Alüminyum doğrama, giydirme cephe, sürme sistemler, ısı yalıtımlı profiller, cam sistemleri, ankraj, montaj ve aksesuar konularında derin teknik bilgiye sahipsin.

Bilgi tabanı özeti:
${FUAT_TEXT}

Aksesuar markaları: HOPPE (kapı-pencere kolları, çekme kollar), GIESSE (menteşe, kol serileri), SIEGENIA/TITANAF (TITAN PVC/ALU, axxent, GLOBE menteşe-kol sistemleri), AKPA (menteşe, vasistas, kilit), ADO (profil aksesuarları).

Aksesuar hataları: menteşe hizası (±0.5mm tolerans), kol torku (3-4Nm), kilit karşılığı kaçması, conta eksikliği.

Firma: OZZO Alüminyum | Tel: 0535 861 04 04 | Çalışma: Pzt-Cuma 08:00-16:00

ZORUNLU KURALLAR:
- Her teknik soruya MUTLAKA 3 madde somut, spesifik bilgi ver
- Aksesuar sorusuna aksesuar cevabı, cephe sorusuna cephe cevabı ver
- Genel "ne konusunda yardımcı olabilirim" cevabı YASAK
- Türkçe yanıtla
- Cevabın sonunda "Detaylı danışmanlık için OZZO Alüminyum ile iletişime geçebilirsiniz." ekle
- Dosya/PDF talebi: "Sitemizin Hesaplamalar veya Öneri & Analiz bölümünü kullanabilirsiniz." de`

/* ── Cam seçenek soruları ───────────────────────────────────────────── */
const GLASS_KEYWORDS = ['cam', 'glass', 'ısıcam', 'triple', 'lamine', 'ses yalıtım', 'güvenlik cam', 'u değer', 'şeffaf', 'çift cam', 'üçlü cam']

const GLASS_OPTIONS = [
  { id: 'isicam',    icon: '🔵', label: 'Isıcam (4+16+4)',              detail: 'standart ısı yalıtımlı çift cam' },
  { id: 'triple',    icon: '🟣', label: 'Triple Cam (4+12+4+12+4)',     detail: 'üç katmanlı yüksek yalıtım' },
  { id: 'lamine',    icon: '🟢', label: 'Lamine Güvenlik Camı',         detail: 'kırılmaz/anti-hırsızlık' },
  { id: 'ses',       icon: '🟡', label: 'Ses Yalıtımlı Cam',            detail: '38-44 dB akustik çözüm' },
  { id: 'akilli',    icon: '⚪', label: 'Akıllı / Elektrokromik Cam',   detail: 'şeffaflık kontrolü' },
  { id: 'gunes',     icon: '🔴', label: 'Güneş Kontrol Camlı',          detail: 'solar reflektif kaplama' },
]

/* ── Hızlı Başlangıç Soruları ──────────────────────────────────────── */
const QUICK = [
  { icon: '🏗', label: 'Giydirme Cephe nedir?' },
  { icon: '🌡', label: 'Isı yalıtımlı profil farkı?' },
  { icon: '🚪', label: 'Sürme sistem kanat kapasitesi?' },
  { icon: '💰', label: 'Yaklaşık m² fiyatı?' },
  { icon: '🔧', label: 'Bakım ne zaman yapılmalı?' },
  { icon: '📋', label: 'Teklif nasıl alırım?' },
]

/* ── Gemini API çağrısı ────────────────────────────────────────────── */
async function askGemini(messages, apiKey, systemOverride) {
  const contents = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }))

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemOverride || SYSTEM }] },
        contents,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024,
        },
      }),
    }
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `HTTP ${res.status}`)
  }
  const data = await res.json()
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Yanıt alınamadı.'
}

/* ── Yerel yedek yanıtlar (API yoksa) ─────────────────────────────── */
const LOCAL_KB = {
  hata: '**Alüminyum doğramada en sık yapılan 3 hata:**\n1. **Ankraj slot/sabit delik hatası** — üst ankrajda slot delik yerine sabit delik kullanılması profilin kaymasına neden olur.\n2. **İç cam fitili köşe birleşimi** — vulkanize köşe parça yerine düz kesim yapılması köşelerden su sızıntısına yol açar.\n3. **Conta eksikliği** — yatay-düşey profil birleşimlerinde conta atlanması hava ve su geçişine zemin hazırlar.\n\nDetaylı proje danışmanlığı için OZZO Alüminyum ile iletişime geçebilirsiniz.',
  aksesuar: '**Aksesuar montajında en çok yapılan 3 hata:**\n1. **Menteşe hizası** — menteşeler aynı düşey eksende hizalanmadığında kanat eğrilir, açılıp kapanma zorlaşır (HOPPE/GIESSE menteşelerinde ±0.5mm tolerans şarttır).\n2. **Kol torku** — vasistas/dönme kolu montajında yanlış tork uygulanması mekanizma arızasına yol açar; SIEGENIA TITAN kollar için 3-4 Nm tork önerilir.\n3. **Kilit karşılığı hizası** — gömme kilit karşılıkları 1mm'den fazla kaymışsa kapı/pencere kilitlenemez veya zorlanır; montajda şablon kullanımı zorunludur.',
  teknik: '**Alüminyum doğramada 3 kritik teknik değer:**\n1. **Isı geçirgenlik (Uw)** — TS 825\'e göre Bölge 1\'de Uw ≤ 2.4 W/m²K olmalıdır; ısı yalıtımlı profil kullanımıyla bu değer önemli ölçüde düşürülebilir.\n2. **Hava geçirmezlik** — EN 12207 standardına göre Sınıf 4, maksimum 600 Pa basınca dayanıklı olmalıdır.\n3. **Rüzgar yükü direnci** — EN 12210 standardı Sınıf C5: 2000 Pa pozitif ve negatif basınca karşı dayanım şarttır.\n\nDetaylı hesaplama ve proje danışmanlığı için OZZO Alüminyum ile iletişime geçebilirsiniz.',
  surme: '**Sürme sistemlerde 3 kritik teknik nokta:**\n1. **Kanat ağırlığı ve ray seçimi** — standart sürme rayda max. 100 kg, kaldır-sür (lift & slide) sistemde 400 kg\'a kadar çıkılabilir; ray kesiti yük kapasitesine göre seçilmeli.\n2. **Hava sızdırmazlık** — EN 12207 Sınıf 2–3, fırça contalar ve EPDM fitil kombinasyonu şarttır; eksik conta rüzgarda ıslık sesine yol açar.\n3. **Termal köprü** — ısı yalıtımlı sürme profilde PA66 bant kesintisiz olmalı, aksi halde profil üzerinde yoğuşma oluşur.\n\nDetaylı danışmanlık için OZZO Alüminyum ile iletişime geçebilirsiniz.',
  surme_hata: '**Sürme sistemlerde en sık yapılan 3 hata:**\n1. **Ray hizası bozukluğu** — üst ve alt raylar aynı düşey düzlemde olmadığında kanat sürünmesi zorlaşır ve raya zarar verir.\n2. **Drenaj deliği tıkanması** — alt profilden su çıkışı sağlayan drenaj delikleri yapı köpüğüyle kapandığında su birikmesi ve korozyon başlar.\n3. **Takoz eksikliği** — cam altına cam takozları yerleştirilmediğinde cam ağırlığı contaya yüklenip sızdırmazlık bozulur.\n\nDetaylı danışmanlık için OZZO Alüminyum ile iletişime geçebilirsiniz.',
  surme_isi: '**Sürme sistemlerde ısı değerleri:**\n1. **Standart sürme** — Uw = 2.8–3.5 W/m²K; ısı yalıtımlı sürme sistemde PA66 bant ile Uw = 1.6–2.2 W/m²K\'e düşer.\n2. **TS 825 uyumu** — Türkiye Bölge 1\'de sürme pencereler için Uw ≤ 2.4 W/m²K gereklidir; Low-E cam ve ısıcam şarttır.\n3. **Kaldır-sür (lift & slide)** — büyük cam alanları için ideal; termal break profil ve triple cam ile Uw = 0.8 W/m²K\'e kadar inilebilir.\n\nDetaylı danışmanlık için OZZO Alüminyum ile iletişime geçebilirsiniz.',
  cephe: '**Giydirme cephe (curtain wall) 3 kritik teknik konu:**\n1. **Sistem tipi** — Stick (saha montajı) sistemde profil derinliği 50–65 mm; Unitize (fabrika montajı) sistemde 150 mm\'ye kadar çıkar.\n2. **Rüzgar yükü direnci** — Türkiye\'de temel rüzgar hızı 25–27 m/s olup cephe sistemleri bölgeye göre hesaplanan rüzgar yüküne dayanıklı tasarlanmalıdır.\n3. **Spandrel bölge** — galvaniz tava + 50 mm taşyünü + alüminyum spandrel panel katmanlanması zorunludur, aksi hâlde yangın ve ısı kaybı riski oluşur.\n\nDetaylı hesaplama ve proje danışmanlığı için OZZO Alüminyum ile iletişime geçebilirsiniz.',
  yalitim: '**Isı yalıtımında 3 kritik konu:**\n1. **Profil ısı geçirgenliği (Uf)** — ısı köprü kesici PA66 bant kullanımıyla profil ısı geçirgenliği önemli ölçüde düşürülür; ısı yalıtımlı ve yalıtımsız profiller arasında büyük fark vardır.\n2. **Cam seçimi** — standart çift cam ile Low-E kaplamalı cam arasındaki ısı geçirgenlik farkı enerji tasarrufunda belirleyici rol oynar.\n3. **Yoğuşma riski** — iç yüzey sıcaklığı çiy noktasının altına düştüğünde yoğuşma oluşur; bu durum küf ve nem hasarına yol açar, profil ve cam seçimi bu riski doğrudan etkiler.\n\nDetaylı hesaplama ve proje danışmanlığı için OZZO Alüminyum ile iletişime geçebilirsiniz.',
  fiyat: 'Standart sistem yaklaşık 800–1.400 ₺/m², ısı yalıtımlı sistem 1.200–2.200 ₺/m² (KDV hariç, montaj dahil). Kesin teklif için ölçüleri paylaşın.\n\nDetaylı proje fiyatlandırması için OZZO Alüminyum ile iletişime geçebilirsiniz.',
  teklif: 'Teklif için +90 535 861 04 04 numaralı hattı arayabilir veya sayfadaki teklif formunu doldurabilirsiniz. Pzt–Cuma 08:00–16:00.',
  bakim: '**Bakım için 3 kritik adım:**\n1. Yılda 2 kez nötr deterjanla profil ve cam temizliği (asit/baz içeren ürünler eloksal kaplamasına zarar verir).\n2. 6 ayda bir ray ve menteşelere silikonlu sprey yağ uygulanmalıdır.\n3. Conta ve fitillerin 5–7 yılda bir kontrolü ve gerekirse değişimi önerilir.\n\nDetaylı bakım anlaşması için OZZO Alüminyum ile iletişime geçebilirsiniz.',
  garanti: '10 yıl yapısal garanti, 5 yıl mekanik aksam garantisi. Profil deformasyonu ve yüzey kaplama solması garanti kapsamındadır.',
  default: '**Alüminyum doğrama ve giydirme cephe** konusunda yardımcı olabilirim.\n\nSormak isteyebileceğiniz konular:\n• Isı geçirgenlik değerleri ve formüller\n• Montaj hataları ve doğru uygulamalar\n• Rüzgar yükü hesabı\n• Sistem seçimi (sürme, giydirme cephe vb.)\n\nDetaylı bilgi için OZZO Alüminyum ile iletişime geçebilirsiniz.',
}

function localFallback(text) {
  const t = text.toLowerCase()
  if (t.includes('aksesuar') || t.includes('menteşe') || t.includes('kol') || t.includes('kilit') || t.includes('hoppe') || t.includes('giesse') || t.includes('siegenia')) return LOCAL_KB.aksesuar
  if (t.includes('sürme') && (t.includes('hata') || t.includes('yanlış') || t.includes('sorun'))) return LOCAL_KB.surme_hata
  if (t.includes('sürme') && (t.includes('ısı') || t.includes('u değer') || t.includes('uw') || t.includes('yalıtım'))) return LOCAL_KB.surme_isi
  if (t.includes('sürme') || t.includes('kaldır') || t.includes('sliding') || t.includes('lift')) return LOCAL_KB.surme
  if (t.includes('hata') || t.includes('yanlış') || t.includes('sorun') || t.includes('problem')) return LOCAL_KB.hata
  if (t.includes('teknik') || t.includes('bilgi') || t.includes('değer') || t.includes('hesap')) return LOCAL_KB.teknik
  if (t.includes('cephe') || t.includes('curtain') || t.includes('giydirme')) return LOCAL_KB.cephe
  if (t.includes('yalıtım') || t.includes('ısı') || t.includes('thermal') || t.includes('enerji') || t.includes('u değer')) return LOCAL_KB.yalitim
  if (t.includes('fiyat') || t.includes('ücret') || t.includes('maliyet') || t.includes('₺')) return LOCAL_KB.fiyat
  if (t.includes('teklif') || t.includes('sipariş') || t.includes('randevu')) return LOCAL_KB.teklif
  if (t.includes('bakım') || t.includes('temizlik') || t.includes('yağ')) return LOCAL_KB.bakim
  if (t.includes('garanti') || t.includes('güvence')) return LOCAL_KB.garanti
  return LOCAL_KB.default
}

/* ── Bileşen ───────────────────────────────────────────────────────── */
export default function AiChat() {
  const [open, setOpen]             = useState(false)
  const [messages, setMessages]     = useState([])
  const [input, setInput]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [apiKey, setApiKey]         = useState(getStoredApiKey)
  const [keyDraft, setKeyDraft]     = useState('')
  const [showKey, setShowKey]       = useState(false)
  const [glassCtx, setGlassCtx]    = useState(null)   // cam seçenek bekleniyor mu
  const [unread, setUnread]         = useState(0)
  const bottomRef = useRef()
  const inputRef  = useRef()

  /* İlk açılışta karşılama */
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        text: '👋 Merhaba! OZZO MİMARİ VE TEKNİK EKİBİ olarak hizmetinizdeyiz.\n\nAlüminyum doğrama, giydirme cephe, sürme sistemler ve daha fazlası hakkında sorularınızı yanıtlayabiliriz.',
        ts: Date.now(),
      }])
    }
    if (open) setUnread(0)
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const isGlassQuestion = (text) =>
    GLASS_KEYWORDS.some(kw => text.toLowerCase().includes(kw))

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return
    setInput('')
    setGlassCtx(null)

    const userMsg = { role: 'user', text: text.trim(), ts: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    const key = import.meta.env.VITE_GEMINI_KEY || apiKey || getStoredApiKey()
    try {
      let reply
      if (key) {
        const relevantKB = searchKnowledge(text)
        const dynamicSystem = relevantKB
          ? SYSTEM + `\n\nBu soruyla ilgili teknik veriler:\n${relevantKB}`
          : SYSTEM
        const history = [...messages, userMsg].slice(-10)
        reply = await askGemini(history, key, dynamicSystem)
      } else {
        await new Promise(r => setTimeout(r, 600))
        reply = localFallback(text)
      }
      setMessages(prev => [...prev, { role: 'assistant', text: reply, ts: Date.now() }])
      if (!open) setUnread(n => n + 1)
    } catch (e) {
      console.error('Gemini hata:', e.message)
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: localFallback(text),
        ts: Date.now(),
      }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [apiKey, loading, messages, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    /* cam sorusu tespiti — seçenek göster */
    if (isGlassQuestion(input) && !glassCtx) {
      setGlassCtx(input)
      setMessages(prev => [...prev,
        { role: 'user', text: input.trim(), ts: Date.now() },
        { role: 'assistant', text: null, glassOptions: true, ts: Date.now() },
      ])
      setInput('')
      return
    }
    sendMessage(input)
  }

  const selectGlassOption = (opt) => {
    const fullQ = `${glassCtx} — özellikle ${opt.label} (${opt.detail}) hakkında bilgi istiyorum.`
    setMessages(prev => prev.filter(m => !m.glassOptions))
    sendMessage(fullQ)
  }

  const saveKey = () => {
    const k = keyDraft.trim()
    saveApiKey(k); setApiKey(k); setShowKey(false); setKeyDraft('')
  }

  /* ── Render ── */
  return (
    <>
      {/* Float toggle butonu */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-28 left-6 z-50 group"
        aria-label="Teknik Danışman"
        style={{ filter: 'drop-shadow(0 4px 24px rgba(251,191,36,0.35))' }}
      >
        <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300
          ${open ? 'bg-white/15 border border-white/25 rotate-0' : 'bg-gradient-to-br from-amber-400 to-orange-500 hover:scale-110'}`}>
          {open ? (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          ) : (
            <>
              <svg className="w-7 h-7 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14H7v-2h6v2zm4-4H7V10h10v2zm0-4H7V6h10v2z"/>
              </svg>
              {unread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unread}
                </span>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0f28] animate-pulse"/>
            </>
          )}
        </div>
        {!open && (
          <span className="absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Teknik Danışman
          </span>
        )}
      </button>

      {/* Chat paneli */}
      <div className={`fixed bottom-28 left-6 z-50 w-[360px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10
        transition-all duration-300 origin-bottom-left
        ${open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none'}`}
        style={{ maxHeight: '520px', background: 'linear-gradient(135deg, #0d1117 0%, #0a0f28 100%)' }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10"
          style={{ background: 'linear-gradient(90deg, rgba(251,191,36,0.12) 0%, rgba(249,115,22,0.08) 100%)' }}>
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
            </svg>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-[#0a0f28]"/>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm leading-tight">OZZO Teknik Danışman</div>
            <div className="text-green-400 text-[10px] font-mono">● Çevrimiçi — Türkçe / İngilizce</div>
          </div>
          <button onClick={() => setShowKey(true)} className="text-white/30 hover:text-white/60 transition-colors p-1" title="API Ayarları">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>
        </div>

        {/* Mesajlar */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0" style={{ maxHeight: '340px' }}>

          {/* Hızlı sorular — sadece başlangıçta */}
          {messages.length <= 1 && (
            <div className="pb-1">
              <p className="text-white/30 text-[10px] font-mono uppercase mb-2 px-1">Hızlı Sorular</p>
              <div className="grid grid-cols-2 gap-1.5">
                {QUICK.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q.label)}
                    className="flex items-center gap-1.5 text-left px-2.5 py-2 rounded-xl bg-white/5 hover:bg-amber-500/15 border border-white/8 hover:border-amber-500/30 text-white/70 hover:text-white text-[11px] transition-all">
                    <span className="text-base leading-none">{q.icon}</span>
                    <span className="leading-tight">{q.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mesaj baloncukları */}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                  <svg className="w-3.5 h-3.5 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                  </svg>
                </div>
              )}

              <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                {/* cam seçenek kartı */}
                {msg.glassOptions ? (
                  <div className="bg-white/5 border border-amber-500/20 rounded-2xl p-3">
                    <p className="text-amber-300/80 text-xs mb-2.5 font-medium">Hangi cam sistemi hakkında bilgi almak istiyorsunuz?</p>
                    <div className="space-y-1.5">
                      {GLASS_OPTIONS.map(opt => (
                        <button key={opt.id} onClick={() => selectGlassOption(opt)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-amber-500/15 border border-white/8 hover:border-amber-400/40 text-left transition-all group">
                          <span className="text-sm">{opt.icon}</span>
                          <div>
                            <div className="text-white text-xs font-medium group-hover:text-amber-200">{opt.label}</div>
                            <div className="text-white/35 text-[10px]">{opt.detail}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                    ${msg.role === 'user'
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-black font-medium rounded-tr-sm'
                      : 'bg-white/8 border border-white/10 text-white/85 rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                )}
                <div className={`text-[9px] text-white/20 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left pl-1'}`}>
                  {new Date(msg.ts).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {/* Yazıyor göstergesi */}
          {loading && (
            <div className="flex justify-start items-end gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                </svg>
              </div>
              <div className="bg-white/8 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-bounce" style={{ animationDelay: `${i*150}ms` }}/>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Input alanı */}
        <div className="border-t border-white/10 px-3 py-2.5">
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Sorunuzu yazın..."
              disabled={loading}
              className="flex-1 bg-white/8 border border-white/12 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-400/40 resize-none disabled:opacity-50 transition-colors"
            />
            <button type="submit" disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 disabled:opacity-30 hover:scale-105 transition-all">
              <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
          {!apiKey && (
            <p className="text-white/25 text-[10px] mt-1.5 px-1">
              Gemini API ekleyerek daha gelişmiş yanıtlar alın →{' '}
              <button onClick={() => setShowKey(true)} className="text-amber-400/60 hover:text-amber-300 underline underline-offset-2">
                Ayarla
              </button>
            </p>
          )}
        </div>
      </div>

      {/* API Key Modal */}
      {showKey && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-[#0d1117] border border-white/15 rounded-2xl p-7 w-full max-w-sm shadow-2xl">
            <h3 className="text-white font-bold text-base mb-1">Gemini API Anahtarı</h3>
            <p className="text-white/40 text-xs mb-4 leading-relaxed">
              Ücretsiz al:{' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">
                aistudio.google.com
              </a>
            </p>
            <input
              type="text" value={keyDraft} onChange={e => setKeyDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveKey()}
              placeholder="AIzaSy..." autoFocus
              className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-400/50 font-mono mb-4"
            />
            <div className="flex gap-3">
              <button onClick={saveKey}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all">
                Kaydet
              </button>
              <button onClick={() => setShowKey(false)}
                className="px-4 py-2.5 rounded-xl bg-white/8 hover:bg-white/12 border border-white/15 text-white/60 text-sm transition-all">
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
