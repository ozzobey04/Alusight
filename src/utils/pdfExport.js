let _pdfMake = null
let _loadingPromise = null

async function getPdfMake() {
  if (_pdfMake) return _pdfMake
  if (_loadingPromise) return _loadingPromise
  _loadingPromise = Promise.all([
    import('pdfmake/build/pdfmake'),
    import('pdfmake/build/vfs_fonts'),
  ]).then(([pdfMakeModule, pdfFontsModule]) => {
    const pdfMake = pdfMakeModule.default ?? pdfMakeModule
    const pdfFonts = pdfFontsModule.default ?? pdfFontsModule
    pdfMake.vfs = pdfFonts.vfs ?? pdfFonts
    _pdfMake = pdfMake
    _loadingPromise = null
    return _pdfMake
  })
  return _loadingPromise
}

export function preloadPdfMake() {
  getPdfMake().catch(() => {})
}

const BRAND = 'OZZO Alüminyum'
const PHONE = '+90 535 861 04 04'
const EMAIL = 'info@ozzoaluminyum.com'
const WEB   = 'www.ozzoaluminyum.com'

const GOLD  = '#b48c3c'
const DARK  = '#141e32'
const GRAY  = '#646e7d'
const WHITE = '#ffffff'
const LIGHT = '#f5f5f5'

function headerContent(title, subtitle) {
  return [
    {
      columns: [
        { text: BRAND, style: 'brandName', width: '*' },
        { text: PHONE, style: 'brandPhone', width: 'auto', alignment: 'right' },
      ],
      fillColor: GOLD,
      margin: [14, 8, 14, 8],
    },
    {
      stack: [
        { text: title, style: 'reportTitle' },
        subtitle ? { text: subtitle, style: 'reportSubtitle' } : {},
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.6, lineColor: GOLD }], margin: [0, 4, 0, 8] },
      ],
      margin: [14, 10, 14, 0],
    }
  ]
}

function sectionHeader(text) {
  return {
    stack: [
      { text: text, style: 'sectionTitle' },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 0.3, lineColor: GOLD }], margin: [0, 1, 0, 6] },
    ],
    margin: [0, 8, 0, 0],
  }
}

function footerContent(currentPage, pageCount) {
  return {
    columns: [
      { text: `${BRAND} · ${PHONE} · ${WEB}`, style: 'footerText', width: '*' },
      { text: `Sayfa ${currentPage} / ${pageCount}`, style: 'footerText', width: 'auto', alignment: 'right' },
    ],
    margin: [14, 4, 14, 0],
  }
}

const baseStyles = {
  brandName: { fontSize: 13, bold: true, color: WHITE },
  brandPhone: { fontSize: 9, color: WHITE },
  reportTitle: { fontSize: 17, bold: true, color: DARK, margin: [0, 0, 0, 2] },
  reportSubtitle: { fontSize: 9, color: GRAY, margin: [0, 0, 0, 2] },
  sectionTitle: { fontSize: 10, bold: true, color: GOLD },
  tableHeader: { fontSize: 8.5, bold: true, color: WHITE, fillColor: DARK },
  tableCell: { fontSize: 8.5, color: '#1e1e1e' },
  tableLabelCell: { fontSize: 8.5, bold: true, color: DARK, fillColor: LIGHT },
  footerText: { fontSize: 7.5, color: GRAY },
  noteText: { fontSize: 7.5, italics: true, color: GRAY },
}

