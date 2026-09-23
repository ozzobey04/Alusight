import { useEffect, useRef } from 'react'
import Logo from './Logo'

export default function Hero() {
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    setTimeout(() => el.classList.add('visible-anim'), 1200)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* Deep dark background */}
      <div className="absolute inset-0 bg-gradient-to-br from-alusight-950 via-alusight-900 to-[#0d0d20]" />

      {/* Architectural grid overlay */}
      <div className="absolute inset-0 hero-grid-bg opacity-100" />

      {/* Radial glow — left gold */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-[120px] pointer-events-none" />
      {/* Radial glow — right silver-blue */}
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-400/3 blur-[100px] pointer-events-none" />

      {/* Geometric decorative lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Large diagonal architectural element top-left */}
        <line x1="0" y1="20%" x2="20%" y2="0" stroke="rgba(201,168,76,0.07)" strokeWidth="1" />
        <line x1="0" y1="40%" x2="35%" y2="0" stroke="rgba(201,168,76,0.05)" strokeWidth="0.5" />
        {/* Right corner */}
        <line x1="100%" y1="60%" x2="65%" y2="100%" stroke="rgba(201,168,76,0.06)" strokeWidth="1" />
        <line x1="100%" y1="40%" x2="80%" y2="100%" stroke="rgba(201,168,76,0.04)" strokeWidth="0.5" />
        {/* Horizontal accent */}
        <line x1="5%" y1="85%" x2="30%" y2="85%" stroke="rgba(201,168,76,0.12)" strokeWidth="0.5" />
        <line x1="70%" y1="15%" x2="95%" y2="15%" stroke="rgba(201,168,76,0.12)" strokeWidth="0.5" />
        {/* Corner brackets */}
        <path d="M 40 40 L 40 80 L 80 80" fill="none" stroke="rgba(201,168,76,0.2)" strokeWidth="1.5" />
        <path d="M calc(100% - 40px) 40 L calc(100% - 40px) 80 L calc(100% - 80px) 80" fill="none" stroke="rgba(201,168,76,0.2)" strokeWidth="1.5" />
      </svg>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6 flex flex-col items-center">

        {/* Large hero logo — sadece göz, wordmark yok */}
        <div className="animate-float mt-24 md:mt-20 mb-8">
          <Logo className="w-40 md:w-48 lg:w-56" wordmark={false} />
        </div>

        {/* Divider with accent */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold-500" />
          <div className="w-2 h-2 rotate-45 bg-gold-500" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold-500" />
        </div>

        {/* Main tagline */}
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-800 tracking-tight mb-4 leading-none">
          <span className="text-white">EN YÜKSEK</span>
          <br />
          <span className="text-gradient-gold">KALİTEYE ULAŞ</span>
        </h1>

        {/* Sub-tagline */}
        <p className="font-display text-sm md:text-base tracking-[0.3em] uppercase text-white/75 font-300 mb-6">
          Mimarlığa Değer Katan Alüminyum Çözümleri
        </p>

        {/* Description */}
        <p className="text-white/85 text-base md:text-lg font-300 max-w-2xl leading-relaxed mb-12 text-balance">
          Alüminyum doğrama, giydirme cephe, cam korkuluk ve özel mimari çözümlerde
          yılların deneyimi ve mühendislik hassasiyetiyle hizmetinizdeyiz.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button onClick={() => scrollTo('teklif')} className="btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Ücretsiz Teklif Al
          </button>
          <button onClick={() => scrollTo('projeler')} className="btn-outline">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Projelerimizi İncele
          </button>
        </div>

        {/* Quick stats row */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {[
            { num: '8+',   label: 'Yıl Deneyim' },
            { num: '100+', label: 'Tamamlanan Proje' },
            { num: '100+', label: 'Mutlu Müşteri' },
            { num: '20K+', label: 'm² Uygulama' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-2xl font-800 text-gradient-gold">{s.num}</div>
              <div className="text-white/65 text-xs tracking-wider uppercase mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="anim-init absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => scrollTo('hizmetler')}
      >
        <span className="text-white/60 text-xs tracking-[0.2em] uppercase font-display">Keşfet</span>
        <div className="w-px h-10 bg-gradient-to-b from-gold-500/60 to-transparent" />
        <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse-gold" />
      </div>
    </section>
  )
}
