import { useState, useMemo } from 'react'

const STAGES = [
  { id: 'kesif',   label: 'Keşif',   color: '#6366f1', icon: '🔍' },
  { id: 'teklif', label: 'Teklif',  color: '#f59e0b', icon: '📄' },
  { id: 'uretim', label: 'Üretim',  color: '#3b82f6', icon: '🏭' },
  { id: 'montaj', label: 'Montaj',  color: '#8b5cf6', icon: '🔧' },
  { id: 'teslim', label: 'Teslim',  color: '#10b981', icon: '✅' },
]

const ISSUE_TYPES = [
  'Su Sızıntısı', 'Conta Hasarı', 'Cam Kırığı', 'Profil Deformasyonu',
  'Yanlış Ölçü', 'Renk Uyumsuzluğu', 'Montaj Hatası', 'Termal Köprü',
  'Vidalar Eksik', 'Drenaj Tıkalı', 'Yüzey Hasarı', 'Diğer',
]

const STORAGE_KEY = 'AluSight_santiyeler'
const load = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] } }
const save = (d) => localStorage.setItem(STORAGE_KEY, JSON.stringify(d))
const newVisit = () => ({ id: Date.now(), date: new Date().toISOString().slice(0, 10), notes: '', issues: [], photos: [], reportRef: '' })

