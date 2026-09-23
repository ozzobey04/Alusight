import { useEffect, useRef, useState } from 'react'

const serviceOptions = [
  'Alüminyum Doğrama (Pencere & Kapı)',
  'Giydirme Cephe / Curtain Wall',
  'Cam Balkon & Korkuluk Sistemleri',
  'Ofis Bölme Sistemleri',
  'Pergola & Tente Sistemleri',
  'Endüstriyel & Özel Çözümler',
  'Diğer',
]

const AI_TIPS = {
  default: {
    icon: '◈',
    title: 'AluSight Öneri',
    text: 'Formu doldururken AluSight asistanımız size en uygun profil serisini önerecektir.',
  },
  'Alüminyum Doğrama (Pencere & Kapı)': {
    icon: '◉',
    title: 'Yalıtımlı Seri Önerisi',
    text: 'Pencere & kapı projeleri için AluSight Yalıtımlı Seri önerilir. PA66 termal köprü kesici ile A sınıfı enerji verimliliği sağlar.',
    tag: 'Yalıtımlı Seri',
  },
  'Giydirme Cephe / Curtain Wall': {
    icon: '◈',
    title: 'Curtain Wall Sistemi',
    text: 'Giydirme cephe için yüzey alanı ve bina yüksekliğine göre 50mm–65mm profil derinliği belirlenmektedir. Statik hesap gereklidir.',
    tag: 'Cephe Sistemi',
  },
  'Cam Balkon & Korkuluk Sistemleri': {
    icon: '◎',
    title: 'Cam Korkuluk Sürme',
    text: 'Balkon sistemleri için sürme profil serisi ile tamamen cam cephe elde edilebilir. Temperli & lamine cam kombinasyonu önerilir.',
    tag: 'Sürme Sistemi',
  },
  'Ofis Bölme Sistemleri': {
    icon: '◈',
    title: 'Ofis Bölme Profili',
    text: '75mm–100mm alüminyum bölme profilleri ile ses yalıtımı sağlanır. Çift cidarlı cam seçeneği ile gizlilik arttırılır.',
    tag: 'Bölme Serisi',
  },
  'Pergola & Tente Sistemleri': {
    icon: '◉',
    title: 'Pergola Sistemi',
    text: 'Motorlu pergola sistemleri için döner kanat açısı 0°–135° arasında ayarlanabilmektedir. Yağmur sensörü entegrasyonu mevcuttur.',
    tag: 'Pergola Serisi',
  },
  'Endüstriyel & Özel Çözümler': {
    icon: '◎',
    title: 'Özel Profil Çözümü',
    text: 'Endüstriyel projeler için özel ekstrüzyon profil üretimi yapılmaktadır. Minimum sipariş miktarı ve teknik detaylar için uzmanlarımızı arayın.',
    tag: 'Özel Üretim',
  },
}

