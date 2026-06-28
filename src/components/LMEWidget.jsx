import { useState, useEffect, useRef } from 'react'

const USD_TRY  = 38.6        // yaklaşık kur (Mart 2026)
const BASE_NOW = 3384        // LME Al güncel baz (10 Mart 2026)

/* ── Gerçekçi mock (doğru baz fiyat) ─────────────────── */
function genMock() {
  let price = BASE_NOW
  const prices = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    price += (Math.random() - 0.49) * 42
    price = Math.max(3000, Math.min(3600, price))
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    if (d.getDay() !== 0 && d.getDay() !== 6)
      prices.push({ price: parseFloat(price.toFixed(2)), date: d })
  }
  prices[prices.length - 1].price = BASE_NOW + parseFloat(((Math.random() - 0.5) * 20).toFixed(2))
  return prices
}

/* ── Fiyat çekme (birden fazla kaynak) ────────────────── */
async function fetchPrice() {
  const yahooUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/ALI=F?interval=1d&range=1mo'
  const proxies = [
    () => fetch('/api/lme', { signal: AbortSignal.timeout(7000) }),
    u => fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`, { signal: AbortSignal.timeout(7000) }),
    u => fetch(`https://corsproxy.io/?${encodeURIComponent(u)}`, { signal: AbortSignal.timeout(7000) }),
    u => fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`, { signal: AbortSignal.timeout(7000) }),
    u => fetch(`https://thingproxy.freeboard.io/fetch/${encodeURIComponent(u)}`, { signal: AbortSignal.timeout(7000) }),
  ]

  const parse = async (fetchFn, url) => {
    const r = await (url ? fetchFn(url) : fetchFn())
    const d = await r.json()
    const res    = d?.chart?.result?.[0]
    const closes = res?.indicators?.quote?.[0]?.close
    const tss    = res?.timestamp
    if (!closes?.length) throw new Error('empty')
    const prices = closes
      .map((p, i) => ({ price: p ? parseFloat(p.toFixed(2)) : null, date: new Date(tss[i] * 1000) }))
      .filter(x => x.price && x.price > 2000)
    if (prices.length < 5) throw new Error('few')
    return { prices, live: true, src: 'Yahoo Finance' }
  }

  // önce /api/lme (Vite proxy veya Vercel serverless)
  try { return await parse(proxies[0]) } catch { /* devam */ }

  // query2 doğrudan dene
  try {
    const r = await fetch('https://query2.finance.yahoo.com/v8/finance/chart/ALI=F?interval=1d&range=1mo', { signal: AbortSignal.timeout(5000) })
    const d = await r.json()
    const res    = d?.chart?.result?.[0]
    const closes = res?.indicators?.quote?.[0]?.close
    const tss    = res?.timestamp
    if (closes?.length >= 5) {
      const prices = closes
        .map((p, i) => ({ price: p ? parseFloat(p.toFixed(2)) : null, date: new Date(tss[i] * 1000) }))
        .filter(x => x.price && x.price > 2000)
      if (prices.length >= 5) return { prices, live: true, src: 'Yahoo Finance' }
    }
  } catch { /* devam */ }

  // dış proxy'ler
  for (const proxy of proxies.slice(1)) {
    try { return await parse(proxy, yahooUrl) } catch { /* devam */ }
  }

  // metals.live ücretsiz API
  try {
    const r = await fetch('https://api.metals.live/v1/spot/aluminum', { signal: AbortSignal.timeout(6000) })
    const d = await r.json()
    const spotKg = d?.[0]?.price
    if (spotKg && spotKg > 1) {
      const tonPrice = spotKg > 100 ? spotKg : spotKg * 32151.07
      const mock = genMock()
      mock[mock.length - 1].price = parseFloat(tonPrice.toFixed(2))
      return { prices: mock, live: true, src: 'Metals.live' }
    }
  } catch { /* devam */ }

  return { prices: genMock(), live: false, src: 'Simüle' }
}

