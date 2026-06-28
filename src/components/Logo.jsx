/* OZZO Aluminyum — 3D Mimari Logo */

/* ── Reusable O glyph ── */
function OGlyph({ cx, cy, R = 32, dir = 1, idPfx = 'o' }) {
  return (
    <g>
      <defs>
        {/* 3D chrome sphere gradient — ışık sol-üstten geliyor */}
        <radialGradient id={`${idPfx}sphere`} cx="35%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.25"/>
          <stop offset="40%"  stopColor="#b8d4ea" stopOpacity="0.10"/>
          <stop offset="100%" stopColor="#1a2838" stopOpacity="0.0"/>
        </radialGradient>
        <linearGradient id={`${idPfx}ringGrad`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%"   stopColor="#f0f8ff"/>
          <stop offset="15%"  stopColor="#b8cfe0"/>
          <stop offset="38%"  stopColor="#5a7898"/>
          <stop offset="55%"  stopColor="#8ab0cc"/>
          <stop offset="75%"  stopColor="#d8eaf6"/>
          <stop offset="100%" stopColor="#4a6880"/>
        </linearGradient>
        <linearGradient id={`${idPfx}midRing`} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%"   stopColor="#ffe8a0"/>
          <stop offset="50%"  stopColor="#c9a84c"/>
          <stop offset="100%" stopColor="#7a5818"/>
        </linearGradient>
        <filter id={`${idPfx}drop`} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="3.5" dy="4" stdDeviation="3" floodColor="#050d18" floodOpacity="0.8"/>
        </filter>
        <filter id={`${idPfx}core`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id={`${idPfx}specular`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id={`${idPfx}clip`}>
          <circle cx={cx} cy={cy} r={R + 9}/>
        </clipPath>
      </defs>

      {/* Shadow / extrusion depth (slightly offset circle) */}
      <circle cx={cx + 3.5} cy={cy + 4} r={R}
        fill="none" stroke="#050d18" strokeWidth="7" opacity="0.7"/>
      <circle cx={cx + 2} cy={cy + 2.5} r={R}
        fill="none" stroke="#0a1828" strokeWidth="7" opacity="0.5"/>

      {/* Main aluminum ring — thick with 3D gradient */}
      <circle cx={cx} cy={cy} r={R}
        fill="none" stroke={`url(#${idPfx}ringGrad)`} strokeWidth="6.8"
        filter={`url(#${idPfx}drop)`}/>

      {/* Inner bevel ring (gold accent) */}
      <circle cx={cx} cy={cy} r={R - 9.5}
        fill="none" stroke={`url(#${idPfx}midRing)`} strokeWidth="1.2" opacity="0.75"/>

      {/* Innermost architectural detail — subtle hexagonal marks */}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 6
        const b = ((i + 0.72) / 6) * Math.PI * 2 - Math.PI / 6
        return (
          <line key={i}
            x1={cx + Math.cos(a) * (R - 10.5)} y1={cy + Math.sin(a) * (R - 10.5)}
            x2={cx + Math.cos(b) * (R - 10.5)} y2={cy + Math.sin(b) * (R - 10.5)}
            stroke="rgba(201,168,76,0.38)" strokeWidth="0.9" strokeLinecap="round"/>
        )
      })}

      {/* Very subtle crosshair (just 2 short tick lines, not full cross) */}
      <line x1={cx - 4.5} y1={cy} x2={cx + 4.5} y2={cy} stroke="rgba(201,168,76,0.22)" strokeWidth="0.6"/>
      <line x1={cx} y1={cy - 4.5} x2={cx} y2={cy + 4.5} stroke="rgba(201,168,76,0.22)" strokeWidth="0.6"/>

      {/* Core glow dot */}
      <circle cx={cx} cy={cy} r={3.5}
        fill={`url(#${idPfx}midRing)`} filter={`url(#${idPfx}core)`}/>
      <circle cx={cx} cy={cy} r={1.6} fill="#fff7cc" opacity="0.9"/>

      {/* Sphere highlight (light reflection, top-left arc) */}
      <path
        d={`M${cx + Math.cos(2.1) * R} ${cy + Math.sin(2.1) * R} A${R} ${R} 0 0 1 ${cx + Math.cos(0.85) * R} ${cy + Math.sin(0.85) * R}`}
        fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        filter={`url(#${idPfx}specular)`}/>

      {/* Sphere shadow arc (bottom-right) */}
      <path
        d={`M${cx + Math.cos(2.1) * R} ${cy + Math.sin(2.1) * R} A${R} ${R} 0 0 1 ${cx + Math.cos(0.85) * R} ${cy + Math.sin(0.85) * R}`}
        fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1.8" strokeLinecap="round"
        transform={`rotate(90 ${cx} ${cy})`}/>

      {/* Single slow-rotating orbital tick ring */}
      <circle cx={cx} cy={cy} r={R + 5}
        fill="none" stroke="rgba(201,168,76,0.45)" strokeWidth="0.7"
        strokeDasharray="3 14" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate"
          from={`0 ${cx} ${cy}`} to={`${dir * 360} ${cx} ${cy}`}
          dur="12s" repeatCount="indefinite"/>
      </circle>

      {/* Sphere glass fill (very subtle) */}
      <circle cx={cx} cy={cy} r={R - 3.5}
        fill={`url(#${idPfx}sphere)`} clipPath={`url(#${idPfx}clip)`}/>
    </g>
  )
}

