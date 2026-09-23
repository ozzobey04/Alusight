import { useState, useRef, useEffect, useCallback } from 'react'
import { getStoredApiKey, saveApiKey } from '../utils/visionAnalysis'

/* ── Gemini sistem prompt ─────────────────────────────────── */
const SYSTEM = `Sen AluSight firmasının uzman yapay zeka asistanısın.
Alüminyum doğrama, giydirme cephe, sürme sistemler, ısı yalıtımlı profiller, cam sistemleri, ankraj, montaj ve yapı kabuğu konularında derin teknik bilgiye sahipsin.
Firma: AluSight | Tel: +90 535 861 0404 | Çalışma: Pzt-Cuma 08:00-16:00
Kurallar: Türkçe yanıtla, maks 4 cümle. Teknik sorularda EN/ISO standardı ver. Fiyat sorularında yaklaşık m² aralığı ver ve kesin teklif için iletişime yönlendir.`

/* ── Cam seçenekleri ──────────────────────────────────────── */
const GLASS_KW = ['cam', 'ısıcam', 'triple', 'lamine', 'ses yalıtım', 'güvenlik cam', 'çift cam', 'üçlü', 'akustik', 'u değer']
const GLASS_OPTS = [
  { id:'isicam', icon:'🔵', label:'Isıcam (4+16+4)',           detail:'standart ısı yalıtımlı' },
  { id:'triple', icon:'🟣', label:'Triple Cam (4+12+4+12+4)',  detail:'üç katmanlı premium' },
  { id:'lamine', icon:'🟢', label:'Lamine Güvenlik',           detail:'kırılmaz, anti-hırsızlık' },
  { id:'ses',    icon:'🟡', label:'Ses Yalıtımlı',             detail:'38-44 dB akustik' },
  { id:'gunes',  icon:'🔴', label:'Güneş Kontrol',             detail:'solar reflektif kaplama' },
  { id:'akilli', icon:'⚪', label:'Akıllı / Elektrokromik',    detail:'şeffaflık kontrolü' },
]

/* ── Yerel KB (yedek) ────────────────────────────────────── */
const KB = {
  surme:    'Sürme sistemler 45–90 mm derinlikte, termal break opsiyonuyla mevcuttur. interal S 36 KS kaldır-sür sistemde 200 kg\'a kadar kanat uygulanabilir. Sessiz ray ve yüksek güvenlik kilitleme standarttır.',
  yalitim:  'PA66 cam elyaf takviyeli polyamid ısı köprüsü kesici ile Uf 1.3 W/m²K altı değerler sunulur. Enerji maliyetlerini %30–40 azaltır; BEP belgesi hesabına katkı sağlar.',
  cam:      'Sistemlerimizle 4+16+4 ısıcam, 4+12+4+12+4 üçlü cam veya lamine güvenlik camı kullanılabilir. Ses yalıtımında 44 dB\'e kadar çözüm sunuyoruz.',
  cephe:    'Giydirme cephe; Stick (çubuk), Unitize (birim) ve Yarı Strüktürel silikon olarak üç tipte gelir. EN 13830 belgeli; rüzgar, sismik ve termal hesaplar birlikte yapılır.',
  fiyat:    'Standart sürme sistem ≈800–1.400 ₺/m², ısı yalıtımlı sistem ≈1.200–2.200 ₺/m² (KDV hariç, montaj dahil). Kesin teklif için ölçülerinizi paylaşın.',
  teklif:   '+90 535 861 0404 veya sayfadaki teklif formu. Çalışma saati Pzt–Cuma 08:00–16:00. Ücretsiz keşif randevusu alabilirsiniz.',
  bakim:    'Yılda 1–2 kez nötr deterjanla temizlik, 6 ayda bir ray/menteşe yağlaması önerilir. Yıllık bakım anlaşması için iletişime geçin.',
  garanti:  '10 yıl yapısal garanti, 5 yıl mekanik aksam garantisi. Profil deformasyonu ve yüzey kaplama solması kapsam dahilindedir.',
  default:  'Alüminyum doğrama, giydirme cephe, sürme sistem veya cam konularında yardımcı olabilirim. Sorunuzu biraz daha ayrıntılandırır mısınız?',
}
function localFallback(t) {
  const l = t.toLowerCase()
  if (/sürme|kaldır|sliding/.test(l)) return KB.surme
  if (/yalıtım|ısı|termal|pa66/.test(l)) return KB.yalitim
  if (/cam|ısıcam|glass/.test(l)) return KB.cam
  if (/cephe|curtain|giydirme/.test(l)) return KB.cephe
  if (/fiyat|ücret|maliyet|kaç/.test(l)) return KB.fiyat
  if (/teklif|sipariş|order/.test(l)) return KB.teklif
  if (/bakım|temizlik|yağ/.test(l)) return KB.bakim
  if (/garanti|güvence/.test(l)) return KB.garanti
  return KB.default
}