/* ── Mini SVG sparkline ───────────────────────────────── */
function Spark({ prices, positive }) {
  if (!prices?.length) return null
  const W = 226, H = 54, PL = 32, PR = 4, PT = 5, PB = 14
  const cW = W - PL - PR, cH = H - PT - PB
  const vals = prices.map(p => p.price)
  const mn = Math.min(...vals), mx = Math.max(...vals), rng = mx - mn || 1
  const toX = i => PL + (i / (prices.length - 1)) * cW
  const toY = v => PT + cH - ((v - mn) / rng) * cH
  const pts  = prices.map((p, i) => `${toX(i).toFixed(1)},${toY(p.price).toFixed(1)}`).join(' ')
  const line = `M${pts.replace(/ /g, ' L')}`
  const area = `M${PL},${PT + cH} L${pts.replace(/ /g, ' L')} L${PL + cW},${PT + cH}Z`
  const col  = positive ? '#22c55e' : '#ef4444'
  const gradStop = positive ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'
  const gridVals = [mn, (mn + mx) / 2, mx]
  const ticks    = [0, Math.floor(prices.length / 2), prices.length - 1]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="lmeSpark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={gradStop} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
      </defs>
      {gridVals.map((v, i) => (
        <g key={i}>
          <line x1={PL} y1={toY(v)} x2={W - PR} y2={toY(v)}
            stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" strokeDasharray="3,3" />
          <text x={PL - 3} y={toY(v) + 3.5} textAnchor="end"
            fontSize="6.5" fill="rgba(255,255,255,0.28)" fontFamily="Montserrat,sans-serif">
            {Math.round(v)}
          </text>
        </g>
      ))}
      <path d={area} fill="url(#lmeSpark)" />
      <path d={line} fill="none" stroke={col} strokeWidth="1.6" strokeLinejoin="round" />
      <circle
        cx={toX(prices.length - 1)} cy={toY(vals[vals.length - 1])}
        r="3" fill={col} stroke="rgba(6,10,20,0.9)" strokeWidth="1.5"
      />
      {ticks.map(i => (
        <text key={i} x={toX(i)} y={H - 1} textAnchor="middle"
          fontSize="6" fill="rgba(255,255,255,0.22)" fontFamily="Montserrat,sans-serif">
          {prices[i]?.date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })}
        </text>
      ))}
    </svg>
  )
}

