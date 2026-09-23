import { useState, useMemo } from 'react'

const RAL_COLORS = [
  { code: 'RAL 1013', name: 'İnci Beyazı', hex: '#F4F0E0', category: 'Beyaz & Krem' },
  { code: 'RAL 1015', name: 'Açık Fildişi', hex: '#F0E6D2', category: 'Beyaz & Krem' },
  { code: 'RAL 9010', name: 'Saf Beyaz', hex: '#F5F5F0', category: 'Beyaz & Krem' },
  { code: 'RAL 9016', name: 'Trafik Beyazı', hex: '#F6F6F0', category: 'Beyaz & Krem' },
  { code: 'RAL 9003', name: 'Sinyal Beyazı', hex: '#ECECE8', category: 'Beyaz & Krem' },
  { code: 'RAL 7016', name: 'Antrasit Gri', hex: '#383E42', category: 'Gri & Antrasit' },
  { code: 'RAL 7021', name: 'Siyah Gri', hex: '#2F3234', category: 'Gri & Antrasit' },
  { code: 'RAL 7035', name: 'Açık Gri', hex: '#D5D6D2', category: 'Gri & Antrasit' },
  { code: 'RAL 7040', name: 'Pencere Grisi', hex: '#9DA3A6', category: 'Gri & Antrasit' },
  { code: 'RAL 7042', name: 'Trafik Grisi A', hex: '#8D9295', category: 'Gri & Antrasit' },
  { code: 'RAL 7045', name: 'Telgraf Grisi', hex: '#8F9295', category: 'Gri & Antrasit' },
  { code: 'RAL 9005', name: 'Siyah', hex: '#0C0C0D', category: 'Siyah' },
  { code: 'RAL 9011', name: 'Grafit Siyahı', hex: '#1C1C1E', category: 'Siyah' },
  { code: 'RAL 9004', name: 'Sinyal Siyahı', hex: '#282828', category: 'Siyah' },
  { code: 'RAL 6005', name: 'Yosun Yeşili', hex: '#1F4028', category: 'Yeşil' },
  { code: 'RAL 6009', name: 'Selvi Yeşili', hex: '#26392A', category: 'Yeşil' },
  { code: 'RAL 6011', name: 'Rezeda Yeşili', hex: '#587B62', category: 'Yeşil' },
  { code: 'RAL 5002', name: 'Ultramarin Mavi', hex: '#1A2D6B', category: 'Mavi' },
  { code: 'RAL 5010', name: 'Centiyane Mavisi', hex: '#134C7A', category: 'Mavi' },
  { code: 'RAL 5024', name: 'Pastel Mavi', hex: '#5B8FA8', category: 'Mavi' },
  { code: 'RAL 3000', name: 'Alev Kırmızısı', hex: '#A52019', category: 'Kırmızı & Kahve' },
  { code: 'RAL 3009', name: 'Oksit Kırmızısı', hex: '#6C3226', category: 'Kırmızı & Kahve' },
  { code: 'RAL 8014', name: 'Sepia Kahvesi', hex: '#3C2A1A', category: 'Kırmızı & Kahve' },
  { code: 'RAL 8022', name: 'Siyah Kahve', hex: '#1A1210', category: 'Kırmızı & Kahve' },
  { code: 'RAL 8019', name: 'Gri Kahve', hex: '#3D3332', category: 'Kırmızı & Kahve' },
]

const ANODIZE = [
  { code: 'C0', name: 'Doğal Alüminyum (Anodize)', hex: '#C8C8C8', desc: 'Gümüş mat, 20μm Class 20' },
  { code: 'C31', name: 'Bronz Açık', hex: '#B87B4C', desc: 'Açık bronz, dekoratif' },
  { code: 'C32', name: 'Bronz Orta', hex: '#8C5A2A', desc: 'Orta bronz, klasik' },
  { code: 'C33', name: 'Bronz Koyu', hex: '#4A3218', desc: 'Koyu bronz, prestij' },
  { code: 'C34', name: 'Altın', hex: '#C8A254', desc: 'Altın sarısı, lüks' },
  { code: 'C35', name: 'Şampanya', hex: '#D4B896', desc: 'Şampanya rengi' },
  { code: 'C36', name: 'İnox Görünüm', hex: '#A8A8A2', desc: 'Paslanmaz çelik efekti' },
]

