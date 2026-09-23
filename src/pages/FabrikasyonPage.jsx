import { useState, useRef, useEffect, useCallback } from 'react'
import { sendNotification, getUnreadCount, playAlertSound } from '../utils/notificationService'

const isNative = typeof window !== 'undefined' && !!window?.Capacitor?.isNativePlatform?.()

async function takePhotoNative() {
  const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera')
  const photo = await Camera.getPhoto({
    quality: 80,
    allowEditing: false,
    resultType: CameraResultType.Base64,
    source: CameraSource.Camera,
  })
  return photo.base64String
}

const PROJECTS_KEY = 'AluSight_fab_projects'
const HISTORY_KEY = 'AluSight_fab_history'
const FIXES_KEY   = 'AluSight_fab_fixes'
const API_KEY_LS  = 'AluSight_anthropic_key'
const loadLS = (k, d) => { try { return JSON.parse(localStorage.getItem(k) ?? 'null') ?? d } catch { return d } }
const saveLS = (k, v) => localStorage.setItem(k, JSON.stringify(v))
const getApiKey = () => import.meta.env.VITE_ANTHROPIC_KEY || localStorage.getItem(API_KEY_LS) || ''
const SEV_COLOR = s => s === 'high' ? '#ef4444' : s === 'medium' ? '#f59e0b' : '#10b981'
const SEV_LABEL = s => s === 'high' ? 'Kritik' : s === 'medium' ? 'Orta' : 'Düşük'
const STS_CLS   = s => s === 'BAŞARISIZ' ? 'text-red-400' : s === 'DİKKAT' ? 'text-yellow-400' : 'text-green-400'

async function makeThumb(b64, px = 120) {
  return new Promise(r => {
    const img = new Image()
    img.onload = () => {
      const k = Math.min(px / img.width, px / img.height, 1)
      const c = document.createElement('canvas'); c.width = img.width * k; c.height = img.height * k
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
      r(c.toDataURL('image/jpeg', 0.5))
    }
    img.onerror = () => r(null); img.src = b64
  })
}

async function analyzeImages(imageList, jobNo) {
  const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY || ''
  const prompt = `Sen alüminyum doğrama, pencere, kapı veya giydirme cephe imalat kalite kontrol uzmanısın.

ÖNCE görüntünün alüminyum doğrama/profil/pencere/kapı/cephe sistemi içerip içermediğini kontrol et.
Eğer görüntüde alüminyum doğrama, profil, pencere, kapı veya cephe sistemi YOKSA:
{"hasIssues":false,"issues":[],"overallStatus":"GEÇERSİZ","summary":"Bu görüntü alüminyum doğrama veya imalat içermiyor. Lütfen doğrama/profil fotoğrafı yükleyin.","qualityScore":null,"invalidImage":true}

Eğer alüminyum imalat görüntüsü ise: profil kesimi, conta, cam takma, vida, köşe birleşimi, kanat montajı, drenaj, yüzey hasarı, termal köprü hatalarını ara.
İş Emri: ${jobNo || 'Belirtilmedi'}

SADECE JSON döndür (başka hiçbir şey yazma, markdown kullanma):
{"hasIssues":true/false,"issues":[{"id":"uid","label":"Hata adı (max 4 kelime)","description":"Açıklama (max 15 kelime)","severity":"high/medium/low","xPercent":0-90,"yPercent":0-90,"wPercent":5-30,"hPercent":5-30}],"overallStatus":"GEÇTİ veya DİKKAT veya BAŞARISIZ","summary":"2 cümle Türkçe özet","qualityScore":0-100}`

  const parts = [
    { text: prompt },
    ...imageList.map(b64 => ({
      inline_data: { mime_type: 'image/jpeg', data: b64.startsWith('data:') ? b64.split(',')[1] : b64 }
    }))
  ]

  // 2 deneme yap (high demand durumunda retry)
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] })
      }
    )
    if (res.status === 503 && attempt === 0) {
      await new Promise(r => setTimeout(r, 3000))
      continue
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error?.message || `HTTP ${res.status}`)
    }
    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const m = text.match(/\{[\s\S]*\}/)
    if (m) return JSON.parse(m[0])
    throw new Error('Yanıt ayrıştırılamadı')
  }
  throw new Error('Sunucu yoğun, lütfen tekrar deneyin')
}

