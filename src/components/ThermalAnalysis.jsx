import { useState, useMemo } from 'react'

/* ══════════════════════════════════════════════════
   DATABASE  (EN ISO 10077 / EN ISO 10211 / TS 825)
══════════════════════════════════════════════════ */
const PROFILES = [
  {
    id: 'std',    name: 'Standart Alüminyum',    short: 'STD',
    desc: 'Isı köprüsü kesici yok — yüksek iletkenlik',
    Uf: 7.0, psi: 0.14, breakW: 0,
    color: '#ef4444', grade: 'F',
    layers: [{ label: 'Al (dış)', d: 60, lam: 160 }],
    svgType: 'std',
  },
  {
    id: 'tb24',   name: 'Yalıtımlı 24 mm PA66',  short: 'TB-24',
    desc: '24 mm PA66 termal köprü kesici bant',
    Uf: 1.8, psi: 0.08, breakW: 24,
    color: '#f59e0b', grade: 'C',
    layers: [
      { label: 'Al (dış)', d: 18, lam: 160 },
      { label: 'PA66',     d: 24, lam: 0.30 },
      { label: 'Al (iç)',  d: 28, lam: 160 },
    ],
    svgType: 'tb',
  },
  {
    id: 'tb34',   name: 'Yalıtımlı 34 mm PA66',  short: 'TB-34',
    desc: '34 mm genişletilmiş PA66 kesici bant',
    Uf: 1.4, psi: 0.06, breakW: 34,
    color: '#22c55e', grade: 'B',
    layers: [
      { label: 'Al (dış)', d: 16, lam: 160 },
      { label: 'PA66',     d: 34, lam: 0.30 },
      { label: 'Al (iç)',  d: 24, lam: 160 },
    ],
    svgType: 'tb',
  },
  {
    id: 'phi',    name: 'Premium HI (Pasif Ev)',  short: 'PHI',
    desc: '52 mm PU köpük + PA66 — pasif ev uyumlu',
    Uf: 0.82, psi: 0.03, breakW: 52,
    color: '#06b6d4', grade: 'A+',
    layers: [
      { label: 'Al (dış)', d: 12, lam: 160 },
      { label: 'PA66+PU',  d: 52, lam: 0.25 },
      { label: 'Al (iç)',  d: 20, lam: 160 },
    ],
    svgType: 'phi',
  },
]

const GLAZINGS = [
  { id: 'sg',   name: 'Tekli Cam 4 mm',                Ug: 5.7,  g: 0.87, desc: 'Düşük performans, eski yapılar'        },
  { id: 'dg_a', name: '2K Cam 4+16+4 (Hava)',          Ug: 2.8,  g: 0.76, desc: 'Standart çift cam, hava dolgulu'       },
  { id: 'dg_ar',name: '2K Cam 4+16Ar+4 Low-e',         Ug: 1.1,  g: 0.62, desc: 'Argon + Low-e kaplamalı, yüksek verim' },
  { id: 'tg',   name: '3K Cam 4+12Ar+4+12Ar+4 Low-e',  Ug: 0.65, g: 0.50, desc: 'Üçlü cam — pasif ev standardı'        },
]

