import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const STAGES = [
  { id: 'kesif',   label: 'Keşif',   color: '#6366f1', icon: '🔍', desc: 'Proje ihtiyaçlarınız belirleniyor.' },
  { id: 'teklif', label: 'Teklif',  color: '#f59e0b', icon: '📄', desc: 'Fiyat teklifiniz hazırlanıyor.' },
  { id: 'uretim', label: 'Üretim',  color: '#3b82f6', icon: '🏭', desc: 'Ürününüz üretim aşamasında.' },
  { id: 'montaj', label: 'Montaj',  color: '#8b5cf6', icon: '🔧', desc: 'Montaj ekibimiz çalışıyor.' },
  { id: 'teslim', label: 'Teslim',  color: '#10b981', icon: '✅', desc: 'Projeniz tamamlandı.' },
]

const STOK_KEY = 'ozzo_santiyeler'

export default function MusteriPortalPage() {
  const [params] = useSearchParams()
  const siteId = params.get('id')
  const [site, setSite] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    try {
      const all = JSON.parse(localStorage.getItem(STOK_KEY) || '[]')
      if (siteId) {
        const found = all.find(s => String(s.id) === String(siteId))
        if (found) setSite(found)
        else setNotFound(true)
      }
    } catch { setNotFound(true) }
  }, [siteId])

  const stageIdx = site ? STAGES.findIndex(s => s.id === site.stage) : -1
  const currentStage = STAGES[stageIdx] || STAGES[0]

  if (!siteId) return (
    <div className="min-h-screen bg-[#070d1f] text-white flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">🔗</div>
        <h1 className="text-xl font-bold mb-2">Müşteri Portali</h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          Bu sayfayı görüntülemek için OZZO Alüminyum'dan gönderilen özel proje bağlantısını kullanın.
        </p>
        <a href="https://wa.me/905358610404" target="_blank" rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] px-5 py-2.5 rounded-xl text-sm font-semibold">
          WhatsApp ile İletişim
        </a>
      </div>
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen bg-[#070d1f] text-white flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-xl font-bold mb-2">Proje Bulunamadı</h1>
        <p className="text-gray-400 text-sm">Bu proje bağlantısı geçersiz veya süresi dolmuş olabilir.</p>
        <a href="https://wa.me/905358610404" target="_blank" rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] px-5 py-2.5 rounded-xl text-sm font-semibold">
          Bize Yazın
        </a>
      </div>
    </div>
  )

  if (!site) return (
    <div className="min-h-screen bg-[#070d1f] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#070d1f] text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0d1630] to-[#070d1f] px-4 pt-10 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="text-gold-400 text-xs font-display tracking-[0.3em] uppercase mb-2">OZZO Alüminyum — Müşteri Portali</div>
          <h1 className="text-2xl font-extrabold text-white mb-1">{site.name}</h1>
          <p className="text-gray-400 text-sm">{site.client}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pb-20 space-y-4">
        {/* Aktif aşama kartı */}
        <div className="bg-[#0d1630] rounded-2xl p-6 border border-white/10" style={{ borderColor: currentStage.color + '40' }}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: currentStage.color + '20', border: `1px solid ${currentStage.color}40` }}>
              {currentStage.icon}
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Güncel Durum</div>
              <div className="text-xl font-bold" style={{ color: currentStage.color }}>{currentStage.label}</div>
              <div className="text-sm text-gray-300 mt-0.5">{currentStage.desc}</div>
            </div>
          </div>
        </div>

        {/* İlerleme çubuğu */}
        <div className="bg-[#0d1630] rounded-2xl p-5 border border-white/5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Proje Aşamaları</p>
          <div className="space-y-3">
            {STAGES.map((s, i) => {
              const done = i < stageIdx
              const active = i === stageIdx
              const upcoming = i > stageIdx
              return (
                <div key={s.id} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 transition-all ${
                    done ? 'bg-green-500/20' : active ? '' : 'bg-white/5'
                  }`} style={active ? { background: s.color + '25', border: `2px solid ${s.color}` } : {}}>
                    {done ? '✓' : <span className={upcoming ? 'opacity-30' : ''}>{s.icon}</span>}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-semibold ${done ? 'text-green-400' : active ? 'text-white' : 'text-gray-600'}`}>
                      {s.label}
                    </div>
                  </div>
                  {active && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: s.color + '20', color: s.color }}>
                      Aktif
                    </span>
                  )}
                  {done && <span className="text-xs text-green-400/70">Tamamlandı</span>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Proje bilgileri */}
        <div className="bg-[#0d1630] rounded-2xl p-5 border border-white/5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Proje Bilgileri</p>
          <div className="space-y-3">
            {[
              { label: 'Proje Adı', val: site.name },
              { label: 'Adres', val: site.address || '—' },
              { label: 'Proje Tarihi', val: site.createdAt ? new Date(site.createdAt).toLocaleDateString('tr-TR') : '—' },
            ].filter(r => r.val && r.val !== '—').map(row => (
              <div key={row.label} className="flex justify-between items-start gap-4">
                <span className="text-gray-500 text-sm flex-shrink-0">{row.label}</span>
                <span className="text-white text-sm text-right">{row.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Son ziyaret notu */}
        {site.visits?.length > 0 && site.visits[site.visits.length - 1]?.notes && (
          <div className="bg-[#0d1630] rounded-2xl p-5 border border-white/5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Son Güncelleme</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              {site.visits[site.visits.length - 1].notes}
            </p>
            <p className="text-xs text-gray-600 mt-2">{site.visits[site.visits.length - 1].date}</p>
          </div>
        )}

        {/* İletişim */}
        <div className="bg-[#0d1630] rounded-2xl p-5 border border-white/5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">İletişim</p>
          <div className="space-y-3">
            <a href="tel:+905358610404"
              className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors">
              <div className="w-9 h-9 bg-gold-500/10 border border-gold-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              0535 861 04 04
            </a>
            <a href="https://wa.me/905358610404?text=Merhaba, projem hakkında bilgi almak istiyorum."
              target="_blank" rel="noreferrer"
              className="flex items-center gap-3 text-sm text-[#25D366] hover:text-[#1fba58] transition-colors">
              <div className="w-9 h-9 bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              WhatsApp ile İletişim
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 pb-4">
          OZZO Alüminyum · <a href="/" className="text-gold-400/70 hover:text-gold-400">ozzoaluminyum.com</a>
        </p>
      </div>
    </div>
  )
}