const CATEGORIES = ['Tümü', 'Beyaz & Krem', 'Gri & Antrasit', 'Siyah', 'Yeşil', 'Mavi', 'Kırmızı & Kahve', 'Anodize']

export default function RenkPage() {
  const [tab, setTab] = useState('ral')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Tümü')
  const [selected, setSelected] = useState(null)
  const [compareList, setCompareList] = useState([])
  const [savedColors, setSavedColors] = useState(() => {
    try { return JSON.parse(localStorage.getItem('AluSight_saved_colors') || '[]') } catch { return [] }
  })
  const [showSaved, setShowSaved] = useState(false)

  const filtered = useMemo(() => {
    const list = tab === 'ral' ? RAL_COLORS : ANODIZE
    return list.filter(c => {
      const matchCat = category === 'Tümü' || c.category === category || (tab === 'anodize' && category === 'Anodize')
      const q = search.toLowerCase()
      return matchCat && (!q || c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
    })
  }, [tab, search, category])

  const toggleCompare = (c) => {
    setCompareList(prev =>
      prev.find(x => x.code === c.code)
        ? prev.filter(x => x.code !== c.code)
        : prev.length < 4 ? [...prev, c] : prev
    )
  }

  const saveColor = (c) => {
    if (savedColors.find(s => s.code === c.code)) return
    const updated = [...savedColors, { ...c, savedAt: new Date().toLocaleDateString('tr-TR') }]
    setSavedColors(updated)
    localStorage.setItem('AluSight_saved_colors', JSON.stringify(updated))
  }

  const removeColor = (code) => {
    const updated = savedColors.filter(s => s.code !== code)
    setSavedColors(updated)
    localStorage.setItem('AluSight_saved_colors', JSON.stringify(updated))
  }


  const isLight = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return (r * 299 + g * 587 + b * 114) / 1000 > 128
  }

  return (
    <div className="min-h-screen bg-[#070d1f] text-white pb-16">
      <div className="bg-gradient-to-b from-[#0d1630] to-[#070d1f] pt-10 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-1">Renk & Kaplama Kataloğu</h1>
          <p className="text-gray-400 text-sm mb-5">Toz boya RAL renkleri ve anodize kaplamalar — alüminyum doğrama için</p>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {[['ral', 'Toz Boya (RAL)'], ['anodize', 'Anodize Kaplama']].map(([t, label]) => (
              <button key={t} onClick={() => { setTab(t); setCategory('Tümü') }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t ? 'bg-blue-600 text-white' : 'bg-[#0d1630] text-gray-400 border border-blue-800/30 hover:border-blue-500/50'}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Renk kodu veya isim ara..."
              className="w-full bg-[#0d1630] border border-blue-800/40 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500 placeholder-gray-600" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Category pills */}
        {tab === 'ral' && (
          <div className="flex gap-2 flex-wrap mb-5">
            {CATEGORIES.filter(c => c !== 'Anodize').map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${category === cat ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#0d1630] border-blue-800/30 text-gray-400 hover:border-blue-500/50'}`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Compare bar */}
        {compareList.length > 0 && (
          <div className="bg-[#0d1630] border border-blue-800/30 rounded-2xl p-4 mb-5 flex items-center gap-3 flex-wrap">
            <span className="text-xs text-gray-400 font-semibold">Karşılaştır:</span>
            {compareList.map(c => (
              <div key={c.code} className="flex items-center gap-2 bg-[#070d1f] rounded-lg px-3 py-1.5">
                <div className="w-5 h-5 rounded" style={{ backgroundColor: c.hex, border: '1px solid rgba(255,255,255,0.1)' }} />
                <span className="text-xs font-semibold">{c.code}</span>
                <button onClick={() => toggleCompare(c)} className="text-gray-600 hover:text-white text-xs ml-1">✕</button>
              </div>
            ))}
          </div>
        )}

        {/* Color Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {filtered.map(color => {
            const inCompare = compareList.find(c => c.code === color.code)
            return (
              <button key={color.code} onClick={() => setSelected(color)}
                className={`group relative rounded-xl overflow-hidden border-2 transition-all ${inCompare ? 'border-blue-400' : 'border-transparent hover:border-blue-500/50'}`}>
                <div className="h-20 w-full" style={{ backgroundColor: color.hex }} />
                <div className="bg-[#0d1630] p-2">
                  <p className="text-xs font-bold text-gray-200">{color.code}</p>
                  <p className="text-xs text-gray-500 truncate">{color.name}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleCompare(color) }}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {inCompare ? '✓' : '+'}
                </button>
              </button>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-gray-600 py-16">
            <p className="text-4xl mb-3">🎨</p>
            <p>Sonuç bulunamadı</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-[#0d1630] w-full md:max-w-sm md:rounded-2xl overflow-hidden border border-blue-800/30">
            <div className="h-32 w-full" style={{ backgroundColor: selected.hex }} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-black">{selected.code}</h3>
                  <p className="text-gray-400">{selected.name}</p>
                  {selected.desc && <p className="text-xs text-gray-500 mt-1">{selected.desc}</p>}
                </div>
                <div className="w-12 h-12 rounded-xl border border-white/10 flex-shrink-0" style={{ backgroundColor: selected.hex }} />
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-[#070d1f] rounded-lg p-3">
                  <p className="text-xs text-gray-500">HEX Kodu</p>
                  <p className="font-bold text-sm">{selected.hex.toUpperCase()}</p>
                </div>
                <div className="bg-[#070d1f] rounded-lg p-3">
                  <p className="text-xs text-gray-500">Kategori</p>
                  <p className="font-bold text-sm">{selected.category || 'Anodize'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleCompare(selected)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${compareList.find(c => c.code === selected.code) ? 'bg-blue-600 border-blue-500' : 'border-blue-700/40 hover:border-blue-500'}`}>
                  {compareList.find(c => c.code === selected.code) ? '✓ Karşılaştırmada' : '+ Karşılaştır'}
                </button>
                <button onClick={() => saveColor(selected)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${savedColors.find(s => s.code === selected.code) ? 'bg-gold-600/20 border-gold-500/50 text-gold-400' : 'border-gold-500/30 hover:border-gold-500 text-gold-400/70'}`}>
                  {savedColors.find(s => s.code === selected.code) ? '✓ Kaydedildi' : '🔖 Projeye Kaydet'}
                </button>
                <button onClick={() => setSelected(null)} className="px-4 py-2.5 rounded-xl bg-[#070d1f] text-gray-400 text-sm">Kapat</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kaydedilen renkler panel */}
      {savedColors.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button onClick={() => setShowSaved(s => !s)}
            className="bg-gold-500 text-black font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
            🔖 Kaydedilenler ({savedColors.length})
          </button>
          {showSaved && (
            <div className="absolute bottom-14 right-0 w-72 bg-[#0d1630] border border-gold-500/20 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-white">Proje Renkleri</p>
                <button onClick={() => setShowSaved(false)} className="text-gray-500 hover:text-white text-sm">×</button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {savedColors.map(c => (
                  <div key={c.code} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg border border-white/10 flex-shrink-0" style={{ background: c.hex }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{c.code}</p>
                      <p className="text-xs text-gray-400 truncate">{c.name}</p>
                    </div>
                    <button onClick={() => removeColor(c.code)} className="text-red-400/50 hover:text-red-400 text-xs px-1">×</button>
                  </div>
                ))}
              </div>
              <button onClick={() => { setSavedColors([]); localStorage.removeItem('AluSight_saved_colors') }}
                className="mt-3 w-full text-xs text-red-400/50 hover:text-red-400 py-1 transition-colors">Temizle</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
