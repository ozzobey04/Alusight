import { useEffect } from 'react'
import { usePlan } from '../hooks/usePaywall'

const PACKAGES = [
  {
    id: 'free',
    name: 'Ücretsiz',
    price: '0',
    period: '',
    color: 'rgba(255,255,255,0.08)',
    border: 'rgba(255,255,255,0.15)',
    badge: null,
    features: [
      'Ayda 3 hesaplama',
      'Katalog arama',
      'Teknik danışman (sınırlı)',
    ],
    locked: ['Araçlar (Öneri, Fabrikasyon, Renk, Şantiye)'],
    cta: 'Mevcut Plan',
    ctaStyle: 'disabled',
  },
  {
    id: 'calc',
    name: 'Hesaplamalar',
    price: '490',
    period: '/ ay',
    color: 'rgba(201,168,76,0.07)',
    border: 'rgba(201,168,76,0.4)',
    badge: null,
    features: [
      'Sınırsız hesaplama',
      'PDF rapor çıktısı',
      'Isı, Karbon, PVC, Cam, Rüzgar',
      'Teknik danışman (tam)',
    ],
    locked: ['Araçlar paketi dahil değil'],
    cta: 'Bu Planı Seç',
    ctaStyle: 'gold',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '1.490',
    period: '/ ay',
    color: 'rgba(201,168,76,0.13)',
    border: '#c9a84c',
    badge: 'En Kapsamlı',
    features: [
      'Hesaplamalar paketinin tamamı',
      'Öneri & Analiz',
      'Fabrikasyon Kontrol',
      'Renk Kataloğu',
      'Şantiye Takip',
      'Öncelikli destek',
    ],
    locked: [],
    cta: 'Bu Planı Seç',
    ctaStyle: 'gold-strong',
  },
]

export default function PaywallModal({ type, onClose }) {
  const { plan, activatePlan } = usePlan()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleSelect(pkg) {
    if (pkg.id === 'free') return
    activatePlan(pkg.id)
    window.open(
      `https://wa.me/905358610404?text=${encodeURIComponent(
        `Merhaba, OZZO ${pkg.name} paketine abone olmak istiyorum (${pkg.price} TL/ay).`
      )}`,
      '_blank'
    )
    onClose()
  }

  const highlight = type === 'tool' ? 'pro' : 'calc'

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(4,8,16,0.92)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        width: '100%', maxWidth: 860,
        background: 'linear-gradient(160deg,#0a1422,#060c18)',
        border: '1px solid rgba(201,168,76,0.25)',
        borderRadius: 20,
        padding: '36px 32px 32px',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Kapat */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.4)', fontSize: 22, lineHeight: 1,
          }}
        >×</button>

        {/* Başlık */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-block', background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: 8, padding: '4px 14px',
            color: '#c9a84c', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.1em', marginBottom: 12,
            fontFamily: 'Montserrat, sans-serif',
          }}>
            {type === 'tool' ? 'ARAÇLAR PAKETİ GEREKLİ' : 'AYLIK LİMİT DOLDU'}
          </div>
          <h2 style={{
            color: '#fff', fontFamily: 'Playfair Display, serif',
            fontSize: 26, fontWeight: 700, margin: 0,
          }}>
            {type === 'tool'
              ? 'Bu araç Pro pakette yer alıyor'
              : 'Ücretsiz kullanım hakkınız bitti'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 8 }}>
            Devam etmek için bir plan seçin veya abone olmak için bizimle iletişime geçin.
          </p>
        </div>

        {/* Paketler */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}>
          {PACKAGES.map(pkg => {
            const isHighlight = pkg.id === highlight
            const isCurrent   = pkg.id === plan
            return (
              <div key={pkg.id} style={{
                background: pkg.color,
                border: `1.5px solid ${isHighlight ? pkg.border : pkg.border}`,
                borderRadius: 14,
                padding: '22px 20px',
                position: 'relative',
                boxShadow: isHighlight ? '0 0 28px rgba(201,168,76,0.15)' : 'none',
                transition: 'transform .2s',
              }}>
                {pkg.badge && (
                  <div style={{
                    position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(90deg,#c9a84c,#ffe090)',
                    borderRadius: 20, padding: '3px 14px',
                    fontSize: 10, fontWeight: 800,
                    color: '#060c18', letterSpacing: '0.08em',
                    fontFamily: 'Montserrat, sans-serif',
                    whiteSpace: 'nowrap',
                  }}>{pkg.badge}</div>
                )}

                <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, color: '#c9a84c', marginBottom: 6 }}>
                  {pkg.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: 'Montserrat, sans-serif' }}>
                    {pkg.price === '0' ? 'Ücretsiz' : `₺${pkg.price}`}
                  </span>
                  {pkg.period && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{pkg.period}</span>}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14, marginBottom: 16 }}>
                  {pkg.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 7 }}>
                      <span style={{ color: '#c9a84c', fontSize: 12, marginTop: 1, flexShrink: 0 }}>✓</span>
                      <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>{f}</span>
                    </div>
                  ))}
                  {pkg.locked.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 7 }}>
                      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 1, flexShrink: 0 }}>✗</span>
                      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSelect(pkg)}
                  disabled={pkg.ctaStyle === 'disabled' || isCurrent}
                  style={{
                    width: '100%',
                    padding: '9px 0',
                    borderRadius: 8,
                    border: 'none',
                    cursor: (pkg.ctaStyle === 'disabled' || isCurrent) ? 'default' : 'pointer',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: '0.05em',
                    background: isCurrent
                      ? 'rgba(255,255,255,0.06)'
                      : pkg.ctaStyle === 'gold-strong'
                        ? 'linear-gradient(90deg,#c9a84c,#ffe090)'
                        : pkg.ctaStyle === 'gold'
                          ? 'rgba(201,168,76,0.15)'
                          : 'rgba(255,255,255,0.04)',
                    color: isCurrent
                      ? 'rgba(255,255,255,0.3)'
                      : pkg.ctaStyle === 'gold-strong'
                        ? '#060c18'
                        : pkg.ctaStyle === 'gold'
                          ? '#c9a84c'
                          : 'rgba(255,255,255,0.3)',
                    border: pkg.ctaStyle === 'gold'
                      ? '1px solid rgba(201,168,76,0.35)'
                      : '1px solid transparent',
                  }}
                >
                  {isCurrent ? 'Mevcut Plan' : pkg.cta}
                </button>
              </div>
            )
          })}
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 20 }}>
          Abonelik için WhatsApp'tan iletişime geçilir • Ödeme onayından sonra plan aktifleşir
        </p>
      </div>
    </div>
  )
}