/* ── Gemini API ──────────────────────────────────────────── */
async function askGemini(history, apiKey) {
  const contents = history.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }))
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 400, thinkingConfig: { thinkingBudget: 0 } },
      }),
    }
  )
  if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e?.error?.message||`HTTP ${res.status}`) }
  const data = await res.json()
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Yanıt alınamadı.'
}

/* ── LME Alüminyum fiyat verisi ─────────────────────────── */
function genMockLME() {
  // Gerçekçi LME alüminyum fiyatı simülasyonu (≈2400-2600 $/ton Feb 2026)
  let price = 2485
  const prices = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    price += (Math.random() - 0.48) * 38
    price = Math.max(2200, Math.min(2800, price))
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    // sadece iş günleri
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      prices.push({ price: parseFloat(price.toFixed(2)), date: d })
    }
  }
  return prices
}

async function fetchLMEData() {
  try {
    const proxy = 'https://api.allorigins.win/raw?url='
    const target = encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/ALI=F?interval=1d&range=1mo')
    const ctrl = new AbortController()
    setTimeout(() => ctrl.abort(), 7000)
    const res = await fetch(proxy + target, { signal: ctrl.signal })
    const json = await res.json()
    const result = json?.chart?.result?.[0]
    const closes = result?.indicators?.quote?.[0]?.close
    const timestamps = result?.timestamp
    if (!closes?.length) throw new Error('no data')
    const prices = closes
      .map((p, i) => ({ price: p ? parseFloat(p.toFixed(2)) : null, date: new Date(timestamps[i] * 1000) }))
      .filter(d => d.price && d.price > 100)
    if (prices.length < 5) throw new Error('insufficient')
    return { prices, live: true }
  } catch {
    return { prices: genMockLME(), live: false }
  }
}

/* ── LME Grafik (SVG sparkline) ─────────────────────────── */
function LMEChart({ prices, positive }) {
  if (!prices?.length) return null
  const W = 312, H = 80, PL = 38, PR = 6, PT = 8, PB = 18
  const cW = W - PL - PR, cH = H - PT - PB
  const vals = prices.map(p => p.price)
  const min = Math.min(...vals), max = Math.max(...vals)
  const range = max - min || 1

  const toX = i => PL + (i / (prices.length - 1)) * cW
  const toY = v => PT + cH - ((v - min) / range) * cH

  const pts = prices.map((p, i) => `${toX(i)},${toY(p.price)}`).join(' ')
  const area = `M${PL},${PT + cH} L${pts.split(' ').join(' L')} L${PL + cW},${PT + cH} Z`
  const line = `M${pts.split(' ').join(' L')}`

  const gradId = `lmeGrad${positive ? 'up' : 'dn'}`
  const lineCol = positive ? '#22c55e' : '#ef4444'
  const fillA   = positive ? 'rgba(34,197,94,0.22)' : 'rgba(239,68,68,0.22)'
  const fillB   = positive ? 'rgba(34,197,94,0)' : 'rgba(239,68,68,0)'

  // grid lines (3)
  const gridVals = [min, (min + max) / 2, max]

  // tick labels (5 evenly spaced dates)
  const ticks = [0, 7, 14, 21, prices.length - 1].map(i => Math.min(i, prices.length - 1))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillA}/>
          <stop offset="100%" stopColor={fillB}/>
        </linearGradient>
      </defs>
      {/* grid lines */}
      {gridVals.map((v, i) => (
        <g key={i}>
          <line x1={PL} y1={toY(v)} x2={W - PR} y2={toY(v)} stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" strokeDasharray="3,3"/>
          <text x={PL - 4} y={toY(v) + 3.5} textAnchor="end" fontSize="7" fill="rgba(255,255,255,0.3)" fontFamily="Montserrat,sans-serif">{Math.round(v)}</text>
        </g>
      ))}
      {/* area fill */}
      <path d={area} fill={`url(#${gradId})`}/>
      {/* price line */}
      <path d={line} fill="none" stroke={lineCol} strokeWidth="1.6" strokeLinejoin="round"/>
      {/* last point dot */}
      <circle cx={toX(prices.length - 1)} cy={toY(vals[vals.length - 1])} r="3" fill={lineCol} stroke="rgba(6,10,20,0.9)" strokeWidth="1.5"/>
      {/* date ticks */}
      {ticks.map(i => (
        <text key={i} x={toX(i)} y={H - 3} textAnchor="middle" fontSize="6.5" fill="rgba(255,255,255,0.25)" fontFamily="Montserrat,sans-serif">
          {prices[i]?.date.toLocaleDateString('tr-TR', { day:'2-digit', month:'2-digit' })}
        </text>
      ))}
    </svg>
  )
}

