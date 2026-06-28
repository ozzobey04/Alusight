import { useState, useMemo, useEffect } from 'react'
import { printCarbonPDF, buildBlobUrl } from '../utils/printPDF'

/* ─────────────────────── VERİ TABLOLARI ─────────────────────── */
const PRODUCT_TYPES = [
  { id:'win_std',  name:'Standart Al Pencere',      type:'window',  profileKgM:1.8, frameFrac:0.15, icon:'🪟', desc:'Termal kesici yok — konut / sanayi' },
  { id:'win_tb24', name:'Termal Kesicili (TB-24)',   type:'window',  profileKgM:1.5, frameFrac:0.15, icon:'🔆', desc:'24mm PA66 termal kesici — konut' },
  { id:'win_phi',  name:'Pasif Ev (PHI)',            type:'window',  profileKgM:1.3, frameFrac:0.12, icon:'⚡', desc:'52mm termal kesici — PHPP uyumlu' },
  { id:'sliding',  name:'Sürme Sistem',             type:'window',  profileKgM:2.2, frameFrac:0.20, icon:'↔️', desc:'Teraslık / geniş açıklıklar' },
  { id:'facade_stick', name:'Stick Cephe (Alüminyum)', type:'facade', profileKgM:3.5, frameFrac:0.25, icon:'🏢', desc:'Şantiyede monte grid cephe sistemi' },
  { id:'facade_unit',  name:'Unitize Cephe',        type:'facade',  profileKgM:4.2, frameFrac:0.30, icon:'🏗️', desc:'Fabrika üretimi, sahaya asılan modüler panel' },
  { id:'ssg',          name:'Yapısal Cam Cephe (SSG)', type:'facade', profileKgM:2.8, frameFrac:0.20, icon:'✨', desc:'Dıştan görünmeyen taşıyıcı profil' },
]

const ALUMINUM_TYPES = [
  { id:'primary_eu',   name:'Primer Al — Avrupa üretim',         gwp:11.5, desc:'Avrupa elektrik şebekesi · EN 15804 küresel ısınma' },
  { id:'mix_eu',       name:'Karma (%50 geri dön.) — AB ort.',    gwp:6.8,  desc:'EN 15804 sektör ortalaması (EAA EPD 2023)' },
  { id:'high_recycle', name:'Yüksek geri dönüşüm (%80+)',         gwp:2.5,  desc:'Geri dönüşüm ağırlıklı · Scrap bazlı üretim' },
  { id:'custom',       name:'Tedarikçi EPD (özel giriş)',          gwp:null, desc:'Ürün bazlı EPD değerini giriniz' },
]

const GLASS_TYPES = [
  { id:'sg6',    name:'Tek cam 6mm',            gwpM2:22, Ug:5.7  },
  { id:'dg_air', name:'4+12+4 Hava dolu',       gwpM2:28, Ug:2.8  },
  { id:'dg_ar',  name:'4+16Ar+4 Low-e',         gwpM2:32, Ug:1.1  },
  { id:'tg',     name:'4+14Ar+4+14Ar+4 Üçlü',  gwpM2:45, Ug:0.65 },
  { id:'vcg',    name:'Vakumlu cam (VIG)',        gwpM2:55, Ug:0.4  },
]

const SURFACE_TREATMENTS = [
  { id:'natural',  name:'Naturel (işlemsiz)',  gwpKg:0,   desc:'Ekstra yüzey işlemi yok' },
  { id:'anodize',  name:'Anodize',             gwpKg:0.8, desc:'Elektrolitik oksit tabaka — ~15 mikron' },
  { id:'powder',   name:'Toz Boya',            gwpKg:1.2, desc:'Polimer kaplama ~80 g/m² — RAL renk' },
  { id:'pvdf',     name:'PVDF Kaplama',        gwpKg:2.1, desc:'Floropolimer — mimari cepheler (30 yıl garanti)' },
  { id:'wood_eff', name:'Ahşap görünüm folyo', gwpKg:1.8, desc:'Folyo + toz boya kombinasyonu' },
]

const CITIES = [
  { id:'ist', name:'İstanbul',  HDD:1725 },
  { id:'ank', name:'Ankara',   HDD:3056 },
  { id:'izm', name:'İzmir',    HDD:1108 },
  { id:'bur', name:'Bursa',    HDD:1901 },
  { id:'ant', name:'Antalya',  HDD:513  },
  { id:'trab',name:'Trabzon',  HDD:1891 },
  { id:'erz', name:'Erzurum',  HDD:4590 },
  { id:'cus', name:'Özel giriş', HDD:null },
]

const ENERGY_SOURCES = [
  { id:'gas',      name:'Doğalgaz',                factor:0.205, desc:'IPCC AR6 · Türkiye referansı' },
  { id:'elec',     name:'Elektrik (TR şebekesi)',   factor:0.440, desc:'TEIAŞ 2023 emisyon yoğunluğu' },
  { id:'heatpump', name:'Isı pompası (COP 4)',      factor:0.110, desc:'Elektrik × 0.44 / 4' },
  { id:'district', name:'Bölgesel ısıtma (CHP)',   factor:0.150, desc:'Kombine ısı-güç kaynaklı' },
  { id:'coal',     name:'Kömür (linyit)',           factor:0.340, desc:'Türkiye linyit bazlı' },
]