/* ── Ana bileşen ──────────────────────────────────────── */
export default function LMEWidget() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [mini,    setMini]    = useState(false)
  const [tab,     setTab]     = useState('chart')   // 'chart' | 'tv'
  const tvRef = useRef(null)

  useEffect(() => {
    fetchPrice().then(d => { setData(d); setLoading(false) })
  }, [])

  // TradingView widget yükle
  useEffect(() => {
    if (tab !== 'tv' || !tvRef.current) return
    tvRef.current.innerHTML = ''
    const s = document.createElement('script')
    s.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js'
    s.async = true
    s.innerHTML = JSON.stringify({
      symbol: 'COMEX:ALI1!',
      width: '100%',
      height: 150,
      locale: 'tr',
      dateRange: '1M',
      colorTheme: 'dark',
      trendLineColor: 'rgba(201,168,76,1)',
      underLineColor: 'rgba(201,168,76,0.15)',
      underLineBottomColor: 'rgba(0,0,0,0)',
      isTransparent: true,
      autosize: false,
      largeChartUrl: '',
      noTimeScale: false,
    })
    tvRef.current.appendChild(s)
  }, [tab])

  const prices   = data?.prices || []
  const current  = prices[prices.length - 1]?.price ?? BASE_NOW
  const prev     = prices[prices.length - 2]?.price ?? current
  const change   = current - prev
  const pct      = prev ? (change / prev) * 100 : 0
  const positive = change >= 0
  const hi30     = prices.length ? Math.max(...prices.map(p => p.price)) : 0
  const lo30     = prices.length ? Math.min(...prices.map(p => p.price)) : 0
  const tryKg    = (current * USD_TRY / 1000).toFixed(1)

  const C = (v, d = 2) => v.toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d })

  return (
    <div style={{
      position: 'fixed',
      top: 110,
      left: 24,
      zIndex: 40,
      width: mini ? 188 : 258,
      background: 'linear-gradient(155deg, rgba(6,10,20,0.97), rgba(10,16,34,0.97))',
      border: '1px solid rgba(201,168,76,0.28)',
      borderRadius: 14,
      boxShadow: '0 20px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(201,168,76,0.07)',
      backdropFilter: 'blur(20px)',
      overflow: 'hidden',
      transition: 'width .3s ease',
      fontFamily: 'Montserrat, sans-serif',
    }}>

      {/* ── Başlık ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 10px 6px',
        borderBottom: '1px solid rgba(201,168,76,0.13)',
        background: 'rgba(201,168,76,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 11 }}>📊</span>
          <span style={{ fontSize: 8.5, fontWeight: 700, color: 'rgba(201,168,76,0.8)', letterSpacing: 1, textTransform: 'uppercase' }}>
            LME Alüminyum
          </span>
        </div>
        <button
          onClick={() => setMini(m => !m)}
          title={mini ? 'Genişlet' : 'Küçült'}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(201,168,76,0.5)', fontSize: 14, lineHeight: 1, padding: '0 2px', transition: 'color .2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(201,168,76,0.9)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(201,168,76,0.5)'}
        >
          {mini ? '⊕' : '⊖'}
        </button>
      </div>

      {/* ── İçerik ── */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 5, padding: '18px 0' }}>
          <style>{`@keyframes lmeBounce{0%,80%,100%{transform:scale(.55);opacity:.4}40%{transform:scale(1.1);opacity:1}}`}</style>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a84c', animation: `lmeBounce 1.3s ease-in-out ${i * 0.22}s infinite` }} />
          ))}
        </div>
      ) : (
        <div style={{ padding: mini ? '8px 10px' : '10px 11px 8px', transition: 'padding .3s' }}>

          {/* Fiyat + değişim */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: mini ? 0 : 7 }}>
            <div>
              <div style={{ fontSize: mini ? 20 : 23, fontWeight: 800, color: '#e8c96d', lineHeight: 1.1, letterSpacing: -0.5 }}>
                ${C(current)}
              </div>
              {!mini && (
                <div style={{ fontSize: 9, color: 'rgba(180,200,220,0.45)', marginTop: 2 }}>
                  ≈ {C(parseFloat(tryKg), 1)} ₺/kg &nbsp;·&nbsp; /ton
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, marginTop: 2 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                padding: '3px 7px', borderRadius: 6,
                background: positive ? 'rgba(34,197,94,0.13)' : 'rgba(239,68,68,0.13)',
                border: `1px solid ${positive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              }}>
                <span style={{ fontSize: 9 }}>{positive ? '▲' : '▼'}</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: positive ? '#4ade80' : '#f87171' }}>
                  {positive ? '+' : ''}{C(change)}
                </span>
              </div>
              <span style={{ fontSize: 8.5, color: positive ? 'rgba(74,222,128,0.65)' : 'rgba(248,113,113,0.65)' }}>
                {positive ? '+' : ''}{pct.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Grafik bölümü — mini'de gizle */}
          {!mini && (
            <>
              {/* Tab: grafik seçici */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                {[['chart', '30G. Grafik'], ['tv', 'Canlı TV']].map(([k, lbl]) => (
                  <button key={k} onClick={() => setTab(k)} style={{
                    flex: 1, padding: '3px 0', borderRadius: 5,
                    background: tab === k ? 'rgba(201,168,76,0.18)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${tab === k ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.07)'}`,
                    color: tab === k ? '#c9a84c' : 'rgba(200,220,240,0.4)',
                    fontSize: 9, fontFamily: 'Montserrat,sans-serif', cursor: 'pointer', transition: 'all .18s',
                  }}>
                    {lbl}
                  </button>
                ))}
              </div>

              {/* 30G. kendi grafiğimiz */}
              {tab === 'chart' && (
                <div style={{ marginBottom: 7 }}>
                  <Spark prices={prices} positive={positive} />
                  <div style={{ textAlign: 'right', fontSize: 7.5, color: 'rgba(180,200,220,0.28)', marginTop: 1 }}>
                    {data?.live ? `● Canlı · ${data.src}` : '○ Simüle'}
                  </div>
                </div>
              )}

              {/* TradingView mini widget */}
              {tab === 'tv' && (
                <div style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 7, minHeight: 160 }}>
                  <div className="tradingview-widget-container" ref={tvRef}
                    style={{ height: 160, background: 'rgba(6,10,20,0.6)' }} />
                </div>
              )}

              {/* Hi / Lo */}
              <div style={{ display: 'flex', gap: 5, marginBottom: 7 }}>
                {[
                  { label: '30G. Yük.', val: `$${C(hi30, 0)}`, col: '#4ade80' },
                  { label: '30G. Düş.', val: `$${C(lo30, 0)}`, col: '#f87171' },
                ].map(s => (
                  <div key={s.label} style={{
                    flex: 1, background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 7, padding: '5px 7px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 7.5, color: 'rgba(180,200,220,0.35)', marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: s.col }}>{s.val}</div>
                  </div>
                ))}
              </div>

              {/* TRY karşılığı */}
              <div style={{
                background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: 7, padding: '6px 9px',
              }}>
                {[
                  { qty: '1 kg',  val: (current * USD_TRY / 1000) },
                  { qty: '1 ton', val: current * USD_TRY },
                ].map(r => (
                  <div key={r.qty} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                    <span style={{ fontSize: 9.5, color: 'rgba(180,200,220,0.5)' }}>{r.qty}</span>
                    <span style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(220,200,150,0.8)' }}>
                      ≈ {r.val.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺
                    </span>
                  </div>
                ))}
                <div style={{ fontSize: 7, color: 'rgba(180,200,220,0.22)', marginTop: 3 }}>
                  USD/TRY ~{USD_TRY} · bilgi amaçlıdır
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