/* ── LME Sekmesi ─────────────────────────────────────────── */
function LMETab() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const USD_TRY = 38.2  // yaklaşık kur

  useEffect(() => {
    fetchLMEData().then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#c9a84c',
          animation:`oai 1.3s ease-in-out ${i*0.22}s infinite` }}/>
      ))}
    </div>
  )

  const prices = data?.prices || []
  const current = prices[prices.length - 1]?.price ?? 0
  const prev    = prices[prices.length - 2]?.price ?? current
  const change  = current - prev
  const changePct = prev ? ((change / prev) * 100) : 0
  const positive = change >= 0
  const hi30 = Math.max(...prices.map(p => p.price))
  const lo30 = Math.min(...prices.map(p => p.price))
  const avg30 = prices.reduce((s, p) => s + p.price, 0) / prices.length
  const tryPrice = (current * USD_TRY / 1000).toFixed(0)  // ₺/kg

  const C = (v,d=0) => v.toLocaleString('tr-TR', { minimumFractionDigits:d, maximumFractionDigits:d })

  return (
    <div style={{ flex:1, overflowY:'auto', padding:'12px 14px', scrollbarWidth:'thin', scrollbarColor:'rgba(201,168,76,0.18) transparent' }}>

      {/* Ana fiyat kartı */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04))',
        border: '1px solid rgba(201,168,76,0.28)',
        borderRadius: 12, padding: '12px 14px', marginBottom: 10,
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 6 }}>
          <div>
            <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:9.5, color:'rgba(201,168,76,0.6)', letterSpacing:1, textTransform:'uppercase', marginBottom:3 }}>
              LME Alüminyum ($/ton)
            </div>
            <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:28, fontWeight:800, color:'#e8c96d', lineHeight:1 }}>
              ${C(current, 2)}
            </div>
            <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, color:'rgba(180,200,220,0.5)', marginTop:3 }}>
              ≈ {C(parseFloat(tryPrice))} ₺/kg (kur ~{USD_TRY})
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:4,
              padding:'4px 10px', borderRadius:8,
              background: positive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
              border: `1px solid ${positive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
            }}>
              <span style={{ fontSize:12 }}>{positive ? '▲' : '▼'}</span>
              <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:12, fontWeight:700,
                color: positive ? '#4ade80' : '#f87171' }}>
                {positive ? '+' : ''}{C(change, 2)}
              </span>
              <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:10,
                color: positive ? 'rgba(74,222,128,0.7)' : 'rgba(248,113,113,0.7)' }}>
                ({positive ? '+' : ''}{changePct.toFixed(2)}%)
              </span>
            </div>
            <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:9, color:'rgba(180,200,220,0.35)', marginTop:5 }}>
              {data?.live ? '● Canlı (Yahoo Finance)' : '○ Simüle (demo)'}
            </div>
          </div>
        </div>

        {/* Grafik */}
        <div style={{ marginTop:6 }}>
          <LMEChart prices={prices} positive={positive}/>
        </div>
        <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:8.5, color:'rgba(180,200,220,0.3)', marginTop:3, textAlign:'right' }}>
          Son 30 iş günü
        </div>
      </div>

      {/* İstatistikler */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6, marginBottom:10 }}>
        {[
          { label:'30G. Yüksek', val:`$${C(hi30,0)}`,  col:'#4ade80' },
          { label:'30G. Düşük',  val:`$${C(lo30,0)}`,  col:'#f87171' },
          { label:'30G. Ort.',   val:`$${C(avg30,0)}`,  col:'#c9a84c' },
        ].map(s => (
          <div key={s.label} style={{
            background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
            borderRadius:8, padding:'8px 10px', textAlign:'center',
          }}>
            <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:8, color:'rgba(180,200,220,0.4)', marginBottom:3, textTransform:'uppercase' }}>{s.label}</div>
            <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:13, fontWeight:700, color:s.col }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* TRY hesaplama */}
      <div style={{
        background:'rgba(255,255,255,0.03)', border:'1px solid rgba(201,168,76,0.15)',
        borderRadius:8, padding:'10px 12px', marginBottom:10,
      }}>
        <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:9.5, color:'rgba(201,168,76,0.6)', marginBottom:7, textTransform:'uppercase', letterSpacing:0.8 }}>
          Türk Lirası Karşılığı
        </div>
        {[
          { qty:'1 kg',   val: (current * USD_TRY / 1000).toFixed(1)    },
          { qty:'100 kg', val: (current * USD_TRY / 10).toFixed(0)       },
          { qty:'1 ton',  val: (current * USD_TRY).toFixed(0)            },
        ].map(r => (
          <div key={r.qty} style={{ display:'flex', justifyContent:'space-between', padding:'3px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, color:'rgba(180,200,220,0.55)' }}>{r.qty}</span>
            <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, fontWeight:600, color:'rgba(220,200,150,0.85)' }}>≈ {parseFloat(r.val).toLocaleString('tr-TR')} ₺</span>
          </div>
        ))}
        <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:8, color:'rgba(180,200,220,0.25)', marginTop:5 }}>
          *USD/TRY kur: ~{USD_TRY} (yaklaşık, bilgi amaçlı)
        </div>
      </div>

      {/* Piyasa notu */}
      <div style={{
        background:'rgba(59,130,246,0.06)', border:'1px solid rgba(59,130,246,0.2)',
        borderRadius:8, padding:'8px 10px',
      }}>
        <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:9, color:'rgba(147,197,253,0.7)', lineHeight:1.6 }}>
          📌 LME (London Metal Exchange) alüminyum fiyatları uluslararası hammadde maliyetini gösterir.
          Profil üretim fiyatları işçilik, enerji ve kaplama maliyetiyle birlikte belirlenir.
        </div>
      </div>
    </div>
  )
}

/* ── Ana bileşen ─────────────────────────────────────────── */
const QUICK_CHIPS = [
  { label:'Sürme Sistem', q:'Sürme sistem özellikleri ve fiyatları?' },
  { label:'Yalıtımlı',    q:'Isı yalıtımlı profil avantajları neler?' },
  { label:'Cam Seçim',    q:'Hangi cam seçenekleri var?' },
  { label:'Fiyat',        q:'Yaklaşık m² fiyatı nedir?' },
  { label:'Teklif',       q:'Nasıl teklif alabilirim?' },
  { label:'Garanti',      q:'Garanti kapsamı nedir?' },
]

const FAQ = [
  { q:'Sürme sistem fiyatları nedir?'       },
  { q:'Yalıtımlı profil avantajları?'       },
  { q:'Teslim ve montaj ne kadar sürer?'    },
  { q:'Hangi cam seçenekleri var?'          },
  { q:'Garanti kapsamı nedir?'              },
  { q:'Bakım nasıl yapılır?'               },
  { q:'Enerji tasarrufu ne kadar?'          },
  { q:'Renk ve kaplama seçenekleri?'        },
  { q:'Giydirme cephe çözümleri?'          },
  { q:'Ücretsiz teklif alabilir miyim?'     },
  { q:'Pergola sistemleri hakkında bilgi?'  },
  { q:'İletişim bilgileri?'               },
]

export default function AIAssistant() {
  const [open,      setOpen]      = useState(false)
  const [tab,       setTab]       = useState(0)
  const [msgs,      setMsgs]      = useState([{
    role:'bot', text:'Merhaba! Ben AluSight Teknik Danışmanı. Alüminyum sistemleri, teknik özellikler, fiyat ve teklif konularında size yardımcı olabilirim.', ts: Date.now(),
  }])
  const [input,     setInput]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [glassCtx,  setGlassCtx]  = useState(null)
  const [apiKey,    setApiKey]    = useState(getStoredApiKey)
  const [keyDraft,  setKeyDraft]  = useState('')
  const [showKey,   setShowKey]   = useState(false)
  const [unread,    setUnread]    = useState(0)

  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs, loading])
  useEffect(() => { if (open) setUnread(0) }, [open])

  const isGlass = t => GLASS_KW.some(k => t.toLowerCase().includes(k))

  const sendMsg = useCallback(async (text) => {
    if (!text.trim() || loading) return
    setInput(''); setGlassCtx(null)
    const userMsg = { role:'user', text: text.trim(), ts: Date.now() }
    setMsgs(prev => [...prev, userMsg])
    setLoading(true)

    const key = apiKey || getStoredApiKey()
    try {
      let reply
      if (key) {
        const hist = [...msgs, userMsg].slice(-12).filter(m => m.text)
        reply = await askGemini(hist, key)
      } else {
        await new Promise(r => setTimeout(r, 600 + Math.random() * 600))
        reply = localFallback(text)
      }
      setMsgs(prev => [...prev, { role:'bot', text: reply, ts: Date.now() }])
      if (!open) setUnread(n => n + 1)
    } catch (e) {
      setMsgs(prev => [...prev, { role:'bot', text:`⚠️ ${e.message.includes('API')||e.message.includes('key') ? 'API anahtarı geçersiz veya eksik.' : 'Bağlantı hatası.'} ${localFallback(text)}`, ts:Date.now() }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [apiKey, loading, msgs, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    if (isGlass(input) && !glassCtx) {
      setGlassCtx(input.trim())
      setMsgs(prev => [...prev,
        { role:'user', text: input.trim(), ts: Date.now() },
        { role:'bot', glassOpts: true, ts: Date.now() },
      ])
      setInput(''); return
    }
    sendMsg(input)
  }

  const saveKey = () => {
    const k = keyDraft.trim(); saveApiKey(k); setApiKey(k); setShowKey(false); setKeyDraft('')
  }

  const TAB_LABELS = ['Sohbet', 'Hızlı Cevaplar']

  return (
    <>
      <style>{`
        @keyframes oai      { 0%,80%,100%{transform:scale(0.55);opacity:0.4} 40%{transform:scale(1.1);opacity:1} }
        @keyframes oaiUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes oaiPulse { 0%{transform:scale(1);opacity:0.5} 100%{transform:scale(1.7);opacity:0} }
        @keyframes oaiBadge { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }

        /* ── İki Kanatlı Kapı Animasyonu ── */
        @keyframes doorLeft  {
          0%   { clip-path: inset(0 50% 0 0); opacity:0; transform: perspective(600px) rotateY(-8deg) translateX(-18px); }
          40%  { opacity:1; }
          100% { clip-path: inset(0 0%  0 0); opacity:1; transform: perspective(600px) rotateY(0deg)  translateX(0); }
        }
        @keyframes doorRight {
          0%   { clip-path: inset(0 0 0 50%); opacity:0; transform: perspective(600px) rotateY(8deg)  translateX(18px); }
          40%  { opacity:1; }
          100% { clip-path: inset(0 0 0 0%);  opacity:1; transform: perspective(600px) rotateY(0deg)  translateX(0); }
        }
        @keyframes doorGlow {
          0%   { opacity:0; }
          50%  { opacity:1; }
          100% { opacity:0; }
        }
        .door-panel {
          animation: doorLeft 0.42s cubic-bezier(0.22,1,0.36,1) forwards,
                     doorRight 0.42s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .door-left  { animation: doorLeft  0.42s cubic-bezier(0.22,1,0.36,1) forwards !important; }
        .door-right { animation: doorRight 0.42s cubic-bezier(0.22,1,0.36,1) forwards !important; }
        .door-seam  {
          position:absolute; top:0; left:50%; width:1px; height:100%;
          background:linear-gradient(to bottom,transparent,rgba(201,168,76,0.6),transparent);
          animation: doorGlow 0.45s ease-out forwards;
          z-index:2; pointer-events:none;
        }
      `}</style>

      {/* ── Launcher buton ─────────────────────────────────────────── */}
      <button
        onClick={() => { setOpen(o => !o); setTimeout(() => inputRef.current?.focus(), 280) }}
        aria-label="AluSight Teknik Danışman"
        style={{
          position:'fixed', bottom:100, right:32, zIndex:60,
          width:58, height:58, borderRadius:10, border:'none', cursor:'pointer',
          background:'linear-gradient(140deg,#0d1a2d,#060c18)',
          boxShadow: open
            ? '0 0 0 2px #c9a84c,0 8px 32px rgba(201,168,76,0.3)'
            : '0 0 0 1.5px rgba(201,168,76,0.5),0 6px 28px rgba(0,0,0,0.6)',
          display:'flex', alignItems:'center', justifyContent:'center',
          transition:'box-shadow .25s',
          overflow:'hidden',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.boxShadow = '0 0 0 2px rgba(201,168,76,.85),0 8px 32px rgba(201,168,76,.25)' }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(201,168,76,.5),0 6px 28px rgba(0,0,0,.6)' }}
      >
        <div style={{ position:'absolute', inset:-4, borderRadius:14, border:'1.5px solid rgba(201,168,76,.38)',
          animation: open ? 'none' : 'oaiPulse 2.4s ease-out infinite', pointerEvents:'none' }}/>
        {/* Sürme pencere ikonu — iki yana açılır */}
        <svg width="34" height="30" viewBox="0 0 34 30" fill="none">
          {/* Ray üst */}
          <line x1="1" y1="2" x2="33" y2="2" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Ray alt */}
          <line x1="1" y1="28" x2="33" y2="28" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Sol kanat — açıkta sola kayar */}
          <rect
            x={open ? 1 : 3}
            y="4" width="13" height="22" rx="1"
            fill={open ? 'rgba(201,168,76,0.06)' : 'none'}
            stroke="#c9a84c" strokeWidth="1.5"
            style={{ transition: 'x .3s ease' }}
          />
          <line
            x1={open ? 7.5 : 9.5} y1="4"
            x2={open ? 7.5 : 9.5} y2="26"
            stroke="rgba(201,168,76,0.3)" strokeWidth="1"
            style={{ transition: 'x1 .3s ease, x2 .3s ease' }}
          />
          {/* Sağ kanat — açıkta sağa kayar */}
          <rect
            x={open ? 20 : 18}
            y="4" width="13" height="22" rx="1"
            fill={open ? 'rgba(201,168,76,0.06)' : 'none'}
            stroke="#c9a84c" strokeWidth="1.5"
            style={{ transition: 'x .3s ease' }}
          />
          <line
            x1={open ? 26.5 : 24.5} y1="4"
            x2={open ? 26.5 : 24.5} y2="26"
            stroke="rgba(201,168,76,0.3)" strokeWidth="1"
            style={{ transition: 'x1 .3s ease, x2 .3s ease' }}
          />
          {/* Orta çizgi — kapalıyken iki kanat birleşik */}
          {!open && <line x1="16" y1="4" x2="16" y2="26" stroke="rgba(201,168,76,0.5)" strokeWidth="1.2"/>}
          {/* Ok işaretleri — kapalıysa içe bakan, açıksa dışa bakan */}
          {open ? (
            <>
              <polyline points="6,11 3,15 6,19" stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <polyline points="28,11 31,15 28,19" stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </>
          ) : (
            <>
              <polyline points="10,11 13,15 10,19" stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <polyline points="24,11 21,15 24,19" stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </>
          )}
        </svg>
        {unread > 0 && (
          <div style={{ position:'absolute', top:3, right:3, width:15, height:15, borderRadius:'50%',
            background:'#ef4444', border:'2px solid #060c18', display:'flex', alignItems:'center',
            justifyContent:'center', fontFamily:'Montserrat,sans-serif', fontSize:8, fontWeight:700, color:'#fff',
            animation:'oaiBadge 2s ease-in-out infinite' }}>{unread}</div>
        )}
        {!open && unread === 0 && (
          <div style={{ position:'absolute', top:4, right:4, width:9, height:9, borderRadius:'50%',
            background:'linear-gradient(135deg,#ffe090,#c9a84c)', border:'2px solid #060c18',
            animation:'oaiBadge 2s ease-in-out infinite' }}/>
        )}
      </button>

      {/* ── Chat paneli ────────────────────────────────────────────── */}
      {open && (
        <div style={{
          position:'fixed', bottom:172, right:32, zIndex:59,
          width:365, maxHeight:580,
          background:'rgba(6,10,20,0.97)',
          border:'1px solid rgba(201,168,76,0.25)',
          borderRadius:18,
          boxShadow:'0 28px 80px rgba(0,0,0,0.75),0 0 0 1px rgba(201,168,76,0.1)',
          display:'flex', flexDirection:'column',
          animation:'oaiUp 0.28s ease',
          backdropFilter:'blur(16px)',
          overflow:'hidden',
        }}>

          {/* Header */}
          <div style={{
            background:'linear-gradient(135deg,rgba(201,168,76,0.12),rgba(201,168,76,0.04))',
            borderBottom:'1px solid rgba(201,168,76,0.18)',
            padding:'12px 14px',
            display:'flex', alignItems:'center', gap:10,
          }}>
            <div style={{ width:36, height:36, borderRadius:9, background:'rgba(10,18,32,0.9)',
              border:'1.5px solid rgba(201,168,76,0.45)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="5" fill="none" stroke="#c9a84c" strokeWidth="1.8"/>
                <circle cx="16" cy="16" r="1.8" fill="#c9a84c"/>
                {[0,90,180,270].map((d,i)=>(
                  <line key={i} x1={16+Math.cos(d*Math.PI/180)*7.2} y1={16+Math.sin(d*Math.PI/180)*7.2}
                    x2={16+Math.cos(d*Math.PI/180)*12} y2={16+Math.sin(d*Math.PI/180)*12}
                    stroke="#c9a84c" strokeWidth="1.6" strokeLinecap="round"/>
                ))}
              </svg>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:13, fontWeight:700, color:'#c9a84c', letterSpacing:0.8 }}>AluSight Teknik Danışman</div>
              <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:9.5, color:'rgba(74,222,128,0.7)', marginTop:1 }}>● Alüminyum Uzmanı · Çevrimiçi</div>
            </div>
            <button onClick={() => setShowKey(true)} title="API Ayarları" style={{
              background:'none', border:'1px solid rgba(201,168,76,0.2)', borderRadius:7, padding:'5px 7px',
              cursor:'pointer', color:'rgba(201,168,76,0.6)', transition:'all .18s', display:'flex',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor='rgba(201,168,76,0.5)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='rgba(201,168,76,0.2)'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
              </svg>
            </button>
          </div>

          {/* Tab bar */}
          <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)', flexShrink:0 }}>
            {TAB_LABELS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)} style={{
                flex:1, padding:'8px 0',
                fontFamily:'Montserrat,sans-serif', fontSize:10.5, letterSpacing:0.4,
                color: tab===i ? '#c9a84c' : 'rgba(200,220,240,0.38)',
                background:'none', border:'none', cursor:'pointer',
                borderBottom: tab===i ? '2px solid #c9a84c' : '2px solid transparent',
                transition:'color .2s,border-color .2s',
              }}>
                {t}
              </button>
            ))}
          </div>

          {/* ── Tab 0: Sohbet ─────────────────────────────────────── */}
          {tab === 0 && (
            <>
              <div style={{ flex:1, overflowY:'auto', padding:'10px 12px',
                display:'flex', flexDirection:'column', gap:8,
                scrollbarWidth:'thin', scrollbarColor:'rgba(201,168,76,0.18) transparent' }}>

                {msgs.map((m,i) => (
                  <div key={i} style={{ display:'flex', justifyContent: m.role==='user'?'flex-end':'flex-start', animation:'oaiUp .22s ease' }}>
                    {m.role==='bot' && (
                      <div style={{ width:22, height:22, borderRadius:6, flexShrink:0, marginRight:7,
                        background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)',
                        display:'flex', alignItems:'center', justifyContent:'center', marginTop:2 }}>
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="2.5" fill="none" stroke="#c9a84c" strokeWidth="1.2"/>
                          <circle cx="8" cy="8" r="0.9" fill="#c9a84c"/>
                          {[0,90,180,270].map((d,j)=>(
                            <line key={j} x1={8+Math.cos(d*Math.PI/180)*3.7} y1={8+Math.sin(d*Math.PI/180)*3.7}
                              x2={8+Math.cos(d*Math.PI/180)*6} y2={8+Math.sin(d*Math.PI/180)*6}
                              stroke="#c9a84c" strokeWidth="1.1" strokeLinecap="round"/>
                          ))}
                        </svg>
                      </div>
                    )}

                    {m.glassOpts ? (
                      <div style={{ maxWidth:'88%', background:'rgba(201,168,76,0.06)',
                        border:'1px solid rgba(201,168,76,0.22)', borderRadius:'4px 12px 12px 12px', padding:'10px 12px' }}>
                        <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:11.5, color:'rgba(201,168,76,0.85)', marginBottom:8 }}>
                          Hangi cam sistemi hakkında bilgi almak istiyorsunuz?
                        </div>
                        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                          {GLASS_OPTS.map(opt => (
                            <button key={opt.id}
                              onClick={() => { setMsgs(prev=>prev.filter(x=>!x.glassOpts)); sendMsg(`${glassCtx} — özellikle ${opt.label} (${opt.detail}) hakkında`) }}
                              style={{
                                display:'flex', alignItems:'center', gap:8, padding:'7px 10px',
                                background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)',
                                borderRadius:7, cursor:'pointer', textAlign:'left', transition:'all .18s',
                              }}
                              onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.12)'; e.currentTarget.style.borderColor='rgba(201,168,76,0.35)'}}
                              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}}>
                              <span style={{ fontSize:13 }}>{opt.icon}</span>
                              <div>
                                <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:11.5, color:'rgba(210,230,250,0.88)', fontWeight:500 }}>{opt.label}</div>
                                <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:9.5, color:'rgba(180,200,220,0.4)' }}>{opt.detail}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{ maxWidth:'78%', padding:'8px 11px',
                        borderRadius: m.role==='user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
                        background: m.role==='user'
                          ? 'linear-gradient(135deg,rgba(201,168,76,0.22),rgba(201,168,76,0.1))'
                          : 'rgba(255,255,255,0.04)',
                        border:`1px solid ${m.role==='user'?'rgba(201,168,76,0.32)':'rgba(255,255,255,0.06)'}`,
                        color: m.role==='user' ? '#ffe090' : 'rgba(210,230,250,0.88)',
                        fontFamily:'Montserrat,sans-serif', fontSize:12.5, lineHeight:1.65, whiteSpace:'pre-wrap',
                      }}>{m.text}</div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div style={{ display:'flex', justifyContent:'flex-start' }}>
                    <div style={{ width:22, height:22, borderRadius:6, flexShrink:0, marginRight:7,
                      background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)',
                      display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="2.5" fill="none" stroke="#c9a84c" strokeWidth="1.2"/>
                        <circle cx="8" cy="8" r="0.9" fill="#c9a84c"/>
                      </svg>
                    </div>
                    <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)',
                      borderRadius:'4px 12px 12px 12px', padding:'10px 14px', display:'flex', gap:5, alignItems:'center' }}>
                      {[0,1,2].map(i=>(
                        <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'#c9a84c',
                          animation:`oai 1.3s ease-in-out ${i*.22}s infinite` }}/>
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef}/>
              </div>

              {/* Chips */}
              <div style={{ padding:'5px 10px', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', flexWrap:'wrap', gap:4 }}>
                {QUICK_CHIPS.map(c => (
                  <button key={c.label} onClick={() => sendMsg(c.q)} style={{
                    padding:'3px 9px', borderRadius:20,
                    border:'1px solid rgba(201,168,76,0.28)', background:'rgba(201,168,76,0.06)',
                    color:'rgba(201,168,76,0.8)', fontFamily:'Montserrat,sans-serif', fontSize:10,
                    cursor:'pointer', transition:'background .18s',
                  }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(201,168,76,0.16)'}
                    onMouseLeave={e=>e.currentTarget.style.background='rgba(201,168,76,0.06)'}>
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div style={{ display:'flex', gap:7, padding:'7px 12px 12px' }}>
                <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); handleSubmit(e) } }}
                  placeholder="Sorunuzu yazın..."
                  style={{ flex:1, padding:'9px 12px', borderRadius:10,
                    border:'1px solid rgba(201,168,76,0.25)', background:'rgba(255,255,255,0.04)',
                    color:'#e8f4ff', fontFamily:'Montserrat,sans-serif', fontSize:12.5, outline:'none' }}
                  onFocus={e=>e.target.style.borderColor='rgba(201,168,76,0.55)'}
                  onBlur={e=>e.target.style.borderColor='rgba(201,168,76,0.25)'}
                />
                <button onClick={handleSubmit} disabled={!input.trim()||loading} style={{
                  width:38, height:38, borderRadius:10, border:'1px solid rgba(201,168,76,0.3)', flexShrink:0,
                  background: input.trim()&&!loading ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.03)',
                  cursor: input.trim()&&!loading ? 'pointer' : 'default',
                  display:'flex', alignItems:'center', justifyContent:'center', transition:'background .18s',
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* ── Tab 1: Hızlı Cevaplar ─────────────────────────────── */}
          {tab === 1 && (
            <div style={{ flex:1, overflowY:'auto', padding:12, scrollbarWidth:'thin', scrollbarColor:'rgba(201,168,76,0.18) transparent' }}>
              <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:9.5, color:'rgba(201,168,76,0.55)', letterSpacing:1, marginBottom:10, textTransform:'uppercase' }}>
                Sık Sorulan Sorular
              </div>
              {FAQ.map(item => (
                <button key={item.q} onClick={() => { setTab(0); setTimeout(() => sendMsg(item.q), 80) }} style={{
                  width:'100%', textAlign:'left', padding:'9px 12px', marginBottom:5,
                  background:'rgba(255,255,255,0.03)', border:'1px solid rgba(201,168,76,0.18)',
                  borderRadius:8, cursor:'pointer',
                  fontFamily:'Montserrat,sans-serif', fontSize:12, color:'rgba(210,230,250,0.8)',
                  transition:'background .18s,border-color .18s', display:'flex', alignItems:'center', gap:8,
                }}
                  onMouseEnter={e=>{ e.currentTarget.style.background='rgba(201,168,76,0.1)'; e.currentTarget.style.borderColor='rgba(201,168,76,0.35)' }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor='rgba(201,168,76,0.18)' }}>
                  <span style={{ color:'rgba(201,168,76,0.55)', fontSize:9 }}>▶</span>
                  {item.q}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── API Key Modal ──────────────────────────────────────────── */}
      {showKey && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:70, padding:16 }}>
          <div style={{ background:'#0d1117', border:'1px solid rgba(255,255,255,0.15)', borderRadius:18,
            padding:28, width:'100%', maxWidth:360, boxShadow:'0 40px 100px rgba(0,0,0,0.7)' }}>
            <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:15, fontWeight:700, color:'#fff', marginBottom:4 }}>Gemini API Anahtarı</div>
            <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:18, lineHeight:1.6 }}>
              Ücretsiz alın:{' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color:'#c9a84c' }}>aistudio.google.com</a>
            </div>
            <input type="text" value={keyDraft} onChange={e=>setKeyDraft(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&saveKey()}
              placeholder="AIzaSy..." autoFocus
              style={{ width:'100%', background:'rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.2)',
                borderRadius:12, padding:'12px 14px', fontSize:13, color:'#fff', outline:'none',
                fontFamily:'monospace', marginBottom:14, boxSizing:'border-box' }}/>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={saveKey} style={{ flex:1, padding:10, borderRadius:12,
                background:'#c9a84c', color:'#0a0f28', fontFamily:'Montserrat,sans-serif',
                fontWeight:700, fontSize:13, border:'none', cursor:'pointer' }}>Kaydet</button>
              <button onClick={()=>setShowKey(false)} style={{ padding:'10px 16px', borderRadius:12,
                background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)',
                color:'rgba(255,255,255,0.6)', fontFamily:'Montserrat,sans-serif', fontSize:13, cursor:'pointer' }}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
