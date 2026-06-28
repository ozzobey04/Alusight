import { useState, useRef } from 'react'
import { loadProfil, saveProfil, defaultProfil, getSablonTercih, setSablonTercih } from '../utils/raporProfili'

export default function RaporProfilModal({ onClose }) {
  const [profil, setProfil] = useState(loadProfil)
  const [saved,  setSaved]  = useState(false)
  const [tercih, setTercihState] = useState(getSablonTercih)
  const logoRef  = useRef()
  const antetRef = useRef()

  const set = (k, v) => setProfil(p => ({ ...p, [k]: v }))

  const handleLogo = e => {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader()
    r.onload = ev => set('logo', ev.target.result)
    r.readAsDataURL(f)
  }

  const handleAntet = e => {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader()
    r.onload = ev => set('antet', ev.target.result)
    r.readAsDataURL(f)
  }

  const handleSave = () => {
    saveProfil({ ...profil, tarih: new Date().toLocaleDateString('tr-TR') })
    setSaved(true)
    setTimeout(() => { setSaved(false); onClose() }, 900)
  }

  const handleReset = () => { setProfil(defaultProfil()); saveProfil(defaultProfil()) }

  const fields = [
    { key: 'firmaAdi',   label: 'Firma / Şirket Adı',  placeholder: 'ABC Mimarlık Ltd.' },
    { key: 'musteriAdi', label: 'Müşteri Adı',          placeholder: 'Ahmet Yılmaz' },
    { key: 'projeAdi',   label: 'Proje Adı',            placeholder: 'Kadıköy Konut Projesi' },
    { key: 'projeNo',    label: 'Proje No',             placeholder: 'PRJ-2024-001' },
    { key: 'adres',      label: 'Adres',                placeholder: 'İstanbul, Türkiye' },
    { key: 'telefon',    label: 'Telefon',              placeholder: '0212 000 00 00' },
    { key: 'email',      label: 'E-posta',              placeholder: 'info@firma.com' },
    { key: 'hazırlayan', label: 'Hazırlayan / Mühendis',placeholder: 'İnş. Müh. Ali Kaya' },
    { key: 'dipnot',     label: 'Dipnot (opsiyonel)',   placeholder: 'Bu rapor ön tasarım amaçlıdır.' },
  ]

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-[#0d1630] border border-gold-500/20 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <h2 className="font-bold text-white text-base">Rapor Profili</h2>
            <p className="text-xs text-gray-400 mt-0.5">Tüm PDF raporlarınızda kullanılacak bilgiler</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all">✕</button>
        </div>

        <div className="p-5 space-y-4">

          {/* Logo */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block font-semibold uppercase tracking-wider">Firma Logosu</label>
            <div className="flex items-center gap-3">
              <div className="w-24 h-16 bg-[#070d1f] border border-white/10 rounded-xl flex items-center justify-center overflow-hidden">
                {profil.logo
                  ? <img src={profil.logo} alt="logo" className="max-w-full max-h-full object-contain p-1" />
                  : <span className="text-gray-600 text-xs text-center px-2">Logo yok</span>}
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => logoRef.current?.click()}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all">
                  📁 Logo Yükle
                </button>
                {profil.logo && (
                  <button onClick={() => set('logo', '')}
                    className="text-red-400 text-xs hover:text-red-300 transition-colors">Logoyu Kaldır</button>
                )}
              </div>
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
            </div>
            <p className="text-[10px] text-gray-600 mt-1">PNG, JPG veya SVG · Önerilen: 300×80 px</p>
          </div>

          {/* Antet Kağıdı */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block font-semibold uppercase tracking-wider">Antetli Kağıt (Arka Plan)</label>
            <div className="flex items-center gap-3">
              <div className="w-24 h-16 bg-[#070d1f] border border-white/10 rounded-xl flex items-center justify-center overflow-hidden">
                {profil.antet
                  ? <img src={profil.antet} alt="antet" className="max-w-full max-h-full object-contain p-1" />
                  : <span className="text-gray-600 text-[10px] text-center px-2">Antet yok</span>}
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => antetRef.current?.click()}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all">
                  🖼️ Antet Yükle
                </button>
                {profil.antet && (
                  <button onClick={() => set('antet', '')}
                    className="text-red-400 text-xs hover:text-red-300 transition-colors">Kaldır</button>
                )}
              </div>
              <input ref={antetRef} type="file" accept="image/*" className="hidden" onChange={handleAntet} />
            </div>
            <p className="text-[10px] text-gray-600 mt-1">A4 boyutunda PDF arka planı · PNG önerilir · Açık renkli olmalı</p>
          </div>

          {/* Tema Rengi */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block font-semibold uppercase tracking-wider">Rapor Tema Rengi</label>
            <div className="flex items-center gap-3">
              <input type="color" value={profil.renkTema || '#c9a84c'} onChange={e => set('renkTema', e.target.value)}
                className="w-12 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
              <div className="flex gap-2">
                {['#c9a84c','#2563eb','#16a34a','#dc2626','#7c3aed','#0891b2'].map(c => (
                  <button key={c} onClick={() => set('renkTema', c)}
                    style={{ background: c }}
                    className="w-7 h-7 rounded-full border-2 border-transparent hover:border-white transition-all" />
                ))}
              </div>
            </div>
          </div>

          {/* Alanlar */}
          <div className="grid grid-cols-1 gap-3">
            {fields.map(f => (
              <div key={f.key}>
                <label className="text-xs text-gray-400 mb-1 block">{f.label}</label>
                {f.key === 'dipnot'
                  ? <textarea value={profil[f.key] || ''} onChange={e => set(f.key, e.target.value)}
                      placeholder={f.placeholder} rows={2}
                      className="w-full bg-[#070d1f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-gold-500/50 resize-none placeholder-gray-600" />
                  : <input type="text" value={profil[f.key] || ''} onChange={e => set(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full bg-[#070d1f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-gold-500/50 placeholder-gray-600" />
                }
              </div>
            ))}
          </div>

          {/* Önizleme mini */}
          {(profil.firmaAdi || profil.musteriAdi || profil.projeAdi) && (
            <div className="bg-[#070d1f] border border-white/10 rounded-xl p-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Rapor Başlığı Önizleme</p>
              <div className="flex items-start gap-3">
                {profil.logo && <img src={profil.logo} alt="" className="h-8 object-contain" />}
                <div className="text-xs leading-relaxed text-gray-300">
                  {profil.firmaAdi && <div className="font-bold text-white">{profil.firmaAdi}</div>}
                  {profil.musteriAdi && <div>Müşteri: {profil.musteriAdi}</div>}
                  {profil.projeAdi && <div>Proje: {profil.projeAdi}</div>}
                  {profil.hazırlayan && <div>Hazırlayan: {profil.hazırlayan}</div>}
                </div>
                <div className="ml-auto">
                  <div style={{ width: 32, height: 4, background: profil.renkTema || '#c9a84c', borderRadius: 2 }} />
                </div>
              </div>
            </div>
          )}

          {/* Aktif şablon tercihi */}
          {tercih && (
            <div className="flex items-center justify-between bg-[#070d1f] border border-white/10 rounded-xl px-4 py-3">
              <div className="text-xs text-gray-400">
                <span className="text-gray-500">Aktif şablon:</span>{' '}
                <span className="text-white font-semibold">
                  {tercih === 'musteri' ? '🧑 Müşteri Şablonu' : '🏢 OZZO Şablonu'}
                </span>
                <span className="text-gray-600 ml-2">(Her raporda otomatik uygulanır)</span>
              </div>
              <button
                onClick={() => { setSablonTercih(null); setTercihState(null) }}
                className="text-[10px] text-red-400 hover:text-red-300 underline transition-colors ml-3 whitespace-nowrap">
                Tercih Sıfırla
              </button>
            </div>
          )}

          {/* Butonlar */}
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                saved ? 'bg-green-500 text-white' : 'bg-gold-500 hover:bg-gold-400 text-black'
              }`}>
              {saved ? '✓ Kaydedildi' : '💾 Kaydet'}
            </button>
            <button onClick={handleReset}
              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs transition-all border border-white/10">
              Sıfırla
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
