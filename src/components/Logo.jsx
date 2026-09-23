/* AluSight — alüminyum doğrama gözü
 *
 * Göz gövdesi referans render'dan (src/assets/alusight-eye.png).
 * Görsel içerik kutusuna kırpılmış: 640x501 (kaynak 941x737 bölgesi).
 * Kaynak ölçümleri (941x737 içinde):
 *   lens merkezi  : (472, 366)
 *   lens camı r   : 102 · lens+bilezik r : 126 · petal disk r : 207
 *
 * Merkez lens SVG ile yeniden çizilip görselin üzerine bindirildi; böylece
 * göz bebeği robotik/kademeli olarak 8 yöne (sağ/sol, yukarı/aşağı ve
 * çaprazlar) tarama yapabiliyor.
 */
import eyeSrc from '../assets/alusight-eye.png'

/* ── Kaynak birimden SVG birimine ölçek ── */
const PAD = 2
const BOX_W = 128
const BOX_H = 100
const SRC_W = 941
const SRC_H = 737
const SCALE = Math.min((BOX_W - PAD * 2) / SRC_W, (BOX_H - PAD * 2) / SRC_H) // 0.1303

const IMG_W = SRC_W * SCALE
const IMG_H = SRC_H * SCALE
const IMG_X = PAD + (BOX_W - PAD * 2 - IMG_W) / 2
const IMG_Y = PAD

/* Lens merkezi ve yarıçaplar — SVG birimi */
const LX = IMG_X + 472 * SCALE   // 64.2
const LY = IMG_Y + 366 * SCALE   // 49.7
const R_GLASS = 102 * SCALE      // 13.3
const R_RING  = 126 * SCALE      // 16.4
const R_DISC  = 207 * SCALE      // 27.0
const R_GEAR  = 19.6

export default function Logo({ className = '', wordmark = true }) {
  const vb = wordmark ? `0 0 300 ${BOX_H}` : `0 0 ${BOX_W} ${BOX_H}`

  return (
    <div className={`inline-flex items-center ${className}`} style={{ lineHeight: 0 }}>
      <svg
        viewBox={vb}
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        style={{ display: 'block' }}
        role="img"
        aria-label="AluSight"
      >
        <title>AluSight</title>

        <defs>
          {/* Objektif camı */}
          <radialGradient id="alLensGlass" cx="44%" cy="38%" r="66%">
            <stop offset="0%" stopColor="#2f5f85" />
            <stop offset="30%" stopColor="#183a55" />
            <stop offset="68%" stopColor="#0a1826" />
            <stop offset="100%" stopColor="#040b13" />
          </radialGradient>

          {/* Objektif bileziği — fırçalanmış krom */}
          <linearGradient id="alLensRing" x1="12%" y1="0%" x2="88%" y2="100%">
            <stop offset="0%" stopColor="#fbfdff" />
            <stop offset="18%" stopColor="#c8d9e6" />
            <stop offset="38%" stopColor="#7f95a8" />
            <stop offset="55%" stopColor="#eaf3fa" />
            <stop offset="74%" stopColor="#8aa0b2" />
            <stop offset="100%" stopColor="#4a5f70" />
          </linearGradient>

          <linearGradient id="alGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8e6bb" />
            <stop offset="46%" stopColor="#c9a84c" />
            <stop offset="100%" stopColor="#6f4f13" />
          </linearGradient>

          {/* Lens gölgesi */}
          <radialGradient id="alLensShadow" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#02060b" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#02060b" stopOpacity="0" />
          </radialGradient>

          {/* Hareket alanı — petal diskin içi */}
          <clipPath id="alDiscClip">
            <circle cx={LX} cy={LY} r={R_DISC - 0.4} />
          </clipPath>
        </defs>

        {/* ── Göz gövdesi (referans render) ── */}
        <image href={eyeSrc} x={IMG_X} y={IMG_Y} width={IMG_W} height={IMG_H} />

        {/* ── Hareketli objektif ── */}
        <g clipPath="url(#alDiscClip)">
          {/* Kademeli dönen dişli halka */}
          <g className="alusight-iris-gear">
            <circle
              cx={LX}
              cy={LY}
              r={R_GEAR}
              fill="none"
              stroke="url(#alGold)"
              strokeWidth="0.9"
              strokeDasharray="1.8 2.8"
              opacity="0.5"
            />
          </g>

          {/* Tarama çizgisi — süpürür ve eksenini kademeli döndürür */}
          <g className="alusight-scan-axis">
            <g className="alusight-scanline">
              <rect
                x={LX - 0.35}
                y={LY - R_DISC}
                width="0.7"
                height={R_DISC * 2}
                fill="url(#alGold)"
                opacity="0.4"
              />
            </g>
          </g>

          {/* Göz bebeği — 8 yöne kademeli tarar (sağ/sol, yukarı/aşağı, çaprazlar) */}
          <g className="alusight-pupil">
            <circle cx={LX} cy={LY} r={R_RING + 1.2} fill="url(#alLensShadow)" />
            <circle cx={LX} cy={LY} r={R_RING} fill="url(#alLensRing)" />
            <circle cx={LX} cy={LY} r={R_RING - 1.5} fill="#3f5364" />
            <circle cx={LX} cy={LY} r={R_GLASS} fill="url(#alLensGlass)" />
            <circle
              cx={LX}
              cy={LY}
              r={R_GLASS - 0.5}
              fill="none"
              stroke="#7fb4dd"
              strokeWidth="0.5"
              opacity="0.45"
            />
            {/* Objektif içi yansımalar */}
            <ellipse cx={LX - 3.6} cy={LY - 4.2} rx="3.4" ry="2.3" fill="#a8d4f2" opacity="0.32" />
            <circle cx={LX + 0.6} cy={LY + 0.4} r="2.1" fill="#dff0ff" opacity="0.92" />
            <circle cx={LX + 4.4} cy={LY + 4.8} r="1.1" fill="#ffffff" opacity="0.3" />
          </g>
        </g>

        {/* ── WORDMARK ── */}
        {wordmark && (
          <text
            x="142"
            y="63"
            textAnchor="start"
            fill="#e8f4ff"
            fontFamily="Montserrat, sans-serif"
            fontSize="30"
            fontWeight="700"
            letterSpacing="1.8"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            AluSight
          </text>
        )}
      </svg>
    </div>
  )
}