const TRANSPORT_OPTS = [
  { id:'local',  name:'Yerel  (< 500 km)',         factor:0.15 },
  { id:'region', name:'Bölgesel (500–1 500 km)',   factor:0.35 },
  { id:'intl',   name:'Uluslararası (> 1 500 km)', factor:0.65 },
]

const LIFECYCLE_OPTS = [
  { id:'30', label:'30 yıl — standart pencere',   years:30 },
  { id:'50', label:'50 yıl — cephe / bina ömrü', years:50 },
  { id:'60', label:'60 yıl — EN 15978 referans', years:60 },
]

const STEPS = ['Sistem','Malzeme','Konum & Enerji','Sonuç']

/* ─────────────────────── HESAP MOTORU (EN 15978) ─────────────────────── */
function calcCarbon({ product, alType, customGwpAl, glass, surface, W, H, qty, city, customHDD, energySource, transport, lifecycle }) {
  const area       = W * H * qty
  const glassArea  = area * (1 - product.frameFrac)
  const perimM     = 2 * (W + H) * qty
  const sashFactor = product.type === 'facade' ? 0 : 0.65
  const totalProfM = perimM * (1 + sashFactor)
  const alKg       = totalProfM * product.profileKgM
  const sealKg     = totalProfM * 0.055
  const paKg       = (product.id.includes('tb') || product.id.includes('phi')) ? alKg * 0.09 : 0

  const gwpAl      = alType.id === 'custom' ? (parseFloat(customGwpAl) || 6.8) : alType.gwp

  /* A1–A3 Ürün aşaması */
  const EC_al       = alKg   * gwpAl
  const EC_surface  = alKg   * surface.gwpKg
  const EC_glass    = glassArea * glass.gwpM2
  const EC_seal     = sealKg * 2.5
  const EC_pa       = paKg   * 4.5
  const EC_hardware = qty    * 9.0
  const EC_A1A3     = EC_al + EC_surface + EC_glass + EC_seal + EC_pa + EC_hardware

  /* A4 Nakliye */
  const EC_A4 = transport.factor * area

  /* A5 Montaj */
  const EC_A5 = (product.type === 'facade' ? 5.0 : 2.5) * area

  const EC_total = EC_A1A3 + EC_A4 + EC_A5

  /* B6 İşletme (cam üzerinden ısı kaybı) */
  const HDD            = city.id === 'cus' ? (parseFloat(customHDD) || 2000) : city.HDD
  const annualKWh      = glass.Ug * glassArea * HDD * 24 / 1000
  const annualCO2      = annualKWh * energySource.factor
  const OC_total       = annualCO2 * lifecycle.years

  /* C4 Yıkım/atık */
  const EoL_C4 = alKg * 0.05 * 2.0

  /* D  Geri dönüşüm kredisi */
  const recycleRate = 0.95
  const EoL_D = -(alKg * recycleRate * Math.max(0, gwpAl - 0.8))

  const total_AtoC  = EC_total + OC_total + EoL_C4
  const total_AtoD  = total_AtoC + EoL_D
  const perM2_AtoC  = area > 0 ? total_AtoC / area : 0
  const perM2_AtoD  = area > 0 ? total_AtoD / area : 0

  let cls, clsColor
  if      (perM2_AtoC < 30)  { cls = 'A+'; clsColor = '#22c55e' }
  else if (perM2_AtoC < 60)  { cls = 'A';  clsColor = '#84cc16' }
  else if (perM2_AtoC < 100) { cls = 'B';  clsColor = '#eab308' }
  else if (perM2_AtoC < 150) { cls = 'C';  clsColor = '#f97316' }
  else                        { cls = 'D';  clsColor = '#ef4444' }

  return {
    area, alKg, glassArea, sealKg, paKg, totalProfM,
    EC_al, EC_surface, EC_glass, EC_seal, EC_pa, EC_hardware, EC_A1A3, EC_A4, EC_A5, EC_total,
    annualKWh, annualCO2, OC_total,
    EoL_C4, EoL_D,
    total_AtoC, total_AtoD,
    perM2_AtoC, perM2_AtoD,
    cls, clsColor, HDD, gwpAl,
    lifecycleYears: lifecycle.years,
  }
}

/* ─────────────────────── YARDIMCI BİLEŞENLER ─────────────────────── */
function Card({ children, className = '' }) {
  return <div className={`bg-black/50 backdrop-blur-sm border border-white/15 rounded-xl p-5 ${className}`}>{children}</div>
}

