import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PLANS = [
  {
    id: 'free',
    name: 'Ücretsiz',
    price: '0',
    period: '',
    subtitle: 'Tanımak için başla',
    color: 'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.1)',
    highlight: false,
    features: [
      { text: 'Ayda 3 hesaplama hakkı', ok: true },
      { text: 'Katalog arama (500+ sistem)', ok: true },
      { text: 'Teknik danışman (sınırlı)', ok: true },
      { text: 'PDF rapor çıktısı', ok: false },
      { text: 'Sınırsız hesaplama', ok: false },
      { text: 'Araçlar paketi', ok: false },
      { text: 'Şantiye takip', ok: false },
    ],
    cta: 'Ücretsiz Başla',
    ctaType: 'outline',
    whatsapp: null,
  },
  {
    id: 'calc',
    name: 'Hesaplamalar',
    price: '490',
    period: '/ ay',
    subtitle: 'Mühendislik hesapları için',
    color: 'rgba(201,168,76,0.06)',
    border: 'rgba(201,168,76,0.35)',
    highlight: false,
    features: [
      { text: 'Sınırsız hesaplama', ok: true },
      { text: 'PDF rapor çıktısı', ok: true },
      { text: 'Isı Geçirgenlik (Flixo)', ok: true },
      { text: 'Karbon Ayak İzi', ok: true },
      { text: 'Cam & Rüzgar hesabı', ok: true },
      { text: 'Teknik danışman (tam)', ok: true },
      { text: 'Araçlar paketi', ok: false },
    ],
    cta: 'Abone Ol',
    ctaType: 'gold',
    whatsapp: 'Merhaba, AluSight Hesaplamalar paketine abone olmak istiyorum (490 TL/ay).',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '1.490',
    period: '/ ay',
    subtitle: 'Tam kapsamlı platform erişimi',
    color: 'rgba(201,168,76,0.1)',
    border: '#c9a84c',
    highlight: true,
    badge: 'En Popüler',
    features: [
      { text: 'Hesaplamalar paketinin tamamı', ok: true },
      { text: 'Öneri & Sistem Analizi', ok: true },
      { text: 'Fabrikasyon Kontrol', ok: true },
      { text: 'RAL Renk Kataloğu', ok: true },
      { text: 'Şantiye Takip', ok: true },
      { text: 'Öncelikli destek', ok: true },
      { text: 'Yeni özellik erken erişim', ok: true },
    ],
    cta: 'Abone Ol',
    ctaType: 'gold-strong',
    whatsapp: 'Merhaba, AluSight Pro paketine abone olmak istiyorum (1.490 TL/ay).',
  },
]

const FAQ = [
  {
    q: 'Ödeme nasıl yapılıyor?',
    a: 'WhatsApp üzerinden iletişime geçtikten sonra banka transferi veya havale ile ödeme alınır. Ödeme onaylandıktan sonra planınız aynı gün aktifleşir.',
  },
  {
    q: 'İstediğim zaman iptal edebilir miyim?',
    a: 'Evet, aboneliğinizi herhangi bir ayın sonunda iptal edebilirsiniz. Ek ücret veya ceza uygulanmaz.',
  },
  {
    q: 'Ücretsiz plandan geçiş yaparsam verilerim kaybolur mu?',
    a: 'Hayır. Tüm hesaplama geçmişiniz ve proje verileriniz korunur.',
  },
  {
    q: 'Fatura alabilir miyim?',
    a: 'Evet, talep edilmesi durumunda e-fatura/e-arşiv fatura düzenlenmektedir.',
  },
]

