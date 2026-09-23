/* ════════════════════════════════════════════════════════
   AluSight BİLDİRİM SERVİSİ
   Firebase Realtime Database + BroadcastChannel + Browser Push
   ════════════════════════════════════════════════════════ */

const LOCAL_KEY   = 'AluSight_notifications'
const CONFIG_KEY  = 'AluSight_firebase_cfg'
const SOUND_KEY   = 'AluSight_notif_sound'

/* ─── LocalStorage helpers ─────────────────────────────── */
const ls = {
  get: (k, def = null) => { try { return JSON.parse(localStorage.getItem(k) ?? 'null') ?? def } catch { return def } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
}

/* ─── BroadcastChannel (aynı cihaz, farklı sekmeler) ───── */
let _channel = null
function getChannel() {
  if (!_channel && typeof BroadcastChannel !== 'undefined') {
    try { _channel = new BroadcastChannel('AluSight_notifications') } catch {}
  }
  return _channel
}

/* ─── Firebase REST API ─────────────────────────────────── */
function getFirebaseUrl() {
  const cfg = ls.get(CONFIG_KEY, {})
  return cfg.url ? cfg.url.replace(/\/$/, '') : null
}

async function firebasePush(data) {
  const url = getFirebaseUrl()
  if (!url) return null
  try {
    const res = await fetch(`${url}/AluSight_notifications.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) { const d = await res.json(); return d.name }
  } catch {}
  return null
}

async function firebaseFetch() {
  const url = getFirebaseUrl()
  if (!url) return {}
  try {
    const res = await fetch(`${url}/AluSight_notifications.json?orderBy="$key"&limitToLast=50`)
    if (res.ok) return await res.json() ?? {}
  } catch {}
  return {}
}

async function firebasePatch(firebaseKey, data) {
  const url = getFirebaseUrl()
  if (!url || !firebaseKey) return
  try {
    await fetch(`${url}/AluSight_notifications/${firebaseKey}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  } catch {}
}

/* ─── Browser Push Notification ────────────────────────── */
export async function requestPushPermission() {
  if (!('Notification' in window)) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  const p = await Notification.requestPermission()
  return p
}

function showBrowserNotification(notif) {
  if (Notification.permission !== 'granted') return
  try {
    const n = new Notification('🔧 AluSight Fabrikasyon Uyarı', {
      body: notif.message,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: notif.id,
      requireInteraction: notif.severity === 'high',
    })
    n.onclick = () => { window.focus(); n.close() }
  } catch {}
}

/* ─── Sesli Uyarı (Web Audio API) ─────────────────────── */
export function playAlertSound(severity = 'high') {
  const enabled = ls.get(SOUND_KEY, true)
  if (!enabled) return
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const beeps = severity === 'high' ? 3 : severity === 'medium' ? 2 : 1
    const freq  = severity === 'high' ? 880 : severity === 'medium' ? 660 : 440

    for (let i = 0; i < beeps; i++) {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'sine'
      const t = ctx.currentTime + i * 0.25
      gain.gain.setValueAtTime(0.3, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
      osc.start(t); osc.stop(t + 0.2)
    }
  } catch {}
}

export function setSoundEnabled(v) { ls.set(SOUND_KEY, v) }
export function getSoundEnabled()  { return ls.get(SOUND_KEY, true) }

/* ─── Ana: Bildirim Gönder ─────────────────────────────── */
export async function sendNotification({ type, severity, title, message, jobNo, reportNo, operator, issues = [], imageThumb = null }) {
  const entry = {
    id:          `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type:        type || 'quality_alert',
    severity:    severity || 'medium',
    title:       title || 'Kalite Uyarısı',
    message:     message || '',
    jobNo:       jobNo || '—',
    reportNo:    reportNo || '—',
    operator:    operator || '—',
    issues:      issues,
    imageThumb:  imageThumb || null,
    timestamp:   new Date().toISOString(),
    date:        new Date().toLocaleDateString('tr-TR'),
    time:        new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    readBy:      [],
    fixed:       false,
    fixedBy:     null,
    fixedAt:     null,
    firebaseKey: null,
  }

  /* 1. Yerel depo */
  const local = ls.get(LOCAL_KEY, [])
  ls.set(LOCAL_KEY, [entry, ...local].slice(0, 200))

  /* 2. Aynı cihazdaki diğer sekmeler */
  getChannel()?.postMessage({ type: 'new', data: entry })

  /* 3. Browser Push */
  showBrowserNotification(entry)

  /* 4. Sesli uyarı */
  playAlertSound(severity)

  /* 5. Firebase (cross-device) */
  const fbKey = await firebasePush(entry)
  if (fbKey) {
    entry.firebaseKey = fbKey
    const local2 = ls.get(LOCAL_KEY, [])
    const idx = local2.findIndex(n => n.id === entry.id)
    if (idx >= 0) { local2[idx] = entry; ls.set(LOCAL_KEY, local2) }
  }

  return entry
}

/* ─── Bildirimleri Getir (Local + Firebase merge) ───────── */
export async function fetchNotifications() {
  const local = ls.get(LOCAL_KEY, [])

  const fbData = await firebaseFetch()
  const fbList = Object.entries(fbData || {}).map(([key, val]) => ({ ...val, firebaseKey: key }))

  /* Merge: Firebase öncelikli, local'deki id'leri güncelle */
  const merged = [...local]
  fbList.forEach(fb => {
    const idx = merged.findIndex(l => l.id === fb.id || l.firebaseKey === fb.firebaseKey)
    if (idx >= 0) merged[idx] = { ...merged[idx], ...fb }
    else merged.push(fb)
  })

  merged.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  const top = merged.slice(0, 200)
  ls.set(LOCAL_KEY, top)
  return top
}

/* ─── Okundu İşaretle ───────────────────────────────────── */
export async function markAsRead(notifId, userName = 'kullanıcı') {
  const local = ls.get(LOCAL_KEY, [])
  const idx = local.findIndex(n => n.id === notifId)
  if (idx < 0) return

  if (!local[idx].readBy.includes(userName)) {
    local[idx].readBy.push(userName)
    ls.set(LOCAL_KEY, local)
    if (local[idx].firebaseKey) {
      await firebasePatch(local[idx].firebaseKey, { readBy: local[idx].readBy })
    }
    getChannel()?.postMessage({ type: 'read', id: notifId, by: userName })
  }
}

/* ─── Düzeltildi İşaretle ──────────────────────────────── */
export async function markAsFixed(notifId, fixerName) {
  const local = ls.get(LOCAL_KEY, [])
  const idx = local.findIndex(n => n.id === notifId)
  if (idx < 0) return

  const fix = { fixed: true, fixedBy: fixerName, fixedAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) }
  local[idx] = { ...local[idx], ...fix }
  ls.set(LOCAL_KEY, local)

  if (local[idx].firebaseKey) {
    await firebasePatch(local[idx].firebaseKey, fix)
  }
  getChannel()?.postMessage({ type: 'fixed', id: notifId, ...fix })
}

/* ─── BroadcastChannel Dinle ────────────────────────────── */
export function listenNotifications(callback) {
  const ch = getChannel()
  if (!ch) return () => {}
  const handler = (e) => callback(e.data)
  ch.addEventListener('message', handler)
  return () => ch.removeEventListener('message', handler)
}

/* ─── Firebase Yapılandırması ───────────────────────────── */
export function getFirebaseConfig()         { return ls.get(CONFIG_KEY, { url: '' }) }
export function saveFirebaseConfig(cfg)     { ls.set(CONFIG_KEY, cfg) }
export function isFirebaseConfigured()      { return !!getFirebaseUrl() }

/* ─── Yerel Bildirimleri Temizle ────────────────────────── */
export function clearLocalNotifications()   { ls.set(LOCAL_KEY, []) }
export function getLocalNotifications()     { return ls.get(LOCAL_KEY, []) }

/* ─── Okunmamış sayısı ─────────────────────────────────── */
export function getUnreadCount(userName = '') {
  const notifs = ls.get(LOCAL_KEY, [])
  return notifs.filter(n => !n.readBy.includes(userName) && !n.fixed).length
}