const CLIMATES = [
  { id: 'ist', name: 'İstanbul',  Tout: -3,  RHout: 80 },
  { id: 'ank', name: 'Ankara',    Tout: -12, RHout: 75 },
  { id: 'izm', name: 'İzmir',     Tout: 0,   RHout: 70 },
  { id: 'eze', name: 'Erzurum',   Tout: -22, RHout: 78 },
  { id: 'cus', name: 'Özel',      Tout: -5,  RHout: 75 },
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
   CALCULATION ENGINE  (EN ISO 10077-1 / EN ISO 13788)
══════════════════════════════════════════════════ */
function calcUw({ profile, glazing, W, H, Tin, Tout, RHin }) {
  const Ag_frac = 0.70
  const Ag = W * H * Ag_frac
  const Af = W * H * (1 - Ag_frac)
  const lg = 2 * (W * 0.8 + H * 0.8)

  const Uw = (Ag * glazing.Ug + Af * profile.Uf + lg * profile.psi) / (Ag + Af)

  const Rsi = 0.13, Rse = 0.04
  const R_layers = profile.layers.reduce((s, l) => s + l.d / 1000 / l.lam, 0)
  const Rtotal = Rsi + Rse + R_layers
  const Tsi = Tin - (Tin - Tout) * (Rsi / Rtotal)
  const fRsi = (Tsi - Tout) / (Tin - Tout)

  const a = 17.625, b = 243.04
  const alpha = Math.log(RHin / 100) + (a * Tin) / (b + Tin)
  const Tdew = (b * alpha) / (a - alpha)
  const condensRisk = Tsi < Tdew

  const ec = ENERGY_CLASSES.find(e => Uw <= e.max) || ENERGY_CLASSES.at(-1)
  const psiContrib = (lg * profile.psi) / (Ag + Af)

  return { Uw, Ag, Af, lg, Tsi, fRsi, Tdew, condensRisk, ec, psiContrib }
}

/* ══════════════════════════════════════════════════
   PROFILE CROSS-SECTION SVG
══════════════════════════════════════════════════ */
function ProfileSVG({ profile, Tsi, Tin, Tout }) {
  const gradId = `pg_${profile.id}`
  const W = 220, H = 80
  const totalD = profile.layers.reduce((s, l) => s + l.d, 0)

  const colors = {
    'Al (dış)': '#7ba7bc', 'Al (iç)': '#7ba7bc',
    'PA66': '#c9a84c', 'PA66+PU': '#b8860b',
  }

  let xCur = 10
  const rects = profile.layers.map(l => {
    const lw = (l.d / totalD) * 200
    const rect = { x: xCur, w: lw, layer: l }
    xCur += lw
    return rect
  })

  const tempRange = Tin - Tout
  const tempColor = (t) => {
    const r = Math.max(0, Math.min(1, (t - Tout) / (tempRange || 1)))
    const R = Math.round(r * 220 + (1 - r) * 50)
    const G = Math.round(r * 80 + (1 - r) * 100)
    const B = Math.round(r * 80 + (1 - r) * 220)
    return `rgb(${R},${G},${B})`
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 100 }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={tempColor(Tout)} />
          <stop offset="40%"  stopColor={tempColor((Tout + Tsi) / 2)} />
          <stop offset="100%" stopColor={tempColor(Tin)}  />
        </linearGradient>
      </defs>

      {/* Thermal gradient background */}
      <rect x="10" y="10" width="200" height="60" fill={`url(#${gradId})`} opacity="0.18" rx="2"/>

      {rects.map((r, i) => (
        <g key={i}>
          <rect x={r.x} y={10} width={r.w} height={60}
            fill={colors[r.layer.label] || '#5a7898'}
            stroke="#1a2838" strokeWidth="0.8" opacity="0.82"/>
          {r.w > 18 && (
            <text x={r.x + r.w / 2} y={44} textAnchor="middle"
              fontSize="7" fill="#fff" fontFamily="monospace" opacity="0.9">
              {r.layer.label}
            </text>
          )}
          {r.w > 18 && (
            <text x={r.x + r.w / 2} y={55} textAnchor="middle"
              fontSize="6" fill="#c9a84c" fontFamily="monospace" opacity="0.8">
              {r.layer.d}mm
            </text>
          )}
        </g>
      ))}

      <text x="10" y="7" fontSize="6" fill="#60a5fa" fontFamily="monospace">DIS {Tout}°C</text>
      <text x="155" y="7" fontSize="6" fill="#f87171" fontFamily="monospace">IC {Tin}°C</text>
      <text x="90" y="7" fontSize="6" fill="#a3e635" fontFamily="monospace" textAnchor="middle">
        Tsi={Tsi.toFixed(1)}°C
      </text>
    </svg>
  )
}

