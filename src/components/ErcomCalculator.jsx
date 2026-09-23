import { useState, useMemo } from 'react'

/* ══════════════════════════════════════════════════
   ERCOM PVC HESAPLAMA VERİ TABANI
   (Pencere sektörü standart değerleri — EN 14351-1)
══════════════════════════════════════════════════ */
const PRODUCT_TYPES = [
  {
    id: 'casement',  icon: '🪟',
    name: 'Kanatlı Pencere',     short: 'KP',
    desc: 'Tek/çift kanatlı, içe açılır veya sabit',
    minW: 0.40, maxW: 2.40, minH: 0.40, maxH: 2.40,
    frameFrac: 0.25,
  },
  {
    id: 'sliding',   icon: '↔️',
    name: 'Sürme Pencere',       short: 'SP',
    desc: 'Yatay sürgülü, 2 veya 3 kanat',
    minW: 1.00, maxW: 4.00, minH: 0.40, maxH: 2.20,
    frameFrac: 0.30,
  },
  {
    id: 'door',      icon: '🚪',
    name: 'Balkon / Giriş Kapısı', short: 'BK',
    desc: 'Tek ya da çift kanatlı kapı',
    minW: 0.70, maxW: 2.40, minH: 1.80, maxH: 2.60,
    frameFrac: 0.22,
  },
  {
    id: 'tilt',      icon: '🔄',
    name: 'Devrilir-Döner (TSS)',  short: 'DD',
    desc: 'Hem devrilir hem döner mekanizma',
    minW: 0.40, maxW: 1.80, minH: 0.60, maxH: 1.80,
    frameFrac: 0.27,
  },
  {
    id: 'skylight',  icon: '🌤',
    name: 'Çatı Penceresi',       short: 'CP',
    desc: 'Eğimli çatı uygulamaları',
    minW: 0.55, maxW: 1.40, minH: 0.70, maxH: 1.60,
    frameFrac: 0.32,
  },
]

const PROFILE_SYSTEMS = [
  {
    id: 'p5',   name: '5 Kameralı PVC',      chambers: 5,
    Uf: 1.30, wallThick: 3.0, outerW: 70,
    desc: 'Standart ısı yalıtımı, ekonomik seçenek',
    color: '#60a5fa',
  },
  {
    id: 'p6',   name: '6 Kameralı PVC',      chambers: 6,
    Uf: 1.10, wallThick: 3.0, outerW: 76,
    desc: 'Yüksek ısı yalıtımı, bölgesel tercih',
    color: '#a78bfa',
  },
  {
    id: 'p7',   name: '7 Kameralı PVC Pasif', chambers: 7,
    Uf: 0.85, wallThick: 3.5, outerW: 82,
    desc: 'Pasif ev standardı, maksimum yalıtım',
    color: '#06b6d4',
  },
  {
    id: 'psl',  name: 'Sürme Sistemi PVC',   chambers: 4,
    Uf: 1.50, wallThick: 2.8, outerW: 62,
    desc: 'Yatay sürme profili — düşük eşik',
    color: '#22c55e',
  },
]

const GLASS_OPTIONS = [
  {
    id: 'sg4',   name: 'Tekli Cam 4 mm',
    Ug: 5.7, g: 0.87, thick: 4,
    desc: 'Sadece ılıman iklimlere uygun',
    color: '#ef4444',
  },
  {
    id: 'dg16',  name: '4+16+4 (Hava Dolgulu)',
    Ug: 2.8, g: 0.76, thick: 24,
    desc: 'Standart çift cam — hava dolgulu',
    color: '#f59e0b',
  },
  {
    id: 'dgle',  name: '4+16Ar+4 Low-e',
    Ug: 1.1, g: 0.62, thick: 24,
    desc: 'Argon + Low-e kaplama, yüksek verim',
    color: '#22c55e',
  },
  {
    id: 'tg',    name: '4+14Ar+4+14Ar+4 Üçlü',
    Ug: 0.65, g: 0.50, thick: 40,
    desc: 'Triple cam — pasif ev sertifikasyonu',
    color: '#06b6d4',
  },
  {
    id: 'safe',  name: '44.2 Güvenlik + 16Ar + 33.2 Low-e',
    Ug: 1.0, g: 0.58, thick: 42,
    desc: 'Laminat güvenlik + düşük geçirgenlik',
    color: '#a78bfa',
  },
]