function StepBar({ step }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
      {STEPS.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 text-xs font-display transition-all ${i < step ? 'text-emerald-400' : i === step ? 'text-emerald-300 font-bold' : 'text-white/30'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${i < step ? 'bg-emerald-500 border-emerald-500 text-black' : i === step ? 'border-emerald-400 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]' : 'border-white/20 text-white/30'}`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className="hidden sm:inline">{s}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`w-8 h-px ${i < step ? 'bg-emerald-500/60' : 'bg-white/10'}`}/>}
        </div>
      ))}
    </div>
  )
}

function MetricBox({ label, val, unit = '', color = '#fff', sub = '' }) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-lg p-3 text-center">
      <div className="text-white/45 text-[10px] font-mono mb-1">{label}</div>
      <div className="font-bold text-lg font-mono leading-tight" style={{ color }}>{val}</div>
      {unit && <div className="text-white/40 text-[9px] mt-0.5">{unit}</div>}
      {sub && <div className="text-white/30 text-[9px] mt-0.5">{sub}</div>}
    </div>
  )
}

function BarRow({ label, val, max, color, unit = 'kg CO₂e' }) {
  const pct = max > 0 ? Math.min(100, (val / max) * 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-mono">
        <span className="text-white/65">{label}</span>
        <span style={{ color }}>{val.toFixed(1)} {unit}</span>
      </div>
      <div className="h-2 bg-white/8 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }}/>
      </div>
    </div>
  )
}

function SliderInput({ label, val, set, min, max, step = 0.1, unit, color = '#34d399' }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-white/80 text-sm">{label}</label>
        <div className="flex items-center gap-2">
          <input type="number" min={min} max={max} step={step} value={val}
            onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) set(Math.max(min, Math.min(max, v))) }}
            className="w-20 bg-black/40 border border-white/25 rounded px-2 py-1 text-sm font-mono text-white text-right focus:outline-none focus:border-emerald-400/60"/>
          <span className="text-white/50 text-sm font-mono w-6">{unit}</span>
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={val}
        onChange={e => set(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right,${color} ${((val - min) / (max - min)) * 100}%,rgba(255,255,255,0.12) 0)` }}/>
    </div>
  )
}

