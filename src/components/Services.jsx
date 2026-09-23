import { useEffect, useRef } from 'react'

const services = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <rect x="4" y="4" width="40" height="40" rx="2" stroke="currentColor" strokeWidth="2.5" />
        <line x1="24" y1="4" x2="24" y2="44" stroke="currentColor" strokeWidth="2" />
        <line x1="4" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="24" r="3" fill="currentColor" />
        <rect x="8" y="8" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="28" y="8" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="8" y="28" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="28" y="28" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: 'Alüminyum Doğrama',
    subtitle: 'Pencere & Kapı Sistemleri',
    desc: 'Yüksek ısı yalıtımlı, ses geçirmez alüminyum pencere ve kapı sistemleri. Hem estetik hem de fonksiyonel çözümler.',
    tags: ['Sürgülü', 'Kanatlı', 'Akordeon', 'Sürme Kapı'],
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <rect x="4" y="4" width="40" height="40" rx="1" stroke="currentColor" strokeWidth="2.5" />
        <line x1="16" y1="4" x2="16" y2="44" stroke="currentColor" strokeWidth="1.5" />
        <line x1="28" y1="4" x2="28" y2="44" stroke="currentColor" strokeWidth="1.5" />
        <line x1="40" y1="4" x2="40" y2="44" stroke="currentColor" strokeWidth="1.5" />
        <line x1="4" y1="16" x2="44" y2="16" stroke="currentColor" strokeWidth="1.5" />
        <line x1="4" y1="28" x2="44" y2="28" stroke="currentColor" strokeWidth="1.5" />
        <line x1="4" y1="40" x2="44" y2="40" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: 'Giydirme Cephe',
    subtitle: 'Curtain Wall Sistemleri',
    desc: 'Modern binaların simgesi olan cam-alüminyum giydirme cephe sistemleri. Enerji verimliliği ve estetik bir arada.',
    tags: ['Stick Sistem', 'Unitize', 'Strüktürel', 'Yarı Strüktürel'],
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <path d="M4 44 L44 44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M4 32 L44 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="10" y1="32" x2="10" y2="44" stroke="currentColor" strokeWidth="2" />
        <line x1="22" y1="32" x2="22" y2="44" stroke="currentColor" strokeWidth="2" />
        <line x1="34" y1="32" x2="34" y2="44" stroke="currentColor" strokeWidth="2" />
        <path d="M4 8 Q24 4 44 8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M10 8 L10 32" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
        <path d="M22 8 L22 32" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
        <path d="M34 8 L34 32" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
      </svg>
    ),
    title: 'Cam Balkon & Korkuluk',
    subtitle: 'Şeffaf Güvenlik Sistemleri',
    desc: 'Balkon ve teraslarınız için temperli cam korkuluk ve cam balkon sistemleri. Maksimum görüş, maksimum güvenlik.',
    tags: ['Cam Balkon', 'Paslanmaz Korkuluk', 'Alüminyum Korkuluk', 'Fransız Balkon'],
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <rect x="4" y="4" width="40" height="40" rx="1" stroke="currentColor" strokeWidth="2.5" />
        <line x1="20" y1="4" x2="20" y2="44" stroke="currentColor" strokeWidth="2.5" />
        <rect x="8" y="16" width="8" height="16" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
        <line x1="24" y1="18" x2="40" y2="18" stroke="currentColor" strokeWidth="1.5" />
        <line x1="24" y1="24" x2="40" y2="24" stroke="currentColor" strokeWidth="1.5" />
        <line x1="24" y1="30" x2="40" y2="30" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: 'Ofis Bölme Sistemleri',
    subtitle: 'Akıllı Çalışma Alanları',
    desc: 'Açık ofis alanlarını işlevsel çalışma birimlerine dönüştüren cam ve alüminyum bölme sistemleri.',
    tags: ['Tek Cam', 'Çift Cam', 'Jalüzi Bölme', 'Kapı Sistemleri'],
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <path d="M2 18 L24 8 L46 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="6" y1="18" x2="6" y2="44" stroke="currentColor" strokeWidth="2" />
        <line x1="42" y1="18" x2="42" y2="44" stroke="currentColor" strokeWidth="2" />
        <line x1="2" y1="18" x2="46" y2="18" stroke="currentColor" strokeWidth="2" />
        <line x1="10" y1="18" x2="10" y2="44" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="18" y1="18" x2="18" y2="44" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="26" y1="18" x2="26" y2="44" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="34" y1="18" x2="34" y2="44" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
      </svg>
    ),
    title: 'Pergola & Tente Sistemleri',
    subtitle: 'Dış Mekan Çözümleri',
    desc: 'Terası ve bahçenizi dört mevsim kullanılabilir hale getiren motorlu pergola, tente ve kış bahçesi sistemleri.',
    tags: ['Motorlu Pergola', 'Akordeon Tente', 'Kış Bahçesi', 'Güneşlik'],
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <rect x="4" y="20" width="40" height="24" rx="1" stroke="currentColor" strokeWidth="2.5" />
        <path d="M12 20 L12 4 L36 4 L36 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="20" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <line x1="28" y1="4" x2="28" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <rect x="18" y="28" width="12" height="16" rx="0.5" stroke="currentColor" strokeWidth="2" />
        <circle cx="27" cy="36" r="1.5" fill="currentColor" />
      </svg>
    ),
    title: 'Endüstriyel & Özel Çözümler',
    subtitle: 'Mimari Proje Uygulamaları',
    desc: 'Hastane, okul, AVM ve konut projelerine özel tasarım alüminyum çözümler. Mühendislik ve tasarım hizmetleri.',
    tags: ['Hastane Doğraması', 'Yangın Kapısı', 'Özel Profil', 'Proje Danışmanlık'],
  },
]

export default function Services() {
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
    <section id="hizmetler" className="py-28 bg-alusight-900 relative overflow-hidden" ref={containerRef}>

      {/* Subtle top border glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Section header */}
        <div className="text-center mb-20 anim-init">
          <div className="section-subtitle mb-4">Hizmetlerimiz</div>
          <h2 className="font-display text-4xl md:text-5xl font-800 text-white mb-6">
            Uzmanlık Alanlarımız
          </h2>
          <div className="flex justify-center mb-6">
            <div className="gold-line" />
          </div>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-300">
            Alüminyum sektöründe geniş hizmet yelpazemiz ile mimari projelerinizde
            baştan sona çözüm ortağınızız.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`anim-init anim-delay-${(i % 3) + 1} card-dark group cursor-default p-8 relative overflow-hidden`}
            >
              {/* Gold corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-transparent border-r-gold-500/20" />
              </div>

              {/* Icon */}
              <div className="text-gold-500 mb-5 group-hover:scale-110 transition-transform duration-300">
                {s.icon}
              </div>

              {/* Title */}
              <h3 className="font-display text-xl font-700 text-white mb-1 group-hover:text-gold-400 transition-colors duration-300">
                {s.title}
              </h3>
              <div className="text-gold-500/70 text-xs font-display tracking-wider uppercase mb-4">
                {s.subtitle}
              </div>

              {/* Description */}
              <p className="text-white/50 text-sm leading-relaxed mb-5 font-300">
                {s.desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs text-white/40 border border-alusight-400/50 px-2.5 py-1 group-hover:border-gold-500/30 group-hover:text-white/60 transition-all duration-300"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Bottom glow line on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