const COLORS = [
  { id: 'white',   name: 'Beyaz RAL 9016',      hex: '#f5f5f0' },
  { id: 'cream',   name: 'Krem RAL 9001',        hex: '#ede8d0' },
  { id: 'grey',    name: 'Antrasit RAL 7016',    hex: '#383e42' },
  { id: 'brown',   name: 'Kahve RAL 8014',       hex: '#52361b' },
  { id: 'oak',     name: 'Golden Oak (Folyo)',   hex: '#c8860a' },
  { id: 'dark',    name: 'Koyu Meşe (Folyo)',    hex: '#5c3d1e' },
  { id: 'custom',  name: 'Özel RAL',             hex: '#888888' },
]

const OPENING_TYPES = [
  { id: 'fixed',       name: 'Sabit',          icon: '■' },
  { id: 'inward',      name: 'İçe Açılır',     icon: '◁' },
  { id: 'tilt_turn',   name: 'Devrilir-Döner', icon: '↺' },
  { id: 'outward',     name: 'Dışa Açılır',    icon: '▷' },
  { id: 'slide_l',     name: 'Sol Sürme',       icon: '⟵' },
  { id: 'slide_r',     name: 'Sağ Sürme',       icon: '⟶' },
]

const ENERGY_CLASSES = [
  { cls: 'A+', max: 0.80, color: '#06b6d4' },
  { cls: 'A',  max: 1.00, color: '#22c55e' },
  { cls: 'B',  max: 1.20, color: '#84cc16' },
  { cls: 'C',  max: 1.60, color: '#eab308' },
  { cls: 'D',  max: 2.00, color: '#f97316' },
  { cls: 'E',  max: 3.00, color: '#ef4444' },
  { cls: 'F',  max: Infinity, color: '#9f1239' },
]

/* ══════════════════════════════════════════════════
   HESAPLAMA MOTORU  (EN 14351-1 / EN ISO 10077-1)
══════════════════════════════════════════════════ */
function calcPVC({ product, profileSys, glass, color, openType, W, H, qty }) {
  const totalArea  = W * H
  const frameArea  = totalArea * product.frameFrac
  const glassArea  = totalArea - frameArea
  const perimeter  = 2 * (W + H)
  const psi        = 0.06

  const Uw = (glassArea * glass.Ug + frameArea * profileSys.Uf + perimeter * psi) / totalArea

  const ec = ENERGY_CLASSES.find(e => Uw <= e.max) || ENERGY_CLASSES.at(-1)

  const PVC_DENSITY  = 1.4
  const glassWeight  = glassArea * glass.thick * 0.0025
  const frameWeight  = frameArea * profileSys.wallThick * 0.001 * PVC_DENSITY * 3.0
  const totalWeight  = (glassWeight + frameWeight) * qty

  const profileLen   = perimeter * 2 * qty
  const glassQty     = glassArea * qty

  const annualHeatLoss = Uw * totalArea * 25 * 200 * qty

  return {
    totalArea, frameArea, glassArea, perimeter,
    Uw, ec, totalWeight, profileLen, glassQty,
    annualHeatLoss, glassWeight, frameWeight,
  }
}