/* ══════════════════════════════════════════════════
   AI ANALYSIS ENGINE
══════════════════════════════════════════════════ */
function generateAIInsights({ profile, glazing, results, Tin, Tout, RHin, W, H }) {
  const insights = []

  if (results.ec.cls === 'A+' || results.ec.cls === 'A')
    insights.push({ type: 'success', icon: '✅', text: `Uw = ${results.Uw.toFixed(2)} W/m²K — EN ISO 10211 standartlarını aşıyor. Pasif ev sertifikasyonu için uygun profil.` })
  else if (results.ec.cls === 'E' || results.ec.cls === 'F')
    insights.push({ type: 'error', icon: '🔴', text: `Uw = ${results.Uw.toFixed(2)} W/m²K — TS 825 bölge 3 ısı yitimi limiti aşılıyor. Acil profil değişikliği önerisi.` })
  else
    insights.push({ type: 'info', icon: '🔵', text: `Uw = ${results.Uw.toFixed(2)} W/m²K — Orta performans. ${results.ec.cls} sınıfı. ${ENERGY_CLASSES.find(e => e.max < results.Uw) ? 'Bir üst sınıfa geçmek için Ug azaltılabilir.' : ''}` })

  if (results.condensRisk)
    insights.push({ type: 'warning', icon: '💧', text: `Yoğuşma riski! İç yüzey sıcaklığı Tsi = ${results.Tsi.toFixed(1)}°C, çiğlenme noktası Tdew = ${results.Tdew.toFixed(1)}°C — küf oluşumu olası.` })
  else
    insights.push({ type: 'success', icon: '🌿', text: `Yoğuşma riski yok. Tsi = ${results.Tsi.toFixed(1)}°C > Tdew = ${results.Tdew.toFixed(1)}°C — EN ISO 13788 sağlanıyor.` })

  if (results.fRsi < 0.70)
    insights.push({ type: 'warning', icon: '⚠️', text: `fRsi = ${results.fRsi.toFixed(3)} — 0.70 minimum değerinin altında. Düşük nem koşullarında bile küf riski söz konusu.` })
  else if (results.fRsi >= 0.90)
    insights.push({ type: 'success', icon: '🏆', text: `fRsi = ${results.fRsi.toFixed(3)} — Mükemmel sıcaklık faktörü. Soğuk iklimde de yüksek performans.` })

  if (profile.id === 'std')
    insights.push({ type: 'suggestion', icon: '💡', text: `PA66 TB-24 profiline geçiş ile Uf 7.0 → 1.8 W/m²K düşer, yıllık enerji tasarrufu tahminen %35–42.` })

  if (glazing.id === 'sg' || glazing.id === 'dg_a')
    insights.push({ type: 'suggestion', icon: '🔬', text: `Low-e + Argon (4+16Ar+4) çift cama geçiş: Ug ${glazing.Ug} → 1.1 W/m²K — toplam Uw'da 0.${Math.round((glazing.Ug - 1.1) * 0.7 * 10)} azalma beklenir.` })

  const area = W * H
  const heatLoss = results.Uw * area * (Tin - Tout)
  insights.push({ type: 'data', icon: '📊', text: `${W}×${H}m pencere için ısı kaybı: ${heatLoss.toFixed(0)} W — günde ${(heatLoss * 24 / 1000).toFixed(1)} kWh (ΔT=${Tin - Tout}°C).` })

  if (results.psiContrib > 0.05 * results.Uw)
    insights.push({ type: 'warning', icon: '🔗', text: `ψ (psi) doğrusal ısı köprüsü katkısı Uw'nun %${Math.round(results.psiContrib / results.Uw * 100)}'i — çevre bağlantı detayları kritik.` })

  return insights
}

/* ══════════════════════════════════════════════════
   STEP INDICATOR
══════════════════════════════════════════════════ */
const STEPS = ['Profil', 'Cam', 'Boyut', 'İklim', 'Sonuç']

