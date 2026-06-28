/*
 * src/utils/dxfExport.js
 * DXF R2000 exporter — AutoCAD uyumlu kesit detayları
 *   exportFlixoDXF : alüminyum profil termal köprü kesiti
 *   exportPvcDXF   : PVC pencere çerçeve + kesim planı (1:1 ölçek, mm)
 *
 * Katman renk kodları (AutoCAD index colors):
 *   1=kırmızı 2=sarı 3=yeşil 4=cyan 5=mavi 6=macenta 7=beyaz
 */

/* ─── Minimal DXF R2000 yazıcı ─── */
class DXF {
  constructor() {
    this._lys = new Map([['0', 7]])
    this._e   = []
  }

  ly(n, c) { this._lys.set(n, c); return this }

  /* Kapalı dikdörtgen — LWPOLYLINE */
  rect(x, y, w, h, l = '0') {
    this._e.push(
      `0\nLWPOLYLINE\n8\n${l}\n70\n1\n43\n0\n90\n4\n` +
      `10\n${N(x)}\n20\n${N(y)}\n10\n${N(x+w)}\n20\n${N(y)}\n` +
      `10\n${N(x+w)}\n20\n${N(y+h)}\n10\n${N(x)}\n20\n${N(y+h)}\n`
    ); return this
  }

  /* Çizgi — LINE */
  line(x1, y1, x2, y2, l = '0') {
    this._e.push(
      `0\nLINE\n8\n${l}\n10\n${N(x1)}\n20\n${N(y1)}\n30\n0\n` +
      `11\n${N(x2)}\n21\n${N(y2)}\n31\n0\n`
    ); return this
  }

  /* Metin — TEXT  | align: 0=sol 1=orta 2=sağ | rot: açı derece */
  txt(x, y, s, h = 4, l = '0', rot = 0, align = 0) {
    let e = `0\nTEXT\n8\n${l}\n10\n${N(x)}\n20\n${N(y)}\n30\n0\n40\n${h}\n50\n${rot}\n1\n${s}\n`
    if (align) e += `72\n${align}\n11\n${N(x)}\n21\n${N(y)}\n`
    this._e.push(e); return this
  }

  /* Yatay ölçü çizgisi: x1 → x2, dim çizgisi baseY − off'ta */
  hdim(x1, x2, baseY, off, lbl, l = 'DIM') {
    const dy = baseY - off, a = 2
    this.line(x1, baseY, x1, dy + a, l).line(x2, baseY, x2, dy + a, l)
    this.line(x1, dy, x2, dy, l)
    this.line(x1, dy, x1+a, dy+a*0.4, l).line(x1, dy, x1+a, dy-a*0.4, l)
    this.line(x2, dy, x2-a, dy+a*0.4, l).line(x2, dy, x2-a, dy-a*0.4, l)
    this.txt((x1+x2)/2, dy - 4, lbl, 3, l, 0, 1)
    return this
  }

  /* Dikey ölçü çizgisi: y1 → y2, dim çizgisi baseX − off'ta */
  vdim(y1, y2, baseX, off, lbl, l = 'DIM') {
    const dx = baseX - off, a = 2
    this.line(baseX, y1, dx+a, y1, l).line(baseX, y2, dx+a, y2, l)
    this.line(dx, y1, dx, y2, l)
    this.line(dx, y1, dx+a*0.4, y1+a, l).line(dx, y1, dx-a*0.4, y1+a, l)
    this.line(dx, y2, dx+a*0.4, y2-a, l).line(dx, y2, dx-a*0.4, y2-a, l)
    this._e.push(
      `0\nTEXT\n8\n${l}\n10\n${N(dx-7)}\n20\n${N((y1+y2)/2)}\n30\n0\n` +
      `40\n3\n50\n90\n1\n${lbl}\n72\n1\n11\n${N(dx-7)}\n21\n${N((y1+y2)/2)}\n`
    ); return this
  }