function generateRecommendations({ product, profileSys, glass, results }) {
  const recs = []

  if (results.ec.cls === 'A+' || results.ec.cls === 'A')
    recs.push({ type: 'success', icon: '✅', text: `Uw = ${results.Uw.toFixed(2)} W/m²K — Mükemmel enerji performansı. TS 825 bölge 4 gereksinimlerini karşılıyor.` })
  else if (results.ec.cls === 'D' || results.ec.cls === 'E' || results.ec.cls === 'F')
    recs.push({ type: 'error', icon: '🔴', text: `Uw = ${results.Uw.toFixed(2)} W/m²K — TS 825 ısı yitimi limiti aşılıyor. Daha yüksek kameralı profil ve Low-e cam önerilir.` })
  else
    recs.push({ type: 'info', icon: '🔵', text: `Uw = ${results.Uw.toFixed(2)} W/m²K — ${results.ec.cls} sınıfı. Bir üst sınıf için cam veya profil yükseltmesi yapılabilir.` })

  if (glass.id === 'sg4' || glass.id === 'dg16')
    recs.push({ type: 'suggestion', icon: '💡', text: `Low-e + Argon cama (Ug 1.1) geçiş ile Uw'da yaklaşık ${((glass.Ug - 1.1) * 0.7).toFixed(2)} W/m²K kazanım sağlanır.` })

  if (profileSys.chambers < 6)
    recs.push({ type: 'suggestion', icon: '🔧', text: `6 kameralı profile geçiş: Uf 1.30 → 1.10 W/m²K — yıllık ısıtma maliyetinde yaklaşık %8–12 azalma.` })

  recs.push({ type: 'data', icon: '📊', text: `Yıllık tahmini ısı kaybı: ${(results.annualHeatLoss / 1000).toFixed(0)} kWh — ΔT=25°C, 200 gün ısıtma sezonu varsayımı.` })

  recs.push({ type: 'info', icon: '⚖️', text: `Toplam ağırlık: ${results.totalWeight.toFixed(1)} kg — profil: ${results.frameWeight.toFixed(1)} kg + cam: ${results.glassWeight.toFixed(1)} kg.` })

  return recs
}

/* ══════════════════════════════════════════════════
   STEP INDICATOR
══════════════════════════════════════════════════ */
const STEPS = ['Ürün', 'Profil', 'Cam', 'Renk & Açılış', 'Boyut', 'Sonuç']