function AIPanel({ service }) {
  const tip = AI_TIPS[service] || AI_TIPS.default
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [service])

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(10,16,26,0.95) 0%, rgba(14,22,36,0.95) 100%)',
        border: '1px solid rgba(201,168,76,0.3)',
        borderRadius: 12,
        padding: '18px 20px',
        marginBottom: 20,
        position: 'relative',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
    >
      {/* Glow accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)',
      }}/>
      <div style={{
        position: 'absolute', top: -40, right: -20, width: 100, height: 100,
        background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: 'rgba(201,168,76,0.12)',
          border: '1px solid rgba(201,168,76,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, color: '#c9a84c',
        }}>
          {tip.icon}
        </div>
        <div>
          <div style={{
            fontFamily: 'Montserrat,sans-serif', fontSize: 10, letterSpacing: 1.5,
            color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase',
          }}>
            AluSight · Akıllı Öneri
          </div>
          <div style={{
            fontFamily: 'Montserrat,sans-serif', fontSize: 13, fontWeight: 600,
            color: '#c9a84c', marginTop: 1,
          }}>
            {tip.title}
          </div>
        </div>
        {tip.tag && (
          <div style={{
            marginLeft: 'auto',
            padding: '3px 9px',
            border: '1px solid rgba(201,168,76,0.35)',
            borderRadius: 20,
            fontFamily: 'Montserrat,sans-serif', fontSize: 9.5,
            color: 'rgba(201,168,76,0.8)', letterSpacing: 0.5,
            background: 'rgba(201,168,76,0.07)',
          }}>
            {tip.tag}
          </div>
        )}
      </div>

      <p style={{
        fontFamily: 'Montserrat,sans-serif', fontSize: 12.5, lineHeight: 1.6,
        color: 'rgba(200,220,240,0.7)',
      }}>
        {tip.text}
      </p>

      {/* Animated scan line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)',
        animation: 'quoteScan 3s linear infinite',
      }}/>
    </div>
  )
}

export default function Quote() {
  const containerRef = useRef(null)
  const [form, setForm] = useState({
    name: '', phone: '', email: '', city: '', service: '', area: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submittedContact, setSubmittedContact] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.anim-init, .anim-init-left, .anim-init-right').forEach((el) => {
              el.classList.add('visible-anim')
            })
          }
        })
      },
      { threshold: 0.1 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const contactCopy = form.email || form.phone || '—'
    // TODO: Backend entegrasyonu buraya eklenebilir
    // eslint-disable-next-line no-console
    console.log('[Teklif Talebi]', form)
    setSubmittedContact(contactCopy)
    setSubmitted(true)
    setForm({ name: '', phone: '', email: '', city: '', service: '', area: '', message: '' })
  }

  const handleReset = () => setSubmitted(false)

  return (
    <section id="teklif" className="py-28 bg-alusight-800 relative overflow-hidden" ref={containerRef}>
      <style>{`
        @keyframes quoteScan { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
      `}</style>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      <div className="absolute inset-0 hero-grid-bg opacity-15" />
      <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-alusight-900/60 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-5 gap-14 items-start">

          {/* Left info panel */}
          <div className="lg:col-span-2 anim-init-left">
            <div className="section-subtitle mb-4">Teklif Formu</div>
            <h2 className="font-display text-4xl md:text-5xl font-800 text-white leading-tight mb-6">
              Projeniz İçin
              <br />
              <span className="text-gradient-gold">Teklif Alın</span>
            </h2>
            <div className="gold-line mb-8" />

            <p className="text-white/50 text-base leading-relaxed font-300 mb-10">
              Formu doldurun, uzman ekibimiz en kısa sürede sizinle iletişime geçsin.
              Ücretsiz keşif ve danışmanlık hizmeti sunuyoruz.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  ),
                  label: 'Telefon',
                  value: '+90 535 861 0404',
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  label: 'E-posta',
                  value: 'teklif@alusight.com',
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  label: 'Çalışma Saatleri',
                  value: 'Pzt–Cuma: 08:00–16:00',
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-gold-500/25 flex items-center justify-center text-gold-500 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-white/35 text-xs uppercase tracking-wider font-display mb-0.5">{item.label}</div>
                    <div className="text-white text-sm font-500">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI feature badge */}
            <div style={{
              marginTop: 32,
              padding: '12px 16px',
              background: 'rgba(201,168,76,0.06)',
              border: '1px solid rgba(201,168,76,0.22)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'rgba(201,168,76,0.12)',
                border: '1px solid rgba(201,168,76,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="4" stroke="#c9a84c" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="1.5" fill="#c9a84c"/>
                  {[0,90,180,270].map((d,i) => (
                    <line key={i}
                      x1={12 + Math.cos(d * Math.PI/180) * 5.5} y1={12 + Math.sin(d * Math.PI/180) * 5.5}
                      x2={12 + Math.cos(d * Math.PI/180) * 9}   y2={12 + Math.sin(d * Math.PI/180) * 9}
                      stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round"
                    />
                  ))}
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 11, fontWeight: 600, color: '#c9a84c', letterSpacing: 0.5 }}>
                  AluSight Destekli Form
                </div>
                <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 10.5, color: 'rgba(200,220,240,0.5)', marginTop: 1 }}>
                  Seçiminize göre akıllı öneriler sunulur
                </div>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="lg:col-span-3 anim-init-right">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center p-10 lg:p-16 bg-alusight-700/50 border border-gold-500/30 text-center animate-fade-in">
                <div className="w-20 h-20 bg-gold-500/15 border border-gold-500/30 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-700 text-white mb-3">Talebiniz Alındı</h3>
                <p className="text-white/50 font-300 max-w-md mb-2">
                  Teşekkür ederiz. Talebiniz uzman ekibimize iletildi; en kısa sürede size dönüş yapacağız.
                </p>
                <p className="text-white/30 text-xs mb-8">
                  Kopya: {submittedContact}
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl border border-white/15 text-white/60 hover:text-white hover:bg-white/5 text-sm transition-all"
                >
                  Yeni Teklif Talebi
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-alusight-700/30 border border-alusight-500/30 p-8 lg:p-10">

                {/* AI Suggestion Panel */}
                <AIPanel service={form.service} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  {[
                    { name: 'name',  label: 'Ad Soyad',         type: 'text',  placeholder: 'Ahmet Yılmaz',         required: true },
                    { name: 'phone', label: 'Telefon Numarası', type: 'tel',   placeholder: '+90 5XX XXX XX XX',    required: true },
                    { name: 'email', label: 'E-posta Adresi',   type: 'email', placeholder: 'ornek@mail.com',       required: true },
                    { name: 'city',  label: 'Şehir',            type: 'text',  placeholder: 'İstanbul',             required: false },
                    { name: 'area',  label: 'Yaklaşık Alan (m²)',type: 'text', placeholder: 'ör. 500 m²',           required: false },
                  ].map((field) => (
                    <div key={field.name} className={field.name === 'area' ? 'md:col-span-1' : ''}>
                      <label className="block text-white/50 text-xs font-display tracking-wider uppercase mb-2">
                        {field.label} {field.required && <span className="text-gold-500">*</span>}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full bg-alusight-900/60 border border-alusight-400/40 focus:border-gold-500/60 text-white placeholder-white/20 text-sm px-4 py-3 outline-none transition-colors duration-200 font-300"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-white/50 text-xs font-display tracking-wider uppercase mb-2">
                      Hizmet Türü <span className="text-gold-500">*</span>
                    </label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      required
                      className="w-full bg-alusight-900/60 border border-alusight-400/40 focus:border-gold-500/60 text-white text-sm px-4 py-3 outline-none transition-colors duration-200 font-300 appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-alusight-900">Hizmet seçiniz...</option>
                      {serviceOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-alusight-900">{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-white/50 text-xs font-display tracking-wider uppercase mb-2">
                    Proje Detayları
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Projeniz hakkında kısa bilgi veriniz (konum, bina tipi, özel gereksinimler...)"
                    className="w-full bg-alusight-900/60 border border-alusight-400/40 focus:border-gold-500/60 text-white placeholder-white/20 text-sm px-4 py-3 outline-none transition-colors duration-200 font-300 resize-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full justify-center text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Ücretsiz Teklif Talebi Gönder
                </button>

                <p className="text-white/25 text-xs text-center mt-4 font-300">
                  Bilgileriniz gizli tutulur, üçüncü taraflarla paylaşılmaz.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
