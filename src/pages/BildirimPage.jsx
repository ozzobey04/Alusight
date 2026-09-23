import { useState, useEffect, useCallback, useRef } from 'react'
import {
  fetchNotifications, markAsRead, markAsFixed,
  listenNotifications, clearLocalNotifications,
  getFirebaseConfig, saveFirebaseConfig, isFirebaseConfigured,
  requestPushPermission, setSoundEnabled, getSoundEnabled,
  getUnreadCount,
} from '../utils/notificationService'

const SEV_COLOR = s => s === 'high' ? '#ef4444' : s === 'medium' ? '#f59e0b' : '#10b981'
const SEV_LABEL = s => s === 'high' ? 'Kritik' : s === 'medium' ? 'Orta' : 'Düşük'

/* ─── Firebase Kurulum Rehberi ──────────────────────────── */
function FirebaseSetupGuide({ onSave, onClose }) {
  const [url, setUrl] = useState(getFirebaseConfig().url || '')
  const [step, setStep] = useState(1)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const testConnection = async () => {
    if (!url) return
    setTesting(true); setTestResult(null)
    try {
      const clean = url.replace(/\/$/, '')
      const res = await fetch(`${clean}/AluSight_test.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true, ts: Date.now() }),
      })
      if (res.ok) setTestResult({ ok: true, msg: '✓ Firebase bağlantısı başarılı!' })
      else setTestResult({ ok: false, msg: `Hata: HTTP ${res.status} — Kuralları kontrol edin.` })
    } catch (e) {
      setTestResult({ ok: false, msg: 'Bağlanamadı: ' + e.message })
    }
    setTesting(false)
  }

  const save = () => {
    saveFirebaseConfig({ url: url.replace(/\/$/, '') })
    onSave()
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto flex items-start justify-center p-4">
      <div className="bg-[#0d1630] border border-white/10 rounded-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="font-bold text-white">Firebase Kurulumu</h2>
            <p className="text-xs text-gray-400 mt-0.5">Şirket içi cross-device bildirim için gerekli</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">×</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Adım göstergesi */}
          <div className="flex items-center gap-2">
            {[1,2,3,4].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all ${step >= s ? 'bg-gold-500 text-black' : 'bg-white/5 text-gray-500'}`}
                  onClick={() => setStep(s)}>{s}</div>
                {s < 4 && <div className={`h-px w-8 ${step > s ? 'bg-gold-500' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-white">1. Firebase Hesabı Oluştur</h3>
              <div className="bg-white/5 rounded-xl p-4 space-y-3 text-sm text-gray-300">
                <p>📌 <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-gold-400 hover:underline">console.firebase.google.com</a> adresine git (Google hesabıyla)</p>
                <p>📌 <strong className="text-white">"Add project"</strong> → Proje adı: <code className="bg-black/40 px-2 py-0.5 rounded text-gold-300">alusight-bildirim</code></p>
                <p>📌 Google Analytics: <strong className="text-white">Devre dışı</strong> bırak → <strong className="text-white">Create project</strong></p>
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-gold-500 hover:bg-gold-400 text-black font-bold py-3 rounded-xl text-sm">Sonraki →</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-white">2. Realtime Database Oluştur</h3>
              <div className="bg-white/5 rounded-xl p-4 space-y-3 text-sm text-gray-300">
                <p>📌 Sol menüden <strong className="text-white">Build → Realtime Database</strong></p>
                <p>📌 <strong className="text-white">"Create Database"</strong> tıkla</p>
                <p>📌 Bölge: <strong className="text-white">Belgium (europe-west1)</strong> seç</p>
                <p>📌 Security rules: <strong className="text-white">"Start in test mode"</strong> seç → Enable</p>
              </div>
              <button onClick={() => setStep(3)} className="w-full bg-gold-500 hover:bg-gold-400 text-black font-bold py-3 rounded-xl text-sm">Sonraki →</button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-white">3. Database URL'ini Kopyala</h3>
              <div className="bg-white/5 rounded-xl p-4 space-y-3 text-sm text-gray-300">
                <p>📌 Realtime Database sayfasında URL'i bul:</p>
                <div className="bg-black/40 rounded-lg px-4 py-3 font-mono text-xs text-gold-300">
                  https://<span className="text-white">proje-adın</span>-default-rtdb.europe-west1.firebasedatabase.app
                </div>
                <p>📌 Bu URL'yi aşağıya yapıştır:</p>
              </div>
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://alusight-bildirim-default-rtdb.europe-west1.firebasedatabase.app"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-gold-500/40"
              />
              <div className="flex gap-3">
                <button onClick={testConnection} disabled={!url || testing}
                  className="flex-1 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 font-semibold py-3 rounded-xl text-sm disabled:opacity-50">
                  {testing ? 'Test ediliyor...' : 'Bağlantıyı Test Et'}
                </button>
                <button onClick={() => setStep(4)} disabled={!url}
                  className="flex-1 bg-gold-500 hover:bg-gold-400 text-black font-bold py-3 rounded-xl text-sm disabled:opacity-50">Sonraki →</button>
              </div>
              {testResult && (
                <div className={`text-sm px-4 py-3 rounded-xl ${testResult.ok ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {testResult.msg}
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-white">4. Güvenlik Kuralları (Önerilen)</h3>
              <div className="bg-white/5 rounded-xl p-4 space-y-3 text-sm text-gray-300">
                <p>📌 Firebase Console → Realtime Database → <strong className="text-white">Rules</strong> sekmesi</p>
                <p>📌 Şu kuralı yapıştır (30 gün test modundan sonra bu gerekli):</p>
                <pre className="bg-black/40 rounded-lg px-4 py-3 text-xs text-green-300 overflow-x-auto">{`{
  "rules": {
    "AluSight_notifications": {
      ".read": true,
      ".write": true
    },
    "AluSight_test": {
      ".read": true,
      ".write": true
    }
  }
}`}</pre>
                <p className="text-xs text-gray-500">Not: Production'da auth eklenebilir. Şimdilik açık bırak.</p>
              </div>
              <button onClick={save} className="w-full bg-gold-500 hover:bg-gold-400 text-black font-bold py-3 rounded-xl text-sm">
                ✓ Kurulumu Tamamla
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Ana Bildirim Sayfası ──────────────────────────────── */
export default function BildirimPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading]             = useState(true)
  const [filter, setFilter]               = useState('all')  // all | unread | critical | fixed
  const [showSetup, setShowSetup]         = useState(false)
  const [showSettings, setShowSettings]   = useState(false)
  const [pushPerm, setPushPerm]           = useState(Notification?.permission || 'default')
  const [soundOn, setSoundOn]             = useState(getSoundEnabled())
  const [userName, setUserName]           = useState(() => localStorage.getItem('AluSight_username') || '')
  const [userNameInput, setUserNameInput] = useState('')
  const [fixModal, setFixModal]           = useState(null)
  const [fixerName, setFixerName]         = useState('')
  const [lastRefresh, setLastRefresh]     = useState(null)
  const pollRef = useRef(null)

  const load = useCallback(async () => {
    const data = await fetchNotifications()
    setNotifications(data)
    setLastRefresh(new Date())
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    /* Polling: 8 saniyede bir */
    pollRef.current = setInterval(load, 8000)
    /* BroadcastChannel dinle */
    const unsub = listenNotifications(msg => {
      if (msg.type === 'new' || msg.type === 'read' || msg.type === 'fixed') load()
    })
    return () => { clearInterval(pollRef.current); unsub() }
  }, [load])

  const filtered = notifications.filter(n => {
    if (filter === 'unread')   return !n.readBy.includes(userName) && !n.fixed
    if (filter === 'critical') return n.severity === 'high'
    if (filter === 'fixed')    return n.fixed
    return true
  })

  const unreadCount = notifications.filter(n => !n.readBy.includes(userName) && !n.fixed).length

  const handleRead = async (id) => {
    if (!userName) return
    await markAsRead(id, userName)
    load()
  }

  const handleFix = async () => {
    if (!fixModal || !fixerName.trim()) return
    await markAsFixed(fixModal, fixerName.trim())
    setFixModal(null); setFixerName(''); load()
  }

  /* İstatistikler */
  const stats = {
    total: notifications.length,
    critical: notifications.filter(n => n.severity === 'high').length,
    fixed: notifications.filter(n => n.fixed).length,
    unread: unreadCount,
  }

  /* Kullanıcı adı girilmemişse */
  if (!userName) return (
    <div className="min-h-screen bg-[#070d1f] text-white flex items-center justify-center p-6">
      <div className="bg-[#0d1630] border border-white/10 rounded-2xl p-8 w-full max-w-sm text-center">
        <div className="text-4xl mb-4">👤</div>
        <h1 className="text-xl font-bold mb-2">Bildirim Merkezine Giriş</h1>
        <p className="text-gray-400 text-sm mb-6">Bildirimleri okundu olarak işaretleyebilmek için adını gir.</p>
        <input
          value={userNameInput}
          onChange={e => setUserNameInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && userNameInput.trim() && (localStorage.setItem('AluSight_username', userNameInput.trim()), setUserName(userNameInput.trim()))}
          placeholder="Adın (örn: Mehmet Usta)"
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white mb-4 outline-none focus:border-gold-500/40"
          autoFocus
        />
        <button
          onClick={() => { if (userNameInput.trim()) { localStorage.setItem('AluSight_username', userNameInput.trim()); setUserName(userNameInput.trim()) } }}
          className="w-full bg-gold-500 hover:bg-gold-400 text-black font-bold py-3 rounded-xl text-sm">
          Giriş
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#070d1f] text-white pb-20">

      {/* Fix Modal */}
      {fixModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1630] border border-green-500/30 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold mb-1">Düzeltme Onayı</h3>
            <p className="text-xs text-gray-400 mb-4">Bu hatayı kim düzeltti?</p>
            <input value={fixerName} onChange={e => setFixerName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleFix()}
              placeholder="Usta / Teknisyen adı" autoFocus
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm mb-4 outline-none focus:border-green-500/40" />
            <div className="flex gap-3">
              <button onClick={handleFix} className="flex-1 bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-xl text-sm">✓ Onayla</button>
              <button onClick={() => { setFixModal(null); setFixerName('') }} className="bg-white/5 px-5 rounded-xl text-gray-400 text-sm">İptal</button>
            </div>
          </div>
        </div>
      )}

      {/* Setup Modal */}
      {showSetup && <FirebaseSetupGuide onSave={() => { setShowSetup(false); load() }} onClose={() => setShowSetup(false)} />}

      {/* Ayarlar Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1630] border border-white/10 rounded-2xl p-6 w-full max-w-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Bildirim Ayarları</h2>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white">×</button>
            </div>

            {/* Kullanıcı adı */}
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Kullanıcı Adın</label>
              <div className="flex gap-2">
                <input value={userNameInput || userName} onChange={e => setUserNameInput(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold-500/40" />
                <button onClick={() => { const n = (userNameInput || userName).trim(); if (n) { localStorage.setItem('AluSight_username', n); setUserName(n); setUserNameInput('') } }}
                  className="bg-gold-500 text-black font-bold px-4 rounded-xl text-xs">Kaydet</button>
              </div>
            </div>

            {/* Sesli uyarı */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Sesli Uyarı</p>
                <p className="text-xs text-gray-500">Kritik hata gelince ses çalar</p>
              </div>
              <button onClick={() => { const v = !soundOn; setSoundOn(v); setSoundEnabled(v) }}
                className={`w-12 h-6 rounded-full transition-all ${soundOn ? 'bg-gold-500' : 'bg-white/10'}`}>
                <div className={`w-5 h-5 rounded-full bg-white transition-all mx-0.5 ${soundOn ? 'translate-x-6' : ''}`} />
              </button>
            </div>

            {/* Browser Push */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Browser Bildirimi</p>
                <p className="text-xs text-gray-500">Telefon kilitli olsa bile gelir</p>
              </div>
              <button onClick={async () => { const p = await requestPushPermission(); setPushPerm(p) }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${pushPerm === 'granted' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-gold-500/20 text-gold-400 border border-gold-500/20'}`}>
                {pushPerm === 'granted' ? '✓ Aktif' : pushPerm === 'denied' ? '✗ Engellendi' : 'Aktifleştir'}
              </button>
            </div>

            {/* Firebase */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Firebase (Cross-Device)</p>
                <p className="text-xs text-gray-500">Farklı telefonlar arası senkron</p>
              </div>
              <button onClick={() => { setShowSettings(false); setShowSetup(true) }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${isFirebaseConfigured() ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-blue-500/20 text-blue-300 border border-blue-500/20'}`}>
                {isFirebaseConfigured() ? '✓ Bağlı' : 'Kur'}
              </button>
            </div>

            {/* Temizle */}
            <button onClick={() => { if (confirm('Tüm bildirimler silinsin mi?')) { clearLocalNotifications(); load() } }}
              className="w-full text-xs text-red-400/60 hover:text-red-400 py-2 transition-colors">
              Tüm Bildirimleri Temizle
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-b from-[#0d1630] to-[#070d1f] pt-10 pb-5 px-4 border-b border-white/5 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold">Bildirim Merkezi</h1>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full animate-pulse">{unreadCount}</span>
                )}
              </div>
              <p className="text-gray-400 text-xs mt-0.5">
                {userName} · {isFirebaseConfigured() ? '🟢 Firebase aktif' : '🔴 Yalnızca yerel'}
                {lastRefresh && <span className="ml-2 text-gray-600">· {lastRefresh.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>}
              </p>
            </div>
            <button onClick={() => setShowSettings(true)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 p-2.5 rounded-xl transition-all">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* KPI'lar */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { l: 'Toplam', v: stats.total, c: '#c9a84c' },
              { l: 'Kritik', v: stats.critical, c: '#ef4444' },
              { l: 'Düzeltildi', v: stats.fixed, c: '#10b981' },
              { l: 'Okunmadı', v: stats.unread, c: '#f59e0b' },
            ].map(s => (
              <div key={s.l} className="bg-[#0d1630] rounded-xl p-2.5 text-center border border-white/5">
                <div className="text-lg font-black" style={{ color: s.c }}>{s.v}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>

          {/* Filtreler */}
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'all',      label: `Tümü (${stats.total})` },
              { id: 'unread',   label: `Okunmadı (${stats.unread})` },
              { id: 'critical', label: `Kritik (${stats.critical})` },
              { id: 'fixed',    label: `Düzeltildi (${stats.fixed})` },
            ].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${filter === f.id ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                {f.label}
              </button>
            ))}
            <button onClick={load} className="ml-auto px-3 py-1.5 text-xs text-gray-500 hover:text-white transition-all">↻ Yenile</button>
          </div>
        </div>
      </div>

      {/* Bildirim Listesi */}
      <div className="max-w-3xl mx-auto px-4 pt-4 space-y-3">
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔔</div>
            <p className="text-gray-500">Bildirim yok</p>
          </div>
        )}

        {filtered.map(notif => {
          const isUnread = !notif.readBy.includes(userName)
          const sc = SEV_COLOR(notif.severity)

          return (
            <div key={notif.id}
              onClick={() => isUnread && handleRead(notif.id)}
              className={`rounded-2xl border transition-all cursor-pointer ${
                notif.fixed ? 'bg-green-500/5 border-green-500/20' :
                isUnread ? 'bg-[#0d1630] border-gold-500/20 shadow-[0_0_20px_rgba(201,168,76,0.08)]' :
                'bg-[#0d1630] border-white/5 opacity-70'
              }`}>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Severity dot */}
                  <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5" style={{ background: sc, boxShadow: `0 0 8px ${sc}60` }} />

                  <div className="flex-1 min-w-0">
                    {/* Başlık satırı */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-sm font-bold ${notif.fixed ? 'text-green-400' : 'text-white'}`}>{notif.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: sc + '20', color: sc }}>{SEV_LABEL(notif.severity)}</span>
                      {notif.fixed && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">✓ Düzeltildi</span>}
                      {isUnread && !notif.fixed && <span className="text-[10px] bg-gold-500/20 text-gold-400 px-2 py-0.5 rounded-full font-bold">Yeni</span>}
                    </div>

                    {/* Mesaj */}
                    <p className="text-sm text-gray-300 mb-2">{notif.message}</p>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                      {notif.jobNo !== '—' && <span>📋 {notif.jobNo}</span>}
                      {notif.reportNo !== '—' && <span>📄 {notif.reportNo}</span>}
                      <span>👤 {notif.operator}</span>
                      <span>🕐 {notif.date} {notif.time}</span>
                    </div>

                    {/* Hata listesi */}
                    {notif.issues?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {notif.issues.map((issue, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full border"
                            style={{ borderColor: SEV_COLOR(issue.severity) + '40', color: SEV_COLOR(issue.severity) }}>
                            {issue.label}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Düzeltildi bilgisi */}
                    {notif.fixed && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        <p className="text-xs text-green-400">Düzelten: <strong>{notif.fixedBy}</strong> · {notif.fixedAt}</p>
                      </div>
                    )}

                    {/* Okuyanlar */}
                    {notif.readBy.length > 0 && (
                      <p className="text-[10px] text-gray-600 mt-1">Okudu: {notif.readBy.join(', ')}</p>
                    )}
                  </div>

                  {/* Fotoğraf thumbnail */}
                  {notif.imageThumb && (
                    <img src={notif.imageThumb} alt="" className="w-16 h-12 object-cover rounded-lg flex-shrink-0 opacity-70" />
                  )}
                </div>
              </div>

              {/* Düzeltildi butonu */}
              {!notif.fixed && (
                <div className="px-4 pb-4">
                  <button
                    onClick={e => { e.stopPropagation(); setFixModal(notif.id); setFixerName(userName) }}
                    className="text-xs bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 px-4 py-2 rounded-lg transition-all font-semibold">
                    Düzeltildi Olarak İşaretle →
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Firebase kurulmamışsa banner */}
      {!isFirebaseConfigured() && !loading && (
        <div className="max-w-3xl mx-auto px-4 mt-6">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 text-center">
            <p className="text-blue-300 font-semibold text-sm mb-2">📡 Cross-Device Bildirimi Kur</p>
            <p className="text-gray-400 text-xs mb-4">Şu an sadece bu cihazda çalışıyor. Firebase bağlarsan tüm şirket telefonları anlık senkronize olur.</p>
            <button onClick={() => setShowSetup(true)}
              className="bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 text-blue-300 font-bold px-6 py-2.5 rounded-xl text-sm transition-all">
              Firebase Kurulumunu Başlat (5 dakika)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