/* ── Reusable Z glyph ── */
function ZGlyph({ x, yT, yB, w, idPfx = 'z' }) {
  // Z corner points
  const TL = [x,     yT]
  const TR = [x + w, yT]
  const BL = [x,     yB]
  const BR = [x + w, yB]
  const pts = `${TL} ${TR} ${BL} ${BR}`

  return (
    <g>
      <defs>
        <linearGradient id={`${idPfx}grad`} x1="5%" y1="0%" x2="95%" y2="100%">
          <stop offset="0%"   stopColor="#f4faff"/>
          <stop offset="18%"  stopColor="#bcd4e8"/>
          <stop offset="42%"  stopColor="#5a7898"/>
          <stop offset="65%"  stopColor="#a0c0d8"/>
          <stop offset="85%"  stopColor="#e0f0ff"/>
          <stop offset="100%" stopColor="#4a6070"/>
        </linearGradient>
        <filter id={`${idPfx}zDrop`} x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="3.5" dy="4" stdDeviation="2.5" floodColor="#040c1c" floodOpacity="0.85"/>
        </filter>
        <filter id={`${idPfx}zSpec`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.9" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Extrusion depth — layer 3 (deepest shadow) */}
      <polyline points={`${TL[0]+5},${TL[1]+6} ${TR[0]+5},${TR[1]+6} ${BL[0]+5},${BL[1]+6} ${BR[0]+5},${BR[1]+6}`}
        fill="none" stroke="#030a16" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>

      {/* Extrusion depth — layer 2 */}
      <polyline points={`${TL[0]+2.8},${TL[1]+3.5} ${TR[0]+2.8},${TR[1]+3.5} ${BL[0]+2.8},${BL[1]+3.5} ${BR[0]+2.8},${BR[1]+3.5}`}
        fill="none" stroke="#0c1e34" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>

      {/* Main Z stroke — chrome aluminum gradient */}
      <polyline points={pts}
        fill="none" stroke={`url(#${idPfx}grad)`} strokeWidth="7.5"
        strokeLinecap="round" strokeLinejoin="round"
        filter={`url(#${idPfx}zDrop)`}/>

      {/* Bright top highlight line (specular reflection) */}
      <polyline points={pts}
        fill="none" stroke="rgba(240,252,255,0.72)" strokeWidth="0.9"
        strokeLinecap="round" strokeLinejoin="round"
        filter={`url(#${idPfx}zSpec)`}/>

      {/* Corner rivets (architectural connector look) */}
      {[TL, TR, BL, BR].map(([px, py], i) => (
        <g key={i}>
          <circle cx={px} cy={py} r={3.2}
            fill="rgba(8,16,30,0.7)" stroke="rgba(201,168,76,0.65)" strokeWidth="0.9"/>
          <circle cx={px} cy={py} r={1.3} fill="#c9a84c" opacity="0.8"/>
        </g>
      ))}
    </g>
  )
}

/* ── Main Logo component ── */
const Logo = ({ variant = 'default', className = '' }) => {
  /*
   * Layout (viewBox 360 × 115):
   *
   * Letters occupy y = 8 → 78  (height = 70)
   * ALUMINYUM text at y = 95–110
   *
   * Equal spacing between O-Z-Z-O:
   *   O diameter = 64   (r=32)
   *   Z width    = 66
   *   Padding    = 16 each side
   *   Total letters = 64+66+66+64 = 260
   *   Gaps = 360 - 32 - 260 = 68  → 3 gaps × 22.67 ≈ 23px each
   *
   *   cxL = 16 + 32 = 48
   *   Z1x = 48 + 32 + 23 = 103   Z1 ends at 169
   *   Z2x = 169 + 23 = 192       Z2 ends at 258
   *   cxR = 258 + 23 + 32 = 313
   *   cxR right edge = 313+32+16 = 361 ≈ 360 ✓
   */
  const cy   = 43
  const cxL  = 48
  const cxR  = 313
  const yT   = cy - 32     //  11
  const yB   = cy + 32     //  75
  const gap  = 23
  const z1x  = cxL + 32 + gap      // 103
  const z1w  = 66
  const z2x  = z1x + z1w + gap     // 192
  const z2w  = 66

  return (
    <div className={`inline-flex flex-col items-center ${className}`} style={{ lineHeight: 0 }}>
      <svg
        viewBox="0 0 360 90"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-label="OZZO Aluminyum"
      >
        <defs>
          {/* ALUMINYUM text gradient */}
          <linearGradient id="aluGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#6a7e92"/>
            <stop offset="22%"  stopColor="#b0c8dc"/>
            <stop offset="45%"  stopColor="#e8f6ff"/>
            <stop offset="68%"  stopColor="#b0c4d8"/>
            <stop offset="100%" stopColor="#607088"/>
          </linearGradient>
          {/* Separator line gradient */}
          <linearGradient id="sepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(201,168,76,0)"/>
            <stop offset="30%"  stopColor="rgba(201,168,76,0.45)"/>
            <stop offset="50%"  stopColor="rgba(201,168,76,0.65)"/>
            <stop offset="70%"  stopColor="rgba(201,168,76,0.45)"/>
            <stop offset="100%" stopColor="rgba(201,168,76,0)"/>
          </linearGradient>
        </defs>

        {/* ── LEFT O ── */}
        <OGlyph cx={cxL} cy={cy} R={32} dir={1}  idPfx="oL"/>

        {/* ── Z Z ── */}
        <ZGlyph x={z1x} yT={yT} yB={yB} w={z1w} idPfx="z1"/>
        <ZGlyph x={z2x} yT={yT} yB={yB} w={z2w} idPfx="z2"/>

        {/* ── RIGHT O ── */}
        <OGlyph cx={cxR} cy={cy} R={32} dir={-1} idPfx="oR"/>

        {/* ── Separator ── (kaldırıldı) */}
      </svg>
    </div>
  )
}

export default Logo
