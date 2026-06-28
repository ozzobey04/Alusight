/* ═══════════════════════════════════════════════════════════
   OZZO Rapor Profili — Müşteri/Proje Bilgisi
   localStorage: ozzo_rapor_profili
   ═══════════════════════════════════════════════════════════ */

const KEY        = 'ozzo_rapor_profili'
const TERCIH_KEY = 'ozzo_sablon_tercih'   // 'ozzo' | 'musteri' | null

export const defaultProfil = () => ({
  firmaAdi:    '',
  musteriAdi:  '',
  projeAdi:    '',
  projeNo:     '',
  adres:       '',
  telefon:     '',
  email:       '',
  hazırlayan:  '',
  tarih:       new Date().toLocaleDateString('tr-TR'),
  logo:        '',
  antet:       '',
  dipnot:      '',
  renkTema:    '#c9a84c',
})

export function loadProfil() {
  try { return { ...defaultProfil(), ...JSON.parse(localStorage.getItem(KEY) || '{}') } }
  catch { return defaultProfil() }
}

export function saveProfil(p) {
  localStorage.setItem(KEY, JSON.stringify(p))
}

/* Kullanıcının müşteri şablonu dolu mu? */
export function musteriSablonuVar() {
  const p = loadProfil()
  return !!(p.firmaAdi || p.musteriAdi || p.logo || p.antet)
}

/* Şablon tercihi — 'ozzo' | 'musteri' | null (sorulsun) */
export function getSablonTercih() {
  return localStorage.getItem(TERCIH_KEY) || null
}
export function setSablonTercih(val) {
  if (val) localStorage.setItem(TERCIH_KEY, val)
  else localStorage.removeItem(TERCIH_KEY)
}

/* Aktif profile göre profil döndür */
export function getAktifProfil() {
  const tercih = getSablonTercih()
  if (tercih === 'musteri') return loadProfil()
  return defaultProfil()
}

/* OZZO varsayılan header (müşteri bilgisi yok) */
export const ozzoProfil = () => defaultProfil()

/* Rapor HTML başlığı — tüm sayfalarda ortak */
export function buildReportHeader(profil, baslik, standart, raporNo) {
  const date = profil.tarih || new Date().toLocaleDateString('tr-TR')
  const tema = profil.renkTema || '#c9a84c'

  /* ── Antet modu: sadece rapor başlığı + meta, görsel arka planda ── */
  if (profil.antet) {
    return `
  <div style="margin-bottom:28px;padding-bottom:14px;border-bottom:2px solid ${tema}">
    <div style="font-size:15px;font-weight:700;color:#111;text-align:center">${baslik}</div>
    <div style="font-size:10px;color:#888;text-align:center;margin-top:3px">${standart}</div>
    <div style="display:flex;justify-content:space-between;margin-top:10px;font-size:11px;color:#555">
      <div>
        ${profil.projeAdi    ? `<span><strong>Proje:</strong> ${profil.projeAdi}</span>` : ''}
        ${profil.musteriAdi  ? ` &nbsp;·&nbsp; <span><strong>Müşteri:</strong> ${profil.musteriAdi}</span>` : ''}
        ${profil.hazırlayan  ? ` &nbsp;·&nbsp; <span><strong>Hazırlayan:</strong> ${profil.hazırlayan}</span>` : ''}
      </div>
      <div style="text-align:right">
        ${raporNo ? `<strong>Rapor No:</strong> ${raporNo} &nbsp;&nbsp;` : ''}
        <strong>Tarih:</strong> ${date}
      </div>
    </div>
  </div>`
  }

  /* ── Normal mod: OZZO veya müşteri branding'i ── */
  const logoHtml = profil.logo
    ? `<img src="${profil.logo}" style="max-height:52px;max-width:150px;object-fit:contain;display:block" />`
    : `<div style="font-size:24px;font-weight:900;letter-spacing:0.1em;color:#111">${profil.firmaAdi || 'OZZO'}</div>
       <div style="font-size:8px;letter-spacing:0.25em;color:#888;margin-top:1px">${profil.firmaAdi ? '' : 'ALÜMINYUM'}</div>`

  const projeBlok = (profil.projeAdi || profil.musteriAdi || profil.hazırlayan)
    ? `<div style="margin-top:10px;padding-top:8px;border-top:1px solid #e5e7eb;font-size:10px;color:#555;line-height:1.8">
        ${profil.musteriAdi  ? `<div><strong>Müşteri:</strong> ${profil.musteriAdi}</div>` : ''}
        ${profil.projeAdi    ? `<div><strong>Proje:</strong> ${profil.projeAdi}</div>` : ''}
        ${profil.hazırlayan  ? `<div><strong>Hazırlayan:</strong> ${profil.hazırlayan}</div>` : ''}
       </div>` : ''

  return `
  <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid ${tema};padding-bottom:16px;margin-bottom:22px">
    <div style="min-width:140px">${logoHtml}${projeBlok}</div>
    <div style="text-align:center;flex:1;padding:0 24px">
      <div style="font-size:15px;font-weight:700;color:#111">${baslik}</div>
      <div style="font-size:10px;color:#888;margin-top:4px">${standart}</div>
    </div>
    <div style="text-align:right;font-size:11px;color:#555;line-height:1.9;min-width:150px">
      ${raporNo          ? `<div><strong>Rapor No:</strong> ${raporNo}</div>` : ''}
      ${profil.projeNo   ? `<div><strong>Proje No:</strong> ${profil.projeNo}</div>` : ''}
      <div><strong>Tarih:</strong> ${date}</div>
      ${profil.telefon   ? `<div>${profil.telefon}</div>` : ''}
      ${profil.email     ? `<div>${profil.email}</div>` : ''}
    </div>
  </div>`
}

