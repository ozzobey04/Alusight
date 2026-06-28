import { useEffect, useRef } from 'react'

const categories = [
  { label: 'Alüminyum Doğrama', count: '200+' },
  { label: 'Giydirme Cephe',    count: '120+' },
  { label: 'Cam Korkuluk',      count: '180+' },
  { label: 'Ofis Bölme',        count: '90+'  },
  { label: 'Pergola & Tente',   count: '80+'  },
  { label: 'Endüstriyel',       count: '80+'  },
]

export default function Projects() {
  const containerRef = useRef(null)

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

  return (
    <section id="projeler" className="py-28 bg-ozzo-900 relative overflow-hidden" ref={containerRef}>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="text-center mb-16 anim-init">
          <div className="section-subtitle mb-4">Referanslarımız</div>
          <h2 className="font-display text-4xl md:text-5xl font-800 text-white mb-6">
            Tamamlanan Projeler
          </h2>
          <div className="flex justify-center mb-8">
            <div className="gold-line" />
          </div>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-300">
            20 yıllık süreçte 750'yi aşkın projeyi başarıyla tamamladık.
            Referans listesi ve proje detayları için bizimle iletişime geçin.
          </p>
        </div>

        {/* Animated decorative element */}
        <div className="flex justify-center mb-16 anim-init">
          <svg viewBox="0 0 600 160" className="w-full max-w-2xl opacity-70">
            <defs>
              <linearGradient id="barGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="transparent"/>
                <stop offset="20%"  stopColor="#c9a84c"/>
                <stop offset="80%"  stopColor="#c9a84c"/>
                <stop offset="100%" stopColor="transparent"/>
              </linearGradient>
            </defs>
            {/* Horizontal center line */}
            <line x1="0" y1="80" x2="600" y2="80" stroke="url(#barGrad)" strokeWidth="0.5"/>
            {/* Big stat numbers */}
            {[
              { x: 75,  label: '750+', sub: 'Proje'       },
              { x: 200, label: '20+',  sub: 'Yıl'         },
              { x: 320, label: '6',    sub: 'Hizmet Dalı' },
              { x: 440, label: '80K+', sub: 'm² Alan'     },
              { x: 560, label: '2K+',  sub: 'Müşteri'     },
            ].map((s) => (
              <g key={s.x}>
                <circle cx={s.x} cy="80" r="4" fill="#c9a84c" opacity="0.7"/>
                <line x1={s.x} y1="80" x2={s.x} y2="40" stroke="#c9a84c" strokeWidth="0.5" opacity="0.4"/>
                <text x={s.x} y="32" textAnchor="middle"
                  fontFamily="Montserrat,sans-serif" fontSize="18" fontWeight="800"
                  fill="#c9a84c">
                  {s.label}
                </text>
                <text x={s.x} y="22" textAnchor="middle"
                  fontFamily="Montserrat,sans-serif" fontSize="7" fontWeight="400"
                  letterSpacing="2" fill="rgba(201,168,76,0.55)">
                  {s.sub.toUpperCase()}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-16 anim-init">
          {categories.map((cat, i) => (
            <div
              key={cat.label}
              className={`anim-init anim-delay-${(i % 3) + 1} relative bg-ozzo-700/40 border border-ozzo-500/30 hover:border-gold-500/40 p-5 text-center group transition-all duration-300 overflow-hidden`}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"/>
              <div className="font-display text-2xl font-800 text-gradient-gold mb-1">{cat.count}</div>
              <div className="text-white/45 text-xs tracking-wide font-300 leading-snug">{cat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="anim-init relative border border-gold-500/20 bg-ozzo-700/20 p-10 md:p-14 overflow-hidden">
          <div className="absolute inset-0 hero-grid-bg opacity-20"/>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-gold-500 to-transparent"/>
          <div className="relative text-center">
            <div className="section-subtitle mb-4">Projenizi Birlikte Hayata Geçirelim</div>
            <h3 className="font-display text-2xl md:text-3xl font-800 text-white mb-6">
              Proje Referansları ve Portföyümüz İçin
              <br/>
              <span className="text-gradient-gold">Ekibimizle İletişime Geçin</span>
            </h3>
            <button
              onClick={() => document.getElementById('teklif')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              İletişime Geç
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