function generateReport(result, image, jobNo, operator) {
  const rNo  = `OZZ-FAB-${Date.now().toString().slice(-6)}`
  const date = new Date().toLocaleDateString('tr-TR')
  const time = new Date().toLocaleTimeString('tr-TR')
  const iss  = result?.issues || []
  const sc   = result?.overallStatus === 'BAŞARISIZ' ? '#ef4444' : result?.overallStatus === 'DİKKAT' ? '#f59e0b' : '#10b981'
  const qs   = result?.qualityScore ?? null
  const rows = iss.map(i => `<tr style="border-bottom:1px solid #eee"><td style="padding:8px;font-size:12px">${i.label}</td><td style="padding:8px;font-size:12px">${i.description}</td><td style="padding:8px;text-align:center"><span style="background:${SEV_COLOR(i.severity)};color:#fff;padding:2px 8px;border-radius:4px;font-size:11px">${SEV_LABEL(i.severity)}</span></td></tr>`).join('')
  const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>AluSight Raporu ${rNo}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;padding:40px;color:#111}.hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #c9a84c;padding-bottom:20px;margin-bottom:24px}.logo{font-size:26px;font-weight:800;letter-spacing:0.1em}.sub{font-size:10px;letter-spacing:0.2em;color:#888;margin-top:2px}.sec{margin-bottom:20px}.st{font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#888;border-bottom:1px solid #eee;padding-bottom:6px;margin-bottom:12px}.meta{display:grid;grid-template-columns:1fr 1fr;gap:8px}.mi{background:#f8f8f8;padding:10px 14px;border-radius:4px}.ml{font-size:10px;color:#999;text-transform:uppercase}.mv{font-size:13px;font-weight:600;color:#111;margin-top:2px}table{width:100%;border-collapse:collapse}th{background:#f8f8f8;padding:8px;font-size:11px;text-align:left;font-weight:700;color:#555;text-transform:uppercase}.photo{border:1px solid #ddd;border-radius:6px;overflow:hidden;max-height:280px;text-align:center;background:#f0f0f0}.photo img{max-width:100%;max-height:280px;object-fit:contain}.smry{background:#f8f8f8;border-left:4px solid #c9a84c;padding:12px 16px;font-size:13px;line-height:1.7;color:#333}.signs{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-top:40px}.sign{border-top:1px solid #ccc;padding-top:8px;text-align:center;font-size:10px;color:#999;text-transform:uppercase}.ft{margin-top:24px;border-top:1px solid #eee;padding-top:10px;font-size:10px;color:#aaa;text-align:center}</style></head>
<body><div class="hdr"><div><div class="logo">AluSight</div><div class="sub">ALÜMINYUM</div></div><div style="text-align:center"><div style="font-size:15px;font-weight:700">KALİTE KONTROL RAPORU</div></div><div style="text-align:right;font-size:11px;color:#555;line-height:1.8"><div><strong>Rapor No:</strong> ${rNo}</div><div><strong>Tarih:</strong> ${date}</div><div><strong>Saat:</strong> ${time}</div></div></div>
<div class="sec" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px"><div style="border:2px solid ${sc};padding:8px 20px;border-radius:6px;display:inline-block"><div style="font-size:10px;color:#888;text-transform:uppercase;margin-bottom:2px">Genel Durum</div><div style="font-size:20px;font-weight:800;color:${sc}">${result?.overallStatus === 'GEÇTİ' ? '✓ GEÇTİ' : result?.overallStatus === 'DİKKAT' ? '⚠ DİKKAT' : '✗ BAŞARISIZ'}</div></div>${qs != null ? `<div style="text-align:right"><div style="font-size:11px;color:#999">Kalite Skoru</div><div style="font-size:28px;font-weight:800;color:${qs >= 80 ? '#10b981' : qs >= 50 ? '#f59e0b' : '#ef4444'}">${qs}/100</div></div>` : ''}</div>
<div class="sec"><div class="st">Denetim Bilgileri</div><div class="meta"><div class="mi"><div class="ml">İş Emri No</div><div class="mv">${jobNo || '—'}</div></div><div class="mi"><div class="ml">Denetçi</div><div class="mv">${operator || '—'}</div></div><div class="mi"><div class="ml">Tarih / Saat</div><div class="mv">${date} ${time}</div></div><div class="mi"><div class="ml">Yöntem</div><div class="mv">AluSight Görsel Analiz</div></div></div></div>
${image ? `<div class="sec"><div class="st">Kontrol Fotoğrafı</div><div class="photo"><img src="${image}" alt=""/></div></div>` : ''}
${result?.summary ? `<div class="sec"><div class="st">Değerlendirme Özeti</div><div class="smry">${result.summary}</div></div>` : ''}
<div class="sec"><div class="st">Tespit Edilen Sorunlar (${iss.length})</div>${iss.length === 0 ? '<div style="text-align:center;padding:16px;color:#10b981;font-weight:700">✓ Sorun tespit edilmedi</div>' : `<table><thead><tr><th>Sorun</th><th>Açıklama</th><th style="text-align:center">Öncelik</th></tr></thead><tbody>${rows}</tbody></table>`}</div>
<div class="signs"><div class="sign">Kalite Kontrolcü</div><div class="sign">Üretim Sorumlusu</div><div class="sign">Onay</div></div>
<div class="ft">AluSight — ${rNo} — ${date}</div></body></html>`
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = `alusight-Raporu-${rNo}.html`; a.click()
  URL.revokeObjectURL(url)
  return rNo
}

export default function FabrikasyonPage() {
  const [projects,     setProjects]     = useState(() => loadLS(PROJECTS_KEY, []))
  const [activeProject,setActiveProject]= useState(null)   // seçili proje objesi
  const [projectView,  setProjectView]  = useState('list') // 'list' | 'detail' | 'new'
  const [newProjName,  setNewProjName]  = useState('')
  const [newProjDesc,  setNewProjDesc]  = useState('')
  const [mode,         setMode]         = useState('idle')
  const [inputMode,    setInputMode]    = useState('camera')
  const [batchMode,    setBatchMode]    = useState(false)
  const [analyzing,    setAnalyzing]    = useState(false)
  const [analyzeCount, setAnalyzeCount] = useState(0)
  const [issues,       setIssues]       = useState([])
  const [lastResult,   setLastResult]   = useState(null)
  const [capturedImg,  setCapturedImg]  = useState(null)
  const [batchImgs,    setBatchImgs]    = useState([])
  const [jobNo,        setJobNo]        = useState('')
  const [operator,     setOperator]     = useState('')
  const [showJob,      setShowJob]      = useState(false)
  const [history,      setHistory]      = useState(() => loadLS(HISTORY_KEY, []))
  const [fixes,        setFixes]        = useState(() => loadLS(FIXES_KEY, {}))
  const [fixModal,     setFixModal]     = useState(null)
  const [fixerName,    setFixerName]    = useState('')
  const [notifSent,    setNotifSent]    = useState(false)
  const [pending,      setPending]      = useState(false)
  const [unread,       setUnread]       = useState(0)
  const [analysisErr,  setAnalysisErr]  = useState(null)
  const [showApiKey,   setShowApiKey]   = useState(false)
  const [apiKeyInput,  setApiKeyInput]  = useState('')
  const [demoToast,    setDemoToast]    = useState(null)
  const [demoRunning,  setDemoRunning]  = useState(false)

  const videoRef   = useRef(null)
  const canvasRef  = useRef(null)
  const streamRef  = useRef(null)
  const timerRef   = useRef(null)
  const busyRef    = useRef(false)
  const fileRef    = useRef(null)
  const batchRef   = useRef(null)

  useEffect(() => {
    const t = setInterval(() => setUnread(getUnreadCount(operator || '')), 4000)
    setUnread(getUnreadCount(operator || ''))
    return () => clearInterval(t)
  }, [operator])

  const startCam = useCallback(async () => {
    if (isNative) {
      // Native Android: Capacitor Camera ile tek fotoğraf çek
      try {
        const b64 = await takePhotoNative()
        if (b64) {
          const dataUrl = `data:image/jpeg;base64,${b64}`
          setCapturedImg(dataUrl)
          setMode('scanning')
          setIssues([]); setLastResult(null); setAnalyzeCount(0); setNotifSent(false)
          // Hemen analiz et
          setAnalyzing(true)
          try {
            const r = await analyzeImages([b64], jobNo)
            setIssues(r.issues || []); setLastResult(r); setAnalyzeCount(1)
            if (r.issues?.some(i => i.severity === 'high')) playAlertSound('high')
          } catch {}
          setAnalyzing(false)
        }
      } catch (e) { alert('Kamera hatası: ' + e.message) }
    } else {
      // Web: getUserMedia
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } } })
        streamRef.current = s
        if (videoRef.current) videoRef.current.srcObject = s
        setMode('scanning'); setIssues([]); setLastResult(null); setAnalyzeCount(0); setNotifSent(false)
      } catch (e) { alert('Kamera açılamadı: ' + e.message) }
    }
  }, [jobNo])

  const stopCam = useCallback(() => {
    clearInterval(timerRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop()); streamRef.current = null
    setMode('idle'); setIssues([]); setAnalyzing(false); busyRef.current = false
  }, [])

  useEffect(() => {
    if (mode !== 'scanning' || inputMode !== 'camera') return
    const run = async () => {
      if (!videoRef.current?.videoWidth || busyRef.current) return
      const cv = canvasRef.current, vid = videoRef.current
      cv.width = vid.videoWidth; cv.height = vid.videoHeight
      cv.getContext('2d').drawImage(vid, 0, 0)
      const b64 = cv.toDataURL('image/jpeg', 0.75).split(',')[1]
      busyRef.current = true; setAnalyzing(true)
      try {
        const r = await analyzeImages([b64], jobNo)
        setIssues(r.issues || []); setLastResult(r); setAnalyzeCount(c => c + 1)
        if (r.issues?.some(i => i.severity === 'high')) playAlertSound('high')
      } catch {}
      busyRef.current = false; setAnalyzing(false)
    }
    timerRef.current = setInterval(run, 3500)
    return () => clearInterval(timerRef.current)
  }, [mode, inputMode, jobNo])

  useEffect(() => {
    if (!pending || showJob) return
    setPending(false)
    if (batchMode) { batchRef.current?.click(); return }
    if (inputMode === 'camera') startCam()
    else fileRef.current?.click()
  }, [pending, showJob, inputMode, batchMode, startCam])

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    clearInterval(timerRef.current)
    const v = videoRef.current, c = canvasRef.current
    c.width = v.videoWidth || 640; c.height = v.videoHeight || 480
    c.getContext('2d').drawImage(v, 0, 0)
    const url = c.toDataURL('image/jpeg', 0.9)
    setCapturedImg(url); streamRef.current?.getTracks().forEach(t => t.stop()); streamRef.current = null
    setMode('result'); addHistory(url)
  }

  const handleFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return; e.target.value = ''
    const r = new FileReader()
    r.onload = async ev => {
      const url = ev.target.result
      setCapturedImg(url); setMode('result'); setAnalyzing(true); setNotifSent(false); setAnalysisErr(null)
      if (!getApiKey()) {
        setAnalysisErr('api_key')
        setAnalyzing(false); return
      }
      try {
        const res = await analyzeImages([url.split(',')[1]], jobNo)
        setIssues(res.issues || []); setLastResult(res); addHistory(url, res)
        if (res.issues?.some(i => i.severity === 'high')) playAlertSound('high')
      } catch (e) { setAnalysisErr(e.message) }
      setAnalyzing(false)
    }
    r.readAsDataURL(f)
  }

  const handleBatch = (e) => {
    const files = Array.from(e.target.files || []); if (!files.length) return; e.target.value = ''
    setAnalyzing(true); setMode('result'); setNotifSent(false)
    Promise.all(files.map(f => new Promise(res => { const r = new FileReader(); r.onload = ev => res(ev.target.result); r.readAsDataURL(f) })))
      .then(async urls => {
        setBatchImgs(urls); setCapturedImg(urls[0])
        try {
          const res = await analyzeImages(urls.map(u => u.split(',')[1]), jobNo)
          setIssues(res.issues || []); setLastResult(res); addHistory(urls[0], res)
          if (res.issues?.some(i => i.severity === 'high')) playAlertSound('high')
        } catch (e) { alert('Toplu analiz hatası: ' + e.message) }
        setAnalyzing(false)
      })
  }

  const addHistory = (img, result = lastResult) => {
    const e = { id: Date.now(), date: new Date().toLocaleDateString('tr-TR'), time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }), jobNo: jobNo || '—', operator: operator || '—', status: result?.overallStatus || '—', issueCount: (result?.issues || []).length, qualityScore: result?.qualityScore ?? null, thumbnail: img, projectId: activeProject?.id || null, projectName: activeProject?.name || null }
    const u = [e, ...loadLS(HISTORY_KEY, [])].slice(0, 100)
    saveLS(HISTORY_KEY, u); setHistory(u)
    // Projeye de ekle
    if (activeProject) {
      const updProjects = projects.map(p => p.id === activeProject.id
        ? { ...p, scans: [e, ...(p.scans || [])].slice(0, 50), lastScan: e.date, status: result?.overallStatus === 'BAŞARISIZ' ? 'sorunlu' : result?.overallStatus === 'DİKKAT' ? 'dikkat' : p.status }
        : p)
      saveLS(PROJECTS_KEY, updProjects); setProjects(updProjects)
      setActiveProject(updProjects.find(p => p.id === activeProject.id))
    }
  }

  const sendInternalNotif = async () => {
    if (!lastResult) return
    const thumb = capturedImg ? await makeThumb(capturedImg) : null
    const rNo = generateReport(lastResult, capturedImg, jobNo, operator)
    const sev = lastResult.issues?.some(i => i.severity === 'high') ? 'high' : lastResult.issues?.length ? 'medium' : 'low'
    const emoji = lastResult.overallStatus === 'BAŞARISIZ' ? '❌' : lastResult.overallStatus === 'DİKKAT' ? '⚠️' : '✅'
    await sendNotification({ type: 'quality_alert', severity: sev, title: `${emoji} Fabrikasyon Kontrol — ${lastResult.overallStatus}`, message: lastResult.summary || `${lastResult.issues?.length || 0} sorun tespit edildi.`, jobNo, reportNo: rNo, operator: operator || 'Bilinmiyor', issues: lastResult.issues || [], imageThumb: thumb })
    setNotifSent(true); setUnread(c => c + 1)
  }

  const confirmFix = () => {
    if (!fixModal || !fixerName.trim()) return
    const u = { ...fixes, [fixModal]: { fixedBy: fixerName.trim(), fixedAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) } }
    saveLS(FIXES_KEY, u); setFixes(u); setFixModal(null); setFixerName('')
  }

  const rescan = () => { setCapturedImg(null); setBatchImgs([]); setIssues([]); setLastResult(null); setNotifSent(false); setMode('idle') }

  const histStats = { total: history.length, pass: history.filter(h => h.status === 'GEÇTİ').length, warn: history.filter(h => h.status === 'DİKKAT').length, fail: history.filter(h => h.status === 'BAŞARISIZ').length, avgScore: (() => { const s = history.filter(h => h.qualityScore != null); return s.length ? Math.round(s.reduce((a, b) => a + b.qualityScore, 0) / s.length) : null })() }

  /* ── MODAL ── */
  const JobModal = () => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-[#0d1630] border border-gold-500/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-lg font-bold mb-1 text-white">Tarama Bilgileri</h3>
        <p className="text-xs text-gray-400 mb-5">İsteğe bağlı — raporda görünecek</p>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">İş Emri No</label>
            <input defaultValue={jobNo} onBlur={e => setJobNo(e.target.value)} placeholder="IE-2025-0042" className="w-full bg-[#1a2444] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-gold-500/40" />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Denetçi Adı</label>
            <input defaultValue={operator} onBlur={e => setOperator(e.target.value)} placeholder="Adınız" className="w-full bg-[#1a2444] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-gold-500/40" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={() => { setShowJob(false); setPending(true) }} className="flex-1 bg-gold-500 hover:bg-gold-400 text-black font-bold py-3 rounded-xl transition-all">Başlat</button>
          <button onClick={() => setShowJob(false)} className="bg-[#1a2444] px-5 rounded-xl text-gray-400 text-sm">İptal</button>
        </div>
      </div>
    </div>
  )

  /* ── STATS ── */
  if (mode === 'stats') return (
    <div className="min-h-screen bg-[#070d1f] text-white pb-20">
      <div className="bg-[#0d1630] pt-28 pb-5 px-4 border-b border-white/10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Kalite İstatistikleri</h1>
          <button onClick={() => setMode('idle')} className="flex items-center gap-1.5 text-gold-400 text-sm font-semibold hover:text-gold-300 transition-colors px-3 py-1.5 bg-gold-500/10 rounded-lg">← Geri</button>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[{ l: 'Toplam', v: histStats.total, c: '#c9a84c', i: '📊' }, { l: 'Geçti', v: histStats.pass, c: '#10b981', i: '✅' }, { l: 'Dikkat', v: histStats.warn, c: '#f59e0b', i: '⚠️' }, { l: 'Başarısız', v: histStats.fail, c: '#ef4444', i: '❌' }].map(s => (
            <div key={s.l} className="bg-[#0d1630] rounded-2xl p-5 border border-white/5">
              <div className="text-2xl mb-2">{s.i}</div>
              <div className="text-2xl font-black" style={{ color: s.c }}>{s.v}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
        {histStats.avgScore !== null && (
          <div className="bg-[#0d1630] rounded-2xl p-5 border border-white/5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Ortalama Kalite Skoru</p>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-black" style={{ color: histStats.avgScore >= 80 ? '#10b981' : histStats.avgScore >= 50 ? '#f59e0b' : '#ef4444' }}>{histStats.avgScore}<span className="text-lg text-gray-500">/100</span></div>
              <div className="flex-1">
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${histStats.avgScore}%`, background: histStats.avgScore >= 80 ? '#10b981' : histStats.avgScore >= 50 ? '#f59e0b' : '#ef4444' }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{histStats.avgScore >= 80 ? 'İyi kalite' : histStats.avgScore >= 50 ? 'Orta kalite' : 'Düşük kalite'}</p>
              </div>
            </div>
          </div>
        )}
        <div className="bg-[#0d1630] rounded-2xl p-5 border border-white/5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Son 10 Tarama (Grafik)</p>
          <div className="flex items-end gap-1.5 h-20">
            {history.slice(0, 10).reverse().map((h, i) => {
              const col = h.status === 'GEÇTİ' ? '#10b981' : h.status === 'DİKKAT' ? '#f59e0b' : '#ef4444'
              const ht = h.qualityScore != null ? h.qualityScore : h.status === 'GEÇTİ' ? 100 : h.status === 'DİKKAT' ? 50 : 20
              return <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${ht}%`, background: col, minHeight: 4 }} title={`${h.date} · ${h.status}`} />
            })}
          </div>
          {history.length === 0 && <p className="text-gray-600 text-xs text-center py-4">Henüz veri yok</p>}
        </div>
        <div className="bg-[#0d1630] rounded-2xl p-5 border border-white/5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Son Taramalar</p>
          {history.slice(0, 8).map(h => (
            <div key={h.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
              {h.thumbnail && <img src={h.thumbnail} alt="" className="w-10 h-8 object-cover rounded flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${h.status === 'BAŞARISIZ' ? 'text-red-400' : h.status === 'DİKKAT' ? 'text-yellow-400' : 'text-green-400'}`}>{h.status}</span>
                  {h.qualityScore != null && <span className="text-xs text-gold-400/70">{h.qualityScore}/100</span>}
                  {h.jobNo !== '—' && <span className="text-xs text-gray-500">{h.jobNo}</span>}
                </div>
                <p className="text-xs text-gray-500">{h.date} · {h.operator} · {h.issueCount} sorun</p>
              </div>
            </div>
          ))}
          {history.length === 0 && <p className="text-gray-600 text-xs text-center py-4">Henüz veri yok</p>}
        </div>
      </div>
    </div>
  )

  /* ── GEÇMİŞ ── */
  if (mode === 'history') return (
    <div className="min-h-screen bg-[#070d1f] text-white pb-20">
      <div className="bg-[#0d1630] pt-10 pb-5 px-4 border-b border-white/10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div><h1 className="text-xl font-bold">Tarama Geçmişi</h1><p className="text-xs text-gray-400 mt-0.5">{history.length} kayıt</p></div>
          <button onClick={() => setMode('idle')} className="text-gold-400 text-sm">← Geri</button>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 pt-5">
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[{ l: 'Toplam', v: histStats.total, c: '#c9a84c' }, { l: 'Geçti', v: histStats.pass, c: '#10b981' }, { l: 'Dikkat', v: histStats.warn, c: '#f59e0b' }, { l: 'Başarısız', v: histStats.fail, c: '#ef4444' }].map(s => (
            <div key={s.l} className="bg-[#0d1630] rounded-xl p-3 text-center border border-white/5">
              <div className="text-xl font-black" style={{ color: s.c }}>{s.v}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
        {history.length === 0 ? <p className="text-center text-gray-500 py-10">Henüz tarama yapılmadı</p>
          : <div className="space-y-2">{history.map(h => (
            <div key={h.id} className="bg-[#0d1630] rounded-xl p-3 border border-white/5 flex items-center gap-3">
              {h.thumbnail && <img src={h.thumbnail} alt="" className="w-14 h-10 object-cover rounded-lg flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-sm font-bold ${h.status === 'BAŞARISIZ' ? 'text-red-400' : h.status === 'DİKKAT' ? 'text-yellow-400' : 'text-green-400'}`}>{h.status}</span>
                  {h.jobNo !== '—' && <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">{h.jobNo}</span>}
                  {h.qualityScore != null && <span className="text-xs text-gold-400/70">{h.qualityScore}/100</span>}
                </div>
                <p className="text-xs text-gray-400">{h.date} {h.time} · {h.operator} · {h.issueCount} sorun</p>
              </div>
            </div>
          ))}</div>}
        {history.length > 0 && <button onClick={() => { saveLS(HISTORY_KEY, []); setHistory([]) }} className="mt-4 w-full text-xs text-red-400/50 hover:text-red-400 py-2">Geçmişi Temizle</button>}
      </div>
    </div>
  )

  /* ── DEMO SİMÜLASYONU ── */
  const runDemo = async () => {
    if (demoRunning) return
    setDemoRunning(true)
    const steps = [
      { delay: 0,    phase: 'capture',  msg: '📸 Atölyeden fotoğraf çekildi...', detail: 'İş Emri: IE-2024-042 · Profil: HiFinity Sürme' },
      { delay: 1800, phase: 'upload',   msg: '☁️ Sunucuya yükleniyor...', detail: 'AluSight analiz sistemine gönderiliyor' },
      { delay: 3200, phase: 'analyze',  msg: '🔍 Analiz ediliyor...', detail: 'AI kalite kontrol motoru çalışıyor' },
      { delay: 5000, phase: 'issue',    msg: '⚠️ Hata tespit edildi!', detail: 'Mastik eksikliği — Alt sürme rayında dolgu yapılmamış', severity: 'high' },
      { delay: 6200, phase: 'notify',   msg: '📲 Bildirim gönderildi!', detail: 'Usta Ahmet\'e WhatsApp bildirimi iletildi: +90 535 861 0404', severity: 'high' },
      { delay: 8500, phase: 'fix',      msg: '✅ Düzeltme onaylandı', detail: 'Usta Ahmet hatayı düzeltti ve sisteme giriş yaptı', severity: 'ok' },
      { delay: 10000, phase: 'done',    msg: '🎉 Kalite kontrolü tamamlandı', detail: 'Doğrama teslimata hazır · Tüm kontroller geçti', severity: 'ok' },
    ]
    for (const s of steps) {
      await new Promise(r => setTimeout(r, s.delay === 0 ? 0 : (steps[steps.indexOf(s)].delay - (steps[steps.indexOf(s) - 1]?.delay || 0))))
      setDemoToast(s)
    }
    await new Promise(r => setTimeout(r, 2500))
    setDemoToast(null)
    setDemoRunning(false)
  }

  /* ── helpers ── */
  const createProject = () => {
    if (!newProjName.trim()) return
    const p = { id: `proj_${Date.now()}`, name: newProjName.trim(), desc: newProjDesc.trim(), createdAt: new Date().toLocaleDateString('tr-TR'), status: 'aktif', scans: [], lastScan: null }
    const u = [p, ...projects]; saveLS(PROJECTS_KEY, u); setProjects(u)
    setNewProjName(''); setNewProjDesc(''); setProjectView('detail'); setActiveProject(p)
  }
  const deleteProject = (id) => {
    const u = projects.filter(p => p.id !== id); saveLS(PROJECTS_KEY, u); setProjects(u)
    if (activeProject?.id === id) { setActiveProject(null); setProjectView('list') }
  }
  const completeProject = (id) => {
    const u = projects.map(p => p.id === id ? { ...p, status: 'tamamlandı' } : p)
    saveLS(PROJECTS_KEY, u); setProjects(u)
    if (activeProject?.id === id) setActiveProject(u.find(p => p.id === id))
  }

  const projStatusColor = s => s === 'sorunlu' ? '#ef4444' : s === 'dikkat' ? '#f59e0b' : s === 'tamamlandı' ? '#6b7280' : '#10b981'
  const projStatusLabel = s => s === 'sorunlu' ? 'Sorunlu' : s === 'dikkat' ? 'Dikkat' : s === 'tamamlandı' ? 'Tamamlandı' : 'Aktif'

  /* ── PROJE LİSTESİ ── */
  if (mode === 'idle' && projectView === 'list') return (
    <div className="min-h-screen bg-[#070d1f] text-white pb-8">
      <div className="bg-[#0d1630] pt-28 pb-5 px-4 border-b border-white/10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black">Fabrikasyon Kontrol</h1>
            <p className="text-xs text-gray-500 mt-0.5">{projects.length} proje</p>
          </div>
          <button onClick={() => setProjectView('new')}
            className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 active:scale-95 text-black font-black text-sm px-4 py-2.5 rounded-xl transition-all">
            + Proje Oluştur
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5 space-y-3">
        {projects.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🏗️</div>
            <p className="text-gray-400 font-semibold mb-1">Henüz proje yok</p>
            <p className="text-gray-600 text-sm">İlk projeyi oluşturarak taramaya başlayın</p>
            <button onClick={() => setProjectView('new')}
              className="mt-5 bg-gold-500 hover:bg-gold-400 text-black font-black px-6 py-3 rounded-xl text-sm transition-all">
              + İlk Projeyi Oluştur
            </button>
          </div>
        )}

        {projects.map(p => (
          <div key={p.id}
            onClick={() => { setActiveProject(p); setProjectView('detail') }}
            className="bg-[#0d1630] border border-white/8 hover:border-gold-500/30 rounded-2xl p-4 cursor-pointer transition-all hover:bg-[#111d3a] active:scale-[0.98]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: projStatusColor(p.status) }} />
                  <span className="font-black text-white text-sm truncate">{p.name}</span>
                </div>
                {p.desc && <p className="text-xs text-gray-500 mb-2 truncate">{p.desc}</p>}
                <div className="flex items-center gap-3 text-[11px] text-gray-500">
                  <span>📅 {p.createdAt}</span>
                  <span>🔍 {(p.scans || []).length} tarama</span>
                  {p.lastScan && <span>Son: {p.lastScan}</span>}
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: projStatusColor(p.status) + '20', color: projStatusColor(p.status) }}>
                  {projStatusLabel(p.status)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Mobil banner — web'de */}
        {!isNative && (
          <div className="mt-4 bg-gradient-to-br from-[#0d1630] to-[#0a1020] border border-gold-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-gold-400 font-bold tracking-widest uppercase">AluSightŞef Mobil</p>
                <p className="text-white text-xs font-semibold">Atölyede profili tara · Hataları tespit et · Düzelt</p>
                <p className="text-gray-600 text-[11px] mt-0.5">Gerçek zamanlı kamera taraması yalnızca mobil uygulamada</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  /* ── YENİ PROJE ── */
  if (mode === 'idle' && projectView === 'new') return (
    <div className="min-h-screen bg-[#070d1f] text-white">
      <div className="bg-[#0d1630] pt-28 pb-5 px-4 border-b border-white/10">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => setProjectView('list')} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-black">Yeni Proje</h1>
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
        <div>
          <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-2">Proje Adı *</label>
          <input value={newProjName} onChange={e => setNewProjName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createProject()}
            placeholder="Örn: Ozan Villa, Merkez Plaza Bodrum..."
            autoFocus
            className="w-full bg-[#0d1630] border border-white/10 focus:border-gold-500/50 rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all" />
        </div>
        <div>
          <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-2">Açıklama (isteğe bağlı)</label>
          <input value={newProjDesc} onChange={e => setNewProjDesc(e.target.value)}
            placeholder="Proje tipi, lokasyon, notlar..."
            className="w-full bg-[#0d1630] border border-white/10 focus:border-gold-500/50 rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all" />
        </div>
        <button onClick={createProject} disabled={!newProjName.trim()}
          className={`w-full font-black text-base py-4 rounded-2xl transition-all ${newProjName.trim() ? 'bg-gold-500 hover:bg-gold-400 text-black active:scale-95' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}>
          Proje Oluştur &amp; Taramaya Geç
        </button>
      </div>
    </div>
  )

  /* ── PROJE DETAY ── */
  if (mode === 'idle' && projectView === 'detail' && activeProject) {
    const projScans = activeProject.scans || []
    const pass = projScans.filter(s => s.status === 'GEÇTİ').length
    const warn = projScans.filter(s => s.status === 'DİKKAT').length
    const fail = projScans.filter(s => s.status === 'BAŞARISIZ').length
    return (
      <div className="min-h-screen bg-[#070d1f] text-white pb-8">
        <div className="bg-[#0d1630] pt-28 pb-5 px-4 border-b border-white/10">
          <div className="max-w-lg mx-auto">
            <button onClick={() => setProjectView('list')} className="flex items-center gap-1.5 text-gray-500 hover:text-white text-xs mb-3 transition-colors">
              ← Projeler
            </button>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: projStatusColor(activeProject.status) }} />
                  <h1 className="text-xl font-black">{activeProject.name}</h1>
                </div>
                {activeProject.desc && <p className="text-xs text-gray-500">{activeProject.desc}</p>}
                <p className="text-xs text-gray-600 mt-1">📅 {activeProject.createdAt} · {projScans.length} tarama</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full flex-shrink-0 mt-1" style={{ background: projStatusColor(activeProject.status) + '20', color: projStatusColor(activeProject.status) }}>
                {projStatusLabel(activeProject.status)}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 pt-5 space-y-4">
          {/* Özet istatistikler */}
          {projScans.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {[{ l:'Geçti', v:pass, c:'#10b981' }, { l:'Dikkat', v:warn, c:'#f59e0b' }, { l:'Başarısız', v:fail, c:'#ef4444' }].map(s => (
                <div key={s.l} className="bg-[#0d1630] rounded-xl p-3 text-center border border-white/5">
                  <div className="text-xl font-black" style={{ color: s.c }}>{s.v}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tarama başlat */}
          {activeProject.status !== 'tamamlandı' && (
            isNative ? (
              <button onClick={() => { setJobNo(activeProject.name); setMode('idle'); setProjectView('scan') }}
                className="w-full bg-gold-500 hover:bg-gold-400 active:scale-95 text-black font-black text-lg py-5 rounded-2xl transition-all shadow-lg shadow-gold-500/20 flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Taramaya Başla
              </button>
            ) : (
              <button onClick={() => { setInputMode('upload'); setJobNo(activeProject.name); fileRef.current?.click() }}
                className="w-full flex items-center justify-center gap-3 bg-[#0d1630] hover:bg-[#1a2444] border border-gold-500/30 hover:border-gold-500/60 active:scale-95 text-white font-bold text-base py-4 rounded-2xl transition-all">
                <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Fotoğraf Yükle &amp; Analiz Et
              </button>
            )
          )}

          {/* Simülasyon — sadece web */}
          {!isNative && (
            <button onClick={runDemo} disabled={demoRunning}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold transition-all border ${demoRunning ? 'bg-blue-900/20 border-blue-700/30 text-blue-300 cursor-wait' : 'bg-blue-900/10 hover:bg-blue-900/30 border-blue-700/20 text-blue-400 hover:text-blue-300'}`}>
              {demoRunning ? <><span className="w-3.5 h-3.5 border border-blue-400 border-t-transparent rounded-full animate-spin" />Simülasyon çalışıyor...</> : <>🎬 Telefon-Telefon Bildirim Simülasyonu</>}
            </button>
          )}

          {/* Proje tarama geçmişi */}
          {projScans.length > 0 && (
            <div className="bg-[#0d1630] rounded-2xl p-4 border border-white/5">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3">Bu Projedeki Taramalar</p>
              <div className="space-y-2">
                {projScans.slice(0, 10).map(s => (
                  <div key={s.id} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                    {s.thumbnail && <img src={s.thumbnail} alt="" className="w-10 h-8 object-cover rounded flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${s.status === 'BAŞARISIZ' ? 'text-red-400' : s.status === 'DİKKAT' ? 'text-yellow-400' : 'text-green-400'}`}>{s.status}</span>
                        {s.qualityScore != null && <span className="text-xs text-gold-400/70">{s.qualityScore}/100</span>}
                      </div>
                      <p className="text-[11px] text-gray-500">{s.date} {s.time} · {s.issueCount} sorun</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proje aksiyonları */}
          <div className="flex gap-2">
            {activeProject.status !== 'tamamlandı' && (
              <button onClick={() => completeProject(activeProject.id)}
                className="flex-1 bg-[#0d1630] hover:bg-[#1a2444] border border-white/5 py-3 rounded-xl text-xs text-gray-400 transition-all">
                ✓ Tamamlandı İşaretle
              </button>
            )}
            <button onClick={() => { if (window.confirm('Projeyi silmek istediğinizden emin misiniz?')) deleteProject(activeProject.id) }}
              className="bg-[#0d1630] hover:bg-red-900/20 border border-white/5 hover:border-red-500/20 px-4 py-3 rounded-xl text-xs text-gray-600 hover:text-red-400 transition-all">
              Sil
            </button>
          </div>
        </div>

        {/* Demo Toast */}
        {demoToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] pointer-events-none" style={{ width: 'min(92vw, 380px)' }}>
            <div className={`rounded-2xl p-4 shadow-2xl border ${demoToast.severity === 'high' ? 'bg-red-950/95 border-red-600/50' : demoToast.severity === 'ok' ? 'bg-emerald-950/95 border-emerald-600/50' : 'bg-[#0d1630]/95 border-blue-700/40'}`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {demoToast.phase === 'notify' && <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-lg">📱</div>}
                  {demoToast.phase === 'issue' && <div className="w-10 h-10 rounded-full bg-red-600/30 flex items-center justify-center text-lg">🔴</div>}
                  {(demoToast.phase === 'fix' || demoToast.phase === 'done') && <div className="w-10 h-10 rounded-full bg-emerald-600/30 flex items-center justify-center text-lg">✅</div>}
                  {!['notify','issue','fix','done'].includes(demoToast.phase) && <div className="w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center"><span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm ${demoToast.severity === 'high' ? 'text-red-300' : demoToast.severity === 'ok' ? 'text-emerald-300' : 'text-white'}`}>{demoToast.msg}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{demoToast.detail}</p>
                  {demoToast.phase === 'notify' && (
                    <div className="mt-2 bg-[#25D366]/10 border border-[#25D366]/20 rounded-lg p-2 flex items-center gap-2">
                      <span className="text-base">💬</span>
                      <div>
                        <p className="text-[10px] font-bold text-[#25D366]">WhatsApp Bildirimi</p>
                        <p className="text-[10px] text-gray-400">⚠️ AluSight Fabrikasyon Hata: Mastik eksikliği tespit edildi. IE-2024-042</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3 bg-white/10 rounded-full h-1 overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full transition-all duration-[1500ms]"
                  style={{ width: demoToast.phase === 'capture' ? '15%' : demoToast.phase === 'upload' ? '30%' : demoToast.phase === 'analyze' ? '55%' : demoToast.phase === 'issue' ? '70%' : demoToast.phase === 'notify' ? '82%' : demoToast.phase === 'fix' ? '92%' : '100%' }} />
              </div>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    )
  }

  /* ── PROJE SCAN (mobil — kamera) ── */
  if (mode === 'idle' && projectView === 'scan') {
    // Mobilde projeye bağlı tarama başlat
    startCam()
    setProjectView('list') // startCam mode'u 'scanning' yapacak
    return null
  }

  /* ── SCANNING ── */
  if (mode === 'scanning') return (
    <div className="min-h-screen bg-[#070d1f] text-white flex flex-col">
      <div className="relative w-full bg-black flex-1" style={{ minHeight: 0 }}>
        {/* Native: çekilen fotoğrafı göster; Web: video stream */}
        {isNative && capturedImg
          ? <img src={capturedImg} alt="Çekilen fotoğraf" className="w-full object-contain" style={{ maxHeight: 'calc(100vh - 180px)' }} />
          : <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" style={{ maxHeight: 'calc(100vh - 180px)' }} />
        }
        <div className="absolute inset-0 pointer-events-none">
          {issues.map((iss, i) => (
            <div key={i} className="absolute rounded transition-all duration-500" style={{ left:`${iss.xPercent}%`, top:`${iss.yPercent}%`, width:`${iss.wPercent}%`, height:`${iss.hPercent}%`, border:`2px solid ${SEV_COLOR(iss.severity)}`, boxShadow:`0 0 14px ${SEV_COLOR(iss.severity)}60` }}>
              <div className="absolute -top-6 left-0 text-xs font-bold px-1.5 py-0.5 rounded whitespace-nowrap" style={{ background: SEV_COLOR(iss.severity), color:'#000' }}>{iss.label}</div>
            </div>
          ))}
        </div>
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {analyzing && <>
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-xs text-white">AluSight analiz ediyor...</span>
            </>}
            {!analyzing && analyzeCount > 0 && <>
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-white">{analyzeCount}. tarama tamamlandı</span>
            </>}
            {!analyzing && analyzeCount === 0 && !isNative && <>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-white">Taranıyor...</span>
            </>}
            {jobNo && <span className="text-xs bg-gold-500/20 text-gold-400 px-2 py-0.5 rounded">{jobNo}</span>}
          </div>
          {lastResult && <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-black/50 ${STS_CLS(lastResult.overallStatus)}`}>{lastResult.overallStatus}</span>}
        </div>
        {issues.length > 0 && <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3"><p className="text-xs text-red-400 font-semibold">⚠ {issues.length} sorun</p></div>}
      </div>
      {issues.length > 0 && (
        <div className="bg-[#070d1f] px-4 pt-3 pb-1 max-h-28 overflow-y-auto space-y-1.5">
          {issues.map((iss, i) => (
            <div key={i} className="flex items-center gap-2 bg-[#0d1630] rounded-lg px-3 py-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: SEV_COLOR(iss.severity) }} />
              <span className="text-xs font-semibold">{iss.label}</span>
              <span className="text-xs text-gray-500 ml-auto truncate max-w-40">{iss.description}</span>
            </div>
          ))}
        </div>
      )}
      <div className="p-4 flex gap-3 bg-[#070d1f]">
        <button onClick={capturePhoto} className="flex-1 bg-gold-500 hover:bg-gold-400 active:scale-95 font-bold py-4 rounded-xl text-base transition-all text-black">📸 Kaydet & Raporla</button>
        <button onClick={stopCam} className="bg-[#1a2444] hover:bg-[#243060] px-5 rounded-xl text-gray-400 text-sm">Durdur</button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )

  /* ── RESULT ── */
  if (mode === 'result') return (
    <div className="min-h-screen bg-[#070d1f] text-white pb-8">
      {fixModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1630] border border-green-500/30 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold mb-1">Düzeltme Onayı</h3>
            <p className="text-xs text-gray-400 mb-4">Bu hatayı kim düzeltti?</p>
            <input value={fixerName} onChange={e => setFixerName(e.target.value)} onKeyDown={e => e.key === 'Enter' && confirmFix()} placeholder="İsim / Usta adı" autoFocus className="w-full bg-[#1a2444] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-green-500/40 mb-4" />
            <div className="flex gap-3">
              <button onClick={confirmFix} className="flex-1 bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-xl text-sm">✓ Onayla</button>
              <button onClick={() => { setFixModal(null); setFixerName('') }} className="bg-white/5 px-5 rounded-xl text-gray-400 text-sm">İptal</button>
            </div>
          </div>
        </div>
      )}
      <div className="p-4">
        {batchImgs.length > 1 && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
            {batchImgs.map((img, i) => <img key={i} src={img} alt="" onClick={() => setCapturedImg(img)} className={`h-14 w-auto rounded-lg cursor-pointer flex-shrink-0 ${capturedImg === img ? 'ring-2 ring-gold-500' : 'opacity-50'}`} />)}
          </div>
        )}
        {capturedImg && (
          <div className="relative rounded-2xl overflow-hidden bg-black mb-4">
            {analyzing && <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10"><div className="text-center"><div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"/><p className="text-sm text-gold-400">{batchImgs.length > 1 ? `${batchImgs.length} fotoğraf analiz ediliyor...` : 'AluSight analiz ediyor...'}</p></div></div>}
            <img src={capturedImg} alt="" className="w-full max-h-72 object-contain bg-black" />
            {!analyzing && issues.map((iss, i) => (
              <div key={i} className="absolute rounded" style={{ left:`${iss.xPercent}%`, top:`${iss.yPercent}%`, width:`${iss.wPercent}%`, height:`${iss.hPercent}%`, border:`2px solid ${SEV_COLOR(iss.severity)}`, boxShadow:`0 0 10px ${SEV_COLOR(iss.severity)}50` }}>
                <div className="absolute -top-6 left-0 text-xs font-bold px-1.5 py-0.5 rounded whitespace-nowrap" style={{ background: SEV_COLOR(iss.severity), color:'#000' }}>{iss.label}</div>
              </div>
            ))}
          </div>
        )}
        {!analyzing && lastResult?.invalidImage && (
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-5 mb-3 text-center">
            <div className="text-3xl mb-2">🚫</div>
            <p className="text-orange-300 font-bold text-sm mb-1">Geçersiz Görüntü</p>
            <p className="text-gray-400 text-xs">{lastResult.summary}</p>
            <button onClick={rescan} className="mt-3 bg-gold-500 hover:bg-gold-400 text-black font-bold px-5 py-2 rounded-xl text-sm transition-all">
              Yeni Fotoğraf Yükle
            </button>
          </div>
        )}
        {!analyzing && analysisErr && (
          <div className="bg-red-900/20 border border-red-600/30 rounded-xl p-4 mb-3">
            {analysisErr === 'api_key' ? (
              <div>
                <p className="text-red-400 font-bold text-sm mb-2">⚠️ API Anahtarı Eksik</p>
                <p className="text-gray-400 text-xs mb-3">Fabrikasyon analizini kullanmak için Anthropic API anahtarınızı girin.</p>
                {showApiKey ? (
                  <div className="flex gap-2">
                    <input type="password" placeholder="sk-ant-..." value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)}
                      className="flex-1 bg-[#070d1f] border border-red-500/30 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400 text-white" />
                    <button onClick={() => { localStorage.setItem(API_KEY_LS, apiKeyInput); setShowApiKey(false); setApiKeyInput(''); setAnalysisErr(null) }}
                      className="bg-red-500 hover:bg-red-400 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all">Kaydet</button>
                  </div>
                ) : (
                  <button onClick={() => setShowApiKey(true)} className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-semibold px-4 py-2 rounded-lg transition-all">
                    🔑 API Anahtarı Gir
                  </button>
                )}
              </div>
            ) : (
              <div>
                <p className="text-red-400 font-bold text-sm mb-1">❌ Analiz Başarısız</p>
                <p className="text-gray-400 text-xs">{analysisErr}</p>
                <button onClick={() => setAnalysisErr(null)} className="mt-2 text-xs text-red-400 hover:text-red-300">Kapat</button>
              </div>
            )}
          </div>
        )}
        {!analyzing && lastResult && <>
          <div className="bg-[#0d1630] rounded-xl p-4 mb-3 border border-white/10">
            <div className="flex items-start justify-between">
              <div>
                <div className={`text-xl font-black mb-1 ${STS_CLS(lastResult.overallStatus)}`}>{lastResult.overallStatus === 'GEÇTİ' ? '✓' : lastResult.overallStatus === 'DİKKAT' ? '⚠' : '✗'} {lastResult.overallStatus}</div>
                {jobNo && <p className="text-xs text-gold-400/70 mb-1">İş Emri: {jobNo}</p>}
                <p className="text-gray-300 text-sm">{lastResult.summary}</p>
              </div>
              {lastResult.qualityScore != null && (
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-2xl font-black" style={{ color: lastResult.qualityScore >= 80 ? '#10b981' : lastResult.qualityScore >= 50 ? '#f59e0b' : '#ef4444' }}>{lastResult.qualityScore}</div>
                  <div className="text-xs text-gray-500">/ 100</div>
                </div>
              )}
            </div>
          </div>
          {notifSent && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3 mb-3 flex items-center gap-2">
              <span className="text-blue-400 text-lg">📡</span>
              <p className="text-blue-300 text-sm font-semibold">Tüm şirket telefonlarına bildirim gönderildi</p>
            </div>
          )}
          {issues.length > 0 && (
            <div className="space-y-2 mb-4">
              {issues.map(iss => {
                const fix = fixes[iss.id]
                return (
                  <div key={iss.id} className={`rounded-xl p-4 border-l-4 ${fix ? 'bg-green-500/5 border-green-500' : 'bg-[#0d1630]'}`} style={!fix ? { borderLeftColor: SEV_COLOR(iss.severity) } : {}}>
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className={`text-sm font-semibold ${fix ? 'text-green-400 line-through opacity-60' : 'text-white'}`}>{iss.label}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: SEV_COLOR(iss.severity) + '25', color: SEV_COLOR(iss.severity) }}>{SEV_LABEL(iss.severity)}</span>
                        </div>
                        <p className="text-xs text-gray-400">{iss.description}</p>
                        {fix && <div className="mt-1 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-400"/><p className="text-xs text-green-400 font-semibold">✓ DÜZELTİLDİ — {fix.fixedBy} · {fix.fixedAt}</p></div>}
                      </div>
                      {!fix && <button onClick={() => { setFixModal(iss.id); setFixerName(operator) }} className="text-xs bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 px-3 py-1.5 rounded-lg font-semibold flex-shrink-0">Düzeltildi →</button>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {issues.length === 0 && <div className="text-center text-green-400 py-4 text-sm font-semibold">✓ Sorun tespit edilmedi</div>}
          <div className="space-y-3">
            <button onClick={sendInternalNotif} className="w-full bg-gold-500 hover:bg-gold-400 active:scale-95 font-bold py-4 rounded-xl text-base transition-all text-black flex items-center justify-center gap-2">
              <span>📡</span>
              {notifSent ? 'Tekrar Bildir + Yeni Rapor' : issues.length > 0 ? 'Rapor İndir + Şirket İçi Bildirim Gönder' : 'AluSight Raporu İndir'}
            </button>
            <a href="/bildirim" className="w-full flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold py-3 rounded-xl text-sm transition-all">
              🔔 Bildirim Merkezini Aç
              {unread > 0 && <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unread}</span>}
            </a>
            <div className="flex gap-3">
              <button onClick={rescan} className="flex-1 bg-[#1a2444] hover:bg-[#243060] font-bold py-3 rounded-xl text-sm text-white">Yeniden Tara</button>
              <button onClick={() => setMode('history')} className="flex-1 bg-[#1a2444] hover:bg-[#243060] font-bold py-3 rounded-xl text-sm text-gray-400">Geçmiş</button>
            </div>
          </div>
        </>}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )

  return null
}
