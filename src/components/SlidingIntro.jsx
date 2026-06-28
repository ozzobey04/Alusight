import { useEffect, useState } from 'react'

export default function SlidingIntro({ onDone }) {
  const [phase, setPhase] = useState('hold') // hold → open → fade → done

  useEffect(() => {
    // 1) Kapı kapalı dur — 1.1s
    const t1 = setTimeout(() => setPhase('open'), 1100)
    // 2) Sürme animasyonu — 1.4s
    const t2 = setTimeout(() => setPhase('fade'), 2500)
    // 3) Fade out — 0.5s
    const t3 = setTimeout(() => { setPhase('done'); onDone?.() }, 3000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  if (phase === 'done') return null

  const opening = phase === 'open' || phase === 'fade'
  const fading  = phase === 'fade'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      opacity: fading ? 0 : 1,
      transition: fading ? 'opacity 0.5s ease' : 'none',
      pointerEvents: phase === 'fade' ? 'none' : 'all',
      background: '#08111e',
      overflow: 'hidden',
    }}>

      {/* ── Zemin: hafif mimari ızgara ──────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, #0a1628 0%, #0d1f3c 100%)',
        backgroundImage: `
          linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}/>

      {/* ── Üst ray ─────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 8,
        background: 'linear-gradient(180deg, #1a2540, #0f1a2e)',
        zIndex: 10,
      }}>
        {/* Ray kanalı */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6) 20%, rgba(201,168,76,0.9) 50%, rgba(201,168,76,0.6) 80%, transparent)',
          boxShadow: '0 0 12px rgba(201,168,76,0.4)',
        }}/>
      </div>

      {/* ── Alt ray ─────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 8,
        background: 'linear-gradient(0deg, #1a2540, #0f1a2e)',
        zIndex: 10,
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6) 20%, rgba(201,168,76,0.9) 50%, rgba(201,168,76,0.6) 80%, transparent)',
          boxShadow: '0 0 12px rgba(201,168,76,0.4)',
        }}/>
      </div>

      {/* ── Orta ışık çizgisi ──────────────────────────── */}
      <div style={{
        position: 'absolute', top: 8, bottom: 8,
        left: '50%', width: 2,
        background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.7) 20%, rgba(255,224,144,0.9) 50%, rgba(201,168,76,0.7) 80%, transparent)',
        boxShadow: '0 0 16px rgba(201,168,76,0.5)',
        transform: 'translateX(-50%)',
        zIndex: 20,
        opacity: opening ? 0 : 1,
        transition: 'opacity 0.3s ease',
      }}/>

      {/* ════════════════════════════════════════════════
          SOL KANAT
      ════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute', top: 8, bottom: 8, left: 0, width: '50%',
        transform: opening ? 'translateX(-100%)' : 'translateX(0)',
        transition: opening ? 'transform 1.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        zIndex: 5,
      }}>
        {/* Cam yüzeyi — açık cam mavisi */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(
            135deg,
            rgba(120,180,230,0.45) 0%,
            rgba(150,210,240,0.38) 30%,
            rgba(100,170,220,0.42) 60%,
            rgba(80,155,215,0.48) 100%
          )`,
          backdropFilter: 'blur(2px)',
        }}>
          {/* Üst köşe yansıması — güneş ışığı etkisi */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(140deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 35%, transparent 60%)',
          }}/>
          {/* Orta diyagonal parlaklık */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.09) 50%, transparent 70%)',
          }}/>
          {/* Alt hafif koyu — derinlik */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 50%, rgba(30,80,140,0.25) 100%)',
          }}/>
        </div>

        {/* Sol profil çerçevesi — sağ kenar (ince alüminyum) */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, right: 0, width: 18,
          background: 'linear-gradient(90deg, #1c2d45, #243550, #1a2840)',
          borderLeft: '1px solid rgba(201,168,76,0.3)',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.15) 50%, transparent)',
          }}/>
          {/* Kilitleme noktası */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 6, height: 6, borderRadius: '50%',
            background: 'radial-gradient(circle, #c9a84c, #8a6a28)',
            boxShadow: '0 0 6px rgba(201,168,76,0.6)',
          }}/>
        </div>

        {/* Sol profil çerçevesi — sol kenar */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 0, width: 18,
          background: 'linear-gradient(90deg, #1a2840, #243550, #1c2d45)',
          borderRight: '1px solid rgba(201,168,76,0.15)',
        }}/>

        {/* Yatay çerçeve — ortada */}
        <div style={{
          position: 'absolute', left: 18, right: 18,
          top: '50%', height: 12,
          transform: 'translateY(-50%)',
          background: 'linear-gradient(180deg, #1c2d45, #243550, #1a2840)',
          borderTop: '1px solid rgba(201,168,76,0.2)',
          borderBottom: '1px solid rgba(201,168,76,0.1)',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.08) 50%, transparent)',
          }}/>
        </div>

        {/* Üst çerçeve */}
        <div style={{
          position: 'absolute', left: 18, right: 18, top: 0, height: 10,
          background: 'linear-gradient(180deg, #243550, #1c2d45)',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
        }}/>
        {/* Alt çerçeve */}
        <div style={{
          position: 'absolute', left: 18, right: 18, bottom: 0, height: 10,
          background: 'linear-gradient(0deg, #243550, #1c2d45)',
          borderTop: '1px solid rgba(201,168,76,0.15)',
        }}/>

        {/* Cam parçası 1 (üst) — iç yansıma çizgisi */}
        <div style={{
          position: 'absolute', left: 36, right: 18,
          top: 10, bottom: 'calc(50% + 6px)',
          background: 'linear-gradient(120deg, rgba(255,255,255,0.015) 0%, transparent 30%)',
          pointerEvents: 'none',
        }}/>
      </div>

      {/* ════════════════════════════════════════════════
          SAĞ KANAT
      ════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute', top: 8, bottom: 8, right: 0, width: '50%',
        transform: opening ? 'translateX(100%)' : 'translateX(0)',
        transition: opening ? 'transform 1.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        zIndex: 5,
      }}>
        {/* Cam yüzeyi — açık cam mavisi */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(
            225deg,
            rgba(120,180,230,0.45) 0%,
            rgba(150,210,240,0.38) 30%,
            rgba(100,170,220,0.42) 60%,
            rgba(80,155,215,0.48) 100%
          )`,
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(40deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 35%, transparent 60%)',
          }}/>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(250deg, transparent 30%, rgba(255,255,255,0.09) 50%, transparent 70%)',
          }}/>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 50%, rgba(30,80,140,0.25) 100%)',
          }}/>
        </div>

        {/* Sağ profil — sol kenar */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 0, width: 18,
          background: 'linear-gradient(90deg, #1a2840, #243550, #1c2d45)',
          borderRight: '1px solid rgba(201,168,76,0.3)',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.15) 50%, transparent)',
          }}/>
          {/* Kilitleme noktası */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 6, height: 6, borderRadius: '50%',
            background: 'radial-gradient(circle, #c9a84c, #8a6a28)',
            boxShadow: '0 0 6px rgba(201,168,76,0.6)',
          }}/>
        </div>

        {/* Sağ profil — sağ kenar */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, right: 0, width: 18,
          background: 'linear-gradient(90deg, #1c2d45, #243550, #1a2840)',
          borderLeft: '1px solid rgba(201,168,76,0.15)',
        }}/>

        {/* Yatay çerçeve — ortada */}
        <div style={{
          position: 'absolute', left: 18, right: 18,
          top: '50%', height: 12,
          transform: 'translateY(-50%)',
          background: 'linear-gradient(180deg, #1c2d45, #243550, #1a2840)',
          borderTop: '1px solid rgba(201,168,76,0.2)',
          borderBottom: '1px solid rgba(201,168,76,0.1)',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.08) 50%, transparent)',
          }}/>
        </div>

        {/* Üst çerçeve */}
        <div style={{
          position: 'absolute', left: 18, right: 18, top: 0, height: 10,
          background: 'linear-gradient(180deg, #243550, #1c2d45)',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
        }}/>
        {/* Alt çerçeve */}
        <div style={{
          position: 'absolute', left: 18, right: 18, bottom: 0, height: 10,
          background: 'linear-gradient(0deg, #243550, #1c2d45)',
          borderTop: '1px solid rgba(201,168,76,0.15)',
        }}/>
      </div>

      {/* ════════════════════════════════════════════════
          LOGO + YAZISI — kapılar açılmadan önce görünür
      ════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 30, pointerEvents: 'none',
        opacity: opening ? 0 : 1,
        transition: 'opacity 0.4s ease',
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: 800,
          letterSpacing: '0.15em',
          color: '#fff',
          textShadow: '0 0 40px rgba(201,168,76,0.4)',
          marginBottom: 8,
        }}>
          <span style={{ color: '#c9a84c' }}>OZZO</span>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 300, marginLeft: 12 }}>LAB</span>
        </div>
        {/* Alt yazı */}
        <div style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 'clamp(9px, 1.2vw, 13px)',
          fontWeight: 600,
          letterSpacing: '0.35em',
          color: 'rgba(201,168,76,0.7)',
          textTransform: 'uppercase',
        }}>
          Aluminyum · Mimari · Teknoloji
        </div>
        {/* İnce çizgi */}
        <div style={{
          width: 80, height: 1, marginTop: 18,
          background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)',
        }}/>
      </div>

      {/* ── Açılma sırasında ortada ışık parlama ── */}
      {opening && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 20% 100% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)',
          zIndex: 25, pointerEvents: 'none',
          animation: 'sfGlow 1.4s ease-out forwards',
        }}/>
      )}

      <style>{`
        @keyframes sfGlow {
          0%   { opacity: 0; }
          30%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
