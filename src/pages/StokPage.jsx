import { useState, useMemo, useEffect, useRef, useCallback } from 'react'

/* ─── Proje Formu ─────────────────────────────────────── */
function ProjectForm({ editItem, projects, persistProjects, onClose }) {
  const [pf, setPf] = useState(editItem || { name: '', client: '', address: '', startDate: '', status: 'kesif' })
  return (
    <div className="bg-[#0d1630] rounded-2xl p-5 border border-white/10 mb-4">
      <h3 className="font-bold text-sm mb-4">{editItem ? 'Proje Düzenle' : 'Yeni Proje'}</h3>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {[
          { k: 'name',      l: 'Proje Adı *',        ph: 'Ozan Villa Projesi' },
          { k: 'client',    l: 'Müşteri',             ph: 'Müşteri Adı' },
          { k: 'address',   l: 'Adres',               ph: 'İstanbul, Beykoz' },
          { k: 'startDate', l: 'Başlangıç Tarihi',    ph: '', type: 'date' },
        ].map(f => (
          <div key={f.k}>
            <label className="text-xs text-gray-400 block mb-1">{f.l}</label>
            <input type={f.type || 'text'} value={pf[f.k]} onChange={e => setPf(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.ph}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-gold-500/40" />
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={() => {
          if (!pf.name) return
          if (editItem) persistProjects(projects.map(p => p.id === editItem.id ? { ...p, ...pf } : p))
          else persistProjects([...projects, { ...pf, id: Date.now() }])
          onClose()
        }} className="flex-1 bg-gold-500 hover:bg-gold-400 text-black font-bold py-2.5 rounded-xl text-sm">{editItem ? 'Güncelle' : 'Ekle'}</button>
        <button onClick={onClose} className="px-5 bg-white/5 rounded-xl text-gray-400 text-sm">İptal</button>
      </div>
    </div>
  )
}

/* ─── Tedarikçi Formu ─────────────────────────────────── */
function SupplierForm({ editItem, suppliers, persistSuppliers, onClose }) {
  const [sf, setSf] = useState(editItem || { erpCode: '', name: '', contact: '', phone: '', email: '', leadTime: 7 })
  return (
    <div className="bg-[#0d1630] rounded-2xl p-5 border border-white/10 mb-4">
      <h3 className="font-bold text-sm mb-4">{editItem ? 'Tedarikçi Düzenle' : 'Yeni Tedarikçi'}</h3>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {[
          { k: 'erpCode',  l: 'ERP Kodu',             ph: 'SUP-004' },
          { k: 'name',     l: 'Firma Adı *',           ph: 'Firma A.Ş.' },
          { k: 'contact',  l: 'İletişim Kişisi',       ph: 'Ad Soyad' },
          { k: 'phone',    l: 'Telefon',               ph: '0212 000 00 00' },
          { k: 'email',    l: 'E-posta',               ph: 'siparis@firma.com' },
          { k: 'leadTime', l: 'Teslim Süresi (gün)',   ph: '7', type: 'number' },
        ].map(f => (
          <div key={f.k}>
            <label className="text-xs text-gray-400 block mb-1">{f.l}</label>
            <input type={f.type || 'text'} value={sf[f.k]}
              onChange={e => setSf(p => ({ ...p, [f.k]: f.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value }))}
              placeholder={f.ph}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-gold-500/40" />
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={() => {
          if (!sf.name) return
          if (editItem) persistSuppliers(suppliers.map(s => s.id === editItem.id ? { ...s, ...sf } : s))
          else persistSuppliers([...suppliers, { ...sf, id: Date.now() }])
          onClose()
        }} className="flex-1 bg-gold-500 hover:bg-gold-400 text-black font-bold py-2.5 rounded-xl text-sm">{editItem ? 'Güncelle' : 'Ekle'}</button>
        <button onClick={onClose} className="px-5 bg-white/5 rounded-xl text-gray-400 text-sm">İptal</button>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   OZZO STOK YÖNETİM SİSTEMİ — ERP Grade
   Özellikler:
   · Barkod okuma (kamera)
   · Tedarikçi yönetimi
   · Proje bazlı stok takibi
   · ERP entegrasyon (JSON/CSV import-export)
   · Excel çıktısı (çoklu sayfa)
   · OZZO AI Terminal (doğal dil komutları)
   · Webhook / API bağlantısı
   · Gerçek zamanlı uyarı sistemi
════════════════════════════════════════════════════════ */

// ─── Sabit Veriler ──────────────────────────────────────
const CATEGORIES = ['Profil', 'Cam', 'Conta & Sızdırmazlık', 'Aksesuar & Donanım', 'Boya & Kaplama', 'Vida & Bağlantı', 'Isı Yalıtım', 'Paketleme', 'Diğer']
const UNITS = ['m', 'm²', 'adet', 'kg', 'lt', 'rulo', 'kutu', 'paket', 'takım']

// ─── LocalStorage helpers ──────────────────────────────
const LS = {
  get: (k, def = []) => { try { return JSON.parse(localStorage.getItem(k) ?? 'null') ?? def } catch { return def } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
}
const KEYS = { products: 'ozzo_stok_products', suppliers: 'ozzo_stok_suppliers', projects: 'ozzo_stok_projects', movements: 'ozzo_stok_movements', webhook: 'ozzo_stok_webhook' }

// ─── Seed data (ilk açılışta örnek veri) ────────────────
const SEED_PRODUCTS = [
  { id: 1, sku: 'PRF-TB34', barcode: '8690001000011', name: 'PA66 Termal Kesici 34mm', category: 'Profil', unit: 'm', qty: 850, minQty: 200, price: 95, supplierId: 1, notes: 'Saray Katalog referans: TB-34' },
  { id: 2, sku: 'PRF-AL70', barcode: '8690001000028', name: 'Alüminyum Profil 70mm Dış Çerçeve', category: 'Profil', unit: 'm', qty: 1200, minQty: 300, price: 68, supplierId: 1, notes: '' },
  { id: 3, sku: 'CAM-DG16', barcode: '8690001000035', name: '4+16Ar+4 Low-e Argon Cam', category: 'Cam', unit: 'm²', qty: 340, minQty: 80, price: 420, supplierId: 2, notes: 'Ug=1.1 W/m²K' },
  { id: 4, sku: 'CNT-EPDM', barcode: '8690001000042', name: 'EPDM Pencere Contası 9mm', category: 'Conta & Sızdırmazlık', unit: 'm', qty: 45, minQty: 100, price: 8, supplierId: 3, notes: 'KRİTİK STOK' },
  { id: 5, sku: 'AKS-MNT', barcode: '8690001000059', name: 'Gizli Menteşe Seti', category: 'Aksesuar & Donanım', unit: 'takım', qty: 120, minQty: 30, price: 185, supplierId: 3, notes: '' },
]
const SEED_SUPPLIERS = [
  { id: 1, name: 'Saray Alüminyum A.Ş.', contact: 'Mehmet Yılmaz', phone: '0212 555 01 01', email: 'siparis@saray.com.tr', leadTime: 7, erpCode: 'SUP-001' },
  { id: 2, name: 'Cam Dünyası Ltd.', contact: 'Ayşe Kaya', phone: '0216 444 02 02', email: 'info@camdünyası.com', leadTime: 5, erpCode: 'SUP-002' },
  { id: 3, name: 'Genel Aksesuar', contact: 'Ali Demir', phone: '0312 333 03 03', email: 'satis@genelaks.com', leadTime: 3, erpCode: 'SUP-003' },
]
const SEED_PROJECTS = [
  { id: 1, name: 'Ozan Villa Projesi', client: 'Ozan Aslan', address: 'İstanbul, Beykoz', startDate: '2025-01-15', status: 'uretim' },
  { id: 2, name: 'Merkez AVM Cephesi', client: 'AVM Yatırım A.Ş.', address: 'İstanbul, Bağcılar', startDate: '2025-02-01', status: 'montaj' },
  { id: 3, name: 'Rezidans Konut 48 Daire', client: 'Yapı Holding', address: 'Bursa', startDate: '2025-03-10', status: 'teklif' },
]

function initData() {
  if (!localStorage.getItem(KEYS.products)) LS.set(KEYS.products, SEED_PRODUCTS)
  if (!localStorage.getItem(KEYS.suppliers)) LS.set(KEYS.suppliers, SEED_SUPPLIERS)
  if (!localStorage.getItem(KEYS.projects)) LS.set(KEYS.projects, SEED_PROJECTS)
  if (!localStorage.getItem(KEYS.movements)) LS.set(KEYS.movements, [])
}

// ─── Excel Export (XLSX formatı, SheetJS olmadan saf JS) ─
function buildXLSX(sheets) {
  // Her sheet için HTML tablo oluştur → Excel uyumlu XML
  const xmlSheets = sheets.map(({ name, headers, rows }) => {
    const headerRow = headers.map(h => `<Cell><Data ss:Type="String">${h}</Data></Cell>`).join('')
    const dataRows = rows.map(row =>
      `<Row>${row.map(cell => {
        const isNum = typeof cell === 'number'
        return `<Cell><Data ss:Type="${isNum ? 'Number' : 'String'}">${cell ?? ''}</Data></Cell>`
      }).join('')}</Row>`
    ).join('\n')
    return `<Worksheet ss:Name="${name}"><Table><Row>${headerRow}</Row>${dataRows}</Table></Worksheet>`
  }).join('\n')

  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="header"><Font ss:Bold="1"/><Interior ss:Color="#C9A84C" ss:Pattern="Solid"/></Style>
  </Styles>
  ${xmlSheets}
</Workbook>`
  const blob = new Blob([xml], { type: 'application/vnd.ms-excel' })
  return blob
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// ─── Barcode Kamera Bileşeni ────────────────────────────
function BarcodeScanner({ onDetect, onClose }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const timerRef = useRef(null)
  const [status, setStatus] = useState('Kamera başlatılıyor...')
  const [manualCode, setManualCode] = useState('')

  useEffect(() => {
    let active = true
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } })
      .then(stream => {
        if (!active) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
        setStatus('Barkodu kameraya tutun')
        // jsQR CDN'den yükle
        if (!window.jsQR) {
          const s = document.createElement('script')
          s.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js'
          s.onload = () => startScan()
          document.head.appendChild(s)
        } else startScan()
      })
      .catch(() => setStatus('Kamera açılamadı — manuel giriş kullanın'))

    function startScan() {
      timerRef.current = setInterval(() => {
        if (!videoRef.current || !canvasRef.current || !videoRef.current.videoWidth) return
        const cv = canvasRef.current; const vid = videoRef.current
        cv.width = vid.videoWidth; cv.height = vid.videoHeight
        const ctx = cv.getContext('2d'); ctx.drawImage(vid, 0, 0)
        const img = ctx.getImageData(0, 0, cv.width, cv.height)
        const code = window.jsQR?.(img.data, img.width, img.height)
        if (code?.data) { setStatus('Barkod algılandı: ' + code.data); onDetect(code.data) }
      }, 400)
    }

    return () => {
      active = false
      clearInterval(timerRef.current)
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [onDetect])

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-bold">Barkod / QR Tara</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">×</button>
        </div>
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video mb-3">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />
          {/* Tarama çerçevesi */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 border-2 border-gold-400 rounded-lg opacity-60" />
          </div>
          <div className="absolute bottom-3 left-0 right-0 text-center">
            <span className="bg-black/70 text-gold-400 text-xs px-3 py-1 rounded-full">{status}</span>
          </div>
        </div>
        <div className="text-center text-gray-400 text-xs mb-2">— veya manuel gir —</div>
        <div className="flex gap-2">
          <input value={manualCode} onChange={e => setManualCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && manualCode && onDetect(manualCode)}
            placeholder="Barkod numarası..." className="flex-1 bg-[#1a2444] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none" />
          <button onClick={() => manualCode && onDetect(manualCode)}
            className="bg-gold-500 text-black font-bold px-4 rounded-xl text-sm">Tamam</button>
        </div>
      </div>
    </div>
  )
}

// ─── OZZO AI Terminal ────────────────────────────────────
function AiTerminal({ products, suppliers, projects, movements, onClose }) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([
    { role: 'ozzo', text: 'Merhaba! OZZO Stok Terminali hazır. Örnek komutlar:\n• "Tüm stoğu Excel\'e çıkar"\n• "Bana hem tüm stoğu hem de Ozan Villa projesindeki stokları ayrı ayrı Excel\'e çıkar"\n• "Conta stoğu nerede?"\n• "Kritik stok listesini göster"\n• "Bu haftaki hareketleri listele"' }
  ])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [history])

  const executeExcel = useCallback((instruction, data) => {
    // Çoklu sayfa Excel oluştur
    const sheets = []

    if (instruction.includes('tum') || instruction.includes('tüm') || instruction.includes('genel') || instruction.includes('all')) {
      sheets.push({
        name: 'Tüm Stok',
        headers: ['SKU', 'Barkod', 'Ürün Adı', 'Kategori', 'Birim', 'Miktar', 'Min Stok', 'Birim Fiyat', 'Toplam Değer', 'Durum'],
        rows: products.map(p => [
          p.sku, p.barcode, p.name, p.category, p.unit, p.qty, p.minQty, p.price,
          p.qty * p.price, p.qty <= p.minQty ? 'KRİTİK' : 'Normal'
        ])
      })
    }

    // Proje bazlı sayfalar
    const mentionedProjects = projects.filter(pr =>
      instruction.toLowerCase().includes(pr.name.toLowerCase().split(' ')[0].toLowerCase()) ||
      instruction.toLowerCase().includes(pr.client.toLowerCase().split(' ')[0].toLowerCase())
    )
    if (mentionedProjects.length === 0 && (instruction.includes('proje') || instruction.includes('project'))) {
      projects.forEach(pr => mentionedProjects.push(pr))
    }

    mentionedProjects.forEach(pr => {
      const projMovements = movements.filter(m => m.projectId === pr.id)
      const projProductIds = [...new Set(projMovements.map(m => m.productId))]
      const projProducts = products.filter(p => projProductIds.includes(p.id))
      sheets.push({
        name: pr.name.slice(0, 31),
        headers: ['Ürün Adı', 'SKU', 'Kategori', 'Birim', 'Kullanılan Miktar', 'Birim Fiyat', 'Toplam Maliyet'],
        rows: projProducts.map(p => {
          const used = projMovements.filter(m => m.productId === p.id && m.type === 'cikis').reduce((s, m) => s + m.qty, 0)
          return [p.name, p.sku, p.category, p.unit, used, p.price, used * p.price]
        })
      })
    })

    if (instruction.includes('hareket') || instruction.includes('movement')) {
      sheets.push({
        name: 'Hareketler',
        headers: ['Tarih', 'Ürün', 'İşlem', 'Miktar', 'Proje', 'Not', 'Fatura No'],
        rows: movements.slice(-200).map(m => {
          const pr = products.find(p => p.id === m.productId)
          const proj = projects.find(p => p.id === m.projectId)
          return [m.date, pr?.name || '-', m.type === 'giris' ? 'GİRİŞ' : 'ÇIKIŞ', m.qty, proj?.name || '-', m.note || '', m.invoiceNo || '']
        })
      })
    }

    if (instruction.includes('tedarik') || instruction.includes('supplier')) {
      sheets.push({
        name: 'Tedarikçiler',
        headers: ['Kod', 'Firma', 'İletişim', 'Telefon', 'E-posta', 'Teslim Süresi'],
        rows: suppliers.map(s => [s.erpCode, s.name, s.contact, s.phone, s.email, s.leadTime + ' gün'])
      })
    }

    if (sheets.length === 0) {
      // Varsayılan: tüm stok
      sheets.push({
        name: 'Stok',
        headers: ['SKU', 'Ürün Adı', 'Kategori', 'Miktar', 'Birim', 'Değer'],
        rows: products.map(p => [p.sku, p.name, p.category, p.qty, p.unit, p.qty * p.price])
      })
    }

    const blob = buildXLSX(sheets)
    const fname = `OZZO-Stok-${new Date().toLocaleDateString('tr-TR').replace(/\./g, '-')}.xls`
    downloadBlob(blob, fname)
    return `✅ Excel hazır! ${sheets.length} sayfa oluşturuldu: ${sheets.map(s => '"' + s.name + '"').join(', ')}`
  }, [products, suppliers, projects, movements])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setHistory(h => [...h, { role: 'user', text: userMsg }])
    setLoading(true)

    // Yerel komut kontrolü
    const lower = userMsg.toLowerCase()
    const isExcelCmd = lower.includes('excel') || lower.includes('çıkar') || lower.includes('indir') || lower.includes('export')
    const isLocalQuery = lower.includes('kritik') || lower.includes('stok') || lower.includes('kaç') || lower.includes('toplam')

    if (isExcelCmd) {
      const result = executeExcel(lower, { products, suppliers, projects, movements })
      setHistory(h => [...h, { role: 'ozzo', text: result }])
      setLoading(false)
      return
    }

    if (isLocalQuery && !lower.includes('neden') && !lower.includes('nasıl') && !lower.includes('ne zaman')) {
      // Yerel hesaplama
      let answer = ''
      const criticals = products.filter(p => p.qty <= p.minQty && p.minQty > 0)
      const totalValue = products.reduce((s, p) => s + p.qty * p.price, 0)

      if (lower.includes('kritik')) {
        answer = criticals.length === 0
          ? '✅ Kritik stok yok, tüm ürünler yeterli seviyede.'
          : `⚠️ ${criticals.length} kritik ürün:\n${criticals.map(p => `• ${p.name}: ${p.qty} ${p.unit} (min: ${p.minQty})`).join('\n')}`
      } else if (lower.includes('toplam değer') || lower.includes('stok değer')) {
        answer = `📊 Toplam stok değeri: ₺${totalValue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}\n${products.length} kalem ürün`
      } else if (lower.includes('kaç ürün') || lower.includes('kaç kalem')) {
        answer = `📦 Sistemde ${products.length} ürün kaydı var.`
      } else {
        answer = `Stok özeti:\n• ${products.length} ürün\n• ${criticals.length} kritik\n• Toplam değer: ₺${totalValue.toLocaleString('tr-TR', { minimumFractionDigits: 0 })}`
      }
      setHistory(h => [...h, { role: 'ozzo', text: answer }])
      setLoading(false)
      return
    }

    // Claude API'ye gönder
    try {
      const context = `Sen OZZO Alüminyum'un stok yönetim sisteminin akıllı asistanısın.
Mevcut stok verisi (özet):
- ${products.length} ürün, toplam değer ₺${products.reduce((s,p)=>s+p.qty*p.price,0).toLocaleString('tr-TR')}
- Kritik stok: ${products.filter(p=>p.qty<=p.minQty&&p.minQty>0).length} ürün
- Projeler: ${projects.map(p=>p.name).join(', ')}
- Tedarikçiler: ${suppliers.map(s=>s.name).join(', ')}
Türkçe, kısa ve pratik cevap ver. Excel/export komutlarını "EXCEL_EXPORT: [açıklama]" formatında döndür.`

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_KEY || localStorage.getItem('ozzo_anthropic_key') || '',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-5',
          max_tokens: 400,
          system: context,
          messages: [{ role: 'user', content: userMsg }]
        })
      })
      const d = await res.json()
      const reply = d.content?.[0]?.text || 'Yanıt alınamadı.'

      if (reply.startsWith('EXCEL_EXPORT:')) {
        const result = executeExcel(reply.toLowerCase(), {})
        setHistory(h => [...h, { role: 'ozzo', text: result }])
      } else {
        setHistory(h => [...h, { role: 'ozzo', text: reply }])
      }
    } catch {
      setHistory(h => [...h, { role: 'ozzo', text: 'Bağlantı hatası. Yerel komutlar çalışmaya devam ediyor.' }])
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0a0f1e]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
          <span className="text-gold-400 font-bold text-sm tracking-wider">OZZO STOK TERMİNALİ</span>
          <span className="text-xs text-white/30 font-mono">v2.0</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-sm">ESC / Kapat</button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 font-mono text-sm">
        {history.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'ozzo' && (
              <div className="w-6 h-6 rounded bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 text-[10px] flex-shrink-0 mt-0.5">O</div>
            )}
            <div className={`max-w-2xl px-4 py-3 rounded-xl text-sm whitespace-pre-wrap leading-relaxed ${
              msg.role === 'user'
                ? 'bg-blue-600/20 border border-blue-500/30 text-blue-200'
                : 'bg-[#0d1630] border border-white/5 text-white/85'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 text-[10px] flex-shrink-0">O</div>
            <div className="bg-[#0d1630] border border-white/5 rounded-xl px-4 py-3 text-gold-400 text-xs animate-pulse">OZZO analiz ediyor...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-5 py-4 border-t border-white/10 bg-[#0a0f1e]">
        <div className="flex gap-3">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Komut gir: 'Ozan Villa projesinin stok raporunu Excel'e çıkar'..."
            className="flex-1 bg-[#1a2444] border border-white/10 rounded-xl px-5 py-3 text-sm text-white outline-none focus:border-gold-500/40 font-mono placeholder-white/20" />
          <button onClick={handleSend} disabled={loading}
            className="bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-black font-bold px-5 rounded-xl text-sm transition-all">
            ↵
          </button>
        </div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {['Kritik stokları listele', 'Tüm stoğu Excel\'e çıkar', 'Ozan Villa stok raporu Excel', 'Bu ayki hareketler'].map(cmd => (
            <button key={cmd} onClick={() => { setInput(cmd) }}
              className="text-xs text-white/30 hover:text-gold-400 border border-white/5 hover:border-gold-500/20 px-3 py-1 rounded-lg transition-all">
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── ERP Entegrasyon Paneli ─────────────────────────────
function ErpPanel({ products, suppliers, projects, movements, onImport, onClose }) {
  const [tab, setTab] = useState('export')
  const [webhookUrl, setWebhookUrl] = useState(LS.get(KEYS.webhook, ''))
  const [importText, setImportText] = useState('')
  const [importFormat, setImportFormat] = useState('json')
  const [importResult, setImportResult] = useState(null)
  const [webhookStatus, setWebhookStatus] = useState('')

  const exportJSON = () => {
    const data = { products, suppliers, projects, movements, exportedAt: new Date().toISOString(), version: '2.0', system: 'OZZO Stok Yönetim Sistemi' }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    downloadBlob(blob, `OZZO-ERP-Export-${Date.now()}.json`)
  }

  const exportCSV = (type) => {
    let csv = '', filename = ''
    if (type === 'products') {
      csv = 'SKU,Barkod,Ürün Adı,Kategori,Birim,Miktar,Min Stok,Birim Fiyat,Toplam Değer\n'
      csv += products.map(p => `"${p.sku}","${p.barcode}","${p.name}","${p.category}","${p.unit}",${p.qty},${p.minQty},${p.price},${p.qty * p.price}`).join('\n')
      filename = 'OZZO-Urunler.csv'
    } else if (type === 'movements') {
      csv = 'Tarih,Ürün SKU,Ürün Adı,İşlem,Miktar,Proje,Fatura No,Not\n'
      csv += movements.map(m => {
        const p = products.find(x => x.id === m.productId)
        const pr = projects.find(x => x.id === m.projectId)
        return `"${m.date}","${p?.sku||''}","${p?.name||''}","${m.type}",${m.qty},"${pr?.name||''}","${m.invoiceNo||''}","${m.note||''}"`
      }).join('\n')
      filename = 'OZZO-Hareketler.csv'
    } else if (type === 'suppliers') {
      csv = 'ERP Kodu,Firma,İletişim,Telefon,E-posta,Teslim Süresi\n'
      csv += suppliers.map(s => `"${s.erpCode}","${s.name}","${s.contact}","${s.phone}","${s.email}",${s.leadTime}`).join('\n')
      filename = 'OZZO-Tedarikciler.csv'
    }
    downloadBlob(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }), filename)
  }

  const handleImport = () => {
    try {
      if (importFormat === 'json') {
        const data = JSON.parse(importText)
        const result = { products: 0, suppliers: 0, projects: 0 }
        if (data.products?.length) result.products = data.products.length
        if (data.suppliers?.length) result.suppliers = data.suppliers.length
        if (data.projects?.length) result.projects = data.projects.length
        onImport(data)
        setImportResult({ success: true, msg: `İçe aktarıldı: ${result.products} ürün, ${result.suppliers} tedarikçi, ${result.projects} proje` })
      } else {
        // CSV import — ürün listesi varsay
        const lines = importText.trim().split('\n')
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase())
        const items = lines.slice(1).map(line => {
          const vals = line.split(',').map(v => v.replace(/"/g, '').trim())
          const obj = {}
          headers.forEach((h, i) => obj[h] = vals[i])
          return { id: Date.now() + Math.random(), sku: obj['sku'] || '', barcode: obj['barkod'] || obj['barcode'] || '', name: obj['ürün adı'] || obj['name'] || obj['ad'] || '', category: obj['kategori'] || 'Diğer', unit: obj['birim'] || 'adet', qty: parseFloat(obj['miktar'] || obj['qty'] || 0), minQty: parseFloat(obj['min stok'] || obj['minqty'] || 0), price: parseFloat(obj['birim fiyat'] || obj['price'] || 0), supplierId: null, notes: '' }
        }).filter(i => i.name)
        onImport({ products: items })
        setImportResult({ success: true, msg: `${items.length} ürün içe aktarıldı.` })
      }
    } catch (e) {
      setImportResult({ success: false, msg: 'Hata: ' + e.message })
    }
  }

  const testWebhook = async () => {
    if (!webhookUrl) return
    LS.set(KEYS.webhook, webhookUrl)
    setWebhookStatus('Gönderiliyor...')
    try {
      const payload = { event: 'test', system: 'OZZO Stok', timestamp: new Date().toISOString(), summary: { totalProducts: products.length, totalValue: products.reduce((s,p)=>s+p.qty*p.price,0), criticalCount: products.filter(p=>p.qty<=p.minQty&&p.minQty>0).length } }
      await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, mode: 'no-cors', body: JSON.stringify(payload) })
      setWebhookStatus('✓ Gönderildi (no-cors modunda)')
    } catch (e) {
      setWebhookStatus('✗ Hata: ' + e.message)
    }
  }

  const tabs = [{ id: 'export', label: '↑ Dışa Aktar' }, { id: 'import', label: '↓ İçe Aktar' }, { id: 'webhook', label: '⚡ Webhook/API' }]

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-[#0d1630] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="font-bold text-white">ERP Entegrasyon Merkezi</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
        </div>
        <div className="flex border-b border-white/10">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-3 text-sm font-semibold transition-all ${tab === t.id ? 'text-gold-400 border-b-2 border-gold-500' : 'text-gray-500 hover:text-white'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'export' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 mb-4">Stok verilerinizi farklı formatlarda dışa aktarın. ERP sistemlerine (SAP, Logo, Netsis, Mikro) entegrasyon için JSON formatını kullanın.</p>
              {[
                { label: 'Tüm Veri (JSON — ERP)', desc: 'SAP / Logo / Netsis uyumlu tam veri paketi', action: exportJSON, color: 'blue' },
                { label: 'Ürün Listesi (CSV)', desc: 'Excel, Google Sheets, tüm tablocalc uygulamaları', action: () => exportCSV('products'), color: 'green' },
                { label: 'Hareket Geçmişi (CSV)', desc: 'Muhasebe ve denetim için tüm giriş/çıkışlar', action: () => exportCSV('movements'), color: 'green' },
                { label: 'Tedarikçi Listesi (CSV)', desc: 'Tedarikçi kayıtları', action: () => exportCSV('suppliers'), color: 'green' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/5">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button onClick={item.action}
                    className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${item.color === 'blue' ? 'bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30' : 'bg-green-600/20 hover:bg-green-600/40 text-green-300 border border-green-500/30'}`}>
                    İndir
                  </button>
                </div>
              ))}
            </div>
          )}
          {tab === 'import' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400">JSON veya CSV formatında veri yükleyin. Mevcut verilerle birleştirilir.</p>
              <div className="flex gap-2">
                {['json', 'csv'].map(f => (
                  <button key={f} onClick={() => setImportFormat(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${importFormat === f ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' : 'bg-white/5 text-gray-400 border border-white/5'}`}>
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
              <textarea value={importText} onChange={e => setImportText(e.target.value)} rows={10}
                placeholder={importFormat === 'json' ? '{"products":[{"sku":"PRF-001","name":"Profil 70mm","category":"Profil","unit":"m","qty":500,"price":68}],"suppliers":[...]}' : 'SKU,Barkod,Ürün Adı,Kategori,Birim,Miktar,Min Stok,Birim Fiyat\nPRF-001,,Profil 70mm,Profil,m,500,100,68'}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-green-300 font-mono outline-none focus:border-gold-500/40 resize-none" />
              {importResult && (
                <div className={`text-sm px-4 py-3 rounded-lg ${importResult.success ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {importResult.msg}
                </div>
              )}
              <button onClick={handleImport} className="w-full bg-gold-500 hover:bg-gold-400 text-black font-bold py-3 rounded-xl text-sm transition-all">
                İçe Aktar
              </button>
            </div>
          )}
          {tab === 'webhook' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400">Stok değişikliklerini otomatik olarak dış sistemlere (ERP, Muhasebe, Bildirim) gönderin.</p>
              <div>
                <label className="text-xs text-gray-400 block mb-1.5">Webhook URL</label>
                <input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://your-erp.com/api/stock-webhook"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-gold-500/40 font-mono" />
              </div>
              <button onClick={testWebhook} className="w-full bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 font-bold py-3 rounded-xl text-sm transition-all">
                Test Gönder
              </button>
              {webhookStatus && <p className="text-sm text-green-400">{webhookStatus}</p>}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-xs font-bold text-white mb-2">Gönderilecek Payload Örneği:</p>
                <pre className="text-xs text-green-300 font-mono overflow-x-auto">{JSON.stringify({ event: 'stock_movement', productSku: 'PRF-TB34', type: 'cikis', qty: 50, projectId: 1, timestamp: new Date().toISOString() }, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════
// ANA BILEŞEN
// ════════════════════════════════════════════════════════
export default function StokPage() {
  useEffect(() => initData(), [])

  const [products, setProducts] = useState(() => LS.get(KEYS.products, []))
  const [suppliers, setSuppliers] = useState(() => LS.get(KEYS.suppliers, []))
  const [projects, setProjects] = useState(() => LS.get(KEYS.projects, []))
  const [movements, setMovements] = useState(() => LS.get(KEYS.movements, []))

  const [tab, setTab] = useState('dashboard') // dashboard | products | movements | projects | suppliers
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('Tümü')
  const [filterSupplier, setFilterSupplier] = useState('Tümü')
  const [sortBy, setSortBy] = useState('name')

  const [showBarcode, setShowBarcode] = useState(false)
  const [showAiTerminal, setShowAiTerminal] = useState(false)
  const [showErp, setShowErp] = useState(false)
  const [showMovementForm, setShowMovementForm] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showSupplierForm, setShowSupplierForm] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showTransferForm, setShowTransferForm] = useState(false)
  const [transferProduct, setTransferProduct] = useState(null)

  const [editItem, setEditItem] = useState(null)
  const [movForm, setMovForm] = useState({ type: 'cikis', productId: '', qty: 0, projectId: '', note: '', invoiceNo: '', date: new Date().toISOString().slice(0, 10) })

  // Persist helpers
  const persistProducts = p => { setProducts(p); LS.set(KEYS.products, p) }
  const persistSuppliers = s => { setSuppliers(s); LS.set(KEYS.suppliers, s) }
  const persistProjects = p => { setProjects(p); LS.set(KEYS.projects, p) }
  const persistMovements = m => { setMovements(m); LS.set(KEYS.movements, m) }

  // Hareket kaydet + stok güncelle
  const saveMovement = () => {
    if (!movForm.productId || !movForm.qty || movForm.qty <= 0) return
    const pid = parseInt(movForm.productId)
    const delta = movForm.type === 'giris' ? parseFloat(movForm.qty) : -parseFloat(movForm.qty)
    const mov = { id: Date.now(), ...movForm, productId: pid, qty: parseFloat(movForm.qty), projectId: movForm.projectId ? parseInt(movForm.projectId) : null }
    persistMovements([mov, ...movements])
    persistProducts(products.map(p => p.id === pid ? { ...p, qty: Math.max(0, p.qty + delta) } : p))
    setShowMovementForm(false)
    setMovForm({ type: 'cikis', productId: '', qty: 0, projectId: '', note: '', invoiceNo: '', date: new Date().toISOString().slice(0, 10) })
  }

  // Barkod ile ürün bul
  const handleBarcodeDetect = code => {
    const found = products.find(p => p.barcode === code || p.sku === code)
    setShowBarcode(false)
    if (found) {
      setMovForm(f => ({ ...f, productId: String(found.id) }))
      setShowMovementForm(true)
    } else {
      alert(`Barkod bulunamadı: ${code}\nYeni ürün olarak ekleyebilirsiniz.`)
    }
  }

  // ERP import
  const handleImport = data => {
    if (data.products?.length) {
      const existing = new Set(products.map(p => p.sku))
      const newOnes = data.products.filter(p => !existing.has(p.sku)).map(p => ({ ...p, id: Date.now() + Math.random() }))
      persistProducts([...products, ...newOnes])
    }
    if (data.suppliers?.length) {
      const existing = new Set(suppliers.map(s => s.erpCode))
      const newOnes = data.suppliers.filter(s => !existing.has(s.erpCode)).map(s => ({ ...s, id: Date.now() + Math.random() }))
      persistSuppliers([...suppliers, ...newOnes])
    }
    if (data.projects?.length) {
      const existing = new Set(projects.map(p => p.name))
      const newOnes = data.projects.filter(p => !existing.has(p.name)).map(p => ({ ...p, id: Date.now() + Math.random() }))
      persistProjects([...projects, ...newOnes])
    }
  }

  // Filtrelenmiş ürünler
  const filteredProducts = useMemo(() => {
    let list = [...products]
    if (search) { const q = search.toLowerCase(); list = list.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.barcode?.includes(q)) }
    if (filterCat !== 'Tümü') list = list.filter(p => p.category === filterCat)
    if (filterSupplier !== 'Tümü') { const s = suppliers.find(x => x.name === filterSupplier); if (s) list = list.filter(p => p.supplierId === s.id) }
    list.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'qty') return a.qty - b.qty
      if (sortBy === 'value') return (b.qty * b.price) - (a.qty * a.price)
      if (sortBy === 'critical') return (a.qty <= a.minQty ? 0 : 1) - (b.qty <= b.minQty ? 0 : 1)
      return 0
    })
    return list
  }, [products, search, filterCat, filterSupplier, sortBy, suppliers])

  // İstatistikler
  const stats = useMemo(() => ({
    totalProducts: products.length,
    totalValue: products.reduce((s, p) => s + p.qty * p.price, 0),
    criticals: products.filter(p => p.minQty > 0 && p.qty <= p.minQty),
    todayMovements: movements.filter(m => m.date === new Date().toISOString().slice(0, 10)).length,
    monthlyOut: movements.filter(m => m.type === 'cikis' && m.date?.startsWith(new Date().toISOString().slice(0, 7))).reduce((s, m) => s + m.qty, 0),
  }), [products, movements])

  const fmt = n => n?.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '0'
  const fmtPrice = n => n?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'

  // ── PRODUCT FORM ────────────────────────────────────────
  const ProductForm = () => {
    const [form, setForm] = useState(editItem || { sku: '', barcode: '', name: '', category: 'Profil', unit: 'm', qty: 0, minQty: 0, price: 0, supplierId: '', notes: '' })
    const save = () => {
      if (!form.name) return
      if (editItem) persistProducts(products.map(p => p.id === editItem.id ? { ...p, ...form } : p))
      else persistProducts([...products, { ...form, id: Date.now(), supplierId: form.supplierId ? parseInt(form.supplierId) : null }])
      setShowProductForm(false); setEditItem(null)
    }
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-[#0d1630] border border-white/10 rounded-2xl w-full max-w-lg my-4">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h3 className="font-bold text-white">{editItem ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h3>
            <button onClick={() => { setShowProductForm(false); setEditItem(null) }} className="text-gray-400 hover:text-white text-xl">×</button>
          </div>
          <div className="p-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[{ k: 'sku', l: 'SKU / Ürün Kodu *', ph: 'PRF-TB34' }, { k: 'barcode', l: 'Barkod / QR', ph: '8690001000011' }].map(f => (
                <div key={f.k}>
                  <label className="text-xs text-gray-400 block mb-1">{f.l}</label>
                  <input value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.ph}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-gold-500/40" />
                </div>
              ))}
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Ürün Adı *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="PA66 Termal Kesici 34mm"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-gold-500/40" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Kategori</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Birim</label>
                <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                  {UNITS.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{ k: 'qty', l: 'Miktar' }, { k: 'minQty', l: 'Kritik Eşik' }, { k: 'price', l: 'Birim Fiyat (₺)' }].map(f => (
                <div key={f.k}>
                  <label className="text-xs text-gray-400 block mb-1">{f.l}</label>
                  <input type="number" min={0} step="0.01" value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-gold-500/40" />
                </div>
              ))}
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Tedarikçi</label>
              <select value={form.supplierId || ''} onChange={e => setForm(p => ({ ...p, supplierId: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                <option value="">Tedarikçi seç...</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Notlar</label>
              <input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Özellik, referans, not..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-gold-500/40" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={save} className="flex-1 bg-gold-500 hover:bg-gold-400 text-black font-bold py-3 rounded-xl text-sm transition-all">
                {editItem ? 'Güncelle' : 'Ekle'}
              </button>
              {editItem && <button onClick={() => { if (!confirm('Silinsin mi?')) return; persistProducts(products.filter(p => p.id !== editItem.id)); setShowProductForm(false); setEditItem(null) }}
                className="px-5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-sm">Sil</button>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── HAREKET FORMU ───────────────────────────────────────
  const MovementForm = () => (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-[#0d1630] border border-white/10 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="font-bold text-white">Stok Hareketi</h3>
          <button onClick={() => setShowMovementForm(false)} className="text-gray-400 hover:text-white text-xl">×</button>
        </div>
        <div className="p-6 space-y-4">
          {/* Giriş / Çıkış toggle */}
          <div className="flex bg-black/40 rounded-xl p-1">
            {[{ v: 'giris', l: '+ Giriş', col: 'green' }, { v: 'cikis', l: '− Çıkış', col: 'red' }].map(t => (
              <button key={t.v} onClick={() => setMovForm(f => ({ ...f, type: t.v }))}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${movForm.type === t.v
                  ? t.col === 'green' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  : 'text-gray-400 hover:text-white'}`}>
                {t.l}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Ürün *</label>
            <div className="flex gap-2">
              <select value={movForm.productId} onChange={e => setMovForm(f => ({ ...f, productId: e.target.value }))}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                <option value="">Ürün seç...</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.qty} {p.unit})</option>)}
              </select>
              <button onClick={() => setShowBarcode(true)} className="bg-gold-500/10 border border-gold-500/20 text-gold-400 px-3 rounded-xl text-xs font-semibold hover:bg-gold-500/20 transition-all" title="Barkod tara">
                📷
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Miktar *</label>
              <input type="number" min={0} step="0.01" value={movForm.qty} onChange={e => setMovForm(f => ({ ...f, qty: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-gold-500/40" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Tarih</label>
              <input type="date" value={movForm.date} onChange={e => setMovForm(f => ({ ...f, date: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-gold-500/40" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Proje (opsiyonel)</label>
            <select value={movForm.projectId} onChange={e => setMovForm(f => ({ ...f, projectId: e.target.value }))}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
              <option value="">Projeye bağlama</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Fatura / İrsaliye No</label>
              <input value={movForm.invoiceNo} onChange={e => setMovForm(f => ({ ...f, invoiceNo: e.target.value }))} placeholder="FAT-2024-0441"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-gold-500/40" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Not</label>
              <input value={movForm.note} onChange={e => setMovForm(f => ({ ...f, note: e.target.value }))} placeholder="Açıklama..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-gold-500/40" />
            </div>
          </div>

          <button onClick={saveMovement} className="w-full bg-gold-500 hover:bg-gold-400 text-black font-bold py-3.5 rounded-xl text-sm transition-all">
            Hareketi Kaydet
          </button>
        </div>
      </div>
    </div>
  )

  // ─── RENDER ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#070d1f] text-white pb-20">

      {/* Modaller */}
      {showBarcode && <BarcodeScanner onDetect={handleBarcodeDetect} onClose={() => setShowBarcode(false)} />}
      {showAiTerminal && <AiTerminal products={products} suppliers={suppliers} projects={projects} movements={movements} onClose={() => setShowAiTerminal(false)} />}
      {showErp && <ErpPanel products={products} suppliers={suppliers} projects={projects} movements={movements} onImport={handleImport} onClose={() => setShowErp(false)} />}
      {showMovementForm && <MovementForm />}
      {showProductForm && <ProductForm />}

      {/* ── Kalan Profil Transfer Formu ── */}
      {showTransferForm && transferProduct && (() => {
        const prod = transferProduct
        const FireTransferForm = () => {
          const [tf, setTf] = useState({ kalanMiktar: '', hedefProjeId: '', not: '', date: new Date().toISOString().slice(0, 10) })
          const save = () => {
            const kalan = parseFloat(tf.kalanMiktar)
            if (!kalan || kalan <= 0 || kalan > prod.qty) return
            // Fire hareketi kaydet (çıkış — fire olarak)
            const fireMov = {
              id: Date.now(), type: 'cikis', productId: prod.id, qty: prod.qty - kalan,
              projectId: tf.hedefProjeId ? parseInt(tf.hedefProjeId) : null,
              note: `Fire (kalan ${kalan} ${prod.unit} sonraki projeye aktarıldı)`,
              invoiceNo: '', date: tf.date
            }
            // Kalan stoğu güncelle (fire düştükten sonra kalan = yeni stok)
            const updatedProducts = products.map(p =>
              p.id === prod.id ? { ...p, qty: kalan } : p
            )
            // Eğer hedef proje seçildiyse ek bir "giriş" notu hareketi kaydet
            const movList = [fireMov]
            if (tf.hedefProjeId) {
              movList.push({
                id: Date.now() + 1, type: 'giris', productId: prod.id, qty: kalan,
                projectId: parseInt(tf.hedefProjeId),
                note: `${prod.name} — önceki projeden kalan aktarım`,
                invoiceNo: '', date: tf.date
              })
            }
            persistMovements([...movList, ...movements])
            persistProducts(updatedProducts)
            setShowTransferForm(false)
            setTransferProduct(null)
          }
          return (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
              <div className="bg-[#0d1630] border border-gold-500/30 rounded-2xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                  <div>
                    <h3 className="font-bold text-white text-sm">Kalan Profil Aktarımı</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{prod.name} · Mevcut: <span className="text-gold-400 font-bold">{prod.qty} {prod.unit}</span></p>
                  </div>
                  <button onClick={() => { setShowTransferForm(false); setTransferProduct(null) }} className="text-gray-400 hover:text-white text-xl">×</button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-gold-500/5 border border-gold-500/15 rounded-xl p-3 text-xs text-gold-300/80">
                    Kesim sonrası kalan profil miktarını girin. Fire düşülür, kalan miktar bir sonraki projeye aktarılabilir.
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1.5">Kalan Miktar ({prod.unit}) *</label>
                    <input type="number" min={0} max={prod.qty} step="0.01"
                      value={tf.kalanMiktar} onChange={e => setTf(f => ({ ...f, kalanMiktar: e.target.value }))}
                      placeholder={`max: ${prod.qty} ${prod.unit}`}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-gold-500/40" />
                    {tf.kalanMiktar > 0 && prod.qty - parseFloat(tf.kalanMiktar) >= 0 && (
                      <p className="text-xs text-red-400/70 mt-1">Fire: {(prod.qty - parseFloat(tf.kalanMiktar)).toFixed(2)} {prod.unit}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1.5">Sonraki Proje (opsiyonel)</label>
                    <select value={tf.hedefProjeId} onChange={e => setTf(f => ({ ...f, hedefProjeId: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                      <option value="">Projeye bağlama, stoğa dön</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1.5">Tarih</label>
                    <input type="date" value={tf.date} onChange={e => setTf(f => ({ ...f, date: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-gold-500/40" />
                  </div>
                  <button onClick={save}
                    className="w-full bg-gold-500 hover:bg-gold-400 text-black font-bold py-3 rounded-xl text-sm transition-all">
                    Fire Düş & Kalanı Aktar
                  </button>
                </div>
              </div>
            </div>
          )
        }
        return <FireTransferForm />
      })()}

      {/* Header */}
      <div className="bg-gradient-to-b from-[#0d1630] to-[#070d1f] pt-10 pb-4 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Stok Yönetim Sistemi</h1>
              <p className="text-gray-400 text-xs mt-0.5">OZZO ERP · {products.length} ürün · ₺{fmtPrice(stats.totalValue)} toplam değer</p>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              <button onClick={() => setShowAiTerminal(true)}
                className="flex items-center gap-2 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-gold-400 px-3 py-2 rounded-xl text-xs font-bold transition-all">
                ◈ OZZO Terminal
              </button>
              <button onClick={() => setShowErp(true)}
                className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 px-3 py-2 rounded-xl text-xs font-bold transition-all">
                ⇅ ERP
              </button>
              <button onClick={() => { setShowBarcode(true) }}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all">
                📷 Barkod
              </button>
              <button onClick={() => { setEditItem(null); setShowMovementForm(true) }}
                className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 px-3 py-2 rounded-xl text-xs font-bold transition-all">
                + Hareket
              </button>
              <button onClick={() => { setEditItem(null); setShowProductForm(true) }}
                className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-black px-3 py-2 rounded-xl text-xs font-bold transition-all">
                + Ürün Ekle
              </button>
            </div>
          </div>

          {/* Kritik uyarılar */}
          {stats.criticals.length > 0 && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 mb-3">
              <span className="text-red-400 text-sm font-bold animate-pulse">⚠</span>
              <span className="text-red-300 text-xs font-semibold">{stats.criticals.length} ürün kritik stok seviyesinde:</span>
              <span className="text-red-400/70 text-xs truncate">{stats.criticals.map(p => p.name).join(', ')}</span>
            </div>
          )}

          {/* Tab navigasyonu */}
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'dashboard', label: '⬡ Dashboard' },
              { id: 'products', label: `📦 Ürünler (${products.length})` },
              { id: 'movements', label: `↕ Hareketler (${movements.length})` },
              { id: 'projects', label: `🏗 Projeler (${projects.length})` },
              { id: 'suppliers', label: `🚚 Tedarikçiler (${suppliers.length})` },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${tab === t.id ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6">

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI kartları */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { label: 'Toplam Ürün', val: stats.totalProducts, col: '#c9a84c', icon: '📦' },
                { label: 'Stok Değeri', val: '₺' + fmt(stats.totalValue), col: '#3b82f6', icon: '💰' },
                { label: 'Kritik Stok', val: stats.criticals.length, col: stats.criticals.length > 0 ? '#ef4444' : '#10b981', icon: '⚠' },
                { label: 'Bugün Hareket', val: stats.todayMovements, col: '#8b5cf6', icon: '↕' },
                { label: 'Aylık Çıkış', val: fmt(stats.monthlyOut), col: '#f59e0b', icon: '↑' },
              ].map(s => (
                <div key={s.label} className="bg-[#0d1630] rounded-2xl p-4 border border-white/5 hover:border-gold-500/20 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{s.icon}</span>
                    <div className="w-2 h-2 rounded-full" style={{ background: s.col }} />
                  </div>
                  <div className="text-xl font-black" style={{ color: s.col }}>{s.val}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Kategori dağılımı */}
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="bg-[#0d1630] rounded-2xl p-5 border border-white/5">
                <h3 className="font-bold text-sm mb-4">Kategori Bazlı Stok Değeri</h3>
                {CATEGORIES.map(cat => {
                  const catProducts = products.filter(p => p.category === cat)
                  if (!catProducts.length) return null
                  const value = catProducts.reduce((s, p) => s + p.qty * p.price, 0)
                  const total = stats.totalValue || 1
                  const pct = Math.round(value / total * 100)
                  return (
                    <div key={cat} className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">{cat} <span className="text-gray-500">({catProducts.length})</span></span>
                        <span className="text-gold-400 font-mono">₺{fmt(value)}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gold-500 rounded-full transition-all" style={{ width: pct + '%' }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="bg-[#0d1630] rounded-2xl p-5 border border-white/5">
                <h3 className="font-bold text-sm mb-4">Proje Bazlı Kullanım</h3>
                {projects.map(proj => {
                  const projMovs = movements.filter(m => m.projectId === proj.id && m.type === 'cikis')
                  const projValue = projMovs.reduce((s, m) => {
                    const p = products.find(x => x.id === m.productId)
                    return s + (p ? m.qty * p.price : 0)
                  }, 0)
                  const movCount = projMovs.length
                  return (
                    <div key={proj.id} className="flex items-center justify-between mb-3 pb-3 border-b border-white/5 last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-white">{proj.name}</p>
                        <p className="text-xs text-gray-500">{proj.client} · {movCount} hareket</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gold-400">₺{fmt(projValue)}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${proj.status === 'teslim' ? 'bg-green-500/20 text-green-400' : proj.status === 'montaj' ? 'bg-purple-500/20 text-purple-400' : proj.status === 'uretim' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {proj.status}
                        </span>
                      </div>
                    </div>
                  )
                })}
                {projects.length === 0 && <p className="text-gray-500 text-sm text-center py-4">Proje eklenmemiş</p>}
              </div>
            </div>

            {/* Son hareketler */}
            <div className="bg-[#0d1630] rounded-2xl p-5 border border-white/5">
              <h3 className="font-bold text-sm mb-4">Son 10 Hareket</h3>
              {movements.slice(0, 10).length === 0
                ? <p className="text-gray-500 text-sm text-center py-4">Henüz hareket yok</p>
                : <div className="space-y-2">
                  {movements.slice(0, 10).map(m => {
                    const p = products.find(x => x.id === m.productId)
                    const proj = projects.find(x => x.id === m.projectId)
                    return (
                      <div key={m.id} className="flex items-center gap-3 text-sm">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 ${m.type === 'giris' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {m.type === 'giris' ? '+' : '-'}{m.qty}
                        </span>
                        <span className="text-white/70 truncate flex-1">{p?.name || 'Bilinmiyor'}</span>
                        {proj && <span className="text-xs text-gold-400/70 flex-shrink-0">{proj.name}</span>}
                        <span className="text-xs text-gray-500 flex-shrink-0">{m.date}</span>
                      </div>
                    )
                  })}
                </div>}
            </div>
          </div>
        )}

        {/* ── ÜRÜNLER ── */}
        {tab === 'products' && (
          <div>
            {/* Filtreler */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ürün adı, SKU veya barkod ara..."
                className="flex-1 min-w-48 bg-[#0d1630] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gold-500/40 placeholder-gray-600" />
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                className="bg-[#0d1630] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                <option>Tümü</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={filterSupplier} onChange={e => setFilterSupplier(e.target.value)}
                className="bg-[#0d1630] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                <option>Tümü</option>
                {suppliers.map(s => <option key={s.id}>{s.name}</option>)}
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="bg-[#0d1630] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                <option value="name">Ada göre</option>
                <option value="qty">Miktara göre</option>
                <option value="value">Değere göre</option>
                <option value="critical">Kritikler önce</option>
              </select>
            </div>

            <div className="text-xs text-gray-500 mb-3">{filteredProducts.length} sonuç</div>

            {/* Ürün tablosu */}
            <div className="bg-[#0d1630] rounded-2xl border border-white/5 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-gray-400">
                    <th className="text-left px-4 py-3 font-semibold">Ürün</th>
                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">SKU / Barkod</th>
                    <th className="text-center px-4 py-3 font-semibold">Miktar</th>
                    <th className="text-right px-4 py-3 font-semibold hidden lg:table-cell">Birim Fiyat</th>
                    <th className="text-right px-4 py-3 font-semibold hidden lg:table-cell">Toplam</th>
                    <th className="text-center px-4 py-3 font-semibold">Durum</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => {
                    const isLow = p.minQty > 0 && p.qty <= p.minQty
                    const supplier = suppliers.find(s => s.id === p.supplierId)
                    return (
                      <tr key={p.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${isLow ? 'bg-red-500/5' : ''}`}>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white text-sm">{p.name}</div>
                          <div className="text-xs text-gray-500">{p.category}{supplier ? ` · ${supplier.name}` : ''}</div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="text-xs font-mono text-gray-300">{p.sku}</div>
                          {p.barcode && <div className="text-xs font-mono text-gray-600">{p.barcode}</div>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-base font-black ${isLow ? 'text-red-400' : 'text-gold-400'}`}>{p.qty}</span>
                          <span className="text-xs text-gray-500 ml-1">{p.unit}</span>
                          {p.minQty > 0 && <div className="text-[10px] text-gray-600">min: {p.minQty}</div>}
                        </td>
                        <td className="px-4 py-3 text-right hidden lg:table-cell text-xs font-mono text-gray-300">₺{fmtPrice(p.price)}</td>
                        <td className="px-4 py-3 text-right hidden lg:table-cell text-xs font-mono text-gold-400 font-bold">₺{fmt(p.qty * p.price)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isLow ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                            {isLow ? 'KRİTİK' : 'Normal'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1 justify-end">
                            <button onClick={() => { setMovForm(f => ({ ...f, productId: String(p.id) })); setShowMovementForm(true) }}
                              className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg text-gray-400 transition-all">↕</button>
                            {p.category === 'Profil' && (
                              <button onClick={() => { setTransferProduct(p); setShowTransferForm(true) }}
                                className="text-xs bg-orange-500/10 hover:bg-orange-500/20 px-2 py-1 rounded-lg text-orange-400 border border-orange-500/20 transition-all" title="Kalan profili sonraki projeye aktar">
                                ✂ Kalan Aktar
                              </button>
                            )}
                            <button onClick={() => { setEditItem(p); setShowProductForm(true) }}
                              className="text-xs bg-gold-500/10 hover:bg-gold-500/20 px-2 py-1 rounded-lg text-gold-400 transition-all">Düzenle</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {filteredProducts.length === 0 && <div className="text-center text-gray-500 py-12">Ürün bulunamadı</div>}
            </div>
          </div>
        )}

        {/* ── HAREKETLER ── */}
        {tab === 'movements' && (
          <div>
            <div className="flex gap-2 mb-4">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ürün, proje veya fatura ara..."
                className="flex-1 bg-[#0d1630] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none placeholder-gray-600" />
              <button onClick={() => { setEditItem(null); setShowMovementForm(true) }}
                className="bg-gold-500 hover:bg-gold-400 text-black font-bold px-4 py-2.5 rounded-xl text-sm">+ Hareket</button>
            </div>
            <div className="bg-[#0d1630] rounded-2xl border border-white/5 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-gray-400">
                    <th className="text-left px-4 py-3 font-semibold">Tarih</th>
                    <th className="text-left px-4 py-3 font-semibold">Ürün</th>
                    <th className="text-center px-4 py-3 font-semibold">İşlem</th>
                    <th className="text-center px-4 py-3 font-semibold">Miktar</th>
                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Proje</th>
                    <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Fatura / Not</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.filter(m => {
                    if (!search) return true
                    const q = search.toLowerCase()
                    const p = products.find(x => x.id === m.productId)
                    const pr = projects.find(x => x.id === m.projectId)
                    return p?.name.toLowerCase().includes(q) || pr?.name.toLowerCase().includes(q) || m.invoiceNo?.toLowerCase().includes(q) || m.note?.toLowerCase().includes(q)
                  }).map(m => {
                    const p = products.find(x => x.id === m.productId)
                    const pr = projects.find(x => x.id === m.projectId)
                    return (
                      <tr key={m.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="px-4 py-3 text-xs text-gray-400 font-mono">{m.date}</td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-white">{p?.name || '—'}</div>
                          <div className="text-xs text-gray-500">{p?.sku}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.type === 'giris' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {m.type === 'giris' ? 'GİRİŞ' : 'ÇIKIŞ'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-mono font-bold text-gold-400">{m.qty} <span className="text-xs text-gray-500">{p?.unit}</span></td>
                        <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-400">{pr?.name || '—'}</td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {m.invoiceNo && <div className="text-xs font-mono text-gray-400">{m.invoiceNo}</div>}
                          {m.note && <div className="text-xs text-gray-500">{m.note}</div>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {movements.length === 0 && <div className="text-center text-gray-500 py-12">Henüz hareket kaydı yok</div>}
            </div>
          </div>
        )}

        {/* ── PROJELER ── */}
        {tab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-white">Projeler</h2>
              <button onClick={() => { setEditItem(null); setShowProjectForm(true) }}
                className="bg-gold-500 hover:bg-gold-400 text-black font-bold px-4 py-2.5 rounded-xl text-sm">+ Proje Ekle</button>
            </div>
            {showProjectForm && (
              <ProjectForm
                editItem={editItem}
                projects={projects}
                persistProjects={persistProjects}
                onClose={() => { setShowProjectForm(false); setEditItem(null) }}
              />
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(proj => {
                const projMovs = movements.filter(m => m.projectId === proj.id)
                const projValue = projMovs.filter(m => m.type === 'cikis').reduce((s, m) => { const p = products.find(x => x.id === m.productId); return s + (p ? m.qty * p.price : 0) }, 0)
                const statusColors = { teslim: '#10b981', montaj: '#8b5cf6', uretim: '#3b82f6', teklif: '#f59e0b', kesif: '#6366f1' }
                const sc = statusColors[proj.status] || '#888'
                return (
                  <div key={proj.id} className="bg-[#0d1630] rounded-2xl p-5 border border-white/5 hover:border-gold-500/20 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-white text-sm">{proj.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{proj.client}</p>
                        {proj.address && <p className="text-xs text-gray-600">{proj.address}</p>}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: sc + '25', color: sc }}>{proj.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center mb-3">
                      <div className="bg-black/30 rounded-lg py-2">
                        <div className="text-sm font-bold text-gold-400">₺{fmt(projValue)}</div>
                        <div className="text-[10px] text-gray-500">Malzeme</div>
                      </div>
                      <div className="bg-black/30 rounded-lg py-2">
                        <div className="text-sm font-bold text-blue-400">{projMovs.length}</div>
                        <div className="text-[10px] text-gray-500">Hareket</div>
                      </div>
                    </div>
                    <button onClick={() => { setEditItem(proj); setShowProjectForm(true) }}
                      className="w-full bg-white/5 hover:bg-white/10 text-gray-400 text-xs py-2 rounded-lg transition-all">Düzenle</button>
                  </div>
                )
              })}
              {projects.length === 0 && <div className="col-span-3 text-center text-gray-500 py-12">Proje eklenmemiş</div>}
            </div>
          </div>
        )}

        {/* ── TEDARİKÇİLER ── */}
        {tab === 'suppliers' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-white">Tedarikçiler</h2>
              <button onClick={() => { setEditItem(null); setShowSupplierForm(true) }}
                className="bg-gold-500 hover:bg-gold-400 text-black font-bold px-4 py-2.5 rounded-xl text-sm">+ Tedarikçi Ekle</button>
            </div>
            {showSupplierForm && (
              <SupplierForm
                editItem={editItem}
                suppliers={suppliers}
                persistSuppliers={persistSuppliers}
                onClose={() => { setShowSupplierForm(false); setEditItem(null) }}
              />
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suppliers.map(s => {
                const supProducts = products.filter(p => p.supplierId === s.id)
                const supValue = supProducts.reduce((t, p) => t + p.qty * p.price, 0)
                return (
                  <div key={s.id} className="bg-[#0d1630] rounded-2xl p-5 border border-white/5 hover:border-gold-500/20 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-white text-sm">{s.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{s.contact}</p>
                        <p className="text-xs text-gray-500 font-mono">{s.erpCode}</p>
                      </div>
                      <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{s.leadTime} gün</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center mb-3">
                      <div className="bg-black/30 rounded-lg py-2">
                        <div className="text-sm font-bold text-gold-400">{supProducts.length}</div>
                        <div className="text-[10px] text-gray-500">Ürün</div>
                      </div>
                      <div className="bg-black/30 rounded-lg py-2">
                        <div className="text-sm font-bold text-green-400">₺{fmt(supValue)}</div>
                        <div className="text-[10px] text-gray-500">Stok Değeri</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a href={`tel:${s.phone}`} className="flex-1 text-center bg-white/5 hover:bg-white/10 text-gray-400 text-xs py-2 rounded-lg transition-all">{s.phone}</a>
                      <button onClick={() => { setEditItem(s); setShowSupplierForm(true) }} className="px-3 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 text-xs rounded-lg transition-all">✎</button>
                    </div>
                  </div>
                )
              })}
              {suppliers.length === 0 && <div className="col-span-3 text-center text-gray-500 py-12">Tedarikçi eklenmemiş</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