/* Rapor footer */
export function buildReportFooter(profil, raporNo) {
  /* Antet modunda footer içeriği minimale indirgeniyor — antet zaten footer'ı taşıyor */
  if (profil.antet) {
    const dipnot = profil.dipnot
      ? `<div style="margin-top:6px;font-size:10px;color:#9ca3af">${profil.dipnot}</div>` : ''
    return `
  <div style="margin-top:32px;padding-top:10px;border-top:1px solid #e5e7eb;font-size:10px;color:#bbb;text-align:center">
    ${raporNo} &nbsp;·&nbsp; ${profil.tarih || new Date().toLocaleDateString('tr-TR')}${dipnot}
  </div>`
  }

  const ozzo  = 'OZZO Alüminyum — Mimari ve Teknik Ekibi'
  const firma = profil.firmaAdi
    ? `${profil.firmaAdi}${profil.hazırlayan ? ' · ' + profil.hazırlayan : ''}`
    : ozzo
  const tema  = profil.renkTema || '#c9a84c'
  const dipnot = profil.dipnot
    ? `<div style="margin-top:4px;font-size:10px;color:#bbb">${profil.dipnot}</div>` : ''

  return `
  <div style="margin-top:32px;border-top:2px solid ${tema};padding-top:10px;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#9ca3af">
    <div>${firma}</div>
    <div>${raporNo} &nbsp;·&nbsp; ${profil.tarih || new Date().toLocaleDateString('tr-TR')}</div>
  </div>${dipnot}`
}

/* ── PDF aç + print dialog ──────────────────────────────────────
   Antet varsa:
   - position:fixed img olarak tam sayfayı kaplar
   - @page margin 0, content margin ile antetin header/footer
     alanlarına taşmaz
   ─────────────────────────────────────────────────────────── */
export function openPdfPreview(html, profil) {
  let finalHtml = html

  if (profil?.antet) {
    const tema = profil.renkTema || '#c9a84c'

    const antetLayer = `
    <img id="antet-bg" src="${profil.antet}"
      style="position:fixed;top:0;left:0;width:100%;height:100%;
             object-fit:cover;z-index:-1;pointer-events:none;print-color-adjust:exact;-webkit-print-color-adjust:exact" />`

    const antetOverrideCss = `
<style>
@page { margin: 0; size: A4 portrait; }
body  { margin: 0 !important; padding: 0 !important; background: transparent !important; }
#rapor-icerik { margin: 130px 50px 130px 50px; position: relative; z-index: 1; }
</style>`

    finalHtml = html
      .replace('</head>', `${antetOverrideCss}</head>`)
      .replace('<body>', `<body>${antetLayer}<div id="rapor-icerik">`)
      .replace('</body>', '</div></body>')
  }

  const blob = new Blob([finalHtml], { type: 'text/html;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const win  = window.open(url, '_blank', 'width=960,height=750')
  if (win) { win.onload = () => { win.focus(); win.print() } }
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}
