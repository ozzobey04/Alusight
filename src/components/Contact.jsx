import { useEffect, useRef } from 'react'

const contactItems = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: 'Telefon',
    lines: [
      '+90 535 861 0404',
    ],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'E-posta',
    lines: [
      'info@alusight.com',
      'teklif@alusight.com',
    ],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Çalışma Saatleri',
    lines: [
      'Pazartesi – Cuma: 08:00–16:00',
      'Cumartesi & Pazar: Kapalı',
    ],
  },
]

export default function Contact() {
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
    <section id="iletisim" className="py-28 bg-alusight-900 relative overflow-hidden" ref={containerRef}>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      <div className="absolute inset-0 hero-grid-bg opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="text-center mb-16 anim-init">
          <div className="section-subtitle mb-4">İletişim</div>
          <h2 className="font-display text-4xl md:text-5xl font-800 text-white mb-6">
            Bize Ulaşın
          </h2>
          <div className="flex justify-center">
            <div className="gold-line" />
          </div>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 anim-init mb-12">
          {contactItems.map((item) => (
            <div
              key={item.label}
              className="bg-alusight-700/40 border border-alusight-500/30 hover:border-gold-500/30 p-8 transition-all duration-300 group text-center"
            >
              <div className="w-14 h-14 border border-gold-500/20 bg-gold-500/5 flex items-center justify-center text-gold-500 mb-5 mx-auto group-hover:bg-gold-500/10 transition-colors duration-300">
                {item.icon}
              </div>
              <div className="text-gold-500/70 text-xs font-display tracking-widest uppercase mb-3">
                {item.label}
              </div>
              {item.lines.map((line, i) => (
                <div key={i} className="text-white/70 text-sm font-300 leading-relaxed">{line}</div>
              ))}
            </div>
          ))}
        </div>

        {/* Address + Map */}
        <div className="anim-init grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Address card */}
          <div className="bg-alusight-700/40 border border-alusight-500/30 hover:border-gold-500/30 transition-all duration-300 p-8 flex flex-col gap-6">

            {/* Adres */}
            <div className="flex gap-4">
              <div className="w-10 h-10 border border-gold-500/20 bg-gold-500/5 flex items-center justify-center text-gold-500 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <div className="text-gold-500/70 text-xs font-display tracking-widest uppercase mb-2">Adres</div>
                <div className="text-white/70 text-sm font-300 leading-relaxed">
                  İstanbul, Türkiye
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-alusight-500/30" />

            {/* Yol tarifi butonu */}
            <a
              href="https://www.google.com/maps/search/AluSight+Aluminyum+Istanbul"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group/link"
            >
              <div className="w-10 h-10 border border-gold-500/20 bg-gold-500/5 flex items-center justify-center text-gold-500 flex-shrink-0 group-hover/link:bg-gold-500/10 transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <div className="text-gold-500/70 text-xs font-display tracking-widest uppercase mb-0.5">Yol Tarifi</div>
                <div className="text-white/60 text-sm font-300 group-hover/link:text-white/90 transition-colors duration-200">
                  Google Maps'te Aç
                  <span className="inline-block ml-1 transition-transform duration-200 group-hover/link:translate-x-0.5">→</span>
                </div>
              </div>
            </a>

            {/* Divider */}
            <div className="h-px bg-alusight-500/30" />

            {/* WhatsApp konum */}
            <a
              href="https://wa.me/905358610404?text=Merhaba%2C%20konumunuzu%20öğrenmek%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group/wa"
            >
              <div className="w-10 h-10 border border-[#25D366]/20 bg-[#25D366]/5 flex items-center justify-center flex-shrink-0 group-hover/wa:bg-[#25D366]/10 transition-colors duration-300">
                <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div>
                <div className="text-[#25D366]/70 text-xs font-display tracking-widest uppercase mb-0.5">WhatsApp</div>
                <div className="text-white/60 text-sm font-300 group-hover/wa:text-white/90 transition-colors duration-200">
                  Konum için yazın
                </div>
              </div>
            </a>
          </div>

          {/* Google Maps iframe */}
          <div className="lg:col-span-2 relative overflow-hidden border border-alusight-500/30 min-h-[340px]">
            <iframe
              title="AluSight Konum"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96377.64509965704!2d28.872!3d41.0082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa4a39f8c6f5d%3A0x4a4b8f4e6c7d8e9f!2sAluSight%20Alüminyum!5e0!3m2!1str!2str!4v1710000000000!5m2!1str!2str"
              width="100%"
              height="100%"
              style={{ border: 0, position: 'absolute', inset: 0, filter: 'grayscale(0.2) contrast(1.05)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Gold overlay badge */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <div className="bg-alusight-900/90 border border-gold-500/30 backdrop-blur-sm px-4 py-2.5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                <div>
                  <div className="text-gold-500 text-xs font-display tracking-widest uppercase font-600">AluSight</div>
                  <div className="text-white/50 text-xs font-300 mt-0.5">İstanbul, Türkiye</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