function StepBar({ step }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((s, i) => (
        <div key={i} className="flex items-center">
          <div className={`flex flex-col items-center ${i <= step ? '' : 'opacity-40'}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
              i < step  ? 'bg-gold-500 border-gold-500 text-black' :
              i === step ? 'bg-transparent border-gold-400 text-gold-400 shadow-[0_0_12px_rgba(201,168,76,0.5)]' :
                          'bg-transparent border-white/20 text-white/30'
            }`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-[10px] mt-1 font-display tracking-wider ${i === step ? 'text-gold-400' : 'text-white/40'}`}>{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-12 h-px mx-1 mb-5 transition-all duration-500 ${i < step ? 'bg-gold-500' : 'bg-white/15'}`}/>
          )}
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
export default function ThermalAnalysis() {
  const [step, setStep]         = useState(0)
  const [profileId, setProfileId] = useState(null)
  const [glazingId, setGlazingId] = useState(null)
  const [W, setW]               = useState(1.2)
  const [H, setH]               = useState(1.5)
  const [climateId, setClimateId] = useState('ist')
  const [Tin, setTin]           = useState(22)
  const [RHin, setRHin]         = useState(55)
  const [customTout, setCustomTout] = useState(-5)
  const [activeTab, setActiveTab] = useState('results')

  const profile = PROFILES.find(p => p.id === profileId)
  const glazing = GLAZINGS.find(g => g.id === glazingId)
  const climate = CLIMATES.find(c => c.id === climateId)
  const Tout = climateId === 'cus' ? customTout : (climate?.Tout ?? -5)

  const results = useMemo(() => {
    if (!profile || !glazing) return null
    return calcUw({ profile, glazing, W, H, Tin, Tout, RHin })
  }, [profile, glazing, W, H, Tin, Tout, RHin])

  const aiInsights = useMemo(() => {
    if (!results || !profile || !glazing) return []
    return generateAIInsights({ profile, glazing, results, Tin, Tout, RHin, W, H })
  }, [results, profile, glazing, Tin, Tout, RHin, W, H])

  const canNext = () => {
    if (step === 0) return !!profileId
    if (step === 1) return !!glazingId
    if (step === 2) return W > 0 && H > 0
    if (step === 3) return true
    return false
  }

  const handlePrint = () => window.print()

  return (
    <section id="termal-analiz" className="py-28 relative">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-gold-400 text-xs font-display tracking-[0.3em] uppercase mb-3">Hesaplamalar — Flixo Modülü</p>
          <h2 className="text-4xl font-display font-700 text-white mb-4">
            Termal Köprü Analizi
          </h2>
          <p className="text-white/50 text-sm max-w-lg mx-auto leading-relaxed">
            EN ISO 10211 · EN ISO 10077-1 · EN ISO 13788 — Adım adım rehberli hesaplama
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {['EN ISO 10077', 'EN ISO 10211', 'EN ISO 13788', 'TS 825'].map(s => (
              <span key={s} className="text-[10px] px-2 py-0.5 rounded border border-white/10 text-white/30 font-mono">{s}</span>
            ))}
          </div>
        </div>

        {/* Step Bar */}
        <StepBar step={step} />

        {/* ── STEP 0 — Profil Seçimi ── */}
        {step === 0 && (
          <div>
            <h3 className="text-center text-white/60 text-sm mb-8 font-display tracking-wide">
              Alüminyum profil sistemini seçin
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PROFILES.map(p => (
                <button
                  key={p.id}
                  onClick={() => setProfileId(p.id)}
                  className={`relative p-5 text-left border-2 transition-all duration-300 rounded group ${
                    profileId === p.id
                      ? 'border-gold-400 bg-gold-500/10 shadow-[0_0_24px_rgba(201,168,76,0.25)]'
                      : 'border-white/10 bg-white/3 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                      style={{ background: p.color + '22', color: p.color, border: `1px solid ${p.color}55` }}>
                      {p.short}
                    </span>
                    <span className="text-xl font-bold" style={{ color: p.color }}>{p.grade}</span>
                  </div>
                  <div className="text-white text-sm font-600 mb-1">{p.name}</div>
                  <div className="text-white/40 text-xs leading-relaxed mb-4">{p.desc}</div>
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-white/40">Uf</span>
                      <span style={{ color: p.color }}>{p.Uf} W/m²K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">ψ (psi)</span>
                      <span className="text-white/60">{p.psi} W/mK</span>
                    </div>
                    {p.breakW > 0 && (
                      <div className="flex justify-between">
                        <span className="text-white/40">Kesici</span>
                        <span className="text-white/60">{p.breakW} mm</span>
                      </div>
                    )}
                  </div>
                  {profileId === p.id && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center">
                      <span className="text-black text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 1 — Cam Seçimi ── */}
        {step === 1 && (
          <div>
            <h3 className="text-center text-white/60 text-sm mb-8 font-display tracking-wide">
              Cam konfigürasyonunu seçin
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {GLAZINGS.map(g => (
                <button
                  key={g.id}
                  onClick={() => setGlazingId(g.id)}
                  className={`p-5 text-left border-2 transition-all duration-300 rounded ${
                    glazingId === g.id
                      ? 'border-gold-400 bg-gold-500/10 shadow-[0_0_24px_rgba(201,168,76,0.2)]'
                      : 'border-white/10 bg-white/3 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-600 text-sm">{g.name}</span>
                    {glazingId === g.id && (
                      <span className="w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center">
                        <span className="text-black text-xs">✓</span>
                      </span>
                    )}
                  </div>
                  <p className="text-white/40 text-xs mb-4">{g.desc}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-white/5 rounded p-2">
                      <div className="text-white/40 mb-0.5">Ug değeri</div>
                      <div className="text-cyan-400 font-bold">{g.Ug} W/m²K</div>
                    </div>
                    <div className="bg-white/5 rounded p-2">
                      <div className="text-white/40 mb-0.5">g faktörü</div>
                      <div className="text-amber-400 font-bold">{g.g}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2 — Boyutlar ── */}
        {step === 2 && (
          <div className="max-w-lg mx-auto">
            <h3 className="text-center text-white/60 text-sm mb-8 font-display tracking-wide">
              Pencere boyutlarını girin
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Genişlik (m)', val: W, set: setW, min: 0.3, max: 4.0, step: 0.05 },
                { label: 'Yükseklik (m)', val: H, set: setH, min: 0.3, max: 4.0, step: 0.05 },
              ].map(({ label, val, set, min, max, step: s }) => (
                <div key={label}>
                  <div className="flex justify-between mb-2">
                    <label className="text-white/70 text-sm font-display">{label}</label>
                    <span className="text-gold-400 font-mono font-bold">{val.toFixed(2)} m</span>
                  </div>
                  <input
                    type="range" min={min} max={max} step={s} value={val}
                    onChange={e => set(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right, #c9a84c ${((val - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 0)` }}
                  />
                  <div className="flex justify-between text-xs text-white/25 mt-1">
                    <span>{min} m</span><span>{max} m</span>
                  </div>
                </div>
              ))}
              <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between border border-white/10">
                <div>
                  <div className="text-white/40 text-xs">Toplam pencere alanı</div>
                  <div className="text-white font-mono font-bold text-xl mt-0.5">{(W * H).toFixed(3)} m²</div>
                </div>
                <svg viewBox="0 0 80 80" className="w-16 h-16 opacity-60">
                  <rect x="5" y="5" width="70" height="70" fill="none" stroke="#c9a84c" strokeWidth="3"/>
                  <rect x="15" y="15" width="50" height="50" fill="rgba(100,180,220,0.15)" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 2"/>
                  <text x="40" y="43" textAnchor="middle" fontSize="9" fill="#c9a84c" fontFamily="monospace">
                    {W.toFixed(1)}×{H.toFixed(1)}
                  </text>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3 — İklim & Koşullar ── */}
        {step === 3 && (
          <div className="max-w-xl mx-auto">
            <h3 className="text-center text-white/60 text-sm mb-8 font-display tracking-wide">
              İklim koşullarını belirleyin
            </h3>
            <div className="mb-6">
              <label className="block text-white/60 text-xs font-display tracking-wider mb-3">Şehir / Bölge</label>
              <div className="flex flex-wrap gap-2">
                {CLIMATES.map(c => (
                  <button key={c.id} onClick={() => setClimateId(c.id)}
                    className={`px-4 py-2 text-sm border transition-all duration-200 rounded ${
                      climateId === c.id
                        ? 'border-gold-400 bg-gold-500/15 text-gold-400'
                        : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'
                    }`}>
                    {c.name}
                    {c.id !== 'cus' && <span className="ml-1.5 text-xs opacity-60">{c.Tout}°C</span>}
                  </button>
                ))}
              </div>
            </div>

            {climateId === 'cus' && (
              <div className="mb-5">
                <div className="flex justify-between mb-2">
                  <label className="text-white/70 text-sm">Dış sıcaklık (Tout)</label>
                  <span className="text-cyan-400 font-mono font-bold">{customTout}°C</span>
                </div>
                <input type="range" min={-30} max={10} step={1} value={customTout}
                  onChange={e => setCustomTout(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #60a5fa ${((customTout + 30) / 40) * 100}%, rgba(255,255,255,0.1) 0)` }}
                />
              </div>
            )}

            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-white/70 text-sm">İç sıcaklık (Tin)</label>
                  <span className="text-red-400 font-mono font-bold">{Tin}°C</span>
                </div>
                <input type="range" min={15} max={30} step={1} value={Tin}
                  onChange={e => setTin(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #f87171 ${((Tin - 15) / 15) * 100}%, rgba(255,255,255,0.1) 0)` }}
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-white/70 text-sm">İç bağıl nem (RHin)</label>
                  <span className="text-blue-400 font-mono font-bold">{RHin}%</span>
                </div>
                <input type="range" min={30} max={80} step={5} value={RHin}
                  onChange={e => setRHin(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #60a5fa ${((RHin - 30) / 50) * 100}%, rgba(255,255,255,0.1) 0)` }}
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg grid grid-cols-3 gap-3 text-center text-xs font-mono">
              <div>
                <div className="text-white/30 mb-1">Tout</div>
                <div className="text-cyan-400 font-bold">{Tout}°C</div>
              </div>
              <div>
                <div className="text-white/30 mb-1">Tin</div>
                <div className="text-red-400 font-bold">{Tin}°C</div>
              </div>
              <div>
                <div className="text-white/30 mb-1">ΔT</div>
                <div className="text-gold-400 font-bold">{Tin - Tout}°C</div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4 — Sonuçlar ── */}
        {step === 4 && results && (
          <div>
            {/* Tab bar */}
            <div className="flex justify-center gap-2 mb-8">
              {[
                { id: 'results', label: 'Sonuçlar' },
                { id: 'ai',      label: 'AI Analiz' },
                { id: 'cross',   label: 'Kesit Görünüm' },
                { id: 'report',  label: 'Rapor' },
              ].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`px-5 py-2 text-sm font-display tracking-wide border transition-all duration-200 rounded-sm ${
                    activeTab === t.id
                      ? 'border-gold-400 bg-gold-500/15 text-gold-400'
                      : 'border-white/15 text-white/50 hover:text-white'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* RESULTS TAB */}
            {activeTab === 'results' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Energy gauge */}
                <div className="bg-white/4 border border-white/10 rounded-lg p-6 flex flex-col items-center justify-center">
                  <div className="text-white/40 text-xs font-display tracking-widest mb-4">ENERJİ SINIFI</div>
                  <div className="w-28 h-28 rounded-full flex items-center justify-center border-4 mb-4"
                    style={{ borderColor: results.ec.color, boxShadow: `0 0 32px ${results.ec.color}55` }}>
                    <div className="text-center">
                      <div className="text-4xl font-black" style={{ color: results.ec.color }}>{results.ec.cls}</div>
                    </div>
                  </div>
                  <div className="text-3xl font-mono font-black text-white mb-1">{results.Uw.toFixed(3)}</div>
                  <div className="text-white/40 text-xs">W/m²K — EN ISO 10077-1</div>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Uw (pencere)', val: results.Uw.toFixed(3), unit: 'W/m²K', color: results.ec.color },
                    { label: 'Ug (cam)',     val: glazing.Ug.toFixed(2), unit: 'W/m²K', color: '#60a5fa' },
                    { label: 'Uf (çerçeve)',val: profile.Uf.toFixed(2),  unit: 'W/m²K', color: '#a78bfa' },
                    { label: 'ψ psi',        val: profile.psi.toFixed(3), unit: 'W/mK',  color: '#c9a84c' },
                    { label: 'fRsi',         val: results.fRsi.toFixed(3),unit: '',       color: results.fRsi >= 0.7 ? '#22c55e' : '#ef4444' },
                    { label: 'Tsi (iç yüz)',val: results.Tsi.toFixed(1), unit: '°C',     color: results.Tsi > results.Tdew ? '#22c55e' : '#ef4444' },
                    { label: 'Tdew (çiğ)',  val: results.Tdew.toFixed(1),unit: '°C',     color: '#60a5fa' },
                    { label: 'Yoğuşma',     val: results.condensRisk ? 'RİSK!' : 'Güvenli', unit: '', color: results.condensRisk ? '#ef4444' : '#22c55e' },
                  ].map(m => (
                    <div key={m.label} className="bg-white/4 border border-white/8 rounded-lg p-3">
                      <div className="text-white/35 text-[10px] font-mono mb-1">{m.label}</div>
                      <div className="font-mono font-bold text-base" style={{ color: m.color }}>
                        {m.val} <span className="text-xs font-normal opacity-70">{m.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Energy class scale */}
                <div className="lg:col-span-2 bg-white/3 border border-white/8 rounded-lg p-4">
                  <div className="text-white/40 text-xs font-display mb-3">Enerji Sınıfı Skalası</div>
                  <div className="flex gap-1">
                    {ENERGY_CLASSES.filter(e => e.max < Infinity).map((ec, i) => (
                      <div key={ec.cls} className={`flex-1 h-6 rounded flex items-center justify-center transition-all duration-300 ${
                        results.ec.cls === ec.cls ? 'scale-y-125' : 'opacity-40'
                      }`} style={{ background: ec.color + (results.ec.cls === ec.cls ? 'dd' : '44') }}>
                        <span className="text-white text-[10px] font-bold">{ec.cls}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* AI ANALYSIS TAB */}
            {activeTab === 'ai' && (
              <div className="max-w-2xl mx-auto space-y-3">
                <div className="text-center text-white/40 text-xs mb-6 font-display">
                  AI destekli termal performans değerlendirmesi — {PROFILES.find(p=>p.id===profileId)?.name} + {GLAZINGS.find(g=>g.id===glazingId)?.name}
                </div>
                {aiInsights.map((ins, i) => (
                  <div key={i} className={`flex gap-4 p-4 rounded-lg border transition-all duration-200 ${
                    ins.type === 'error'   ? 'bg-red-500/8 border-red-500/25' :
                    ins.type === 'warning' ? 'bg-amber-500/8 border-amber-500/25' :
                    ins.type === 'success' ? 'bg-green-500/8 border-green-500/25' :
                    ins.type === 'suggestion' ? 'bg-gold-500/8 border-gold-500/25' :
                                            'bg-blue-500/8 border-blue-500/25'
                  }`}>
                    <span className="text-2xl flex-shrink-0 mt-0.5">{ins.icon}</span>
                    <p className="text-white/75 text-sm leading-relaxed">{ins.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* CROSS SECTION TAB */}
            {activeTab === 'cross' && (
              <div className="max-w-lg mx-auto">
                <div className="bg-white/4 border border-white/10 rounded-lg p-6 mb-4">
                  <div className="text-white/40 text-xs font-display mb-4">Profil Kesit — Termal Gradyan Görünümü</div>
                  <ProfileSVG profile={profile} Tsi={results.Tsi} Tin={Tin} Tout={Tout} />
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs font-mono text-center">
                  {profile.layers.map((l, i) => (
                    <div key={i} className="bg-white/4 border border-white/10 rounded p-3">
                      <div className="text-white/40 mb-1">{l.label}</div>
                      <div className="text-white font-bold">{l.d} mm</div>
                      <div className="text-white/30 text-[10px]">λ={l.lam} W/mK</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-white/3 border border-white/8 rounded-lg text-xs font-mono">
                  <div className="text-white/40 mb-2">Isı Direnci Dağılımı (EN ISO 10211)</div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-white/50">Rsi (iç yüzey)</span>
                      <span className="text-white">0.130 m²K/W</span>
                    </div>
                    {profile.layers.map((l, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-white/50">{l.label}</span>
                        <span className="text-white">{(l.d / 1000 / l.lam).toFixed(5)} m²K/W</span>
                      </div>
                    ))}
                    <div className="flex justify-between">
                      <span className="text-white/50">Rse (dış yüzey)</span>
                      <span className="text-white">0.040 m²K/W</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* REPORT TAB */}
            {activeTab === 'report' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white/4 border border-white/10 rounded-lg p-8 font-mono text-sm space-y-4">
                  <div className="border-b border-white/15 pb-4">
                    <div className="text-gold-400 font-bold text-base">AluSight — Termal Köprü Raporu</div>
                    <div className="text-white/40 text-xs mt-1">EN ISO 10077-1 / EN ISO 10211 / EN ISO 13788 — {new Date().toLocaleDateString('tr-TR')}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-white/40 mb-2 uppercase tracking-wider">Profil Sistemi</div>
                      <div className="text-white">{profile.name}</div>
                      <div className="text-white/50">Uf = {profile.Uf} W/m²K</div>
                      <div className="text-white/50">ψ = {profile.psi} W/mK</div>
                    </div>
                    <div>
                      <div className="text-white/40 mb-2 uppercase tracking-wider">Cam Sistemi</div>
                      <div className="text-white">{glazing.name}</div>
                      <div className="text-white/50">Ug = {glazing.Ug} W/m²K</div>
                      <div className="text-white/50">g = {glazing.g}</div>
                    </div>
                    <div>
                      <div className="text-white/40 mb-2 uppercase tracking-wider">Boyutlar</div>
                      <div className="text-white">{W.toFixed(2)} × {H.toFixed(2)} m</div>
                      <div className="text-white/50">Alan = {(W * H).toFixed(3)} m²</div>
                    </div>
                    <div>
                      <div className="text-white/40 mb-2 uppercase tracking-wider">İklim</div>
                      <div className="text-white">{climate?.name ?? 'Özel'}</div>
                      <div className="text-white/50">Tout = {Tout}°C / Tin = {Tin}°C</div>
                      <div className="text-white/50">RH = {RHin}%</div>
                    </div>
                  </div>
                  <div className="border-t border-white/15 pt-4 grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white/5 rounded p-3">
                      <div className="text-white/40 mb-1">Uw (hesaplanan)</div>
                      <div className="text-2xl font-black" style={{ color: results.ec.color }}>{results.Uw.toFixed(3)}</div>
                      <div className="text-white/30 text-[10px]">W/m²K</div>
                    </div>
                    <div className="bg-white/5 rounded p-3">
                      <div className="text-white/40 mb-1">Enerji Sınıfı</div>
                      <div className="text-2xl font-black" style={{ color: results.ec.color }}>{results.ec.cls}</div>
                      <div className="text-white/30 text-[10px]">EN ISO 10077-1</div>
                    </div>
                    <div className="bg-white/5 rounded p-3">
                      <div className="text-white/40 mb-1">fRsi faktörü</div>
                      <div className="text-lg font-bold text-white">{results.fRsi.toFixed(4)}</div>
                      <div className="text-white/30 text-[10px]">EN ISO 13788</div>
                    </div>
                    <div className="bg-white/5 rounded p-3">
                      <div className="text-white/40 mb-1">Yoğuşma Riski</div>
                      <div className={`text-lg font-bold ${results.condensRisk ? 'text-red-400' : 'text-green-400'}`}>
                        {results.condensRisk ? 'VAR' : 'YOK'}
                      </div>
                      <div className="text-white/30 text-[10px]">Tdew={results.Tdew.toFixed(1)}°C</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 justify-center">
                  <button onClick={handlePrint}
                    className="px-6 py-2.5 border border-gold-500/50 text-gold-400 text-sm font-display hover:bg-gold-500/10 transition-colors duration-200 rounded">
                    Yazdır / PDF
                  </button>
                  <button onClick={() => setStep(0)}
                    className="px-6 py-2.5 border border-white/20 text-white/60 text-sm font-display hover:bg-white/5 transition-colors duration-200 rounded">
                    Yeni Hesaplama
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        {step < 4 && (
          <div className="flex justify-between mt-12">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              className={`px-6 py-2.5 border border-white/20 text-white/60 text-sm font-display transition-colors rounded ${step === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-white/5'}`}
            >
              ← Geri
            </button>
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className={`px-8 py-2.5 text-sm font-display tracking-wide transition-all duration-200 rounded ${
                canNext()
                  ? 'bg-gold-500 text-black hover:bg-gold-400 shadow-[0_4px_20px_rgba(201,168,76,0.35)]'
                  : 'border border-white/15 text-white/25 cursor-not-allowed'
              }`}
            >
              {step === 3 ? 'Hesapla →' : 'İleri →'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