export default function SantiyePage() {
  const [santiyeler, setSantiyeler] = useState(load)
  const [view, setView] = useState('list')
  const [activeSite, setActiveSite] = useState(null)
  const [activeVisit, setActiveVisit] = useState(null)
  const [form, setForm] = useState({})
  const [visitForm, setVisitForm] = useState(newVisit())
  const [filterStage, setFilterStage] = useState('all')
  const [search, setSearch] = useState('')

  const persist = (u) => { setSantiyeler(u); save(u) }

  const filtered = useMemo(() =>
    santiyeler.filter(s => {
      const m = filterStage === 'all' || s.stage === filterStage
      const q = search.toLowerCase()
      return m && (!q || s.name.toLowerCase().includes(q) || s.client.toLowerCase().includes(q) || s.address.toLowerCase().includes(q))
    }), [santiyeler, filterStage, search])

  const sg = (id) => STAGES.find(s => s.id === id) || STAGES[0]

  const openSite = (s) => { setActiveSite(s); setView('detail') }

  const saveSite = () => {
    if (!form.name) return
    const base = { id: Date.now(), stage: 'kesif', visits: [], createdAt: new Date().toISOString(), client: '', address: '', phone: '', notes: '' }
    const updated = activeSite
      ? santiyeler.map(s => s.id === activeSite.id ? { ...s, ...form } : s)
      : [...santiyeler, { ...base, ...form }]
    persist(updated)
    if (activeSite) { setActiveSite({ ...activeSite, ...form }); setView('detail') }
    else setView('list')
  }

  const deleteSite = (id) => {
    if (!confirm('Şantiyeyi silmek istiyor musunuz?')) return
    persist(santiyeler.filter(s => s.id !== id))
    setView('list')
  }

  const saveVisit = () => {
    if (!visitForm.date) return
    const visit = { ...visitForm, id: activeVisit ? visitForm.id : Date.now() }
    const updated = santiyeler.map(s =>
      s.id === activeSite.id
        ? { ...s, visits: activeVisit ? s.visits.map(v => v.id === visit.id ? visit : v) : [...s.visits, visit] }
        : s
    )
    persist(updated)
    setActiveSite(updated.find(s => s.id === activeSite.id))
    setView('detail')
  }

  const deleteVisit = (vid) => {
    const updated = santiyeler.map(s =>
      s.id === activeSite.id ? { ...s, visits: s.visits.filter(v => v.id !== vid) } : s
    )
    persist(updated)
    setActiveSite(updated.find(s => s.id === activeSite.id))
  }

  const setStage = (siteId, stage) => {
    const updated = santiyeler.map(s => s.id === siteId ? { ...s, stage } : s)
    persist(updated)
    if (activeSite?.id === siteId) setActiveSite(prev => ({ ...prev, stage }))
  }

  const addPhoto = (e) => {
    Array.from(e.target.files).forEach(file => {
      const r = new FileReader()
      r.onload = ev => setVisitForm(prev => ({ ...prev, photos: [...prev.photos, { name: file.name, data: ev.target.result }] }))
      r.readAsDataURL(file)
    })
  }

  /* ── LIST ─────────────────────────────────────────────── */
  if (view === 'list') return (
    <div className="min-h-screen bg-[#070d1f] text-white pb-20">
      <div className="bg-gradient-to-b from-[#0d1630] to-[#070d1f] pt-28 pb-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-3xl font-extrabold">Şantiye Takip</h1>
              <p className="text-gray-400 text-sm mt-0.5">{santiyeler.length} proje</p>
            </div>
            <button onClick={() => { setActiveSite(null); setForm({}); setView('newSite') }}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-xl text-sm font-bold transition-all">
              + Yeni Şantiye
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-1 min-w-40">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ara..."
                className="w-full bg-[#0d1630] border border-blue-800/40 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 placeholder-gray-600" />
            </div>
            <select value={filterStage} onChange={e => setFilterStage(e.target.value)}
              className="bg-[#0d1630] border border-blue-800/40 rounded-xl px-3 py-2.5 text-sm outline-none text-gray-300">
              <option value="all">Tüm Aşamalar</option>
              {STAGES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-5 gap-2 mb-6">
          {STAGES.map(s => {
            const cnt = santiyeler.filter(x => x.stage === s.id).length
            return (
              <button key={s.id} onClick={() => setFilterStage(filterStage === s.id ? 'all' : s.id)}
                className={`rounded-xl p-2.5 text-center border transition-all ${filterStage === s.id ? 'border-blue-500 bg-blue-900/20' : 'border-blue-800/20 bg-[#0d1630]'}`}>
                <p className="text-xl">{s.icon}</p>
                <p className="text-sm font-bold" style={{ color: s.color }}>{cnt}</p>
                <p className="text-xs text-gray-500 truncate">{s.label}</p>
              </button>
            )
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <p className="text-6xl mb-4">🏗️</p>
            <p className="font-semibold text-lg text-gray-400">Henüz şantiye yok</p>
            <p className="text-sm mt-1 mb-6">Yeni şantiye ekleyerek takibe başlayın</p>
            <button onClick={() => { setActiveSite(null); setForm({}); setView('newSite') }}
              className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-sm font-bold transition-all inline-flex items-center gap-2">
              <span className="text-lg">+</span> Yeni Proje Oluştur
            </button>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map(s => {
              const stg = sg(s.stage)
              const last = s.visits.slice(-1)[0]
              const totalIssues = s.visits.reduce((acc, v) => acc + v.issues.length, 0)
              return (
                <button key={s.id} onClick={() => openSite(s)}
                  className="text-left bg-[#0d1630] border border-blue-800/20 rounded-2xl p-4 hover:border-blue-500/40 transition-all hover:-translate-y-0.5 group">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-extrabold group-hover:text-blue-300 transition-colors pr-2">{s.name}</h3>
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold flex-shrink-0"
                      style={{ backgroundColor: stg.color + '22', color: stg.color }}>
                      {stg.icon} {stg.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{s.client}</p>
                  {s.address && <p className="text-xs text-gray-600 mt-0.5">📍 {s.address}</p>}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-blue-800/20 text-xs text-gray-500">
                    <span>📋 {s.visits.length} ziyaret</span>
                    {totalIssues > 0 && <span className="text-red-400">⚠ {totalIssues} sorun</span>}
                    {last && <span className="ml-auto">Son: {last.date}</span>}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  /* ── SITE FORM ─────────────────────────────────────────── */
  if (view === 'newSite') return (
    <div className="min-h-screen bg-[#070d1f] text-white pb-20">
      <div className="max-w-xl mx-auto px-4 pt-8">
        <button onClick={() => setView(activeSite ? 'detail' : 'list')} className="text-gray-400 hover:text-white text-sm mb-5 flex items-center gap-1">← Geri</button>
        <h2 className="text-xl font-bold mb-5">{activeSite ? 'Şantiye Düzenle' : 'Yeni Şantiye'}</h2>
        <div className="bg-[#0d1630] rounded-2xl p-5 border border-blue-800/20 space-y-4">
          {[
            { key: 'name', label: 'Proje / Şantiye Adı *', placeholder: 'Örn: ABC Plaza Cephe Yenileme' },
            { key: 'client', label: 'Müşteri / Firma', placeholder: 'Müşteri adı' },
            { key: 'address', label: 'Adres', placeholder: 'Şantiye adresi' },
            { key: 'phone', label: 'İletişim No', placeholder: '05xx xxx xx xx' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-gray-400 mb-1 block">{f.label}</label>
              <input value={form[f.key] ?? (activeSite?.[f.key] || '')}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full bg-[#1a2444] border border-blue-700/30 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
            </div>
          ))}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Aşama</label>
            <div className="grid grid-cols-5 gap-1.5">
              {STAGES.map(s => (
                <button key={s.id} onClick={() => setForm(p => ({ ...p, stage: s.id }))}
                  className={`p-2 rounded-xl border text-center transition-all ${(form.stage ?? activeSite?.stage ?? 'kesif') === s.id ? 'border-blue-500 bg-blue-900/20' : 'border-blue-800/20'}`}>
                  <p>{s.icon}</p>
                  <p className="text-xs mt-0.5 font-semibold" style={{ color: s.color }}>{s.label}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Genel Notlar</label>
            <textarea value={form.notes ?? (activeSite?.notes || '')}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              rows={3} placeholder="Proje bilgileri..."
              className="w-full bg-[#1a2444] border border-blue-700/30 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 resize-none" />
          </div>
          <button onClick={saveSite} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold transition-all">Kaydet</button>
        </div>
      </div>
    </div>
  )

  /* ── SITE DETAIL ───────────────────────────────────────── */
  if (view === 'detail' && activeSite) {
    const site = santiyeler.find(s => s.id === activeSite.id) || activeSite
    const stg = sg(site.stage)
    const stageIdx = STAGES.findIndex(s => s.id === site.stage)
    return (
      <div className="min-h-screen bg-[#070d1f] text-white pb-20">
        <div className="bg-gradient-to-b from-[#0d1630] to-[#070d1f] pt-8 pb-6 px-4">
          <div className="max-w-3xl mx-auto">
            <button onClick={() => setView('list')} className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-1">← Tüm Şantiyeler</button>
            <div className="flex items-start justify-between mb-5">
              <div>
                <h1 className="text-2xl font-extrabold">{site.name}</h1>
                <p className="text-gray-400 text-sm">{site.client}</p>
                {site.address && <p className="text-gray-500 text-xs mt-0.5">📍 {site.address}</p>}
                {site.phone && <p className="text-gray-500 text-xs">📞 {site.phone}</p>}
              </div>
              <button onClick={() => { setForm({}); setView('newSite') }}
                className="text-xs px-3 py-1.5 bg-[#070d1f] border border-blue-800/30 rounded-lg text-gray-400 hover:text-white transition-all">Düzenle</button>
            </div>

            {/* Stage stepper */}
            <div className="flex items-center">
              {STAGES.map((s, i) => (
                <div key={s.id} className="flex items-center flex-1">
                  <button onClick={() => setStage(site.id, s.id)}
                    className={`flex flex-col items-center flex-1 py-2 rounded-xl transition-all ${site.stage === s.id ? 'bg-[#0d1630]' : 'hover:bg-white/5'}`}>
                    <span className={`text-xl ${i <= stageIdx ? '' : 'opacity-30'}`}>{s.icon}</span>
                    <span className="text-xs mt-0.5 font-semibold" style={{ color: i <= stageIdx ? s.color : '#374151' }}>{s.label}</span>
                  </button>
                  {i < STAGES.length - 1 && <div className={`h-px w-3 flex-none ${i < stageIdx ? 'bg-blue-500' : 'bg-[#1a2444]'}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WhatsApp bildirim butonu */}
        <div className="max-w-3xl mx-auto px-4 mt-3">
          <div className="flex gap-3">
            <button onClick={() => sendWhatsApp(site, site.stage)}
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-sm font-semibold py-3 rounded-xl transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              WhatsApp Gönder
            </button>
            <button onClick={() => {
              const link = `${window.location.origin}/musteri?id=${site.id}`
              navigator.clipboard.writeText(link).then(() => alert('Portal linki kopyalandı: ' + link))
            }}
              className="flex-1 flex items-center justify-center gap-2 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-gold-400 text-sm font-semibold py-3 rounded-xl transition-all">
              🔗 Portal Linki Kopyala
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 space-y-4">
          {site.notes && (
            <div className="bg-[#0d1630] rounded-xl p-4 border border-blue-800/20">
              <p className="text-xs text-gray-500 mb-1">Genel Notlar</p>
              <p className="text-sm text-gray-300">{site.notes}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">Ziyaretler <span className="text-gray-500 text-sm font-normal">({site.visits.length})</span></h2>
            <button onClick={() => { setActiveVisit(null); setVisitForm(newVisit()); setView('newVisit') }}
              className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-xl text-sm font-bold transition-all">+ Ziyaret Ekle</button>
          </div>

          {site.visits.length === 0 ? (
            <div className="text-center py-12 text-gray-600 bg-[#0d1630] rounded-2xl border border-blue-800/20">
              <p className="text-3xl mb-2">📋</p>
              <p>Henüz ziyaret kaydı yok</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...site.visits].reverse().map(visit => (
                <div key={visit.id} className="bg-[#0d1630] rounded-2xl border border-blue-800/20">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-blue-300">📅 {visit.date}</span>
                      <div className="flex gap-2">
                        <button onClick={() => { setActiveVisit(visit); setVisitForm(visit); setView('newVisit') }}
                          className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded">Düzenle</button>
                        <button onClick={() => deleteVisit(visit.id)}
                          className="text-xs text-red-400/50 hover:text-red-400 px-2 py-1 rounded">Sil</button>
                      </div>
                    </div>
                    {visit.notes && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-300 mb-2">{visit.notes}</p>
                        {!aiActions[visit.id] && !aiLoading[visit.id] && (
                          <button onClick={() => getAiActions(visit.id, visit.notes)}
                            className="text-xs bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/20 text-gold-400 px-3 py-1.5 rounded-lg transition-all">
                            AluSight Aksiyon Listesi
                          </button>
                        )}
                        {aiLoading[visit.id] && <p className="text-xs text-gold-400 animate-pulse mt-1">AluSight analiz ediyor...</p>}
                        {aiActions[visit.id] && (
                          <div className="bg-gold-500/5 border border-gold-500/20 rounded-lg p-3 mt-2">
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-xs text-gold-400 font-semibold">AluSight Aksiyon Listesi</p>
                              <button onClick={() => setAiActions(prev=>({...prev,[visit.id]:null}))} className="text-xs text-white/30 hover:text-white/60">×</button>
                            </div>
                            <pre className="text-xs text-white/70 whitespace-pre-wrap font-sans leading-relaxed">{aiActions[visit.id]}</pre>
                          </div>
                        )}
                      </div>
                    )}
                    {visit.issues.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {visit.issues.map(issue => (
                          <span key={issue} className="text-xs bg-red-900/30 text-red-300 border border-red-700/30 px-2 py-0.5 rounded-full">⚠ {issue}</span>
                        ))}
                      </div>
                    )}
                    {visit.reportRef && (
                      <p className="text-xs text-blue-400/70 bg-blue-900/20 px-3 py-1 rounded-lg inline-block">📎 {visit.reportRef}</p>
                    )}
                    {visit.photos.length > 0 && (
                      <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                        {visit.photos.map((p, i) => (
                          <img key={i} src={p.data} alt={p.name} className="h-16 w-16 object-cover rounded-lg flex-shrink-0 border border-blue-800/20" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => deleteSite(site.id)}
            className="w-full py-3 rounded-xl border border-red-800/30 text-red-400/50 hover:text-red-400 hover:border-red-700/50 text-sm transition-all">
            Şantiyeyi Sil
          </button>
        </div>
      </div>
    )
  }

  /* ── VISIT FORM ────────────────────────────────────────── */
  if (view === 'newVisit') return (
    <div className="min-h-screen bg-[#070d1f] text-white pb-20">
      <div className="max-w-xl mx-auto px-4 pt-8">
        <button onClick={() => setView('detail')} className="text-gray-400 hover:text-white text-sm mb-5 flex items-center gap-1">← Geri</button>
        <h2 className="text-xl font-bold mb-5">{activeVisit ? 'Ziyaret Düzenle' : 'Yeni Ziyaret'}</h2>
        <div className="bg-[#0d1630] rounded-2xl p-5 border border-blue-800/20 space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Tarih</label>
            <input type="date" value={visitForm.date}
              onChange={e => setVisitForm(p => ({ ...p, date: e.target.value }))}
              className="w-full bg-[#1a2444] border border-blue-700/30 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Ziyaret Notları</label>
            <textarea value={visitForm.notes}
              onChange={e => setVisitForm(p => ({ ...p, notes: e.target.value }))}
              rows={4} placeholder="Saha gözlemleri, görüşmeler, alınan kararlar..."
              className="w-full bg-[#1a2444] border border-blue-700/30 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 resize-none" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Tespit Edilen Sorunlar</label>
            <div className="flex flex-wrap gap-2">
              {ISSUE_TYPES.map(issue => {
                const sel = visitForm.issues.includes(issue)
                return (
                  <button key={issue}
                    onClick={() => setVisitForm(p => ({ ...p, issues: sel ? p.issues.filter(i => i !== issue) : [...p.issues, issue] }))}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${sel ? 'bg-red-900/30 border-red-600/50 text-red-300' : 'border-blue-800/30 text-gray-400 hover:border-blue-500/50'}`}>
                    {sel ? '⚠ ' : ''}{issue}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Rapor Referansı</label>
            <input value={visitForm.reportRef}
              onChange={e => setVisitForm(p => ({ ...p, reportRef: e.target.value }))}
              placeholder="Örn: Öneri_ABC_Plaza_01.pdf"
              className="w-full bg-[#1a2444] border border-blue-700/30 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Fotoğraflar</label>
            <label className="flex items-center justify-center gap-3 border-2 border-dashed border-blue-800/40 rounded-xl p-4 cursor-pointer hover:border-blue-500/50 transition-all">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm text-gray-400">Fotoğraf Ekle</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={addPhoto} />
            </label>
            {visitForm.photos.length > 0 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {visitForm.photos.map((p, i) => (
                  <div key={i} className="relative flex-shrink-0">
                    <img src={p.data} alt={p.name} className="h-20 w-20 object-cover rounded-lg border border-blue-800/20" />
                    <button onClick={() => setVisitForm(prev => ({ ...prev, photos: prev.photos.filter((_, j) => j !== i) }))}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full text-xs flex items-center justify-center font-bold">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={saveVisit} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold transition-all">Kaydet</button>
        </div>
      </div>
    </div>
  )

  return null
}