/* ─────────────────────── ANA COMPONENT ─────────────────────── */
export default function CarbonPage() {
  const [step, setStep]               = useState(0)
  const [productId, setProductId]     = useState(null)
  const [alTypeId, setAlTypeId]       = useState('mix_eu')
  const [customGwpAl, setCustomGwpAl] = useState(6.8)
  const [glassId, setGlassId]         = useState('dg_ar')
  const [surfaceId, setSurfaceId]     = useState('powder')
  const [W, setW]                     = useState(1.20)
  const [H, setH]                     = useState(1.50)
  const [qty, setQty]                 = useState(1)
  const [cityId, setCityId]           = useState('ist')
  const [customHDD, setCustomHDD]     = useState(2000)

  useEffect(() => {}, [])
  const [energyId, setEnergyId]       = useState('gas')
  const [transportId, setTransportId] = useState('local')
  const [lifecycleId, setLifecycleId] = useState('50')
  const [tab, setTab]                 = useState('summary')
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null)
  const [pdfLoading, setPdfLoading]   = useState(false)

  const product      = PRODUCT_TYPES.find(p => p.id === productId)
  const alType       = ALUMINUM_TYPES.find(a => a.id === alTypeId)
  const glass        = GLASS_TYPES.find(g => g.id === glassId)
  const surface      = SURFACE_TREATMENTS.find(s => s.id === surfaceId)
  const city         = CITIES.find(c => c.id === cityId)
  const energySource = ENERGY_SOURCES.find(e => e.id === energyId)
  const transport    = TRANSPORT_OPTS.find(t => t.id === transportId)
  const lifecycle    = LIFECYCLE_OPTS.find(l => l.id === lifecycleId)

  const r = useMemo(() => {
    if (!product || !alType || !glass || !surface || !city || !energySource || !transport || !lifecycle) return null
    return calcCarbon({ product, alType, customGwpAl, glass, surface, W, H, qty, city, customHDD, energySource, transport, lifecycle })
  }, [product, alType, customGwpAl, glass, surface, W, H, qty, city, customHDD, energySource, transport, lifecycle])

  const canNext = () => {
    if (step === 0) return !!productId
    return true
  }

  const handlePDF = () => {
    if (!r) return
    printCarbonPDF({ product, alType, totalM2: W * H * qty, qty, result: r, glass, surface, city, energySource, lifecycle })
  }

  const handlePreview = () => {
    handlePDF()
  }

  const fmt1 = n => n.toFixed(1)
  const fmt0 = n => Math.round(n).toLocaleString('tr-TR')

  return (
    <>
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full border border-emerald-500/50 flex items-center justify-center text-xl bg-emerald-500/15">🌿</div>
            <div className="text-left">
              <p className="text-emerald-400 text-xs font-display tracking-[0.3em] uppercase">Hesaplamalar — Karbon</p>
              <h1 className="text-3xl font-display font-bold text-white">Karbon Ayak İzi Hesabı</h1>
            </div>
          </div>
          <p className="text-white/55 text-sm max-w-2xl mx-auto">Alüminyum doğrama ve cephe sistemleri için yaşam döngüsü karbon analizi</p>
          <div className="flex items-center justify-center flex-wrap gap-2 mt-3">
            {['EN 15978','EN 15804','ISO 14040','EAA EPD 2023','IPCC AR6'].map(s => (
              <span key={s} className="text-[10px] px-2.5 py-0.5 rounded-sm border border-white/20 text-white/45 font-mono bg-white/5">{s}</span>
            ))}
          </div>
        </div>

        <StepBar step={step}/>

        {/* ── STEP 0: Sistem seçimi ── */}
        {step === 0 && (
          <div>
            <p className="text-center text-white/60 text-sm mb-8">Hesaplamak istediğiniz alüminyum sistemi seçin</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRODUCT_TYPES.map(p => (
                <button key={p.id} onClick={() => setProductId(p.id)}
                  className={`p-5 text-left border-2 rounded-xl transition-all duration-300 ${productId === p.id ? 'border-emerald-400 bg-emerald-500/15 shadow-[0_0_24px_rgba(52,211,153,0.2)]' : 'border-white/15 bg-black/40 hover:border-white/30 hover:bg-black/60'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-2xl">{p.icon}</span>
                    {productId === p.id && <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-black text-xs font-bold">✓</span>}
                  </div>
                  <div className="text-white font-semibold text-sm mb-1">{p.name}</div>
                  <div className="text-white/40 text-xs">{p.desc}</div>
                  <div className="mt-2 text-[10px] font-mono text-white/30">{p.profileKgM} kg/m profil · çerçeve {(p.frameFrac*100).toFixed(0)}%</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 1: Malzeme & boyut ── */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <div className="text-emerald-400 text-xs font-display tracking-widest mb-4 uppercase">Alüminyum Alaşımı & GWP</div>
                <div className="space-y-2">
                  {ALUMINUM_TYPES.map(a => (
                    <button key={a.id} onClick={() => setAlTypeId(a.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${alTypeId === a.id ? 'border-emerald-400/60 bg-emerald-500/10' : 'border-white/10 hover:border-white/25 bg-black/20'}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-white text-sm font-medium">{a.name}</div>
                          <div className="text-white/40 text-xs mt-0.5">{a.desc}</div>
                        </div>
                        <div className="text-emerald-300 font-mono text-sm font-bold ml-3 shrink-0">
                          {a.gwp ?? '—'} kg CO₂e/kg
                        </div>
                      </div>
                    </button>
                  ))}
                  {alTypeId === 'custom' && (
                    <div className="mt-2">
                      <label className="text-white/60 text-xs mb-1 block">EPD GWP değeri (kg CO₂e / kg Al)</label>
                      <input type="number" min={0.5} max={20} step={0.1} value={customGwpAl}
                        onChange={e => setCustomGwpAl(e.target.value)}
                        className="w-full bg-black/40 border border-emerald-400/40 rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-emerald-400"/>
                    </div>
                  )}
                </div>
              </Card>

              <div className="space-y-4">
                <Card>
                  <div className="text-emerald-400 text-xs font-display tracking-widest mb-4 uppercase">Cam Sistemi</div>
                  <div className="space-y-2">
                    {GLASS_TYPES.map(g => (
                      <button key={g.id} onClick={() => setGlassId(g.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${glassId === g.id ? 'border-emerald-400/60 bg-emerald-500/10' : 'border-white/10 hover:border-white/25 bg-black/20'}`}>
                        <div className="flex justify-between items-center">
                          <span className="text-white text-sm">{g.name}</span>
                          <div className="text-right shrink-0 ml-2">
                            <div className="text-emerald-300 font-mono text-xs">{g.gwpM2} kg/m²</div>
                            <div className="text-white/35 font-mono text-[10px]">Ug {g.Ug} W/m²K</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card>
                  <div className="text-emerald-400 text-xs font-display tracking-widest mb-4 uppercase">Yüzey İşlemi</div>
                  <div className="grid grid-cols-1 gap-2">
                    {SURFACE_TREATMENTS.map(s => (
                      <button key={s.id} onClick={() => setSurfaceId(s.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${surfaceId === s.id ? 'border-emerald-400/60 bg-emerald-500/10' : 'border-white/10 hover:border-white/25 bg-black/20'}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-white text-sm">{s.name}</div>
                            <div className="text-white/35 text-xs">{s.desc}</div>
                          </div>
                          <span className="text-emerald-300 font-mono text-xs ml-3 shrink-0">+{s.gwpKg} kg CO₂/kg</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            <Card>
              <div className="text-emerald-400 text-xs font-display tracking-widest mb-5 uppercase">Boyutlar & Adet</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <SliderInput label="Genişlik (W)" val={W} set={setW} min={0.3} max={6.0} step={0.05} unit="m"/>
                <SliderInput label="Yükseklik (H)" val={H} set={setH} min={0.3} max={6.0} step={0.05} unit="m"/>
                <SliderInput label="Adet (qty)" val={qty} set={setQty} min={1} max={200} step={1} unit="ad" color="#60a5fa"/>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-mono">
                {[['Toplam Alan', `${(W*H*qty).toFixed(2)} m²`,'#34d399'],['Profil Uzunluğu', `~${(2*(W+H)*qty*(1.65)).toFixed(1)} m`,'#a78bfa'],['Cam Alanı', `~${(W*H*qty*(1-( PRODUCT_TYPES.find(p=>p.id===productId)?.frameFrac||0.15))).toFixed(2)} m²`,'#60a5fa']].map(([l,v,c])=>(
                  <div key={l} className="bg-white/5 rounded p-2 text-center">
                    <div className="text-white/40 mb-0.5">{l}</div>
                    <div className="font-bold" style={{color:c}}>{v}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── STEP 2: Konum & enerji ── */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card>
                <div className="text-emerald-400 text-xs font-display tracking-widest mb-4 uppercase">Şehir / Isıtma Derece Günü (HDD)</div>
                <div className="grid grid-cols-2 gap-2">
                  {CITIES.map(c => (
                    <button key={c.id} onClick={() => setCityId(c.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${cityId === c.id ? 'border-emerald-400/60 bg-emerald-500/10' : 'border-white/10 hover:border-white/25 bg-black/20'}`}>
                      <div className="text-white text-sm font-medium">{c.name}</div>
                      <div className="text-white/40 font-mono text-xs">{c.HDD ? `${c.HDD} HDD` : 'özel'}</div>
                    </button>
                  ))}
                </div>
                {cityId === 'cus' && (
                  <div className="mt-3">
                    <label className="text-white/60 text-xs mb-1 block">HDD değeri girin</label>
                    <input type="number" min={100} max={8000} step={50} value={customHDD}
                      onChange={e => setCustomHDD(e.target.value)}
                      className="w-full bg-black/40 border border-emerald-400/40 rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-emerald-400"/>
                  </div>
                )}
              </Card>

              <Card>
                <div className="text-emerald-400 text-xs font-display tracking-widest mb-4 uppercase">Nakliye Mesafesi</div>
                <div className="space-y-2">
                  {TRANSPORT_OPTS.map(t => (
                    <button key={t.id} onClick={() => setTransportId(t.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${transportId === t.id ? 'border-emerald-400/60 bg-emerald-500/10' : 'border-white/10 hover:border-white/25 bg-black/20'}`}>
                      <div className="flex justify-between">
                        <span className="text-white text-sm">{t.name}</span>
                        <span className="text-emerald-300 font-mono text-xs">{t.factor} kg CO₂/m²</span>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <div className="text-emerald-400 text-xs font-display tracking-widest mb-4 uppercase">Isıtma Enerji Kaynağı</div>
                <div className="space-y-2">
                  {ENERGY_SOURCES.map(e => (
                    <button key={e.id} onClick={() => setEnergyId(e.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${energyId === e.id ? 'border-emerald-400/60 bg-emerald-500/10' : 'border-white/10 hover:border-white/25 bg-black/20'}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-white text-sm font-medium">{e.name}</div>
                          <div className="text-white/35 text-xs">{e.desc}</div>
                        </div>
                        <span className="text-emerald-300 font-mono text-xs ml-3 shrink-0">{e.factor} kg/kWh</span>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              <Card>
                <div className="text-emerald-400 text-xs font-display tracking-widest mb-4 uppercase">Yaşam Döngüsü Süresi</div>
                <div className="space-y-2">
                  {LIFECYCLE_OPTS.map(l => (
                    <button key={l.id} onClick={() => setLifecycleId(l.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${lifecycleId === l.id ? 'border-emerald-400/60 bg-emerald-500/10' : 'border-white/10 hover:border-white/25 bg-black/20'}`}>
                      <span className="text-white text-sm">{l.label}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ── STEP 3: Sonuçlar ── */}
        {step === 3 && r && (
          <div>
            <div className="flex justify-center flex-wrap gap-2 mb-8">
              {[{id:'summary',l:'Özet'},{id:'breakdown',l:'Kırılım'},{id:'lifecycle',l:'Yaşam Döngüsü'},{id:'benchmark',l:'Karşılaştırma'},{id:'report',l:'Rapor'}].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`px-4 py-2 text-xs font-display tracking-wide border rounded-lg transition-all font-medium ${tab === t.id ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300' : 'border-white/20 text-white/55 hover:text-white hover:bg-white/5'}`}>
                  {t.l}
                </button>
              ))}
            </div>

            {tab === 'summary' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <Card className="flex flex-col items-center justify-center">
                    <div className="text-white/45 text-xs font-display tracking-widest mb-3">KARBON SINIFI</div>
                    <div className="w-28 h-28 rounded-full border-4 flex items-center justify-center mb-3"
                      style={{ borderColor: r.clsColor, boxShadow: `0 0 32px ${r.clsColor}55` }}>
                      <span className="text-4xl font-black" style={{ color: r.clsColor }}>{r.cls}</span>
                    </div>
                    <div className="text-3xl font-mono font-black text-white">{r.perM2_AtoC.toFixed(1)}</div>
                    <div className="text-white/45 text-xs mt-1">kg CO₂e / m² (A–C)</div>
                  </Card>
                  <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <MetricBox label="Toplam (A–C)" val={fmt0(r.total_AtoC)} unit="kg CO₂e" color={r.clsColor}/>
                    <MetricBox label="Gömülü Karbon (A1–A5)" val={fmt0(r.EC_total)} unit="kg CO₂e" color="#60a5fa"/>
                    <MetricBox label="İşletme Karbonu (B6)" val={fmt0(r.OC_total)} unit="kg CO₂e" color="#f87171"/>
                    <MetricBox label="Alüminyum ağırlığı" val={r.alKg.toFixed(1)} unit="kg Al" color="#a78bfa"/>
                    <MetricBox label="Cam alanı" val={r.glassArea.toFixed(2)} unit="m²" color="#34d399"/>
                    <MetricBox label="Geri dönüşüm kredisi D" val={`${r.EoL_D.toFixed(1)}`} unit="kg CO₂e" color="#22c55e" sub="(D modülü, bilgi amaçlı)"/>
                    <MetricBox label="Yıllık ısı kaybı" val={r.annualKWh.toFixed(0)} unit="kWh/yıl" color="#f59e0b"/>
                    <MetricBox label="Yıllık operasyonel CO₂" val={r.annualCO2.toFixed(1)} unit="kg CO₂e/yıl" color="#fb923c"/>
                    <MetricBox label="Toplam (A–D)" val={r.total_AtoD.toFixed(1)} unit="kg CO₂e" color="#94a3b8" sub="D dahil (ref.)"/>
                  </div>
                </div>
                <Card>
                  <div className="text-white/50 text-xs font-display mb-3">EN 15978 Yaşam Döngüsü Aşamaları</div>
                  <div className="flex gap-1 text-[10px] font-mono overflow-x-auto pb-2">
                    {[
                      { label:'A1-A3\nÜrün',     val:r.EC_A1A3, color:'#60a5fa' },
                      { label:'A4\nNakliye',    val:r.EC_A4,   color:'#818cf8' },
                      { label:'A5\nMontaj',     val:r.EC_A5,   color:'#a78bfa' },
                      { label:'B6\nİşletme',   val:r.OC_total, color:'#f87171' },
                      { label:'C4\nYıkım',     val:r.EoL_C4,  color:'#f59e0b' },
                      { label:'D\nKredi',      val:r.EoL_D,   color:'#22c55e' },
                    ].map(({ label, val, color }) => (
                      <div key={label} className="flex-1 min-w-[60px] text-center bg-white/5 rounded p-2 border border-white/8">
                        <div style={{ color }} className="font-bold text-sm">{val.toFixed(1)}</div>
                        <div className="text-white/35 text-[9px] mt-0.5 whitespace-pre-line">{label}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {tab === 'breakdown' && (
              <div className="max-w-2xl mx-auto space-y-4">
                <Card>
                  <div className="text-white font-semibold mb-5">A1–A3 Ürün Aşaması Kırılımı</div>
                  <div className="space-y-3">
                    {[
                      ['Alüminyum profil', r.EC_al,      '#60a5fa'],
                      ['Yüzey işlemi',     r.EC_surface, '#818cf8'],
                      ['Cam',              r.EC_glass,   '#34d399'],
                      ['EPDM conta',       r.EC_seal,    '#fbbf24'],
                      ['PA66 termal kesici',r.EC_pa,     '#c9a84c'],
                      ['Donanım',          r.EC_hardware,'#f87171'],
                    ].map(([l, v, c]) => (
                      <BarRow key={l} label={l} val={v} max={r.EC_A1A3} color={c}/>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between text-xs font-mono font-bold text-white/80 border-t border-white/15 pt-3">
                    <span>A1–A3 Toplam</span>
                    <span className="text-emerald-300">{r.EC_A1A3.toFixed(1)} kg CO₂e</span>
                  </div>
                </Card>
                <div className="grid grid-cols-3 gap-3">
                  <Card>
                    <div className="text-white/50 text-xs mb-2">A4 Nakliye</div>
                    <div className="text-2xl font-mono font-bold text-purple-300">{r.EC_A4.toFixed(1)}</div>
                    <div className="text-white/35 text-xs">kg CO₂e</div>
                  </Card>
                  <Card>
                    <div className="text-white/50 text-xs mb-2">A5 Montaj</div>
                    <div className="text-2xl font-mono font-bold text-blue-300">{r.EC_A5.toFixed(1)}</div>
                    <div className="text-white/35 text-xs">kg CO₂e</div>
                  </Card>
                  <Card>
                    <div className="text-white/50 text-xs mb-2">C4 Yıkım</div>
                    <div className="text-2xl font-mono font-bold text-amber-300">{r.EoL_C4.toFixed(1)}</div>
                    <div className="text-white/35 text-xs">kg CO₂e</div>
                  </Card>
                </div>
                <Card>
                  <div className="text-white font-semibold mb-3">Malzeme Ağırlıkları</div>
                  <div className="space-y-2 text-sm font-mono">
                    {[
                      ['Alüminyum',`${r.alKg.toFixed(2)} kg`,`GWP: ${r.gwpAl} kg CO₂/kg`],
                      ['Cam',`${r.glassArea.toFixed(3)} m²`,`GWP: ${glass?.gwpM2} kg/m²`],
                      ['EPDM conta',`${r.sealKg.toFixed(3)} kg`,'GWP: 2.5 kg CO₂/kg'],
                      ...(r.paKg > 0 ? [['PA66 termal kesici',`${r.paKg.toFixed(3)} kg`,'GWP: 4.5 kg CO₂/kg']] : []),
                    ].map(([l,v,s])=>(
                      <div key={l} className="flex justify-between py-1.5 border-b border-white/8">
                        <span className="text-white/70">{l}</span>
                        <div className="text-right">
                          <span className="text-emerald-300">{v}</span>
                          <span className="text-white/35 text-xs ml-3">{s}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {tab === 'lifecycle' && (
              <div className="max-w-2xl mx-auto space-y-4">
                <Card>
                  <div className="text-white font-semibold mb-4">Yıllık Operasyonel Karbon — B6</div>
                  <div className="space-y-3 text-sm font-mono">
                    {[
                      ['Cam Ug değeri',         `${glass?.Ug} W/m²K`],
                      ['Cam alanı',              `${r.glassArea.toFixed(3)} m²`],
                      ['Isıtma derece günü',     `${r.HDD} HDD`],
                      ['Yıllık ısı kaybı (cam)', `${r.annualKWh.toFixed(1)} kWh/yıl`],
                      ['Enerji faktörü',         `${energySource?.factor} kg CO₂e/kWh`],
                      ['Yıllık CO₂',             `${r.annualCO2.toFixed(2)} kg CO₂e/yıl`],
                      ['Yaşam süresi',           `${r.lifecycleYears} yıl`],
                    ].map(([l, v]) => (
                      <div key={l} className="flex justify-between py-1.5 border-b border-white/8">
                        <span className="text-white/60">{l}</span>
                        <span className="text-emerald-300">{v}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 font-bold text-base">
                      <span className="text-white">Toplam B6 (işletme)</span>
                      <span className="text-red-300">{r.OC_total.toFixed(1)} kg CO₂e</span>
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="text-white font-semibold mb-4">Gömülü vs İşletme Karbonu</div>
                  <div className="space-y-3">
                    <BarRow label="Gömülü (A1–A5)" val={r.EC_total}  max={r.total_AtoC} color="#60a5fa"/>
                    <BarRow label="İşletme B6"      val={r.OC_total} max={r.total_AtoC} color="#f87171"/>
                    <BarRow label="Yıkım C4"         val={r.EoL_C4}  max={r.total_AtoC} color="#f59e0b"/>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="bg-white/5 rounded p-3">
                      <div className="text-white/40">Gömülü karbon oranı</div>
                      <div className="text-blue-300 font-bold text-lg">{((r.EC_total/r.total_AtoC)*100).toFixed(1)}%</div>
                    </div>
                    <div className="bg-white/5 rounded p-3">
                      <div className="text-white/40">İşletme karbon oranı</div>
                      <div className="text-red-300 font-bold text-lg">{((r.OC_total/r.total_AtoC)*100).toFixed(1)}%</div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {tab === 'benchmark' && (
              <div className="max-w-2xl mx-auto space-y-4">
                <Card>
                  <div className="text-white font-semibold mb-4">AB Karşılaştırma Değerleri (kg CO₂e/m²)</div>
                  {[
                    { label:'EU Green Deal 2050 hedefi',  val:25, color:'#22c55e', type:'hedef'  },
                    { label:'En iyi uygulamalar (A+ sınıf)',val:30, color:'#84cc16', type:'ref' },
                    { label:'Mevcut hesap sonucu',          val:r.perM2_AtoC, color:r.clsColor, type:'current' },
                    { label:'AB sektör ortalaması (2023)', val:75, color:'#f59e0b', type:'ref'  },
                    { label:'Yüksek etki sınırı',          val:120, color:'#ef4444', type:'ref' },
                  ].map(b => (
                    <div key={b.label} className="mb-3">
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className={b.type==='current'?'text-white font-bold':'text-white/60'}>{b.label}</span>
                        <span style={{color:b.color}} className="font-bold">{b.val.toFixed(1)}</span>
                      </div>
                      <div className="h-2.5 bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{width:`${Math.min(100,(b.val/120)*100)}%`,background:b.color}}/>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 p-3 rounded-lg" style={{background:`${r.clsColor}15`,border:`1px solid ${r.clsColor}40`}}>
                    <div className="text-xs font-mono" style={{color:r.clsColor}}>
                      Değerlendirme: Hesaplanan {r.perM2_AtoC.toFixed(1)} kg CO₂e/m² — Sınıf {r.cls}
                      {r.perM2_AtoC < 30 ? ' · EU Green Deal 2050 hedefinin altında ✓' :
                       r.perM2_AtoC < 75 ? ' · AB sektör ortalamasının altında ✓' :
                       ' · AB sektör ortalamasının üzerinde — optimizasyon önerilir'}
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="text-white font-semibold mb-3">Azaltım Önerileri</div>
                  <div className="space-y-2 text-sm">
                    {[
                      alType?.id === 'primary_eu' && { icon:'♻️', text:'Geri dönüşüm oranı yüksek alüminyum kullanımı ile gömülü karbonu %55–80 azaltabilirsiniz.' },
                      glass?.id !== 'tg' && { icon:'🪟', text:'Üçlü cam sistemi ile işletme karbonunu %35–40 düşürebilirsiniz.' },
                      surface?.id === 'pvdf' && { icon:'🎨', text:'Toz boya yerine naturel anodize seçiminde yüzey işlemi karbonu %30 düşer.' },
                      energySource?.id === 'coal' && { icon:'⚡', text:'Isı pompasına geçişle enerji emisyon faktörünü 0.34\'den 0.11\'e indirin.' },
                      r.perM2_AtoC > 60 && { icon:'📐', text:'Çerçeve alanını minimize eden tasarım optimizasyonu ile cam/profil oranını iyileştirin.' },
                    ].filter(Boolean).map((tip, i) => tip && (
                      <div key={i} className="flex gap-3 p-3 bg-emerald-500/8 border border-emerald-500/20 rounded-lg">
                        <span className="text-lg">{tip.icon}</span>
                        <p className="text-white/75 text-sm leading-relaxed">{tip.text}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {tab === 'report' && (
              <div className="max-w-2xl mx-auto">
                <Card className="space-y-4">
                  <div className="border-b border-white/15 pb-4">
                    <div className="text-emerald-400 font-bold text-base">OZZO Alüminyum — Karbon Ayak İzi Raporu</div>
                    <div className="text-white/40 text-xs mt-1">EN 15978 · {new Date().toLocaleDateString('tr-TR',{year:'numeric',month:'long',day:'numeric'})}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    {[['Sistem',product?.name],['Alüminyum GWP',`${r.gwpAl} kg/kg`],['Cam',glass?.name],['Yüzey',surface?.name],['Boyut',`${W}×${H}m · ${qty}ad`],['Konum',city?.name],['Enerji',energySource?.name],['Süre',lifecycle?.label]].map(([l,v])=>(
                      <div key={l}><div className="text-white/30 text-[9px] uppercase mb-0.5">{l}</div><div className="text-white/80">{v}</div></div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[['Toplam A–C',`${r.total_AtoC.toFixed(1)} kg`,r.clsColor],['m² başına',`${r.perM2_AtoC.toFixed(1)} kg/m²`,r.clsColor],['Sınıf',r.cls,r.clsColor],['Gömülü',`${r.EC_total.toFixed(1)} kg`,'#60a5fa'],['İşletme',`${r.OC_total.toFixed(1)} kg`,'#f87171'],['Geri dön. kredisi',`${r.EoL_D.toFixed(1)} kg`,'#22c55e']].map(([l,v,c])=>(
                      <div key={l} className="bg-white/5 rounded-lg p-2.5 text-center font-mono">
                        <div className="text-white/30 text-[9px] mb-1">{l}</div>
                        <div className="font-bold text-sm" style={{color:c}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </Card>
                <div className="flex gap-3 mt-5 justify-center flex-wrap">
                  <button onClick={handlePreview} disabled={pdfLoading}
                    className="px-6 py-2.5 border border-emerald-400/60 bg-emerald-500/10 text-emerald-300 text-sm font-display font-bold hover:bg-emerald-500/20 transition-colors rounded-lg disabled:opacity-50">
                    {pdfLoading ? 'Hazırlanıyor...' : 'PDF Önizle'}
                  </button>
                  <button onClick={handlePDF}
                    className="px-6 py-2.5 bg-emerald-500 text-black text-sm font-display font-bold hover:bg-emerald-400 transition-colors rounded-lg shadow-[0_4px_16px_rgba(52,211,153,0.4)]">
                    PDF İndir
                  </button>
                  <button onClick={() => { setStep(0); setProductId(null) }}
                    className="px-6 py-2.5 border border-white/25 text-white/60 text-sm font-display hover:bg-white/5 transition-colors rounded-lg">
                    Yeni Hesap
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && !r && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚠️</div>
            <div className="text-white/60 mb-6">Hesaplama tamamlanamadı. Lütfen tüm seçimleri yapın.</div>
            <button onClick={() => setStep(0)} className="px-6 py-2.5 bg-emerald-500 text-black text-sm font-display font-bold rounded-lg">Başa Dön</button>
          </div>
        )}

        {/* Nav */}
        {step < 3 && (
          <div className="flex justify-between mt-12">
            <button onClick={() => setStep(s => Math.max(0, s - 1))}
              className={`px-6 py-2.5 border border-white/25 text-white/65 text-sm font-display rounded-lg transition-colors ${step === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-white/5'}`}>
              ← Geri
            </button>
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
              className={`px-8 py-2.5 text-sm font-display tracking-wide rounded-lg transition-all font-medium ${canNext() ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_4px_20px_rgba(52,211,153,0.35)]' : 'border border-white/15 text-white/25 cursor-not-allowed'}`}>
              {step === 2 ? 'Hesapla →' : 'İleri →'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex justify-center mt-10">
            <button onClick={() => setStep(2)}
              className="px-6 py-2.5 border border-white/20 text-white/45 text-sm font-display rounded-lg hover:bg-white/5 hover:text-white/70 transition-colors">
              ← Seçimleri Değiştir
            </button>
          </div>
        )}

      </div>
    </div>

    {pdfPreviewUrl && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setPdfPreviewUrl(null)}>
        <div className="relative w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-5 py-3 bg-[#141e32] border-b border-white/10">
            <span className="text-white font-display font-bold text-sm tracking-wide">Karbon Ayak İzi Raporu — Önizleme</span>
            <div className="flex gap-2">
              <button onClick={handlePDF} className="px-4 py-1.5 bg-emerald-500 text-black text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors">PDF İndir</button>
              <button onClick={() => setPdfPreviewUrl(null)} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-sm">✕</button>
            </div>
          </div>
          <iframe src={pdfPreviewUrl} className="w-full h-[calc(90vh-52px)] border-0" title="PDF Önizleme"/>
        </div>
      </div>
    )}
    </>
  )
}
