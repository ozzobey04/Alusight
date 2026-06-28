import { useEffect, useRef } from 'react'

const features = [
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M20 4 L34 10 L34 22 C34 30 20 36 20 36 C20 36 6 30 6 22 L6 10 Z" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M13 20 L18 25 L27 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Premium Profil Sistemleri',
    desc: 'Avrupa kalite standartlarında üretilmiş profil sistemleri kullanıyoruz. Her projede malzeme kalitesinden ödün vermiyoruz.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <circle cx="20" cy="14" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M8 36 C8 29.4 13.4 24 20 24 C26.6 24 32 29.4 32 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M26 12 L28 10 L36 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="34" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: 'Uzman Mühendis Ekibi',
    desc: 'Alanında sertifikalı, deneyimli teknik ekibimiz projenizin her aşamasında yanınızda.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2" />
        <path d="M20 10 L20 20 L28 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Zamanında Teslimat',
    desc: 'Proje takvimlerine sıkı sıkıya bağlı kalarak teslim tarihi garantisi sunuyoruz.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M6 36 L6 8 L34 8 L34 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M2 36 L38 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="14" y="20" width="12" height="16" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="14" width="8" height="6" stroke="currentColor" strokeWidth="1.5" />
        <rect x="22" y="14" width="8" height="6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: '10 Yıl Garanti',
    desc: 'Uyguladığımız tüm sistemlerde 10 yıl garanti ve yaşam boyu teknik destek sunuyoruz.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M4 28 Q12 14 20 20 Q28 26 36 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="4" cy="28" r="2.5" fill="currentColor" />
        <circle cx="20" cy="20" r="2.5" fill="currentColor" />
        <circle cx="36" cy="12" r="2.5" fill="currentColor" />
      </svg>
    ),
    title: 'Enerji Verimliliği',
    desc: 'Isı köprüsü kesen profil sistemlerimiz enerji tasarrufunu artırır, ısıtma-soğutma maliyetlerinizi düşürür.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <rect x="4" y="10" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M4 18 L36 18" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="14" r="2" fill="currentColor" />
        <circle cx="16" cy="14" r="2" fill="currentColor" />
        <circle cx="22" cy="14" r="2" fill="currentColor" />
        <path d="M10 24 L14 28 L20 22 L26 26 L30 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Ücretsiz Proje Danışmanlığı',
    desc: 'Mimarlar ve tasarımcılarla iş birliği yaparak projenize özel teknik çözümler geliştiriyoruz.',
  },
]

export default function WhyUs() {
  const containerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.anim-init').forEach((el) => {
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

  return (
    <section id="neden-biz" className="py-28 bg-ozzo-800 relative overflow-hidden" ref={containerRef}>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      {/* Background pattern */}
      <div className="absolute inset-0 hero-grid-bg opacity-20" />
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-ozzo-900/50 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
          <div className="anim-init-left">
            <div className="section-subtitle mb-4">Neden OZZO?</div>
            <h2 className="font-display text-4xl md:text-5xl font-800 text-white leading-tight mb-6">
              Fark Yaratan
              <br />
              <span className="text-gradient-gold">6 Temel Değer</span>
            </h2>
            <div className="gold-line mb-6" />
            <p className="text-white/50 text-lg leading-relaxed font-300">
              8 yıllık deneyim ve sektör bilgimizle, alüminyum uygulamalarında
              standartları yeniden tanımlıyoruz.
            </p>
          </div>
          <div className="anim-init-right flex flex-col gap-4 pt-8">
            <div className="flex items-center gap-4 p-5 bg-ozzo-700/50 border border-ozzo-500/30">
              <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <div className="font-display font-600 text-white text-sm">ISO 9001:2015 Kalite Güvencesi</div>
                <div className="text-white/40 text-xs mt-0.5">Uluslararası kalite yönetim sistemi sertifikası</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 bg-ozzo-700/50 border border-ozzo-500/30">
              <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
              <div>
                <div className="font-display font-600 text-white text-sm">Türkiye Geneli Uygulama</div>
                <div className="text-white/40 text-xs mt-0.5">İstanbul'dan tüm illerimize hizmet</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`anim-init anim-delay-${(i % 3) + 1} group flex gap-5 p-6 bg-ozzo-700/40 border border-ozzo-500/30 hover:border-gold-500/30 hover:bg-ozzo-700/60 transition-all duration-300`}
            >
              <div className="text-gold-500/70 group-hover:text-gold-500 transition-colors duration-300 flex-shrink-0 mt-0.5">
                {f.icon}
              </div>
              <div>
                <h3 className="font-display font-600 text-white text-base mb-2 group-hover:text-gold-400 transition-colors duration-300">
                  {f.title}
                </h3>
                <p className="text-white/45 text-sm leading-relaxed font-300">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