export default function PricingPage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)

  function handleCta(plan) {
    if (plan.id === 'free') {
      navigate('/')
      return
    }
    window.open(
      `https://wa.me/905358610404?text=${encodeURIComponent(plan.whatsapp)}`,
      '_blank'
    )
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 110, paddingBottom: 80, fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '0 24px' }}>

        {/* Başlık */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: 20, padding: '4px 16px',
            color: '#c9a84c', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.12em', marginBottom: 16,
          }}>
            PLANLAR & FİYATLAR
          </div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 700, color: '#fff', margin: '0 0 14px',
          }}>
            İhtiyacınıza Uygun Planı Seçin
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
            Ücretsiz başlayın, büyüdükçe yükseltin. Tüm planlar aylık, taahhütsüz.
          </p>
        </div>

        {/* Kartlar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
          marginBottom: 72,
        }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{
              background: plan.color,
              border: `${plan.highlight ? '2px' : '1.5px'} solid ${plan.border}`,
              borderRadius: 18,
              padding: '32px 28px 28px',
              position: 'relative',
              boxShadow: plan.highlight ? '0 0 48px rgba(201,168,76,0.12)' : 'none',
              display: 'flex', flexDirection: 'column',
            }}>
              {plan.badge && (
                <div style={{
                  position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(90deg,#c9a84c,#ffe090)',
                  borderRadius: 20, padding: '4px 18px',
                  fontSize: 10, fontWeight: 800, color: '#060c18',
                  letterSpacing: '0.08em', whiteSpace: 'nowrap',
                }}>{plan.badge}</div>
              )}

              <div style={{ color: '#c9a84c', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>
                {plan.name.toUpperCase()}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 18 }}>
                {plan.subtitle}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 24 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>
                  {plan.price === '0' ? 'Ücretsiz' : `₺${plan.price}`}
                </span>
                {plan.period && (
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{plan.period}</span>
                )}
              </div>

              <div style={{ flex: 1, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20, marginBottom: 24 }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                    <span style={{
                      width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                      background: f.ok ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, color: f.ok ? '#c9a84c' : 'rgba(255,255,255,0.15)',
                    }}>
                      {f.ok ? '✓' : '✗'}
                    </span>
                    <span style={{ fontSize: 13, color: f.ok ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)' }}>
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleCta(plan)}
                style={{
                  width: '100%', padding: '12px 0',
                  borderRadius: 10, cursor: 'pointer',
                  fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
                  fontSize: 13, letterSpacing: '0.05em',
                  transition: 'opacity .2s, transform .15s',
                  background:
                    plan.ctaType === 'gold-strong' ? 'linear-gradient(90deg,#c9a84c,#ffe090)' :
                    plan.ctaType === 'gold'        ? 'rgba(201,168,76,0.12)' :
                                                     'rgba(255,255,255,0.06)',
                  color:
                    plan.ctaType === 'gold-strong' ? '#060c18' :
                    plan.ctaType === 'gold'        ? '#c9a84c' :
                                                     'rgba(255,255,255,0.5)',
                  border:
                    plan.ctaType === 'gold'   ? '1px solid rgba(201,168,76,0.3)' :
                    plan.ctaType === 'outline' ? '1px solid rgba(255,255,255,0.12)' : 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Karşılaştırma notu */}
        <div style={{
          background: 'rgba(201,168,76,0.05)',
          border: '1px solid rgba(201,168,76,0.15)',
          borderRadius: 14, padding: '20px 28px',
          display: 'flex', alignItems: 'center', gap: 16,
          marginBottom: 64,
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 22 }}>💬</span>
          <div>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
              Hangi planın size uygun olduğundan emin değil misiniz?
            </div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
              WhatsApp'tan bize ulaşın, ihtiyacınızı dinleyip en uygun planı birlikte belirleyelim.
            </div>
          </div>
          <button
            onClick={() => window.open('https://wa.me/905358610404?text=' + encodeURIComponent('Merhaba, AluSight platform planları hakkında bilgi almak istiyorum.'), '_blank')}
            style={{
              marginLeft: 'auto', background: '#25D366', border: 'none', borderRadius: 8,
              padding: '10px 20px', color: '#fff', fontWeight: 700, fontSize: 12,
              cursor: 'pointer', whiteSpace: 'nowrap', letterSpacing: '0.04em',
            }}
          >
            WhatsApp'tan Yaz
          </button>
        </div>

        {/* SSS */}
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 24, fontWeight: 700, color: '#fff',
            textAlign: 'center', marginBottom: 32,
          }}>
            Sıkça Sorulan Sorular
          </h2>
          {FAQ.map((item, i) => (
            <div key={i} style={{
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              marginBottom: 4,
            }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 0', textAlign: 'left',
                  color: openFaq === i ? '#c9a84c' : 'rgba(255,255,255,0.8)',
                  fontSize: 14, fontWeight: 600, fontFamily: 'Montserrat, sans-serif',
                  transition: 'color .2s',
                }}
              >
                {item.q}
                <span style={{
                  fontSize: 18, color: '#c9a84c', flexShrink: 0, marginLeft: 12,
                  transform: openFaq === i ? 'rotate(45deg)' : 'none',
                  transition: 'transform .2s',
                  display: 'inline-block',
                }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{
                  color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.7,
                  paddingBottom: 16,
                }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