  build() {
    const ld = [...this._lys.entries()]
      .map(([n, c]) => `0\nLAYER\n2\n${n}\n70\n0\n62\n${c}\n6\nContinuous\n`).join('')
    return (
      `0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1015\n9\n$INSUNITS\n70\n4\n0\nENDSEC\n` +
      `0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n70\n${this._lys.size}\n` + ld +
      `0\nENDTAB\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n` +
      this._e.join('') + `0\nENDSEC\n0\nEOF\n`
    )
  }
}

function N(n) { return Math.round(n * 100) / 100 }

function saveDXF(txt, name) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([txt], { type: 'application/dxf' }))
  a.download = name; a.click(); URL.revokeObjectURL(a.href)
}

/* ═══════════════════════════════════════════════════
   FLIXO — Alüminyum profil termal köprü kesit detayı
   ═══════════════════════════════════════════════════ */
export function exportFlixoDXF({ profile, glazing, W, H }) {
  const d = new DXF()
  d.ly('ALUMINYUM',    5)   // mavi  — alüminyum katmanlar
  d.ly('TERMAL_PA66',  2)   // sarı  — PA66 / PU termal kesici
  d.ly('CAM',          4)   // cyan  — cam alanı
  d.ly('CERCEVE',      6)   // macenta — dış sınır
  d.ly('DIM',          3)   // yeşil — ölçü çizgileri
  d.ly('YAZI',         7)   // beyaz — açıklamalar
  d.ly('TITLEBLOCK',   7)   // beyaz — başlık bloğu

  const wMM = W * 1000, hMM = H * 1000
  const fw  = profile.layers.reduce((s, l) => s + l.d, 0)
  const gw  = wMM - 2 * fw
  const gh  = hMM - 2 * fw

  /* ── 1. Pencere genel görünümü (1:1 ölçek, mm) ── */
  d.rect(0, 0, wMM, hMM, 'CERCEVE')
  d.rect(fw, fw, gw, gh, 'CAM')
  d.line(fw, fw, fw+gw, fw+gh, 'CAM').line(fw+gw, fw, fw, fw+gh, 'CAM')

  /* Alt + üst yatay çerçeve — katmanlar X yönünde */
  let lxH = 0
  for (const l of profile.layers) {
    const lay = l.lam > 1 ? 'ALUMINYUM' : 'TERMAL_PA66'
    d.rect(lxH, 0,        l.d, fw, lay)   // alt
    d.rect(lxH, hMM - fw, l.d, fw, lay)   // üst
    lxH += l.d
  }
  /* Sol + sağ dikey çerçeve — katmanlar Y yönünde */
  let lyV = 0
  for (const l of profile.layers) {
    const lay = l.lam > 1 ? 'ALUMINYUM' : 'TERMAL_PA66'
    d.rect(0,        fw + lyV, fw, l.d, lay)   // sol
    d.rect(wMM - fw, fw + lyV, fw, l.d, lay)   // sağ
    lyV += l.d
  }

  /* ── 2. Genel ölçüler ── */
  d.hdim(0, wMM, 0, 22, `W = ${wMM} mm`, 'DIM')
  d.vdim(0, hMM, 0, 22, `H = ${hMM} mm`, 'DIM')
  d.hdim(0, fw,  0, 40, `Çerçeve = ${fw} mm`, 'DIM')
  d.hdim(fw, fw + gw, 0, 40, `Cam = ${Math.round(gw)} mm`, 'DIM')

  /* ── 3. Büyütülmüş profil kesit detayı (5:1) ── */
  const S   = 5
  const dx0 = wMM + 90
  const detH = fw * S

  d.rect(dx0 - 6, -6, fw * S + 12, detH + 12, 'CERCEVE')
  d.txt(dx0 + fw*S/2, detH + 18, 'ÇERÇEVE KESİT DETAYI  5:1', 5.5, 'YAZI', 0, 1)
  d.txt(dx0 + fw*S/2, detH + 27, profile.name, 4.5, 'YAZI', 0, 1)
  d.txt(dx0 + fw*S/2, detH + 36,
    `Uf = ${profile.Uf} W/m²K   ψ_frame = ${profile.psi_frame} W/mK`, 4, 'DIM', 0, 1)

  let ddx = dx0
  for (const l of profile.layers) {
    const lay = l.lam > 1 ? 'ALUMINYUM' : 'TERMAL_PA66'
    const lw  = l.d * S
    d.rect(ddx, 0, lw, detH, lay)
    d.hdim(ddx, ddx + lw, 0, 14, `${l.d} mm`, 'DIM')
    d.txt(ddx + lw/2, detH/2 + 6,  l.label,    3.5, 'YAZI', 0, 1)
    d.txt(ddx + lw/2, detH/2 - 2,  `λ=${l.lam}`, 3,  'YAZI', 0, 1)
    d.txt(ddx + lw/2, detH/2 - 9,  'W/mK',     2.5, 'YAZI', 0, 1)
    ddx += lw
  }
  d.vdim(0, detH, dx0 - 6, 16, `${fw} mm`, 'DIM')

  /* ── 4. Kesit sembolü (A-A kesit işareti) ── */
  const midX = wMM / 2
  d.line(midX, -5, midX, hMM + 5, 'DIM')
  d.txt(midX, hMM + 12, 'KESİT A-A', 4, 'YAZI', 0, 1)

  /* ── 5. Başlık bloğu ── */
  const tbX = 0, tbY = -90, tbW = Math.max(wMM + 20, 370)
  d.rect(tbX, tbY, tbW, 68, 'TITLEBLOCK')
  d.line(tbX, tbY + 38, tbX + tbW, tbY + 38, 'TITLEBLOCK')
  d.line(tbX + tbW * 0.55, tbY, tbX + tbW * 0.55, tbY + 38, 'TITLEBLOCK')

  d.txt(tbX + 5, tbY + 48, 'OZZO ALUMINYUM — TERMAL KOPRU KESIT DETAYI', 5.5, 'YAZI')
  d.txt(tbX + 5, tbY + 57, `Profil: ${profile.name}  |  Cam: ${glazing?.name ?? '-'}`, 4.5, 'YAZI')
  d.txt(tbX + 5, tbY + 65,
    `Uf = ${profile.Uf} W/m²K   ψ = ${profile.psi_frame} W/mK   EN ISO 10077-1`, 4, 'DIM')
  d.txt(tbX + 5, tbY + 10,
    `Boyut: ${wMM} x ${hMM} mm   Çerçeve: ${fw} mm   Cam: ${Math.round(gw)} x ${Math.round(gh)} mm`, 4, 'DIM')
  d.txt(tbX + 5, tbY + 20,
    `Standart: EN ISO 10211 · EN ISO 10077-1 · EN ISO 13788 · TS 825`, 3.5, 'YAZI')
  d.txt(tbX + 5, tbY + 29,
    `Tarih: ${new Date().toLocaleDateString('tr-TR')}  |  Ölçek: 1:1 (1 birim = 1 mm)`, 3.5, 'YAZI')

  d.txt(tbX + tbW * 0.55 + 5, tbY + 10, 'OZZO Aluminyum', 5.5, 'YAZI')
  d.txt(tbX + tbW * 0.55 + 5, tbY + 22, 'Tel: +90 535 861 04 04', 4,   'YAZI')
  d.txt(tbX + tbW * 0.55 + 5, tbY + 32, new Date().toLocaleDateString('tr-TR'), 4, 'YAZI')

  saveDXF(d.build(), `OZZO_Flixo_${profile.short}_${W}x${H}m.dxf`)
}

