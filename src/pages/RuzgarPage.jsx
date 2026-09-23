import { useState, useMemo } from 'react'
import RaporProfilModal from '../components/RaporProfilModal'
import RaporIndir from '../components/RaporIndir'
import { buildReportHeader, buildReportFooter } from '../utils/raporProfili'

/* ═══════════════════════════════════════════════════════════════
   AluSight RÜZGAR YÜKÜ HESAPLAYICI
   Standart: TS EN 1991-1-4:2005 / Eurocode 1 Bölüm 1-4
   Formüller: EN 1991-1-4 Madde 4.3, 4.4, 4.5, 5.2, 7.2
   ═══════════════════════════════════════════════════════════════ */

/* Arazi Kategorileri — EN 1991-1-4 Tablo 4.1 */
const TERRAIN = [
  { id: 0, label: 'Kat. 0 — Açık deniz / Göl kıyısı', kr: 0.156, z0: 0.003, zmin: 1,  desc: 'Hiç engel yok' },
  { id: 1, label: 'Kat. I — Deniz kıyısı / Bozkır',   kr: 0.170, z0: 0.01,  zmin: 1,  desc: 'Seyrek bitki örtüsü' },
  { id: 2, label: 'Kat. II — Kırsal / Açık alan',      kr: 0.190, z0: 0.05,  zmin: 2,  desc: 'Çalı, küçük engeller' },
  { id: 3, label: 'Kat. III — Banliyö / Ormanlık',     kr: 0.215, z0: 0.30,  zmin: 5,  desc: 'Sık bina veya ağaç' },
  { id: 4, label: 'Kat. IV — Şehir merkezi',           kr: 0.235, z0: 1.00,  zmin: 10, desc: '>15 m yüksek binalar' },
]

/* Türkiye Rüzgar Bölgeleri — TS EN 1991-1-4 Ulusal Ek */
const WIND_ZONES = [
  { name: 'İstanbul',     vb0: 30 }, { name: 'Ankara',   vb0: 28 },
  { name: 'İzmir',        vb0: 28 }, { name: 'Antalya',  vb0: 26 },
  { name: 'Bursa',        vb0: 26 }, { name: 'Trabzon',  vb0: 30 },
  { name: 'Erzurum',      vb0: 32 }, { name: 'Adana',    vb0: 26 },
  { name: 'Kocaeli',      vb0: 30 }, { name: 'Samsun',   vb0: 28 },
  { name: 'Gaziantep',    vb0: 26 }, { name: 'Konya',    vb0: 26 },
  { name: 'Diyarbakır',   vb0: 28 }, { name: 'Muğla',    vb0: 28 },
  { name: 'Özel Giriş',   vb0: null },
]

/* Dış Basınç Katsayıları — EN 1991-1-4 Şekil 7.5 (Dikey duvarlar, h/d oranına göre) */
const CPE_WALLS = {
  D: { name: 'D — Rüzgar Alan Cephe',  cpe10: 0.8,  cpe1: 1.0  },
  E: { name: 'E — Rüzgar Arkası',      cpe10: -0.5, cpe1: -0.5 },
  A: { name: 'A — Yan Cephe Uç',       cpe10: -1.2, cpe1: -1.4 },
  B: { name: 'B — Yan Cephe Orta',     cpe10: -0.8, cpe1: -1.1 },
  C: { name: 'C — Yan Cephe İç',       cpe10: -0.5, cpe1: -0.5 },
}

/* İç Basınç Katsayıları — EN 1991-1-4 Tablo 7.13 */
const CPI_OPTIONS = [
  { id: 'closed',   label: 'Kapalı Bina (Cpi = -0.3)',  cpi: -0.3, desc: 'Tüm pencereler kapalı' },
  { id: 'open',     label: 'Dominant Açıklık (Cpi = +0.2)', cpi: 0.2, desc: '1 dominant açıklık' },
  { id: 'openall',  label: 'Açık Bina (Cpi = +0.7)',    cpi: 0.7,  desc: 'Birden fazla açıklık' },
]

