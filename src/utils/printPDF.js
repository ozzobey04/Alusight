/* src/utils/printPDF.js
 * Montserrat + Türkçe karakter destekli HTML print-to-PDF
 * Flixo (Isı Geçirgenlik), PVC, Karbon Ayak İzi sayfaları için
 */

const FONT = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">`

const BASE_CSS = `
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Montserrat',sans-serif; color:#1a1a2e; background:#fff; font-size:9pt; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
.page { padding:0; }
.header { background:#0a0f28; color:#fff; padding:22px 28px 16px; }
.header h1 { font-size:18pt; font-weight:800; letter-spacing:2px; }
.header .sub { font-size:9pt; color:#99aacc; margin-top:3px; }
.header .meta { font-size:7.5pt; color:#667; margin-top:6px; }
.body { padding:18px 28px 50px; }
h3 { font-size:9.5pt; font-weight:700; color:#0a0f28; margin:18px 0 8px; text-transform:uppercase; letter-spacing:.8px; border-bottom:2px solid #e5e7eb; padding-bottom:4px; }
table { width:100%; border-collapse:collapse; margin-bottom:12px; font-size:8pt; }
thead tr { background:#0a0f28; color:#fff; }
thead th { padding:7px 9px; text-align:left; font-weight:600; font-size:7.5pt; letter-spacing:.4px; }
tbody tr:nth-child(even) { background:#f8fafc; }
tbody td { padding:6px 9px; vertical-align:top; border-bottom:1px solid #e5e7eb; line-height:1.5; }
.badge { display:inline-block; color:#fff; font-size:7pt; font-weight:700; padding:1.5px 7px; border-radius:20px; white-space:nowrap; }
.metric-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:14px; }
.metric { background:#f1f5f9; border-radius:6px; padding:8px 10px; text-align:center; }
.metric .label { font-size:7pt; color:#64748b; text-transform:uppercase; letter-spacing:.5px; margin-bottom:3px; }
.metric .value { font-size:12pt; font-weight:800; }
.info-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:6px; margin-bottom:14px; }
.info-item { background:#f8fafc; border-radius:4px; padding:7px 10px; font-size:8pt; }
.info-item .lbl { color:#64748b; font-size:7pt; text-transform:uppercase; margin-bottom:2px; }
.footer { position:fixed; bottom:0; left:0; right:0; background:#f8f9fa; border-top:1px solid #e5e7eb; padding:5px 28px; display:flex; justify-content:space-between; font-size:7pt; color:#999; }
@media print { @page { size:A4; margin:0; } }
`