/* ═══════════════════════════════════════════════════
   PVC — Pencere çerçeve + kesim planı (1:1 ölçek, mm)
   ═══════════════════════════════════════════════════ */
export function exportPvcDXF({ product, profileSys, glass, r, W, H, qty, clientName = '' }) {
  const d = new DXF()
  d.ly('PVC_PROFIL',  5)   // mavi  — PVC profil
  d.ly('CAM',         4)   // cyan  — cam alanı
  d.ly('CERCEVE',     6)   // macenta — dış sınır
  d.ly('DIM',         3)   // yeşil — ölçüler
  d.ly('YAZI',        7)   // beyaz — yazılar
  d.ly('KESIM_BAR',   2)   // sarı  — profil çubuğu
  d.ly('FIRE_ATIK',   1)   // kırmızı — fire / atık
  d.ly('TITLEBLOCK',  7)   // beyaz — başlık

  const wMM    = W * 1000, hMM = H * 1000
  const fw     = profileSys.outerW
  const gw     = wMM - 2 * fw, gh = hMM - 2 * fw
  const bLenMM = r.bLen * 1000   // çubuk uzunluğu mm cinsinden

  /* ── 1. Pencere çerçeve görünümü ── */
  d.rect(0, 0, wMM, hMM, 'CERCEVE')
  d.rect(0,      0,   fw,  hMM, 'PVC_PROFIL')  // sol profil
  d.rect(wMM-fw, 0,   fw,  hMM, 'PVC_PROFIL')  // sağ profil
  d.rect(fw,     0,   gw,  fw,  'PVC_PROFIL')  // alt profil
  d.rect(fw, hMM-fw,  gw,  fw,  'PVC_PROFIL')  // üst profil

  /* PVC kamera şematik çizgileri */
  const nCh = { p5:5, p6:6, p7:7, psl:4 }[profileSys.id] ?? 5
  const cw  = fw / nCh
  for (let i = 1; i < nCh; i++) {
    d.line(i*cw,      0,       i*cw,      fw,      'PVC_PROFIL')
    d.line(i*cw,      hMM-fw,  i*cw,      hMM,     'PVC_PROFIL')
    d.line(0,         i*cw,    fw,        i*cw,    'PVC_PROFIL')
    d.line(wMM-fw,    i*cw,    wMM,       i*cw,    'PVC_PROFIL')
  }

  /* Cam alanı + diyagonaller */
  d.rect(fw, fw, gw, gh, 'CAM')
  d.line(fw, fw, fw+gw, fw+gh, 'CAM').line(fw+gw, fw, fw, fw+gh, 'CAM')

  /* Cam ve profil bilgi yazıları */
  d.txt(fw + gw/2, fw + gh/2,     `Cam: ${glass.name}`,      5, 'YAZI', 0, 1)
  d.txt(fw + gw/2, fw + gh/2 - 9, `Ug = ${glass.Ug} W/m²K`, 4, 'DIM',  0, 1)
  d.txt(fw/2,      hMM/2,         `${profileSys.name}`,     4, 'YAZI', 90, 1)
  d.txt(fw/2,      hMM/2 - 10,    `Uf=${profileSys.Uf}`,    3.5, 'DIM', 90, 1)

  /* ── 2. Ölçüler ── */
  d.hdim(0,  wMM,    0, 22, `W = ${wMM} mm`,              'DIM')
  d.vdim(0,  hMM,    0, 22, `H = ${hMM} mm`,              'DIM')
  d.hdim(0,  fw,     0, 40, `Profil = ${fw} mm`,           'DIM')
  d.hdim(fw, fw+gw,  0, 40, `Cam = ${Math.round(gw)} mm`, 'DIM')

  /* ── 3. Kesim planı (gerçek 1:1 ölçek — mm) ── */
  const cpY0  = -65
  const barH  = 24
  const barGp = 10

  d.txt(0, cpY0 + 10,
    `KESiM PLANI — ${r.cutting.bars.length} Çubuk × ${r.bLen} m  (Fire: ${r.cutting.wastePerc.toFixed(1)}%)`, 5, 'YAZI')
  d.txt(0, cpY0 + 21,
    `${r.allPieces.length} parça · ${qty} pencere · Net: ${r.cutting.totalUsed.toFixed(3)} m · Atık: ${r.cutting.waste.toFixed(3)} m`,
    4, 'DIM')

  r.cutting.bars.forEach((bar, bi) => {
    const barY = cpY0 - (bi + 1) * (barH + barGp)
    /* Çubuk arka planı */
    d.rect(0, barY, bLenMM, barH, 'KESIM_BAR')
    d.txt(-24, barY + barH/2 - 2, `#${bi+1}`, 4, 'YAZI')

    let cutX = 0
    bar.cuts.forEach((cut) => {
      const cMM = cut * 1000
      d.rect(cutX, barY, cMM - 3, barH, 'KESIM_BAR')
      if (cMM > 80) d.txt(cutX + cMM/2, barY + barH/2 - 2, `${cut.toFixed(3)} m`, 3.5, 'YAZI', 0, 1)
      cutX += cMM
    })

    /* Fire (kırmızı) */
    const wasteW = bLenMM - cutX
    if (wasteW > 30) {
      d.rect(cutX, barY, wasteW, barH, 'FIRE_ATIK')
      if (wasteW > 100) d.txt(cutX + wasteW/2, barY + barH/2 - 2,
        `${wasteW.toFixed(0)} mm atık`, 3, 'FIRE_ATIK', 0, 1)
    }

    /* Çubuk ölçü çizgisi */
    d.hdim(0, bLenMM, barY, 12, `${r.bLen} m`, 'DIM')
  })

  /* ── 4. Başlık bloğu ── */
  const bars = r.cutting.bars.length
  const tbY  = cpY0 - (bars + 1) * (barH + barGp) - 80
  const tbW  = Math.max(wMM, 420)

  d.rect(0, tbY, tbW, 65, 'TITLEBLOCK')
  d.line(0, tbY + 38, tbW, tbY + 38, 'TITLEBLOCK')
  d.line(tbW * 0.56, tbY, tbW * 0.56, tbY + 38, 'TITLEBLOCK')

  d.txt(5, tbY + 47, 'OZZO ALUMINYUM — PVC KESIM PLANI & TEKLIF', 5.5, 'YAZI')
  d.txt(5, tbY + 57, `${product.name}  ·  ${profileSys.name}  ·  ${glass.name}`, 4.5, 'YAZI')
  d.txt(5, tbY + 64, clientName ? `Müşteri: ${clientName}` : '', 4, 'YAZI')

  d.txt(5, tbY + 10,
    `Boyut: ${wMM}×${hMM} mm  ·  ${qty} adet  ·  Toplam Alan: ${(W*H*qty).toFixed(3)} m²`, 4, 'DIM')
  d.txt(5, tbY + 20,
    `Profil Uf = ${profileSys.Uf} W/m²K  ·  Cam Ug = ${glass.Ug} W/m²K  ·  Enerji Sınıfı: ${r.ec?.cls ?? '-'}`, 4, 'DIM')
  d.txt(5, tbY + 30,
    `${r.barsNeeded} çubuk × ${r.bLen} m  ·  Fire: ${r.cutting.wastePerc.toFixed(1)}%  ·  1 birim = 1 mm`, 3.5, 'YAZI')

  d.txt(tbW * 0.56 + 5, tbY + 10, 'OZZO Aluminyum',                      5.5, 'YAZI')
  d.txt(tbW * 0.56 + 5, tbY + 22, 'Tel: +90 535 861 04 04',               4,   'YAZI')
  d.txt(tbW * 0.56 + 5, tbY + 33, new Date().toLocaleDateString('tr-TR'), 4,   'YAZI')

  saveDXF(d.build(), `OZZO_PVC_${product.short}_${qty}ad_${wMM}x${hMM}.dxf`)
}
