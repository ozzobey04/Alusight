import { useState, useRef } from 'react'
import {
  loadProfil, saveProfil, defaultProfil,
  musteriSablonuVar, getSablonTercih, setSablonTercih,
  openPdfPreview,
} from '../utils/raporProfili'

/* ═══════════════════════════════════════════════════════
   RaporIndir — Akıllı rapor indirme butonu
   -------------------------------------------------------
   Props:
     buildHtml(profil) → string    HTML oluşturan fonksiyon
     label             → string    Buton yazısı
     className         → string    Buton className
     children          → node      Alternatif buton içeriği
   ═══════════════════════════════════════════════════════ */
export default function RaporIndir({ buildHtml, label, className = '', children }) {
  const [modal, setModal] = useState(false)

  function handleClick() {
    const tercih = getSablonTercih()
    if (tercih === 'ozzo') {
      indir(defaultProfil())
    } else if (tercih === 'musteri') {
      indir(loadProfil())
    } else {
      setModal(true)
    }
  }

  function indir(profil) {
    const html = buildHtml(profil)
    openPdfPreview(html, profil)
  }

  return (
    <>
      <button onClick={handleClick} className={className}>
        {children || label || '📄 Rapor İndir'}
      </button>
      {modal && (
        <TemplateSecimModal
          onConfirm={(profil, daima, tip) => {
            if (daima) setSablonTercih(tip)
            setModal(false)
            indir(profil)
          }}
          onClose={() => setModal(false)}
        />
      )}
    </>
  )
}