/* Yapısal Katsayı cs·cd — EN 1991-1-4 Tablo 6.1 */
const CSCD_OPTIONS = [
  { label: 'cs·cd = 1.0 — h ≤ 15 m',           cscd: 1.0 },
  { label: 'cs·cd = 0.95 — h 15-50 m',          cscd: 0.95 },
  { label: 'cs·cd = 0.90 — h 50-100 m',         cscd: 0.90 },
  { label: 'cs·cd = 0.85 — h > 100 m (dinamik)',cscd: 0.85 },
]

/* Cephe Kuvvet Katsayısı Cf — EN 1991-1-4 Madde 7.4 */
const CF_OPTIONS = [
  { label: 'Cf = 1.3 — Çerçeve/Yüzeyli Cephe',  cf: 1.3 },
  { label: 'Cf = 1.5 — Panelli Cephe',           cf: 1.5 },
  { label: 'Cf = 2.0 — İzole Mimari Elemanlar',  cf: 2.0 },
  { label: 'Cf = 1.0 — Kapalı Bina Toplam',      cf: 1.0 },
]

const riskLevel = qp => qp > 1500 ? { label: 'Yüksek Risk',   color: 'text-red-400',    bg: 'bg-red-900/20 border-red-700/30'    }
                      : qp > 800  ? { label: 'Orta Risk',    color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-700/30' }
                                  : { label: 'Düşük Risk',   color: 'text-green-400',  bg: 'bg-green-900/20 border-green-700/30'  }

export default function RuzgarPage() {
  /* ── Giriş değerleri ── */
  const [height,    setHeight]    = useState(20)
  const [width,     setWidth]     = useState(30)
  const [depth,     setDepth]     = useState(20)
  const [terrainId, setTerrainId] = useState(2)
  const [cityName,  setCityName]  = useState('İstanbul')
  const [customVb,  setCustomVb]  = useState(30)
  const [cDir,      setCDir]      = useState(1.0)
  const [cSeason,   setCseason]   = useState(1.0)
  const [cAlt,      setCAlt]      = useState(1.0)
  const [cpiId,     setCpiId]     = useState('closed')
  const [cscdIdx,   setCscdIdx]   = useState(0)
  const [cfIdx,     setCfIdx]     = useState(0)
  const [elev,      setElev]      = useState(0)
  const [showProfil, setShowProfil] = useState(false)

  const terrain = TERRAIN[terrainId]
  const cityObj = WIND_ZONES.find(c => c.name === cityName)
  const vb0 = cityObj?.vb0 ?? customVb

  /* ─────────────────────────────────────────────────────────
     HESAPLAMA — TS EN 1991-1-4
     ───────────────────────────────────────────────────────── */
  const calc = useMemo(() => {
    /* Adım 1 — Temel Rüzgar Hızı EN 1991-1-4 Mad.4.2 */
    const vb = vb0 * cDir * cSeason * cAlt      // m/s

    /* Adım 2 — Yüksekliğe bağlı Ekspozür Katsayısı cr(z) EN 4.3.2 */
    const z    = Math.max(height, terrain.zmin)
    const cr   = terrain.kr * Math.log(z / terrain.z0)   // boyutsuz

    /* Adım 3 — Ortalama Rüzgar Hızı vm(z) EN 4.3.1 */
    const co   = 1.0          // topoğrafya katsayısı (düz arazi)
    const vm   = cr * co * vb // m/s

    /* Adım 4 — Türbülans Yoğunluğu Iv(z) EN 4.4 */
    const kI   = 1.0          // türbülans katsayısı
    const Iv   = kI / (co * Math.log(z / terrain.z0))   // boyutsuz

    /* Adım 5 — Temel Dinamik Basınç qb EN 4.5 */
    const rho  = 1.25         // hava yoğunluğu kg/m³
    const qb   = 0.5 * rho * vb * vb   // N/m²

    /* Adım 6 — Tepe Hız Basıncı qp(z) EN 4.5 Denklem 4.8 */
    //  qp(z) = [1 + 7·Iv(z)] · ½·ρ·vm²(z)
    const qp   = (1 + 7 * Iv) * 0.5 * rho * vm * vm     // N/m²

    /* Adım 7 — Alternatif: Ekspozür fonksiyonu ce(z) EN Denklem 4.9 */
    const ce   = qp / qb      // ce(z) = qp / qb

    /* Adım 8 — İç basınç katsayısı */
    const cpi  = CPI_OPTIONS.find(c => c.id === cpiId)?.cpi ?? -0.3

    /* Adım 9 — Yapısal katsayı cs·cd */
    const cscd = CSCD_OPTIONS[cscdIdx]?.cscd ?? 1.0

    /* Adım 10 — Net Basınçlar w = qp × (Cpe - Cpi)  EN Denklem 5.1 */
    const zones = Object.values(CPE_WALLS).map(z2 => {
      const we   = qp * z2.cpe10                  // dış basınç  N/m²
      const wi   = qp * cpi                       // iç basınç  N/m²
      const wnet = we - wi                        // net basınç N/m²
      return { ...z2, we, wi, wnet }
    })

    /* Adım 11 — Kuvvet Cf × qp × Aref × cscd  EN Denklem 5.3 */
    const cf    = CF_OPTIONS[cfIdx]?.cf ?? 1.3
    const Aref  = width * height                  // m²
    const Fw    = cscd * cf * qp * Aref / 1000    // kN

    /* Türbülansın rüzgar hızı üzerindeki etkisi */
    const sigma_v = terrain.kr * vm               // standart sapma

    /* Referans basınçlar */
    const wD   = qp * (CPE_WALLS.D.cpe10 - cpi)  // rüzgar alan net
    const wE   = qp * (CPE_WALLS.E.cpe10 - cpi)  // rüzgar arkası net

    return { vb, cr, co, vm, Iv, qb, qp, ce, cpi, cscd, cf, Aref, Fw, zones, sigma_v, wD, wE, z }
  }, [height, width, depth, terrainId, vb0, cDir, cSeason, cAlt, cpiId, cscdIdx, cfIdx])

  const risk = riskLevel(calc.qp)

  /* ─── PDF RAPORU ─── */
  function buildRuzgarHtml(profil) {
    const rNo  = `OZZ-RYH-${Date.now().toString().slice(-6)}`
    const date = new Date().toLocaleDateString('tr-TR')
    const risk = riskLevel(calc.qp)
    const rc   = calc.qp > 1500 ? '#ef4444' : calc.qp > 800 ? '#f59e0b' : '#22c55e'

    const zoneRows = calc.zones.map(z =>
      `<tr><td style="padding:7px 8px;font-size:12px">${z.name}</td>
       <td style="padding:7px 8px;text-align:center;font-size:12px">${z.cpe10}</td>
       <td style="padding:7px 8px;text-align:center;font-size:12px">${z.we.toFixed(1)}</td>
       <td style="padding:7px 8px;text-align:center;font-size:12px">${z.wi.toFixed(1)}</td>
       <td style="padding:7px 8px;text-align:center;font-weight:700;font-size:12px;color:${z.wnet < 0 ? '#3b82f6' : '#ef4444'}">${z.wnet.toFixed(1)}</td>
       </tr>`
    ).join('')

    const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8">
<title>AluSight Rüzgar Yükü Raporu ${rNo}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,sans-serif;font-size:13px;color:#111;padding:40px;background:#fff}
.badge{display:inline-block;padding:5px 14px;border-radius:4px;font-size:16px;font-weight:800;border:2px solid}
.sec{margin-bottom:22px}
.st{font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#777;border-bottom:1px solid #e5e7eb;padding-bottom:5px;margin-bottom:10px}
table{width:100%;border-collapse:collapse}
th{background:#f3f4f6;padding:7px 8px;font-size:11px;text-align:left;font-weight:700;color:#555;text-transform:uppercase;border-bottom:2px solid #e5e7eb}
td{border-bottom:1px solid #f0f0f0}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.card{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:10px 12px}
.clabel{font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em}
.cval{font-size:15px;font-weight:800;margin-top:2px}
.csub{font-size:10px;color:#6b7280;margin-top:1px}
.note{background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:10px 12px;font-size:11px;color:#92400e;margin-top:16px}
.formula{background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;padding:10px 14px;font-family:monospace;font-size:12px;color:#0369a1;margin:6px 0}
.ft{margin-top:28px;border-top:1px solid #e5e7eb;padding-top:10px;font-size:10px;color:#9ca3af;text-align:center}
@media print{body{padding:20px}}
</style></head><body>

<div>${buildReportHeader(profil, 'RÜZGAR YÜKÜ HESAP RAPORU', 'TS EN 1991-1-4:2005 / Eurocode 1 — Rüzgar Etkileri', rNo)}</div>

<!-- Risk Özeti -->
<div style="display:flex;justify-content:space-between;align-items:center;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px;margin-bottom:20px">
  <div>
    <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;margin-bottom:4px">Tepe Hız Basıncı qp(z)</div>
    <span class="badge" style="color:${rc};border-color:${rc}">${calc.qp.toFixed(0)} N/m²</span>
    <div style="font-size:13px;font-weight:700;color:${rc};margin-top:5px">${risk.label}</div>
  </div>
  <div style="text-align:right">
    <div style="font-size:11px;color:#9ca3af">Toplam Rüzgar Kuvveti</div>
    <div style="font-size:22px;font-weight:900;color:#111">${calc.Fw.toFixed(1)} kN</div>
    <div style="font-size:11px;color:#6b7280">Fw = cs·cd × Cf × qp × Aref</div>
  </div>
</div>

<!-- Giriş Parametreleri -->
<div class="sec">
  <div class="st">Giriş Parametreleri</div>
  <div class="grid2">
    <div class="card"><div class="clabel">Şehir / Bölge</div><div class="cval">${cityName}</div><div class="csub">Temel Rüzgar Hızı vb₀ = ${vb0} m/s</div></div>
    <div class="card"><div class="clabel">Temel Rüzgar Hızı vb</div><div class="cval">${calc.vb.toFixed(1)} m/s</div><div class="csub">cDir=${cDir} · cSeason=${cSeason} · cAlt=${cAlt}</div></div>
    <div class="card"><div class="clabel">Bina Boyutları</div><div class="cval">${width} × ${depth} × ${height} m</div><div class="csub">Genişlik × Derinlik × Yükseklik</div></div>
    <div class="card"><div class="clabel">Arazi Kategorisi</div><div class="cval">${terrain.label.split('—')[0].trim()}</div><div class="csub">z₀=${terrain.z0} m · zmin=${terrain.zmin} m</div></div>
    <div class="card"><div class="clabel">İç Basınç Katsayısı</div><div class="cval">Cpi = ${calc.cpi}</div><div class="csub">${CPI_OPTIONS.find(c=>c.cpi===calc.cpi)?.label||''}</div></div>
    <div class="card"><div class="clabel">Yapısal Katsayı</div><div class="cval">cs·cd = ${calc.cscd}</div><div class="csub">Cf = ${calc.cf} · Aref = ${calc.Aref} m²</div></div>
  </div>
</div>

<!-- Ara Sonuçlar -->
<div class="sec">
  <div class="st">Ara Hesap Değerleri</div>
  <table><thead><tr><th>Parametre</th><th>Sembol</th><th>Değer</th><th>Birim</th><th>Açıklama</th></tr></thead><tbody>
  <tr><td style="padding:6px 8px">Temel Rüzgar Hızı</td><td style="padding:6px 8px;font-family:monospace">vb</td><td style="padding:6px 8px;font-weight:700">${calc.vb.toFixed(2)}</td><td style="padding:6px 8px">m/s</td><td style="padding:6px 8px;color:#6b7280;font-size:11px">EN 4.2 Denklem (4.1)</td></tr>
  <tr><td style="padding:6px 8px">Ekspozür Katsayısı</td><td style="padding:6px 8px;font-family:monospace">cr(z)</td><td style="padding:6px 8px;font-weight:700">${calc.cr.toFixed(4)}</td><td style="padding:6px 8px">—</td><td style="padding:6px 8px;color:#6b7280;font-size:11px">EN 4.3.2 Denklem (4.4)</td></tr>
  <tr><td style="padding:6px 8px">Ortalama Rüzgar Hızı</td><td style="padding:6px 8px;font-family:monospace">vm(z)</td><td style="padding:6px 8px;font-weight:700">${calc.vm.toFixed(3)}</td><td style="padding:6px 8px">m/s</td><td style="padding:6px 8px;color:#6b7280;font-size:11px">EN 4.3.1 Denklem (4.3)</td></tr>
  <tr><td style="padding:6px 8px">Türbülans Yoğunluğu</td><td style="padding:6px 8px;font-family:monospace">Iv(z)</td><td style="padding:6px 8px;font-weight:700">${calc.Iv.toFixed(4)}</td><td style="padding:6px 8px">—</td><td style="padding:6px 8px;color:#6b7280;font-size:11px">EN 4.4 Denklem (4.7)</td></tr>
  <tr><td style="padding:6px 8px">Ekspozür Fonksiyonu</td><td style="padding:6px 8px;font-family:monospace">ce(z)</td><td style="padding:6px 8px;font-weight:700">${calc.ce.toFixed(3)}</td><td style="padding:6px 8px">—</td><td style="padding:6px 8px;color:#6b7280;font-size:11px">EN Denklem (4.9)</td></tr>
  <tr><td style="padding:6px 8px">Temel Dinamik Basınç</td><td style="padding:6px 8px;font-family:monospace">qb</td><td style="padding:6px 8px;font-weight:700">${calc.qb.toFixed(2)}</td><td style="padding:6px 8px">N/m²</td><td style="padding:6px 8px;color:#6b7280;font-size:11px">EN 4.5 Denklem (4.10)</td></tr>
  <tr><td style="padding:6px 8px">Tepe Hız Basıncı</td><td style="padding:6px 8px;font-family:monospace">qp(z)</td><td style="padding:6px 8px;font-weight:700;color:${rc}">${calc.qp.toFixed(2)}</td><td style="padding:6px 8px">N/m²</td><td style="padding:6px 8px;color:#6b7280;font-size:11px">EN 4.5 Denklem (4.8)</td></tr>
  </tbody></table>
</div>

<!-- Net Basınç Tablosu -->
<div class="sec">
  <div class="st">Cephe Bölgelerine Göre Net Basınçlar — EN 1991-1-4 Madde 7.2</div>
  <p style="font-size:11px;color:#6b7280;margin-bottom:8px">Net basınç: w = qp × (Cpe₁₀ − Cpi) · (+) basma, (−) emme</p>
  <table><thead><tr><th>Cephe Bölgesi</th><th style="text-align:center">Cpe,10</th><th style="text-align:center">we (N/m²)</th><th style="text-align:center">wi (N/m²)</th><th style="text-align:center">w net (N/m²)</th></tr></thead>
  <tbody>${zoneRows}</tbody></table>
</div>

<!-- Toplam Kuvvet -->
<div class="sec">
  <div class="st">Toplam Rüzgar Kuvveti — EN 1991-1-4 Denklem 5.3</div>
  <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center">
    <div>
      <div style="font-family:monospace;font-size:13px;color:#0369a1">Fw = cs·cd × Cf × qp × Aref</div>
      <div style="font-family:monospace;font-size:13px;color:#0369a1;margin-top:4px">Fw = ${calc.cscd} × ${calc.cf} × ${calc.qp.toFixed(2)} × ${calc.Aref} N</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:28px;font-weight:900;color:#1e40af">${calc.Fw.toFixed(2)} kN</div>
      <div style="font-size:11px;color:#6b7280">= ${(calc.Fw*1000).toFixed(0)} N</div>
    </div>
  </div>
</div>

<div class="note">⚠ <strong>Önemli Not:</strong> Bu rapor ön tasarım amaçlıdır. Gerçek projede; topografya katsayısı, yönelim etkisi, dinamik analiz (cscd detaylı), zemin araştırması ve yerel yönetmelik gereklilikleri için yetkili bir yapı mühendisi ile çalışılmalıdır. Rüzgar tüneli testleri karmaşık geometriler için zorunlu olabilir.</div>

${buildReportFooter(profil, rNo)}
</body></html>`

    return html
  }

  return (
    <div className="min-h-screen bg-[#070d1f] text-white pb-16">
      {showProfil && <RaporProfilModal onClose={() => setShowProfil(false)} />}

      {/* Header */}
      <div className="bg-gradient-to-b from-[#0d1630] to-[#070d1f] pt-10 pb-6 px-4">
        <div className="max-w-3xl mx-auto flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-extrabold mb-1">Rüzgar Yükü Hesaplayıcı</h1>
            <p className="text-gray-400 text-sm">TS EN 1991-1-4:2005 · Eurocode 1 · Madde 4.3–5.3–7.2</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button onClick={() => setShowProfil(true)} className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-all">
              ⚙️ Rapor Profili
            </button>
            <RaporIndir buildHtml={buildRuzgarHtml} className="flex items-center gap-2 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-gold-400 text-xs font-bold px-4 py-2.5 rounded-xl transition-all">
              📄 Rapor İndir
            </RaporIndir>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-4">

        {/* ─── GİRİŞLER ─── */}
        <div className="bg-[#0d1630] rounded-2xl p-5 border border-blue-800/20">
          <h2 className="font-bold mb-4 text-blue-300 text-sm uppercase tracking-wider">Bina & Konum Bilgileri</h2>

          {/* Şehir */}
          <div className="mb-3">
            <label className="text-xs text-gray-400 mb-1 block">Şehir / Bölge</label>
            <select value={cityName} onChange={e => setCityName(e.target.value)}
              className="w-full bg-[#1a2444] border border-blue-700/30 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500">
              {WIND_ZONES.map(c => <option key={c.name}>{c.name}</option>)}
            </select>
            {cityName !== 'Özel Giriş' && <p className="text-[10px] text-blue-400/60 mt-1">Referans hız: vb₀ = {vb0} m/s</p>}
          </div>
          {cityName === 'Özel Giriş' && (
            <div className="mb-3">
              <label className="text-xs text-gray-400 mb-1 block">Temel Rüzgar Hızı vb₀ (m/s)</label>
              <input type="number" value={customVb} onChange={e => setCustomVb(+e.target.value)}
                className="w-full bg-[#1a2444] border border-blue-700/30 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
          )}

          {/* Boyutlar */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { label: 'Yükseklik h (m)', val: height, set: setHeight },
              { label: 'Genişlik b (m)',  val: width,  set: setWidth  },
              { label: 'Derinlik d (m)',  val: depth,  set: setDepth  },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-gray-400 mb-1 block">{f.label}</label>
                <input type="number" value={f.val} onChange={e => f.set(Math.max(1, +e.target.value))}
                  className="w-full bg-[#1a2444] border border-blue-700/30 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
            ))}
          </div>

          {/* Yön & Mevsim katsayıları */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'cDir (Yön katsayısı)', val: cDir,    set: setCDir,    step: 0.05, min: 0.8, max: 1.0 },
              { label: 'cSeason (Mevsim)',     val: cSeason, set: setCseason, step: 0.05, min: 0.8, max: 1.0 },
              { label: 'cAlt (Rakım ≥500m)',   val: cAlt,    set: setCAlt,    step: 0.05, min: 1.0, max: 1.3 },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-gray-400 mb-1 block">{f.label}</label>
                <input type="number" value={f.val} onChange={e => f.set(+e.target.value)} step={f.step} min={f.min} max={f.max}
                  className="w-full bg-[#1a2444] border border-blue-700/30 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
            ))}
          </div>

          {/* Arazi Kategorisi */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-2 block">Arazi Kategorisi — EN 1991-1-4 Tablo 4.1</label>
            <div className="space-y-1.5">
              {TERRAIN.map(t => (
                <button key={t.id} onClick={() => setTerrainId(t.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${terrainId === t.id ? 'border-blue-500 bg-blue-900/20' : 'border-blue-800/20 hover:border-blue-700/40'}`}>
                  <span className="font-semibold text-xs text-blue-300">{t.label.split('—')[0].trim()} — </span>
                  <span className="text-xs text-gray-400">{t.desc}</span>
                  <span className="text-[10px] text-blue-400/50 ml-2">z₀={t.z0}m</span>
                </button>
              ))}
            </div>
          </div>

          {/* İç Basınç */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-2 block">İç Basınç Katsayısı Cpi — EN Tablo 7.13</label>
            <div className="space-y-1.5">
              {CPI_OPTIONS.map(c => (
                <button key={c.id} onClick={() => setCpiId(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl border text-xs transition-all ${cpiId === c.id ? 'border-blue-500 bg-blue-900/20' : 'border-blue-800/20 hover:border-blue-700/40'}`}>
                  <span className="font-semibold text-white">{c.label}</span>
                  <span className="text-gray-500 ml-2">— {c.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Yapısal & Kuvvet katsayıları */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Yapısal Katsayı cs·cd — EN Tablo 6.1</label>
              <div className="space-y-1">
                {CSCD_OPTIONS.map((o, i) => (
                  <button key={i} onClick={() => setCscdIdx(i)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all ${cscdIdx === i ? 'border-blue-500 bg-blue-900/20' : 'border-blue-800/20 hover:border-blue-700/30'}`}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Kuvvet Katsayısı Cf — EN Madde 7.4</label>
              <div className="space-y-1">
                {CF_OPTIONS.map((o, i) => (
                  <button key={i} onClick={() => setCfIdx(i)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all ${cfIdx === i ? 'border-blue-500 bg-blue-900/20' : 'border-blue-800/20 hover:border-blue-700/30'}`}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── SONUÇLAR ─── */}
        <div className="bg-[#0d1630] rounded-2xl p-5 border border-blue-800/20">
          <h2 className="font-bold mb-4 text-blue-300 text-sm uppercase tracking-wider">Hesaplama Sonuçları</h2>

          {/* Risk + Toplam Kuvvet */}
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${riskLevel(calc.qp).bg}`}>
              <span className="text-3xl">💨</span>
              <div>
                <p className={`font-bold text-base ${riskLevel(calc.qp).color}`}>{riskLevel(calc.qp).label}</p>
                <p className="text-xs text-gray-400 mt-0.5">qp(z) = <span className="font-bold text-white">{calc.qp.toFixed(0)}</span> N/m²</p>
                <p className="text-xs text-gray-500">Tepe hız basıncı — EN Denklem (4.8)</p>
              </div>
            </div>
            <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Toplam Rüzgar Kuvveti Fw</p>
              <p className="text-4xl font-black text-blue-300">{calc.Fw.toFixed(1)}</p>
              <p className="text-sm text-gray-400">kN</p>
              <p className="text-[10px] text-gray-600 mt-1">cs·cd×Cf×qp×Aref — EN Dkm.5.3</p>
            </div>
          </div>

          {/* Hesap değerleri */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Temel Rüzgar Hızı vb',       val: `${calc.vb.toFixed(1)} m/s`,    sub: 'EN Mad.4.2 Dkm.(4.1)' },
              { label: 'Ekspozür Katsayısı cr(z)',     val: calc.cr.toFixed(4),             sub: 'EN Mad.4.3.2 Dkm.(4.4)' },
              { label: 'Ortalama Rüzgar vm(z)',        val: `${calc.vm.toFixed(1)} m/s`,    sub: 'EN Mad.4.3.1 Dkm.(4.3)' },
              { label: 'Türbülans Yoğunluğu Iv(z)',   val: calc.Iv.toFixed(4),             sub: 'EN Mad.4.4 Dkm.(4.7)' },
              { label: 'Ekspozür Fonksiyonu ce(z)',    val: calc.ce.toFixed(3),             sub: 'EN Dkm.(4.9)' },
              { label: 'Temel Dinamik Basınç qb',     val: `${calc.qb.toFixed(0)} N/m²`,   sub: 'EN Mad.4.5 Dkm.(4.10)' },
              { label: 'Tepe Hız Basıncı qp',         val: `${calc.qp.toFixed(0)} N/m²`,   sub: 'EN Dkm.(4.8)' },
              { label: 'Referans Alan Aref',           val: `${calc.Aref} m²`,              sub: `${width}×${height} m` },
              { label: 'Toplam Kuvvet Fw',             val: `${calc.Fw.toFixed(2)} kN`,     sub: `cs·cd=${calc.cscd} · Cf=${calc.cf}` },
            ].map(item => (
              <div key={item.label} className="bg-[#070d1f] rounded-xl p-3">
                <p className="text-[10px] text-gray-500 leading-tight">{item.label}</p>
                <p className="font-bold text-sm mt-0.5">{item.val}</p>
                <p className="text-[10px] text-gray-700 mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Net basınçlar — cephe bölgeleri */}
          <h3 className="font-bold text-sm text-gray-300 mb-3">Net Basınçlar — EN 1991-1-4 Madde 7.2</h3>
          <p className="text-[10px] text-gray-500 mb-2">w = qp × (Cpe,10 − Cpi) · (+) basma / (−) emme</p>
          <div className="space-y-2 mb-4">
            {calc.zones.map(z => (
              <div key={z.name} className="bg-[#070d1f] rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{z.name}</p>
                    <p className="text-[10px] text-gray-500">Cpe,10={z.cpe10} · we={z.we.toFixed(0)} N/m² · wi={z.wi.toFixed(0)} N/m²</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-base ${z.wnet < 0 ? 'text-blue-300' : 'text-red-300'}`}>
                      {z.wnet > 0 ? '+' : ''}{z.wnet.toFixed(0)} N/m²
                    </p>
                    <p className="text-[10px] text-gray-500">{z.wnet < 0 ? '← Emme' : '→ Basma'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-600 text-center mb-4">TS EN 1991-1-4:2005 · Eurocode 1 Bölüm 1-4 · Rüzgar Etkileri</p>

          <RaporIndir buildHtml={buildRuzgarHtml} className="w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-black font-bold py-3 rounded-xl text-sm transition-all">
            📄 Tam Rapor İndir (Tüm Formüller + Tablolar)
          </RaporIndir>
        </div>

        {/* Uyarı */}
        <div className="bg-[#0d1630] rounded-2xl p-4 border border-yellow-800/20">
          <p className="text-xs text-yellow-400 font-bold mb-1">⚠ Ön Tasarım Notu</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Bu hesaplama TS EN 1991-1-4:2005 formüllerine göre yapılmıştır. Gerçek projede topografya katsayısı, dinamik analiz,
            zemin araştırması ve yerel yönetmelik gereklilikleri için yetkili bir yapı mühendisi ile çalışılmalıdır.
          </p>
        </div>
      </div>
    </div>
  )
}
