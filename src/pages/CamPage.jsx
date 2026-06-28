import { useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import RaporIndir from '../components/RaporIndir'
import { buildReportHeader, buildReportFooter } from '../utils/raporProfili'

/* ════════════════════════════════════════════════════════
   OZZO CAM HESAPLAYICI
   Standartlar: EN ISO 10077-1, EN 673, EN 410, EN ISO 717-1
   TS 825 İklim Bölgesi Uyum Kontrolü
   ════════════════════════════════════════════════════════ */

const GLASS_PRESETS = [
  { id: 1, name: 'Tek Cam (6 mm)', category: 'Tek Cam', ug: 5.8, g: 0.85, lt: 88, rw: 31, tv: 88, composition: '6', standard: 'EN 673', desc: 'Standart tek cam — enerji verimliliği düşük' },
  { id: 2, name: 'Çift Cam 4/16Ar/4', category: 'Çift Cam', ug: 1.1, g: 0.62, lt: 80, rw: 31, tv: 80, composition: '4 / 16Ar / 4', standard: 'EN 673 · EN 410', desc: 'Argon dolgulu standart çift cam' },
  { id: 3, name: 'Çift Cam Low-E 4/16Ar/4', category: 'Çift Cam Low-E', ug: 0.6, g: 0.40, lt: 72, rw: 32, tv: 72, composition: '4 Low-E / 16Ar / 4', standard: 'EN 673 · EN 410', desc: 'Düşük yayınımlı kaplama — ısı yansıtmalı' },
  { id: 4, name: 'Üçlü Cam 4/12/4/12/4', category: 'Üçlü Cam', ug: 0.5, g: 0.35, lt: 65, rw: 36, tv: 65, composition: '4 / 12Ar / 4 / 12Ar / 4', standard: 'EN 673 · EN 410', desc: 'Pasif ev standardı — yüksek enerji verimliliği' },
  { id: 5, name: 'Güneş Kontrol (g=0.25)', category: 'Güneş Kontrol', ug: 1.1, g: 0.25, lt: 55, rw: 31, tv: 55, composition: '6 SC / 16Ar / 4', standard: 'EN 410 · EN 673', desc: 'Güney cephe, yaz konforu' },
  { id: 6, name: 'Güneş Kontrol Low-E', category: 'Güneş Kontrol', ug: 0.6, g: 0.22, lt: 48, rw: 33, tv: 48, composition: '6 SC / 16Ar / 4 Low-E', standard: 'EN 410 · EN 673', desc: 'Maksimum enerji verimliliği + güneş kontrolü' },
  { id: 7, name: 'Akustik Lamine 6.4/16/4', category: 'Akustik', ug: 1.0, g: 0.60, lt: 78, rw: 42, tv: 78, composition: '33.2 Lam / 16 / 4', standard: 'EN ISO 717-1 · EN 673', desc: 'Yüksek ses yalıtımı — lamine güvenlik camı' },
  { id: 8, name: 'Akustik Lamine Üçlü', category: 'Akustik', ug: 0.5, g: 0.33, lt: 62, rw: 46, tv: 62, composition: '44.2 Lam / 12Ar / 4 / 12Ar / 4', standard: 'EN ISO 717-1 · EN 673', desc: 'En yüksek ses + ısı kombinasyonu' },
  { id: 9, name: 'Vakumlu Cam (VIG)', category: 'Vakumlu', ug: 0.4, g: 0.55, lt: 70, rw: 35, tv: 70, composition: '4 / Vakum / 4', standard: 'EN 673', desc: 'Ultra ince vakumlu cam — tarihi yapı restorasyonu' },
]

const FRAME_TYPES = [
  { id: 1, name: 'Alüm. Termal Kesimli', uf: 1.4, desc: 'PA66 ısı kesme köprüsü', standard: 'EN ISO 10077-2' },
  { id: 2, name: 'Alüm. Termal Kesimli+', uf: 1.0, desc: 'Gelişmiş termal köprü + izolasyon', standard: 'EN ISO 10077-2' },
  { id: 3, name: 'Alüminyum Standart', uf: 5.9, desc: 'Termal kesme yok', standard: 'EN ISO 10077-2' },
  { id: 4, name: 'PVC 3 Odacıklı', uf: 1.8, desc: 'Standart PVC profil', standard: 'EN ISO 10077-2' },
  { id: 5, name: 'PVC 5 Odacıklı', uf: 1.2, desc: 'Yüksek verimli PVC', standard: 'EN ISO 10077-2' },
  { id: 6, name: 'PVC 6 Odacıklı', uf: 0.9, desc: 'Pasif ev PVC profili', standard: 'EN ISO 10077-2' },
  { id: 7, name: 'Ahşap (60 mm)', uf: 1.3, desc: 'Geleneksel çam/meşe', standard: 'EN ISO 10077-2' },
  { id: 8, name: 'Kompozit (Alüm+PVC)', uf: 1.0, desc: 'Dış alüm. iç PVC', standard: 'EN ISO 10077-2' },
]

const SPACER_TYPES = [
  { id: 1, name: 'Alüminyum (Standart)', psi: 0.08, label: 'Yüksek ısı köprüsü' },
  { id: 2, name: 'Çelik (Paslanmaz)', psi: 0.06, label: 'Orta ısı köprüsü' },
  { id: 3, name: 'Termix / Swisspacer', psi: 0.035, label: 'Warm-edge — düşük ısı köprüsü' },
  { id: 4, name: 'TPS (Polimer)', psi: 0.020, label: 'Ultra warm-edge' },
]

const CITIES = [
  { name: 'İstanbul', zone: 3, hdd: 1850 },
  { name: 'Ankara', zone: 4, hdd: 3100 },
  { name: 'İzmir', zone: 2, hdd: 900 },
  { name: 'Bursa', zone: 3, hdd: 2100 },
  { name: 'Antalya', zone: 1, hdd: 600 },
  { name: 'Erzurum', zone: 4, hdd: 5100 },
  { name: 'Trabzon', zone: 3, hdd: 2200 },
  { name: 'Konya', zone: 4, hdd: 3400 },
  { name: 'Diyarbakır', zone: 3, hdd: 2400 },
  { name: 'Samsun', zone: 3, hdd: 2000 },
  { name: 'Adana', zone: 1, hdd: 500 },
  { name: 'Gaziantep', zone: 2, hdd: 1400 },
]

const ORIENTATIONS = [
  { id: 'N', label: 'Kuzey', solarGain: 0.15 },
  { id: 'S', label: 'Güney', solarGain: 1.0 },
  { id: 'E', label: 'Doğu', solarGain: 0.55 },
  { id: 'W', label: 'Batı', solarGain: 0.55 },
]

const U_LIMITS = { 1: 1.8, 2: 1.6, 3: 1.4, 4: 1.2 }

const scoreColor = uw => uw <= 0.6 ? 'text-emerald-400' : uw <= 0.8 ? 'text-green-400' : uw <= 1.2 ? 'text-lime-400' : uw <= 1.6 ? 'text-yellow-400' : uw <= 2.0 ? 'text-orange-400' : 'text-red-400'
const scoreLabel = uw => uw <= 0.6 ? 'A+++ — Pasif Ev' : uw <= 0.8 ? 'A++ — Mükemmel' : uw <= 1.0 ? 'A+ — Çok İyi (nZEB)' : uw <= 1.2 ? 'A — İyi' : uw <= 1.6 ? 'B — Orta' : uw <= 2.0 ? 'C — Yeterli' : 'D — Yetersiz'
const scoreBg    = uw => uw <= 0.8 ? 'bg-emerald-900/20 border-emerald-600/30' : uw <= 1.2 ? 'bg-green-900/20 border-green-600/30' : uw <= 1.6 ? 'bg-yellow-900/20 border-yellow-600/30' : 'bg-red-900/20 border-red-600/30'
const acousticClass = rw => rw >= 45 ? { cls: 'A', color: 'text-emerald-400' } : rw >= 40 ? { cls: 'B', color: 'text-green-400' } : rw >= 35 ? { cls: 'C', color: 'text-yellow-400' } : rw >= 30 ? { cls: 'D', color: 'text-orange-400' } : { cls: 'E', color: 'text-red-400' }
const solarClass = g => g <= 0.25 ? { lbl: 'Güneş Kontrol', col: 'text-blue-400' } : g <= 0.45 ? { lbl: 'Düşük-Orta', col: 'text-green-400' } : g <= 0.60 ? { lbl: 'Standart', col: 'text-yellow-400' } : { lbl: 'Yüksek Güneş', col: 'text-orange-400' }

export default function CamPage() {
  const navigate  = useNavigate()
  const [tab,      setTab]      = useState('hesap')
  const [glassId,  setGlassId]  = useState(2)
  const [frameId,  setFrameId]  = useState(1)
  const [spacerId, setSpacerId] = useState(2)
  const [width,    setWidth]    = useState(120)
  const [height,   setHeight]   = useState(150)
  const [city,     setCity]     = useState(CITIES[0])
  const [count,    setCount]    = useState(1)
  const [orient,   setOrient]   = useState('S')
  const [catFilter,setCatFilter]= useState('Tümü')

  const glass  = GLASS_PRESETS.find(g => g.id === glassId)
  const frame  = FRAME_TYPES.find(f => f.id === frameId)
  const spacer = SPACER_TYPES.find(s => s.id === spacerId)

  const calc = useMemo(() => {
    const W  = width / 100, H = height / 100, fw = 0.075
    const Ag = Math.max(0.01, (W - fw) * (H - fw))
    const Af = W * H - Ag
    const lg = 2 * ((W - fw) + (H - fw))
    const Uw = (glass.ug * Ag + frame.uf * Af + spacer.psi * lg) / (W * H)
    const limit = U_LIMITS[city.zone]
    const annualHeatLoss = Uw * (W * H) * city.hdd * 24 / 1000
    const oriData = ORIENTATIONS.find(o => o.id === orient)
    const solarDay = glass.g * Ag * 1000 * oriData.solarGain * 180
    const shgc   = (glass.g * 0.87).toFixed(3)
    const ltSC   = (glass.lt / (glass.g * 100)).toFixed(2)
    const acClass = acousticClass(glass.rw)
    const solCls  = solarClass(glass.g)
    const linearBridge = spacer.psi * lg
    const condensRisk = Uw > 2.0 ? 'Yüksek' : Uw > 1.4 ? 'Orta' : 'Düşük'
    return { Ag, Af, lg, Uw, limit, pass: Uw <= limit, annualHeatLoss, annualLossAll: annualHeatLoss * count, shgc, ltSC, acClass, solCls, euPass: { passive: Uw <= 0.8, nzeb: Uw <= 1.0, lowEnergy: Uw <= 1.3 }, linearBridge, condensRisk, oriData, solarDay, netGain: solarDay - annualHeatLoss * 1000, W, H }
  }, [glass, frame, spacer, width, height, city, count, orient])

  const categories = ['Tümü', ...new Set(GLASS_PRESETS.map(g => g.category))]

  function buildCamHtml(profil) {
    const rNo  = `OZZ-CAM-${Date.now().toString().slice(-6)}`
    const sc   = calc.pass ? '#10b981' : '#ef4444'
    const uw   = calc.Uw.toFixed(2)
    const rows = [
      ['Pencere Uw Değeri (EN ISO 10077-1)', `${uw} W/m²K`, scoreLabel(calc.Uw)],
      ['Cam Ug Değeri (EN 673)', `${glass.ug} W/m²K`, glass.composition],
      ['Çerçeve Uf (EN ISO 10077-2)', `${frame.uf} W/m²K`, frame.name],
      ['Doğrusal Isı Köprüsü ψ (EN ISO 14683)', `${spacer.psi} W/mK`, spacer.name],
      ['Lineer Isı Köprüsü Δ', `${calc.linearBridge.toFixed(3)} W/K`, ''],
      ['Güneş Faktörü g (EN 410)', `${glass.g}`, calc.solCls.lbl],
      ['Solar Heat Gain Coefficient SHGC', calc.shgc, ''],
      ['Işık Geçirgenliği τv (EN 410)', `${glass.lt} %`, ''],
      ['LSG Oranı (Işık/Güneş)', calc.ltSC, calc.ltSC > 1.25 ? 'İyi' : 'Orta'],
      ['Ses Azaltım Rw (EN ISO 717-1)', `${glass.rw} dB`, `Sınıf ${calc.acClass.cls}`],
      ['TS 825 Uyumu', calc.pass ? 'UYGUN' : 'UYGUN DEĞİL', `Bölge ${city.zone} — Limit ${calc.limit} W/m²K`],
      ['Pasif Ev Standardı (PHI ≤0.80)', calc.euPass.passive ? '✓ UYGUN' : '✗ UYGUN DEĞİL', ''],
      ['nZEB (AB 2018/844 ≤1.00)', calc.euPass.nzeb ? '✓ UYGUN' : '✗ UYGUN DEĞİL', ''],
      ['Yoğuşma Riski', calc.condensRisk, ''],
      ['Yıllık Isı Kaybı (1 adet)', `${calc.annualHeatLoss.toFixed(0)} kWh/yıl`, ''],
      [`Yıllık Isı Kaybı (${count} adet)`, `${calc.annualLossAll.toFixed(0)} kWh/yıl`, ''],
    ].map(([l, v, n]) => `<tr style="border-bottom:1px solid #eee"><td style="padding:8px;font-size:12px;color:#555">${l}</td><td style="padding:8px;font-size:13px;font-weight:700">${v}</td><td style="padding:8px;font-size:11px;color:#888">${n}</td></tr>`).join('')

    return `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>CAM Raporu ${rNo}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;padding:40px;color:#111}table{width:100%;border-collapse:collapse}th{background:#f8f8f8;padding:8px;font-size:11px;text-align:left;font-weight:700;color:#555;text-transform:uppercase}.badge{display:inline-block;padding:6px 16px;border-radius:4px;font-size:18px;font-weight:800;border:2px solid}.sec{margin-bottom:20px}.st{font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#888;border-bottom:1px solid #eee;padding-bottom:6px;margin-bottom:12px}@media print{body{padding:20px}}</style>
</head><body>
<div>${buildReportHeader(profil, 'CAM & PENCERE PERFORMANS RAPORU', 'EN ISO 10077-1 · EN 673 · EN 410 · EN ISO 717-1 · TS 825', rNo)}</div>
<div class="sec" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
  <div><p style="font-size:11px;color:#888;text-transform:uppercase;margin-bottom:4px">Pencere Uw Değeri</p><span class="badge" style="color:${sc};border-color:${sc}">${uw} W/m²K</span><p style="font-size:13px;font-weight:700;color:${sc};margin-top:6px">${scoreLabel(calc.Uw)}</p></div>
  <div style="text-align:right"><p style="font-size:11px;color:#888">TS 825 Uyumu</p><p style="font-size:18px;font-weight:800;color:${sc}">${calc.pass ? '✓ UYGUN' : '✗ UYGUN DEĞİL'}</p><p style="font-size:11px;color:#888">${city.name} — Bölge ${city.zone} — Limit ${calc.limit} W/m²K</p></div>
</div>
<div class="sec"><div class="st">Tasarım Bilgileri</div><table><thead><tr><th>Parametre</th><th>Değer</th><th>Not</th></tr></thead><tbody>
<tr style="border-bottom:1px solid #eee"><td style="padding:8px;font-size:12px;color:#555">Cam</td><td style="padding:8px;font-size:13px;font-weight:700">${glass.name}</td><td style="padding:8px;font-size:11px;color:#888">${glass.composition}</td></tr>
<tr style="border-bottom:1px solid #eee"><td style="padding:8px;font-size:12px;color:#555">Çerçeve</td><td style="padding:8px;font-size:13px;font-weight:700">${frame.name}</td><td style="padding:8px;font-size:11px;color:#888">${frame.desc}</td></tr>
<tr style="border-bottom:1px solid #eee"><td style="padding:8px;font-size:12px;color:#555">Spacer</td><td style="padding:8px;font-size:13px;font-weight:700">${spacer.name}</td><td style="padding:8px;font-size:11px;color:#888">${spacer.label}</td></tr>
<tr style="border-bottom:1px solid #eee"><td style="padding:8px;font-size:12px;color:#555">Boyut / Adet</td><td style="padding:8px;font-size:13px;font-weight:700">${width} × ${height} cm · ${count} adet</td><td style="padding:8px;font-size:11px;color:#888">${city.name}</td></tr>
</tbody></table></div>
<div class="sec"><div class="st">Performans Parametreleri</div><table><thead><tr><th>Parametre</th><th>Değer</th><th>Not</th></tr></thead><tbody>${rows}</tbody></table></div>
${buildReportFooter(profil, rNo)}
</body></html>`
  }

  return (
    <div className="min-h-screen bg-[#070d1f] text-white pb-16">
      <div className="bg-gradient-to-b from-[#0d1630] to-[#070d1f] pt-10 pb-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-extrabold mb-1">Cam & Pencere Hesaplayıcı</h1>
              <p className="text-gray-400 text-sm">EN ISO 10077-1 · EN 673 · EN 410 · EN ISO 717-1 · TS 825</p>
            </div>
            <RaporIndir buildHtml={buildCamHtml} className="hidden sm:flex items-center gap-2 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-gold-400 text-xs font-bold px-4 py-2.5 rounded-xl transition-all">
              📄 Rapor İndir
            </RaporIndir>
          </div>
          <div className="flex gap-1 mt-4 bg-[#0d1630] rounded-xl p-1 max-w-md">
            {[{ id: 'hesap', label: 'Hesaplama' }, { id: 'katalog', label: 'Cam Kataloğu' }, { id: 'compare', label: 'Karşılaştır' }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${tab === t.id ? 'bg-gold-500 text-black' : 'text-gray-400 hover:text-white'}`}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-4">

        {tab === 'hesap' && <>
          {/* Cam */}
          <div className="bg-[#0d1630] rounded-2xl p-5 border border-blue-800/20">
            <h2 className="font-bold mb-3 text-blue-300 text-sm uppercase tracking-wider">🪟 Cam Tipi <span className="text-gray-500 text-[10px] normal-case font-normal">EN 673 · EN 410</span></h2>
            <div className="grid gap-2">
              {GLASS_PRESETS.map(g => (
                <button key={g.id} onClick={() => setGlassId(g.id)}
                  className={`text-left p-3 rounded-xl border transition-all ${glassId === g.id ? 'border-blue-500 bg-blue-900/20' : 'border-blue-800/20 hover:border-blue-700/40'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{g.name}</p>
                      <p className="text-xs text-gray-500">{g.composition} · {g.desc}</p>
                      <p className="text-[10px] text-blue-400/60 mt-0.5">{g.standard}</p>
                    </div>
                    <div className="text-right text-xs space-y-0.5 flex-shrink-0">
                      <p className="text-blue-300">Ug <span className="font-black">{g.ug}</span></p>
                      <p className="text-yellow-300">g <span className="font-black">{g.g}</span></p>
                      <p className="text-green-300">Rw <span className="font-black">{g.rw}</span> dB</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Çerçeve + Spacer */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-[#0d1630] rounded-2xl p-5 border border-blue-800/20">
              <h2 className="font-bold mb-3 text-blue-300 text-sm uppercase tracking-wider">Çerçeve <span className="text-gray-500 text-[10px] normal-case font-normal">EN ISO 10077-2</span></h2>
              <div className="space-y-2">
                {FRAME_TYPES.map(f => (
                  <button key={f.id} onClick={() => setFrameId(f.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${frameId === f.id ? 'border-blue-500 bg-blue-900/20' : 'border-blue-800/20 hover:border-blue-700/40'}`}>
                    <div className="flex items-center justify-between">
                      <div><p className="font-semibold text-xs">{f.name}</p><p className="text-xs text-gray-500">{f.desc}</p></div>
                      <p className="text-blue-300 text-xs font-black">{f.uf} W/m²K</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-[#0d1630] rounded-2xl p-5 border border-blue-800/20">
              <h2 className="font-bold mb-3 text-blue-300 text-sm uppercase tracking-wider">Ara Profil <span className="text-gray-500 text-[10px] normal-case font-normal">EN ISO 14683</span></h2>
              <div className="space-y-2 mb-4">
                {SPACER_TYPES.map(s => (
                  <button key={s.id} onClick={() => setSpacerId(s.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${spacerId === s.id ? 'border-blue-500 bg-blue-900/20' : 'border-blue-800/20 hover:border-blue-700/40'}`}>
                    <div className="flex items-center justify-between">
                      <div><p className="font-semibold text-xs">{s.name}</p><p className="text-[10px] text-gray-500">{s.label}</p></div>
                      <p className="text-blue-300 text-xs font-black">ψ={s.psi}</p>
                    </div>
                  </button>
                ))}
              </div>
              <h3 className="text-xs text-blue-300 font-bold uppercase tracking-wider mb-2">Cephe Yönü</h3>
              <div className="grid grid-cols-4 gap-1.5">
                {ORIENTATIONS.map(o => (
                  <button key={o.id} onClick={() => setOrient(o.id)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${orient === o.id ? 'bg-gold-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Boyutlar */}
          <div className="bg-[#0d1630] rounded-2xl p-5 border border-blue-800/20">
            <h2 className="font-bold mb-3 text-blue-300 text-sm uppercase tracking-wider">Boyutlar & Konum</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Genişlik (cm)', val: width, set: v => setWidth(Math.max(10, v)) },
                { label: 'Yükseklik (cm)', val: height, set: v => setHeight(Math.max(10, v)) },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs text-gray-400 mb-1 block">{f.label}</label>
                  <input type="number" value={f.val} onChange={e => f.set(+e.target.value)}
                    className="w-full bg-[#1a2444] border border-blue-700/30 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Şehir (TS 825)</label>
                <select value={city.name} onChange={e => setCity(CITIES.find(c => c.name === e.target.value))}
                  className="w-full bg-[#1a2444] border border-blue-700/30 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500">
                  {CITIES.map(c => <option key={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Adet</label>
                <input type="number" value={count} onChange={e => setCount(Math.max(1, +e.target.value))}
                  className="w-full bg-[#1a2444] border border-blue-700/30 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="bg-[#0d1630] rounded-2xl p-5 border border-blue-800/20">
            <h2 className="font-bold mb-4 text-blue-300 text-sm uppercase tracking-wider">Hesaplama Sonuçları</h2>

            <div className={`text-center mb-4 p-5 rounded-2xl border ${scoreBg(calc.Uw)}`}>
              <p className="text-xs text-gray-500 mb-1">Pencere Isıl İletkenliği Uw — EN ISO 10077-1</p>
              <p className={`text-6xl font-black ${scoreColor(calc.Uw)}`}>{calc.Uw.toFixed(2)}</p>
              <p className="text-sm text-gray-400 mt-1">W/m²K</p>
              <p className={`text-base font-bold mt-2 ${scoreColor(calc.Uw)}`}>{scoreLabel(calc.Uw)}</p>
            </div>

            <div className={`flex items-center gap-3 p-3 rounded-xl mb-4 ${calc.pass ? 'bg-green-900/20 border border-green-700/30' : 'bg-red-900/20 border border-red-700/30'}`}>
              <span className="text-2xl">{calc.pass ? '✅' : '❌'}</span>
              <div>
                <p className={`font-bold text-sm ${calc.pass ? 'text-green-400' : 'text-red-400'}`}>TS 825 — {city.name} İklim Bölgesi {city.zone}</p>
                <p className="text-xs text-gray-400">Limit: Uw ≤ {calc.limit} W/m²K · Hesaplanan: {calc.Uw.toFixed(2)} W/m²K{!calc.pass ? ` · +${(calc.Uw - calc.limit).toFixed(2)} aşım` : ''}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: 'Pasif Ev', sublabel: 'PHI ≤0.80', ok: calc.euPass.passive },
                { label: 'nZEB', sublabel: 'AB ≤1.00', ok: calc.euPass.nzeb },
                { label: 'Düşük Enerji', sublabel: '≤1.30', ok: calc.euPass.lowEnergy },
              ].map(s => (
                <div key={s.label} className={`rounded-xl p-3 text-center border ${s.ok ? 'bg-green-900/10 border-green-700/20' : 'bg-red-900/10 border-red-700/20'}`}>
                  <p className={`text-lg font-black ${s.ok ? 'text-green-400' : 'text-red-500'}`}>{s.ok ? '✓' : '✗'}</p>
                  <p className="text-xs font-semibold text-white">{s.label}</p>
                  <p className="text-[10px] text-gray-500">{s.sublabel}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {[
                { label: 'Cam Ug (EN 673)', val: `${glass.ug} W/m²K`, sub: glass.composition },
                { label: 'Güneş Faktörü g (EN 410)', val: glass.g.toFixed(2), sub: calc.solCls.lbl },
                { label: 'SHGC', val: calc.shgc, sub: 'Solar Heat Gain Coeff.' },
                { label: 'Işık Geçirgenliği τv', val: `${glass.lt} %`, sub: 'EN 410' },
                { label: 'LSG Oranı', val: calc.ltSC, sub: 'Işık/Güneş' },
                { label: 'Ses Azaltımı Rw', val: `${glass.rw} dB`, sub: `Sınıf ${calc.acClass.cls} · EN ISO 717-1` },
                { label: 'Doğrusal Isı Köprüsü', val: `${calc.linearBridge.toFixed(3)} W/K`, sub: `ψ=${spacer.psi} · EN ISO 14683` },
                { label: 'Yoğuşma Riski', val: calc.condensRisk, sub: '' },
                { label: 'Cam Alanı Ag', val: `${calc.Ag.toFixed(3)} m²`, sub: `Çerçeve: ${calc.Af.toFixed(3)} m²` },
                { label: 'Yıllık Isı Kaybı', val: `${calc.annualHeatLoss.toFixed(0)} kWh`, sub: `${count} adet: ${calc.annualLossAll.toFixed(0)} kWh/yıl` },
                { label: 'Güneş Enerjisi Kazancı', val: `${(calc.solarDay/1000).toFixed(0)} kWh/yıl`, sub: `${calc.oriData.label} cephe` },
                { label: 'Net Enerji Dengesi', val: `${calc.netGain > 0 ? '+' : ''}${(calc.netGain/1000).toFixed(0)} kWh`, sub: calc.netGain > 0 ? 'Net Kazanç' : 'Net Kayıp' },
              ].map(item => (
                <div key={item.label} className="bg-[#070d1f] rounded-xl p-3">
                  <p className="text-[10px] text-gray-500 leading-tight">{item.label}</p>
                  <p className="font-bold text-sm mt-0.5">{item.val}</p>
                  {item.sub && <p className="text-[10px] text-gray-600 mt-0.5">{item.sub}</p>}
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-600 text-center mb-4">EN ISO 10077-1:2017 · EN 673:2011 · EN 410:2011 · EN ISO 717-1:2013 · EN ISO 14683:2017 · TS 825</p>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <RaporIndir buildHtml={buildCamHtml} className="w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-black font-bold py-3 rounded-xl text-sm transition-all">
                📄 Tam Rapor İndir (Tüm Avrupa Standartları)
              </RaporIndir>
              <div className="flex gap-2">
                <button onClick={() => { sessionStorage.setItem('ozzo_cam_transfer', JSON.stringify({ Uw: calc.Uw, glass, frame, width, height, city: city.name })); navigate('/flixo') }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#070d1f] hover:bg-[#1a2444] border border-blue-500/20 text-blue-300 text-xs font-semibold py-2.5 rounded-xl transition-all">
                  🌡 Flixo'ya Aktar
                </button>
                <button onClick={() => { sessionStorage.setItem('ozzo_cam_transfer', JSON.stringify({ Uw: calc.Uw, glass, width, height, annualLoss: calc.annualHeatLoss })); navigate('/carbon') }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#070d1f] hover:bg-[#1a2444] border border-green-500/20 text-green-300 text-xs font-semibold py-2.5 rounded-xl transition-all">
                  🌿 Karbon'a Aktar
                </button>
              </div>
            </div>
          </div>
        </>}

        {tab === 'katalog' && (
          <div className="bg-[#0d1630] rounded-2xl p-5 border border-blue-800/20">
            <h2 className="font-bold mb-4 text-blue-300 text-sm uppercase tracking-wider">Cam Performans Kataloğu</h2>
            <div className="flex gap-1.5 flex-wrap mb-4">
              {categories.map(c => (
                <button key={c} onClick={() => setCatFilter(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${catFilter === c ? 'bg-gold-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{c}</button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-white/10">{['Cam Tipi', 'Kompozisyon', 'Ug', 'g', 'τv %', 'Rw dB', 'SHGC', 'Standart'].map(h => <th key={h} className="text-left py-2 px-2 text-gray-500 font-semibold whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>
                  {GLASS_PRESETS.filter(g => catFilter === 'Tümü' || g.category === catFilter).map(g => {
                    const ac = acousticClass(g.rw)
                    return (
                      <tr key={g.id} className="border-b border-white/5 hover:bg-white/3 cursor-pointer" onClick={() => { setGlassId(g.id); setTab('hesap') }}>
                        <td className="py-2.5 px-2 font-semibold text-white">{g.name}</td>
                        <td className="py-2.5 px-2 font-mono text-blue-300 text-[10px]">{g.composition}</td>
                        <td className="py-2.5 px-2 font-black" style={{ color: g.ug <= 0.8 ? '#10b981' : g.ug <= 1.5 ? '#facc15' : '#f87171' }}>{g.ug}</td>
                        <td className="py-2.5 px-2 text-yellow-300 font-bold">{g.g}</td>
                        <td className="py-2.5 px-2 text-gray-400">{g.lt}</td>
                        <td className={`py-2.5 px-2 font-bold ${ac.color}`}>{g.rw} ({ac.cls})</td>
                        <td className="py-2.5 px-2 text-gray-400">{(g.g * 0.87).toFixed(3)}</td>
                        <td className="py-2.5 px-2 text-[9px] text-blue-400/70">{g.standard}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-600 mt-3">Bir satıra tıklayarak o cam tipini hesaplamaya aktar.</p>
          </div>
        )}

        {tab === 'compare' && (
          <div className="bg-[#0d1630] rounded-2xl p-5 border border-blue-800/20">
            <h2 className="font-bold mb-4 text-blue-300 text-sm uppercase tracking-wider">Cam Tipi Karşılaştırma</h2>
            <p className="text-xs text-gray-500 mb-3">Mevcut çerçeve: {frame.name} · Spacer: {spacer.name} ile tüm cam tipleri karşılaştırılıyor.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-white/10">
                  {['Cam Tipi', 'Uw W/m²K', 'g', 'Rw dB', 'Sınıf', 'TS825 B3', 'nZEB', 'Pasif'].map(h => <th key={h} className="text-left py-2 px-2 text-gray-500 whitespace-nowrap">{h}</th>)}
                </tr></thead>
                <tbody>
                  {GLASS_PRESETS.map(g => {
                    const W2 = width/100, H2 = height/100, fw = 0.075
                    const Ag2 = Math.max(0.01, (W2-fw)*(H2-fw)), Af2 = W2*H2 - Ag2
                    const lg2 = 2*((W2-fw)+(H2-fw))
                    const Uw2 = (g.ug*Ag2 + frame.uf*Af2 + spacer.psi*lg2) / (W2*H2)
                    return (
                      <tr key={g.id} className={`border-b border-white/5 ${glassId === g.id ? 'bg-blue-900/20' : 'hover:bg-white/3'}`}>
                        <td className="py-2.5 px-2 font-semibold text-white text-[11px]">{g.name}</td>
                        <td className={`py-2.5 px-2 font-black ${scoreColor(Uw2)}`}>{Uw2.toFixed(2)}</td>
                        <td className="py-2.5 px-2 text-yellow-300">{g.g}</td>
                        <td className="py-2.5 px-2 text-green-300">{g.rw}</td>
                        <td className={`py-2.5 px-2 font-bold text-[10px] ${scoreColor(Uw2)}`}>{scoreLabel(Uw2).split('—')[0].trim()}</td>
                        <td className="py-2.5 px-2 text-center">{Uw2 <= 1.4 ? '✅' : '❌'}</td>
                        <td className="py-2.5 px-2 text-center">{Uw2 <= 1.0 ? '✅' : '❌'}</td>
                        <td className="py-2.5 px-2 text-center">{Uw2 <= 0.8 ? '✅' : '❌'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