function openPrint(html) {
  const full = `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8">${FONT}<style>${BASE_CSS}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style></head><body>${html}<script>window.addEventListener('load',function(){setTimeout(function(){window.print();},800);});<\/script></body></html>`
  const blob = new Blob([full], { type: 'text/html;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const a    = window.open(url, '_blank')
  if (!a) {
    // Popup engeli varsa iframe fallback
    const iframe = document.createElement('iframe')
    iframe.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;border:none;z-index:99999;background:#fff'
    iframe.src = url
    document.body.appendChild(iframe)
    const close = document.createElement('button')
    close.textContent = '✕ Kapat'
    close.style.cssText = 'position:fixed;top:12px;right:12px;z-index:100000;background:#0a0f28;color:#fff;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-size:13px'
    close.onclick = () => { document.body.removeChild(iframe); document.body.removeChild(close); URL.revokeObjectURL(url) }
    document.body.appendChild(close)
  } else {
    setTimeout(() => URL.revokeObjectURL(url), 60000)
  }
}

export function buildBlobUrl(html) {
  const full = `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8">${FONT}<style>${BASE_CSS}</style></head><body>${html}</body></html>`
  const blob = new Blob([full], { type: 'text/html;charset=utf-8' })
  return URL.createObjectURL(blob)
}

/* Tam HTML dökümanı string olarak döndürür (antet inject için) */
export function buildFullHtmlDoc(bodyFragment, extraCss = '') {
  return `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8">${FONT}<style>${BASE_CSS}${extraCss}</style></head><body>${bodyFragment}</body></html>`
}

/* ═══════════════════════════════════════
   FLIXO — Isı Geçirgenlik Raporu
═══════════════════════════════════════ */
export function printFlixoPDF({ profile, glazing, r, Tin, Tout, RHin, climate, W, H, insights, returnHtml = false }) {
  if (!r || !profile || !glazing) return

  const uw = r.Uw?.toFixed(3) || '—'
  const cls = r.ec?.cls || '—'
  const frsi = r.fRsi?.toFixed(3) || '—'
  const tsi = r.Tsi?.toFixed(1) || '—'
  const tdew = r.Tdew_in?.toFixed(1) || '—'
  const condensRisk = r.condensRisk

  const clsColors = { 'A++':'#15803d','A+':'#16a34a','A':'#22c55e','B':'#84cc16','C':'#eab308','D':'#f97316','E':'#ef4444','F':'#dc2626','G':'#991b1b' }
  const clsColor = clsColors[cls] || '#888'

  const STATUS_MAP = {
    'error':      { label: 'BAŞARISIZ', color: '#ef4444' },
    'warning':    { label: 'DİKKAT',    color: '#f59e0b' },
    'success':    { label: 'UYUMLU',    color: '#22c55e' },
    'suggestion': { label: 'ÖNERİ',     color: '#3b82f6' },
    'data':       { label: 'BİLGİ',     color: '#8b5cf6' },
  }

  const insightRows = (insights || []).map(ins => {
    const s = STATUS_MAP[ins.t || ins.type] || { label: ins.label || ins.t || '—', color: ins.color || '#888' }
    return `<tr><td><span class="badge" style="background:${s.color}">${s.label}</span></td><td>${ins.text}</td></tr>`
  }).join('')

  const html = `
<div class="header">
  <h1>OZZO ALÜMİNYUM</h1>
  <div class="sub">Isı Geçirgenlik Raporu — Flixo Termal Analiz Modülü</div>
  <div class="meta">Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} &nbsp;|&nbsp; Tel: 0535 861 04 04</div>
</div>
<div class="body">

  <h3>Sistem Bilgileri</h3>
  <div class="info-grid">
    <div class="info-item"><div class="lbl">Profil Sistemi</div>${profile.name}</div>
    <div class="info-item"><div class="lbl">Cam Paketi</div>${glazing.name}</div>
    <div class="info-item"><div class="lbl">Boyut (G×Y)</div>${W?.toFixed(2)}m × ${H?.toFixed(2)}m</div>
    <div class="info-item"><div class="lbl">İklim Bölgesi</div>${climate?.name || '—'}</div>
    <div class="info-item"><div class="lbl">İç Sıcaklık / Nem</div>${Tin}°C / %${RHin}</div>
    <div class="info-item"><div class="lbl">Dış Tasarım Sıcaklığı</div>${Tout}°C</div>
  </div>

  <h3>Hesaplama Sonuçları</h3>
  <div class="metric-grid">
    <div class="metric"><div class="label">Uw Değeri</div><div class="value" style="color:${r.ec?.color || '#000'}">${uw} W/m²K</div></div>
    <div class="metric"><div class="label">Enerji Sınıfı</div><div class="value" style="color:${clsColor}">${cls}</div></div>
    <div class="metric"><div class="label">fRsi (Min Yüzey)</div><div class="value" style="color:${r.fRsi >= 0.7 ? '#15803d' : '#dc2626'}">${frsi}</div></div>
    <div class="metric"><div class="label">Min Yüzey Sıcaklığı</div><div class="value">${tsi}°C</div></div>
    <div class="metric"><div class="label">Çiğ Noktası</div><div class="value">${tdew}°C</div></div>
    <div class="metric"><div class="label">Yoğuşma Riski</div><div class="value" style="color:${condensRisk ? '#dc2626' : '#15803d'}">${condensRisk ? 'RİSK ⚠' : 'YOK ✓'}</div></div>
  </div>

  ${r.UAcalc != null ? `
  <h3>Detaylı Bileşen Analizi</h3>
  <table>
    <thead><tr><th>Bileşen</th><th>Alan (m²)</th><th>U-Değeri</th><th>UA (W/K)</th></tr></thead>
    <tbody>
      <tr><td>Cam Yüzeyi</td><td>${r.Ag?.toFixed(3) || '—'}</td><td>${glazing.Ug} W/m²K</td><td>${(r.Ag * glazing.Ug)?.toFixed(3) || '—'}</td></tr>
      <tr><td>Çerçeve</td><td>${r.Af?.toFixed(3) || '—'}</td><td>${profile.Uf} W/m²K</td><td>${(r.Af * profile.Uf)?.toFixed(3) || '—'}</td></tr>
      ${r.Lg != null ? `<tr><td>Lineer Isı Köprüsü (Ψg)</td><td colspan="2">${r.Lg?.toFixed(2) || '—'} m × ${profile.PsiG?.toFixed(4) || '—'} W/mK</td><td>${r.UAcalc != null ? (r.UAcalc - (r.Ag * glazing.Ug + r.Af * profile.Uf)).toFixed(3) : '—'}</td></tr>` : ''}
      <tr style="font-weight:700;background:#e8f0fe"><td colspan="3">Toplam UA</td><td>${r.UAcalc?.toFixed(3) || '—'} W/K</td></tr>
    </tbody>
  </table>` : ''}

  ${insightRows ? `
  <h3>Teknik Değerlendirme ve Öneriler</h3>
  <table>
    <thead><tr><th style="width:15%">Durum</th><th>Açıklama</th></tr></thead>
    <tbody>${insightRows}</tbody>
  </table>` : ''}

  <div style="margin-top:16px;padding:10px 14px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;font-size:7.5pt;color:#1e40af">
    <strong>Referans Standartlar:</strong> EN ISO 10077-1 (Pencere/Kapı/Kepenk Isıl İletim), EN ISO 10211 (Termal Köprüler), 
    EN ISO 13788 (Yoğuşma Riski), TS 825 (Binalarda Isı Yalıtım Kuralları), BEP-TR (Bina Enerji Performansı Türkiye)
  </div>
</div>
<div class="footer">
  <span>OZZO Alüminyum | www.ozzoaluminyum.com | Tel: 0535 861 04 04</span>
  <span>${new Date().toLocaleDateString('tr-TR')}</span>
</div>`

  if (returnHtml) return html
  openPrint(html)
}

/* ═══════════════════════════════════════
   PVC — Fiyat Teklifi
═══════════════════════════════════════ */
export function printPvcPDF({ items, clientName, projectName, notes, totals, returnHtml = false }) {
  if (!items?.length) return

  const itemRows = items.map((item, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${item.productName || '—'}</td>
      <td>${item.profileName || '—'}</td>
      <td>${item.glassName || '—'}</td>
      <td>${item.W?.toFixed(2) || '—'}m × ${item.H?.toFixed(2) || '—'}m</td>
      <td>${item.qty || 1}</td>
      <td>${item.Uw?.toFixed(2) || '—'}</td>
      <td style="text-align:right;font-weight:600">${(item.totalPrice || 0).toLocaleString('tr-TR')} ₺</td>
    </tr>`).join('')

  const html = `
<div class="header">
  <h1>OZZO ALÜMİNYUM</h1>
  <div class="sub">PVC Sistem Fiyat Teklifi</div>
  <div class="meta">Teklif Tarihi: ${new Date().toLocaleDateString('tr-TR')} &nbsp;|&nbsp; Tel: 0535 861 04 04</div>
</div>
<div class="body">

  ${clientName || projectName ? `
  <h3>Teklif Bilgileri</h3>
  <div class="info-grid">
    ${clientName ? `<div class="info-item"><div class="lbl">Müşteri / Firma</div>${clientName}</div>` : ''}
    ${projectName ? `<div class="info-item"><div class="lbl">Proje Adı</div>${projectName}</div>` : ''}
  </div>` : ''}

  <h3>Kalem Detayları</h3>
  <table>
    <thead><tr>
      <th>#</th><th>Ürün</th><th>Profil</th><th>Cam</th><th>Boyut</th><th>Adet</th><th>Uw W/m²K</th><th style="text-align:right">Toplam</th>
    </tr></thead>
    <tbody>${itemRows}</tbody>
  </table>

  <table style="max-width:280px;margin-left:auto">
    <tbody>
      <tr><td style="font-weight:600">Ara Toplam</td><td style="text-align:right">${(totals?.subtotal || 0).toLocaleString('tr-TR')} ₺</td></tr>
      ${totals?.laborCost ? `<tr><td>İşçilik</td><td style="text-align:right">${totals.laborCost.toLocaleString('tr-TR')} ₺</td></tr>` : ''}
      ${totals?.kdv ? `<tr><td>KDV (%20)</td><td style="text-align:right">${totals.kdv.toLocaleString('tr-TR')} ₺</td></tr>` : ''}
      <tr style="font-weight:800;background:#0a0f28;color:#fff"><td style="padding:7px 9px">GENEL TOPLAM</td><td style="text-align:right;padding:7px 9px">${(totals?.grand || totals?.subtotal || 0).toLocaleString('tr-TR')} ₺</td></tr>
    </tbody>
  </table>

  ${notes ? `
  <h3>Notlar / Özel Şartlar</h3>
  <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:10px 14px;font-size:8.5pt;color:#78350f">${notes}</div>
  ` : ''}

  <div style="margin-top:16px;padding:10px 14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;font-size:7.5pt;color:#166534">
    <strong>Geçerlilik:</strong> Bu teklif 30 gün geçerlidir. Fiyatlar KDV hariçtir (aksi belirtilmedikçe). 
    Ürünler EN 12608 (PVC profiller) ve EN 14351-1 (pencere/kapı) standartlarına uygundur.
  </div>
</div>
<div class="footer">
  <span>OZZO Alüminyum | www.ozzoaluminyum.com | Tel: 0535 861 04 04</span>
  <span>${new Date().toLocaleDateString('tr-TR')}</span>
</div>`

  if (returnHtml) return html
  openPrint(html)
}

/* ═══════════════════════════════════════
   KARBON AYAK İZİ Raporu
═══════════════════════════════════════ */
export function printCarbonPDF({ product, alType, totalM2, qty, result, notes, returnHtml = false }) {
  if (!result) return

  const totalCO2   = result.totalCO2   ?? result.total_AtoC
  const co2PerM2   = result.co2PerM2   ?? result.perM2_AtoC
  const gwpFactor  = result.gwpFactor  ?? result.gwpAl
  const profileWt  = result.profileWeight ?? (result.alKg && result.area ? result.alKg / result.area : null)

  const breakdown = result.breakdown ?? [
    { phase:'A1–A3', description:'Ürün aşaması (hammadde + üretim)', value: result.EC_A1A3, pct: result.EC_A1A3 / totalCO2 * 100 },
    { phase:'A4',    description:'Nakliye',                           value: result.EC_A4,   pct: result.EC_A4   / totalCO2 * 100 },
    { phase:'A5',    description:'Montaj',                            value: result.EC_A5,   pct: result.EC_A5   / totalCO2 * 100 },
    { phase:'B6',    description:'İşletme (ısı kaybı × enerji)',      value: result.OC_total,pct: result.OC_total/ totalCO2 * 100 },
    { phase:'C4',    description:'Yıkım / atık',                      value: result.EoL_C4,  pct: result.EoL_C4  / totalCO2 * 100 },
    { phase:'D',     description:'Geri dönüşüm kredisi (bilgi)',      value: result.EoL_D,   pct: result.EoL_D   / totalCO2 * 100 },
  ]

  const html = `
<div class="header">
  <h1>OZZO ALÜMİNYUM</h1>
  <div class="sub">Karbon Ayak İzi Raporu — Alüminyum Doğrama / Cephe</div>
  <div class="meta">Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} &nbsp;|&nbsp; Tel: 0535 861 04 04</div>
</div>
<div class="body">

  <h3>Proje Bilgileri</h3>
  <div class="info-grid">
    <div class="info-item"><div class="lbl">Ürün / Sistem</div>${product?.name || '—'}</div>
    <div class="info-item"><div class="lbl">Alüminyum Türü</div>${alType?.name || '—'}</div>
    <div class="info-item"><div class="lbl">Toplam Alan</div>${result.area?.toFixed(2) ?? totalM2?.toFixed(2) ?? '—'} m²</div>
    <div class="info-item"><div class="lbl">Adet</div>${qty || '—'}</div>
    <div class="info-item"><div class="lbl">GWP Faktörü</div>${gwpFactor != null ? gwpFactor.toFixed(2) : '—'} kg CO₂e / kg Al</div>
    <div class="info-item"><div class="lbl">Profil Ağırlığı (toplam)</div>${result.alKg != null ? result.alKg.toFixed(2) : '—'} kg Al</div>
  </div>

  <h3>Karbon Ayak İzi Sonuçları</h3>
  <div class="metric-grid">
    <div class="metric"><div class="label">Toplam CO₂e (A–C)</div><div class="value" style="color:#dc2626">${totalCO2 != null ? Math.round(totalCO2).toLocaleString('tr-TR') : '—'} kg</div></div>
    <div class="metric"><div class="label">Birim CO₂e</div><div class="value">${co2PerM2 != null ? co2PerM2.toFixed(1) : '—'} kg/m²</div></div>
    <div class="metric"><div class="label">Karbon Sınıfı</div><div class="value" style="color:${result.clsColor || '#888'}">${result.cls || '—'}</div></div>
  </div>

  <div class="metric-grid" style="margin-top:0">
    <div class="metric"><div class="label">Gömülü Karbon (A1–A5)</div><div class="value" style="color:#3b82f6">${result.EC_total != null ? Math.round(result.EC_total) : '—'} kg</div></div>
    <div class="metric"><div class="label">İşletme Karbonu (B6)</div><div class="value" style="color:#ef4444">${result.OC_total != null ? Math.round(result.OC_total) : '—'} kg</div></div>
    <div class="metric"><div class="label">Ton CO₂e</div><div class="value">${totalCO2 != null ? (totalCO2 / 1000).toFixed(3) : '—'} t</div></div>
  </div>

  <h3>Faz Bazlı Emisyon Dağılımı (EN 15978)</h3>
  <table>
    <thead><tr><th>Faz</th><th>Açıklama</th><th style="text-align:right">kg CO₂e</th><th style="text-align:right">Pay %</th></tr></thead>
    <tbody>
      ${breakdown.map(b => `
      <tr>
        <td><strong>${b.phase}</strong></td>
        <td>${b.description}</td>
        <td style="text-align:right">${b.value != null ? b.value.toFixed(1) : '—'}</td>
        <td style="text-align:right">${b.pct != null ? b.pct.toFixed(1) : '—'}%</td>
      </tr>`).join('')}
    </tbody>
  </table>

  <h3>Malzeme Detayları</h3>
  <table>
    <thead><tr><th>Malzeme</th><th style="text-align:right">Miktar</th><th style="text-align:right">GWP faktörü</th><th style="text-align:right">CO₂e katkı</th></tr></thead>
    <tbody>
      <tr><td>Alüminyum profil</td><td style="text-align:right">${result.alKg?.toFixed(2) ?? '—'} kg</td><td style="text-align:right">${gwpFactor?.toFixed(2) ?? '—'} kg/kg</td><td style="text-align:right">${result.EC_al?.toFixed(1) ?? '—'} kg</td></tr>
      <tr><td>Cam</td><td style="text-align:right">${result.glassArea?.toFixed(3) ?? '—'} m²</td><td style="text-align:right">—</td><td style="text-align:right">${result.EC_glass?.toFixed(1) ?? '—'} kg</td></tr>
      <tr><td>EPDM conta</td><td style="text-align:right">${result.sealKg?.toFixed(3) ?? '—'} kg</td><td style="text-align:right">2.5 kg/kg</td><td style="text-align:right">${result.EC_seal?.toFixed(1) ?? '—'} kg</td></tr>
      ${result.paKg > 0 ? `<tr><td>PA66 termal kesici</td><td style="text-align:right">${result.paKg?.toFixed(3)} kg</td><td style="text-align:right">4.5 kg/kg</td><td style="text-align:right">${result.EC_pa?.toFixed(1)} kg</td></tr>` : ''}
      <tr><td>Yüzey işlemi</td><td style="text-align:right">—</td><td style="text-align:right">—</td><td style="text-align:right">${result.EC_surface?.toFixed(1) ?? '—'} kg</td></tr>
    </tbody>
  </table>

  ${(() => {
    const cls = result.cls
    if (!cls || cls === 'A+' || cls === 'A') return ''
    const suggestions = []
    if (result.OC_total > result.EC_total) {
      suggestions.push('Üçlü cam (Ug ≤ 0.65 W/m²K) kullanımıyla işletme karbonu %35–45 azaltılabilir.')
      suggestions.push('Isı pompası ısıtma sistemine geçişle operasyonel emisyon faktörü 0.44\'ten 0.11 kg CO₂/kWh\'e düşürülebilir.')
    }
    if (result.gwpAl > 6) {
      suggestions.push('%80+ geri dönüşümlü alüminyum alaşımıyla gömülü karbon 2.5 kg CO₂/kg\'a indirilebilir.')
    }
    if (result.EC_surface > result.EC_A1A3 * 0.1) {
      suggestions.push('Toz boya yerine naturel anodize yüzey tercihiyle yüzey işlemi karbonu %33 azaltılabilir.')
    }
    if (result.perM2_AtoC > 100) {
      suggestions.push('Çerçeve oranı düşük sistem seçimiyle (cephe sistemleri) birim alan başına profil ağırlığı azaltılabilir.')
      suggestions.push('Yüksek yalıtımlı sistem (Uf ≤ 1.1 W/m²K) ile ısı kaybı kaynaklı uzun dönem emisyon önlenebilir.')
    }
    if (result.EC_A4 > 0 && result.EC_A4 / totalCO2 > 0.05) {
      suggestions.push('Yerel tedarikçi tercihiyle nakliye fazı (A4) emisyonu %55\'e kadar düşürülebilir.')
    }
    suggestions.push('Yapısal tasarım optimizasyonuyla profil kesit ağırlığı azaltılarak A1–A3 gömülü karbon %10–20 iyileştirilebilir.')
    suggestions.push('EPD belgeli tedarikçi alüminyumu kullanarak GWP değeri bağımsız raporlanabilir ve doğrulanabilir hale gelir.')
    return `
    <h3 style="color:#b45309;border-bottom-color:#fbbf24">Sınıf İyileştirme Önerileri (${cls} → Hedef A veya A+)</h3>
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:12px 16px">
      <ol style="padding-left:16px;margin:0;list-style:decimal">
        ${suggestions.map(s => `<li style="font-size:8pt;color:#78350f;margin-bottom:5px;line-height:1.5">${s}</li>`).join('')}
      </ol>
    </div>`
  })()}

  ${notes ? `<h3>Notlar</h3><div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:10px 14px;font-size:8.5pt;color:#78350f">${notes}</div>` : ''}

  <div style="margin-top:16px;padding:10px 14px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;font-size:7.5pt;color:#1e40af">
    <strong>Metodoloji:</strong> EN 15804+A2 (Yapı Ürünleri EPD), ISO 14040/14044 (LCA), 
    EAA (European Aluminium Association) Sector EPD 2023, GWP = 100 yıl ufku (AR6 IPCC).
  </div>
</div>
<div class="footer">
  <span>OZZO Alüminyum | www.ozzoaluminyum.com | Tel: 0535 861 04 04</span>
  <span>${new Date().toLocaleDateString('tr-TR')}</span>
</div>`

  if (returnHtml) return html
  openPrint(html)
}