/* ─── Template Seçim Modal ─── */
function TemplateSecimModal({ onConfirm, onClose }) {
  const [secim,  setSecim]  = useState('ozzo')
  const [daima,  setDaima]  = useState(false)
  const [tab,    setTab]    = useState('secim')  // 'secim' | 'doldur'
  const [profil, setProfil] = useState(loadProfil)
  const logoRef  = useRef()
  const antetRef = useRef()

  const musteriVar = musteriSablonuVar()
  const set = (k, v) => setProfil(p => ({ ...p, [k]: v }))

  const handleKaydetVeIndir = () => {
    if (secim === 'musteri') {
      saveProfil({ ...profil, tarih: new Date().toLocaleDateString('tr-TR') })
      onConfirm(profil, daima, 'musteri')
    } else {
      onConfirm(defaultProfil(), daima, 'ozzo')
    }
  }

  const handleLogoFile = e => {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader(); r.onload = ev => set('logo', ev.target.result); r.readAsDataURL(f)
  }
  const handleAntetFile = e => {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader(); r.onload = ev => set('antet', ev.target.result); r.readAsDataURL(f)
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
      <div className="bg-[#0d1630] border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="font-bold text-white text-base">Rapor Şablonu Seç</h2>
            <p className="text-xs text-gray-400 mt-0.5">Raporun hangi şablonla hazırlansın?</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all text-lg">✕</button>
        </div>

        {tab === 'secim' ? (
          <div className="p-6 space-y-4">

            {/* Şablon kartları */}
            <div className="grid grid-cols-2 gap-3">

              {/* OZZO Şablonu */}
              <button onClick={() => setSecim('ozzo')}
                className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all text-left ${secim === 'ozzo' ? 'border-gold-500 bg-gold-500/10' : 'border-white/10 hover:border-white/30'}`}>
                {secim === 'ozzo' && <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-gold-500 flex items-center justify-center text-[9px] font-black text-black">✓</span>}
                <div className="w-16 h-10 bg-white rounded-lg flex items-center justify-center shadow">
                  <span className="font-black text-lg tracking-wider text-gray-900">OZZO</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-white">OZZO Şablonu</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Varsayılan altın çizgili şablon</p>
                </div>
              </button>

              {/* Müşteri Şablonu */}
              <button onClick={() => { setSecim('musteri'); if (!musteriVar) setTab('doldur') }}
                className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all text-left ${secim === 'musteri' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/30'}`}>
                {secim === 'musteri' && <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[9px] font-black text-white">✓</span>}
                <div className="w-16 h-10 bg-[#1a2444] rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
                  {profil.logo
                    ? <img src={profil.logo} alt="" className="max-w-full max-h-full object-contain p-0.5" />
                    : <span className="text-[10px] text-gray-500">Logo yok</span>}
                </div>
                <div>
                  <p className="font-bold text-sm text-white">Kendi Şablonum</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {musteriVar ? (profil.firmaAdi || 'Kaydedilmiş şablon') : 'Henüz oluşturulmadı'}
                  </p>
                </div>
                {!musteriVar && (
                  <span className="text-[10px] bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded-full">
                    + Hızlı Oluştur
                  </span>
                )}
              </button>
            </div>

            {/* Seçilen şablon özeti */}
            {secim === 'musteri' && musteriVar && (
              <div className="bg-[#070d1f] border border-blue-500/20 rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="text-xs text-gray-300 leading-relaxed">
                  {profil.firmaAdi && <div className="font-bold text-white">{profil.firmaAdi}</div>}
                  {profil.musteriAdi && <div>Müşteri: {profil.musteriAdi}</div>}
                  {profil.projeAdi && <div>Proje: {profil.projeAdi}</div>}
                  {profil.hazırlayan && <div>Hazırlayan: {profil.hazırlayan}</div>}
                </div>
                <div className="flex flex-col gap-1.5 ml-4">
                  {profil.antet && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Antetli</span>}
                  <button onClick={() => setTab('doldur')} className="text-[10px] text-blue-400 hover:text-blue-300 underline transition-colors">Düzenle</button>
                </div>
              </div>
            )}

            {/* Daima kullan checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className={`w-5 h-5 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${daima ? 'bg-gold-500 border-gold-500' : 'border-white/30 group-hover:border-white/50'}`}
                onClick={() => setDaima(d => !d)}>
                {daima && <span className="text-black text-[10px] font-black">✓</span>}
              </div>
              <div>
                <p className="text-sm text-white font-medium">Bundan sonra hep bu şablonu kullan</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Bir sonraki raporda seçim ekranı çıkmaz. İstediğinde değiştirebilirsin.</p>
              </div>
            </label>

            {/* Alt butonlar */}
            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-sm border border-white/10 transition-all">
                İptal
              </button>
              <button onClick={handleKaydetVeIndir}
                disabled={secim === 'musteri' && !musteriVar}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm bg-gold-500 hover:bg-gold-400 text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                📄 İndir
              </button>
            </div>
          </div>

        ) : (
          /* ── Hızlı Şablon Doldur ── */
          <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => setTab('secim')} className="text-blue-400 hover:text-blue-300 text-sm transition-colors">← Geri</button>
              <p className="text-xs text-gray-400">Şablon bilgilerini girin</p>
            </div>

            {/* Logo + Antet */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 block">Firma Logosu</label>
                <div className="w-full h-16 bg-[#070d1f] border border-white/10 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:border-white/30 transition-all"
                  onClick={() => logoRef.current?.click()}>
                  {profil.logo
                    ? <img src={profil.logo} alt="" className="max-w-full max-h-full object-contain p-1" />
                    : <span className="text-[10px] text-gray-600">+ Logo Yükle</span>}
                </div>
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoFile} />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 block">Antetli Kağıt</label>
                <div className="w-full h-16 bg-[#070d1f] border border-white/10 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:border-white/30 transition-all"
                  onClick={() => antetRef.current?.click()}>
                  {profil.antet
                    ? <img src={profil.antet} alt="" className="max-w-full max-h-full object-contain p-1" />
                    : <span className="text-[10px] text-gray-600">+ Antet Yükle</span>}
                </div>
                <input ref={antetRef} type="file" accept="image/*" className="hidden" onChange={handleAntetFile} />
              </div>
            </div>

            {/* Tema rengi */}
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 block">Tema Rengi</label>
              <div className="flex items-center gap-2">
                <input type="color" value={profil.renkTema || '#c9a84c'} onChange={e => set('renkTema', e.target.value)}
                  className="w-10 h-8 rounded border border-white/10 bg-transparent cursor-pointer" />
                {['#c9a84c','#2563eb','#16a34a','#dc2626','#7c3aed','#0891b2','#111827'].map(c => (
                  <button key={c} onClick={() => set('renkTema', c)}
                    style={{ background: c }}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${profil.renkTema === c ? 'border-white scale-110' : 'border-transparent hover:border-white/50'}`} />
                ))}
              </div>
            </div>

            {/* Form alanları */}
            {[
              { key: 'firmaAdi',   label: 'Firma Adı',              ph: 'ABC Yapı A.Ş.' },
              { key: 'musteriAdi', label: 'Müşteri Adı',            ph: 'Ahmet Yılmaz' },
              { key: 'projeAdi',   label: 'Proje Adı',              ph: 'Kadıköy Konut' },
              { key: 'projeNo',    label: 'Proje No',               ph: 'PRJ-2024-001' },
              { key: 'hazırlayan', label: 'Hazırlayan',             ph: 'Mimar Ali Kaya' },
              { key: 'telefon',    label: 'Telefon',                ph: '0212 000 00 00' },
              { key: 'email',      label: 'E-posta',                ph: 'info@firma.com' },
              { key: 'adres',      label: 'Adres',                  ph: 'İstanbul, Türkiye' },
              { key: 'dipnot',     label: 'Dipnot (opsiyonel)',     ph: 'Bu rapor ön tasarım amaçlıdır.' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">{f.label}</label>
                <input type="text" value={profil[f.key] || ''} onChange={e => set(f.key, e.target.value)}
                  placeholder={f.ph}
                  className="w-full bg-[#070d1f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-gold-500/50 placeholder-gray-700" />
              </div>
            ))}

            {/* Daima kullan */}
            <label className="flex items-start gap-3 cursor-pointer">
              <div className={`w-5 h-5 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${daima ? 'bg-gold-500 border-gold-500' : 'border-white/30'}`}
                onClick={() => setDaima(d => !d)}>
                {daima && <span className="text-black text-[10px] font-black">✓</span>}
              </div>
              <p className="text-sm text-white font-medium">Bundan sonra hep bu şablonu kullan</p>
            </label>

            <div className="flex gap-3 pt-1">
              <button onClick={() => setTab('secim')} className="px-4 py-2.5 rounded-xl bg-white/5 text-gray-400 text-sm border border-white/10 hover:bg-white/10 transition-all">
                Geri
              </button>
              <button onClick={() => { setSecim('musteri'); handleKaydetVeIndir() }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm bg-gold-500 hover:bg-gold-400 text-black transition-all">
                💾 Kaydet ve İndir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
