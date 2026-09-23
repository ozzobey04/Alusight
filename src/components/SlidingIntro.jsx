import { useEffect, useState, useCallback } from 'react'

/* AluSight açılış — toplam ~2.9s, tıklama/scroll/tuş ile atlanabilir
 *
 * Sıra:
 *   0.00s  cephe ızgarası ve raylar karanlıktan belirir
 *   0.30s  altın düşey çizgi yukarıdan aşağı iner
 *   0.75s  AluSight soldan, LAB sağdan merkeze gelir
 *   1.25s  slogan yumuşakça görünür
 *   2.00s  kanatlar açılır (900ms sürme)
 *   2.90s  ana sayfaya geçiş
 */
const T_LINE = 300
const T_TEXT = 750
const T_TAG  = 1250
const T_OPEN = 2000
const T_FADE = 2700
const T_DONE = 2900

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

export default function SlidingIntro({ onDone }) {
  const [step, setStep]   = useState(0)       // 0 zemin · 1 çizgi · 2 marka · 3 slogan
  const [phase, setPhase] = useState('hold')  // hold → open → fade → done

  const finish = useCallback(() => {
    setPhase('done')
    onDone?.()
  }, [onDone])

  /* Zamanlama */
  useEffect(() => {
    const t = [
      setTimeout(() => setStep(1), T_LINE),
      setTimeout(() => setStep(2), T_TEXT),
      setTimeout(() => setStep(3), T_TAG),
      setTimeout(() => setPhase('open'), T_OPEN),
      setTimeout(() => setPhase('fade'), T_FADE),
      setTimeout(finish, T_DONE),
    ]
    return () => t.forEach(clearTimeout)
  }, [finish])

  /* Atlama — tıklama, scroll, dokunma, klavye */
  useEffect(() => {
    if (phase === 'done') return
    const skip = () => finish()
    window.addEventListener('pointerdown', skip)
    window.addEventListener('wheel', skip, { passive: true })
    window.addEventListener('touchstart', skip, { passive: true })
    window.addEventListener('keydown', skip)
    return () => {
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('wheel', skip)
      window.removeEventListener('touchstart', skip)
      window.removeEventListener('keydown', skip)
    }
  }, [phase, finish])

  if (phase === 'done') return null

  const opening = phase === 'open' || phase === 'fade'
  const fading  = phase === 'fade'

  return (
    <div
      className="alusight-intro"
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        opacity: fading ? 0 : 1,
        transition: fading ? 'opacity 0.15s ease' : 'none',
        pointerEvents: fading ? 'none' : 'all',
        background: '#08111e',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >

      {/* ── Zemin: mimari ızgara — karanlıktan belirir ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, #0a1628 0%, #0d1f3c 100%)',
        backgroundImage: `
          linear-gradient(rgba(201,168,76,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,168,76,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        opacity: step >= 1 ? 1 : 0,
        transition: `opacity 500ms ${EASE}`,
      }}/>

      {/* ── Üst ray ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 8, zIndex: 10,
        background: 'linear-gradient(180deg, #1a2540, #0f1a2e)',
        opacity: step >= 1 ? 1 : 0,
        transition: `opacity 450ms ${EASE}`,
      }}>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6) 20%, rgba(201,168,76,0.9) 50%, rgba(201,168,76,0.6) 80%, transparent)',
          boxShadow: '0 0 12px rgba(201,168,76,0.4)',
        }}/>
      </div>

      {/* ── Alt ray ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 8, zIndex: 10,
        background: 'linear-gradient(0deg, #1a2540, #0f1a2e)',
        opacity: step >= 1 ? 1 : 0,
        transition: `opacity 450ms ${EASE}`,
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6) 20%, rgba(201,168,76,0.9) 50%, rgba(201,168,76,0.6) 80%, transparent)',
          boxShadow: '0 0 12px rgba(201,168,76,0.4)',
        }}/>
      </div>

      {/* ── Altın düşey çizgi — yukarıdan aşağı iner.
             Yazıyı bölmemesi için üst/alt iki parçaya ayrıldı,
             ortada ~156px'lik metin koridoru boş bırakıldı. ── */}
      {['top', 'bottom'].map(side => (
        <div
          key={side}
          style={{
            position: 'absolute',
            left: '50%', width: 2, zIndex: 20,
            transform: 'translateX(-50%)',
            [side === 'top' ? 'top' : 'bottom']: 8,
            height: 'calc(50% - 78px)',
            background: side === 'top'
              ? 'linear-gradient(180deg, transparent, rgba(201,168,76,0.65) 45%, rgba(255,224,144,0.9))'
              : 'linear-gradient(0deg, transparent, rgba(201,168,76,0.65) 45%, rgba(255,224,144,0.9))',
            boxShadow: '0 0 16px rgba(201,168,76,0.45)',
            transformOrigin: side === 'top' ? 'top center' : 'bottom center',
            opacity: opening ? 0 : (step >= 1 ? 1 : 0),
            scale: step >= 1 ? '1 1' : '1 0',
            transition: `scale 520ms ${EASE}, opacity 260ms ease`,
          }}
        />
      ))}

      {/* ════════ SOL KANAT ════════ */}
      <div style={{
        position: 'absolute', top: 8, bottom: 8, left: 0, width: '50%', zIndex: 5,
        transform: opening ? 'translateX(-100%)' : 'translateX(0)',
        transition: opening ? `transform 900ms ${EASE}` : 'none',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg,
            rgba(120,180,230,0.45) 0%, rgba(150,210,240,0.38) 30%,
            rgba(100,170,220,0.42) 60%, rgba(80,155,215,0.48) 100%)`,
          backdropFilter: 'blur(2px)',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(140deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 35%, transparent 60%)' }}/>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.09) 50%, transparent 70%)' }}/>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(30,80,140,0.25) 100%)' }}/>
        </div>

        {/* Sağ kenar profili + kilit noktası */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, right: 0, width: 18,
          background: 'linear-gradient(90deg, #1c2d45, #243550, #1a2840)',
          borderLeft: '1px solid rgba(201,168,76,0.3)',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.15) 50%, transparent)' }}/>
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 6, height: 6, borderRadius: '50%',
            background: 'radial-gradient(circle, #c9a84c, #8a6a28)',
            boxShadow: '0 0 6px rgba(201,168,76,0.6)',
          }}/>
        </div>

        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 0, width: 18,
          background: 'linear-gradient(90deg, #1a2840, #243550, #1c2d45)',
          borderRight: '1px solid rgba(201,168,76,0.15)',
        }}/>

        <div style={{
          position: 'absolute', left: 18, right: 18, top: '50%', height: 12,
          transform: 'translateY(-50%)',
          background: 'linear-gradient(180deg, #1c2d45, #243550, #1a2840)',
          borderTop: '1px solid rgba(201,168,76,0.2)',
          borderBottom: '1px solid rgba(201,168,76,0.1)',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.08) 50%, transparent)' }}/>
        </div>

        <div style={{ position: 'absolute', left: 18, right: 18, top: 0, height: 10, background: 'linear-gradient(180deg, #243550, #1c2d45)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}/>
        <div style={{ position: 'absolute', left: 18, right: 18, bottom: 0, height: 10, background: 'linear-gradient(0deg, #243550, #1c2d45)', borderTop: '1px solid rgba(201,168,76,0.15)' }}/>
      </div>

      {/* ════════ SAĞ KANAT ════════ */}
      <div style={{
        position: 'absolute', top: 8, bottom: 8, right: 0, width: '50%', zIndex: 5,
        transform: opening ? 'translateX(100%)' : 'translateX(0)',
        transition: opening ? `transform 900ms ${EASE}` : 'none',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(225deg,
            rgba(120,180,230,0.45) 0%, rgba(150,210,240,0.38) 30%,
            rgba(100,170,220,0.42) 60%, rgba(80,155,215,0.48) 100%)`,
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(40deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 35%, transparent 60%)' }}/>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(250deg, transparent 30%, rgba(255,255,255,0.09) 50%, transparent 70%)' }}/>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(30,80,140,0.25) 100%)' }}/>
        </div>

        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 0, width: 18,
          background: 'linear-gradient(90deg, #1a2840, #243550, #1c2d45)',
          borderRight: '1px solid rgba(201,168,76,0.3)',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.15) 50%, transparent)' }}/>
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 6, height: 6, borderRadius: '50%',
            background: 'radial-gradient(circle, #c9a84c, #8a6a28)',
            boxShadow: '0 0 6px rgba(201,168,76,0.6)',
          }}/>
        </div>

        <div style={{
          position: 'absolute', top: 0, bottom: 0, right: 0, width: 18,
          background: 'linear-gradient(90deg, #1c2d45, #243550, #1a2840)',
          borderLeft: '1px solid rgba(201,168,76,0.15)',
        }}/>

        <div style={{
          position: 'absolute', left: 18, right: 18, top: '50%', height: 12,
          transform: 'translateY(-50%)',
          background: 'linear-gradient(180deg, #1c2d45, #243550, #1a2840)',
          borderTop: '1px solid rgba(201,168,76,0.2)',
          borderBottom: '1px solid rgba(201,168,76,0.1)',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.08) 50%, transparent)' }}/>
        </div>

        <div style={{ position: 'absolute', left: 18, right: 18, top: 0, height: 10, background: 'linear-gradient(180deg, #243550, #1c2d45)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}/>
        <div style={{ position: 'absolute', left: 18, right: 18, bottom: 0, height: 10, background: 'linear-gradient(0deg, #243550, #1c2d45)', borderTop: '1px solid rgba(201,168,76,0.15)' }}/>
      </div>

      {/* ════════ MARKA ════════ */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 30, pointerEvents: 'none',
        opacity: opening ? 0 : 1,
        transition: 'opacity 240ms ease',
      }}>
        {/* AluSight soldan · LAB sağdan */}
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 14,
          fontFamily: 'Playfair Display, serif',
          marginBottom: 16,
        }}>
          <span style={{
            fontSize: 'clamp(38px, 6.2vw, 74px)',
            fontWeight: 800,
            letterSpacing: '0.05em',
            color: '#c9a84c',
            textShadow: '0 0 44px rgba(201,168,76,0.45)',
            transform: step >= 2 ? 'translateX(0)' : 'translateX(-56px)',
            opacity: step >= 2 ? 1 : 0,
            transition: `transform 620ms ${EASE}, opacity 520ms ease`,
          }}>
            AluSight
          </span>
          <span style={{
            fontSize: 'clamp(16px, 2.1vw, 26px)',
            fontWeight: 300,
            letterSpacing: '0.26em',
            color: 'rgba(224,210,175,0.66)',
            transform: step >= 2 ? 'translateX(0)' : 'translateX(56px)',
            opacity: step >= 2 ? 1 : 0,
            transition: `transform 620ms ${EASE} 90ms, opacity 520ms ease 90ms`,
          }}>
            LAB
          </span>
        </div>

        {/* Slogan */}
        <div style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 'clamp(11px, 1.5vw, 16px)',
          fontWeight: 600,
          letterSpacing: '0.16em',
          color: 'rgba(214,186,120,0.9)',
          textTransform: 'uppercase',
          textAlign: 'center',
          padding: '0 16px',
          opacity: step >= 3 ? 1 : 0,
          transform: step >= 3 ? 'translateY(0)' : 'translateY(8px)',
          transition: `opacity 480ms ease, transform 480ms ${EASE}`,
        }}>
          Alüminyum · Mimari · Teknoloji
        </div>

        {/* İnce çizgi */}
        <div style={{
          width: step >= 3 ? 110 : 0, height: 1, marginTop: 18,
          background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)',
          transition: `width 620ms ${EASE}`,
        }}/>
      </div>

      {/* ── Atla ipucu ── */}
      <div style={{
        position: 'absolute', bottom: 26, left: 0, right: 0,
        textAlign: 'center', zIndex: 35, pointerEvents: 'none',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.3)',
        opacity: step >= 3 && !opening ? 1 : 0,
        transition: 'opacity 400ms ease',
      }}>
        Atlamak için tıkla
      </div>

      {/* ── Açılırken orta parlama ── */}
      {opening && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 25, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 20% 100% at 50% 50%, rgba(201,168,76,0.1) 0%, transparent 70%)',
          animation: 'sfGlow 900ms ease-out forwards',
        }}/>
      )}

      <style>{`
        @keyframes sfGlow {
          0%   { opacity: 0 }
          30%  { opacity: 1 }
          100% { opacity: 0 }
        }
        @media (prefers-reduced-motion: reduce) {
          .alusight-intro, .alusight-intro * {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