function StepBar({ step }) {
  return (
    <div className="flex items-center justify-center flex-wrap gap-x-0 gap-y-2 mb-10">
      {STEPS.map((s, i) => (
        <div key={i} className="flex items-center">
          <div className={`flex flex-col items-center ${i <= step ? '' : 'opacity-40'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
              i < step  ? 'bg-green-500 border-green-500 text-white' :
              i === step ? 'bg-transparent border-green-400 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.45)]' :
                          'bg-transparent border-white/20 text-white/30'
            }`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-[9px] mt-1 font-display tracking-wider ${i === step ? 'text-green-400' : 'text-white/35'}`}>{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-8 h-px mx-0.5 mb-5 transition-all duration-500 ${i < step ? 'bg-green-500' : 'bg-white/12'}`}/>
          )}
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
export default function ErcomCalculator() {
  const [step,      setStep]      = useState(0)
  const [productId, setProductId] = useState(null)
  const [profileId, setProfileId] = useState(null)
  const [glassId,   setGlassId]   = useState(null)
  const [colorId,   setColorId]   = useState('white')
  const [openType,  setOpenType]  = useState('inward')
  const [W,         setW]         = useState(1.20)
  const [H,         setH]         = useState(1.40)
  const [qty,       setQty]       = useState(1)
  const [activeTab, setActiveTab] = useState('summary')

  const product   = PRODUCT_TYPES.find(p => p.id === productId)
  const profileSys= PROFILE_SYSTEMS.find(p => p.id === profileId)
  const glass     = GLASS_OPTIONS.find(g => g.id === glassId)
  const color     = COLORS.find(c => c.id === colorId)

  const Wc = product ? Math.max(product.minW, Math.min(product.maxW, W)) : W
  const Hc = product ? Math.max(product.minH, Math.min(product.maxH, H)) : H

  const results = useMemo(() => {
    if (!product || !profileSys || !glass) return null
    return calcPVC({ product, profileSys, glass, color, openType, W: Wc, H: Hc, qty })
  }, [product, profileSys, glass, color, openType, Wc, Hc, qty])

  const recommendations = useMemo(() => {
    if (!results || !product || !profileSys || !glass) return []
    return generateRecommendations({ product, profileSys, glass, results })
  }, [results, product, profileSys, glass])

  const canNext = () => {
    if (step === 0) return !!productId
    if (step === 1) return !!profileId
    if (step === 2) return !!glassId
    if (step === 3) return true
    if (step === 4) return Wc > 0 && Hc > 0
    return false
  }

  const accentColor = '#22c55e'

  return (
    <section id="ercom-hesap" className="py-28 relative">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-green-400 text-xs font-display tracking-[0.3em] uppercase mb-3">Hesaplamalar — Ercom Modülü</p>
          <h2 className="text-4xl font-display font-700 text-white mb-4">
            PVC Pencere & Kapı Hesaplama
          </h2>
          <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
            Adım adım rehberli wizard — boyut, profil, cam, enerji sınıfı ve ağırlık hesabı
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {['EN 14351-1', 'EN ISO 10077-1', 'TS 825', 'TS EN 12207'].map(s => (
              <span key={s} className="text-[10px] px-2 py-0.5 rounded border border-white/10 text-white/30 font-mono">{s}</span>
            ))}
          </div>
        </div>

        <StepBar step={step} />

        {/* ── STEP 0 — Ürün Tipi ── */}
        {step === 0 && (
          <div>
            <h3 className="text-center text-white/55 text-sm mb-8 font-display tracking-wide">Hesaplamak istediğiniz ürün tipini seçin</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRODUCT_TYPES.map(p => (
                <button key={p.id} onClick={() => setProductId(p.id)}
                  className={`p-5 text-left border-2 transition-all duration-300 rounded group ${
                    productId === p.id
                      ? 'border-green-400 bg-green-500/10 shadow-[0_0_24px_rgba(34,197,94,0.2)]'
                      : 'border-white/10 bg-white/3 hover:border-white/25'
                  }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{p.icon}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/8 text-white/50">{p.short}</span>
                    {productId === p.id && (
                      <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</span>
                    )}
                  </div>
                  <div className="text-white font-600 text-sm mb-1">{p.name}</div>
                  <div className="text-white/40 text-xs leading-relaxed mb-3">{p.desc}</div>
                  <div className="text-xs font-mono text-white/30">
                    {p.minW}–{p.maxW}m × {p.minH}–{p.maxH}m
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 1 — Profil Sistemi ── */}
        {step === 1 && (
          <div>
            <h3 className="text-center text-white/55 text-sm mb-8 font-display tracking-wide">PVC profil sistemini seçin</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {PROFILE_SYSTEMS.map(ps => (
                <button key={ps.id} onClick={() => setProfileId(ps.id)}
                  className={`p-5 text-left border-2 transition-all duration-300 rounded ${
                    profileId === ps.id
                      ? 'border-green-400 bg-green-500/10'
                      : 'border-white/10 bg-white/3 hover:border-white/25'
                  }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ background: ps.color + '22', color: ps.color, border: `1px solid ${ps.color}55` }}>
                      {ps.chambers} Kamera
                    </span>
                    {profileId === ps.id && <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</span>}
                  </div>
                  <div className="text-white font-600 text-sm mb-1">{ps.name}</div>
                  <div className="text-white/40 text-xs leading-relaxed mb-4">{ps.desc}</div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="bg-white/5 rounded p-1.5 text-center">
                      <div className="text-white/35 text-[9px]">Uf</div>
                      <div style={{ color: ps.color }} className="font-bold">{ps.Uf}</div>
                    </div>
                    <div className="bg-white/5 rounded p-1.5 text-center">
                      <div className="text-white/35 text-[9px]">Et</div>
                      <div className="text-white/60 font-bold">{ps.wallThick}</div>
                    </div>
                    <div className="bg-white/5 rounded p-1.5 text-center">
                      <div className="text-white/35 text-[9px]">D (mm)</div>
                      <div className="text-white/60 font-bold">{ps.outerW}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2 — Cam ── */}
        {step === 2 && (
          <div>
            <h3 className="text-center text-white/55 text-sm mb-8 font-display tracking-wide">Cam konfigürasyonunu seçin</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {GLASS_OPTIONS.map(g => (
                <button key={g.id} onClick={() => setGlassId(g.id)}
                  className={`p-5 text-left border-2 transition-all duration-300 rounded ${
                    glassId === g.id
                      ? 'border-green-400 bg-green-500/10'
                      : 'border-white/10 bg-white/3 hover:border-white/25'
                  }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ background: g.color }}/>
                      <span className="text-white font-600 text-sm">{g.name}</span>
                    </div>
                    {glassId === g.id && <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</span>}
                  </div>
                  <p className="text-white/40 text-xs mb-4">{g.desc}</p>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="bg-white/5 rounded p-1.5 text-center">
                      <div className="text-white/35 text-[9px]">Ug</div>
                      <div style={{ color: g.color }} className="font-bold">{g.Ug}</div>
                    </div>
                    <div className="bg-white/5 rounded p-1.5 text-center">
                      <div className="text-white/35 text-[9px]">g faktör</div>
                      <div className="text-amber-400 font-bold">{g.g}</div>
                    </div>
                    <div className="bg-white/5 rounded p-1.5 text-center">
                      <div className="text-white/35 text-[9px]">Kalınlık</div>
                      <div className="text-white/60 font-bold">{g.thick}mm</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3 — Renk & Açılış Tipi ── */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <h3 className="text-center text-white/55 text-sm mb-8 font-display tracking-wide">Renk ve açılış tipini belirleyin</h3>

            <div className="mb-8">
              <label className="block text-white/50 text-xs font-display tracking-wider mb-4">Profil Rengi</label>
              <div className="grid grid-cols-4 gap-3">
                {COLORS.map(c => (
                  <button key={c.id} onClick={() => setColorId(c.id)}
                    className={`p-3 border-2 rounded transition-all duration-200 text-center ${
                      colorId === c.id ? 'border-green-400' : 'border-white/10 hover:border-white/25'
                    }`}>
                    <div className="w-8 h-8 rounded-full mx-auto mb-2 border border-white/20"
                      style={{ background: c.hex }}/>
                    <div className="text-[10px] text-white/50 leading-tight">{c.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white/50 text-xs font-display tracking-wider mb-4">Açılış Tipi</label>
              <div className="grid grid-cols-3 gap-3">
                {OPENING_TYPES.map(ot => (
                  <button key={ot.id} onClick={() => setOpenType(ot.id)}
                    className={`p-4 border-2 rounded flex flex-col items-center gap-2 transition-all duration-200 ${
                      openType === ot.id
                        ? 'border-green-400 bg-green-500/10 text-green-400'
                        : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/60'
                    }`}>
                    <span className="text-2xl">{ot.icon}</span>
                    <span className="text-xs font-display">{ot.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4 — Boyutlar & Adet ── */}
        {step === 4 && (
          <div className="max-w-lg mx-auto">
            <h3 className="text-center text-white/55 text-sm mb-8 font-display tracking-wide">Boyutları ve adedi girin</h3>

            {product && (
              <div className="bg-green-500/8 border border-green-500/20 rounded-lg p-3 mb-6 text-xs text-green-400/80 font-mono text-center">
                {product.name} için izin verilen ölçü: {product.minW}–{product.maxW}m × {product.minH}–{product.maxH}m
              </div>
            )}

            <div className="space-y-6">
              {[
                { label: 'Genişlik (m)', val: W, set: setW, min: product?.minW ?? 0.4, max: product?.maxW ?? 4, step: 0.05, color: '#c9a84c' },
                { label: 'Yükseklik (m)', val: H, set: setH, min: product?.minH ?? 0.4, max: product?.maxH ?? 4, step: 0.05, color: '#c9a84c' },
              ].map(({ label, val, set, min, max, step: s, color }) => (
                <div key={label}>
                  <div className="flex justify-between mb-2">
                    <label className="text-white/70 text-sm font-display">{label}</label>
                    <span className="font-mono font-bold" style={{ color }}>{val.toFixed(2)} m</span>
                  </div>
                  <input type="range" min={min} max={max} step={s} value={val}
                    onChange={e => set(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right, ${color} ${((val - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 0)` }}/>
                  <div className="flex justify-between text-xs text-white/20 mt-1">
                    <span>{min}m</span><span>{max}m</span>
                  </div>
                </div>
              ))}

              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-white/70 text-sm font-display">Adet</label>
                  <span className="text-green-400 font-mono font-bold">{qty}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded border border-white/20 text-white/60 hover:bg-white/8 flex items-center justify-center text-lg">−</button>
                  <div className="flex-1 h-2 rounded-full bg-white/8 relative overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full transition-all duration-200"
                      style={{ width: `${Math.min(100, (qty / 20) * 100)}%` }}/>
                  </div>
                  <button onClick={() => setQty(q => Math.min(100, q + 1))}
                    className="w-10 h-10 rounded border border-white/20 text-white/60 hover:bg-white/8 flex items-center justify-center text-lg">+</button>
                </div>
              </div>

              <div className="bg-white/4 border border-white/10 rounded-lg p-4 grid grid-cols-3 gap-3 text-center text-xs font-mono">
                <div>
                  <div className="text-white/35 mb-1">Tek Alan</div>
                  <div className="text-white font-bold">{(Wc * Hc).toFixed(3)} m²</div>
                </div>
                <div>
                  <div className="text-white/35 mb-1">Adet</div>
                  <div className="text-green-400 font-bold">{qty}</div>
                </div>
                <div>
                  <div className="text-white/35 mb-1">Toplam</div>
                  <div className="text-white font-bold">{(Wc * Hc * qty).toFixed(2)} m²</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5 — Sonuçlar ── */}
        {step === 5 && results && (
          <div>
            {/* Tab bar */}
            <div className="flex justify-center gap-2 mb-8">
              {[
                { id: 'summary',  label: 'Özet' },
                { id: 'detail',   label: 'Detay' },
                { id: 'ai',       label: 'AluSight Öneri' },
                { id: 'report',   label: 'Rapor / Teklif' },
              ].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`px-5 py-2 text-sm font-display tracking-wide border transition-all duration-200 rounded-sm ${
                    activeTab === t.id
                      ? 'border-green-400 bg-green-500/15 text-green-400'
                      : 'border-white/15 text-white/50 hover:text-white'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* SUMMARY */}
            {activeTab === 'summary' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Energy class */}
                <div className="bg-white/4 border border-white/10 rounded-lg p-6 flex flex-col items-center justify-center">
                  <div className="text-white/35 text-xs font-display tracking-widest mb-4">ENERJİ SINIFI</div>
                  <div className="w-24 h-24 rounded-full flex items-center justify-center border-4 mb-3"
                    style={{ borderColor: results.ec.color, boxShadow: `0 0 28px ${results.ec.color}55` }}>
                    <div className="text-3xl font-black" style={{ color: results.ec.color }}>{results.ec.cls}</div>
                  </div>
                  <div className="text-2xl font-mono font-black text-white">{results.Uw.toFixed(3)}</div>
                  <div className="text-white/35 text-xs">W/m²K</div>
                </div>

                {/* Key values */}
                <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Uw',          val: results.Uw.toFixed(3),          unit: 'W/m²K', color: results.ec.color },
                    { label: 'Cam Alanı',   val: results.glassArea.toFixed(3),   unit: 'm²',    color: '#60a5fa' },
                    { label: 'Çerçeve Alan',val: results.frameArea.toFixed(3),   unit: 'm²',    color: '#a78bfa' },
                    { label: 'Çevre',       val: results.perimeter.toFixed(2),   unit: 'm',     color: '#c9a84c' },
                    { label: 'Ağırlık',     val: results.totalWeight.toFixed(1), unit: 'kg',    color: '#f87171' },
                    { label: 'Toplam Alan', val: (results.totalArea * qty).toFixed(3), unit: 'm²', color: '#22c55e' },
                  ].map(m => (
                    <div key={m.label} className="bg-white/4 border border-white/8 rounded-lg p-3">
                      <div className="text-white/30 text-[10px] font-mono mb-1">{m.label}</div>
                      <div className="font-mono font-bold" style={{ color: m.color }}>
                        {m.val} <span className="text-xs font-normal opacity-60">{m.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Config recap */}
                <div className="lg:col-span-3 bg-white/3 border border-white/8 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  {[
                    { label: 'Ürün',   val: product?.name },
                    { label: 'Profil', val: profileSys?.name },
                    { label: 'Cam',    val: glass?.name },
                    { label: 'Renk',   val: color?.name },
                  ].map(r => (
                    <div key={r.label}>
                      <div className="text-white/30 mb-1">{r.label}</div>
                      <div className="text-white/70">{r.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DETAIL */}
            {activeTab === 'detail' && (
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="bg-white/4 border border-white/10 rounded-lg p-5 font-mono text-xs">
                  <div className="text-white/40 mb-3 font-display text-sm">Alan Dağılımı</div>
                  <div className="space-y-2">
                    {[
                      { label: 'Tek pencere alanı',    val: `${results.totalArea.toFixed(4)} m²` },
                      { label: '  ↳ Cam alanı (70%)',  val: `${results.glassArea.toFixed(4)} m²` },
                      { label: '  ↳ Çerçeve alanı',    val: `${results.frameArea.toFixed(4)} m²` },
                      { label: 'Toplam alan (×' + qty + ')',val: `${(results.totalArea * qty).toFixed(3)} m²` },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-white/50">{r.label}</span>
                        <span className="text-white">{r.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/4 border border-white/10 rounded-lg p-5 font-mono text-xs">
                  <div className="text-white/40 mb-3 font-display text-sm">Uw Hesap Formülü (EN ISO 10077-1)</div>
                  <div className="bg-black/30 rounded p-3 text-green-300 text-[11px] leading-loose">
                    Uw = (Ag × Ug + Af × Uf + Σlg × ψ) / (Ag + Af)<br/>
                    Uw = ({results.glassArea.toFixed(3)} × {glass?.Ug} + {results.frameArea.toFixed(3)} × {profileSys?.Uf} + {results.perimeter.toFixed(2)} × 0.06) / {results.totalArea.toFixed(3)}<br/>
                    <span className="text-white font-bold">Uw = {results.Uw.toFixed(4)} W/m²K</span>
                  </div>
                </div>

                <div className="bg-white/4 border border-white/10 rounded-lg p-5 font-mono text-xs">
                  <div className="text-white/40 mb-3 font-display text-sm">Malzeme Bilgisi</div>
                  <div className="space-y-2">
                    {[
                      { label: 'Profil uzunluğu', val: `${results.profileLen.toFixed(1)} m lineer` },
                      { label: 'Cam miktarı',     val: `${results.glassQty.toFixed(3)} m²` },
                      { label: 'Ağırlık (cam)',   val: `${results.glassWeight.toFixed(2)} kg` },
                      { label: 'Ağırlık (profil)',val: `${results.frameWeight.toFixed(2)} kg` },
                      { label: 'Toplam ağırlık',  val: `${results.totalWeight.toFixed(1)} kg` },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-white/50">{r.label}</span>
                        <span className="text-white">{r.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* AI ÖNERI */}
            {activeTab === 'ai' && (
              <div className="max-w-2xl mx-auto space-y-3">
                <div className="text-center text-white/35 text-xs mb-6 font-display">
                  AluSight destekli performans & optimizasyon analizi
                </div>
                {recommendations.map((rec, i) => (
                  <div key={i} className={`flex gap-4 p-4 rounded-lg border ${
                    rec.type === 'error'      ? 'bg-red-500/8 border-red-500/25' :
                    rec.type === 'success'    ? 'bg-green-500/8 border-green-500/25' :
                    rec.type === 'suggestion' ? 'bg-gold-500/8 border-gold-500/25' :
                                               'bg-blue-500/8 border-blue-500/25'
                  }`}>
                    <span className="text-2xl flex-shrink-0">{rec.icon}</span>
                    <p className="text-white/75 text-sm leading-relaxed">{rec.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* RAPOR / TEKLİF */}
            {activeTab === 'report' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white/4 border border-white/10 rounded-lg p-7 space-y-5 font-mono text-xs">
                  <div className="border-b border-white/15 pb-4">
                    <div className="text-green-400 font-bold text-base">AluSight — PVC Hesaplama Raporu</div>
                    <div className="text-white/35 mt-1">Ercom Modülü · {new Date().toLocaleDateString('tr-TR')}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <div className="text-white/35 uppercase tracking-wider mb-2">Ürün</div>
                      <div className="text-white">{product?.name}</div>
                      <div className="text-white/40">{product?.short} — {openType}</div>
                    </div>
                    <div>
                      <div className="text-white/35 uppercase tracking-wider mb-2">Profil</div>
                      <div className="text-white">{profileSys?.name}</div>
                      <div className="text-white/40">Uf = {profileSys?.Uf} W/m²K</div>
                    </div>
                    <div>
                      <div className="text-white/35 uppercase tracking-wider mb-2">Cam</div>
                      <div className="text-white">{glass?.name}</div>
                      <div className="text-white/40">Ug = {glass?.Ug} W/m²K</div>
                    </div>
                    <div>
                      <div className="text-white/35 uppercase tracking-wider mb-2">Renk</div>
                      <div className="text-white">{color?.name}</div>
                      <div className="text-white/40">{Wc.toFixed(2)} × {Hc.toFixed(2)} m · {qty} adet</div>
                    </div>
                  </div>
                  <div className="border-t border-white/15 pt-4 grid grid-cols-3 gap-3">
                    {[
                      { label: 'Uw', val: results.Uw.toFixed(3) + ' W/m²K', color: results.ec.color },
                      { label: 'Sınıf', val: results.ec.cls, color: results.ec.color },
                      { label: 'Toplam Alan', val: (results.totalArea * qty).toFixed(2) + ' m²', color: '#22c55e' },
                      { label: 'Ağırlık', val: results.totalWeight.toFixed(1) + ' kg', color: '#f87171' },
                      { label: 'Profil', val: results.profileLen.toFixed(1) + ' m', color: '#a78bfa' },
                      { label: 'Cam', val: results.glassQty.toFixed(2) + ' m²', color: '#60a5fa' },
                    ].map(m => (
                      <div key={m.label} className="bg-white/4 rounded p-2 text-center">
                        <div className="text-white/30 text-[9px] mb-0.5">{m.label}</div>
                        <div className="font-bold text-sm" style={{ color: m.color }}>{m.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 mt-4 justify-center">
                  <button onClick={() => window.print()}
                    className="px-6 py-2.5 border border-green-500/50 text-green-400 text-sm font-display hover:bg-green-500/10 transition-colors rounded">
                    Yazdır / PDF
                  </button>
                  <button onClick={() => { setStep(0); setProductId(null); setProfileId(null); setGlassId(null) }}
                    className="px-6 py-2.5 border border-white/20 text-white/55 text-sm font-display hover:bg-white/5 transition-colors rounded">
                    Yeni Hesap
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        {step < 5 && (
          <div className="flex justify-between mt-12">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              className={`px-6 py-2.5 border border-white/20 text-white/55 text-sm font-display transition-colors rounded ${step === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-white/5'}`}
            >
              ← Geri
            </button>
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className={`px-8 py-2.5 text-sm font-display tracking-wide transition-all duration-200 rounded ${
                canNext()
                  ? 'bg-green-500 text-white hover:bg-green-400 shadow-[0_4px_20px_rgba(34,197,94,0.3)]'
                  : 'border border-white/15 text-white/25 cursor-not-allowed'
              }`}
            >
              {step === 4 ? 'Hesapla →' : 'İleri →'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