/* ══════════════════════════════════════════════
   FLIXO — TERMAL KÖPRÜ RAPORU
══════════════════════════════════════════════ */
function buildFlixoDocDef({ profile, glazing, r, Tin, Tout, RHin, climate, W, H, insights }) {
  const dateStr = new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })

  const docDef = {
    pageMargins: [14, 20, 14, 30],
    footer: footerContent,
    styles: baseStyles,
    defaultStyle: { font: 'Roboto', fontSize: 9 },

    content: [
      ...headerContent('Termal Köprü Analiz Raporu', `EN ISO 10077-1 / EN ISO 10211 / EN ISO 13788 · ${dateStr}`),

      sectionHeader('Proje Özellikleri'),
      {
        table: {
          widths: [90, 100, 90, 100],
          body: [
            [
              { text: 'Profil Sistemi', style: 'tableLabelCell' },
              { text: profile.name, style: 'tableCell' },
              { text: 'Cam Sistemi', style: 'tableLabelCell' },
              { text: glazing.name, style: 'tableCell' },
            ],
            [
              { text: 'Uf (çerçeve)', style: 'tableLabelCell' },
              { text: `${profile.Uf} W/m²K`, style: 'tableCell' },
              { text: 'Ug (cam)', style: 'tableLabelCell' },
              { text: `${glazing.Ug} W/m²K`, style: 'tableCell' },
            ],
            [
              { text: 'ψ çerçeve', style: 'tableLabelCell' },
              { text: `${profile.psi_frame} W/mK`, style: 'tableCell' },
              { text: 'g faktörü', style: 'tableLabelCell' },
              { text: `${glazing.g}`, style: 'tableCell' },
            ],
            [
              { text: 'Boyutlar', style: 'tableLabelCell' },
              { text: `${W.toFixed(2)} × ${H.toFixed(2)} m`, style: 'tableCell' },
              { text: 'Alan', style: 'tableLabelCell' },
              { text: `${(W * H).toFixed(4)} m²`, style: 'tableCell' },
            ],
            [
              { text: 'Şehir / Bölge', style: 'tableLabelCell' },
              { text: climate.name, style: 'tableCell' },
              { text: 'Dış sıcaklık (Tout)', style: 'tableLabelCell' },
              { text: `${Tout}°C`, style: 'tableCell' },
            ],
            [
              { text: 'İç sıcaklık (Tin)', style: 'tableLabelCell' },
              { text: `${Tin}°C`, style: 'tableCell' },
              { text: 'İç nem (RHin)', style: 'tableLabelCell' },
              { text: `${RHin}%`, style: 'tableCell' },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 8],
      },

      sectionHeader('Hesaplama Sonuçları'),
      {
        columns: [
          {
            stack: [
              { text: r.ec.cls, fontSize: 28, bold: true, color: GOLD, alignment: 'center' },
              { text: 'Enerji Sınıfı', fontSize: 8, color: DARK, alignment: 'center' },
              { text: `${r.Uw.toFixed(4)} W/m²K`, fontSize: 13, bold: true, color: DARK, alignment: 'center', margin: [0, 2, 0, 0] },
            ],
            width: 90,
            margin: [0, 4, 8, 4],
          },
          {
            table: {
              widths: [140, 80, 90, 80],
              body: [
                [
                  { text: 'Parametre', style: 'tableHeader' },
                  { text: 'Değer', style: 'tableHeader' },
                  { text: 'Standart', style: 'tableHeader' },
                  { text: 'Durum', style: 'tableHeader' },
                ],
                ['Uw (pencere ısı geçirgenliği)', `${r.Uw.toFixed(4)} W/m²K`, 'EN ISO 10077-1', r.ec.cls],
                ['fRsi (yüzey sıcaklık faktörü)', r.fRsi.toFixed(4), 'EN ISO 13788', r.fRsi >= 0.70 ? 'Uyumlu' : 'Kritik'],
                ['Tsi (iç yüzey sıcaklığı)', `${r.Tsi.toFixed(2)}°C`, 'EN ISO 13788', r.condensRisk ? 'Yoğuşma Riski' : 'Güvenli'],
                ['Tdew (çiğlenme noktası)', `${r.Tdew_in.toFixed(2)}°C`, 'Magnus formülü', ''],
                ['Rtotal (toplam ısı direnci)', `${r.Rtotal.toFixed(4)} m²K/W`, 'EN ISO 10211', ''],
                ['Anlık ısı kaybı', `${r.heatLoss.toFixed(1)} W`, `ΔT = ${Tin - Tout}°C`, ''],
              ],
            },
            layout: 'lightHorizontalLines',
            fontSize: 8.5,
            width: '*',
          },
        ],
        columnGap: 0,
        margin: [0, 0, 0, 8],
      },

      sectionHeader('ψ Doğrusal Isı Köprüsü Değerleri (EN ISO 10211)'),
      {
        table: {
          widths: ['*', 70, 70, 70],
          body: [
            [
              { text: 'Bağlantı Noktası', style: 'tableHeader' },
              { text: 'ψ (W/mK)', style: 'tableHeader' },
              { text: 'Uzunluk (m)', style: 'tableHeader' },
              { text: 'Katkı (W/mK)', style: 'tableHeader' },
            ],
            ['Üst kasa (lento)',       r.psi_head.toFixed(4),   r.lg_head.toFixed(3),  (r.psi_head * r.lg_head).toFixed(4)],
            ['Alt kasa (denizlik)',    r.psi_sill.toFixed(4),   r.lg_sill.toFixed(3),  (r.psi_sill * r.lg_sill).toFixed(4)],
            ['Yan kasalar (×2)',       r.psi_jamb.toFixed(4),   r.lg_jambs.toFixed(3), (r.psi_jamb * r.lg_jambs).toFixed(4)],
            ['Köşe bağlantıları (×4)', (r.psi_corner/4).toFixed(4), '4',              r.psi_corner.toFixed(4)],
            [
              { text: 'Σ Toplam', bold: true },
              '',
              '',
              { text: r.psiTotal.toFixed(4), bold: true, fillColor: '#fff8dc' },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
        fontSize: 8.5,
        margin: [0, 0, 0, 8],
      },

      sectionHeader('Katman Arayüz Sıcaklıkları'),
      {
        table: {
          widths: ['*', 80, '*'],
          body: [
            [
              { text: 'Katman', style: 'tableHeader' },
              { text: 'Sıcaklık', style: 'tableHeader' },
              { text: 'Not', style: 'tableHeader' },
            ],
            ['Dış hava', `${Tout}°C`, 'Rse = 0.040 m²K/W'],
            ...r.layerTemps.map(lt => [lt.label, `${lt.T}°C`, '']),
            ['İç yüzey (Tsi)', `${r.Tsi.toFixed(2)}°C`, 'Rsi = 0.130 m²K/W'],
            ['İç hava', `${Tin}°C`, ''],
          ],
        },
        layout: 'lightHorizontalLines',
        fontSize: 8.5,
        margin: [0, 0, 0, 8],
      },

      sectionHeader('AI Destekli Analiz ve Öneriler'),
      {
        table: {
          widths: [16, '*'],
          body: [
            [
              { text: '#', style: 'tableHeader' },
              { text: 'Bulgu ve Öneri', style: 'tableHeader' },
            ],
            ...insights.map((ins, i) => [
              { text: `${i + 1}.`, fontSize: 8, color: GOLD, bold: true },
              { text: ins.text, fontSize: 8 },
            ]),
          ],
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 8],
      },
    ],
  }

  return docDef
}

export async function exportFlixoPDF(params) {
  const pm = await getPdfMake()
  const docDef = buildFlixoDocDef(params)
  pm.createPdf(docDef).download(`OZZO_Flixo_Rapor_${Date.now()}.pdf`)
}

export async function previewFlixoPDF(params, onDataUrl) {
  const pm = await getPdfMake()
  const docDef = buildFlixoDocDef(params)
  pm.createPdf(docDef).getDataUrl(onDataUrl)
}

/* ══════════════════════════════════════════════
   PVC — FİYAT TEKLİFİ
══════════════════════════════════════════════ */
export async function exportPvcPDF(params) {
  const pm = await getPdfMake()
  const docDef = buildPvcDocDef(params)
  pm.createPdf(docDef).download(`OZZO_PVC_Teklif_${params.clientName ? params.clientName.replace(/\s/g, '_') : Date.now()}.pdf`)
}

export async function previewPvcPDF(params, onDataUrl) {
  const pm = await getPdfMake()
  const docDef = buildPvcDocDef(params)
  pm.createPdf(docDef).getDataUrl(onDataUrl)
}

function buildPvcDocDef({ product, profileSys, glass, hardware, color, r, W, H, qty, clientName, vatChecked }) {
  const dateStr = new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
  const fmt = (n) => n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const totalAmount = vatChecked ? r.total : r.subtotal

  const lineItems = [
    [`Profil (${r.barsNeeded} çubuk × ${r.bLen}m × ${profileSys.pricePerM}₺/m)`, `${fmt(r.profileCost)} ₺`],
    [`Cam (${(r.glassArea * qty).toFixed(3)} m² × ${glass.pricePerM2}₺/m²)`, `${fmt(r.glassCost)} ₺`],
    [`İşçilik (${(r.glassArea * qty).toFixed(3)} m² × 180₺/m²)`, `${fmt(r.laborCost)} ₺`],
    [`Donanım (${qty} ad × ${hardware.price}₺)`, `${fmt(r.hardwareCost)} ₺`],
  ]
  if (r.colorSurcharge > 0) lineItems.push([`Renk farkı (+${color.surcharge}%)`, `${fmt(r.colorSurcharge)} ₺`])

  const totalRows = [
    ['Ara Toplam', `${fmt(r.subtotal)} ₺`],
    ...(vatChecked ? [['KDV (%20)', `${fmt(r.vat)} ₺`]] : []),
    [{ text: 'TOPLAM', bold: true, fontSize: 11, color: '#1e7832' }, { text: `${fmt(totalAmount)} ₺`, bold: true, fontSize: 11, color: '#1e7832', alignment: 'right' }],
    [{ text: `Birim Fiyat (${qty} adet)`, bold: true, color: DARK }, { text: `${fmt(totalAmount / qty)} ₺ / pencere`, bold: true, color: DARK, alignment: 'right' }],
  ]

  const docDef = {
    pageMargins: [14, 20, 14, 30],
    footer: footerContent,
    styles: baseStyles,
    defaultStyle: { font: 'Roboto', fontSize: 9 },

    content: [
      ...headerContent('Fiyat Teklifi', `PVC Pencere & Kapı Hesaplama · ${dateStr}`),

      clientName ? {
        text: `Müşteri / Proje: ${clientName}`,
        fontSize: 9,
        color: DARK,
        fillColor: '#f8fcf8',
        margin: [4, 6, 4, 10],
      } : {},

      sectionHeader('Ürün Özellikleri'),
      {
        table: {
          widths: [80, 100, 80, 100],
          body: [
            [
              { text: 'Ürün Tipi', style: 'tableLabelCell' },
              { text: product.name, style: 'tableCell' },
              { text: 'Profil Sistemi', style: 'tableLabelCell' },
              { text: profileSys.name, style: 'tableCell' },
            ],
            [
              { text: 'Cam', style: 'tableLabelCell' },
              { text: glass.name, style: 'tableCell' },
              { text: 'Renk', style: 'tableLabelCell' },
              { text: color.name, style: 'tableCell' },
            ],
            [
              { text: 'Donanım', style: 'tableLabelCell' },
              { text: hardware.name, style: 'tableCell' },
              { text: 'Açılış Tipi', style: 'tableLabelCell' },
              { text: 'Seçildi', style: 'tableCell' },
            ],
            [
              { text: 'Ölçü', style: 'tableLabelCell' },
              { text: `${W.toFixed(2)} × ${H.toFixed(2)} m`, style: 'tableCell' },
              { text: 'Adet', style: 'tableLabelCell' },
              { text: `${qty} adet`, style: 'tableCell' },
            ],
            [
              { text: 'Uw değeri', style: 'tableLabelCell' },
              { text: `${r.Uw.toFixed(4)} W/m²K`, style: 'tableCell' },
              { text: 'Enerji Sınıfı', style: 'tableLabelCell' },
              { text: r.ec.cls, style: 'tableCell' },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 8],
      },

      sectionHeader('Kesim Planı Özeti'),
      {
        table: {
          widths: [180, '*'],
          body: [
            [
              { text: 'Parametre', style: 'tableHeader' },
              { text: 'Değer', style: 'tableHeader' },
            ],
            [{ text: 'Çubuk uzunluğu', bold: true }, `${r.bLen} m`],
            [{ text: 'Gereken çubuk sayısı', bold: true }, `${r.barsNeeded} adet`],
            [{ text: 'Toplam parça sayısı', bold: true }, `${r.allPieces.length} adet`],
            [{ text: 'Net kullanım', bold: true }, `${r.cutting.totalUsed.toFixed(3)} m`],
            [{ text: 'Fire (atık)', bold: true }, `${r.cutting.waste.toFixed(3)} m (${r.cutting.wastePerc.toFixed(1)}%)`],
            [{ text: 'Toplam cam alanı', bold: true }, `${(r.glassArea * qty).toFixed(3)} m²`],
          ],
        },
        layout: 'lightHorizontalLines',
        fontSize: 8.5,
        margin: [0, 0, 0, 8],
      },

      sectionHeader('Fiyat Detayı'),
      {
        table: {
          widths: ['*', 80],
          body: [
            [
              { text: 'Kalem Açıklaması', style: 'tableHeader' },
              { text: 'Tutar', style: 'tableHeader', alignment: 'right' },
            ],
            ...lineItems.map(([desc, amt]) => [
              { text: desc, fontSize: 8.5 },
              { text: amt, fontSize: 8.5, alignment: 'right' },
            ]),
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 0],
      },

      {
        table: {
          widths: ['*', 80],
          body: totalRows.map(([left, right]) => [
            typeof left === 'string' ? { text: left, bold: true, color: DARK } : left,
            typeof right === 'string' ? { text: right, alignment: 'right', bold: true, color: DARK } : right,
          ]),
        },
        layout: 'noBorders',
        margin: [0, 4, 0, 8],
      },

      { text: '* Bu teklif hesaplama araçları ile oluşturulmuştur. Kesin fiyat için OZZO Alüminyum ile iletişime geçiniz.', style: 'noteText' },
      { text: '* Fiyatlara montaj dahil değildir. KDV ayrıca hesaplanmıştır.', style: 'noteText', margin: [0, 3, 0, 0] },
    ],
  }

  return docDef
}

/* ══════════════════════════════════════════════
   KARBON AYAK İZİ — EN 15978 RAPORU
══════════════════════════════════════════════ */
function buildCarbonDocDef({ product, alType, glass, surface, city, energySource, transport, lifecycle, W, H, qty, r, customHDD }) {
  const dateStr = new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
  const GREEN  = '#22c55e'
  const BLUE   = '#2563eb'
  const RED    = '#dc2626'
  const clsHex = r.clsColor || GOLD

  const clsLabel =
    r.cls === 'A+' ? 'Mükemmel — EU Green Deal 2050 hedefinin altında' :
    r.cls === 'A'  ? 'Çok İyi — En iyi uygulama sınıfı' :
    r.cls === 'B'  ? 'İyi — AB sektör ortalamasının altında' :
    r.cls === 'C'  ? 'Orta — Optimizasyon önerilir' :
                     'Yüksek — Acil optimizasyon gerekli'

  const docDef = {
    pageMargins: [14, 20, 14, 30],
    footer: footerContent,
    styles: baseStyles,
    defaultStyle: { font: 'Roboto', fontSize: 9 },

    content: [
      ...headerContent('Karbon Ayak İzi Raporu (EN 15978)', `EN 15978 / EN 15804 / EAA EPD 2023 / IPCC AR6 · ${dateStr}`),

      sectionHeader('Proje Özeti'),
      {
        table: {
          widths: [90, 120, 90, 120],
          body: [
            [
              { text: 'Sistem', style: 'tableLabelCell' }, { text: product?.name || '-',     style: 'tableCell' },
              { text: 'Boyut',  style: 'tableLabelCell' }, { text: `${W} × ${H} m · ${qty} adet`, style: 'tableCell' },
            ],
            [
              { text: 'Toplam Alan', style: 'tableLabelCell' }, { text: `${r.area.toFixed(2)} m²`, style: 'tableCell' },
              { text: 'Cam Alanı',   style: 'tableLabelCell' }, { text: `${r.glassArea.toFixed(2)} m²`, style: 'tableCell' },
            ],
            [
              { text: 'Alüminyum',  style: 'tableLabelCell' }, { text: `${alType?.name} (${r.gwpAl} kg CO₂e/kg)`, style: 'tableCell' },
              { text: 'Cam Sistemi', style: 'tableLabelCell' }, { text: glass?.name || '-', style: 'tableCell' },
            ],
            [
              { text: 'Yüzey İşlemi', style: 'tableLabelCell' }, { text: surface?.name || '-', style: 'tableCell' },
              { text: 'Nakliye',       style: 'tableLabelCell' }, { text: transport?.name || '-', style: 'tableCell' },
            ],
            [
              { text: 'Konum (HDD)', style: 'tableLabelCell' }, { text: `${city?.name} — ${r.HDD} HDD`, style: 'tableCell' },
              { text: 'Enerji Kaynağı', style: 'tableLabelCell' }, { text: energySource?.name || '-', style: 'tableCell' },
            ],
            [
              { text: 'Yaşam Döngüsü', style: 'tableLabelCell' }, { text: lifecycle?.label || '-', style: 'tableCell' },
              { text: 'Hesaplama Tarihi', style: 'tableLabelCell' }, { text: dateStr, style: 'tableCell' },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
        fontSize: 8.5,
        margin: [0, 0, 0, 10],
      },

      sectionHeader('Karbon Sınıfı & Ana Sonuçlar'),
      {
        columns: [
          {
            width: 110,
            stack: [
              { text: r.cls, fontSize: 42, bold: true, color: clsHex, alignment: 'center', margin: [0, 4, 0, 2] },
              { text: 'Karbon Sınıfı', fontSize: 7.5, color: GRAY, alignment: 'center' },
              { text: `${r.perM2_AtoC.toFixed(1)} kg CO₂e/m²`, fontSize: 10, bold: true, color: clsHex, alignment: 'center', margin: [0, 4, 0, 0] },
              { text: clsLabel, fontSize: 7, color: GRAY, alignment: 'center', margin: [0, 2, 0, 0] },
            ],
            margin: [0, 0, 10, 0],
          },
          {
            width: '*',
            table: {
              widths: ['*', 80],
              body: [
                [
                  { text: 'Metrik', style: 'tableHeader' },
                  { text: 'Değer', style: 'tableHeader', alignment: 'right' },
                ],
                [{ text: 'Toplam (A–C modülleri)', bold: true }, { text: `${r.total_AtoC.toFixed(1)} kg CO₂e`, alignment: 'right', color: clsHex, bold: true }],
                [{ text: 'm² başına (A–C)' },                    { text: `${r.perM2_AtoC.toFixed(1)} kg CO₂e/m²`, alignment: 'right' }],
                [{ text: 'Gömülü karbon (A1–A5)' },              { text: `${r.EC_total.toFixed(1)} kg CO₂e`, alignment: 'right', color: BLUE }],
                [{ text: 'İşletme karbonu (B6)' },               { text: `${r.OC_total.toFixed(1)} kg CO₂e`, alignment: 'right', color: RED }],
                [{ text: 'Yıkım (C4)' },                         { text: `${r.EoL_C4.toFixed(1)} kg CO₂e`, alignment: 'right' }],
                [{ text: 'Geri dönüşüm kredisi (D modülü)' },    { text: `${r.EoL_D.toFixed(1)} kg CO₂e`, alignment: 'right', color: GREEN }],
                [{ text: 'Toplam (A–D, referans)' },             { text: `${r.total_AtoD.toFixed(1)} kg CO₂e`, alignment: 'right' }],
              ],
            },
            layout: 'lightHorizontalLines',
            fontSize: 8.5,
          },
        ],
        margin: [0, 0, 0, 10],
      },

      sectionHeader('A1–A3 Ürün Aşaması Kırılımı'),
      {
        table: {
          widths: ['*', 70, 70],
          body: [
            [
              { text: 'Bileşen', style: 'tableHeader' },
              { text: 'kg CO₂e', style: 'tableHeader', alignment: 'right' },
              { text: 'Pay (%)', style: 'tableHeader', alignment: 'right' },
            ],
            ['Alüminyum profil',    { text: r.EC_al.toFixed(1),       alignment:'right' }, { text: `${((r.EC_al/r.EC_A1A3)*100).toFixed(1)}%`,       alignment:'right' }],
            ['Yüzey işlemi',        { text: r.EC_surface.toFixed(1),  alignment:'right' }, { text: `${((r.EC_surface/r.EC_A1A3)*100).toFixed(1)}%`,  alignment:'right' }],
            ['Cam sistemi',          { text: r.EC_glass.toFixed(1),   alignment:'right' }, { text: `${((r.EC_glass/r.EC_A1A3)*100).toFixed(1)}%`,   alignment:'right' }],
            ['EPDM conta',           { text: r.EC_seal.toFixed(1),    alignment:'right' }, { text: `${((r.EC_seal/r.EC_A1A3)*100).toFixed(1)}%`,    alignment:'right' }],
            ['PA66 termal kesici',   { text: r.EC_pa.toFixed(1),      alignment:'right' }, { text: `${((r.EC_pa/r.EC_A1A3)*100).toFixed(1)}%`,      alignment:'right' }],
            ['Donanım / aksesuarlar',{ text: r.EC_hardware.toFixed(1),alignment:'right' }, { text: `${((r.EC_hardware/r.EC_A1A3)*100).toFixed(1)}%`,alignment:'right' }],
            [
              { text: 'A1–A3 Toplam', bold:true, color: DARK },
              { text: r.EC_A1A3.toFixed(1), bold:true, alignment:'right', color: BLUE },
              { text: '100.0%', bold:true, alignment:'right' },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
        fontSize: 8.5,
        margin: [0, 0, 0, 10],
      },

      sectionHeader('Nakliye (A4), Montaj (A5) ve Yıkım (C4)'),
      {
        table: {
          widths: [120, '*', 70],
          body: [
            [
              { text: 'Aşama', style: 'tableHeader' },
              { text: 'Açıklama', style: 'tableHeader' },
              { text: 'kg CO₂e', style: 'tableHeader', alignment: 'right' },
            ],
            ['A4 Nakliye', transport?.name || '-',                         { text: r.EC_A4.toFixed(1), alignment: 'right' }],
            ['A5 Montaj',  product?.type === 'facade' ? 'Cephe montajı' : 'Pencere/kapı montajı', { text: r.EC_A5.toFixed(1), alignment: 'right' }],
            ['C4 Yıkım / Bertaraf', 'Ömür sonu bertaraf işlemi',          { text: r.EoL_C4.toFixed(1), alignment: 'right' }],
          ],
        },
        layout: 'lightHorizontalLines',
        fontSize: 8.5,
        margin: [0, 0, 0, 10],
      },

      sectionHeader('B6 İşletme Karbonu (Cam Üzerinden Isı Kaybı)'),
      {
        table: {
          widths: [130, '*'],
          body: [
            [{ text: 'Parametre', style: 'tableHeader' }, { text: 'Değer', style: 'tableHeader', alignment: 'right' }],
            ['Cam Ug değeri',          { text: `${glass?.Ug} W/m²K`, alignment: 'right' }],
            ['Isıtma Derece Günü (HDD)',{ text: `${r.HDD} HDD`, alignment: 'right' }],
            ['Yıllık Isı Kaybı (cam)', { text: `${r.annualKWh.toFixed(1)} kWh/yıl`, alignment: 'right' }],
            ['Enerji Emisyon Faktörü', { text: `${energySource?.factor} kg CO₂e/kWh (${energySource?.name})`, alignment: 'right' }],
            ['Yıllık Operasyonel CO₂', { text: `${r.annualCO2.toFixed(2)} kg CO₂e/yıl`, alignment: 'right' }],
            ['Yaşam Döngüsü Süresi',   { text: `${r.lifecycleYears} yıl`, alignment: 'right' }],
            [
              { text: 'B6 Toplam İşletme Karbonu', bold: true, color: DARK },
              { text: `${r.OC_total.toFixed(1)} kg CO₂e`, bold: true, alignment: 'right', color: RED },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
        fontSize: 8.5,
        margin: [0, 0, 0, 10],
      },

      sectionHeader('AB Karşılaştırma & Değerlendirme'),
      {
        table: {
          widths: ['*', 80, 70],
          body: [
            [
              { text: 'Referans Sınır Değer', style: 'tableHeader' },
              { text: 'kg CO₂e/m²', style: 'tableHeader', alignment: 'right' },
              { text: 'Durum', style: 'tableHeader', alignment: 'center' },
            ],
            ['EU Green Deal 2050 hedefi',          { text: '25', alignment:'right' }, { text: r.perM2_AtoC < 25  ? 'Altında ✓' : 'Üzerinde', alignment:'center', color: r.perM2_AtoC < 25 ? GREEN : RED }],
            ['En iyi uygulamalar (A+ sınıfı)',     { text: '30', alignment:'right' }, { text: r.perM2_AtoC < 30  ? 'Altında ✓' : 'Üzerinde', alignment:'center', color: r.perM2_AtoC < 30 ? GREEN : RED }],
            ['AB sektör ortalaması (2023)',         { text: '75', alignment:'right' }, { text: r.perM2_AtoC < 75  ? 'Altında ✓' : 'Üzerinde', alignment:'center', color: r.perM2_AtoC < 75 ? GREEN : RED }],
            ['Yüksek etki sınırı',                 { text: '120',alignment:'right' }, { text: r.perM2_AtoC < 120 ? 'Altında ✓' : 'Üzerinde', alignment:'center', color: r.perM2_AtoC < 120? GREEN : RED }],
            [
              { text: 'Hesaplanan değer (A–C)', bold: true, color: DARK },
              { text: r.perM2_AtoC.toFixed(1), bold: true, alignment: 'right', color: clsHex },
              { text: `Sınıf ${r.cls}`, bold: true, alignment: 'center', color: clsHex },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
        fontSize: 8.5,
        margin: [0, 0, 0, 10],
      },

      sectionHeader('Malzeme Kütleleri'),
      {
        table: {
          widths: ['*', 70, 90, 70],
          body: [
            [
              { text: 'Malzeme', style: 'tableHeader' },
              { text: 'Miktar', style: 'tableHeader', alignment: 'right' },
              { text: 'GWP Faktörü', style: 'tableHeader', alignment: 'right' },
              { text: 'kg CO₂e', style: 'tableHeader', alignment: 'right' },
            ],
            ['Alüminyum profil', { text: `${r.alKg.toFixed(2)} kg`, alignment:'right' }, { text: `${r.gwpAl} kg/kg`, alignment:'right' }, { text: r.EC_al.toFixed(1), alignment:'right' }],
            ['Cam sistemi',       { text: `${r.glassArea.toFixed(3)} m²`,alignment:'right'}, { text: `${glass?.gwpM2} kg/m²`,alignment:'right' }, { text: r.EC_glass.toFixed(1),   alignment:'right' }],
            ['EPDM conta',        { text: `${r.sealKg.toFixed(3)} kg`,   alignment:'right'}, { text: '2.5 kg/kg',    alignment:'right' }, { text: r.EC_seal.toFixed(1),   alignment:'right' }],
            ...(r.paKg > 0 ? [
              ['PA66 termal kesici', { text: `${r.paKg.toFixed(3)} kg`, alignment:'right' }, { text: '4.5 kg/kg', alignment:'right' }, { text: r.EC_pa.toFixed(1), alignment:'right' }],
            ] : []),
          ],
        },
        layout: 'lightHorizontalLines',
        fontSize: 8.5,
        margin: [0, 0, 0, 10],
      },

      {
        text: [
          { text: '* Rapor EN 15978 yaşam döngüsü analizi metodolojisine göre hazırlanmıştır. ', italics: true, color: GRAY },
          { text: 'Kullanılan emisyon faktörleri: EAA EPD 2023, IPCC AR6, TEIAŞ 2023.', italics: true, color: GRAY },
        ],
        fontSize: 7.5,
        margin: [0, 0, 0, 3],
      },
      {
        text: '* D modülü (geri dönüşüm kredisi) bilgi amaçlıdır, A–C toplamına dahil değildir.',
        style: 'noteText',
      },
    ],
  }

  return docDef
}

export async function exportCarbonPDF(params) {
  const pdfMake = await getPdfMake()
  const docDef  = buildCarbonDocDef(params)
  pdfMake.createPdf(docDef).download(`OZZO_Karbon_Raporu_${Date.now()}.pdf`)
}

export async function previewCarbonPDF(params, callback) {
  const pdfMake = await getPdfMake()
  const docDef  = buildCarbonDocDef(params)
  pdfMake.createPdf(docDef).getDataUrl(callback)
}

/* ══════════════════════════════════════════════
   ÖNERİ — ALÜMİNYUM DURUM ANALİZİ RAPORU
══════════════════════════════════════════════ */
function buildOneriDocDef(r) {
  const GREEN  = '#16a34a'
  const AMBER  = '#d97706'
  const RED    = '#dc2626'

  const gradeHex = r.gradeColor || GOLD

  const priorityColor = { Acil: RED, Yüksek: '#ea580c', Orta: AMBER, Düşük: GREEN, Bilgi: '#2563eb' }

  const contentArr = [
    ...headerContent('Alüminyum Durum Analizi Raporu', `OZZO Alüminyum · ${r.date}`),

    sectionHeader('Sistem Bilgileri'),
    {
      table: {
        widths: [90, 120, 90, 120],
        body: [
          [{ text:'Sistem Türü',      style:'tableLabelCell' }, { text: r.system.name,             style:'tableCell' },
           { text:'Yüzey Kaplama',    style:'tableLabelCell' }, { text: r.surface.name,            style:'tableCell' }],
          [{ text:'Konum / Çevre',    style:'tableLabelCell' }, { text: r.location.name,           style:'tableCell' },
           { text:'Bakım Geçmişi',    style:'tableLabelCell' }, { text: r.maintenance.name,        style:'tableCell' }],
          [{ text:'Kurulum Yaşı',     style:'tableLabelCell' }, { text: `${r.age} yıl`,           style:'tableCell' },
           { text:'Hesaplanan Ömür',  style:'tableLabelCell' }, { text: `~${r.adjustedLife} yıl`, style:'tableCell' }],
          [{ text:'Kalan Tahmini',    style:'tableLabelCell' }, { text: r.remaining > 0 ? `~${r.remaining} yıl` : 'Ömür dolmuş', style:'tableCell', color: r.remaining > 5 ? GREEN : RED },
           { text:'Kullanım Oranı',   style:'tableLabelCell' }, { text: `%${r.usedPct.toFixed(0)}`, style:'tableCell' }],
        ],
      },
      layout: 'lightHorizontalLines',
      fontSize: 8.5,
      margin: [0, 0, 0, 10],
    },

    sectionHeader('Genel Durum Değerlendirmesi'),
    {
      columns: [
        {
          width: 90,
          stack: [
            { text: r.grade,      fontSize: 38, bold: true, color: gradeHex, alignment: 'center', margin: [0, 2, 0, 2] },
            { text: r.gradeLabel, fontSize: 8,  color: GRAY, alignment: 'center' },
            { text: `${r.conditionScore.toFixed(0)}/100`, fontSize: 9, bold: true, color: gradeHex, alignment: 'center', margin: [0, 3, 0, 0] },
          ],
          margin: [0, 0, 8, 0],
        },
        {
          width: '*',
          table: {
            widths: ['*', 80],
            body: [
              [{ text:'Metrik', style:'tableHeader' }, { text:'Değer', style:'tableHeader', alignment:'right' }],
              ['Durum Puanı',    { text: `${r.conditionScore.toFixed(0)} / 100`, alignment:'right', color: gradeHex, bold: true }],
              ['Sistem Yaşı',   { text: `${r.age} yıl`, alignment:'right' }],
              ['Kalan Ömür',    { text: r.remaining > 0 ? `~${r.remaining} yıl` : 'Dolmuş', alignment:'right', color: r.remaining > 5 ? GREEN : RED }],
              ['Onarım Tahmini',{ text: r.costRange, alignment:'right', color: AMBER }],
            ],
          },
          layout: 'lightHorizontalLines',
          fontSize: 8.5,
        },
      ],
      margin: [0, 0, 0, 10],
    },

    ...(r.defects.filter(d => d.id !== 'none').length > 0 ? [
      sectionHeader('Tespit Edilen Sorunlar'),
      {
        table: {
          widths: ['*', 70],
          body: [
            [{ text:'Sorun', style:'tableHeader' }, { text:'Önem Seviyesi', style:'tableHeader', alignment:'right' }],
            ...r.defects.filter(d => d.id !== 'none').map(d => {
              const sevLabels = ['','Düşük','Orta','Yüksek','Kritik','Acil']
              const sevColors = ['#888','#84cc16','#eab308','#f97316','#ef4444','#9333ea']
              return [
                { text: d.label },
                { text: sevLabels[d.severity] || '-', alignment: 'right', color: sevColors[d.severity] || '#888' },
              ]
            }),
          ],
        },
        layout: 'lightHorizontalLines',
        fontSize: 8.5,
        margin: [0, 0, 0, 10],
      },
    ] : []),

    sectionHeader('Bakım & Tadilat Önerileri'),
    {
      table: {
        widths: [55, '*'],
        body: [
          [{ text:'Öncelik', style:'tableHeader' }, { text:'Öneri', style:'tableHeader' }],
          ...r.recs.map(rec => [
            { text: rec.priority, bold: true, color: priorityColor[rec.priority] || GRAY, fontSize: 8 },
            { text: rec.text, fontSize: 8.5 },
          ]),
        ],
      },
      layout: 'lightHorizontalLines',
      fontSize: 8.5,
      margin: [0, 0, 0, 10],
    },

    ...(r.notes ? [
      sectionHeader('Saha Gözlemleri ve Notlar'),
      { text: r.notes, fontSize: 9, color: DARK, lineHeight: 1.5, margin: [0, 0, 0, 10] },
    ] : []),

    ...(r.imageData ? [
      sectionHeader('Yüklenen Yapı Görseli'),
      { image: r.imageData, width: 400, alignment: 'center', margin: [0, 0, 0, 10] },
    ] : []),

    { text: '* Bu rapor OZZO Alüminyum Durum Analizi aracı ile oluşturulmuştur. Kesin teknik değerlendirme için uzman incelemesi yapılmalıdır.', style: 'noteText' },
    { text: '* Kalan ömür ve maliyet tahminleri sistemin tipi, yüzey kaplaması, konum ve bakım geçmişine göre hesaplanmıştır.', style: 'noteText', margin: [0, 3, 0, 0] },

    ...(r.aiResult?.insulation_report ? [
      sectionHeader('Isı · Ses · Su Yalıtım Raporu (AI Analizi)'),
      {
        table: {
          widths: [70, 55, '*', 120],
          body: [
            [
              { text: 'Yalıtım', style: 'tableHeader' },
              { text: 'Durum', style: 'tableHeader' },
              { text: 'Gözlem', style: 'tableHeader' },
              { text: 'Gerekli Malzemeler', style: 'tableHeader' },
            ],
            ...(['thermal','acoustic','waterproofing'].map(k => {
              const ins = r.aiResult.insulation_report[k]
              if (!ins) return null
              const lbl = k === 'thermal' ? 'Isı Yalıtımı' : k === 'acoustic' ? 'Ses Yalıtımı' : 'Su Yalıtımı'
              const stColor = { Yeterli: '#16a34a', Yetersiz: '#ea580c', Eksik: '#dc2626', Belirsiz: GRAY }
              return [
                { text: lbl },
                { text: ins.status || '—', color: stColor[ins.status] || GRAY },
                { text: ins.observations || '—', fontSize: 8 },
                { text: (ins.required_materials || []).join(', ') || '—', fontSize: 8 },
              ]
            }).filter(Boolean)),
          ],
        },
        layout: 'lightHorizontalLines',
        fontSize: 8.5,
        margin: [0, 0, 0, 8],
      },
      {
        table: {
          widths: [70, '*'],
          body: [
            [{ text: 'Yalıtım', style: 'tableHeader' }, { text: 'Uygulama Yöntemi', style: 'tableHeader' }],
            ...(['thermal','acoustic','waterproofing'].map(k => {
              const ins = r.aiResult.insulation_report[k]
              if (!ins?.application_method) return null
              const lbl = k === 'thermal' ? 'Isı' : k === 'acoustic' ? 'Ses' : 'Su'
              return [{ text: lbl }, { text: ins.application_method, fontSize: 8 }]
            }).filter(Boolean)),
          ],
        },
        layout: 'lightHorizontalLines',
        fontSize: 8.5,
        margin: [0, 0, 0, 10],
      },
    ] : []),

    ...(r.aiResult?.missing_materials?.length ? [
      sectionHeader('Eksik / Gerekli Malzeme Listesi (AI Analizi)'),
      {
        table: {
          widths: ['*', '*', 70, 50],
          body: [
            [
              { text: 'Malzeme', style: 'tableHeader' },
              { text: 'Kullanım Amacı', style: 'tableHeader' },
              { text: 'Miktar', style: 'tableHeader' },
              { text: 'Öncelik', style: 'tableHeader', alignment: 'right' },
            ],
            ...r.aiResult.missing_materials.map(mat => {
              const pc = { Acil: '#dc2626', Yüksek: '#ea580c', Orta: '#d97706' }
              return [
                { text: mat.name, bold: true },
                { text: mat.purpose },
                { text: mat.quantity_hint || '—' },
                { text: mat.priority || '—', alignment: 'right', color: pc[mat.priority] || GRAY, bold: true },
              ]
            }),
          ],
        },
        layout: 'lightHorizontalLines',
        fontSize: 8.5,
        margin: [0, 0, 0, 10],
      },
    ] : []),
  ]
  return {
    pageMargins: [14, 20, 14, 30],
    footer: footerContent,
    styles: baseStyles,
    defaultStyle: { font: 'Roboto', fontSize: 9 },
    content: contentArr,
  }
}

export async function exportOneriPDF(report) {
  const pdfMake = await getPdfMake()
  pdfMake.createPdf(buildOneriDocDef(report)).download(`OZZO_Durum_Analizi_${Date.now()}.pdf`)
}

export async function previewOneriPDF(report, callback) {
  const pdfMake = await getPdfMake()
  pdfMake.createPdf(buildOneriDocDef(report)).getDataUrl(callback)
}
